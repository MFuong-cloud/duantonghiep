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

            OrderHistory::create([
                'order_id'      => $order->id,
                'action_status' => 2,
                'old_value'     => (string)$oldStatus,
                'new_value'     => '2',
                'changed_by'    => $user->id,
                'created_by'    => $user->id,
            ]);

            DB::commit();

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

        $payments = Payment::with(['user', 'order'])
            ->orderByDesc('created_at')
            ->get();
            
        return response()->json(['data' => $payments], 200);
    }
}
