<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Menu extends Model
{
    use SoftDeletes;

    public const STATUS_AVAILABLE = 'available';
    public const STATUS_UNAVAILABLE = 'unavailable';

    protected $fillable = [
        'name',
        'description',
        'price',
        'calories',
        'status',
        'image',
        'category_id'
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    // Relationships:

    public function category(): BelongsTo
    {
        return $this->belongsTo(MenuCategory::class, 'category_id');
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}
