<?php
class NewsController extends Controller
{
public function index()
{
return News::with('category')
->where('is_active', 1)
->latest()
->paginate(10);
}

public function show($slug)
{
$news = News::where('slug', $slug)
->where('is_active', 1)
->with([
'comments' => function ($q) {
$q->where('is_active', 1)
->with(['user', 'replies.user']);
}
])
->firstOrFail();

$news->increment('views');

return response()->json($news);
}
}
