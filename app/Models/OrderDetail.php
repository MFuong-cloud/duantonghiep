<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'dish_id',
        'quantity',
        'price',
        'note',
        'status',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'price' => 'integer',
        'quantity' => 'integer',
        'status' => 'integer',
    ];

    /** Mỗi chi tiết thuộc 1 order */
    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    /** Mỗi chi tiết ứng với 1 món ăn */
    public function dish()
    {
        return $this->belongsTo(Dish::class, 'dish_id')->withTrashed();
    }
}
