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
            'images.*'    => 'image|mimes:jpeg,png,jpg,webp|max:2048',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', // Fallback
        ]);

        $paths = [];
        // 1. Xử lý upload nhiều ảnh
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $paths[] = $file->store('dishes', 'public');
            }
        }
        // 2. Fallback: nếu chỉ gửi 1 ảnh qua field 'image'
        elseif ($request->hasFile('image')) {
            $paths[] = $request->file('image')->store('dishes', 'public');
        }

        // Lưu dữ liệu: store JSON array string into existing 'image' column
        $data['image'] = !empty($paths) ? json_encode(array_values($paths)) : null;

        // REMOVE images key so Eloquent won't try to insert a non-existent column
        if (array_key_exists('images', $data)) {
            unset($data['images']);
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
            'images.*'    => 'image|mimes:jpeg,png,jpg,webp|max:2048',
            'existing_images' => 'nullable|array', // Mảng chứa các URL/path ảnh cũ muốn giữ lại
            'existing_images.*' => 'string',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        // --- XỬ LÝ ẢNH THÔNG MINH ---

        // 1. Lấy danh sách ảnh hiện có trong DB (chuẩn hóa về mảng) from single 'image' column
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

        // 2. Lấy danh sách ảnh client muốn giữ lại
        $keepImages = $request->input('existing_images', []);
        if (!is_array($keepImages)) $keepImages = [];

        // 3. Xác định ảnh nào cần xóa và ảnh nào giữ lại (trong DB)
        $imagesToDelete = [];
        $keptDbPaths = [];

        foreach ($currentImages as $dbPath) {
            $keep = false;
            foreach ($keepImages as $keepUrl) {
                // So sánh linh hoạt: nếu keepUrl chứa dbPath (xử lý trường hợp client gửi full URL)
                if (str_contains($keepUrl, $dbPath)) {
                    $keep = true;
                    break;
                }
            }

            if ($keep) {
                $keptDbPaths[] = $dbPath; // Giữ lại path gốc trong DB
            } else {
                $imagesToDelete[] = $dbPath; // Đánh dấu để xóa
            }
        }

        // 4. Thực hiện xóa file khỏi ổ đĩa
        foreach ($imagesToDelete as $path) {
            if ($path && Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
            }
        }

        // 5. Upload ảnh mới
        $newPaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $newPaths[] = $file->store('dishes', 'public');
            }
        } elseif ($request->hasFile('image')) {
            // Support single upload update fallback
            $newPaths[] = $request->file('image')->store('dishes', 'public');
        }

        // 6. Gộp danh sách: [Ảnh cũ giữ lại] + [Ảnh mới upload]
        $finalImages = array_merge($keptDbPaths, $newPaths);

        // Cập nhật vào data: store as JSON in single column 'image'
        $data['image'] = !empty($finalImages) ? json_encode(array_values($finalImages)) : null;

        // Loại bỏ field phụ
        unset($data['existing_images']);

        // ALSO remove 'images' from $data to avoid DB error if present
        if (array_key_exists('images', $data)) {
            unset($data['images']);
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
