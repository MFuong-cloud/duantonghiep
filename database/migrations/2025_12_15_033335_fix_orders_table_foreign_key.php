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
        // Migration này tạo foreign key cho table_id
        // Chạy sau khi bảng restaurant_tables đã được tạo (2025_12_04_194131)
        
        if (!Schema::hasTable('restaurant_tables')) {
            // Nếu bảng restaurant_tables chưa tồn tại, skip
            return;
        }
        
        Schema::table('orders', function (Blueprint $table) {
            // Kiểm tra xem foreign key đã tồn tại chưa
            $foreignKeys = DB::select("SELECT CONSTRAINT_NAME 
                FROM information_schema.TABLE_CONSTRAINTS 
                WHERE TABLE_SCHEMA = DATABASE() 
                AND TABLE_NAME = 'orders' 
                AND CONSTRAINT_TYPE = 'FOREIGN KEY'
                AND CONSTRAINT_NAME LIKE '%table_id%'");
            
            if (empty($foreignKeys)) {
                // Tạo foreign key nếu chưa có
                $table->foreign('table_id')
                    ->references('id')
                    ->on('restaurant_tables')
                    ->nullOnDelete();
            }
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
