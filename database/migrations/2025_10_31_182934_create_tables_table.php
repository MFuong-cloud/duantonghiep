<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// return new class extends Migration 
class CreateTablesTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tables', function (Blueprint $table) {
             $table->id();
        $table->string('name'); // Tên bàn
        $table->unsignedInteger('seats')->default(4); // Số ghế
        $table->enum('status', ['available', 'occupied'])->default('available'); // Trạng thái
        $table->unsignedBigInteger('branch_id'); // Chi nhánh
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tables');
    }
};
