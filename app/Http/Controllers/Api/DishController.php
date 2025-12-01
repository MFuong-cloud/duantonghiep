<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dish;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DishController extends Controller
{
    public function index()
    {
        return response()->json(Dish::with('category')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'category_id' => 'required|integer|exists:categories,id',
            'name'        => 'required|string|max:255|unique:dishes,name',
            'price'       => 'required|numeric|min:0|max:100000000',
            'description' => 'nullable|string|max:1000',
            'status'      => 'required|boolean',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        // Upload file
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('dishes', 'public');
        }

        $dish = Dish::create($data);

        return response()->json([
            'message' => 'Thêm món ăn thành công!',
            'data' => $dish
        ], 201);
    }

    public function show($id)
    {
        $dish = Dish::with('category')->find($id);
        if (!$dish) return response()->json(['message' => 'Không tìm thấy món ăn!'], 404);

        if ($dish->category && !$dish->category->status) {
            return response()->json(['message' => 'Danh mục của món ăn này đang bị tắt, không thể xem chi tiết!'], 403);
        }

        return response()->json($dish);
    }

    public function update(Request $request, $id)
    {
        $dish = Dish::find($id);
        if (!$dish) return response()->json(['message' => 'Không tìm thấy món ăn!'], 404);

        if ($dish->category && !$dish->category->status) {
            return response()->json(['message' => 'Danh mục của món ăn này đang bị tắt, không thể cập nhật!'], 403);
        }

        $data = $request->validate([
            'category_id' => 'sometimes|required|integer|exists:categories,id',
            'name'        => 'sometimes|required|string|max:255|unique:dishes,name,' . $id,
            'price'       => 'sometimes|required|numeric|min:0|max:100000000',
            'description' => 'nullable|string|max:1000',
            'status'      => 'sometimes|required|boolean',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        // Update image
        if ($request->hasFile('image')) {
            if ($dish->image && Storage::disk('public')->exists($dish->image)) {
                Storage::disk('public')->delete($dish->image);
            }
            $data['image'] = $request->file('image')->store('dishes', 'public');
        }

        $dish->update($data);

        return response()->json([
            'message' => 'Cập nhật món ăn thành công!',
            'data' => $dish
        ]);
    }

    public function destroy($id)
    {
        $dish = Dish::find($id);
        if (!$dish) return response()->json(['message' => 'Không tìm thấy món ăn!'], 404);

        if ($dish->category && !$dish->category->status) {
            return response()->json(['message' => 'Danh mục của món ăn này đang bị tắt, không thể xóa!'], 403);
        }

        // Xóa ảnh luôn
        if ($dish->image && Storage::disk('public')->exists($dish->image)) {
            Storage::disk('public')->delete($dish->image);
        }

        $dish->delete();

        return response()->json(['message' => 'Xóa món ăn thành công!']);
    }
}
