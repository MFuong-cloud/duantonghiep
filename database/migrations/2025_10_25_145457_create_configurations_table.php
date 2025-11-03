<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('configurations', function (Blueprint $table) {
            $table->id();
            $table->string('restaurant_name')->default('TableGo');
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('address')->nullable();
            $table->time('open_time')->default('08:00');
            $table->time('close_time')->default('22:00');
            $table->integer('max_people_per_table')->default(6);
            $table->text('description')->nullable();
            $table->timestamps();
            $table->foreignId('branch_id')->nullable()->constrained('branches')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('configurations');
    }
};
