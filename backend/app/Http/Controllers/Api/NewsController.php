<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class NewsController extends Controller
{
    /**
     * Display a listing of the news.
     */
    public function index(Request $request)
    {
        $query = News::with('author');

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Filter by category
        if ($request->has('category') && $request->category) {
            $query->where('category', $request->category);
        }

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%");
            });
        }

        // Order by
        $query->orderBy('created_at', 'desc');

        // Paginate
        $perPage = $request->get('per_page', 10);
        $news = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $news,
        ]);
    }

    /**
     * Store a newly created news.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'category' => 'nullable|string|max:50',
            'status' => 'nullable|in:draft,published',
        ]);

        $data = $request->only(['title', 'excerpt', 'content', 'category', 'status']);

        // Generate slug từ title hoặc từ request
        $slug = $request->slug ? Str::slug($request->slug) : Str::slug($request->title);
        $data['slug'] = $slug;

        // Make slug unique
        $originalSlug = $data['slug'];
        $count = 1;
        while (News::where('slug', $data['slug'])->exists()) {
            $data['slug'] = $originalSlug . '-' . $count;
            $count++;
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->storeAs('news', $imageName, 'public');
            $data['image'] = '/storage/news/' . $imageName;
        }

        // Set author
        $data['author_id'] = $request->user()?->id;

        $news = News::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Tin tức đã được tạo thành công',
            'data' => $news,
        ], 201);
    }

    /**
     * Display the specified news.
     */
    public function show($id)
    {
        $news = News::with('author')->find($id);

        if (!$news) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy tin tức',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $news,
        ]);
    }

    /**
     * Display news by slug (for frontend).
     */
    public function showBySlug($slug)
    {
        $news = News::with('author')->where('slug', $slug)->first();

        if (!$news) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy tin tức',
            ], 404);
        }

        // Increment views
        $news->incrementViews();

        return response()->json([
            'success' => true,
            'data' => $news,
        ]);
    }

    /**
     * Update the specified news.
     */
    public function update(Request $request, $id)
    {
        $news = News::find($id);

        if (!$news) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy tin tức',
            ], 404);
        }

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:news,slug,' . $id,
            'excerpt' => 'nullable|string',
            'content' => 'sometimes|required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'category' => 'nullable|string|max:50',
            'status' => 'nullable|in:draft,published',
        ]);

        $data = $request->only(['title', 'slug', 'excerpt', 'content', 'category', 'status']);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image
            if ($news->image) {
                $oldImage = str_replace('/storage/', '', $news->image);
                Storage::disk('public')->delete($oldImage);
            }

            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->storeAs('news', $imageName, 'public');
            $data['image'] = '/storage/news/' . $imageName;
        }

        $news->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Tin tức đã được cập nhật thành công',
            'data' => $news,
        ]);
    }

    /**
     * Remove the specified news.
     */
    public function destroy($id)
    {
        $news = News::find($id);

        if (!$news) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy tin tức',
            ], 404);
        }

        // Delete image
        if ($news->image) {
            $imagePath = str_replace('/storage/', '', $news->image);
            Storage::disk('public')->delete($imagePath);
        }

        $news->delete();

        return response()->json([
            'success' => true,
            'message' => 'Tin tức đã được xóa thành công',
        ]);
    }

    /**
     * Get published news for frontend.
     */
    public function getPublished(Request $request)
    {
        $query = News::published()->with('author');

        // Filter by category
        if ($request->has('category') && $request->category) {
            $query->where('category', $request->category);
        }

        $query->orderBy('created_at', 'desc');

        $perPage = $request->get('per_page', 10);
        $news = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $news,
        ]);
    }
}
