<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Report extends Model
{
    // KHÔNG dùng SoftDeletes theo Migration

    public const TYPE_DAILY = 'daily';
    public const TYPE_MONTHLY = 'monthly';
    public const TYPE_YEARLY = 'yearly';

    protected $fillable = [
        'branch_id',
        'type',
        'revenue',
        'expense',
        'profit',
        'date'
    ];

    protected $casts = [
        'revenue' => 'decimal:2',
        'expense' => 'decimal:2',
        'profit' => 'decimal:2',
        'date' => 'date',
    ];

    // Relationships:

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }
}
