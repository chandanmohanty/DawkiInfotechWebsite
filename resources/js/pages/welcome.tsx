import { type FC, useEffect, useRef, useState, type ReactNode, type MouseEvent as ReactMouseEvent } from 'react';
import FrontendLayout from '@/layouts/FrontendLayout';
import { Head, Link } from '@inertiajs/react';
import { motion, useScroll, useTransform, useReducedMotion, type Variants } from 'framer-motion';

/* ============================================================================
 * Premium animation primitives (Framer Motion)
 * Reusable, content-agnostic, GPU-friendly. Drop-in wrappers around children.
 * ============================================================================ */

// Standard fade + slide up — used for section blocks entering viewport
const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] },
    },
};

// Stagger container — children animate in sequence
const staggerContainer: Variants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.10, delayChildren: 0.05 },
    },
};

// Stagger child — used inside staggerContainer
const staggerItem: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] },
    },
};

// Reveal on scroll — wraps any content with fade-up when in view
const Reveal: FC<{ children: ReactNode; className?: string; delay?: number }> = ({
    children,
    className,
    delay = 0,
}) => {
    const reducedMotion = useReducedMotion();
    if (reducedMotion) return <div className={className}>{children}</div>;
    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUpVariants}
            transition={{ delay }}
        >
            {children}
        </motion.div>
    );
};

// Stagger group — children fade up one-by-one with delay
const StaggerGroup: FC<{ children: ReactNode; className?: string }> = ({ children, className }) => {
    const reducedMotion = useReducedMotion();
    if (reducedMotion) return <div className={className}>{children}</div>;
    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
        >
            {children}
        </motion.div>
    );
};

// Stagger child wrapper
const StaggerChild: FC<{ children: ReactNode; className?: string }> = ({ children, className }) => {
    const reducedMotion = useReducedMotion();
    if (reducedMotion) return <div className={className}>{children}</div>;
    return (
        <motion.div className={className} variants={staggerItem}>
            {children}
        </motion.div>
    );
};

// Magnetic button — gently pulls toward cursor on hover (Awwwards-style micro-interaction)
const MagneticBox: FC<{ children: ReactNode; className?: string; strength?: number }> = ({
    children,
    className,
    strength = 14,
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const reducedMotion = useReducedMotion();

    const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
        if (reducedMotion || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        ref.current.style.transform = `translate(${(relX / rect.width) * strength}px, ${(relY / rect.height) * strength}px)`;
    };
    const handleMouseLeave = () => {
        if (!ref.current) return;
        ref.current.style.transform = 'translate(0, 0)';
    };

    return (
        <div
            ref={ref}
            className={className}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)', display: 'inline-block' }}
        >
            {children}
        </div>
    );
};

/* ============================================================================
 * Home Solutions Timeline — vertical zigzag with center-spine scroll fill
 * ============================================================================ */
type SolutionItem = { title: string; desc: string; icon: ReactNode; bg?: string };

