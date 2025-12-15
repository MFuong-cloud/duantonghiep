<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    // Lấy tất cả danh mục
    public function index()
    {
        return response()->json(Category::all());
    }

    // Thêm mới
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'status'      => 'required|in:0,1,true,false',
            'image'       => 'nullable|file|mimes:jpg,jpeg,png,webp|max:51200',
        ]);

        // Convert status sang boolean - xử lý cả string "0" và "1"
        $data['status'] = in_array($data['status'], ['1', 1, 'true', true], true);

        // Xử lý ảnh
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('categories', 'public');
        }

        $category = Category::create($data);

        return response()->json([
            'message' => 'Thêm danh mục thành công!',
            'data'    => $category
        ], 201);
    }

    // Lấy chi tiết
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
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'status'      => 'required|in:0,1,true,false',
            'image'       => 'nullable|file|mimes:jpg,jpeg,png,webp|max:51200',
        ]);

        // Convert status sang boolean - xử lý cả string "0" và "1"
        $newStatus = in_array($data['status'], ['1', 1, 'true', true], true);
        $data['status'] = $newStatus;

        // Nếu cập nhật ảnh mới thì xóa ảnh cũ
        if ($request->hasFile('image')) {
            if ($category->image) {
                Storage::disk('public')->delete($category->image);
            }

            $data['image'] = $request->file('image')->store('categories', 'public');
        }

        $category->update($data);

        // Nếu tắt danh mục (status = false), tắt tất cả món ăn thuộc danh mục này
        if ($newStatus === false) {
            $affectedDishes = $category->dishes()->where('status', true)->count();
            $category->dishes()->update(['status' => false]);
            
            $message = 'Cập nhật danh mục thành công!';
            if ($affectedDishes > 0) {
                $message .= " Đã tắt {$affectedDishes} món ăn thuộc danh mục này.";
            }
        } else {
            $message = 'Cập nhật danh mục thành công!';
        }

        return response()->json([
            'message' => $message,
            'data'    => $category->load('dishes')
        ]);
    }


    // Xóa danh mục
    public function destroy($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['message' => 'Không tìm thấy danh mục!'], 404);
        }



        $category->delete();

        return response()->json(['message' => 'Xóa danh mục thành công!']);
    }


    // ==========================================
    // TRASH FUNCTIONS
    // ==========================================

    public function trash()
    {
        return response()->json(Category::onlyTrashed()->get());
    }

    public function restore($id)
    {
        $category = Category::onlyTrashed()->findOrFail($id);
        $category->restore();

        return response()->json([
            'message' => "Khôi phục danh mục \"{$category->name}\" thành công",
            'data'    => $category
        ]);
    }

    public function forceDelete($id)
    {
        $category = Category::onlyTrashed()->findOrFail($id);

        if ($category->image) {
            Storage::disk('public')->delete($category->image);
        }

        $category->forceDelete();

        return response()->json([
            'message' => "Xóa vĩnh viễn danh mục \"{$category->name}\" thành công"
        ]);
    }
}
