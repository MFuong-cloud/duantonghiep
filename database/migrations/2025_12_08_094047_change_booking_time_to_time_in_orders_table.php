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
            // Drop cột booking_time cũ
            $table->dropColumn('booking_time');
        });
        
        Schema::table('orders', function (Blueprint $table) {
            // Thêm lại cột booking_time với kiểu TIME
            $table->time('booking_time')->after('booking_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Drop cột TIME
            $table->dropColumn('booking_time');
        });
        
        Schema::table('orders', function (Blueprint $table) {
            // Thêm lại cột booking_time kiểu unsignedSmallInteger
            $table->unsignedSmallInteger('booking_time')->after('booking_date');
        });
    }
};
