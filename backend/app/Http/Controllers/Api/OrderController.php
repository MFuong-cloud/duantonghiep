<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        return response()->json(Order::with(['branch', 'table', 'user', 'details'])->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'table_id' => 'required|exists:restaurant_tables,id',
            'user_id' => 'required|exists:users,id',
            'total_price' => 'nullable|numeric|min:0',
            'status' => 'integer|in:0,1,2,3',
        ]);

        $order = Order::create($data);
        return response()->json(['message' => 'Tạo đơn hàng thành công!', 'data' => $order], 201);
    }

    public function show($id)
    {
        $order = Order::with(['details.dish', 'user'])->find($id);
        if (!$order) return response()->json(['message' => 'Không tìm thấy đơn hàng!'], 404);
        return response()->json($order);
    }

    public function update(Request $request, $id)
    {
        $order = Order::find($id);
        if (!$order) return response()->json(['message' => 'Không tìm thấy đơn hàng!'], 404);

        $data = $request->validate([
            'status' => 'integer|in:0,1,2,3',
            'total_price' => 'nullable|numeric|min:0',
        ]);

        $order->update($data);
        return response()->json(['message' => 'Cập nhật đơn hàng thành công!', 'data' => $order]);
    }

    public function destroy($id)
    {
        $order = Order::find($id);
        if (!$order) return response()->json(['message' => 'Không tìm thấy đơn hàng!'], 404);
        $order->delete();
        return response()->json(['message' => 'Xóa đơn hàng thành công!']);
    }
}
