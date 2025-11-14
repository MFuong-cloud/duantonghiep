<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserProfileController extends Controller
{
    // 🟢 Lấy thông tin người dùng hiện tại
    public function show()
    {
        $user = Auth::user();
        return response()->json([
            'status' => true,
            'message' => 'Lấy thông tin thành công',
            'data' => $user
        ]);
    }

    // 🟢 Cập nhật thông tin người dùng
    public function update(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:20|unique:users,phone,' . $user->id,
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'avatar' => 'sometimes|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $validated['avatar'] = $path;
        }

        $user->update($validated);

        return response()->json([
            'status' => true,
            'message' => 'Cập nhật thành công',
            'data' => $user
        ]);
    }

    // 🟢 Đổi mật khẩu
    public function changePassword(Request $request)
    {
        $user = Auth::user(); // ✅ đúng cú pháp

        $request->validate([
            'old_password' => 'required',
            'new_password' => 'required|min:6|confirmed',
        ]);

        if (!Hash::check($request->old_password, $user->password)) {
            return response()->json([
                'status' => false,
                'message' => 'Mật khẩu cũ không đúng',
            ], 400);
        }

        $user->update([
            'password' => Hash::make($request->new_password),
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Đổi mật khẩu thành công',
        ]);
    }

}
