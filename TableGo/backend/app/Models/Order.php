<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'user_id',
        'branch_id',
        'table_id',
        'booking_id',
        'employee_id',
        'total_amount',
        'discount_amount',
        'final_amount',
        'status',
        'type',
        'notes',
    ];
    protected $casts = ['total_amount' => 'decimal:2', 'discount_amount' => 'decimal:2', 'final_amount' => 'decimal:2'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
    public function table()
    {
        return $this->belongsTo(Table::class);
    }
    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
    public function employee()
    {
        return $this->belongsTo(User::class, 'employee_id');
    }
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
    public function payment()
    {
        return $this->hasOne(Payment::class);
    }
}
