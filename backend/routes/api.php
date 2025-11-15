<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BranchController;
use App\Http\Controllers\Api\TableCategoryController;
use App\Http\Controllers\Api\RestaurantTableController;
use App\Http\Controllers\Api\CategoryController;

use App\Http\Controllers\Api\DishController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\OrderDetailController;
use App\Http\Controllers\Api\OrderHistoryController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\TableTypeController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| Đây là nơi định nghĩa các route API cho ứng dụng.
| Mọi route ở đây đều sẽ có prefix là /api/
*/

// =============================
// 🔹 AUTH (Người dùng)
// =============================
Route::prefix('auth')->group(function () {
    // 🟢 Đăng ký
    Route::post('/register', [AuthController::class, 'register']);

    // 🟢 Đăng nhập
    Route::post('/login', [AuthController::class, 'login']);

    // 🟢 Các route cần token
    Route::middleware('auth:sanctum')->group(function () {
        // 🔴 Đăng xuất
        Route::post('/logout', [AuthController::class, 'logout']);

        // 🟢 Lấy thông tin người dùng hiện tại
        Route::get('/me', function (\Illuminate\Http\Request $request) {
            return response()->json($request->user());
        });
    });
});


// =============================
// 🔹 CHI NHÁNH (branches)
// =============================
Route::prefix('branches')->group(function () {
    Route::get('/', [BranchController::class, 'index']);     // Danh sách chi nhánh
    Route::post('/', [BranchController::class, 'store']);    // Thêm chi nhánh
    Route::get('/{id}', [BranchController::class, 'show']);  // Xem chi tiết chi nhánh
    Route::put('/{id}', [BranchController::class, 'update']); // Cập nhật chi nhánh
    Route::delete('/{id}', [BranchController::class, 'destroy']); // Xóa chi nhánh
});


// =============================
// 🔹 LOẠI BÀN (table_categories)
// =============================
Route::prefix('table-categories')->group(function () {
    Route::get('/', [TableCategoryController::class, 'index']);    // Danh sách loại bàn
    Route::post('/', [TableCategoryController::class, 'store']);   // Thêm loại bàn
    Route::get('/{id}', [TableCategoryController::class, 'show']); // Xem chi tiết loại bàn
    Route::put('/{id}', [TableCategoryController::class, 'update']); // Cập nhật loại bàn
    Route::delete('/{id}', [TableCategoryController::class, 'destroy']); // Xóa loại bàn
});


// =============================
// 🔹 DANH SÁCH BÀN (restaurant_tables)
// =============================
Route::prefix('restaurant-tables')->group(function () {
    Route::get('/', [RestaurantTableController::class, 'index']);     // Danh sách bàn
    Route::post('/', [RestaurantTableController::class, 'store']);    // Thêm bàn
    Route::get('/{id}', [RestaurantTableController::class, 'show']);  // Xem chi tiết bàn
    Route::put('/{id}', [RestaurantTableController::class, 'update']); // Cập nhật bàn
    Route::delete('/{id}', [RestaurantTableController::class, 'destroy']); // Xóa bàn
});


Route::apiResource('categories', CategoryController::class);
Route::apiResource('categories', CategoryController::class);
Route::apiResource('dishes', DishController::class);
Route::apiResource('reservations', ReservationController::class);
Route::apiResource('orders', OrderController::class);
Route::apiResource('order-details', OrderDetailController::class);
Route::apiResource('order-history', OrderHistoryController::class);

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);

        // 🟢 Quản lý phiên đăng nhập
        Route::get('/sessions', [AuthController::class, 'sessions']);
        Route::post('/logout-session/{id}', [AuthController::class, 'logoutSession']);
    });
});

Route::get('/settings', [SettingController::class, 'getConfig']);
Route::post('/settings', [SettingController::class, 'updateConfig']);

Route::get('/table-types', [TableTypeController::class, 'index']);
Route::post('/table-types', [TableTypeController::class, 'store']);
Route::put('/table-types/{id}', [TableTypeController::class, 'update']);
Route::delete('/table-types/{id}', [TableTypeController::class, 'destroy']);

