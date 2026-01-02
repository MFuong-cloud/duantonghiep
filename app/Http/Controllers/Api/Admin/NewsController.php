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
        return News::with('category')->latest()->paginate(10);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'content' => 'required',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|max:2048'
        ]);

        $image = null;
        if ($request->hasFile('image')) {
            $image = $request->file('image')->store('news', 'public');
        }

        return News::create([
            'title' => $request->title,
            'slug' => Str::slug($request->title),
            'content' => $request->content,
            'category_id' => $request->category_id,
            'image' => $image,
            'is_active' => 1
        ]);
    }

    public function update(Request $request, $id)
    {
        $news = News::findOrFail($id);

        $news->update($request->only([
            'title','content','category_id','is_active'
        ]));

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
            ->with('category')
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
