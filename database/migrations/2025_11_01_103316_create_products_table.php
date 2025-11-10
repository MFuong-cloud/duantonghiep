<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration {
    public function up(){
        Schema::create('products', function (Blueprint $table){
            $table->id();
            $table->string('sku')->unique()->nullable();
            $table->string('name');
            $table->decimal('price', 12, 2);
            $table->integer('stock_qty')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }
    public function down(){
        Schema::dropIfExists('products');
    }
}
