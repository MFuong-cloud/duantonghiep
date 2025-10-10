<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Combo extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = ['name', 'description', 'price', 'image', 'is_available'];
    protected $casts = ['price' => 'decimal:2', 'is_available' => 'boolean'];

    public function menuItems()
    {
        return $this->belongsToMany(MenuItem::class, 'combo_menu_item')->withPivot('quantity');
    }
    public function orderItems()
    {
        return $this->morphMany(OrderItem::class, 'orderable');
    }
}
