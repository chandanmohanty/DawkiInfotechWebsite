import { Head, Link } from '@inertiajs/react';
import FrontendLayout from '@/layouts/FrontendLayout';
import { useEffect } from 'react';

interface Post {
    id: number;
    title: string;
    slug: string;
    content: string;
    featured_image: string | null;
    published_at: string | null;
    category: {
        id: number;
        name: string;
        slug: string;
    } | null;
    tags: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
    user: {
        name: string;
    };
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

export default function BlogShow({ post, relatedPosts, previousPost, nextPost, categories, recentPosts }: Props) {
    useEffect(() => {
        // Handle data-bg-image
        const bgSelector = document.querySelectorAll("[data-bg-image]");
        bgSelector.forEach((element) => {
            const el = element as HTMLElement;
            const bgImage = el.getAttribute("data-bg-image");
            if (bgImage) {
                el.style.backgroundImage = `url(${bgImage})`;
            }
        });
    }, []);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = post.meta_title || post.title;

    return (
        <FrontendLayout>
            <Head>
                <title>{post.meta_title || post.title}</title>
                {post.meta_description && <meta name="description" content={post.meta_description} />}
            </Head>

            {/* Breadcrumb Section */}
            <section className="tj-page-header section-gap-x" data-bg-image="/assets/images/bg/blog_bg.jpg">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="tj-page-header-content text-center">
                                <h1 className="tj-page-title">Blog Details</h1>
                                <div className="tj-page-link">
                                    <span><i className="tji-home"></i></span>
                                    <span>
                                        <Link href="/">Home</Link>
                                    </span>
                                    <span><i className="tji-arrow-right"></i></span>
                                    <span>
                                        <Link href="/blog">Blog</Link>
                                    </span>
                                    <span><i className="tji-arrow-right"></i></span>
                                    <span>Blog Details</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="page-header-overlay" data-bg-image="/assets/images/shape/pheader-overlay.webp"></div>
            </section>

            {/* Blog Section */}
            <section className="tj-blog-section section-gap slidebar-stickiy-container">
                <div className="container">
                    <div className="row row-gap-5">
                        <div className="col-lg-8">
                            <div className="post-details-wrapper">
                                {post.featured_image && (
                                    <div className="blog-images wow fadeInUp" data-wow-delay=".1s">
                                        <img src={post.featured_image} alt={post.title} />
                                    </div>
                                )}

                                <h1 className="title title-anim">{post.title}</h1>

                                <div className="blog-category-two wow fadeInUp" data-wow-delay=".3s">
                                    <div className="category-item">
                                        <div className="cate-images">
                                            <img
                                                src={post.author_image || '/assets/images/testimonial/client-2.webp'}
                                                alt={post.author_name || post.user.name}
                                            />
                                        </div>
                                        <div className="cate-text">
                                            <span className="degination">Authored by</span>
                                            <h6 className="title">
                                                <Link href={`/blog/${post.slug}`}>
                                                    {post.author_name || post.user.name}
                                                </Link>
                                            </h6>
                                        </div>
                                    </div>
                                    <div className="category-item">
                                        <div className="cate-icons">
                                            <i className="tji-calendar"></i>
                                        </div>
                                        <div className="cate-text">
                                            <span className="degination">Date Released</span>
                                            <h6 className="text">{formatDate(post.published_at)}</h6>
                                        </div>
                                    </div>
                                    {post.read_time && (
                                        <div className="category-item">
                                            <div className="cate-icons">
                                                <i className="tji-clock"></i>
                                            </div>
                                            <div className="cate-text">
                                                <span className="degination">Read Time</span>
                                                <h6 className="text">{post.read_time} min</h6>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div
                                    className="blog-text"
                                    dangerouslySetInnerHTML={{ __html: post.content }}
                                />

                                {post.tags && post.tags.length > 0 && (
                                    <div className="tj-tags-post wow fadeInUp" data-wow-delay=".3s">
                                        <div className="tagcloud">
                                            <span>Tags:</span>
                                            {post.tags.map((tag) => (
                                                <Link key={tag.id} href={`/blog?tag=${tag.slug}`}>
                                                    {tag.name}
                                                </Link>
                                            ))}
                                        </div>
                                        <div className="post-share">
                                            <ul>
                                                <li>Share:</li>
                                                <li>
                                                    <a
                                                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <i className="fa-brands fa-facebook-f"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a
                                                        href={`https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <i className="fa-brands fa-x-twitter"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a
                                                        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <i className="fa-brands fa-linkedin-in"></i>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {/* Post Navigation */}
                                <div className="tj-post__navigation wow fadeInUp" data-wow-delay=".3s">
                                    {previousPost ? (
                                        <div className="tj-nav__post previous">
                                            <div className="tj-nav-post__nav prev_post">
                                                <Link href={`/blog/${previousPost.slug}`}>
                                                    <span>
                                                        <i className="tji-arrow-left"></i>
                                                    </span>
                                                    Previous
                                                </Link>
                                            </div>
                                        </div>
                                    ) : (
                                        <div></div>
                                    )}
                                    <div className="tj-nav-post__grid">
                                        <Link href="/blog">
                                            <i className="tji-window"></i>
                                        </Link>
                                    </div>
                                    {nextPost ? (
                                        <div className="tj-nav__post next">
                                            <div className="tj-nav-post__nav next_post">
                                                <Link href={`/blog/${nextPost.slug}`}>
                                                    Next
                                                    <span>
                                                        <i className="tji-arrow-right"></i>
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                    ) : (
                                        <div></div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="col-lg-4">
                            <div className="tj-sidebar">
                                {/* Categories Widget */}
                                {categories.length > 0 && (
                                    <div className="tj-sidebar-widget tj-categories wow fadeInUp" data-wow-delay=".3s">
                                        <h4 className="widget-title">Categories</h4>
                                        <ul>
                                            {categories.map((category) => (
                                                <li key={category.id}>
                                                    <Link href={`/blog?category=${category.slug}`}>
                                                        {category.name}
                                                        <span>({category.posts_count})</span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Recent Posts Widget */}
                                {recentPosts.length > 0 && (
                                    <div className="tj-sidebar-widget tj-recent-posts wow fadeInUp" data-wow-delay=".3s">
                                        <h4 className="widget-title">Recent post</h4>
                                        <ul>
                                            {recentPosts.map((recentPost) => (
                                                <li key={recentPost.id}>
                                                    <div className="post-thumb">
                                                        <Link href={`/blog/${recentPost.slug}`}>
                                                            <img
                                                                src={
                                                                    recentPost.featured_image ||
                                                                    '/assets/images/blog/post-1.webp'
                                                                }
                                                                alt={recentPost.title}
                                                            />
                                                        </Link>
                                                    </div>
                                                    <div className="post-content">
                                                        <h6 className="post-title">
                                                            <Link href={`/blog/${recentPost.slug}`}>
                                                                {recentPost.title}
                                                            </Link>
                                                        </h6>
                                                        <span className="post-date">
                                                            {formatDate(recentPost.published_at)}
                                                        </span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Related Posts */}
                                {relatedPosts.length > 0 && (
                                    <div className="tj-sidebar-widget tj-recent-posts wow fadeInUp" data-wow-delay=".3s">
                                        <h4 className="widget-title">Related post</h4>
                                        <ul>
                                            {relatedPosts.map((relatedPost) => (
                                                <li key={relatedPost.id}>
                                                    <div className="post-thumb">
                                                        <Link href={`/blog/${relatedPost.slug}`}>
                                                            <img
                                                                src={
                                                                    relatedPost.featured_image ||
                                                                    '/assets/images/blog/post-1.webp'
                                                                }
                                                                alt={relatedPost.title}
                                                            />
                                                        </Link>
                                                    </div>
                                                    <div className="post-content">
                                                        <h6 className="post-title">
                                                            <Link href={`/blog/${relatedPost.slug}`}>
                                                                {relatedPost.title}
                                                            </Link>
                                                        </h6>
                                                        <span className="post-date">
                                                            {formatDate(relatedPost.published_at)}
                                                        </span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* start: Cta Section */}
            <section className="tj-cta-section">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="cta-area">
                                <div className="cta-content">
                                    <h2 className="title title-anim">Let's Build Future Together.</h2>
                                    <div className="cta-btn wow fadeInUp" data-wow-delay=".6s">
                                        <Link className="tj-primary-btn btn-dark" href="/contact">
                                            <span className="btn-text"><span>Get Started Now</span></span>
                                            <span className="btn-icon"><i className="tji-arrow-right-long"></i></span>
                                        </Link>
                                    </div>
                                </div>
                                <div className="cta-img"><img src="/assets/images/cta/footer_cta.jpg" alt="" /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* end: Cta Section */}
        </FrontendLayout>
    );
}
