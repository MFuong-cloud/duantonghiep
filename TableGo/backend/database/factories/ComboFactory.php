<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Combo>
 */
class ComboFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Combo ' . fake()->unique()->words(2, true),
            'description' => fake()->sentence(),
            'price' => fake()->numberBetween(200000, 1000000),
            'is_available' => true,
        ];
    }
}
