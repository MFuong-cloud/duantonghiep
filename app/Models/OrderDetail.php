<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        // 'order_id',
        // 'dish_id',
        // 'quantity',
        // 'price',
        // 'note',
        'order_id',
        'menu_id',
        'quantity',
        'price',
        
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // public function dish()
    // {
    //     return $this->belongsTo(Dish::class);
    // }
    public function menu()
    {
        return $this->belongsTo(Menu::class);
    }
}

