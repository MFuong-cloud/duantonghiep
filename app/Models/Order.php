<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'booking_id',
        'table_id',

        'ho_ten',
        'phone',
        'booking_date',
        'booking_time',
        'quantity',
        'special_request',

        'total_price',
        'status',

        'created_by',
        'updated_by'
    ];

    protected $casts = [
        'total_price' => 'integer',
        'quantity' => 'integer',
        'status' => 'integer',
        'booking_date' => 'date',
    ];

    // ============================
    // QUAN HỆ
    // ============================

    /** Mỗi đơn hàng thuộc về 1 user */
    public function user()
    {
        return $this->belongsTo(User::class);
    }



    /** Mỗi đơn hàng thuộc về 1 booking (nếu có) */
    public function booking()
    {
        return $this->belongsTo(Booking::class, 'booking_id');
    }

    /** Mỗi đơn hàng thuộc về 1 bàn */
    public function table()
    {
        return $this->belongsTo(RestaurantTable::class, 'table_id');
    }

    /** Một đơn hàng có nhiều món */
    public function details()
    {
        return $this->hasMany(OrderDetail::class);
    }

    /** Một đơn hàng có nhiều lịch sử thay đổi */
    public function history()
    {
        return $this->hasMany(OrderHistory::class);
    }
}
