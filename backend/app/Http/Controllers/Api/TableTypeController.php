<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TableType;
use Illuminate\Http\Request;

class TableTypeController extends Controller
{
    // Lấy danh sách loại bàn
    public function index()
    {
        return response()->json(TableType::all());
    }

    // Thêm loại bàn mới
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'capacity' => 'required|integer|min:1',
            'description' => 'nullable|string',
        ]);

        $type = TableType::create($validated);
        return response()->json([
            'message' => 'Thêm loại bàn thành công',
            'data' => $type
        ]);
    }

    // Sửa loại bàn
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'capacity' => 'required|integer|min:1',
            'description' => 'nullable|string',
        ]);

        $type = TableType::findOrFail($id);
        $type->update($validated);

        return response()->json([
            'message' => 'Cập nhật loại bàn thành công',
            'data' => $type
        ]);
    }

    // Xóa loại bàn
    public function destroy($id)
    {
        $type = TableType::findOrFail($id);
        $type->delete();

        return response()->json(['message' => 'Đã xóa loại bàn']);
    }
}

