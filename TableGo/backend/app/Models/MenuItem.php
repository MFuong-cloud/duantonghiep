<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MenuItem extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'category_id',
        'name',
        'description',
        'price',
        'image',
        'calories',
        'is_available',
    ];

    protected $casts = ['price' => 'decimal:2', 'is_available' => 'boolean'];

    public function category()
    {
        return $this->belongsTo(MenuCategory::class);
    }
    public function combos()
    {
        return $this->belongsToMany(Combo::class, 'combo_menu_item');
    }
    public function ingredients()
    {
        return $this->belongsToMany(Ingredient::class, 'menu_item_ingredient')->withPivot('quantity');
    }
    public function orderItems()
    {
        return $this->morphMany(OrderItem::class, 'orderable');
    }
}
