<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // Lấy tất cả
    public function index()
    {
        return response()->json(Category::all());
    }

    // Thêm mới
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
        ]);

        $category = Category::create($data);

        return response()->json([
            'message' => 'Thêm danh mục thành công!',
            'data' => $category
        ], 201);
    }

    // Xem chi tiết
    public function show($id)
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json(['message' => 'Không tìm thấy danh mục!'], 404);
        }
        return response()->json($category);
    }

    // Cập nhật
    public function update(Request $request, $id)
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json(['message' => 'Không tìm thấy danh mục!'], 404);
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
        ]);

        $category->update($data);

        return response()->json([
            'message' => 'Cập nhật danh mục thành công!',
            'data' => $category
        ]);
    }

    // Xóa
    public function destroy($id)
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json(['message' => 'Không tìm thấy danh mục!'], 404);
        }

        $category->delete();

        return response()->json(['message' => 'Xóa danh mục thành công!']);
    }
}
