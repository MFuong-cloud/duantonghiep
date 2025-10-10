<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Booking extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'user_id',
        'table_id',
        'branch_id',
        'booking_time',
        'duration_minutes',
        'people_count',
        'status',
        'special_request',
    ];
    protected $casts = ['booking_time' => 'datetime'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function table()
    {
        return $this->belongsTo(Table::class);
    }
    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
}
