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
            'name' => 'required|string|max:100',
            'capacity' => 'required|integer|min:1',
            'status' => 'nullable|in:available,occupied',
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
        return response()->json([
            'data' => RestaurantTable::findOrFail($id)
        ]);
    }

    // Cập nhật bàn
    public function update(Request $request, $id)
    {
        $table = RestaurantTable::findOrFail($id);

        $data = $request->validate([
            'name' => 'nullable|string|max:100',
            'capacity' => 'nullable|integer|min:1',
            'status' => 'nullable|in:available,occupied',
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
        RestaurantTable::destroy($id);

        return response()->json([
            'message' => 'Xóa bàn thành công'
        ]);
    }
}
