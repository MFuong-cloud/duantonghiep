<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WaitingList extends Model
{
    protected $table = 'waiting_list'; // Tên bảng theo Migration
    // KHÔNG dùng SoftDeletes theo Migration

    public const STATUS_WAITING = 'waiting';
    public const STATUS_NOTIFIED = 'notified';
    public const STATUS_CANCELLED = 'cancelled';

    protected $fillable = [
        'user_id',
        'people_count',
        'desired_time',
        'branch_id',
        'status'
    ];

    protected $casts = [
        'desired_time' => 'datetime',
    ];

    // Relationships:

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }
}