const HomeSolutionsTimeline: FC<{ items: SolutionItem[] }> = ({ items }) => {
    const ref = useRef<HTMLDivElement>(null);
    const reduced = useReducedMotion();
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start 80%', 'end 30%'],
    });
    const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

    return (
        <div ref={ref} className="dawki-csd-svc-timeline">
            <div className="dawki-csd-svc-timeline-track" aria-hidden="true" />
            <motion.div
                className="dawki-csd-svc-timeline-track-fill"
                style={reduced ? { height: '100%' } : { height: lineHeight }}
                aria-hidden="true"
            />
            <div className="dawki-csd-svc-timeline-rows">
                {items.map((s, i) => {
                    const isLeft = i % 2 === 0;
                    return (
                        <motion.div
                            key={i}
                            className={`dawki-csd-svc-timeline-row ${isLeft ? 'is-left' : 'is-right'}`}
                            initial={{ opacity: 0, x: isLeft ? -70 : 70, y: 20 }}
                            whileInView={{ opacity: 1, x: 0, y: 0 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                        >
                            <div className="dawki-csd-svc-timeline-node" aria-hidden="true">
                                <span className="dawki-csd-svc-timeline-node-pulse"></span>
                            </div>
                            <motion.article
                                className="dawki-csd-svc-card"
                                whileHover={{ y: -8, transition: { type: 'spring', stiffness: 320, damping: 22 } }}
                            >
                                {s.bg && <div className="service-reveal-bg" data-bg-image={s.bg}></div>}
                                <div className="dawki-csd-svc-card-glow"></div>
                                <div className="dawki-csd-svc-card-icon">{s.icon}</div>
                                <h3 className="dawki-csd-svc-card-title">{s.title}</h3>
                                <p className="dawki-csd-svc-card-desc">{s.desc}</p>
                                <span className="dawki-csd-svc-card-arrow">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
                                </span>
                            </motion.article>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

/* ============================================================================
 * Home Video Showcase — playable video with animated frame + glow
 * ============================================================================ */
const HOME_SHOWCASE_VIDEO = '/assets/images/header/demo/dawki_video.mp4';
const HOME_STORIES_VIDEO = '/assets/images/about/review-video-2.mp4';

const HomeVideoShowcase: FC = () => {
    const ref = useRef<HTMLVideoElement>(null);
    const [started, setStarted] = useState(false);

    const handleStart = () => {
        setStarted(true);
        setTimeout(() => { ref.current?.play().catch(() => {}); }, 30);
    };

    return (
        <section className="dawki-ent-video">
            <div className="container">
                <div className="dawki-ent-video-heading">
                    <span className="dawki-ent-video-pill">
                        <span></span>
                        Behind the Build
                    </span>
                    <h2 className="dawki-ent-video-title">
                        See How We Ship <span>Software That Performs</span>
                    </h2>
                    <p className="dawki-ent-video-subtitle">
                        A behind-the-scenes look at how our team plans, builds, and operates the products we deliver — every day, for clients around the world.
                    </p>
                </div>

                <motion.div
                    className="dawki-ent-video-frame"
                    initial={{ opacity: 0, y: 30, scale: 0.97 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                >
                    <div className="dawki-ent-video-frame-glow"></div>
                    <video
                        ref={ref}
                        key={HOME_SHOWCASE_VIDEO}
                        src={HOME_SHOWCASE_VIDEO}
                        poster="/assets/images/testimonial/client_feedback.jpg"
                        controls
                        preload="metadata"
                        playsInline
                    />

                    {!started && (
                        <button
                            className="dawki-ent-video-play"
                            onClick={handleStart}
                            aria-label="Play video"
                            type="button"
                        >
                            <span className="dawki-ent-video-play-pulse"></span>
                            <span className="dawki-ent-video-play-pulse"></span>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </button>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

/* ============================================================================
 * Home Success Stories — video on left + featured testimonials on right
 * ============================================================================ */
const HOME_STORY_TESTIMONIALS = [
    {
        name: 'Sophia Martinez',
        role: 'Director of Operations, BrightPath Consulting',
        avatar: '/assets/images/testimonial/6.png',
        text: 'The team at Dawki Infotech delivered quality work on time. Their ability to adapt was impressive — a reliable partner for ambitious software projects.',
        rating: 5,
    },
    {
        name: 'Michael Anderson',
        role: 'CEO, Anderson Global Solutions',
        avatar: '/assets/images/testimonial/7.png',
        text: 'Responsive and professional throughout. Smooth collaboration and a polished result that met every expectation we set out at the start.',
        rating: 5,
    },
    {
        name: 'David Thompson',
        role: 'CTO, InnovateX Technologies',
        avatar: '/assets/images/testimonial/8.png',
        text: 'Handled our complex project with strong problem-solving. The final product met expectations on every dimension and shipped without surprises.',
        rating: 5,
    },
];

const HomeSuccessStories: FC = () => {
    const ref = useRef<HTMLVideoElement>(null);
    const [started, setStarted] = useState(false);

    const handleStart = () => {
        setStarted(true);
        setTimeout(() => { ref.current?.play().catch(() => {}); }, 30);
    };

    return (
        <section className="dawki-home-stories">
            <div className="container">
                <div className="dawki-home-stories-heading">
                    <span className="dawki-home-stories-pill">
                        <span></span>
                        Client Feedback
                    </span>
                    <h2 className="dawki-home-stories-title">
                        Our Clients Share Their <span>Success Stories</span>
                    </h2>
                    <p className="dawki-home-stories-subtitle">
                        Real teams, real outcomes — the work behind the screens, in the words of the people we partnered with.
                    </p>
                </div>

                <div className="dawki-home-stories-grid">
                    <motion.div
                        className="dawki-home-stories-left"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                    >
                        <div className="dawki-home-stories-video">
                            <div className="dawki-home-stories-video-glow"></div>
                            <video
                                ref={ref}
                                key={HOME_STORIES_VIDEO}
                                src={HOME_STORIES_VIDEO}
                                poster="/assets/images/testimonial/client_feedback.jpg"
                                controls
                                preload="metadata"
                                playsInline
                            />
                            {!started && (
                                <button
                                    className="dawki-home-stories-play"
                                    onClick={handleStart}
                                    aria-label="Play client story"
                                    type="button"
                                >
                                    <span className="dawki-home-stories-play-pulse"></span>
                                    <span className="dawki-home-stories-play-pulse"></span>
                                    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        <div className="dawki-home-stories-cta">
                            <Link href="/contact" className="dawki-home-stories-cta-btn">
                                <span>Explore More Stories</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        className="dawki-home-stories-right"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                        variants={{
                            hidden: {},
                            visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
                        }}
                    >
                        {HOME_STORY_TESTIMONIALS.map((t, i) => (
                            <motion.article
                                key={i}
                                className="dawki-home-stories-card"
                                variants={{
                                    hidden: { opacity: 0, x: 50 },
                                    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] } },
                                }}
                                whileHover={{ y: -6, transition: { type: 'spring', stiffness: 320, damping: 22 } }}
                            >
                                <div className="dawki-home-stories-card-head">
                                    <img src={t.avatar} alt={t.name} loading="lazy" decoding="async" />
                                    <div className="dawki-home-stories-card-meta">
                                        <h4>{t.name}</h4>
                                        <span>{t.role}</span>
                                    </div>
                                    <div className="dawki-home-stories-card-stars" aria-label={`${t.rating} stars`}>
                                        {Array.from({ length: t.rating }).map((_, idx) => (
                                            <svg key={idx} width="16" height="16" viewBox="0 0 24 24" fill="#FFB400"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                        ))}
                                    </div>
                                </div>
                                <p className="dawki-home-stories-card-text">{t.text}</p>
                            </motion.article>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

/* ============================================================================
 * Home Industries — animated cards grid showcasing verticals we serve
 * ============================================================================ */
type IndustryCard = {
    name: string;
    desc: string;
    a: string; b: string; glow: string; color: string;
    tags: string[];
    icon: ReactNode;
};

const HOME_INDUSTRIES: IndustryCard[] = [
    {
        name: 'Healthcare',
        desc: 'HIPAA-grade portals, telehealth, and clinical workflows for hospitals, clinics, and digital-first health brands.',
        a: '#06b6d4', b: '#4f7cff', glow: 'rgba(6, 182, 212, 0.32)', color: '#67e8f9',
        tags: ['HIPAA', 'Telehealth', 'EMR'],
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
        ),
    },
    {
        name: 'FinTech',
        desc: 'KYC/AML, payments, ledgers, and compliance-ready platforms — built for the audits regulators actually run.',
        a: '#22c55e', b: '#06b6d4', glow: 'rgba(34, 197, 94, 0.32)', color: '#86efac',
        tags: ['Stripe', 'Compliance', 'Ledgers'],
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
        ),
    },
    {
        name: 'eLearning',
        desc: 'Course platforms, LMS, video pipelines, and learner analytics — for K-12, EdTech, and corporate training.',
        a: '#a855f7', b: '#ec4899', glow: 'rgba(168, 85, 247, 0.32)', color: '#d8b4fe',
        tags: ['LMS', 'Live Class', 'SCORM'],
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
        ),
    },
    {
        name: 'Real Estate',
        desc: 'Listing portals, CRM, virtual tours, and rental management — for residential, commercial, and proptech.',
        a: '#f97316', b: '#ec4899', glow: 'rgba(249, 115, 22, 0.32)', color: '#fed7aa',
        tags: ['Listings', 'CRM', 'Virtual Tours'],
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
        ),
    },
    {
        name: 'E-Commerce',
        desc: 'Shopify storefronts, Magento builds, custom checkouts, and conversion-tuned product experiences.',
        a: '#ec4899', b: '#a855f7', glow: 'rgba(236, 72, 153, 0.32)', color: '#fbcfe8',
        tags: ['Shopify', 'Magento', 'CRO'],
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
        ),
    },
    {
        name: 'SaaS & Startups',
        desc: 'Multi-tenant platforms, Stripe billing, onboarding flows, and admin tools — from MVP to Series-C scale.',
        a: '#4f7cff', b: '#06b6d4', glow: 'rgba(79, 124, 255, 0.32)', color: '#93c5fd',
        tags: ['Multi-tenant', 'Billing', 'SSO'],
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
            </svg>
        ),
    },
];

const HomeIndustries: FC = () => (
    <section className="dawki-home-ind">
        <div className="container">
            <div className="dawki-home-ind-heading">
                <span className="dawki-home-ind-pill">
                    <span></span>
                    Industries We Power
                </span>
                <h2 className="dawki-home-ind-title">
                    Built for the Industries <span>You Compete In</span>
                </h2>
                <p className="dawki-home-ind-subtitle">
                    Domain experience that shortens kickoff and sharpens decisions — across regulated, consumer, and B2B markets.
                </p>
            </div>

            <motion.div
                className="dawki-home-ind-grid"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-80px' }}
                variants={{
                    hidden: {},
                    show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
                }}
            >
                {HOME_INDUSTRIES.map((ind) => (
                    <motion.div
                        key={ind.name}
                        className="dawki-home-ind-card"
                        style={{
                            ['--ic-a' as string]: ind.a,
                            ['--ic-b' as string]: ind.b,
                            ['--ic-glow' as string]: ind.glow,
                            ['--ic-color' as string]: ind.color,
                        }}
                        variants={{
                            hidden: { opacity: 0, y: 24 },
                            show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] } },
                        }}
                    >
                        <span className="dawki-home-ind-card-icon">{ind.icon}</span>
                        <h3 className="dawki-home-ind-card-title">{ind.name}</h3>
                        <p className="dawki-home-ind-card-desc">{ind.desc}</p>
                        <div className="dawki-home-ind-card-tags">
                            {ind.tags.map((t) => (
                                <span key={t} className="dawki-home-ind-card-tag">{t}</span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    </section>
);

export const Welcome: FC = () => {
    useEffect(() => {
        const $ = (window as any).jQuery;
        const Swiper = (window as any).Swiper;
        const WOW = (window as any).WOW;
        const gsap = (window as any).gsap;
        const ScrollTrigger = (window as any).ScrollTrigger;
        const SplitText = (window as any).SplitText;

        if (!$ || !Swiper || !WOW || !gsap || !ScrollTrigger) return;

        // Initialize WOW.js
        new WOW().init();

        // Initialize Nice Select
        if (typeof $.fn.niceSelect === 'function') {
            $('select').niceSelect();
        }

        // Swiper Sliders
        const clientSwipers: any[] = [];
        document.querySelectorAll('.client-slider-2').forEach((el) => {
            clientSwipers.push(new Swiper(el as HTMLElement, {
                slidesPerView: 'auto',
                spaceBetween: 40,
                loop: true,
                speed: 4000,
                allowTouchMove: false,
                freeMode: true,
                autoplay: {
                    delay: 0,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: false,
                },
            }));
        });

        // Pause the continuously-animating marquee when it scrolls off-screen
        // (otherwise it keeps repainting every frame and steals scroll headroom)
        const marqueeObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const swiper = clientSwipers.find((s) => s?.el === entry.target);
                    if (!swiper?.autoplay) return;
                    if (entry.isIntersecting) swiper.autoplay.start();
                    else swiper.autoplay.stop();
                });
            },
            { rootMargin: '200px 0px' }
        );
        clientSwipers.forEach((s) => s?.el && marqueeObserver.observe(s.el));

        new Swiper('.blog-slider', {
            slidesPerView: 2,
            spaceBetween: 30,
            loop: true,
            speed: 1500,
            autoplay: {
                delay: 2000,
            },
            navigation: { nextEl: '.slider-next', prevEl: '.slider-prev' },
            pagination: { el: '.swiper-pagination-area', clickable: true },
            breakpoints: {
                0: {
                    slidesPerView: 1,
                    spaceBetween: 15,
                },
                576: {
                    slidesPerView: 1,
                    spaceBetween: 15,
                },
                768: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                },
                992: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                1200: {
                    slidesPerView: 2,
                },
            },
        });



        // GSAP Animations
        setTimeout(() => {
            gsap.registerPlugin(ScrollTrigger, SplitText);

            // Sticky Sidebar
            if ($('.slidebar-stickiy').length > 0) {
                ScrollTrigger.create({
                    trigger: '.slidebar-stickiy-container',
                    start: 'top top+=100',
                    end: 'bottom bottom-=100',
                    pin: '.slidebar-stickiy',
                    pinSpacing: false,
                });
            }

            // Fade in Right on Scroll
            $('.tj-fadein-right-on-scroll').each(function (this: HTMLElement) {
                gsap.from(this, {
                    x: 100,
                    opacity: 0,
                    duration: 1,
                    scrollTrigger: {
                        trigger: this,
                        start: 'top 80%',
                    },
                });
            });

            // Text animations
            $('.text-anim').each(function (this: HTMLElement) {
                const innerSplit = new SplitText(this, { type: 'lines' });
                new SplitText(this, { type: 'lines', linesClass: 'line-outer' });
                gsap.from(innerSplit.lines, {
                    y: 100,
                    autoAlpha: 0,
                    stagger: 0.1,
                    duration: 1.5,
                    ease: 'power4.out',
                    scrollTrigger: {
                        trigger: this,
                        start: 'top 80%',
                    },
                });
            });

            // (Success Stories Swiper removed — replaced with Our Products section)

            // Odometer
            $('.odometer').each(function (this: HTMLElement) {
                const count = $(this).attr('data-count');
                ScrollTrigger.create({
                    trigger: this,
                    onEnter: () => {
                        (this as any).innerHTML = count;
                    },
                });
            });

            // Service Reveal BG (data-bg-image)
            $("[data-bg-image]").each(function (this: HTMLElement) {
                const bg = $(this).attr("data-bg-image");
                if (bg) {
                    $(this).css("background-image", "url(/" + bg + ")");
                }
            });

            ScrollTrigger.refresh();
        }, 500);

        // Venobox
        if (typeof (window as any).VenoBox === 'function') {
            new (window as any).VenoBox({
                selector: '.venobox',
                numeration: true,
                infinigall: true,
                share: true,
                spinner: 'rotating-plane',
            });
        }

        // Scroll progress bar + back-to-top button visibility
        // rAF-throttled so the work runs at most once per frame instead of on every
        // scroll event — otherwise the CSS-var write + class toggle thrash on every
        // wheel tick and visibly drag scroll smoothness.
        const backToTopBtn = document.querySelector('.dawki-back-to-top') as HTMLButtonElement | null;
        let scrollRaf = 0;
        let lastBtnVisible: boolean | null = null;
        const runScrollUx = () => {
            scrollRaf = 0;
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
            document.body.style.setProperty('--scroll-progress', String(progress));

            if (backToTopBtn) {
                const shouldShow = scrollTop > 600;
                if (shouldShow !== lastBtnVisible) {
                    backToTopBtn.classList.toggle('visible', shouldShow);
                    lastBtnVisible = shouldShow;
                }
            }
        };
        const handleScrollUx = () => {
            if (scrollRaf) return;
            scrollRaf = requestAnimationFrame(runScrollUx);
        };
        window.addEventListener('scroll', handleScrollUx, { passive: true });
        runScrollUx();

        // Back-to-top click
        const handleBackToTop = () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        backToTopBtn?.addEventListener('click', handleBackToTop);

        // Section reveal on scroll (IntersectionObserver)
        const revealEls = document.querySelectorAll('.dawki-reveal');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('dawki-revealed');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.10, rootMargin: '0px 0px -80px 0px' }
        );
        revealEls.forEach((el) => observer.observe(el));

        return () => {
            window.removeEventListener('scroll', handleScrollUx);
            if (scrollRaf) cancelAnimationFrame(scrollRaf);
            backToTopBtn?.removeEventListener('click', handleBackToTop);
            observer.disconnect();
            marqueeObserver.disconnect();
            clientSwipers.forEach((s) => s?.destroy?.(true, true));
        };
    }, []);

    // Hero parallax — content gently translates as user scrolls (Awwwards micro-effect)
    const heroRef = useRef<HTMLElement>(null);
    const { scrollYProgress: heroProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });
    const heroContentY = useTransform(heroProgress, [0, 1], [0, -80]);
    const heroContentOpacity = useTransform(heroProgress, [0, 0.7, 1], [1, 0.8, 0]);

    // Cinematic hero entrance — staggered cascade
    const heroChild: Variants = {
        hidden: { opacity: 0, y: 40 },
        visible: (i: number = 0) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.85, delay: i * 0.12, ease: [0.2, 0.8, 0.2, 1] },
        }),
    };

    return (
        <FrontendLayout>
            <Head title="Dawki Infotech | Software Development, Marketing & Automation Experts" />
            <main id="primary" className="site-main">
                <div className="space-for-header"></div>

                {/* start: Banner Section */}
                <section ref={heroRef} className="tj-banner-section section-gap-x">
                    <div className="banner-area">
                        <div className="banner-left-box">
                            {/* Parallax + scroll-fade wrapper — content drifts up & fades as user scrolls past hero */}
                            <motion.div className="banner-content" style={{ y: heroContentY, opacity: heroContentOpacity }}>
                                <motion.span
                                    className="sub-title"
                                    initial="hidden"
                                    animate="visible"
                                    custom={0}
                                    variants={heroChild}
                                >
                                    <i className="tji-excellence"></i> Trusted Software & Marketing Partner
                                </motion.span>
                                <motion.h1
                                    className="banner-title title-anim"
                                    initial="hidden"
                                    animate="visible"
                                    custom={1}
                                    variants={heroChild}
                                >
                                    Empowering Growth That Turns Ideas Into <span>Shipped Reality.</span>
                                </motion.h1>
                                <motion.p
                                    className="banner-tagline"
                                    initial="hidden"
                                    animate="visible"
                                    custom={2}
                                    variants={heroChild}
                                >
                                    Web Development. SEO. Mobile Apps. <span>Digital Marketing.</span>
                                </motion.p>
                                <motion.div
                                    className="banner-desc-area"
                                    initial="hidden"
                                    animate="visible"
                                    custom={3}
                                    variants={heroChild}
                                >
                                    {/* Magnetic CTA — pulls toward cursor on hover */}
                                    <MagneticBox>
                                        <Link className="banner-link" href="/contact">
                                            <span className="banner-link-text">Schedule a Call</span>
                                            <span className="banner-link-icon"><i className="tji-arrow-right-big"></i></span>
                                        </Link>
                                    </MagneticBox>
                                    <div className="banner-desc">
                                        We help startups and enterprises ship websites, mobile apps, and SEO strategies that drive real growth—delivered on time, built to scale, and designed to last.
                                    </div>
                                </motion.div>
                                {/* Trust row — staggered cascade entrance */}
                                <motion.div
                                    className="banner-trust-row"
                                    initial="hidden"
                                    animate="visible"
                                    custom={4}
                                    variants={heroChild}
                                >
                                    <span className="trust-item"><strong>4.9/5</strong> Client Rating</span>
                                    <span className="trust-divider"></span>
                                    <span className="trust-item"><strong>500+</strong> Happy Clients</span>
                                    <span className="trust-divider"></span>
                                    <span className="trust-item"><strong>10+</strong> Years Experience</span>
                                    <span className="trust-divider"></span>
                                    <span className="trust-item"><strong>200+</strong> Projects Shipped</span>
                                </motion.div>
                            </motion.div>
                            <div className="banner-shape">
                                <img loading="lazy" decoding="async" src="/assets/images/shape/pattern-bg.webp" alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="banner-scroll wow fadeInDown" data-wow-delay="2s">
                        <a href="#choose" className="scroll-down">
                            <span><i className="tji-arrow-down-long"></i></span> Scroll Down
                        </a>
                    </div>
                </section>
                {/* end: Banner Section */}

                {/* start: Choose Section */}
                <section id="choose" className="tj-choose-section section-gap">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                {/* Scroll-reveal wrapper — section heading fades up when in view */}
                                <Reveal>
                                    <div className="sec-heading style-3 text-center">
                                        <span className="sub-title"><i className="tji-box"></i>Choose the Best</span>
                                        <h2 className="sec-title">
                                            <strong className="gradient-text-blue">Empowering Business</strong> <strong>with Expertise.</strong>
                                        </h2>
                                    </div>
                                </Reveal>
                            </div>
                        </div>
                        <div className="row row-gap-4 rightSwipeWrap">
                            {[
                                { title: 'Innovative Solutions', icon: 'tji-innovative', desc: 'We stay ahead of the leveraging cutting-edge technologies and strategies to keep.' },
                                { title: 'Award-Winning', icon: 'tji-award', desc: 'Recognized by industry leaders, our award-winning team has a proven record.' },
                                { title: 'Expert Team', icon: 'tji-team', desc: 'Our team is always available to address your concerns, providing quick and solution.' },
                                { title: 'Dedicated Support', icon: 'tji-support', desc: 'Our team is always available to address your concerns, providing quick and effective.' },
                            ].map((item, idx) => (
                                <div className="col-xl-3 col-md-6" key={idx}>
                                    <div className="choose-box style-2 right-swipe">
                                        <div className="choose-content">
                                            <div className="choose-icon"><i className={item.icon}></i></div>
                                            <h4 className="title gradient-text">{item.title}</h4>
                                            <p className="desc">{item.desc}</p>
                                            <Link className="text-btn" href="/about">
                                                <span className="btn-text"><span>Read More</span></span>
                                                <span className="btn-icon"><i className="tji-arrow-right-long"></i></span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                {/* end: Choose Section */}

                {/* start: About Section */}
                <section className="tj-about-section-2 section-gap section-gap-x">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-6 col-lg-6 order-lg-1 order-2">
                                <div className="about-img-area style-2 wow fadeInLeft" data-wow-delay=".3s">
                                    <div className="about-img overflow-hidden">
                                        <img loading="lazy" decoding="async" data-speed=".8" src="/assets/images/about/about-5.webp" alt="" />
                                    </div>
                                    <div className="box-area">
                                        <div className="progress-box wow fadeInUp" data-wow-delay=".3s">
                                            <h4 className="title">Business Progress</h4>
                                            <ul className="tj-progress-list">
                                                <li>
                                                    <h6 className="tj-progress-title">Revenue</h6>
                                                    <div className="tj-progress">
                                                        <span className="tj-progress-percent">82%</span>
                                                        <div className="tj-progress-bar" data-percent="82" style={{ width: '82%' }}></div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <h6 className="tj-progress-title">Satisfaction</h6>
                                                    <div className="tj-progress">
                                                        <span className="tj-progress-percent">90%</span>
                                                        <div className="tj-progress-bar" data-percent="90" style={{ width: '90%' }}></div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-6 col-lg-6 order-lg-2 order-1">
                                <div className="about-content-area">
                                    <div className="sec-heading style-3">
                                        <span className="sub-title wow fadeInUp" data-wow-delay=".3s"><i className="tji-box"></i>Get to Know Us</span>
                                        <h2 className="sec-title">
                                            <strong className="gradient-text-blue">Innovation and Excellence</strong> <strong>for Sustainable Corporate Success Worldwide.</strong>
                                        </h2>
                                    </div>
                                </div>
                                <div className="about-bottom-area">
                                    <div className="mission-vision-box wow fadeInLeft" data-wow-delay=".5s">
                                        <h4 className="title gradient-text">Our Mission</h4>
                                        <p className="desc">our mission is empower businesses through innovate best solution, exceptional service.</p>
                                        <ul className="list-items">
                                            <li><i className="tji-list"></i>Innovation & Excellence</li>
                                            <li><i className="tji-list"></i>Exceptional Customer</li>
                                            <li><i className="tji-list"></i>Business Growth</li>
                                        </ul>
                                    </div>
                                    <div className="mission-vision-box wow fadeInRight" data-wow-delay=".5s">
                                        <h4 className="title gradient-text">Our Vision</h4>
                                        <p className="desc">Our vision is to become a global leader in providing transformative business solutions.</p>
                                        <ul className="list-items">
                                            <li><i className="tji-list"></i>Global Leadership</li>
                                            <li><i className="tji-list"></i>Transformative Impact</li>
                                            <li><i className="tji-list"></i>Sustainable Success</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="about-btn-area wow fadeInUp" data-wow-delay=".5s">
                                    <Link className="tj-primary-btn" href="/about">
                                        <span className="btn-text"><span>Learn More About Us</span></span>
                                        <span className="btn-icon"><i className="tji-arrow-right-long"></i></span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-shape-1">
                        <img loading="lazy" decoding="async" src="/assets/images/shape/pattern-2.svg" alt="" />
                    </div>
                    <div className="bg-shape-2">
                        <img loading="lazy" decoding="async" src="/assets/images/shape/pattern-3.svg" alt="" />
                    </div>
                </section>
                {/* end: About Section */}

                {/* start: Service Section (Sticky) */}
                <section className="tj-service-section service-2 section-gap section-gap-x slidebar-stickiy-container">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-4">
                                <div className="content-wrap slidebar-stickiy">
                                    <div className="sec-heading style-2">
                                        <span className="sub-title wow fadeInUp" data-wow-delay=".3s">Our Solutions</span>
                                        <h2 className="sec-title text-white text-anim">Website Development Solutions Tailored for Your <span>Business.</span></h2>
                                    </div>
                                    <div className="wow fadeInUp" data-wow-delay=".6s">
                                        <Link className="tj-primary-btn" href="/service">
                                            <span className="btn-text"><span>More Services</span></span>
                                            <span className="btn-icon"><i className="tji-arrow-right-long"></i></span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-8">
                                <div className="service-wrapper-2">
                                    <div className="service-item-wrapper tj-fadein-right-on-scroll">
                                        <div className="service-item style-2">
                                            <div className="title-area">
                                                <div className="service-icon"><i className="tji-service-1"></i></div>
                                                <h4 className="title"><Link href="/service-details">Custom Web Development</Link></h4>
                                            </div>
                                            <div className="service-content">
                                                <p className="desc">We craft custom websites designed to help businesses achieve their goals and deliver a memorable experience to their customers.</p>
                                                <ul className="list-items">
                                                    <li><i className="tji-list"></i>Goal-Oriented Design</li>
                                                    <li><i className="tji-list"></i>Tailored User Experience</li>
                                                    <li><i className="tji-list"></i>Built for Growth</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="service-item-wrapper tj-fadein-right-on-scroll">
                                        <div className="service-item style-2">
                                            <div className="title-area">
                                                <div className="service-icon"><i className="tji-service-2"></i></div>
                                                <h4 className="title"><Link href="/service-details">E-commerce Development</Link></h4>
                                            </div>
                                            <div className="service-content">
                                                <p className="desc">We build custom e-commerce websites that are fast, scalable, and designed to turn visitors into loyal customers.</p>
                                                <ul className="list-items">
                                                    <li><i className="tji-list"></i>Tailored Online Stores</li>
                                                    <li><i className="tji-list"></i>Seamless Shopping Experience</li>
                                                    <li><i className="tji-list"></i>Growth-Driven Features</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="service-item-wrapper tj-fadein-right-on-scroll">
                                        <div className="service-item style-2">
                                            <div className="title-area">
                                                <div className="service-icon"><i className="tji-service-3"></i></div>
                                                <h4 className="title"><Link href="/service-details">Cloud-Based Web Development</Link></h4>
                                            </div>
                                            <div className="service-content">
                                                <p className="desc">We build secure, scalable, and high-performance cloud-powered websites that grow with your business.</p>
                                                <ul className="list-items">
                                                    <li><i className="tji-list"></i>Scalable Architecture</li>
                                                    <li><i className="tji-list"></i>Enhanced Security & Reliability</li>
                                                    <li><i className="tji-list"></i>Faster Deployment & Updates</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="service-item-wrapper tj-fadein-right-on-scroll">
                                        <div className="service-item style-2">
                                            <div className="title-area">
                                                <div className="service-icon"><i className="tji-service-4"></i></div>
                                                <h4 className="title"><Link href="/service-details">UI/UX Development</Link></h4>
                                            </div>
                                            <div className="service-content">
                                                <p className="desc">We design intuitive, user-friendly interfaces that enhance engagement and create seamless digital experiences.</p>
                                                <ul className="list-items">
                                                    <li><i className="tji-list"></i>User-Centered Design</li>
                                                    <li><i className="tji-list"></i>Consistent Brand Experience</li>
                                                    <li><i className="tji-list"></i>Optimized for Conversion</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-shape-1">
                        <img loading="lazy" decoding="async" src="/assets/images/shape/pattern-2.svg" alt="" />
                    </div>
                    <div className="bg-shape-2">
                        <img loading="lazy" decoding="async" src="/assets/images/shape/pattern-3.svg" alt="" />
                    </div>
                    <div className="bg-shape-3">
                        <img loading="lazy" decoding="async" src="/assets/images/shape/shape-blur.svg" alt="" />
                    </div>
                </section>
                {/* end: Service Section */}

                {/* start: Service Section 3 */}
                <section className="tj-service-section service-3 section-gap">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                {/* Scroll-reveal heading */}
                                <Reveal>
                                    <div className="sec-heading style-3 text-center">
                                        <span className="sub-title"><i className="tji-box"></i>Our Solutions</span>
                                        <h2 className="sec-title title-anim">Tailor Business Solutions for Corporates.</h2>
                                    </div>
                                </Reveal>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <HomeSolutionsTimeline
                                    items={[
                                        {
                                            title: 'AI Development',
                                            desc: 'Intelligent solutions that automate work, sharpen decisions, and unlock new growth.',
                                            bg: '/assets/images/service/ai_development.webp',
                                            icon: (
                                                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                    <rect x="16" y="16" width="32" height="32" rx="6" stroke="white" strokeWidth="2.5" />
                                                    <circle cx="32" cy="32" r="6" fill="white" />
                                                    <path d="M32 16V10M32 54v-6M16 32H10M54 32h-6M22 22l-4-4M46 22l4-4M22 46l-4 4M46 46l4 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                                                </svg>
                                            ),
                                        },
                                        {
                                            title: 'Mobile App Development',
                                            desc: 'Fast, intuitive iOS and Android apps built to keep users engaged.',
                                            bg: '/assets/images/service/mobile_development.webp',
                                            icon: (
                                                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                    <rect x="20" y="8" width="24" height="48" rx="4" stroke="white" strokeWidth="2.5" />
                                                    <path d="M20 16h24M20 48h24" stroke="white" strokeWidth="2.5" />
                                                    <circle cx="32" cy="52" r="1.5" fill="white" />
                                                </svg>
                                            ),
                                        },
                                        {
                                            title: 'Software Development',
                                            desc: 'Custom software that scales with your business and runs without friction.',
                                            bg: '/assets/images/service/software_development.webp',
                                            icon: (
                                                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                    <path d="M22 20L10 32l12 12M42 20l12 12-12 12M36 16l-8 32" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            ),
                                        },
                                        {
                                            title: 'IT Consulting',
                                            desc: 'Expert guidance to modernize your stack, cut costs, and align IT with business goals.',
                                            bg: '/assets/images/service/IT_consulting.webp',
                                            icon: (
                                                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                    <path d="M12 30a20 20 0 0140 0" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                                                    <rect x="10" y="30" width="10" height="16" rx="3" stroke="white" strokeWidth="2.5" />
                                                    <rect x="44" y="30" width="10" height="16" rx="3" stroke="white" strokeWidth="2.5" />
                                                    <path d="M52 46v2a6 6 0 01-6 6h-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                                                    <circle cx="36" cy="54" r="2.5" fill="white" />
                                                </svg>
                                            ),
                                        },
                                        {
                                            title: 'DevOps',
                                            desc: 'Automated pipelines and reliable infrastructure to ship faster with confidence.',
                                            bg: '/assets/images/service/dev_ops.webp',
                                            icon: (
                                                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                    <path d="M20 32a8 8 0 1116 0 8 8 0 0016 0 8 8 0 10-16 0 8 8 0 01-16 0z" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                                                </svg>
                                            ),
                                        },
                                        {
                                            title: 'Cloud Managed Services',
                                            desc: 'Secure, scalable cloud operations with less downtime and stronger performance.',
                                            bg: '/assets/images/service/cloud_services.webp',
                                            icon: (
                                                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                    <path d="M18 44a10 10 0 010-20 12 12 0 0123-3 8 8 0 013 15" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M32 34v14m0 0l-5-5m5 5l5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            ),
                                        },
                                    ]}
                                />
                                <div className="service-btn-area text-center wow fadeInUp" data-wow-delay=".3s">
                                    <Link className="tj-primary-btn" href="/service">
                                        <span className="btn-text"><span>More Services</span></span>
                                        <span className="btn-icon"><i className="tji-arrow-right-long"></i></span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* end: Service Section 3 */}

                {/* start: Working process Section */}
                <div className="tj-working-process section-gap section-gap-x">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="sec-heading-wrap">
                                    <span className="sub-title wow fadeInUp" data-wow-delay=".3s">Our Process</span>
                                    <div className="heading-wrap-content">
                                        <div className="sec-heading style-2">
                                            <h2 className="sec-title text-anim">Seamless Process, Great <span>Results.</span></h2>
                                        </div>
                                        <p className="desc wow fadeInUp" data-wow-delay=".5s">Developing personalized customer journeys to increase satisfaction and loyalty.</p>
                                        <div className="btn-wrap wow fadeInUp" data-wow-delay=".6s">
                                            <Link className="tj-primary-btn" href="/contact">
                                                <span className="btn-text"><span>Request a Call</span></span>
                                                <span className="btn-icon"><i className="tji-arrow-right-long"></i></span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                {/* Stagger reveal — process steps cascade in sequence */}
                                <StaggerGroup className="working-process-area">
                                    {[
                                        { step: '01', title: 'Discovery & Planning', desc: 'We start by understanding your business goals, users, and challenges to shape the right approach.' },
                                        { step: '02', title: 'Execution & Delivery', desc: 'Our team turns the plan into action — building, testing, and delivering on schedule.' },
                                        { step: '03', title: 'Review & Support', desc: 'After launch, we review outcomes and provide ongoing support so your product keeps performing.' },
                                    ].map((item, idx) => (
                                        <StaggerChild className="process-item" key={idx}>
                                            <div className="process-step"><span>{item.step}</span></div>
                                            <div className="process-content">
                                                <h4 className="title">{item.title}</h4>
                                                <p className="desc">{item.desc}</p>
                                            </div>
                                        </StaggerChild>
                                    ))}
                                </StaggerGroup>
                            </div>
                        </div>
                    </div>
                    <div className="bg-shape-1">
                        <img loading="lazy" decoding="async" src="/assets/images/shape/pattern-2.svg" alt="" />
                    </div>
                    <div className="bg-shape-2">
                        <img loading="lazy" decoding="async" src="/assets/images/shape/pattern-3.svg" alt="" />
                    </div>
                </div>
                {/* end: Working process Section */}

                {/* start: Our Products Section (CRM + AI Grow) */}
                <section className="dawki-products">
                    <div className="dawki-products-orb dawki-products-orb--a"></div>
                    <div className="dawki-products-orb dawki-products-orb--b"></div>
                    <div className="container">
                        <div className="dawki-products-heading">
                            <span className="dawki-products-pill">
                                <span className="dawki-products-dot"></span>
                                Our Products
                            </span>
                            <h2 className="dawki-products-title">
                                Built In-House. <span>Trusted by Teams.</span>
                            </h2>
                            <p className="dawki-products-subtitle">
                                Our own SaaS products that power businesses every day — designed, engineered, and scaled by Dawki Infotech.
                            </p>
                        </div>

                        <div className="dawki-products-list">
                            {/* PRODUCT 1 — CRM Dashboard */}
                            <article className="dawki-product-card dawki-product-card--reverse">
                                <div className="dawki-product-visual">
                                    <div className="dawki-product-frame">
                                        <div className="dawki-product-frame-bar">
                                            <span></span><span></span><span></span>
                                        </div>
                                        <img loading="lazy" decoding="async" src="/assets/images/about/crm-dashboard.png" alt="CRM Dashboard preview" />
                                    </div>
                                    <div className="dawki-product-frame-glow"></div>
                                </div>
                                <div className="dawki-product-content">
                                    <span className="dawki-product-badge">CRM · SaaS Platform</span>
                                    <h3 className="dawki-product-title">
                                        All-in-One <span>Dawki CRM</span>
                                    </h3>
                                    <p className="dawki-product-desc">
                                        A unified workspace to manage clients, admins, and employees — built for teams that move fast.
                                        Dial calls in-app with built-in timer, track conversations, monitor live performance graphs, assign tasks,
                                        and keep every customer touchpoint in one searchable timeline.
                                    </p>
                                    <ul className="dawki-product-features">
                                        <li><i>📞</i>Built-in call dialer with auto-timer & call logs</li>
                                        <li><i>👥</i>Role-based access for admin, employees & clients</li>
                                        <li><i>📊</i>Real-time dashboards, KPIs & performance graphs</li>
                                        <li><i>📅</i>Tasks, reminders & follow-up automation</li>
                                    </ul>
                                    <div className="dawki-product-actions">
                                        <Link href="/contact" className="dawki-product-btn">
                                            <span>Request a Demo</span>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                                        </Link>
                                    </div>
                                </div>
                            </article>

                            {/* PRODUCT 2 — AI Grow */}
                            <article className="dawki-product-card">
                                <div className="dawki-product-visual">
                                    <div className="dawki-product-frame">
                                        <div className="dawki-product-frame-bar">
                                            <span></span><span></span><span></span>
                                        </div>
                                        <img loading="lazy" decoding="async" src="/assets/images/about/ai-grow-dashboard.png" alt="AI Grow Robot dashboard preview" />
                                    </div>
                                    <div className="dawki-product-frame-glow dawki-product-frame-glow--alt"></div>
                                </div>
                                <div className="dawki-product-content">
                                    <span className="dawki-product-badge dawki-product-badge--alt">AI · Bulk Messaging</span>
                                    <h3 className="dawki-product-title">
                                        AI Grow <span>Smart Outreach Bot</span>
                                    </h3>
                                    <p className="dawki-product-desc">
                                        Send thousands of personalized messages in minutes — without burning out reps or hitting spam filters.
                                        AI Grow handles bulk WhatsApp, SMS & email campaigns with smart scheduling, AI-personalized copy,
                                        delivery tracking, and intent-based reply detection.
                                    </p>
                                    <ul className="dawki-product-features">
                                        <li><i>⚡</i>Bulk send across WhatsApp, SMS & email channels</li>
                                        <li><i>🤖</i>AI-personalized message variants per contact</li>
                                        <li><i>📈</i>Live delivery, open & reply analytics</li>
                                        <li><i>🛡️</i>Smart throttling to keep deliverability high</li>
                                    </ul>
                                    <div className="dawki-product-actions">
                                        <Link href="/contact" className="dawki-product-btn">
                                            <span>Try AI Grow</span>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </div>
                </section>
                {/* end: Our Products Section */}

                {/* start: Team Section (Marquee) */}
                <section className="h7-team section-gap section-gap-x">
                    {/* Drifting tech-tag chips for extra ambient animation */}
                    <div className="h7-team-floats" aria-hidden="true">
                        <span className="h7-team-float h7-team-float--a">&lt;React /&gt;</span>
                        <span className="h7-team-float h7-team-float--b">npm install</span>
                        <span className="h7-team-float h7-team-float--c">git push</span>
                        <span className="h7-team-float h7-team-float--d">deploy --prod</span>
                    </div>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                {/* Scroll-reveal heading */}
                                <Reveal>
                                    <div className="sec-heading style-2 sec-heading-centered">
                                        <h2 className="sec-title text-anim">Your Tech Stack, Mastered.</h2>
                                    </div>
                                </Reveal>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="h7-team-wrapper">
                                    {(() => {
                                        const row1 = [
                                            { title: 'Android', img: '1_android.png' },
                                            { title: 'Flutter', img: '2_flutter.png' },
                                            { title: 'Cordova', img: '3_cordova.png' },
                                            { title: 'Meta', img: '4_meta.png' },
                                            { title: 'Kubernetes', img: '5_kubenetis.png' },
                                            { title: 'Docker', img: '6_docker.png' },
                                            { title: 'HTML', img: '7_css.png' },
                                            { title: 'JavaScript', img: '8_javascript.png' },
                                        ];
                                        const row2 = [
                                            { title: 'Angular', img: '9_angular.png' },
                                            { title: 'React', img: '10_react.png' },
                                            { title: 'Next Js', img: '11_nextjs.png' },
                                            { title: 'Vue', img: '12_vue.png' },
                                            { title: 'Java', img: '13_java.png' },
                                            { title: 'Dot net', img: '14_dontnet.png' },
                                            { title: 'Python', img: '15_python.png' },
                                            { title: 'PHP', img: '16_php.png' },
                                            { title: 'Node', img: '17_node.png' },
                                            { title: 'Go', img: '18_go.png' },
                                            { title: 'SQL Server', img: '19_sqlserver.png' },
                                            { title: 'My SQL', img: '20_mysql.png' },
                                            { title: 'PostgreSQL', img: '21_postgreSQL.png' },
                                            { title: 'Oracle', img: '22_oracle.png' },
                                            { title: 'MongoDB', img: '23_mongoDB.png' },
                                            { title: 'Azure SQL', img: '24_AzureSQL.png' },
                                        ];
                                        const row3 = [
                                            { title: 'AWS', src: 'https://cdn.simpleicons.org/amazonaws/FF9900' },
                                            { title: 'Google Cloud', src: 'https://cdn.simpleicons.org/googlecloud/4285F4' },
                                            { title: 'Azure', src: 'https://cdn.simpleicons.org/microsoftazure/0078D4' },
                                            { title: 'TypeScript', src: 'https://cdn.simpleicons.org/typescript/3178C6' },
                                            { title: 'Tailwind CSS', src: 'https://cdn.simpleicons.org/tailwindcss/06B6D4' },
                                            { title: 'Firebase', src: 'https://cdn.simpleicons.org/firebase/FFCA28' },
                                            { title: 'TensorFlow', src: 'https://cdn.simpleicons.org/tensorflow/FF6F00' },
                                            { title: 'OpenAI', src: 'https://cdn.simpleicons.org/openai/412991' },
                                            { title: 'Figma', src: 'https://cdn.simpleicons.org/figma/F24E1E' },
                                            { title: 'WordPress', src: 'https://cdn.simpleicons.org/wordpress/21759B' },
                                            { title: 'Shopify', src: 'https://cdn.simpleicons.org/shopify/7AB55C' },
                                            { title: 'GraphQL', src: 'https://cdn.simpleicons.org/graphql/E10098' },
                                            { title: 'Redis', src: 'https://cdn.simpleicons.org/redis/DC382D' },
                                            { title: 'Stripe', src: 'https://cdn.simpleicons.org/stripe/008CDD' },
                                        ];
                                        return (
                                            <>
                                                <div className="css-marquee css-marquee-ltr">
                                                    <div className="css-marquee-track">
                                                        {[...row1, ...row1].map((item, idx) => (
                                                            <div className="css-marquee-item" key={`r1-${idx}`}>
                                                                <img loading="lazy" decoding="async" src={`/assets/images/team/${item.img}`} alt={item.title} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="css-marquee css-marquee-rtl">
                                                    <div className="css-marquee-track">
                                                        {[...row2, ...row2].map((item, idx) => (
                                                            <div className="css-marquee-item" key={`r2-${idx}`}>
                                                                <img loading="lazy" decoding="async" src={`/assets/images/team/${item.img}`} alt={item.title} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="css-marquee css-marquee-ltr">
                                                    <div className="css-marquee-track">
                                                        {[...row3, ...row3].map((item, idx) => (
                                                            <div className="css-marquee-item" key={`r3-${idx}`}>
                                                                <img loading="lazy" decoding="async" src={item.src} alt={item.title} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-shape-3">
                        <img loading="lazy" decoding="async" src="/assets/images/shape/h7-testimonial-shape-blur.svg" alt="" />
                    </div>
                </section>
                {/* end: Team Section */}

                {/* start: Success Stories — video on left + testimonials on right */}
                <HomeSuccessStories />
                {/* end: Success Stories */}

                {/* start: Testimonial Section */}
                <section className="h5-testimonial section-gap section-gap-x">
                    <div className="container">
                        <div className="row justify-content-between">
                            <div className="col-12">
                                {/* Scroll-reveal heading */}
                                <Reveal>
                                    <div className="sec-heading style-3 sec-heading-centered">
                                        <span className="sub-title"><i className="tji-box"></i>CLIENT
                                            FEEDBACKS</span>
                                        <h2 className="sec-title text-anim">Success Stories Fuel
                                            our Innovation.</h2>
                                    </div>
                                </Reveal>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="testimonial-wrapper h5-testimonial-wrapper">
                                    {(() => {
                                        const testimonials = [
                                            { name: 'Sophia Martinez', des: 'Director of Operations, BrightPath Consulting', img: '6.png', text: 'The team at Dawki Infotech was committed and delivered quality work on time. Their ability to adapt to changes was impressive. That said, we would appreciate more proactive updates during critical milestones to ensure complete alignment. With better communication, they can become an exceptional service provider.', color: '#3b82f6' },
                                            { name: 'Michael Anderson', des: 'CEO, Anderson Global Solutions', img: '7.png', text: 'The team was responsive and professional throughout. However, we felt that initial requirement gathering could have been more detailed to avoid minor revisions later. Improving this process would make collaboration even smoother.', color: '#10b981' },
                                            { name: 'David Thompson', des: 'CTO, InnovateX Technologies', img: '8.png', text: 'Dawki Infotech handled our complex project well and demonstrated strong problem-solving skills. The final product met expectations, but the documentation could have been more comprehensive for easier handover. Enhancing this aspect would add significant value. Overall, a reliable and skilled team worth working with.', color: '#a855f7' },
                                            { name: 'Guy Hawkins', des: 'Managing Partner, Wilson & Co. Enterprises', img: '9.png', text: 'We were pleased with Dawki Infotech\u2019s professionalism and timely delivery. Their technical expertise is commendable. One area for improvement is providing clearer timelines when unexpected challenges arise. Transparency in such cases would strengthen trust even further. A solid partner for IT solutions.', color: '#ec4899' },
                                        ];
                                        const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
                                        return (
                                            <div className="google-reviews-marquee">
                                                <div className="google-reviews-track">
                                                    {[...testimonials, ...testimonials].map((item, idx) => (
                                                        <div className="google-review-card" key={`gt-${idx}`}>
                                                            <div className="google-review-header">
                                                                <div className="google-review-avatar" style={{ background: item.color }}>{initials(item.name)}</div>
                                                                <div className="google-review-meta">
                                                                    <h4 className="google-review-name">{item.name}</h4>
                                                                    <span className="google-review-time">{item.des}</span>
                                                                </div>
                                                                <span className="google-review-source" aria-label="Google" title="Google">
                                                                    <svg width="22" height="22" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                                                        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                                                                        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                                                                        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                                                                        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
                                                                    </svg>
                                                                </span>
                                                            </div>
                                                            <div className="google-review-rating">
                                                                <span className="google-stars" aria-label="5 stars">
                                                                    <i className="gr-star"></i>
                                                                    <i className="gr-star"></i>
                                                                    <i className="gr-star"></i>
                                                                    <i className="gr-star"></i>
                                                                    <i className="gr-star"></i>
                                                                </span>
                                                                <span className="google-verified" title="Verified" aria-label="Verified">
                                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#1a73e8" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L9.91 4.09 7 4l-.91 2.91L4 9l1.09 2.09L4 13l2.09 0.91L7 16l2.91-.09L12 18l2.09-2.09L17 16l.91-2.91L20 13l-1.09-2.09L20 9l-2.09-0.91L17 4l-2.91 0.09L12 2zm-1.5 13.5l-3-3 1.41-1.41L10.5 12.67l4.59-4.59 1.41 1.41L10.5 15.5z"/></svg>
                                                                </span>
                                                            </div>
                                                            <p className="google-review-text">{item.text}</p>
                                                            <Link href="/contact" className="google-review-readmore">Read more</Link>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-shape-1">
                        <img loading="lazy" decoding="async" src="/assets/images/shape/pattern-2.svg" alt="" />
                    </div>
                    <div className="bg-shape-2">
                        <img loading="lazy" decoding="async" src="/assets/images/shape/pattern-3.svg" alt="" />
                    </div>
                </section>
                {/* end: Testimonial Section */}

                {/* start: Industries We Power */}
                <HomeIndustries />
                {/* end: Industries We Power */}

                {/* start: Behind the Build — Video Showcase (above the contact form) */}
                <HomeVideoShowcase />
                {/* end: Behind the Build */}

                {/* start: Contact Section */}
                <section className="tj-contact-section h4-contact-section section-gap section-gap-x">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="contact-form style-3 wow fadeInUp" data-wow-delay=".4s">
                                    <div className="sec-heading style-4">
                                        <span className="sub-title"><i className="tji-box"></i>Get in Touch</span>
                                        <h2 className="sec-title title-anim">Drop us a Line Here.</h2>
                                    </div>
                                    <form id="contact-form-3">
                                        <div className="row wow fadeInUp" data-wow-delay=".5s">
                                            <div className="col-sm-6"><div className="form-input"><label className="cf-label">Full Name *</label><input type="text" name="cfName3" /></div></div>
                                            <div className="col-sm-6"><div className="form-input"><label className="cf-label">Email Address *</label><input type="email" name="cfEmail3" /></div></div>
                                            <div className="col-sm-6"><div className="form-input"><label className="cf-label">Phone number *</label><input type="tel" name="cfPhone3" /></div></div>
                                            <div className="col-sm-6">
                                                <div className="form-input">
                                                    <div className="tj-nice-select-box">
                                                        <div className="tj-select">
                                                            <label className="cf-label">Chose a option</label>
                                                            <select name="cfSubject3">
                                                                <option value="1">Business Strategy</option>
                                                                <option value="2">Customer Experience</option>
                                                                <option value="3">Sustainability and ESG</option>
                                                                <option value="4">Training and Development</option>
                                                                <option value="5">IT Support & Maintenance</option>
                                                                <option value="6">Marketing Strategy</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-12"><div className="form-input message-input"><label className="cf-label">Message here... *</label><textarea name="cfMessage3" id="message"></textarea></div></div>
                                            <div className="submit-btn">
                                                <button className="tj-primary-btn" type="submit">
                                                    <span className="btn-text"><span>Send Message</span></span>
                                                    <span className="btn-icon"><i className="tji-arrow-right-long"></i></span>
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="testimonial-wrapper-3 wow fadeInUp" data-wow-delay=".5s">

                                    <div className="swiper testimonial-slider-2 h4-testimonial">
                                        <div className="about-content-area  h6-about-content  style-1 wow fadeInLeft" data-wow-delay=".2s">
                                            <div className="sec-heading style-2 style-6">
                                                <h2 className="sec-title title-anim">Driving Innovation for Smarter, Stronger, and Sustainable Growth
                                                </h2>
                                            </div>
                                            <div className="h6-about-funfact-wrapper">
                                                <div className="h6-about-funfact">
                                                    <div className="countup-item">
                                                        <div className="inline-content">
                                                            <span className="odometer countup-number" data-count="500"></span>
                                                            <span className="count-plus">+</span>
                                                        </div>
                                                        <span className="count-text">Successful Projects Delivered Globally.</span>
                                                    </div>
                                                    <div className="countup-item">
                                                        <div className="inline-content">
                                                            <span className="odometer countup-number" data-count="3"></span>
                                                            <span className="count-plus">X</span>
                                                        </div>
                                                        <span className="count-text">Faster Business Growth with Our Solutions.</span>
                                                    </div>

                                                </div>
                                                <div className="h6-about-funfact-shape">
                                                    <img loading="lazy" decoding="async" src="/assets/images/shape/about-counter-shape-blur.svg" alt="" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* end: Contact Section */}

                {/* start: Blog Section */}
                <section className="tj-blog-section-2 section-gap">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="sec-heading-wrap">
                                    <span className="sub-title wow fadeInUp" data-wow-delay=".3s">Read Blogs</span>
                                    <div className="heading-wrap-content">
                                        <div className="sec-heading style-2">
                                            <h2 className="sec-title text-anim">Strategies and <span>Insights.</span></h2>
                                        </div>
                                        <div className="wow fadeInUp" data-wow-delay=".5s">
                                            <p className="desc">Developing personalized customer journeys to increase satisfaction and loyalty.</p>
                                        </div>
                                        <div className="slider-navigation d-none d-md-inline-flex wow fadeInUp" data-wow-delay=".7s">
                                            <div className="slider-prev"><span className="anim-icon"><i className="tji-arrow-left"></i><i className="tji-arrow-left"></i></span></div>
                                            <div className="slider-next"><span className="anim-icon"><i className="tji-arrow-right"></i><i className="tji-arrow-right"></i></span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="blog-wrapper wow fadeIn" data-wow-delay=".5s">
                                    <div className="swiper blog-slider">
                                        <div className="swiper-wrapper">
                                            {[
                                                { title: 'Chatbots vs. AI Assistants: Navigating the Future of Business Automation', img: 'Chatbots_vs_AI_Assistants.jpg', date: '28', month: 'Feb' },
                                                { title: 'AI Development Costs: Evaluating the True Value for Your Business', img: 'AI_Development_Costs.jpg', date: '28', month: 'Feb' },
                                                { title: 'Measuring ROI in Generative AI Projects: A Practical Framework', img: 'ROI.jpg', date: '28', month: 'Feb' },
                                            ].map((item, idx) => (
                                                <div className="swiper-slide" key={idx}>
                                                    <div className="blog-item style-2">
                                                        <div className="blog-thumb">
                                                            <Link href="/blog-details"><img loading="lazy" decoding="async" src={`/assets/images/blog/${item.img}`} alt="" /></Link>
                                                            <div className="blog-date"><span className="date">{item.date}</span><span className="month">{item.month}</span></div>
                                                        </div>
                                                        <div className="blog-content">
                                                            <div className="title-area">
                                                                <div className="blog-meta"><span className="categories"><Link href="/blog">Business</Link></span><span>By Mayank Gupta</span></div>
                                                                <h4 className="title"><Link href="/blog-details">{item.title}</Link></h4>
                                                            </div>
                                                            <Link className="text-btn" href="/blog-details">
                                                                <span className="btn-text"><span>Read More</span></span>
                                                                <span className="btn-icon"><i className="tji-arrow-right-long"></i></span>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="swiper-pagination-area"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* end: Blog Section */}

                {/* start: Cta Section */}
                <section className="tj-cta-section dawki-cta-modern">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="dawki-cta-card">
                                    <div className="dawki-cta-orb dawki-cta-orb-1"></div>
                                    <div className="dawki-cta-orb dawki-cta-orb-2"></div>
                                    <div className="dawki-cta-orb dawki-cta-orb-3"></div>
                                    <div className="dawki-cta-grid"></div>
                                    <div className="dawki-cta-content">
                                        <span className="dawki-cta-badge">
                                            <span className="dawki-cta-badge-dot"></span>
                                            Ready to Launch?
                                        </span>
                                        <h2 className="dawki-cta-title">
                                            Have an Idea? <span>Let's Turn It Into Reality.</span>
                                        </h2>
                                        <p className="dawki-cta-desc">
                                            From concept to launch — we design, build, and scale digital products that drive real business results. Book a free 30-minute strategy call with our team.
                                        </p>
                                        <div className="dawki-cta-actions">
                                            <Link className="dawki-cta-btn dawki-cta-btn-primary" href="/contact">
                                                <span>Book a Free Consultation</span>
                                                <i className="tji-arrow-right-long"></i>
                                            </Link>
                                            <Link className="dawki-cta-btn dawki-cta-btn-secondary" href="/portfolio">
                                                <span>View Our Work</span>
                                            </Link>
                                        </div>
                                        <div className="dawki-cta-meta">
                                            <span><strong>⚡</strong> 24-hour response</span>
                                            <span className="dawki-cta-meta-divider"></span>
                                            <span><strong>🔒</strong> 100% confidential</span>
                                            <span className="dawki-cta-meta-divider"></span>
                                            <span><strong>💸</strong> No obligation, free quote</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* end: Cta Section */}
            </main>

            {/* Floating back-to-top button */}
            <button type="button" className="dawki-back-to-top" aria-label="Back to top">
                <i className="tji-arrow-up-long"></i>
            </button>
        </FrontendLayout>
    );
};

export default Welcome;
