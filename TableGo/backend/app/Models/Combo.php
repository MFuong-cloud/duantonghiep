<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Combo extends Model
{
    use SoftDeletes;

    protected $fillable = ['name', 'description', 'price', 'menu_ids'];

    protected $casts = [
        'price' => 'decimal:2',
        'menu_ids' => 'array', // Cast cột JSON sang array
    ];

    // Helpers:

    // Tải các Models Menu liên quan
    public function getMenusAttribute()
    {
        // Chức năng: lấy danh sách các món ăn thực tế trong combo
        return Menu::whereIn('id', $this->menu_ids)->get();
    }
}
