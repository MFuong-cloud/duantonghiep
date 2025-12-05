<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Kiểm tra user đã đăng nhập chưa
        if (!$request->user()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Cho phép các role: owner, manager, employee (không cho customer)
        $allowedRoles = ['owner', 'manager', 'employee'];

        if (!in_array($request->user()->role, $allowedRoles)) {
            return response()->json(['message' => 'Bạn không có quyền truy cập!'], 403);
        }

        return $next($request);
    }
}
