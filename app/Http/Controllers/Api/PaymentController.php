<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Payment;
use App\Models\OrderHistory;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PaymentController extends Controller
{
    public function fakePayment(Request $request)
    {
        // 0️⃣ Bắt buộc phải login
        if (!auth()->check()) {
            return response()->json([
                'message' => 'Unauthenticated'
            ], 401);
        }

        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'method'   => 'required|in:momo,vnpay,cash',
        ]);

        $user = auth()->user();

        DB::beginTransaction();
        try {

            // 1️⃣ Lock order để tránh double payment
            $order = Order::where('id', $request->order_id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($order->status === 'paid') {
                return response()->json([
                    'message' => 'Đơn hàng đã được thanh toán'
                ], 400);
            }

            // 2️⃣ Tạo payment giả
            Payment::create([
                'user_id'  => $user->id,
                'order_id' => $order->id,
                'amount'   => $order->total_price,
                'method'   => $request->method,
                'status'   => 'success',
                'paid_at'  => now(),
            ]);

            // 3️⃣ Update order
            $oldStatus = $order->status;
            $order->update([
                'status' => 'paid'
            ]);

            // 4️⃣ Lưu lịch sử
            OrderHistory::create([
                'order_id'   => $order->id,
                'status'     => 'paid', // an toàn hơn action_status
                'note'       => 'Thanh toán giả qua ' . strtoupper($request->method),
                'created_by' => $user->id,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Thanh toán giả thành công',
                'order_id' => $order->id,
                'status' => 'paid'
            ]);

        } catch (\Throwable $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Thanh toán thất bại',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
