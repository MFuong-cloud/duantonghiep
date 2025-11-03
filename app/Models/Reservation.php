<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $fillable = [
        'branch_id', 'table_id', 'user_id', 'reservation_time', 'status', 'note'
    ];

    public function branch() { return $this->belongsTo(Branch::class); }
    public function table() { return $this->belongsTo(RestaurantTable::class); }
    public function user() { return $this->belongsTo(User::class); }
}
