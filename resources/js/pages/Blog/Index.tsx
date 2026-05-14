import { Head, Link, usePage } from '@inertiajs/react';
import FrontendLayout from '@/layouts/FrontendLayout';
import React from 'react';
import { motion } from 'framer-motion';

/* ===========================================================================
 * Types — matches the shape returned by BlogController@index
 * =========================================================================== */
type Category = {
    id: number;
    name: string;
    slug: string;
    color?: string | null;
};

type Tag = { id: number; name: string; slug: string };

type Post = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    featured_image: string | null;
    published_at: string | null;
    author_name: string | null;
    category: Category | null;
    tags: Tag[];
};

type Paginator<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type PageProps = {
    posts: Paginator<Post>;
    categories?: (Category & { posts_count: number })[];
    recentPosts?: Post[];
    filters?: { category?: string; tag?: string; search?: string };
};

/* Convert "2026-05-05T00:00:00.000000Z" → "May 5, 2026" */
const fmtDate = (iso: string | null): string => {
    if (!iso) return '';
    try {
        return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
        return iso;
    }
};

/* Stable category color from the category id (cycles through a palette). */
const CAT_COLORS = ['#5b9eff', '#22c55e', '#a855f7', '#ec4899', '#f97316', '#06b6d4', '#fbbf24', '#ef4444'];
const colorForCategory = (cat?: Category | null): string => {
    if (!cat) return '#5b9eff';
    if (cat.color) return cat.color;
    return CAT_COLORS[cat.id % CAT_COLORS.length];
};

const FALLBACK_IMG = '/assets/images/blog/blog-1.webp';

export default function BlogIndex() {
    const { props } = usePage<PageProps>();
    const posts: Post[] = props.posts?.data ?? [];
    const paginator = props.posts;

    return (
        <FrontendLayout>
            <Head title="Blog — Dawki Infotech">
                <meta name="description" content="Engineering, AI, and growth marketing essays from the Dawki Infotech team — case studies, technical guides, and field notes from building software for clients across India, US, UK, and UAE." head-key="description" />
                <meta property="og:title" content="Blog — Dawki Infotech" head-key="og:title" />
                <meta property="og:description" content="Engineering, AI, and growth marketing essays from the Dawki Infotech team." head-key="og:description" />
                <meta name="twitter:title" content="Blog — Dawki Infotech" head-key="twitter:title" />
                <meta name="twitter:description" content="Engineering, AI, and growth marketing essays from the Dawki Infotech team." head-key="twitter:description" />
            </Head>

            <main id="primary" className="site-main">
                <div className="space-for-header"></div>

                {/* Hero */}
                <section className="dawki-blog-hero">
                    <video
                        className="dawki-blog-hero-video"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                    >
                        <source src="/assets/images/header/demo/blog.mp4" type="video/mp4" />
                    </video>
                    <div className="dawki-blog-hero-overlay" aria-hidden="true"></div>

                    <motion.div
                        className="dawki-blog-hero-content"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                    >
                        <span className="dawki-blog-hero-pill">
                            <span></span>
                            Insights & Updates
                        </span>
                        <h1 className="dawki-blog-hero-title">
                            From the Dawki <span>Infotech Blog</span>
                        </h1>
                        <p className="dawki-blog-hero-subtitle">
                            Field-tested perspectives from our team — on technology, marketing, sales, and the work behind the products we ship.
                        </p>
                    </motion.div>
                </section>

                {/* Blog cards */}
                <section className="dawki-blog-list">
                    {posts.length === 0 ? (
                        <div className="container" style={{ textAlign: 'center', padding: '40px 20px' }}>
                            <p style={{ fontSize: 18, color: '#64748b' }}>
                                No published posts yet. Check back soon — fresh perspectives are on the way.
                            </p>
                        </div>
                    ) : (
                        <motion.div
                            className="dawki-blog-grid"
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: '-80px' }}
                            variants={{
                                hidden: {},
                                show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
                            }}
                        >
                            {posts.map((post) => {
                                const href = `/blog/${post.slug}`;
                                const catColor = colorForCategory(post.category);
                                const catLabel = post.category?.name ?? 'Article';
                                const img = post.featured_image || FALLBACK_IMG;

                                return (
                                    <motion.article
                                        key={post.id}
                                        className="dawki-blog-card"
                                        variants={{
                                            hidden: { opacity: 0, y: 30 },
                                            show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] } },
                                        }}
                                    >
                                        <Link href={href} className="dawki-blog-card-thumb">
                                            <span
                                                className="dawki-blog-card-cat"
                                                style={{ ['--cat-color' as string]: catColor }}
                                            >
                                                {catLabel}
                                            </span>
                                            <img
                                                src={img}
                                                alt={post.title}
                                                loading="lazy"
                                                decoding="async"
                                                onError={(e) => {
                                                    const el = e.currentTarget as HTMLImageElement;
                                                    if (el.src !== window.location.origin + FALLBACK_IMG) el.src = FALLBACK_IMG;
                                                }}
                                            />
                                        </Link>
                                        <div className="dawki-blog-card-content">
                                            <span className="dawki-blog-card-date">{fmtDate(post.published_at)}</span>
                                            <h3 className="dawki-blog-card-title">
                                                <Link href={href}>{post.title}</Link>
                                            </h3>
                                            {post.excerpt && (
                                                <p className="dawki-blog-card-excerpt" style={{ color: '#64748b', fontSize: 14, lineHeight: 1.55, margin: '4px 0 0' }}>
                                                    {post.excerpt.length > 140 ? post.excerpt.slice(0, 140) + '…' : post.excerpt}
                                                </p>
                                            )}
                                            <span className="dawki-blog-card-spacer"></span>
                                            <Link href={href} className="dawki-blog-card-cta">
                                                Read more
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                    <line x1="5" y1="12" x2="19" y2="12" />
                                                    <polyline points="12 5 19 12 12 19" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </motion.article>
                                );
                            })}
                        </motion.div>
                    )}

                    {/* Pagination */}
                    {paginator && paginator.last_page > 1 && (
                        <div className="container" style={{ marginTop: 40, display: 'flex', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
                            {paginator.links.map((link, i) => {
                                const label = link.label.replace(/&laquo;|&raquo;/g, '').trim() || (i === 0 ? '‹' : '›');
                                if (!link.url) {
                                    return (
                                        <span
                                            key={i}
                                            style={{ padding: '8px 14px', borderRadius: 8, color: '#94a3b8', background: '#f1f5f9', fontSize: 14 }}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                }
                                return (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        style={{
                                            padding: '8px 14px',
                                            borderRadius: 8,
                                            background: link.active ? 'linear-gradient(135deg, #5b9eff, #a855f7)' : '#ffffff',
                                            color: link.active ? '#ffffff' : '#0a1628',
                                            border: '1px solid ' + (link.active ? 'transparent' : 'rgba(15,23,42,0.10)'),
                                            fontSize: 14,
                                            fontWeight: 600,
                                            textDecoration: 'none',
                                        }}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* CTA */}
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
            </main>
        </FrontendLayout>
    );
}
