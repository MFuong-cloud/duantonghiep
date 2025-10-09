<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Branch extends Model
{
    use SoftDeletes;

    protected $fillable = ['name', 'address', 'phone', 'email'];

    // Relationships:

    public function tables(): HasMany
    {
        return $this->hasMany(Table::class);
    }

    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class);
    }

    public function managers(): HasMany
    {
        return $this->hasMany(Manager::class);
    }

    public function inventory(): HasMany
    {
        return $this->hasMany(Inventory::class);
    }

    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class);
    }

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }
}
