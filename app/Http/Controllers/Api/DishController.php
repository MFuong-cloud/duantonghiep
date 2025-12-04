<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dish;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\QueryException;

class DishController extends Controller
{
    public function index()
    {
        // Trả về danh sách món ăn kèm thông tin danh mục
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
            'images'      => 'nullable|array',
            'images.*'    => 'image|mimes:jpeg,png,jpg,webp|max:10240',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:10240', // Fallback
        ]);

        $paths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $paths[] = $file->store('dishes', 'public');
            }
        } elseif ($request->hasFile('image')) {
            $paths[] = $request->file('image')->store('dishes', 'public');
        }

        // Persist full JSON array into existing TEXT 'image' column
        $data['image'] = !empty($paths) ? json_encode(array_values($paths)) : null;

        // Remove transient key so Eloquent won't try to insert a non-existent column
        if (array_key_exists('images', $data)) {
            unset($data['images']);
        }

        // Try create, fallback to single-path if DB truncation occurs
        try {
            $dish = Dish::create($data);
        } catch (QueryException $ex) {
            // If it's a string truncation / data too long error, retry with single path
            $msg = $ex->getMessage();
            if (str_contains($msg, 'String data') || str_contains($msg, 'right truncated') || $ex->getCode() === '22001') {
                // fallback: store only first image path (legacy single path)
                $data['image'] = $paths[0] ?? null;
                try {
                    $dish = Dish::create($data);
                } catch (QueryException $ex2) {
                    // cleanup uploaded files to avoid orphans
                    foreach ($paths as $p) {
                        if ($p && Storage::disk('public')->exists($p)) {
                            Storage::disk('public')->delete($p);
                        }
                    }
                    return response()->json(['message' => 'Lỗi khi lưu món ăn (data too long).'], 500);
                }
            } else {
                // other DB error
                // cleanup uploaded files
                foreach ($paths as $p) {
                    if ($p && Storage::disk('public')->exists($p)) {
                        Storage::disk('public')->delete($p);
                    }
                }
                return response()->json(['message' => 'Lỗi khi lưu món ăn.'], 500);
            }
        }

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
            return response()->json(['message' => 'Danh mục của món ăn này đang bị tắt!'], 403);
        }

        return response()->json($dish);
    }

    public function update(Request $request, $id)
    {
        $dish = Dish::find($id);
        if (!$dish) return response()->json(['message' => 'Không tìm thấy món ăn!'], 404);

        if ($dish->category && !$dish->category->status) {
            return response()->json(['message' => 'Danh mục đang tắt, không thể cập nhật!'], 403);
        }

        $data = $request->validate([
            'category_id' => 'sometimes|required|integer|exists:categories,id',
            'name'        => 'sometimes|required|string|max:255|unique:dishes,name,' . $id,
            'price'       => 'sometimes|required|numeric|min:0|max:100000000',
            'description' => 'nullable|string|max:1000',
            'status'      => 'sometimes|required|boolean',
            'images'      => 'nullable|array',
            'images.*'    => 'image|mimes:jpeg,png,jpg,webp|max:10240',
            'existing_images' => 'nullable|array',
            'existing_images.*' => 'string',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:10240',
        ]);

        // ✅ CHỈ XỬ LÝ ẢNH KHI CÓ IMAGES HOẶC EXISTING_IMAGES
        $shouldHandleImages = $request->has('images') ||
            $request->has('existing_images') ||
            $request->hasFile('image');

        if ($shouldHandleImages) {
            // --- XỬ LÝ ẢNH THÔNG MINH ---
            $raw = $dish->getAttributes()['image'] ?? null;
            $currentImages = [];
            if (!is_null($raw) && $raw !== '') {
                $decoded = json_decode($raw, true);
                if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                    $currentImages = $decoded;
                } else {
                    $currentImages = [$raw];
                }
            }

            $keepImages = $request->input('existing_images', []);
            if (!is_array($keepImages)) $keepImages = [];

            $imagesToDelete = [];
            $keptDbPaths = [];
            foreach ($currentImages as $dbPath) {
                $keep = false;
                foreach ($keepImages as $keepUrl) {
                    if (str_contains($keepUrl, $dbPath)) {
                        $keep = true;
                        break;
                    }
                }
                if ($keep) {
                    $keptDbPaths[] = $dbPath;
                } else {
                    $imagesToDelete[] = $dbPath;
                }
            }

            foreach ($imagesToDelete as $path) {
                if ($path && Storage::disk('public')->exists($path)) {
                    Storage::disk('public')->delete($path);
                }
            }

            $newPaths = [];
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $file) {
                    $newPaths[] = $file->store('dishes', 'public');
                }
            } elseif ($request->hasFile('image')) {
                $newPaths[] = $request->file('image')->store('dishes', 'public');
            }

            $finalImages = array_merge($keptDbPaths, $newPaths);
            $data['image'] = !empty($finalImages) ? json_encode(array_values($finalImages)) : null;
        }

        // cleanup helper fields
        unset($data['existing_images']);
        if (array_key_exists('images', $data)) {
            unset($data['images']);
        }

        // Try update
        try {
            $dish->update($data);
        } catch (QueryException $ex) {
            // ... error handling ...
        }

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
            return response()->json(['message' => 'Danh mục đang tắt, không thể xóa!'], 403);
        }

        // Lấy tất cả ảnh để xóa from single 'image' column
        $storedImages = [];
        $raw = $dish->getAttributes()['image'] ?? null;
        if (!is_null($raw) && $raw !== '') {
            $decoded = json_decode($raw, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $storedImages = $decoded;
            } else {
                $storedImages = [$raw];
            }
        }

        // Xóa file
        foreach ($storedImages as $path) {
            if ($path && Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
            }
        }

        $dish->delete();

        return response()->json(['message' => 'Xóa món ăn thành công!']);
    }
}
