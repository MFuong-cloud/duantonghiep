<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Đăng ký các service app cần (không bắt buộc)
    }

    public function boot(): void
    {
        // Bootstrapping logic (ví dụ: view composers)
    }
}
