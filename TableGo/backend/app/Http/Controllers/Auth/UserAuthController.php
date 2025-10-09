<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User; // Dùng trực tiếp User
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserAuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:users,email',
            'phone' => 'nullable|string|unique:users,phone',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),

            // CẬP NHẬT CHUẨN XÁC: Sử dụng Constants từ Model User
            'role' => User::ROLE_CUSTOMER,
            'vip_level' => User::VIP_NONE,
        ]);

        $token = $user->createToken('user-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email_or_phone' => 'required',
            'password' => 'required|string',
        ]);

        // Tối ưu: Dùng withTrashed() để kiểm tra rõ ràng tài khoản đã bị xóa mềm (khóa)
        $user = User::withTrashed()
            ->where('email', $request->email_or_phone)
            ->orWhere('phone', $request->email_or_phone)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email_or_phone' => ['Thông tin đăng nhập không hợp lệ.'],
            ]);
        }

        // Kiểm tra Soft Deletes: Tài khoản đã bị khóa bởi quản trị viên
        if ($user->trashed()) {
            throw ValidationException::withMessages([
                'email_or_phone' => ['Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ.'],
            ]);
        }

        $token = $user->createToken('user-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Đăng xuất thành công']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
