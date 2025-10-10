<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ingredient extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'unit', 'stock_quantity', 'alert_quantity'];

    public function menuItems()
    {
        return $this->belongsToMany(MenuItem::class, 'menu_item_ingredient')->withPivot('quantity');
    }
}
