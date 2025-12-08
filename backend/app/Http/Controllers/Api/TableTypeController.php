<?php

namespace App\Http\Controllers;

use App\Models\TableType;
use Illuminate\Http\Request;

class TableTypeController extends Controller
{
    // Lấy danh sách loại bàn
    public function index()
    {
        return response()->json(TableType::all());
    }

    // Lấy chi tiết 1 loại bàn
    public function show($id)
    {
        $data = TableType::find($id);
        if (!$data) {
            return response()->json(['message' => 'Not found'], 404);
        }
        return response()->json($data);
    }

    // Thêm loại bàn
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'capacity' => 'required|integer|min=1',
            'description' => 'nullable|string'
        ]);

        $data = TableType::create($request->all());

        return response()->json([
            'message' => 'Created successfully',
            'data' => $data
        ]);
    }

    // Cập nhật loại bàn
    public function update(Request $request, $id)
    {
        $data = TableType::find($id);
        if (!$data) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $request->validate([
            'name' => 'sometimes|string',
            'capacity' => 'sometimes|integer|min=1',
            'description' => 'nullable|string'
        ]);

        $data->update($request->all());

        return response()->json([
            'message' => 'Updated successfully',
            'data' => $data
        ]);
    }

    // Xóa loại bàn
    public function destroy($id)
    {
        $data = TableType::find($id);
        if (!$data) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $data->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
