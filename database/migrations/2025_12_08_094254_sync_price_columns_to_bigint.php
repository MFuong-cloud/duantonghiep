<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Đồng bộ tất cả các cột price về bigInteger để nhất quán với bảng dishes
     */
    public function up(): void
    {
        // Sửa price trong order_details từ decimal sang bigInteger
        Schema::table('order_details', function (Blueprint $table) {
            $table->unsignedBigInteger('price')->default(0)->change();
        });

        // Đảm bảo total_price trong orders cũng là unsignedBigInteger
        // (Đã đúng rồi nhưng đảm bảo consistency)
        Schema::table('orders', function (Blueprint $table) {
            $table->unsignedBigInteger('total_price')->default(0)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Rollback về decimal nếu cần
        Schema::table('order_details', function (Blueprint $table) {
            $table->decimal('price', 12, 2)->default(0)->change();
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->unsignedBigInteger('total_price')->default(0)->change();
        });
    }
};
