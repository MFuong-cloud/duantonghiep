<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class NewsController extends Controller
{
    public function index()
    {
        return News::latest()->paginate(10);
    }

    public function show($id)
    {
        return News::with('comments.user')
            ->findOrFail($id);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required',
            'image' => 'nullable|image|max:2048',
            'is_active' => 'sometimes|boolean'
        ]);

        $image = null;
        if ($request->hasFile('image')) {
            $image = $request->file('image')->store('news', 'public');
        }

        $news = News::create([
            'title' => $request->title,
            'slug' => Str::slug($request->title),
            'content' => $request->content,
            'image' => $image,
            'is_active' => $request->is_active ?? 1
        ]);

        return $news;
    }

    public function update(Request $request, $id)
    {
        $news = News::findOrFail($id);

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required',
            'is_active' => 'sometimes|boolean',
            'image' => 'nullable|image|max:2048'
        ]);

        // Update basic fields
        $news->update($request->only([
            'title', 'content', 'is_active'
        ]));

        // Update slug if title changed
        if ($request->has('title')) {
            $news->slug = Str::slug($request->title);
            $news->save();
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image
            if ($news->image && Storage::disk('public')->exists($news->image)) {
                Storage::disk('public')->delete($news->image);
            }
            
            // Upload new image
            $news->image = $request->file('image')->store('news', 'public');
            $news->save();
        }

        return $news;
    }

    public function destroy($id)
    {
        $news = News::findOrFail($id);
        $news->delete(); // Soft delete
        return response()->json(['message' => 'Moved to trash']);
    }

    /**
     * Lấy danh sách tin tức đã xóa mềm
     */
    public function trash()
    {
        return News::onlyTrashed()
            ->latest('deleted_at')
            ->paginate(10);
    }

    /**
     * Khôi phục tin tức đã xóa
     */
    public function restore($id)
    {
        $news = News::onlyTrashed()->findOrFail($id);
        $news->restore();
        return response()->json(['message' => 'Restored successfully']);
    }

    /**
     * Xóa vĩnh viễn tin tức
     */
    public function forceDelete($id)
    {
        $news = News::onlyTrashed()->findOrFail($id);
        
        // Xóa image nếu có
        if ($news->image && Storage::disk('public')->exists($news->image)) {
            Storage::disk('public')->delete($news->image);
        }
        
        $news->forceDelete();
        return response()->json(['message' => 'Permanently deleted']);
    }
}
