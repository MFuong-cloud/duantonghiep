<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Branch extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = ['name', 'address', 'phone', 'email'];

    public function employeeProfiles()
    {
        return $this->hasMany(EmployeeProfile::class);
    }
    public function tableAreas()
    {
        return $this->hasMany(TableArea::class);
    }
}
