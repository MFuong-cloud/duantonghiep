<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dish;
use Illuminate\Http\Request;

class DishController extends Controller
{
    public function index()
    {
        return response()->json(Dish::with('category')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'category_id' => 'nullable|exists:categories,id',
            'name' => 'required|string|max:255',
            'type' => 'required|integer|in:0,1,2',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'image_url' => 'nullable|string|max:500',
            'is_active' => 'boolean',
        ]);

        $dish = Dish::create($data);
        return response()->json(['message' => 'Thêm món ăn thành công!', 'data' => $dish], 201);
    }

    public function show($id)
    {
        $dish = Dish::with('category')->find($id);
        if (!$dish) return response()->json(['message' => 'Không tìm thấy món ăn!'], 404);
        return response()->json($dish);
    }

    public function update(Request $request, $id)
    {
        $dish = Dish::find($id);
        if (!$dish) return response()->json(['message' => 'Không tìm thấy món ăn!'], 404);

        $data = $request->validate([
            'category_id' => 'nullable|exists:categories,id',
            'name' => 'required|string|max:255',
            'type' => 'required|integer|in:0,1,2',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'image_url' => 'nullable|string|max:500',
            'is_active' => 'boolean',
        ]);

        $dish->update($data);
        return response()->json(['message' => 'Cập nhật món ăn thành công!', 'data' => $dish]);
    }

    public function destroy($id)
    {
        $dish = Dish::find($id);
        if (!$dish) return response()->json(['message' => 'Không tìm thấy món ăn!'], 404);
        $dish->delete();
        return response()->json(['message' => 'Xóa món ăn thành công!']);
    }
}
