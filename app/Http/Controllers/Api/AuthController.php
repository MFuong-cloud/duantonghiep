<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\UserSession;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:15|unique:users,phone',
            'email' => 'nullable|email|unique:users,email',
            'password' => ['required', Password::min(8)->mixedCase()->symbols()],
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

    public function logout(Request $request)
    {
        $user = $request->user();
        $token = $user->currentAccessToken();

        UserSession::where('token_id', $token->id)->update(['logged_out_at' => now()]);

        $token->delete();

        return response()->json(['message' => 'Đăng xuất thành công!']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function sessions(Request $request)
    {
        $sessions = $request->user()->sessions()->orderByDesc('logged_in_at')->get();
        return response()->json($sessions);
    }

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

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required']);

        $identifier = $request->email;
        $isEmail = filter_var($identifier, FILTER_VALIDATE_EMAIL);

        $user = null;
        if ($isEmail) {
            $user = User::where('email', $identifier)->first();
        } else {
            $user = User::where('phone', $identifier)->first();
        }

        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy tài khoản.'], 404);
        }

        $emailToSend = $user->email;

        if (!$isEmail && empty($emailToSend)) {
            $providedEmail = $request->input('provided_email');
            
            if (empty($providedEmail)) {
                return response()->json([
                    'message' => 'Tài khoản chưa có email liên kết. Vui lòng nhập thêm email để nhận mã xác thực.',
                    'require_email' => true
                ], 422);
            }

            if (!filter_var($providedEmail, FILTER_VALIDATE_EMAIL)) {
                return response()->json(['message' => 'Email cung cấp không hợp lệ.'], 422);
            }
            if (User::where('email', $providedEmail)->exists()) {
                return response()->json(['message' => 'Email này đã được sử dụng bởi tài khoản khác.'], 422);
            }
            
            $emailToSend = $providedEmail;
        }

        if (!$emailToSend) {
            return response()->json(['message' => 'Không xác định được email gửi mã.'], 400);
        }

        $token = (string) random_int(100000, 999999);

        \Illuminate\Support\Facades\DB::table('password_resets')->updateOrInsert(
            ['email' => $emailToSend],
            [
                'email' => $emailToSend,
                'token' => $token,
                'created_at' => now()
            ]
        );

        try {
            \Illuminate\Support\Facades\Mail::raw("Xin chào {$user->name},\n\nBạn đã yêu cầu đặt lại mật khẩu. Mã xác thực của bạn là: {$token}\n\nVui lòng nhập mã này vào trang đặt lại mật khẩu.\n\nNếu bạn không yêu cầu, hãy bỏ qua email này.", function ($message) use ($emailToSend) {
                $message->to($emailToSend)
                    ->subject('Yêu cầu đặt lại mật khẩu - TABLEGO');
            });
        } catch (\Exception $e) {
            return response()->json(['message' => 'Không thể gửi email do lỗi hệ thống.'], 500);
        }

        return response()->json(['message' => 'Mã xác thực đã được gửi tới ' . $emailToSend]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string',
            'password' => ['required', Password::min(8)->mixedCase()->symbols()],
            'phone' => 'nullable|string'
        ]);

        $resetRecord = \Illuminate\Support\Facades\DB::table('password_resets')
            ->where('email', $request->email)
            ->where('token', $request->token)
            ->first();

        if (!$resetRecord) {
            return response()->json(['message' => 'Mã xác thực không đúng hoặc sai email.'], 400);
        }

        if (now()->diffInMinutes(\Carbon\Carbon::parse($resetRecord->created_at)) > 60) {
            return response()->json(['message' => 'Mã xác thực đã hết hạn.'], 400);
        }

        $user = null;
        
        if ($request->filled('phone')) {
            $user = User::where('phone', $request->phone)->first();
            
            if ($user && empty($user->email)) {
                $user->email = $request->email;
                $user->email_verified_at = now();
            }
        } else {
            $user = User::where('email', $request->email)->first();
        }

        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy người dùng.'], 404);
        }

        $user->password = $request->password;
        $user->save();

        \Illuminate\Support\Facades\DB::table('password_resets')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Mật khẩu đã được thay đổi thành công!']);
    }
}
