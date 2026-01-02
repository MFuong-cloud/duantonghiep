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
        $news = News::where('is_active', true)
            ->latest()
            ->paginate(10);
            
        return response()->json($news);
    }

    /**
     * Xem chi tiết tin tức theo slug
     */
    public function show($slug)
    {
        $news = News::where('slug', $slug)
            ->where('is_active', true)
            ->with(['comments.user', 'comments.replies.user']) // Load comments and replies
            ->firstOrFail();

        // Tăng view count
        $news->increment('views');

        return response()->json($news);
    }
}
