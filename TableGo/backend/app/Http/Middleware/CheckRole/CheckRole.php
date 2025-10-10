<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string[]  ...$roles Các vai trò được phép truy cập
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // Người dùng phải được xác thực trước khi kiểm tra vai trò
        if (!Auth::check()) {
            return response()->json(['message' => 'Yêu cầu xác thực.'], 401);
        }

        $user = Auth::user();

        // Kiểm tra xem người dùng có bất kỳ vai trò nào được yêu cầu không
        foreach ($roles as $role) {
            if ($user->hasRole($role)) {
                // Nếu có, cho phép request tiếp tục
                return $next($request);
            }
        }

        // Nếu không có vai trò phù hợp, trả về lỗi 403 Forbidden
        return response()->json(['message' => 'Bạn không có quyền truy cập vào khu vực này.'], 403);
    }
}
