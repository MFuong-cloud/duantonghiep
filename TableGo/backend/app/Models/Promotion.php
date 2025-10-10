<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Promotion extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = ['code', 'name', 'description', 'type', 'value', 'start_date', 'end_date', 'is_active'];
    protected $casts = ['value' => 'decimal:2', 'start_date' => 'datetime', 'end_date' => 'datetime', 'is_active' => 'boolean'];
}
