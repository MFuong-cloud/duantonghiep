<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MenuCategory extends Model
{
    use SoftDeletes;

    protected $table = 'menu_categories';
    protected $fillable = ['name'];

    // Relationships:

    public function menus(): HasMany
    {
        return $this->hasMany(Menu::class, 'category_id');
    }
}
