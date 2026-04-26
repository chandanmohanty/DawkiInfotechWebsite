<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Post;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    /**
     * Display a listing of blog posts.
     */
    public function index(Request $request): Response
    {
        $query = Post::with(['category', 'tags', 'user'])
            ->published()
            ->latest('published_at');

        // Filter by category
        if ($request->has('category') && $request->category) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // Filter by tag
        if ($request->has('tag') && $request->tag) {
            $query->whereHas('tags', function ($q) use ($request) {
                $q->where('slug', $request->tag);
            });
        }

        // Search
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                    ->orWhere('excerpt', 'like', '%' . $request->search . '%')
                    ->orWhere('content', 'like', '%' . $request->search . '%');
            });
        }

        $posts = $query->paginate(9)->withQueryString();

        return Inertia::render('Blog/Index', [
            'posts' => $posts,
            'categories' => Category::where('is_active', true)->withCount('posts')->get(),
            'recentPosts' => Post::published()->latest('published_at')->limit(5)->get(),
            'filters' => $request->only(['category', 'tag', 'search']),
        ]);
    }

    /**
     * Display the specified blog post.
     */
    public function show(string $slug): Response
    {
        $post = Post::with(['category', 'tags', 'user'])
            ->where('slug', $slug)
            ->published()
            ->firstOrFail();

        // Increment views
        $post->increment('views_count');

        // Get related posts
        $relatedPosts = Post::published()
            ->where('id', '!=', $post->id)
            ->where(function ($q) use ($post) {
                $q->where('category_id', $post->category_id)
                    ->orWhereHas('tags', function ($query) use ($post) {
                        $query->whereIn('tags.id', $post->tags->pluck('id'));
                    });
            })
            ->limit(3)
            ->get();

        // Get previous and next posts
        $previousPost = Post::published()
            ->where('published_at', '<', $post->published_at)
            ->latest('published_at')
            ->first();

        $nextPost = Post::published()
            ->where('published_at', '>', $post->published_at)
            ->oldest('published_at')
            ->first();

        return Inertia::render('Blog/Show', [
            'post' => $post,
            'relatedPosts' => $relatedPosts,
            'previousPost' => $previousPost,
            'nextPost' => $nextPost,
            'categories' => Category::where('is_active', true)->withCount('posts')->get(),
            'recentPosts' => Post::published()->latest('published_at')->limit(5)->get(),
        ]);
    }
}
