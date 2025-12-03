<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dish extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'price',
        'description',
        'image',    // Cột này lưu JSON array của nhiều ảnh
        'status'
    ];

    protected $casts = [
        'status' => 'boolean',
    ];

    protected $appends = ['image_url', 'image_urls'];

    /**
     * Lấy mảng paths từ cột 'image' (có thể là JSON array hoặc string đơn)
     */
    private function getImagePaths()
    {
        $raw = $this->attributes['image'] ?? null;

        if (is_null($raw) || $raw === '') {
            return [];
        }

        // Thử decode JSON
        $decoded = json_decode($raw, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            return $decoded;
        }

        // Nếu không phải JSON, coi như single path
        return [$raw];
    }

    /**
     * Accessor: Trả về URL của ảnh đầu tiên
     */
    public function getImageUrlAttribute()
    {
        $paths = $this->getImagePaths();
        if (empty($paths)) return null;

        return asset('storage/' . $paths[0]);
    }

    /**
     * Accessor: Trả về mảng URLs của tất cả ảnh
     */
    public function getImageUrlsAttribute()
    {
        $paths = $this->getImagePaths();
        if (empty($paths)) return [];

        return array_map(function ($path) {
            return asset('storage/' . $path);
        }, $paths);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
