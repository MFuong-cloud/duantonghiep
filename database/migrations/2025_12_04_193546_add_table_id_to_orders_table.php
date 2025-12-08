<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            // Chỉ thêm nếu chưa tồn tại
            if (!Schema::hasColumn('orders', 'table_id')) {
                $table->unsignedBigInteger('table_id')->nullable()->after('user_id');
                $table->foreign('table_id')->references('id')->on('tables')->nullOnDelete();
            }
        });
    }

    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['table_id']);
            $table->dropColumn('table_id');
        });
    }

};
