<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Feedback extends Model
{
    use SoftDeletes;

    public const TYPE_FOOD = 'food';
    public const TYPE_SERVICE = 'service';

    protected $fillable = [
        'user_id',
        'order_id',
        'rating',
        'comment',
        'type'
    ];

    // Relationships:

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Liên kết với Order để biết feedback này dành cho món ăn/đơn hàng nào
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class)->withTrashed();
    }
}
