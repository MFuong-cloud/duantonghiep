<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        // return response()->json(Order::with(['branch', 'table', 'user', 'details'])->get());
        return response()->json(Order::all());

    }
    


   public function store(Request $request)
{
    $data = $request->validate([
        'booking_id'       => 'required|exists:bookings,id',
        'user_id'          => 'required|exists:users,id',
        'menu_id'          => 'required|exists:menus,id',
        'quantity'         => 'required|integer|min:1',
        'special_request'  => 'nullable|string|max:255',
        'status'           => 'nullable', // 0: chờ, 1: đang làm, 2: hoàn thành, 3: hủy (ví dụ)
    ]);

    // $orderDetail = OrderDetail::create($data);
    $addOrder = Order::create($data);
    return response()->json([
        'message' => 'Tạo đơn hàng thành công!',
        'data'    => $orderDetail
    ], 201);
}


    public function show($id)
    {       
        $order = Order::with(['user'])->find($id);
        if (!$order) return response()->json(['message' => 'Không tìm thấy đơn hàng!'], 404);
        return response()->json($order);
        
    }

    public function update(Request $request, $id)
    {
        $order = Order::find($id);
        if (!$order) return response()->json(['message' => 'Không tìm thấy đơn hàng!'], 404);

         $data = $request->validate([
        'booking_id'       => 'required|exists:bookings,id',
        'user_id'          => 'required|exists:users,id',
        'menu_id'          => 'required|exists:menus,id',
        'quantity'         => 'required|integer|min:1',
        'special_request'  => 'nullable|string|max:255',
        'status'           => 'nullable', // 0: chờ, 1: đang làm, 2: hoàn thành, 3: hủy (ví dụ)
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
