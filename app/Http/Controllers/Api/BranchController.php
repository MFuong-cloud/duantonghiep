<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Branch;

class BranchController extends Controller
{
    // 🟢 Lấy danh sách chi nhánh
    public function index()
    {
        return response()->json(Branch::all());
    }

    // 🟢 Lấy chi tiết 1 chi nhánh
    public function show($id)
    {
        $branch = Branch::find($id);
        if (!$branch) {
            return response()->json(['message' => 'Chi nhánh không tồn tại'], 404);
        }
        return response()->json($branch);
    }

    // 🟢 Thêm chi nhánh mới
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
        ]);

        $branch = Branch::create($validated);
        return response()->json([
            'message' => 'Thêm chi nhánh thành công',
            'data' => $branch
        ], 201);
    }

    // 🟢 Cập nhật chi nhánh
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
        ]);

        $branch->update($validated);

        return response()->json([
            'message' => 'Cập nhật chi nhánh thành công',
            'data' => $branch
        ]);
    }

    // 🟢 Xóa chi nhánh
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
