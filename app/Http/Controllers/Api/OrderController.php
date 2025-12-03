<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\OrderHistory;
use App\Models\Dish;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index()
    {
        return response()->json(
            Order::with(['branch', 'table', 'user', 'details.dish'])
                ->orderBy('id', 'desc')
                ->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'table_id' => 'required|exists:restaurant_tables,id',
            'user_id'  => 'required|exists:users,id',
            'items'    => 'required|array|min:1',
            'items.*.dish_id' => 'required|exists:dishes,id',
            'items.*.quantity' => 'required|integer|min:1',
            'note' => 'nullable|string'
        ]);

        DB::beginTransaction();
        try {
            // 1. Tạo đơn
            $order = Order::create([
                'branch_id' => $data['branch_id'],
                'table_id'  => $data['table_id'],
                'user_id'   => $data['user_id'],
                'status'    => 0, // pending
                'total_price' => 0
            ]);

            $total = 0;

            // 2. Tạo các món (OrderDetail)
            foreach ($data['items'] as $item) {
                $dish = Dish::find($item['dish_id']);

                $lineTotal = $dish->price * $item['quantity'];
                $total += $lineTotal;

                OrderDetail::create([
                    'order_id' => $order->id,
                    'dish_id' => $dish->id,
                    'quantity' => $item['quantity'],
                    'price' => $dish->price,
                    'note' => $data['note'] ?? null
                ]);
            }

            // 3. Cập nhật tổng tiền
            $order->update(['total_price' => $total]);

            // 4. Ghi lịch sử
            OrderHistory::create([
                'order_id' => $order->id,
                'action_status' => 0,
                'old_value' => null,
                'new_value' => 'pending',
                'changed_by' => $order->user_id
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Tạo đơn hàng thành công!',
                'data' => $order->load('details.dish')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Lỗi khi tạo đơn hàng!',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $order = Order::with(['details.dish', 'user'])->find($id);
        if (!$order) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng!'], 404);
        }
        return response()->json($order);
    }

    public function update(Request $request, $id)
    {
        $order = Order::find($id);
        if (!$order) return response()->json(['message' => 'Không tìm thấy đơn hàng!'], 404);

        $data = $request->validate([
            'status' => 'integer|in:0,1,2,3',
        ]);

        // lưu lịch sử
        OrderHistory::create([
            'order_id' => $order->id,
            'action_status' => $data['status'],
            'old_value' => $order->status,
            'new_value' => $data['status'],
            'changed_by' => auth()->id() ?? null
        ]);

        $order->update($data);

        return response()->json([
            'message' => 'Cập nhật đơn hàng thành công!',
            'data' => $order
        ]);
    }

    public function destroy($id)
    {
        $order = Order::find($id);
        if (!$order) return response()->json(['message' => 'Không tìm thấy đơn hàng!'], 404);

        $order->delete();
        return response()->json(['message' => 'Xóa đơn hàng thành công!']);
    }
}
