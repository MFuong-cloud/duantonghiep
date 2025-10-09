<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Schedule extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'employee_id',
        'date',
        'shift_start',
        'shift_end'
    ];

    protected $casts = [
        'date' => 'date',
    ];

    // Relationships:

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
