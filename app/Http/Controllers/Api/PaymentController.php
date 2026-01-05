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
            'method'   => 'required|in:momo,cash',
        ]);

        $user = auth()->user();

        DB::beginTransaction();
        try {

            // 1️⃣ Lock order để tránh double payment
            $order = Order::where('id', $request->order_id)
                ->lockForUpdate()
                ->firstOrFail();

            // Kiểm tra đơn đã thanh toán chưa (status = 2 là Hoàn thành)
            if ($order->status == 2) {
                return response()->json([
                    'message' => 'Đơn hàng đã được thanh toán'
                ], 400);
            }

            // 2️⃣ Tạo payment
            Payment::create([
                'user_id'  => $user->id,
                'order_id' => $order->id,
                'amount'   => $order->total_price,
                'method'   => $request->method,
                'status'   => 'success',
                'paid_at'  => now(),
            ]);

            // 3️⃣ Update order status = 2 (Hoàn thành)
            $oldStatus = $order->status;
            $order->update([
                'status' => 2  // 2 = Hoàn thành
            ]);

            // 4️⃣ Lưu lịch sử
            OrderHistory::create([
                'order_id'      => $order->id,
                'action_status' => 2,  // 2 = Hoàn thành
                'old_value'     => (string)$oldStatus,
                'new_value'     => '2',
                'changed_by'    => $user->id,
                'created_by'    => $user->id,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Thanh toán thành công',
                'order_id' => $order->id,
                'status' => 2  // 2 = Hoàn thành
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
