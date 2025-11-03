<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dish extends Model
{
    protected $fillable = [
        'category_id', 'name', 'type', 'price', 'description', 'image_url', 'is_active'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
