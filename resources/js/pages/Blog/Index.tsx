import { Head, Link } from '@inertiajs/react';
import FrontendLayout from '@/layouts/FrontendLayout';
import React from 'react';
import { motion } from 'framer-motion';

/* ===========================================================================
 * Static blog cards — replace href with real article slugs once those pages exist.
 * =========================================================================== */
type BlogCard = {
    title: string;
    date: string;
    image: string;
    fallback: string;
    cat: string;
    catColor: string;
    href: string;
};

const POSTS: BlogCard[] = [
    {
        title: 'Why Telegram Shines — A Dawki Infotech Perspective',
        date: 'August 28, 2025',
        image: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?auto=format&fit=crop&w=900&q=80',
        fallback: '/assets/images/blog/blog-1.webp',
        cat: 'Messaging',
        catColor: '#0088cc',
        href: '#',
    },
    {
        title: 'Key Elements of a High-Impact Sales Development Process — The Dawki Infotech Way',
        date: 'August 28, 2025',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
        fallback: '/assets/images/blog/blog-2.webp',
        cat: 'Sales',
        catColor: '#22c55e',
        href: '#',
    },
    {
        title: 'How Data Analytics Is Transforming the FinTech Landscape — A Dawki Infotech Perspective',
        date: 'August 28, 2025',
        image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=80',
        fallback: '/assets/images/blog/blog-3.webp',
        cat: 'FinTech',
        catColor: '#a855f7',
        href: '#',
    },
];

export default function BlogIndex() {
    return (
        <FrontendLayout>
            <Head title="Blog — Dawki Infotech" />

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
                        {POSTS.map((post) => (
                            <motion.article
                                key={post.title}
                                className="dawki-blog-card"
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] } },
                                }}
                            >
                                <Link href={post.href} className="dawki-blog-card-thumb">
                                    <span
                                        className="dawki-blog-card-cat"
                                        style={{ ['--cat-color' as string]: post.catColor }}
                                    >
                                        {post.cat}
                                    </span>
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        loading="lazy"
                                        decoding="async"
                                        onError={(e) => {
                                            const img = e.currentTarget as HTMLImageElement;
                                            if (img.src !== post.fallback) img.src = post.fallback;
                                        }}
                                    />
                                </Link>
                                <div className="dawki-blog-card-content">
                                    <span className="dawki-blog-card-date">{post.date}</span>
                                    <h3 className="dawki-blog-card-title">
                                        <Link href={post.href}>{post.title}</Link>
                                    </h3>
                                    <span className="dawki-blog-card-spacer"></span>
                                    <Link href={post.href} className="dawki-blog-card-cta">
                                        Read more
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <line x1="5" y1="12" x2="19" y2="12" />
                                            <polyline points="12 5 19 12 12 19" />
                                        </svg>
                                    </Link>
                                </div>
                            </motion.article>
                        ))}
                    </motion.div>
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
