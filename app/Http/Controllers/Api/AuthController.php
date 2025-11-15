<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\UserSession;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // API ĐĂNG KÝ
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

        $token = $user->createToken(
            'auth_token',
            expiresAt: now()->addDay()
        )->plainTextToken;


        return response()->json([
            'message' => 'Đăng ký thành công!',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    // API ĐĂNG NHẬP
    public function login(Request $request)
    {
        $request->validate([
            'email_or_phone' => 'required',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email_or_phone)
                    ->orWhere('phone', $request->email_or_phone)
                    ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Thông tin đăng nhập không hợp lệ.'], 401);
        }

        $token = $user->createToken(
            'auth_token',
            expiresAt: now()->addDay()
        )->plainTextToken;

        // Lưu session đăng nhập
        UserSession::create([
            'user_id' => $user->id,
            'token_id' => $user->tokens()->latest()->first()->id ?? null,
            'ip_address' => $request->ip(),
            'user_agent' => $request->header('User-Agent'),
            'logged_in_at' => now(),
        ]);

        return response()->json([
            'message' => 'Đăng nhập thành công!',
            'user' => $user,
            'token' => $token,
        ]);
    }

    // API ĐĂNG XUẤT
    public function logout(Request $request)
    {
        $user = $request->user();
        $token = $user->currentAccessToken();

        // Ghi lại thời điểm đăng xuất
        UserSession::where('token_id', $token->id)->update(['logged_out_at' => now()]);

        $token->delete();

        return response()->json(['message' => 'Đăng xuất thành công!']);
    }

    // LẤY THÔNG TIN USER
    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    // LẤY DANH SÁCH PHIÊN ĐĂNG NHẬP
    public function sessions(Request $request)
    {
        $sessions = $request->user()->sessions()->orderByDesc('logged_in_at')->get();
        return response()->json($sessions);
    }

    // ĐĂNG XUẤT 1 PHIÊN CỤ THỂ
    public function logoutSession(Request $request, $id)
    {
        $session = UserSession::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$session) {
            return response()->json(['message' => 'Không tìm thấy phiên này!'], 404);
        }

        if ($session->token_id) {
            $token = $request->user()->tokens()->where('id', $session->token_id)->first();
            if ($token) {
                $token->delete();
            }
        }

        $session->update(['logged_out_at' => now()]);

        return response()->json(['message' => 'Đã đăng xuất khỏi phiên này!']);
    }
}
