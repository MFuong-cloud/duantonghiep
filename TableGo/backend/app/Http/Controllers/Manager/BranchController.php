<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Http\Requests\Branch\StoreBranchRequest;
use App\Http\Requests\Branch\UpdateBranchRequest;
use App\Http\Resources\BranchResource;
use App\Models\Branch;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class BranchController extends Controller
{
    /**
     * Hiển thị danh sách chi nhánh (phân trang)
     */
    public function index(): JsonResponse
    {
        $branches = Branch::latest()->paginate(10);
        return response()->json([
            'status' => 'success',
            'data' => BranchResource::collection($branches),
        ]);
    }

    /**
     * Tạo mới chi nhánh
     */
    public function store(StoreBranchRequest $request): JsonResponse
    {
        try {
            $branch = Branch::create($request->validated());

            return response()->json([
                'status' => 'success',
                'message' => 'Tạo chi nhánh thành công.',
                'data' => new BranchResource($branch),
            ], 201);
        } catch (\Exception $e) {
            Log::error('Lỗi khi tạo chi nhánh: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Không thể tạo chi nhánh.',
            ], 500);
        }
    }

    /**
     * Xem chi tiết chi nhánh
     */
    public function show($id): JsonResponse
    {
        $branch = Branch::find($id);

        if (!$branch) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy chi nhánh.'], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => new BranchResource($branch),
        ]);
    }

    /**
     * Cập nhật chi nhánh
     */
    public function update(UpdateBranchRequest $request, $id): JsonResponse
    {
        $branch = Branch::find($id);

        if (!$branch) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy chi nhánh.'], 404);
        }

        $branch->update($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật chi nhánh thành công.',
            'data' => new BranchResource($branch),
        ]);
    }

    /**
     * Xóa mềm chi nhánh
     */
    public function destroy($id): JsonResponse
    {
        $branch = Branch::find($id);

        if (!$branch) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy chi nhánh.'], 404);
        }

        $branch->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Đã xóa chi nhánh (soft delete) thành công.',
        ]);
    }

    /**
     * Danh sách chi nhánh đã xóa mềm
     */
    public function trashed(): JsonResponse
    {
        $branches = Branch::onlyTrashed()->get();

        return response()->json([
            'status' => 'success',
            'data' => BranchResource::collection($branches),
        ]);
    }

    /**
     * Khôi phục chi nhánh đã xóa mềm
     */
    public function restore($id): JsonResponse
    {
        $branch = Branch::onlyTrashed()->find($id);

        if (!$branch) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy chi nhánh đã xóa.'], 404);
        }

        $branch->restore();

        return response()->json([
            'status' => 'success',
            'message' => 'Khôi phục chi nhánh thành công.',
            'data' => new BranchResource($branch),
        ]);
    }

    /**
     * Xóa vĩnh viễn chi nhánh (force delete)
     */
    public function forceDelete($id): JsonResponse
    {
        $branch = Branch::onlyTrashed()->find($id);

        if (!$branch) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy chi nhánh cần xóa vĩnh viễn.'], 404);
        }

        $branch->forceDelete();

        return response()->json([
            'status' => 'success',
            'message' => 'Đã xóa vĩnh viễn chi nhánh.',
        ]);
    }
}
