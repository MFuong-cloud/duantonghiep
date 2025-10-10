<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'description'];

    /**
     * Một Role có thể thuộc về nhiều User.
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'role_user');
    }
}
