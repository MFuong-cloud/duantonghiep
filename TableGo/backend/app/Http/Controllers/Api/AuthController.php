<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;
use Laravel\Socialite\Facades\Socialite;
use Twilio\Rest\Client as TwilioClient;
use App\Models\User;
use App\Models\Role;
use App\Models\OtpCode;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    // ================================================================
    // 1️⃣ ĐĂNG KÝ - LOGIN BẰNG EMAIL / PASSWORD
    // ================================================================

    /**
     * Đăng ký tài khoản người dùng mới.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'string', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['required', 'string', 'max:15', 'unique:users,phone'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'phone'    => $request->phone,
            'password' => Hash::make($request->password),
        ]);

        $customerRole = Role::where('name', 'customer')->first();
        if ($customerRole) {
            $user->roles()->attach($customerRole->id);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message'      => 'Đăng ký tài khoản thành công!',
            'user'         => $user->load('roles'),
            'access_token' => $token,
            'token_type'   => 'Bearer',
        ], 201);
    }

    /**
     * Đăng nhập bằng email và mật khẩu.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email_or_phone' => ['required', 'string'], // nhận email hoặc số điện thoại
            'password' => ['required', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $loginField = filter_var($request->email_or_phone, FILTER_VALIDATE_EMAIL) ? 'email' : 'phone';

        $credentials = [
            $loginField => $request->email_or_phone,
            'password' => $request->password,
        ];

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Thông tin đăng nhập không chính xác.'], 401);
        }

        $user  = User::where($loginField, $request->email_or_phone)->firstOrFail();
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Đăng nhập thành công!',
            'user' => $user->load('roles'),
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }


    // ================================================================
    // 2️⃣ ĐĂNG NHẬP MẠNG XÃ HỘI (GOOGLE / FACEBOOK)
    // ================================================================

    /**
     * Lấy URL chuyển hướng đến provider (Google, Facebook).
     *
     * @param  string  $provider
     * @return JsonResponse
     */
    public function redirectToProvider(string $provider): JsonResponse
    {
        $validated = Validator::make(['provider' => $provider], [
            'provider' => ['required', 'in:google,facebook'],
        ])->validate();

        $url = Socialite::driver($validated['provider'])
            ->stateless()
            ->redirect()
            ->getTargetUrl();

        return response()->json(['redirect_url' => $url]);
    }

    /**
     * Xử lý callback từ provider sau khi xác thực.
     *
     * @param  string  $provider
     * @return JsonResponse
     */
    public function handleProviderCallback(string $provider): JsonResponse
    {
        try {
            $socialUser = Socialite::driver($provider)->stateless()->user();
        } catch (Exception $e) {
            Log::error("Socialite callback error for {$provider}: " . $e->getMessage());
            return response()->json(['message' => 'Xác thực với ' . ucfirst($provider) . ' thất bại.'], 401);
        }

        $user = User::updateOrCreate(
            ['provider_id' => $socialUser->getId(), 'provider_name' => $provider],
            [
                'name'              => $socialUser->getName(),
                'email'             => $socialUser->getEmail(),
                'avatar'            => $socialUser->getAvatar(),
                'email_verified_at' => now(),
            ]
        );

        if ($user->wasRecentlyCreated) {
            $customerRole = Role::where('name', 'customer')->first();
            if ($customerRole) {
                $user->roles()->attach($customerRole);
            }
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message'      => 'Đăng nhập bằng ' . ucfirst($provider) . ' thành công!',
            'user'         => $user->load('roles'),
            'access_token' => $token,
            'token_type'   => 'Bearer',
        ]);
    }

    // ================================================================
    // 3️⃣ ĐĂNG NHẬP BẰNG SỐ ĐIỆN THOẠI - OTP
    // ================================================================

    /**
     * Gửi mã OTP xác thực qua số điện thoại.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function sendOtp(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string', // Tạm thời bỏ regex để chấp nhận số test
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $phone = $request->phone;
        $code  = rand(100000, 999999);
        $testPhoneNumber = '+15005550006';

        // Lưu mã OTP vào CSDL
        OtpCode::updateOrCreate(
            ['phone' => $phone],
            ['code' => $code, 'expires_at' => Carbon::now()->addMinutes(5)]
        );

        // --- BẮT ĐẦU THAY ĐỔI ---
        // Nếu không phải là số điện thoại test, mới gửi SMS thật
        if ($phone !== $testPhoneNumber) {
            try {
                $client = new TwilioClient(
                    env('TWILIO_SID'),
                    env('TWILIO_AUTH_TOKEN')
                );

                $client->messages->create($phone, [
                    'from' => env('TWILIO_PHONE_NUMBER'),
                    'body' => "Mã xác thực TableGo của bạn là: {$code}",
                ]);
            } catch (Exception $e) {
                Log::error('SMS sending failed: ' . $e->getMessage());
                return response()->json(['message' => 'Không thể gửi mã OTP vào lúc này. Vui lòng thử lại sau.'], 500);
            }
        } else {
            // Nếu là số test, ghi log mã OTP để lập trình viên biết
            Log::info("OTP for test number {$phone} is: {$code}");
        }
        // --- KẾT THÚC THAY ĐỔI ---

        return response()->json(['message' => 'Yêu cầu gửi mã OTP đã được xử lý.']);
    }

    /**
     * Xác minh mã OTP và đăng nhập.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function verifyOtpAndLogin(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string',
            'code'  => 'required|string|digits:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $otpRecord = OtpCode::where('phone', $request->phone)
            ->where('code', $request->code)
            ->first();

        if (!$otpRecord) {
            return response()->json(['message' => 'Mã OTP không hợp lệ.'], 401);
        }

        if (Carbon::now()->isAfter($otpRecord->expires_at)) {
            $otpRecord->delete();
            return response()->json(['message' => 'Mã OTP đã hết hạn.'], 401);
        }

        $user = User::firstOrCreate(
            ['phone' => $request->phone],
            ['name' => 'User_' . substr($request->phone, -4)]
        );

        if ($user->wasRecentlyCreated) {
            $customerRole = Role::where('name', 'customer')->first();
            if ($customerRole) {
                $user->roles()->attach($customerRole);
            }
        }

        $otpRecord->delete();

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message'      => 'Xác thực và đăng nhập thành công!',
            'user'         => $user->load('roles'),
            'access_token' => $token,
            'token_type'   => 'Bearer',
        ]);
    }

    // ================================================================
    // 4️⃣ CÁC HÀM PHỤ TRỢ (LOGOUT / USER INFO)
    // ================================================================

    /**
     * Đăng xuất (xóa token hiện tại).
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Đăng xuất thành công.']);
    }

    /**
     * Lấy thông tin người dùng hiện tại (kèm vai trò).
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function user(Request $request): JsonResponse
    {
        return response()->json($request->user()->load('roles'));
    }
}
