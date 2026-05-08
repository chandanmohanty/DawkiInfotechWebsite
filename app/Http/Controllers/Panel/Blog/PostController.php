<?php

namespace App\Http\Controllers\Panel\Blog;

use App\Http\Controllers\Controller;
use App\Http\Requests\Panel\Blog\StorePostRequest;
use App\Http\Requests\Panel\Blog\UpdatePostRequest;
use App\Models\Category;
use App\Models\Post;
use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Post::with(['category', 'tags', 'user'])
            ->latest();

        // Search
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                    ->orWhere('excerpt', 'like', '%' . $request->search . '%');
            });
        }

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Filter by category
        if ($request->has('category_id') && $request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        $posts = $query->paginate(15)->withQueryString();

        return Inertia::render('Panel/Blog/Posts/Index', [
            'posts' => $posts,
            'categories' => Category::where('is_active', true)->get(),
            'filters' => $request->only(['search', 'status', 'category_id']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Panel/Blog/Posts/Create', [
            'categories' => Category::where('is_active', true)->orderBy('name')->get(),
            'tags' => Tag::orderBy('name')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePostRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['user_id'] = auth()->id();

        // Calculate read time if not provided
        if (!isset($data['read_time']) || !$data['read_time']) {
            $wordCount = str_word_count(strip_tags($data['content']));
            $data['read_time'] = max(1, ceil($wordCount / 200)); // Average reading speed: 200 words/min
        }

        // Auto-fill published_at when status is 'published' and the field
        // is empty — otherwise the public Post::published() scope filters
        // the row out (it requires published_at <= now(), and NULL never
        // satisfies that comparison). Without this, an editor who marks
        // a post Published but leaves the date blank gets a "where did
        // my post go" surprise.
        if (($data['status'] ?? null) === 'published' && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        $post = Post::create($data);

        // Sync tags
        if (isset($data['tag_ids'])) {
            $post->tags()->sync($data['tag_ids']);
        }

        return redirect()->route('panel.blog.posts.index')
            ->with('success', 'Post created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post): Response
    {
        $post->load(['category', 'tags', 'user']);

        return Inertia::render('Panel/Blog/Posts/Show', [
            'post' => $post,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post): Response
    {
        $post->load('tags');

        return Inertia::render('Panel/Blog/Posts/Edit', [
            'post' => $post,
            'categories' => Category::where('is_active', true)->orderBy('name')->get(),
            'tags' => Tag::orderBy('name')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePostRequest $request, Post $post): RedirectResponse
    {
        $data = $request->validated();

        // Calculate read time if not provided
        if (!isset($data['read_time']) || !$data['read_time']) {
            $wordCount = str_word_count(strip_tags($data['content']));
            $data['read_time'] = max(1, ceil($wordCount / 200));
        }

        // Auto-fill published_at when transitioning to published status
        // without an explicit date. Same rationale as in store() — keeps
        // the public Post::published() scope from accidentally hiding
        // the post.
        if (($data['status'] ?? null) === 'published'
            && empty($data['published_at'])
            && empty($post->published_at)) {
            $data['published_at'] = now();
        }

        $post->update($data);

        // Sync tags
        if (isset($data['tag_ids'])) {
            $post->tags()->sync($data['tag_ids']);
        } else {
            $post->tags()->detach();
        }

        return redirect()->route('panel.blog.posts.index')
            ->with('success', 'Post updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post): RedirectResponse
    {
        $post->delete();

        return redirect()->route('panel.blog.posts.index')
            ->with('success', 'Post deleted successfully.');
    }

}
