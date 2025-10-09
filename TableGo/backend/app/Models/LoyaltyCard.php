<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LoyaltyCard extends Model
{
    use SoftDeletes;

    public const LEVEL_SILVER = 'silver';
    public const LEVEL_GOLD = 'gold';
    public const LEVEL_DIAMOND = 'diamond';

    protected $fillable = [
        'user_id',
        'level',
        'points'
    ];

    // Relationships:

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
