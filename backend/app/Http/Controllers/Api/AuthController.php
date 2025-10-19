<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // =====================
    // 🟢 API ĐĂNG KÝ
    // =====================
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255', 
            'phone' => 'nullable|string|max:15|unique:users,phone',
            'email' => 'nullable|email|unique:users,email',
            'password' => 'required|min:6',
        ]);

        $user = User::create([
            'name' => $request->name,
            'phone' => $request->phone,
            'email' => $request->email,
            'password' => $request->password,
            'role' => 'customer', 
            'vip_level' => 'none', 
        ]);

        return response()->json([
            'message' => 'Đăng ký thành công!',
            'user' => $user,
        ], 201);
    }

    // =====================
    // 🟢 API ĐĂNG NHẬP
    // =====================
    public function login(Request $request)
    {
        $request->validate([
            'email_or_phone' => 'required',
            'password' => 'required',
        ]);

        // 🔹 Cho phép đăng nhập bằng email hoặc phone
        $user = User::where('email', $request->email_or_phone)
                    ->orWhere('phone', $request->email_or_phone)
                    ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Thông tin đăng nhập không hợp lệ.',
            ], 401);
        }

        // 🔹 Tạo token Sanctum
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Đăng nhập thành công!',
            'token' => $token,
            'user' => $user,
        ]);
    }

    // =====================
    // 🟢 API ĐĂNG XUẤT
    // =====================
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Đăng xuất thành công!',
        ]);
    }
}
