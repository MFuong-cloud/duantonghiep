<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Bạn không có quyền truy cập!'], 403);
        }
        return $next($request);
    }
}
