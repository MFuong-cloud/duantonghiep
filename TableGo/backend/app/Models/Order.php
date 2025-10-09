<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    use SoftDeletes;

    public const STATUS_PENDING = 'pending';
    public const STATUS_PREPARING = 'preparing';
    public const STATUS_SERVED = 'served';
    public const STATUS_CANCELLED = 'cancelled';

    protected $fillable = [
        'booking_id',
        'user_id',
        'menu_id',
        'quantity',
        'special_request',
        'status'
    ];

    // Relationships:

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class)->withTrashed();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function menu(): BelongsTo
    {
        return $this->belongsTo(Menu::class)->withTrashed();
    }

    public function feedback(): HasOne
    {
        // Mối quan hệ 1-1 với feedback (nếu có)
        return $this->hasOne(Feedback::class);
    }
}
