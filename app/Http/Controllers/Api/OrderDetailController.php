<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\OrderDetail;
use App\Models\Order;
use App\Models\Dish;
use Illuminate\Support\Facades\DB;

class OrderDetailController extends Controller
{
    /** Lấy toàn bộ chi tiết đơn */
    public function index()
    {
        $details = OrderDetail::with(['order.user', 'dish'])
            ->orderByDesc('id')
            ->get();

        return response()->json(['data' => $details], 200);
    }

    /** Thêm 1 chi tiết đơn */
    public function store(Request $request)
    {
        $data = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'dish_id' => 'required|exists:dishes,id',
            'quantity' => 'required|integer|min:1',
            'price' => 'nullable|numeric|min:0',
            'note' => 'nullable|string|max:500',
            'status' => 'nullable|integer|min:0|max:5'
        ]);

        DB::beginTransaction();
        try {

            $dish = Dish::find($data['dish_id']);
            $price = $data['price'] ?? $dish->price;

            $detail = OrderDetail::create([
                'order_id'  => $data['order_id'],
                'dish_id'   => $data['dish_id'],
                'quantity'  => $data['quantity'],
                'price'     => $price,
                'note'      => $data['note'] ?? null,
                'status'    => $data['status'] ?? 0,
                'created_by' => auth()->id() ?? null,
            ]);

            $this->updateOrderTotal($data['order_id']);

            DB::commit();
            return response()->json([
                'message' => 'Thêm chi tiết thành công',
                'data'    => $detail->load('dish'),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Lỗi khi thêm chi tiết',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /** Xem chi tiết theo ID */
    public function show($id)
    {
        $detail = OrderDetail::with(['order.user', 'dish'])->find($id);

        if (!$detail)
            return response()->json(['message' => 'Không tìm thấy chi tiết'], 404);

        return response()->json(['data' => $detail], 200);
    }

    /** Cập nhật chi tiết */
    public function update(Request $request, $id)
    {
        $detail = OrderDetail::find($id);
        if (!$detail)
            return response()->json(['message' => 'Không tìm thấy chi tiết'], 404);

        $data = $request->validate([
            'quantity' => 'sometimes|integer|min:1',
            'price'    => 'sometimes|numeric|min:0',
            'note'     => 'nullable|string|max:500',
            'status'   => 'nullable|integer|min:0|max:5',
        ]);

        DB::beginTransaction();
        try {

            $detail->update(array_merge($data, [
                'updated_by' => auth()->id() ?? null
            ]));

            $this->updateOrderTotal($detail->order_id);

            DB::commit();
            return response()->json([
                'message' => 'Cập nhật thành công',
                'data'    => $detail->fresh()->load('dish'),
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Lỗi khi cập nhật',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /** Xóa chi tiết */
    public function destroy($id)
    {
        $detail = OrderDetail::find($id);
        if (!$detail)
            return response()->json(['message' => 'Không tìm thấy chi tiết'], 404);

        $orderId = $detail->order_id;

        DB::beginTransaction();
        try {

            $detail->delete();

            $this->updateOrderTotal($orderId);

            DB::commit();
            return response()->json(['message' => 'Xóa chi tiết thành công'], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Lỗi khi xóa',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /** Hàm tính tổng tiền */
    private function updateOrderTotal($orderId)
    {
        $total = OrderDetail::where('order_id', $orderId)
            ->selectRaw('COALESCE(SUM(price * quantity), 0) AS total')
            ->value('total');

        $order = Order::find($orderId);
        if ($order) {
            $order->update(['total_price' => $total]);
        }
    }
}
