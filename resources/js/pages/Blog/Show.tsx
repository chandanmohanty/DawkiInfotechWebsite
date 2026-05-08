import { Head, Link } from '@inertiajs/react';
import FrontendLayout from '@/layouts/FrontendLayout';
import { motion } from 'framer-motion';
import React from 'react';

/* ============================================================================
 * Types
 * ============================================================================ */
interface Post {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    featured_image: string | null;
    published_at: string | null;
    category: { id: number; name: string; slug: string } | null;
    tags: Array<{ id: number; name: string; slug: string }>;
    user: { name: string };
    author_name: string | null;
    author_image: string | null;
    author_bio: string | null;
    read_time: number | null;
    views_count: number;
    meta_title: string | null;
    meta_description: string | null;
}

interface RelatedPost {
    id: number;
    title: string;
    slug: string;
    featured_image: string | null;
    published_at: string | null;
}

interface Props {
    post: Post;
    relatedPosts: RelatedPost[];
    previousPost: RelatedPost | null;
    nextPost: RelatedPost | null;
    categories: Array<{ id: number; name: string; slug: string; posts_count: number }>;
    recentPosts: RelatedPost[];
}

/* ============================================================================
 * Helpers
 * ============================================================================ */
const fmtDate = (iso: string | null): string => {
    if (!iso) return '';
    try {
        return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
        return iso;
    }
};

const initials = (name: string): string =>
    name.trim().split(/\s+/).slice(0, 2).map((n) => n[0]?.toUpperCase() ?? '').join('');

/* ============================================================================
 * Page
 * ============================================================================ */
