<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Configuration extends Model
{
    use HasFactory;

    protected $fillable = [
        'restaurant_name',
        'phone',
        'email',
        'address',
        'open_time',
        'close_time',
        'max_people_per_table',
        'description',
    ];
}
