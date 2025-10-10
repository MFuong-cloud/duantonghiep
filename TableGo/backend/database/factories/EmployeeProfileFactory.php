<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EmployeeProfile>
 */
class EmployeeProfileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Lưu ý: user_id và branch_id sẽ được cung cấp từ Seeder
        // Factory này chỉ định nghĩa các giá trị còn lại.
        return [
            'employee_code' => 'EMP' . fake()->unique()->randomNumber(5, true),
            'position' => fake()->randomElement(['Waiter', 'Receptionist', 'Kitchen', 'Cashier']),
            'hire_date' => Carbon::now()->subMonths(fake()->numberBetween(1, 12)),
            'salary' => fake()->randomElement([10000000, 12000000, 15000000, 20000000]),
            'status' => 'active',
        ];
    }
}
