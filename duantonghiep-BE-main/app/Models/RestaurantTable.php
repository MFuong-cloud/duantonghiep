<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RestaurantTable extends Model
{
    use HasFactory;

    // Laravel mặc định sẽ hiểu model "RestaurantTable" map đến bảng "restaurant_tables"
    // → nhưng bảng bạn là "tables", nên phải khai báo:
    protected $table = 'tables';

    protected $fillable = [
        'branch_id',
        'name',
        'seats',
        'status',
    ];

    public function branch()
    {
        return $this->belongsTo(Branch::class, 'branch_id');
    }
}
