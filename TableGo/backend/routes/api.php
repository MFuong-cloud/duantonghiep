<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
// Sắp tới bạn sẽ tạo các Controller này
// use App\Http\Controllers\Api\MenuItemController;
// use App\Http\Controllers\Api\BookingController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| Đây là nơi định nghĩa tất cả các API cho ứng dụng TableGo.
*/

// === CÁC ROUTE CÔNG KHAI (Không cần đăng nhập) ===
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])->name('api.register');
    Route::post('/login', [AuthController::class, 'login'])->name('api.login');
    // Social Login Routes
    Route::get('/{provider}/redirect', [AuthController::class, 'redirectToProvider'])->name('api.social.redirect');
    Route::get('/{provider}/callback', [AuthController::class, 'handleProviderCallback'])->name('api.social.callback');
    // OTP Routes
    Route::post('/otp/send', [AuthController::class, 'sendOtp'])->name('api.otp.send');
    Route::post('/otp/verify', [AuthController::class, 'verifyOtpAndLogin'])->name('api.otp.verify');
});


// === CÁC ROUTE CẦN XÁC THỰC (Phải đăng nhập) ===
Route::middleware('auth:sanctum')->group(function () {
    // Route xác thực chung
    Route::post('/auth/logout', [AuthController::class, 'logout'])->name('api.logout');
    Route::get('/user/profile', [AuthController::class, 'user'])->name('api.user.profile');

    // Route cho khách hàng (customer)
    // Ví dụ: Route::post('/bookings', [BookingController::class, 'store'])->name('api.bookings.store');
    // Ví dụ: Route::get('/my-bookings', [BookingController::class, 'index'])->name('api.bookings.my');


    // === CÁC ROUTE CẦN PHÂN QUYỀN (Admin, Manager, Owner) ===

    // Route dành cho nhân viên trở lên (employee, manager, owner)
    Route::middleware('role:employee,manager,owner')->prefix('staff')->group(function () {
        // Ví dụ: Route::get('/bookings', [BookingController::class, 'getAll']);
    });

    // Route dành cho Quản lý & Chủ (manager, owner)
    Route::middleware('role:manager,owner')->prefix('management')->group(function () {
        Route::get('/dashboard-summary', function () {
            return response()->json(['data' => 'Dữ liệu tóm tắt cho quản lý và chủ.']);
        });
        // Ví dụ: Route::apiResource('/menu-items', MenuItemController::class);
    });

    // Route chỉ dành cho Chủ (owner)
    Route::middleware('role:owner')->prefix('owner')->group(function () {
        Route::get('/financial-reports', function () {
            return response()->json(['data' => 'Báo cáo tài chính chỉ dành cho chủ nhà hàng.']);
        });
        // Ví dụ: Route::apiResource('/branches', BranchController::class);
    });
});
