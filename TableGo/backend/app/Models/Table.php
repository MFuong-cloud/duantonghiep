<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Table extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'table_area_id',
        'name',
        'seats',
        'status',
        'position_x',
        'position_y',
    ];

    public function tableArea()
    {
        return $this->belongsTo(TableArea::class);
    }
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
