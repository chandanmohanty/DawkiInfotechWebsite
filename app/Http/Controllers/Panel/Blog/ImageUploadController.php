<?php

namespace App\Http\Controllers\Panel\Blog;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageUploadController extends Controller
{
    /**
     * Upload an image for blog posts
     */
    public function upload(Request $request)
    {
        $request->validate([
            'image' => ['required', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:5120'], // 5MB max
        ]);

        $file = $request->file('image');
        $filename = Str::random(40) . '.' . $file->getClientOriginalExtension();
        
        // Store in public/uploads/blog directory
        $uploadPath = public_path('uploads/blog');
        if (!file_exists($uploadPath)) {
            mkdir($uploadPath, 0755, true);
        }
        
        $file->move($uploadPath, $filename);
        
        // Return URL relative to public directory
        $url = '/uploads/blog/' . $filename;

        return response()->json([
            'url' => $url,
            'path' => 'uploads/blog/' . $filename,
        ]);
    }
}
