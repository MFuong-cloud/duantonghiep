<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\OrderHistory;
use App\Models\Dish;

class OrderController extends Controller
{
    // ============================================================
    // LẤY DS ĐƠN HÀNG
    // ============================================================
    public function index()
    {
        $orders = Order::with(['user', 'details.dish', 'history.user'])
            ->orderByDesc('id')
            ->get();

        return response()->json(['data' => $orders], 200);
    }

    // ============================================================
    // TẠO ĐƠN HÀNG
    // ============================================================
    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'nullable|exists:users,id',

            'ho_ten' => 'required|string|max:50',
            'phone' => 'required|string|max:15',
            'booking_date' => 'required|date',
            'booking_time' => 'required|integer',
            'quantity' => 'required|integer|min:1',
            'note' => 'nullable|string',

            'items' => 'required|array|min:1',
            'items.*.dish_id' => 'required|exists:dishes,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.note' => 'nullable|string|max:500',
        ]);

        DB::beginTransaction();

        try {
            // tạo đơn hàng
            $order = Order::create([
                'user_id' => $data['user_id'] ?? null,
                'ho_ten' => $data['ho_ten'],
                'phone' => $data['phone'],
                'booking_date' => $data['booking_date'],
                'booking_time' => $data['booking_time'],
                'quantity' => $data['quantity'],
                'note' => $data['note'] ?? null,
                'total_price' => 0,
                'status' => 0, // pending
                'created_by' => auth()->id(),
            ]);

            $total = 0;

            foreach ($data['items'] as $item) {

                $dish = Dish::find($item['dish_id']);
                if (!$dish) {
                    throw new \Exception("Món ID {$item['dish_id']} không tồn tại");
                }

                $lineTotal = $dish->price * $item['quantity'];
                $total += $lineTotal;

                OrderDetail::create([
                    'order_id' => $order->id,
                    'dish_id' => $dish->id,
                    'quantity' => $item['quantity'],
                    'price' => $dish->price,
                    'note' => $item['note'] ?? null,
                    'status' => 0,
                    'created_by' => auth()->id(),
                ]);
            }

            // update tổng tiền
            $order->update([
                'total_price' => $total
            ]);

            // ghi lịch sử
            OrderHistory::create([
                'order_id' => $order->id,
                'action_status' => 0, // pending
                'old_value' => null,
                'new_value' => 'created',
                'changed_by' => auth()->id(),
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Tạo đơn hàng thành công',
                'data' => $order->load('details.dish', 'user', 'history.user'),
            ], 201);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'message' => 'Lỗi khi tạo đơn hàng',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // ============================================================
    // XEM CHI TIẾT ĐƠN HÀNG
    // ============================================================
    public function show($id)
    {
        $order = Order::with(['user', 'details.dish', 'history.user'])->find($id);

        if (!$order) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng'], 404);
        }

        return response()->json(['data' => $order], 200);
    }

    // ============================================================
    // CẬP NHẬT ĐƠN HÀNG (status + note)
    // ============================================================
    public function update(Request $request, $id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng'], 404);
        }

        $data = $request->validate([
            'status' => 'nullable|integer|in:0,1,2,3',
            'note' => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {
            if (array_key_exists('status', $data) && $data['status'] != $order->status) {
                OrderHistory::create([
                    'order_id' => $order->id,
                    'action_status' => 1,
                    'old_value' => $order->status,
                    'new_value' => $data['status'],
                    'changed_by' => auth()->id(),
                ]);
            }

            $data['updated_by'] = auth()->id();
            $order->update($data);

            DB::commit();

            return response()->json([
                'message' => 'Cập nhật đơn hàng thành công',
                'data' => $order->fresh()->load('details.dish', 'history.user'),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Lỗi khi cập nhật đơn hàng',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // ============================================================
    // XÓA ĐƠN HÀNG
    // ============================================================
    public function destroy($id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng'], 404);
        }

        DB::beginTransaction();

        try {
            OrderHistory::create([
                'order_id' => $order->id,
                'action_status' => 3,
                'old_value' => $order->status,
                'new_value' => 'deleted',
                'changed_by' => auth()->id(),
            ]);

            $order->delete();

            DB::commit();

            return response()->json(['message' => 'Xóa đơn hàng thành công']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Lỗi khi xóa đơn hàng',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
