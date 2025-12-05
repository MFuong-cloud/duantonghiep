<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RestaurantTable extends Model
{
    use HasFactory;

    protected $table = 'restaurant_tables';

    protected $fillable = [
        'name',
        'capacity',
        'status',
    ];

    // Một bàn có nhiều orders
    public function orders()
    {
        return $this->hasMany(Order::class, 'table_id');
    }
}
