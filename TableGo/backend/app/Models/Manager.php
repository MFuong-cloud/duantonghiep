<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Manager extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'branch_id'
    ];

    // Relationships:

    // Lấy thông tin tài khoản (Auth) của Manager
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Manager phụ trách chi nhánh nào
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }
}
