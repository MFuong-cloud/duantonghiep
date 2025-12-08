<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Đổi cột booking_time từ unsignedSmallInteger sang TIME
            $table->time('booking_time')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Đổi lại về unsignedSmallInteger nếu rollback
            $table->unsignedSmallInteger('booking_time')->change();
        });
    }
};
