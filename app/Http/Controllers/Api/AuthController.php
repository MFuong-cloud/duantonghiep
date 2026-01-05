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
    // API ĐĂNG KÝ
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
    // QUÊN MẬT KHẨU
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            // Trả về thành công kể cả khi không tìm thấy user để tránh dò email (Security)
            // Hoặc trả về 404 nếu muốn UX tốt hơn cho nội bộ. Ở đây ta trả về 404 cho dễ test.
            return response()->json(['message' => 'Không tìm thấy người dùng với email này.'], 404);
        }

        $token = (string) random_int(100000, 999999);

        \Illuminate\Support\Facades\DB::table('password_resets')->updateOrInsert(
            ['email' => $request->email],
            [
                'email' => $request->email,
                'token' => $token,
                'created_at' => now()
            ]
        );

        // Gửi email
        // Lưu ý: nên tạo Mailable class đẹp hơn, đây là bản đơn giản
        try {
            \Illuminate\Support\Facades\Mail::raw("Xin chào {$user->name},\n\nBạn đã yêu cầu đặt lại mật khẩu. Mã xác thực của bạn là: {$token}\n\nVui lòng nhập mã này vào trang đặt lại mật khẩu.\n\nNếu bạn không yêu cầu, hãy bỏ qua email này.", function ($message) use ($user) {
                $message->to($user->email)
                    ->subject('Yêu cầu đặt lại mật khẩu - TABLEGO');
            });
        } catch (\Exception $e) {
            return response()->json(['message' => 'Không thể gửi email. Vui lòng thử lại sau.'], 500);
        }

        return response()->json(['message' => 'Chúng tôi đã gửi mã đặt lại mật khẩu vào email của bạn!']);
    }

    // ĐẶT LẠI MẬT KHẨU
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string',
            'password' => ['required', Password::min(8)->mixedCase()->symbols()],
        ]);

        $resetRecord = \Illuminate\Support\Facades\DB::table('password_resets')
            ->where('email', $request->email)
            ->where('token', $request->token)
            ->first();

        if (!$resetRecord) {
            return response()->json(['message' => 'Mã xác thực không hợp lệ hoặc sai email.'], 400);
        }

        // Kiểm tra hết hạn (ví dụ 60 phút)
        $tokenCreatedAt = \Carbon\Carbon::parse($resetRecord->created_at);
        if (now()->diffInMinutes($tokenCreatedAt) > 60) {
            return response()->json(['message' => 'Mã xác thực đã hết hạn.'], 400);
        }

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'Người dùng không tồn tại.'], 404);
        }

        $user->password = $request->password;
        $user->save();

        // Xóa token sau khi dùng xong
        \Illuminate\Support\Facades\DB::table('password_resets')
            ->where('email', $request->email)
            ->delete();

        return response()->json(['message' => 'Mật khẩu đã được đặt lại thành công!']);
    }
}
