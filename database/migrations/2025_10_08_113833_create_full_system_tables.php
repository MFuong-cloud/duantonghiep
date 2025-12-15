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
            $table->foreignId('table_id')->nullable()->constrained('tables')->nullOnDelete();
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

        /* id, user_id, họ tên, sdt, ngày, giờ, số người, ghi chú, thêm trường tổng tiền, created_at, created_by, updated_at, updated_by*/
        // -------------------------
        // 5. Bảng loyalty_cards
        // -------------------------
        Schema::create('loyalty_cards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->enum('level', ['silver', 'gold', 'diamond'])->default('silver');
            $table->integer('points')->default(0);
            $table->timestamps();
        });

        // -------------------------
        // 6. Bảng feedbacks
        // -------------------------
        Schema::create('feedbacks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('order_id')->nullable()->constrained('orders')->nullOnDelete();
            $table->tinyInteger('rating')->default(5);
            $table->text('comment')->nullable();
            $table->enum('type', ['food', 'service'])->default('food');
            $table->timestamps();
        });

        // -------------------------
        // 7. Bảng payments
        // -------------------------
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            /*$table->foreignId('booking_id')->nullable()->constrained('bookings')->nullOnDelete();*/
            $table->decimal('amount', 12, 2);
            $table->enum('method', ['VNPAY', 'MoMo', 'BankTransfer', 'Cash'])->default('Cash');
            $table->enum('status', ['pending', 'paid', 'failed'])->default('pending');
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });

        // -------------------------
        // 8. Bảng promotions
        // -------------------------
        Schema::create('promotions', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->integer('discount');
            $table->date('start_date');
            $table->date('end_date');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });

        // -------------------------
        // 9. Bảng reports
        // -------------------------
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['daily', 'monthly', 'yearly']);
            $table->decimal('revenue', 12, 2);
            $table->decimal('expense', 12, 2);
            $table->decimal('profit', 12, 2);
            $table->date('date');
            $table->timestamps();
        });

        // -------------------------
        // 10. Bảng password_resets
        // -------------------------
        Schema::create('password_resets', function (Blueprint $table) {
            $table->string('email')->index();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        // -------------------------
        // 11. Bảng sessions
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
        Schema::dropIfExists('reports');
        Schema::dropIfExists('promotions');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('feedbacks');
        Schema::dropIfExists('loyalty_cards');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('users');
    }
};
