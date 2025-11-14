<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserManagementController extends Controller
{
    // ✅ Lấy danh sách tất cả user
    public function index()
    {
        $users = User::select('id', 'name', 'email', 'phone', 'role', 'vip_level', 'created_at')
            ->orderByDesc('created_at')
            ->get();

        return response()->json($users);
    }

    // ✅ Xem chi tiết 1 user
    public function show($id)
    {
        $user = User::with('sessions:id,user_id,ip_address,logged_in_at,logged_out_at')
            ->find($id);

        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy người dùng!'], 404);
        }

        return response()->json($user);
    }

    // ✅ Cập nhật thông tin user
    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy người dùng!'], 404);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:15|unique:users,phone,' . $id,
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'password' => 'nullable|min:6',
            'vip_level' => 'nullable|string',
        ]);

        $user->fill($request->only(['name', 'phone', 'email', 'vip_level']));
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }
        $user->save();

        return response()->json(['message' => 'Cập nhật thành công!', 'user' => $user]);
    }

    // ✅ Thay đổi role
    public function updateRole(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy người dùng!'], 404);
        }

        $request->validate([
            'role' => 'required|in:admin,staff,customer',
        ]);

        $user->role = $request->role;
        $user->save();

        return response()->json(['message' => 'Đã thay đổi vai trò!', 'user' => $user]);
    }

    // ✅ Xóa user
    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy người dùng!'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'Đã xóa người dùng!']);
    }
}
