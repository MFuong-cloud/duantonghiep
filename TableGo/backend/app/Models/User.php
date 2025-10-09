<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable, SoftDeletes;

    // START: ĐỊNH NGHĨA CÁC CONSTANTS BẮT BUỘC ĐỂ KHÔNG BỊ LỖI
    public const ROLE_CUSTOMER = 'customer';
    public const ROLE_EMPLOYEE = 'employee';
    public const ROLE_MANAGER = 'manager';
    public const ROLE_OWNER = 'owner';

    public const VIP_NONE = 'none';
    public const VIP_SILVER = 'silver';
    public const VIP_GOLD = 'gold';
    public const VIP_DIAMOND = 'diamond';
    // END: ĐỊNH NGHĨA CÁC CONSTANTS BẮT BUỘC ĐỂ KHÔNG BỊ LỖI

    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'role',
        'vip_level',
        'avatar'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    // Relationships:

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function loyaltyCard(): HasOne
    {
        return $this->hasOne(LoyaltyCard::class);
    }

    public function feedbacks(): HasMany
    {
        return $this->hasMany(Feedback::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function managerProfile(): HasOne
    {
        return $this->hasOne(Manager::class, 'user_id');
    }
}
