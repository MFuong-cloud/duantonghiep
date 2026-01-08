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
    public function up(): void
    {
        // Thay đổi column status từ enum('available', 'occupied') sang enum('available', 'occupied', 'reserved')
        DB::statement("ALTER TABLE restaurant_tables MODIFY COLUMN status ENUM('available', 'occupied', 'reserved') DEFAULT 'available'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Rollback về enum cũ
        DB::statement("ALTER TABLE restaurant_tables MODIFY COLUMN status ENUM('available', 'occupied') DEFAULT 'available'");
    }
};
