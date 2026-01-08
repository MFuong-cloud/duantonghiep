<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Comment;

class CommentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'news_id'   => 'required|exists:news,id',
            'content'   => 'required|string',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        $comment = Comment::create([
            'news_id'   => $request->news_id,
            'user_id'   => auth()->id(),
            'parent_id' => $request->parent_id,
            'content'   => $request->content,
            'is_active' => 0, // CHỜ DUYỆT
        ]);

        return response()->json($comment, 201);
    }
}
