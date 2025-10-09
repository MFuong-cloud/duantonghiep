<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Promotion extends Model
{
    use SoftDeletes;

    public const STATUS_ACTIVE = 'active';
    public const STATUS_INACTIVE = 'inactive';

    protected $fillable = [
        'code',
        'name',
        'discount',
        'start_date',
        'end_date',
        'status'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    // Function nghiệp vụ: Kiểm tra xem Promotion có đang Active không
    public function isActive(): bool
    {
        $now = now();
        return $this->status === self::STATUS_ACTIVE &&
            $this->start_date->lessThanOrEqualTo($now) &&
            $this->end_date->greaterThanOrEqualTo($now);
    }
}
