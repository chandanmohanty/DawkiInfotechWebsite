import { Head, Link, useForm } from '@inertiajs/react';
import PanelLayout from '@/layouts/PanelLayout';
import TinyMCE from '@/components/TinyMCE';
import ImageUpload from '@/components/ImageUpload';
import { FormEventHandler, useState } from 'react';

interface Category {
    id: number;
    name: string;
}

interface Tag {
    id: number;
    name: string;
}

interface Props {
    categories: Category[];
    tags: Tag[];
}

export default function CreatePost({ categories, tags }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        featured_image: '',
        category_id: null as number | null,
        tag_ids: [] as number[],
        status: 'draft' as 'draft' | 'published' | 'archived',
        is_featured: false,
        published_at: '',
        author_name: '',
        author_image: '',
        author_bio: '',
        read_time: null as number | null,
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        meta_image: '',
        og_title: '',
        og_description: '',
        og_image: '',
        og_type: 'article',
        twitter_card: 'summary_large_image' as 'summary' | 'summary_large_image',
        twitter_title: '',
        twitter_description: '',
        twitter_image: '',
        canonical_url: '',
        robots: 'index, follow',
        focus_keyword: '',
        schema_markup: null as any,
    });

    const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'settings'>('content');

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/panel/blog/posts');
    };

    const generateSlug = () => {
        if (!data.slug && data.title) {
            const slug = data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            setData('slug', slug);
        }
    };

    return (
        <PanelLayout>
            <Head title="Create Post" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
                        <p className="mt-1 text-sm text-gray-600">Add a new blog post</p>
                    </div>
                    <Link
                        href="/panel/blog/posts"
                        className="text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                        ← Back to Posts
                    </Link>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                type="button"
                                onClick={() => setActiveTab('content')}
                                className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                                    activeTab === 'content'
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                }`}
                            >
                                Content
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('seo')}
                                className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                                    activeTab === 'seo'
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                }`}
                            >
                                SEO
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('settings')}
                                className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                                    activeTab === 'settings'
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                }`}
                            >
                                Settings
                            </button>
                        </nav>
                    </div>

                    {/* Content Tab */}
                    {activeTab === 'content' && (
                        <div className="space-y-6 rounded-lg bg-white p-6 shadow">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    onBlur={generateSlug}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                                <input
                                    type="text"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                                <textarea
                                    value={data.excerpt}
                                    onChange={(e) => setData('excerpt', e.target.value)}
                                    rows={3}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                {errors.excerpt && <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Content <span className="text-red-500">*</span>
                                </label>
                                <TinyMCE value={data.content} onChange={(content) => setData('content', content)} />
                                {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
                            </div>

                            <ImageUpload
                                value={data.featured_image}
                                onChange={(url) => setData('featured_image', url)}
                                label="Featured Image"
                                error={errors.featured_image}
                            />
                        </div>
                    )}

                    {/* SEO Tab */}
                    {activeTab === 'seo' && (
                        <div className="space-y-6 rounded-lg bg-white p-6 shadow">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                                    <input
                                        type="text"
                                        value={data.meta_title}
                                        onChange={(e) => setData('meta_title', e.target.value)}
                                        maxLength={60}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">{data.meta_title.length}/60</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Focus Keyword</label>
                                    <input
                                        type="text"
                                        value={data.focus_keyword}
                                        onChange={(e) => setData('focus_keyword', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                                <textarea
                                    value={data.meta_description}
                                    onChange={(e) => setData('meta_description', e.target.value)}
                                    rows={3}
                                    maxLength={160}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <p className="mt-1 text-xs text-gray-500">{data.meta_description.length}/160</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Keywords</label>
                                <input
                                    type="text"
                                    value={data.meta_keywords}
                                    onChange={(e) => setData('meta_keywords', e.target.value)}
                                    placeholder="keyword1, keyword2, keyword3"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <ImageUpload
                                value={data.meta_image}
                                onChange={(url) => setData('meta_image', url)}
                                label="Meta Image"
                                error={errors.meta_image}
                            />

                            <div className="border-t pt-6">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900">Open Graph (Facebook)</h3>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">OG Title</label>
                                        <input
                                            type="text"
                                            value={data.og_title}
                                            onChange={(e) => setData('og_title', e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">OG Type</label>
                                        <select
                                            value={data.og_type}
                                            onChange={(e) => setData('og_type', e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="article">Article</option>
                                            <option value="website">Website</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">OG Description</label>
                                    <textarea
                                        value={data.og_description}
                                        onChange={(e) => setData('og_description', e.target.value)}
                                        rows={2}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="mt-4">
                                    <ImageUpload
                                        value={data.og_image}
                                        onChange={(url) => setData('og_image', url)}
                                        label="OG Image"
                                        error={errors.og_image}
                                    />
                                </div>
                            </div>

                            <div className="border-t pt-6">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900">Twitter Card</h3>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Card Type</label>
                                        <select
                                            value={data.twitter_card}
                                            onChange={(e) =>
                                                setData('twitter_card', e.target.value as 'summary' | 'summary_large_image')
                                            }
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="summary">Summary</option>
                                            <option value="summary_large_image">Summary Large Image</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Twitter Title</label>
                                        <input
                                            type="text"
                                            value={data.twitter_title}
                                            onChange={(e) => setData('twitter_title', e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Twitter Description</label>
                                    <textarea
                                        value={data.twitter_description}
                                        onChange={(e) => setData('twitter_description', e.target.value)}
                                        rows={2}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="mt-4">
                                    <ImageUpload
                                        value={data.twitter_image}
                                        onChange={(url) => setData('twitter_image', url)}
                                        label="Twitter Image"
                                        error={errors.twitter_image}
                                    />
                                </div>
                            </div>

                            <div className="border-t pt-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Canonical URL</label>
                                        <input
                                            type="url"
                                            value={data.canonical_url}
                                            onChange={(e) => setData('canonical_url', e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Robots</label>
                                        <input
                                            type="text"
                                            value={data.robots}
                                            onChange={(e) => setData('robots', e.target.value)}
                                            placeholder="index, follow"
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className="space-y-6 rounded-lg bg-white p-6 shadow">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <select
                                        value={data.category_id || ''}
                                        onChange={(e) => setData('category_id', e.target.value ? Number(e.target.value) : null)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value as 'draft' | 'published' | 'archived')}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </div>
                            </div>

                            {data.status === 'published' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Published At</label>
                                    <input
                                        type="datetime-local"
                                        value={data.published_at}
                                        onChange={(e) => setData('published_at', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                                <div className="space-y-2 rounded-lg border border-gray-300 p-3 max-h-48 overflow-y-auto">
                                    {tags.map((tag) => (
                                        <label key={tag.id} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={data.tag_ids.includes(tag.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setData('tag_ids', [...data.tag_ids, tag.id]);
                                                    } else {
                                                        setData(
                                                            'tag_ids',
                                                            data.tag_ids.filter((id) => id !== tag.id)
                                                        );
                                                    }
                                                }}
                                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="text-sm text-gray-700">{tag.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={data.is_featured}
                                            onChange={(e) => setData('is_featured', e.target.checked)}
                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Featured Post</span>
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Read Time (minutes)</label>
                                    <input
                                        type="number"
                                        value={data.read_time || ''}
                                        onChange={(e) => setData('read_time', e.target.value ? Number(e.target.value) : null)}
                                        min="1"
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="border-t pt-6">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900">Author Information</h3>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Author Name</label>
                                        <input
                                            type="text"
                                            value={data.author_name}
                                            onChange={(e) => setData('author_name', e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Author Image URL</label>
                                        <input
                                            type="text"
                                            value={data.author_image}
                                            onChange={(e) => setData('author_image', e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Author Bio</label>
                                    <textarea
                                        value={data.author_bio}
                                        onChange={(e) => setData('author_bio', e.target.value)}
                                        rows={3}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit Buttons */}
                    <div className="flex items-center justify-end gap-4 rounded-lg bg-white p-6 shadow">
                        <Link
                            href="/panel/blog/posts"
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {processing ? 'Creating...' : 'Create Post'}
                        </button>
                    </div>
                </form>
            </div>
        </PanelLayout>
    );
}
