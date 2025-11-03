<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use Illuminate\Http\Request;

class BranchController extends Controller
{
    public function index()
    {
        return response()->json(Branch::all());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:500',
            'phone' => 'nullable|string|max:20',
            'image' => 'nullable|string|max:255',
        ]);

        $branch = Branch::create($data);
        return response()->json(['message' => 'Thêm chi nhánh thành công', 'branch' => $branch], 201);
    }

    public function show($id)
    {
        return response()->json(Branch::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $branch = Branch::findOrFail($id);
        $branch->update($request->all());
        return response()->json(['message' => 'Cập nhật chi nhánh thành công', 'branch' => $branch]);
    }

    public function destroy($id)
    {
        Branch::destroy($id);
        return response()->json(['message' => 'Xóa chi nhánh thành công']);
    }
}
