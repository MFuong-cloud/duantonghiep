<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // -------------------------
        // 1. Bảng users
        // -------------------------
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique()->nullable();
            $table->string('phone')->unique()->nullable();
            $table->string('password')->nullable();
            $table->enum('role', ['customer', 'employee', 'manager', 'owner'])->default('customer');
            $table->enum('vip_level', ['none', 'silver', 'gold', 'diamond'])->default('none');
            $table->string('avatar')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });



        // -------------------------
        // 4. Bảng orders (đặt món)
        // -------------------------
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('ho_ten', 50);
            $table->string('phone', 15);
            $table->date('booking_date');
            $table->unsignedSmallInteger('booking_time'); 
            $table->unsignedInteger('quantity')->default(1);
            $table->text('note')->nullable();
            $table->unsignedBigInteger('total_price')->default(0);
            $table->unsignedTinyInteger('status')->default(0);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();
        });

        // -------------------------
        // 2. Bảng password_resets
        // -------------------------
        Schema::create('password_resets', function (Blueprint $table) {
            $table->string('email')->index();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        // -------------------------
        // 3. Bảng sessions
        // -------------------------
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_resets');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('users');
    }
};
