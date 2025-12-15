<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Dish extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id',
        'name',
        'description',
        'price',
        'image',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
        'price' => 'integer',
    ];

    // Relationship
    public function category()
    {
        return $this->belongsTo(Category::class)->withTrashed();
    }

    /**
     * Accessor: Trả về URL đầy đủ của ảnh đầu tiên
     */
    public function getImageUrlAttribute()
    {
        $images = $this->getImageUrlsAttribute();
        return $images[0] ?? null;
    }

    /**
     * Accessor: Trả về mảng URLs đầy đủ của TẤT CẢ ảnh
     */
    public function getImageUrlsAttribute()
    {
        $raw = $this->attributes['image'] ?? null;

        if (!$raw) {
            return [];
        }

        // Parse JSON array
        $decoded = json_decode($raw, true);

        // Nếu là JSON array hợp lệ
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            // Convert tất cả paths thành full URLs
            return array_map(function ($path) {
                return url('storage/' . $path);
            }, $decoded);
        }

        // Fallback: nếu là string đơn (legacy data)
        return [url('storage/' . $raw)];
    }

    /**
     * Append các accessor vào JSON response
     */
    protected $appends = ['image_url', 'image_urls'];
}
