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
            $table->index('role');
            $table->index('vip_level');
        });

        // -------------------------
        // 2. Bảng branches (chi nhánh nhà hàng)
        // -------------------------
        Schema::create('branches', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('address')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->timestamps();
        });

        // -------------------------
        // 3. Bảng tables (bàn)
        // -------------------------
        Schema::create('tables', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('seats');
            $table->enum('status',['available','occupied','reserved'])->default('available');
            $table->foreignId('branch_id')->constrained('branches')->cascadeOnDelete();
            $table->timestamps();
        });

        // -------------------------
        // 4. Bảng bookings (đặt bàn)
        // -------------------------
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('table_id')->constrained('tables')->cascadeOnDelete();
            $table->dateTime('booking_time');
            $table->integer('people_count');
            $table->enum('status',['pending','confirmed','cancelled','completed'])->default('pending');
            $table->text('special_request')->nullable();
            $table->timestamps();
        });
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('branch_id');
            $table->unsignedBigInteger('table_id');
            $table->unsignedBigInteger('user_id');
            $table->dateTime('reservation_time');
            $table->tinyInteger('status')->default(0);
            $table->string('note')->nullable();
            $table->timestamps();
        });
        Schema::create('restaurant_tables', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('capacity')->default(4);
            $table->integer('status')->default(0);
            $table->timestamps();
        });


        // -------------------------
        // 5. Bảng menus (món ăn)
        // -------------------------
        Schema::create('menu_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('menus', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price',12,2);
            $table->integer('calories')->nullable();
            $table->enum('status',['available','unavailable'])->default('available');
            $table->string('image')->nullable();
            $table->foreignId('category_id')->constrained('menu_categories')->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('combos', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price',12,2);
            $table->json('menu_ids'); // danh sách menu trong combo
            $table->timestamps();
        });

        // -------------------------
        // 6. Bảng orders (đặt món)
        // -------------------------
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->nullable()->constrained('bookings')->nullOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('menu_id')->constrained('menus')->cascadeOnDelete();
            $table->integer('quantity')->default(1);
            $table->text('special_request')->nullable();
            $table->enum('status',['pending','preparing','served','cancelled'])->default('pending');
            $table->timestamps();
        });

        // -------------------------
        // 7. Bảng loyalty_cards
        // -------------------------
        Schema::create('loyalty_cards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->enum('level',['silver','gold','diamond'])->default('silver');
            $table->integer('points')->default(0);
            $table->timestamps();
        });

        // -------------------------
        // 8. Bảng feedbacks
        // -------------------------
        Schema::create('feedbacks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('order_id')->nullable()->constrained('orders')->nullOnDelete();
            $table->tinyInteger('rating')->default(5);
            $table->text('comment')->nullable();
            $table->enum('type',['food','service'])->default('food');
            $table->timestamps();
        });

        // -------------------------
        // 9. Bảng payments
        // -------------------------
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('booking_id')->nullable()->constrained('bookings')->nullOnDelete();
            $table->decimal('amount',12,2);
            $table->enum('method',['VNPAY','MoMo','BankTransfer','Cash'])->default('Cash');
            $table->enum('status',['pending','paid','failed'])->default('pending');
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });

        // -------------------------
        // 10. Bảng waiting_list
        // -------------------------
        Schema::create('waiting_list', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->integer('people_count');
            $table->dateTime('desired_time');
            $table->foreignId('branch_id')->constrained('branches')->cascadeOnDelete();
            $table->enum('status',['waiting','notified','cancelled'])->default('waiting');
            $table->timestamps();
        });

        // -------------------------
        // 11. Bảng employees
        // -------------------------
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->enum('position',['Receptionist','Waiter','Kitchen','Cashier']);
            $table->enum('status',['active','inactive'])->default('active');
            $table->foreignId('branch_id')->constrained('branches')->cascadeOnDelete();
            $table->timestamps();
        });

        // -------------------------
        // 12. Bảng schedules
        // -------------------------
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->cascadeOnDelete();
            $table->date('date');
            $table->time('shift_start');
            $table->time('shift_end');
            $table->timestamps();
        });

        // -------------------------
        // 13. Bảng roles
        // -------------------------
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->json('permissions');
            $table->timestamps();
        });

        // -------------------------
        // 14. Bảng inventory
        // -------------------------
        Schema::create('inventory', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('quantity')->default(0);
            $table->string('unit')->default('kg');
            $table->foreignId('branch_id')->constrained('branches')->cascadeOnDelete();
            $table->timestamps();
        });

        // -------------------------
        // 15. Bảng suppliers
        // -------------------------
        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->timestamps();
        });

        // -------------------------
        // 16. Bảng promotions
        // -------------------------
        Schema::create('promotions', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->integer('discount');
            $table->date('start_date');
            $table->date('end_date');
            $table->enum('status',['active','inactive'])->default('active');
            $table->timestamps();
        });

        // -------------------------
        // 17. Bảng expenses
        // -------------------------
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->decimal('amount',12,2);
            $table->date('date');
            $table->text('note')->nullable();
            $table->foreignId('branch_id')->constrained('branches')->cascadeOnDelete();
            $table->timestamps();
        });

        // -------------------------
        // 18. Bảng managers
        // -------------------------
        Schema::create('managers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('branch_id')->constrained('branches')->cascadeOnDelete();
            $table->timestamps();
        });

        // -------------------------
        // 19. Bảng reports
        // -------------------------
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->constrained('branches')->cascadeOnDelete();
            $table->enum('type',['daily','monthly','yearly']);
            $table->decimal('revenue',12,2);
            $table->decimal('expense',12,2);
            $table->decimal('profit',12,2);
            $table->date('date');
            $table->timestamps();
        });

        // -------------------------
        // 20. Bảng password_resets
        // -------------------------
        Schema::create('password_resets', function (Blueprint $table) {
            $table->string('email')->index();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        // -------------------------
        // 21. Bảng sessions
        // -------------------------
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete()->index();
            $table->string('ip_address',45)->nullable();
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
        Schema::dropIfExists('managers');
        Schema::dropIfExists('expenses');
        Schema::dropIfExists('promotions');
        Schema::dropIfExists('suppliers');
        Schema::dropIfExists('inventory');
        Schema::dropIfExists('roles');
        Schema::dropIfExists('schedules');
        Schema::dropIfExists('employees');
        Schema::dropIfExists('waiting_list');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('feedbacks');
        Schema::dropIfExists('loyalty_cards');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('combos');
        Schema::dropIfExists('menus');
        Schema::dropIfExists('menu_categories');
        Schema::dropIfExists('bookings');
        Schema::dropIfExists('tables');
        Schema::dropIfExists('branches');
        Schema::dropIfExists('users');
    }
};
