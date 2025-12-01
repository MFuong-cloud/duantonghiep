<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OrderDetail;
use Illuminate\Http\Request;

class OrderDetailController extends Controller
{
    public function index()
    {
        $details = OrderDetail::with(['order', 'dish'])->get();
        return response()->json($details);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'dish_id' => 'required|exists:dishes,id',
            'quantity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'note' => 'nullable|string|max:500',
        ]);

        $detail = OrderDetail::create($data);
        return response()->json([
            'message' => 'Thêm chi tiết đơn hàng thành công!',
            'data' => $detail
        ], 201);
    }

    public function show($id)
    {
        $detail = OrderDetail::with(['order', 'dish'])->find($id);
        if (!$detail) {
            return response()->json(['message' => 'Không tìm thấy chi tiết đơn hàng!'], 404);
        }
        return response()->json($detail);
    }

    public function update(Request $request, $id)
    {
        $detail = OrderDetail::find($id);
        if (!$detail) {
            return response()->json(['message' => 'Không tìm thấy chi tiết đơn hàng!'], 404);
        }

        $data = $request->validate([
            'quantity' => 'sometimes|integer|min:1',
            'price' => 'sometimes|numeric|min:0',
            'note' => 'nullable|string|max:500',
        ]);

        $detail->update($data);
        return response()->json([
            'message' => 'Cập nhật chi tiết đơn hàng thành công!',
            'data' => $detail
        ]);
    }

    public function destroy($id)
    {
        $detail = OrderDetail::find($id);
        if (!$detail) {
            return response()->json(['message' => 'Không tìm thấy chi tiết đơn hàng!'], 404);
        }

        $detail->delete();
        return response()->json(['message' => 'Xóa chi tiết đơn hàng thành công!']);
    }
}
