<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employee extends Model
{
    use SoftDeletes;

    public const POSITION_RECEPTIONIST = 'Receptionist';
    public const POSITION_WAITER = 'Waiter';
    public const POSITION_KITCHEN = 'Kitchen';
    public const POSITION_CASHIER = 'Cashier';

    public const STATUS_ACTIVE = 'active';
    public const STATUS_INACTIVE = 'inactive';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'position',
        'status',
        'branch_id'
    ];

    // Relationships:

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class);
    }

    // Nếu muốn liên kết 1-1 với tài khoản User (rất thực tế)
    // public function userAccount() {
    //     return $this->hasOne(User::class, 'email', 'email');
    // }
}
