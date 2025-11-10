<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $table = 'tables';

    protected $fillable = [
       'name', 'seats','status', 'branch_id'
    ];

    public function branch() { return $this->belongsTo(Branch::class); }
    public function table() { return $this->belongsTo(RestaurantTable::class); }
    public function user() { return $this->belongsTo(User::class); }
}
