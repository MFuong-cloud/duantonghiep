<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\News;

class NewsController extends Controller
{
    /**
     * Lấy danh sách tin tức (public)
     */
    public function index()
    {
        return News::with('category')
            ->where('is_active', 1)
            ->latest()
            ->paginate(10);
    }

    /**
     * Xem chi tiết tin tức theo slug
     */
    public function show($slug)
    {
        $news = News::with(['category', 'comments.user', 'comments.replies.user'])
            ->where('slug', $slug)
            ->where('is_active', 1)
            ->firstOrFail();

        // Tăng view count
        $news->increment('views');

        return $news;
    }
}
