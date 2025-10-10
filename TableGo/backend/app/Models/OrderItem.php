<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;
    public $timestamps = false; // Thường chi tiết hóa đơn không cần timestamps riêng
    protected $fillable = [
        'order_id',
        'orderable_id',
        'orderable_type',
        'quantity',
        'price',
        'notes',
    ];
    protected $casts = ['price' => 'decimal:2'];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
    public function orderable()
    {
        return $this->morphTo();
    }
}
