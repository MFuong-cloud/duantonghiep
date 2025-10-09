<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // -----------------------------
        // 1. Seed users
        // -----------------------------
        $users = [];
        for ($i = 1; $i <= 10; $i++) {
            $users[] = [
                'name' => "Customer $i",
                'email' => "customer$i@example.com",
                'phone' => "09000000$i",
                'password' => Hash::make('123456'),
                'role' => 'customer',
                'vip_level' => 'none',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // Thêm Owner và Manager
        $users[] = [
            'name' => 'Owner TableGo',
            'email' => 'owner@example.com',
            'phone' => '0910000000',
            'password' => Hash::make('123456'),
            'role' => 'owner',
            'vip_level' => 'diamond',
            'created_at' => now(),
            'updated_at' => now(),
        ];

        $users[] = [
            'name' => 'Manager Branch 1',
            'email' => 'manager1@example.com',
            'phone' => '0920000000',
            'password' => Hash::make('123456'),
            'role' => 'manager',
            'vip_level' => 'gold',
            'created_at' => now(),
            'updated_at' => now(),
        ];

        DB::table('users')->insert($users);

        // -----------------------------
        // 2. Seed branches
        // -----------------------------
        $branches = [];
        for ($i = 1; $i <= 2; $i++) {
            $branches[] = [
                'name' => "Branch $i",
                'address' => "123 Street $i",
                'phone' => "099$i",
                'email' => "branch$i@example.com",
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('branches')->insert($branches);

        // -----------------------------
        // 3. Seed tables
        // -----------------------------
        $tables = [];
        foreach ([1,2] as $branch_id) {
            for ($i = 1; $i <= 10; $i++) {
                $tables[] = [
                    'name' => "Table $i",
                    'seats' => rand(2,6),
                    'status' => 'available',
                    'branch_id' => $branch_id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        DB::table('tables')->insert($tables);

        // -----------------------------
        // 4. Seed menu categories
        // -----------------------------
        $categories = ['Khai vị','Món chính','Tráng miệng','Đồ uống'];
        foreach ($categories as $cat) {
            DB::table('menu_categories')->insert([
                'name' => $cat,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // -----------------------------
        // 5. Seed menus
        // -----------------------------
        $menus = [];
        for ($i = 1; $i <= 20; $i++) {
            $menus[] = [
                'name' => "Menu Item $i",
                'description' => "Description for Menu Item $i",
                'price' => rand(50,500),
                'calories' => rand(100,800),
                'status' => 'available',
                'image' => null,
                'category_id' => rand(1, count($categories)),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('menus')->insert($menus);

        // -----------------------------
        // 6. Seed combos
        // -----------------------------
        $combos = [];
        for ($i = 1; $i <= 5; $i++) {
            $combo_menus = range(($i-1)*4+1, ($i-1)*4+4);
            $combos[] = [
                'name' => "Combo $i",
                'description' => "Combo includes menus: ".implode(',', $combo_menus),
                'price' => rand(200,800),
                'menu_ids' => json_encode($combo_menus),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('combos')->insert($combos);

        // -----------------------------
        // 7. Seed bookings
        // -----------------------------
        $bookings = [];
        $user_ids = range(1,10);
        $table_ids = range(1,20);
        foreach ($user_ids as $user_id) {
            $bookings[] = [
                'user_id' => $user_id,
                'table_id' => rand(1,20),
                'booking_time' => Carbon::now()->addDays(rand(1,30)),
                'people_count' => rand(1,6),
                'status' => 'pending',
                'special_request' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('bookings')->insert($bookings);

        // -----------------------------
        // 8. Seed orders
        // -----------------------------
        $orders = [];
        foreach ($bookings as $index => $booking) {
            for ($i = 1; $i <= 2; $i++) {
                $orders[] = [
                    'booking_id' => $index+1,
                    'user_id' => $booking['user_id'],
                    'menu_id' => rand(1,20),
                    'quantity' => rand(1,3),
                    'special_request' => null,
                    'status' => 'pending',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        DB::table('orders')->insert($orders);

        // -----------------------------
        // 9. Seed loyalty cards
        // -----------------------------
        foreach ($user_ids as $user_id) {
            DB::table('loyalty_cards')->insert([
                'user_id' => $user_id,
                'level' => 'silver',
                'points' => rand(0,1000),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // -----------------------------
        // 10. Seed employees
        // -----------------------------
        $positions = ['Receptionist','Waiter','Kitchen','Cashier'];
        foreach ([1,2] as $branch_id) {
            for ($i = 1; $i <= 5; $i++) {
                DB::table('employees')->insert([
                    'name' => "Employee $i Branch $branch_id",
                    'email' => "employee{$i}_branch{$branch_id}@example.com",
                    'phone' => "093{$i}{$branch_id}",
                    'position' => $positions[array_rand($positions)],
                    'status' => 'active',
                    'branch_id' => $branch_id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // -----------------------------
        // 11. Seed schedules
        // -----------------------------
        $employee_ids = DB::table('employees')->pluck('id')->toArray();
        foreach ($employee_ids as $emp_id) {
            DB::table('schedules')->insert([
                'employee_id' => $emp_id,
                'date' => Carbon::today()->addDays(rand(0,10)),
                'shift_start' => '09:00:00',
                'shift_end' => '17:00:00',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // -----------------------------
        // 12. Seed managers
        // -----------------------------
        DB::table('managers')->insert([
            'user_id' => 12, // Manager Branch 1
            'branch_id' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // -----------------------------
        // 13. Seed payments (optional)
        // -----------------------------
        foreach ($bookings as $index => $booking) {
            DB::table('payments')->insert([
                'user_id' => $booking['user_id'],
                'booking_id' => $index+1,
                'amount' => rand(100,1000),
                'method' => 'Cash',
                'status' => 'paid',
                'paid_at' => Carbon::now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // -----------------------------
        // 14. Seed feedbacks (optional)
        // -----------------------------
        foreach ($orders as $index => $order) {
            DB::table('feedbacks')->insert([
                'user_id' => $order['user_id'],
                'order_id' => $index+1,
                'rating' => rand(3,5),
                'comment' => "Feedback for order $index",
                'type' => 'food',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
