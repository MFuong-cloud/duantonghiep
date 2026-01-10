<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('code')->nullable()->after('id')->unique();
        });

        // Populate existing orders with random codes
        DB::table('orders')->orderBy('id')->chunk(100, function ($orders) {
            foreach ($orders as $order) {
                // Generate format: 2 Letters + 4 Numbers (AB1234) or Random String
                // User asked: "gồm chữ và số"
                // Example: X7Z2A9
                $code = strtoupper(Str::random(6));
                // Basic check for collision (unlikely for small dataset, but migration script simple)
                // If collision, it will fail unique constraint.
                // For safety in migration, let's use:
                // ORD + ID (which is safe)
                // BUT User wants Random.
                // Risk of collision on Str::random(6) is low (2 billion combinations).
                
                // Retry logic is hard in migration.
                // Let's us ID based seed or just random.
                
                // Let's use: 2 Uppercase + 4 DigitsRandom
                // Or just Str::random(8)
                
                // To be absolutely safe for existing data without complex retry:
                // prefix random with ID? No, ugly.
                
                // I will just use Str::random(8).
                
                try {
                     DB::table('orders')->where('id', $order->id)->update(['code' => $code]);
                } catch (\Exception $e) {
                     // If collision, try again once
                     $code = strtoupper(Str::random(8));
                     DB::table('orders')->where('id', $order->id)->update(['code' => $code]);
                }
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('code');
        });
    }
};
