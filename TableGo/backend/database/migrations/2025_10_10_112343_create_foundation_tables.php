<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Bảng roles (vai trò) - linh hoạt hơn enum
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // owner, manager, employee, customer
            $table->string('description')->nullable();
            $table->timestamps();
        });

        // 2. Bảng users (người dùng) - trung tâm xác thực
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique()->nullable();
            $table->string('phone')->unique()->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password')->nullable();
            $table->string('avatar')->nullable();
            // Bổ sung cho Social Login
            $table->string('provider_name')->nullable()->comment('google, facebook');
            $table->string('provider_id')->nullable();
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
        });

        // Bảng trung gian gán vai trò cho người dùng
        Schema::create('role_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('role_id')->constrained('roles')->cascadeOnDelete();
            $table->timestamps();
        });

        // 3. Bảng branches (chi nhánh)
        Schema::create('branches', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('address');
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // 4. Bảng employee_profiles (hồ sơ nhân viên) - tách biệt thông tin nghiệp vụ
        Schema::create('employee_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->foreignId('branch_id')->constrained('branches')->cascadeOnDelete();
            $table->string('employee_code')->unique();
            $table->enum('position', ['Receptionist', 'Waiter', 'Kitchen', 'Cashier', 'Manager']);
            $table->date('hire_date');
            $table->decimal('salary', 12, 2)->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });

        // 5. Bảng table_areas (khu vực bàn) - Bổ sung để quản lý sơ đồ
        Schema::create('table_areas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->constrained('branches')->cascadeOnDelete();
            $table->string('name'); // Tầng 1, Ban công, Sân vườn...
            $table->timestamps();
        });

        // 6. Bảng tables (bàn)
        Schema::create('tables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('table_area_id')->constrained('table_areas')->cascadeOnDelete();
            $table->string('name');
            $table->integer('seats');
            $table->enum('status', ['available', 'occupied', 'reserved', 'cleaning'])->default('available');
            // Bổ sung tọa độ để vẽ sơ đồ bàn
            $table->integer('position_x')->default(0);
            $table->integer('position_y')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });

        // 7. Bảng bookings (đặt chỗ)
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('table_id')->constrained('tables')->cascadeOnDelete();
            $table->foreignId('branch_id')->constrained('branches')->cascadeOnDelete();
            $table->dateTime('booking_time');
            $table->integer('duration_minutes')->default(120); // Thời gian dự kiến ngồi
            $table->integer('people_count');
            $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed', 'no_show'])->default('pending');
            $table->text('special_request')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // 8. Bảng menu_categories (danh mục món)
        Schema::create('menu_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
            $table->softDeletes();
        });

        // 9. Bảng menu_items (các món ăn) - Đổi tên từ menus
        Schema::create('menu_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('menu_categories')->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 12, 2);
            $table->string('image')->nullable();
            $table->integer('calories')->nullable();
            $table->boolean('is_available')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        // 10. Bảng combos
        Schema::create('combos', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 12, 2);
            $table->string('image')->nullable();
            $table->boolean('is_available')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        // Bảng trung gian combo_menu - Cải tiến từ JSON
        Schema::create('combo_menu_item', function (Blueprint $table) {
            $table->id();
            $table->foreignId('combo_id')->constrained('combos')->cascadeOnDelete();
            $table->foreignId('menu_item_id')->constrained('menu_items')->cascadeOnDelete();
            $table->integer('quantity')->default(1);
        });

        // 11. Bảng orders (hóa đơn) - Cải tiến cốt lõi
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('branch_id')->constrained('branches');
            $table->foreignId('table_id')->nullable()->constrained('tables');
            $table->foreignId('booking_id')->nullable()->constrained('bookings');
            $table->foreignId('employee_id')->nullable()->constrained('users'); // Nhân viên tạo đơn
            $table->decimal('total_amount', 12, 2)->default(0);
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->decimal('final_amount', 12, 2)->default(0);
            $table->enum('status', ['pending', 'processing', 'completed', 'cancelled'])->default('pending');
            $table->enum('type', ['dine-in', 'takeaway'])->default('dine-in'); // Bổ sung loại hình
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // 12. Bảng order_items (chi tiết món trong hóa đơn) - Cải tiến cốt lõi
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->morphs('orderable'); // Có thể là menu_item hoặc combo
            $table->integer('quantity');
            $table->decimal('price', 12, 2)->comment('Giá tại thời điểm đặt hàng');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // 13. Bảng payments (thanh toán)
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->decimal('amount', 12, 2);
            $table->enum('method', ['VNPAY', 'MoMo', 'BankTransfer', 'Cash']);
            $table->enum('status', ['pending', 'paid', 'failed'])->default('pending');
            $table->timestamp('paid_at')->nullable();
            $table->string('transaction_code')->nullable(); // Mã giao dịch từ cổng thanh toán
            $table->timestamps();
        });

        // 14. Bảng feedbacks (đánh giá)
        Schema::create('feedbacks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('order_id')->constrained('orders');
            $table->tinyInteger('rating')->unsigned(); // 1-5 sao
            $table->text('comment')->nullable();
            $table->timestamps();
        });

        // 15. Bảng suppliers (nhà cung cấp)
        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('contact_person')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // 16. Bảng ingredients (nguyên liệu) - Đổi tên từ inventory
        Schema::create('ingredients', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('unit')->comment('kg, g, lit, ml, cai, hop');
            $table->double('stock_quantity')->default(0);
            $table->double('alert_quantity')->default(0)->comment('Số lượng cảnh báo sắp hết');
            $table->timestamps();
        });

        // Bảng trung gian menu_item_ingredient (công thức) - Bổ sung để quản lý kho
        Schema::create('menu_item_ingredient', function (Blueprint $table) {
            $table->id();
            $table->foreignId('menu_item_id')->constrained('menu_items')->cascadeOnDelete();
            $table->foreignId('ingredient_id')->constrained('ingredients')->cascadeOnDelete();
            $table->double('quantity'); // Số lượng nguyên liệu cho 1 đơn vị món ăn
        });

        // 17. Bảng promotions (khuyến mãi)
        Schema::create('promotions', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('type', ['percentage', 'fixed_amount'])->default('percentage');
            $table->decimal('value', 12, 2);
            $table->timestamp('start_date');
            $table->timestamp('end_date');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        // 18. Bảng notifications (thông báo) - Bổ sung
        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('type');
            $table->morphs('notifiable');
            $table->text('data');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        // Drop theo thứ tự ngược lại để đảm bảo ràng buộc khóa ngoại
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('promotions');
        Schema::dropIfExists('menu_item_ingredient');
        Schema::dropIfExists('ingredients');
        Schema::dropIfExists('suppliers');
        Schema::dropIfExists('feedbacks');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('combo_menu_item');
        Schema::dropIfExists('combos');
        Schema::dropIfExists('menu_items');
        Schema::dropIfExists('menu_categories');
        Schema::dropIfExists('bookings');
        Schema::dropIfExists('tables');
        Schema::dropIfExists('table_areas');
        Schema::dropIfExists('employee_profiles');
        Schema::dropIfExists('branches');
        Schema::dropIfExists('role_user');
        Schema::dropIfExists('users');
        Schema::dropIfExists('roles');
    }
};
