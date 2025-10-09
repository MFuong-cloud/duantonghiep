<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Expense extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'amount',
        'date',
        'note',
        'branch_id'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'date' => 'date',
    ];

    // Relationships:

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }
}
