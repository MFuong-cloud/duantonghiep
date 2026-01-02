<?php
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
        News::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}
