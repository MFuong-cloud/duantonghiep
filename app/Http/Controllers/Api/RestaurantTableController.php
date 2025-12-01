<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RestaurantTable;
use Illuminate\Http\Request;

class RestaurantTableController extends Controller
{
    public function index()
    {
        $tables = RestaurantTable::with(['branch', 'category'])->get();
        return response()->json($tables);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'category_id' => 'nullable|exists:table_categories,id',
            'table_number' => 'required|string|max:50',
            'status' => 'nullable|integer|in:0,1,2',
        ]);

        $table = RestaurantTable::create($data);
        return response()->json(['message' => 'Thêm bàn thành công', 'table' => $table], 201);
    }

    public function show($id)
    {
        $table = RestaurantTable::with(['branch', 'category'])->findOrFail($id);
        return response()->json($table);
    }

    public function update(Request $request, $id)
    {
        $table = RestaurantTable::findOrFail($id);
        $table->update($request->all());
        return response()->json(['message' => 'Cập nhật bàn thành công', 'table' => $table]);
    }

    public function destroy($id)
    {
        RestaurantTable::destroy($id);
        return response()->json(['message' => 'Xóa bàn thành công']);
    }
}