export default function BlogShow({ post, relatedPosts, previousPost, nextPost, categories, recentPosts }: Props) {
    const shareUrl   = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = post.meta_title || post.title;
    const author     = post.author_name || post.user?.name || 'Dawki Team';
    const readTime   = post.read_time ?? Math.max(1, Math.round((post.content?.replace(/<[^>]+>/g, '').split(/\s+/).length || 100) / 220));

    return (
        <FrontendLayout>
            <Head>
                <title>{post.meta_title || post.title}</title>
                {post.meta_description && <meta name="description" content={post.meta_description} />}
            </Head>

            <main id="primary" className="site-main dawki-blogshow">
                <div className="space-for-header"></div>

                {/* ============ HERO ============ */}
                <section className="dawki-blogshow-hero">
                    {post.featured_image && (
                        <div className="dawki-blogshow-hero-bg" style={{ backgroundImage: `url(${post.featured_image})` }} aria-hidden="true"></div>
                    )}
                    <div className="dawki-blogshow-hero-overlay" aria-hidden="true"></div>

                    <div className="container">
                        <motion.div
                            className="dawki-blogshow-hero-content"
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                        >
                            <div className="dawki-blogshow-crumb">
                                <Link href="/">Home</Link>
                                <span aria-hidden="true">›</span>
                                <Link href="/blog">Blog</Link>
                                <span aria-hidden="true">›</span>
                                <span>Article</span>
                            </div>

                            {post.category && (
                                <Link href={`/blog?category=${post.category.slug}`} className="dawki-blogshow-cat">
                                    {post.category.name}
                                </Link>
                            )}

                            <h1 className="dawki-blogshow-title">{post.title}</h1>

                            {post.excerpt && (
                                <p className="dawki-blogshow-excerpt">{post.excerpt}</p>
                            )}

                            <div className="dawki-blogshow-meta">
                                <div className="dawki-blogshow-meta-author">
                                    {post.author_image ? (
                                        <img src={post.author_image} alt={author} />
                                    ) : (
                                        <span className="dawki-blogshow-avatar">{initials(author)}</span>
                                    )}
                                    <div>
                                        <span className="dawki-blogshow-meta-label">Written by</span>
                                        <strong>{author}</strong>
                                    </div>
                                </div>
                                <span className="dawki-blogshow-meta-divider" aria-hidden="true"></span>
                                <div className="dawki-blogshow-meta-item">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                    <span>{fmtDate(post.published_at)}</span>
                                </div>
                                <span className="dawki-blogshow-meta-divider" aria-hidden="true"></span>
                                <div className="dawki-blogshow-meta-item">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                                    </svg>
                                    <span>{readTime} min read</span>
                                </div>
                                {post.views_count > 0 && (
                                    <>
                                        <span className="dawki-blogshow-meta-divider" aria-hidden="true"></span>
                                        <div className="dawki-blogshow-meta-item">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                                            </svg>
                                            <span>{post.views_count.toLocaleString()} views</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ============ BODY + SIDEBAR ============ */}
                <section className="dawki-blogshow-body">
                    <div className="container">
                        <div className="dawki-blogshow-grid">
                            {/* Main column */}
                            <article className="dawki-blogshow-main">
                                {post.featured_image && (
                                    <motion.div
                                        className="dawki-blogshow-cover"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: '-80px' }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <img src={post.featured_image} alt={post.title} loading="lazy" />
                                    </motion.div>
                                )}

                                <div
                                    className="dawki-blogshow-content"
                                    dangerouslySetInnerHTML={{ __html: post.content }}
                                />

                                {/* Tags + Share */}
                                {(post.tags?.length > 0 || true) && (
                                    <div className="dawki-blogshow-foot">
                                        {post.tags?.length > 0 && (
                                            <div className="dawki-blogshow-tags">
                                                <span className="dawki-blogshow-tags-label">Tags</span>
                                                {post.tags.map((tag) => (
                                                    <Link key={tag.id} href={`/blog?tag=${tag.slug}`} className="dawki-blogshow-tag">
                                                        #{tag.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                        <div className="dawki-blogshow-share">
                                            <span className="dawki-blogshow-share-label">Share</span>
                                            <a
                                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                                                target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook"
                                                className="dawki-blogshow-share-btn"
                                            >
                                                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-3h2.5V9.5C10.5 7 12 5.6 14.2 5.6c1 0 2.1.2 2.1.2v2.3h-1.2c-1.2 0-1.5.7-1.5 1.5V12h2.6l-.4 3h-2.2v7A10 10 0 0 0 22 12z"/></svg>
                                            </a>
                                            <a
                                                href={`https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                                                target="_blank" rel="noopener noreferrer" aria-label="Share on X"
                                                className="dawki-blogshow-share-btn"
                                            >
                                                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2H21l-6.522 7.45L22 22h-6.844l-4.78-6.27L4.8 22H2.04l6.97-7.96L2 2h7.005l4.32 5.71L18.244 2zm-1.2 18h1.84L7.06 4H5.13l11.913 16z"/></svg>
                                            </a>
                                            <a
                                                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`}
                                                target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn"
                                                className="dawki-blogshow-share-btn"
                                            >
                                                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18V10H5.67v8h2.67zM7 8.86a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zm11 9.14v-4.36c0-2.34-1.25-3.43-2.92-3.43-1.35 0-1.95.74-2.29 1.27V10h-2.66v8h2.66v-4.47c0-.24.02-.48.09-.65.18-.48.62-.97 1.34-.97.95 0 1.33.72 1.33 1.78V18h2.45z"/></svg>
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* Author Bio */}
                                {post.author_bio && (
                                    <div className="dawki-blogshow-bio">
                                        {post.author_image ? (
                                            <img src={post.author_image} alt={author} className="dawki-blogshow-bio-avatar" />
                                        ) : (
                                            <span className="dawki-blogshow-bio-avatar dawki-blogshow-bio-avatar-fallback">{initials(author)}</span>
                                        )}
                                        <div>
                                            <span className="dawki-blogshow-bio-label">About the Author</span>
                                            <h4>{author}</h4>
                                            <p>{post.author_bio}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Prev/Next nav */}
                                {(previousPost || nextPost) && (
                                    <nav className="dawki-blogshow-nav">
                                        {previousPost ? (
                                            <Link href={`/blog/${previousPost.slug}`} className="dawki-blogshow-nav-link is-prev">
                                                <span className="dawki-blogshow-nav-label">← Previous</span>
                                                <strong>{previousPost.title}</strong>
                                            </Link>
                                        ) : <span></span>}
                                        {nextPost ? (
                                            <Link href={`/blog/${nextPost.slug}`} className="dawki-blogshow-nav-link is-next">
                                                <span className="dawki-blogshow-nav-label">Next →</span>
                                                <strong>{nextPost.title}</strong>
                                            </Link>
                                        ) : <span></span>}
                                    </nav>
                                )}
                            </article>

                            {/* Sidebar */}
                            <aside className="dawki-blogshow-side">
                                {categories.length > 0 && (
                                    <div className="dawki-blogshow-widget">
                                        <h4 className="dawki-blogshow-widget-title">Categories</h4>
                                        <ul className="dawki-blogshow-cat-list">
                                            {categories.map((c) => (
                                                <li key={c.id}>
                                                    <Link href={`/blog?category=${c.slug}`}>
                                                        <span>{c.name}</span>
                                                        <em>{c.posts_count}</em>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {recentPosts.length > 0 && (
                                    <div className="dawki-blogshow-widget">
                                        <h4 className="dawki-blogshow-widget-title">Recent Posts</h4>
                                        <ul className="dawki-blogshow-post-list">
                                            {recentPosts.map((rp) => (
                                                <li key={rp.id}>
                                                    <Link href={`/blog/${rp.slug}`} className="dawki-blogshow-post-link">
                                                        <span className="dawki-blogshow-post-thumb">
                                                            <img
                                                                src={rp.featured_image || '/assets/images/blog/post-1.webp'}
                                                                alt={rp.title}
                                                                loading="lazy"
                                                            />
                                                        </span>
                                                        <span className="dawki-blogshow-post-text">
                                                            <strong>{rp.title}</strong>
                                                            <em>{fmtDate(rp.published_at)}</em>
                                                        </span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {relatedPosts.length > 0 && (
                                    <div className="dawki-blogshow-widget">
                                        <h4 className="dawki-blogshow-widget-title">Related</h4>
                                        <ul className="dawki-blogshow-post-list">
                                            {relatedPosts.map((rp) => (
                                                <li key={rp.id}>
                                                    <Link href={`/blog/${rp.slug}`} className="dawki-blogshow-post-link">
                                                        <span className="dawki-blogshow-post-thumb">
                                                            <img
                                                                src={rp.featured_image || '/assets/images/blog/post-1.webp'}
                                                                alt={rp.title}
                                                                loading="lazy"
                                                            />
                                                        </span>
                                                        <span className="dawki-blogshow-post-text">
                                                            <strong>{rp.title}</strong>
                                                            <em>{fmtDate(rp.published_at)}</em>
                                                        </span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="dawki-blogshow-cta">
                                    <h4>Need software for your business?</h4>
                                    <p>From idea to launch — our team can help you ship.</p>
                                    <a href="/contact" className="dawki-blogshow-cta-btn">Get a free consultation</a>
                                </div>
                            </aside>
                        </div>
                    </div>
                </section>
            </main>
        </FrontendLayout>
    );
}
