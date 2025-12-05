<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;

class UserManagementController extends Controller
{
// Lấy danh sách user chỉ có role = customer
    public function index()
    {
        $users = User::select('id', 'name', 'email', 'phone', 'role', 'vip_level', 'avatar', 'created_at')
            ->where('role', 'customer') // 🔥 Chỉ lấy user có role customer
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($user) {
                // Thêm full URL avatar
                $user->avatar_url = $user->avatar ? asset('storage/' . $user->avatar) : null;
                return $user;
            });

        return response()->json($users);
    }


    // Tạo user mới
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', Password::min(8)->mixedCase()->symbols()],
            'role' => 'nullable|in:customer,employee,manager,owner',
            'phone' => 'nullable|string|max:15|unique:users,phone',
            'vip_level' => 'nullable|string',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password, // Model tự hash
            'role' => $request->role ?? 'customer',
            'phone' => $request->phone,
            'vip_level' => $request->vip_level ?? 'Bronze',
        ]);

        return response()->json(['message' => 'Tạo người dùng thành công!', 'user' => $user], 201);
    }

    // Xem chi tiết 1 user
    public function show($id)
    {
        $user = User::with('sessions:id,user_id,ip_address,logged_in_at,logged_out_at')
            ->find($id);

        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy người dùng!'], 404);
        }

        // Trả URL avatar đầy đủ
        $user->avatar_url = $user->avatar ? asset('storage/' . $user->avatar) : null;

        return response()->json($user);
    }

    // Cập nhật thông tin user
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
            'password' => ['nullable', Password::min(8)->mixedCase()->symbols()],
            'vip_level' => 'nullable|string',
        ]);

        $user->fill($request->only(['name', 'phone', 'email', 'vip_level']));

        if ($request->filled('password')) {
            $user->password = $request->password;
        }

        $user->save();

        return response()->json(['message' => 'Cập nhật thành công!', 'user' => $user]);
    }

    // Thay đổi role
    public function updateRole(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy người dùng!'], 404);
        }

        $request->validate([
            'role' => 'required|in:customer,employee,manager,owner',
        ]);

        $user->role = $request->role;
        $user->save();

        return response()->json(['message' => 'Đã thay đổi vai trò!', 'user' => $user]);
    }

    // Upload / update avatar
    public function updateAvatar(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy người dùng!'], 404);
        }

        $request->validate([
            'avatar' => 'required|image|mimes:jpg,jpeg,png,webp|max:4096',
        ]);

        // Xóa ảnh cũ nếu có
        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        // Lưu file mới
        $path = $request->file('avatar')->store('avatars', 'public');

        $user->avatar = $path;
        $user->save();

        return response()->json([
            'message' => 'Cập nhật avatar thành công!',
            'avatar_url' => asset('storage/' . $path),
        ]);
    }

    // Xóa avatar
    public function deleteAvatar($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy người dùng!'], 404);
        }

        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        $user->avatar = null;
        $user->save();

        return response()->json(['message' => 'Đã xóa avatar!']);
    }

    // Xóa user
    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy người dùng!'], 404);
        }

        // Xóa avatar luôn
        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        $user->delete();

        return response()->json(['message' => 'Đã xóa người dùng!']);
    }
}
