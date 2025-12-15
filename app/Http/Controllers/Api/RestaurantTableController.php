<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RestaurantTable;
use Illuminate\Http\Request;

class RestaurantTableController extends Controller
{
    // Lấy danh sách bàn
    public function index()
    {
        return response()->json([
            'data' => RestaurantTable::all()
        ]);
    }

    // Tạo bàn
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100|unique:restaurant_tables,name',
            'capacity' => 'required|integer|min:1',
            'status' => 'nullable|in:available,occupied,reserved',
        ], [
            'name.required' => 'Vui lòng nhập tên bàn',
            'name.unique' => 'Tên bàn đã tồn tại, vui lòng chọn tên khác',
            'capacity.required' => 'Vui lòng nhập sức chứa',
            'capacity.min' => 'Sức chứa phải lớn hơn 0',
        ]);

        $data['status'] = $data['status'] ?? 'available';

        $table = RestaurantTable::create($data);

        return response()->json([
            'message' => 'Tạo bàn thành công',
            'data' => $table
        ], 201);
    }

    // Xem bàn
    public function show($id)
    {
        $table = RestaurantTable::findOrFail($id);
        
        // Lấy số đơn hàng trong ngày
        $ordersToday = \App\Models\Order::where('table_id', $id)
            ->whereDate('booking_date', today())
            ->whereIn('status', [0, 1])
            ->count();
        
        // Lấy danh sách đơn hàng đang hoạt động
        $activeOrders = \App\Models\Order::where('table_id', $id)
            ->whereIn('status', [0, 1])
            ->with(['details.dish'])
            ->orderByDesc('id')
            ->get();
        
        return response()->json([
            'data' => $table,
            'orders_today' => $ordersToday,
            'active_orders' => $activeOrders
        ]);
    }

    // Cập nhật bàn
    public function update(Request $request, $id)
    {
        $table = RestaurantTable::findOrFail($id);

        $data = $request->validate([
            'name' => 'nullable|string|max:100|unique:restaurant_tables,name,' . $id,
            'capacity' => 'nullable|integer|min:1',
            'status' => 'nullable|in:available,occupied,reserved',
        ], [
            'name.unique' => 'Tên bàn đã tồn tại, vui lòng chọn tên khác',
            'capacity.min' => 'Sức chứa phải lớn hơn 0',
        ]);

        $table->update($data);

        return response()->json([
            'message' => 'Cập nhật bàn thành công',
            'data' => $table
        ]);
    }

    // Xóa bàn
    public function destroy($id)
    {
        $table = RestaurantTable::findOrFail($id);
        
        // Kiểm tra xem có đơn hàng nào đang gắn với bàn này không
        $activeOrders = \App\Models\Order::where('table_id', $id)
            ->whereIn('status', [0, 1]) // Chờ xác nhận hoặc Đã xác nhận
            ->count();
        
        if ($activeOrders > 0) {
            return response()->json([
                'message' => "Không thể xóa bàn \"{$table->name}\" vì đang có {$activeOrders} đơn hàng chưa hoàn thành"
            ], 400);
        }
        
        $table->delete();

        return response()->json([
            'message' => 'Xóa bàn thành công'
        ]);
    }
}
