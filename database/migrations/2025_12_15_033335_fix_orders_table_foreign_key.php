<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            // Xóa foreign key cũ nếu tồn tại
            try {
                $table->dropForeign(['table_id']);
            } catch (\Exception $e) {
                // Ignore if not exists
            }
        });

        Schema::table('orders', function (Blueprint $table) {
            // Tạo lại foreign key đúng
            $table->foreign('table_id')
                ->references('id')
                ->on('restaurant_tables')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['table_id']);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->foreign('table_id')
                ->references('id')
                ->on('tables')
                ->nullOnDelete();
        });
    }
};
