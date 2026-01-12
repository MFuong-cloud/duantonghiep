<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Payment;
use App\Models\OrderHistory;
use Illuminate\Support\Facades\DB;


class PaymentController extends Controller
{
    public function fakePayment(Request $request)
    {
        if (!auth()->check()) {
            return response()->json([
                'message' => 'Unauthenticated'
            ], 401);
        }

        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'method'   => 'required|in:cash',
        ]);

        $user = auth()->user();

        DB::beginTransaction();
        try {

            $order = Order::where('id', $request->order_id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($order->status == 2) {
                return response()->json([
                    'message' => 'Đơn hàng đã được thanh toán'
                ], 400);
            }

            Payment::create([
                'user_id'  => $user->id,
                'order_id' => $order->id,
                'amount'   => $order->total_price,
                'method'   => $request->method,
                'status'   => 'success',
                'transaction_code' => 'CASH_' . time(),
                'paid_at'  => now(),
            ]);

            $oldStatus = $order->status;
            $order->update([
                'status' => 2
            ]);

            // Giải phóng bàn khi hoàn thành
            if ($order->table_id) {
                $table = \App\Models\RestaurantTable::find($order->table_id);
                if ($table) {
                    $table->status = 'available';
                    $table->save();
                }
            }

            OrderHistory::create([
                'order_id'      => $order->id,
                'action_status' => 2,
                'old_value'     => (string)$oldStatus,
                'new_value'     => '2',
                'changed_by'    => $user->id,
                'created_by'    => $user->id,
            ]);

            DB::commit();

            $order->load(['details.dish', 'table', 'user']);

            // Broadcast to Socket.IO server for real-time updates
            try {
                $socketUrl = env('SOCKET_IO_SERVER_URL', 'http://localhost:3001');
                Http::post($socketUrl . '/api/broadcast', [
                    'event' => 'order:updated',
                    'data' => [
                        'id' => $order->id,
                        'code' => $order->code,
                        'status' => 2, // Hoàn thành
                        'user_id' => $order->user_id,
                        'booking_date' => $order->booking_date,
                        'booking_time' => $order->booking_time,
                    ]
                ]);
            } catch (\Exception $socketError) {
                // Log error but don't fail the request
                \Log::warning('Failed to broadcast payment completion to Socket.IO: ' . $socketError->getMessage());
            }

            if ($order->user && $order->user->email) {
                try {
                    \Mail::to($order->user->email)->send(new \App\Mail\PaymentSuccessMail($order, 'Tiền mặt'));
                } catch (\Exception $mailError) {
                    \Log::error('Failed to send payment success email: ' . $mailError->getMessage());
                }
            }

            return response()->json([
                'message' => 'Thanh toán thành công',
                'order_id' => $order->id,
                'status' => 2
            ]);

        } catch (\Throwable $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Thanh toán thất bại',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function index()
    {

        $payments = Payment::with(['user', 'order.table', 'order.details.dish'])
            ->orderByDesc('created_at')
            ->get();
            
        return response()->json(['data' => $payments], 200);
    }
}
