<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = ['branch_id', 'table_id', 'user_id', 'total_price', 'status'];

    public function branch() { return $this->belongsTo(Branch::class); }
    public function table() { return $this->belongsTo(RestaurantTable::class); }
    public function user() { return $this->belongsTo(User::class); }
    public function details() { return $this->hasMany(OrderDetail::class); }
}
