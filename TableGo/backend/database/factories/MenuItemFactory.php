<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MenuItem>
 */
class MenuItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // Giả định bạn đã seed 5 danh mục có ID từ 1 đến 5
            'category_id' => fake()->numberBetween(1, 5),
            'name' => 'Món ăn ' . fake()->unique()->words(3, true),
            'description' => fake()->sentence(),
            'price' => fake()->numberBetween(50000, 500000),
            'calories' => fake()->numberBetween(100, 800),
            'is_available' => true,
        ];
    }
}
