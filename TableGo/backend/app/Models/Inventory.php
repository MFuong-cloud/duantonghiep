<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Inventory extends Model
{
    use SoftDeletes;

    protected $table = 'inventory';

    protected $fillable = [
        'name',
        'quantity',
        'unit',
        'branch_id'
    ];

    // Relationships:

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }
}
