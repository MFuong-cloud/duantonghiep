<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    //  use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'calories',
        'status',
        'image',
        'category_id',
    ];
     public function orderDetails() {return $this->hasMany(OrderDetail::class);}
}
