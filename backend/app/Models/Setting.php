<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable =  [
        'restaurant_name',
         'address',
          'phone',
           'tax_code'
        ];
}


