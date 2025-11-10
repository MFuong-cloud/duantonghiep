<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'phone',
        'image',
    ];

    public function tables()
    {
        return $this->hasMany(RestaurantTable::class, 'branch_id');
    }
}
