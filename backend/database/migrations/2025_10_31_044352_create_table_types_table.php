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
  // database/migrations/xxxx_create_table_types_table.php
Schema::create('table_types', function (Blueprint $table) {
    $table->id();
    $table->string('name'); // Tên loại bàn (VIP, 4 người, 10 người...)
    $table->integer('capacity'); // Số chỗ ngồi
    $table->text('description')->nullable();
    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('table_types');
    }
};
