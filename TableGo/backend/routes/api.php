<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
// use App\Http\Controllers\Api\MenuItemController;
// use App\Http\Controllers\Api\BookingController;

use App\Http\Middleware\CorsMiddleware;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| All API routes for the TableGo application.
| This version includes CORS handling for FE running on http://localhost:5173
*/

// Wrap all routes with CORS middleware
Route::middleware([CorsMiddleware::class])->group(function () {

    // === PUBLIC ROUTES (No authentication required) ===
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

    // === AUTHENTICATED ROUTES (Requires login via Sanctum) ===
    Route::middleware('auth:sanctum')->group(function () {

        // Common Auth Routes
        Route::post('/auth/logout', [AuthController::class, 'logout'])->name('api.logout');
        Route::get('/user/profile', [AuthController::class, 'user'])->name('api.user.profile');

        // === CUSTOMER ROUTES ===
        // Example: Route::post('/bookings', [BookingController::class, 'store'])->name('api.bookings.store');
        // Example: Route::get('/my-bookings', [BookingController::class, 'index'])->name('api.bookings.my');

        // === STAFF & HIGHER ROUTES ===
        Route::middleware('role:employee,manager,owner')->prefix('staff')->group(function () {
            // Example: Route::get('/bookings', [BookingController::class, 'getAll']);
        });

        // === MANAGEMENT ROUTES (manager, owner) ===
        Route::middleware('role:manager,owner')->prefix('management')->group(function () {
            Route::get('/dashboard-summary', function () {
                return response()->json([
                    'data' => 'Summary data for managers and owners.'
                ]);
            });
            // Example: Route::apiResource('/menu-items', MenuItemController::class);
        });

        // === OWNER ONLY ROUTES ===
        Route::middleware('role:owner')->prefix('owner')->group(function () {
            Route::get('/financial-reports', function () {
                return response()->json([
                    'data' => 'Financial reports for restaurant owner only.'
                ]);
            });
            // Example: Route::apiResource('/branches', BranchController::class);
        });
    });
});
