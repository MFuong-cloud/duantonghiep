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
        Schema::table('dishes', function (Blueprint $table) {
            $table->renameColumn('is_active', 'status');
            $table->string('image')->nullable()->change();
        });
    }

    public function down()
    {
        Schema::table('dishes', function (Blueprint $table) {
            $table->renameColumn('status', 'is_active');
        });
    }

};
