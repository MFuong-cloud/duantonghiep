<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TableCategory;
use Illuminate\Http\Request;

class TableCategoryController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/table-categories",
     *     summary="Lấy danh sách loại bàn",
     *     tags={"TableCategory"},
     *     @OA\Response(
     *         response=200,
     *         description="Danh sách loại bàn",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Lấy danh sách loại bàn thành công"),
     *             @OA\Property(property="data", type="array", @OA\Items(
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="Phòng VIP"),
     *                 @OA\Property(property="description", type="string", example="Phòng sang trọng 10 người"),
     *                 @OA\Property(property="image", type="string", example="vip.jpg")
     *             ))
     *         )
     *     )
     * )
     */
    public function index()
    {
        $categories = TableCategory::all();

        return response()->json([
            'status' => true,
            'message' => 'Lấy danh sách loại bàn thành công',
            'data' => $categories,
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/table-categories",
     *     summary="Thêm loại bàn mới",
     *     tags={"TableCategory"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name"},
     *             @OA\Property(property="name", type="string", example="Phòng Gia Đình"),
     *             @OA\Property(property="description", type="string", example="Phòng 6 người, ấm cúng"),
     *             @OA\Property(property="image", type="string", example="family.png")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Thêm loại bàn thành công"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Dữ liệu không hợp lệ"
     *     )
     * )
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:255',
            'image' => 'nullable|string|max:255',
        ]);

        $category = TableCategory::create($data);

        return response()->json([
            'status' => true,
            'message' => 'Thêm loại bàn thành công',
            'data' => $category,
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/api/table-categories/{id}",
     *     summary="Lấy chi tiết loại bàn theo ID",
     *     tags={"TableCategory"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID loại bàn",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Thông tin loại bàn"),
     *     @OA\Response(response=404, description="Không tìm thấy loại bàn")
     * )
     */
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

    /**
     * @OA\Put(
     *     path="/api/table-categories/{id}",
     *     summary="Cập nhật thông tin loại bàn",
     *     tags={"TableCategory"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID loại bàn cần cập nhật",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string", example="Phòng VIP Sửa"),
     *             @OA\Property(property="description", type="string", example="Phòng 12 người sang trọng"),
     *             @OA\Property(property="image", type="string", example="vip_edit.png")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Cập nhật thành công"),
     *     @OA\Response(response=404, description="Không tìm thấy loại bàn")
     * )
     */
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
            'name' => 'sometimes|string|max:100',
            'description' => 'nullable|string|max:255',
            'image' => 'nullable|string|max:255',
        ]);

        $category->update($data);

        return response()->json([
            'status' => true,
            'message' => 'Cập nhật loại bàn thành công',
            'data' => $category,
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/api/table-categories/{id}",
     *     summary="Xóa loại bàn theo ID",
     *     tags={"TableCategory"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID loại bàn cần xóa",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Xóa loại bàn thành công"),
     *     @OA\Response(response=404, description="Không tìm thấy loại bàn")
     * )
     */
    public function destroy($id)
    {
        $category = TableCategory::find($id);

        if (!$category) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy loại bàn',
            ], 404);
        }

        $category->delete();

        return response()->json([
            'status' => true,
            'message' => 'Xóa loại bàn thành công',
        ]);
    }
}
