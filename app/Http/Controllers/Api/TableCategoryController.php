<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TableCategory;
use Illuminate\Http\Request;

class TableCategoryController extends Controller
{
    public function index()
    {
        return response()->json(TableCategory::all());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:255',
            'image' => 'nullable|string|max:255',
        ]);

        $category = TableCategory::create($data);
        return response()->json(['message' => 'Thêm loại bàn thành công', 'category' => $category], 201);
    }

    public function show($id)
    {
        return response()->json(TableCategory::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $category = TableCategory::findOrFail($id);
        $category->update($request->all());
        return response()->json(['message' => 'Cập nhật loại bàn thành công', 'category' => $category]);
    }

    public function destroy($id)
    {
        TableCategory::destroy($id);
        return response()->json(['message' => 'Xóa loại bàn thành công']);
    }
}
