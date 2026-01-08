<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Comment;

class CommentController extends Controller
{
    public function index()
    {
        return Comment::with(['user','news'])
            ->latest()
            ->paginate(20);
    }

    public function approve($id)
    {
        $comment = Comment::findOrFail($id);
        $comment->update(['is_active' => 1]);

        return response()->json(['message' => 'Approved']);
    }

    public function destroy($id)
    {
        Comment::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}
