<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Role;
use App\Models\Branch;
use App\Models\TableArea;
use App\Models\Table;
use App\Models\EmployeeProfile;
use App\Models\MenuCategory;
use App\Models\MenuItem;
use App\Models\Combo;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // ----------------------------------------------------------------
        // BLOCK 1: SEED ROLES - Phải chạy đầu tiên
        // ----------------------------------------------------------------
        $this->command->info('Seeding Roles...');
        $ownerRole = Role::firstOrCreate(['name' => 'owner', 'description' => 'Chủ nhà hàng, có toàn quyền.']);
        $managerRole = Role::firstOrCreate(['name' => 'manager', 'description' => 'Quản lý chi nhánh.']);
        $employeeRole = Role::firstOrCreate(['name' => 'employee', 'description' => 'Nhân viên (lễ tân, phục vụ...).']);
        $customerRole = Role::firstOrCreate(['name' => 'customer', 'description' => 'Khách hàng.']);


        // ----------------------------------------------------------------
        // BLOCK 2: SEED BRANCHES, AREAS, TABLES
        // ----------------------------------------------------------------
        $this->command->info('Seeding Branches, Table Areas, and Tables...');
        $branch1 = Branch::create(['name' => 'TableGo - Chi nhánh Cầu Giấy', 'address' => '123 Cầu Giấy, Hà Nội']);
        $branch2 = Branch::create(['name' => 'TableGo - Chi nhánh Ba Đình', 'address' => '456 Ba Đình, Hà Nội']);

        $areas = ['Tầng 1', 'Tầng 2', 'Sân vườn'];
        foreach ([$branch1, $branch2] as $branch) {
            foreach ($areas as $areaName) {
                $area = TableArea::create([
                    'branch_id' => $branch->id,
                    'name' => $areaName,
                ]);

                for ($i = 1; $i <= 10; $i++) {
                    Table::create([
                        'table_area_id' => $area->id,
                        'name' => "Bàn " . $area->id . "-$i",
                        'seats' => rand(2, 8),
                        'position_x' => rand(10, 500),
                        'position_y' => rand(10, 300),
                    ]);
                }
            }
        }

        // ----------------------------------------------------------------
        // BLOCK 3: SEED USERS & EMPLOYEE PROFILES
        // ----------------------------------------------------------------
        $this->command->info('Seeding Users and Employee Profiles...');
        // --- Tạo Owner ---
        $owner = User::create([
            'name' => 'TableGo Owner',
            'email' => 'owner@tablego.com',
            'password' => Hash::make('password'),
        ]);
        $owner->roles()->attach($ownerRole);

        // --- Tạo Manager ---
        $manager = User::create([
            'name' => 'Manager Branch 1',
            'email' => 'manager1@tablego.com',
            'password' => Hash::make('password'),
        ]);
        $manager->roles()->attach($managerRole);
        EmployeeProfile::create([
            'user_id' => $manager->id,
            'branch_id' => $branch1->id,
            'position' => 'Manager',
            'employee_code' => 'MNG001',
            'hire_date' => Carbon::now()->subMonths(6),
        ]);

        // --- Tạo Employees ---
        for ($i = 1; $i <= 10; $i++) {
            $employeeUser = User::create([
                'name' => "Employee {$i}",
                'email' => "employee{$i}@tablego.com",
                'password' => Hash::make('password'),
            ]);
            $employeeUser->roles()->attach($employeeRole);
            EmployeeProfile::create([
                'user_id' => $employeeUser->id,
                'branch_id' => rand(1, 2),
                'position' => ['Waiter', 'Receptionist', 'Kitchen'][array_rand(['Waiter', 'Receptionist', 'Kitchen'])],
                'employee_code' => "EMP00{$i}",
                'hire_date' => Carbon::now()->subMonths(rand(1, 5)),
            ]);
        }

        // --- Tạo Customers ---
        User::factory()->count(20)->create()->each(function ($user) use ($customerRole) {
            $user->roles()->attach($customerRole);
        });

        // ----------------------------------------------------------------
        // BLOCK 4: SEED MENUS & COMBOS
        // ----------------------------------------------------------------
        $this->command->info('Seeding Menu Categories, Items, and Combos...');
        $categories = ['Khai vị', 'Món chính', 'Tráng miệng', 'Đồ uống', 'Lẩu'];
        foreach ($categories as $categoryName) {
            MenuCategory::create(['name' => $categoryName]);
        }

        MenuItem::factory()->count(50)->create();
        $combos = Combo::factory()->count(10)->create();
        $menuItems = MenuItem::all();

        foreach ($combos as $combo) {
            $itemsToAttach = $menuItems->random(rand(3, 5))->pluck('id');
            $combo->menuItems()->attach($itemsToAttach);
        }

        // ----------------------------------------------------------------
        // BLOCK 5: SEED ORDERS & PAYMENTS
        // ----------------------------------------------------------------
        $this->command->info('Seeding Orders and Payments...');
        $customers = User::whereHas('roles', fn($q) => $q->where('name', 'customer'))->get();
        $tables = Table::all();

        for ($i = 0; $i < 50; $i++) {
            $order = Order::create([
                'user_id' => $customers->random()->id,
                'branch_id' => rand(1, 2),
                'table_id' => $tables->random()->id,
                'status' => 'completed',
                'type' => 'dine-in',
                'created_at' => Carbon::now()->subDays(rand(0, 30)),
                'updated_at' => Carbon::now()->subDays(rand(0, 30)),
            ]);

            $totalAmount = 0;
            $itemCount = rand(2, 5);
            for ($j = 0; $j < $itemCount; $j++) {
                $menuItem = $menuItems->random();
                $quantity = rand(1, 3);
                $price = $menuItem->price;
                $totalAmount += $price * $quantity;

                OrderItem::create([
                    'order_id' => $order->id,
                    'orderable_id' => $menuItem->id,
                    'orderable_type' => MenuItem::class,
                    'quantity' => $quantity,
                    'price' => $price,
                ]);
            }

            $order->update([
                'total_amount' => $totalAmount,
                'final_amount' => $totalAmount, // Giả sử chưa có giảm giá
            ]);

            Payment::create([
                'order_id' => $order->id,
                'amount' => $order->final_amount,
                'method' => 'Cash',
                'status' => 'paid',
                'paid_at' => $order->created_at,
            ]);
        }
    }
}
