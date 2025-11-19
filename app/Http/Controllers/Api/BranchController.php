<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Branch;

class BranchController extends Controller
{
    // Lấy danh sách chi nhánh
    public function index()
    {
        $branches = Branch::all()->map(function ($branch) {
            return [
                'id' => $branch->id,
                'name' => $branch->name,
                'address' => $branch->address,
                'phone' => $branch->phone,
                'email' => $branch->email,
                'status' => $branch->status ? 'open' : 'closed',
                'open_time' => $branch->open_time,
                'close_time' => $branch->close_time,
            ];
        });

        return response()->json($branches);
    }

    // Lấy chi tiết 1 chi nhánh
    public function show($id)
    {
        $branch = Branch::find($id);
        if (!$branch) {
            return response()->json(['message' => 'Chi nhánh không tồn tại'], 404);
        }

        return response()->json([
            'id' => $branch->id,
            'name' => $branch->name,
            'address' => $branch->address,
            'phone' => $branch->phone,
            'email' => $branch->email,
            'status' => $branch->status ? 'open' : 'closed',
            'open_time' => $branch->open_time,
            'close_time' => $branch->close_time,
        ]);
    }

    // Thêm chi nhánh mới
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'status' => 'nullable|boolean', // 1 = mở, 0 = đóng
            'open_time' => 'nullable|date_format:H:i', // giờ mở cửa
            'close_time' => 'nullable|date_format:H:i', // giờ đóng cửa
        ]);

        $branch = Branch::create($validated);

        return response()->json([
            'message' => 'Thêm chi nhánh thành công',
            'data' => [
                'id' => $branch->id,
                'name' => $branch->name,
                'address' => $branch->address,
                'phone' => $branch->phone,
                'email' => $branch->email,
                'status' => $branch->status ? 'open' : 'closed',
                'open_time' => $branch->open_time,
                'close_time' => $branch->close_time,
            ],
        ], 201);
    }

    // Cập nhật chi nhánh
    public function update(Request $request, $id)
    {
        $branch = Branch::find($id);
        if (!$branch) {
            return response()->json(['message' => 'Chi nhánh không tồn tại'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'address' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'status' => 'nullable|boolean',
            'open_time' => 'nullable|date_format:H:i',
            'close_time' => 'nullable|date_format:H:i',
        ]);

        $branch->update($validated);

        return response()->json([
            'message' => 'Cập nhật chi nhánh thành công',
            'data' => [
                'id' => $branch->id,
                'name' => $branch->name,
                'address' => $branch->address,
                'phone' => $branch->phone,
                'email' => $branch->email,
                'status' => $branch->status ? 'open' : 'closed',
                'open_time' => $branch->open_time,
                'close_time' => $branch->close_time,
            ],
        ]);
    }

    // Xóa chi nhánh
    public function destroy($id)
    {
        $branch = Branch::find($id);
        if (!$branch) {
            return response()->json(['message' => 'Chi nhánh không tồn tại'], 404);
        }

        $branch->delete();
        return response()->json(['message' => 'Đã xóa chi nhánh']);
    }
}
