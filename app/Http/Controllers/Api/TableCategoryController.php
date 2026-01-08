<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TableCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TableCategoryController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => true,
            'message' => 'Lấy danh sách loại bàn thành công',
            'data' => TableCategory::all(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'   => 'required|string|max:100',
            'status' => 'nullable|integer|in:0,1',
            'image'  => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('table_categories', 'public');
        }

        $category = TableCategory::create($data);

        return response()->json([
            'status' => true,
            'message' => 'Thêm loại bàn thành công',
            'data' => $category,
        ], 201);
    }

    public function show($id)
    {
        $category = TableCategory::find($id);

        if (!$category) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy loại bàn',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $category,
        ]);
    }

    public function update(Request $request, $id)
    {
        $category = TableCategory::find($id);

        if (!$category) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy loại bàn',
            ], 404);
        }

        $data = $request->validate([
            'name'   => 'sometimes|string|max:100',
            'status' => 'nullable|integer|in:0,1',
            'image'  => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {

            if ($category->image && Storage::disk('public')->exists($category->image)) {
                Storage::disk('public')->delete($category->image);
            }

            $data['image'] = $request->file('image')->store('table_categories', 'public');
        }

        $category->update($data);

        return response()->json([
            'status' => true,
            'message' => 'Cập nhật loại bàn thành công',
            'data' => $category,
        ]);
    }

    public function destroy($id)
    {
        $category = TableCategory::find($id);

        if (!$category) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy loại bàn',
            ], 404);
        }

        if ($category->image && Storage::disk('public')->exists($category->image)) {
            Storage::disk('public')->delete($category->image);
        }

        $category->delete();

        return response()->json([
            'status' => true,
            'message' => 'Xóa loại bàn thành công',
        ]);
    }
}
