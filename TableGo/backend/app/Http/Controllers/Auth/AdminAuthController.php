<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AdminAuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email_or_phone' => 'required',
            'password' => 'required|string',
        ]);

        // 1. Tối ưu: Sử dụng withTrashed() để tìm kiếm cả tài khoản đã bị xóa mềm (nếu có)
        // và kiểm tra vai trò bằng Constants.
        $user = User::withTrashed()
            ->where(function ($query) use ($request) {
                $query->where('email', $request->email_or_phone)
                    ->orWhere('phone', $request->email_or_phone);
            })
            ->whereIn('role', [User::ROLE_MANAGER, User::ROLE_OWNER])
            ->first();

        // 2. Kiểm tra xác thực (tên đăng nhập/mật khẩu)
        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email_or_phone' => ['Thông tin đăng nhập không hợp lệ.'],
            ]);
        }

        // 3. Kiểm tra Soft Deletes: Tài khoản đã bị xóa mềm (khóa)
        if ($user->trashed()) {
            throw ValidationException::withMessages([
                'email_or_phone' => ['Tài khoản quản trị viên này đã bị khóa hoặc vô hiệu hóa.'],
            ]);
        }

        $token = $user->createToken('admin-token', ['admin'])->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {
        // Xóa token hiện tại (chuyên nghiệp hơn, tránh xóa hết nếu user có nhiều thiết bị)
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Đăng xuất thành công']);
    }

    public function me(Request $request)
    {
        // Lấy thông tin người dùng đã xác thực
        return response()->json($request->user());
    }
}
