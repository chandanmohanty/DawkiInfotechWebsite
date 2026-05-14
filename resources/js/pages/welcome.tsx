import {
    type FC,
    useEffect,
    useRef,
    useState,
    useCallback,
    useMemo,
    memo,
    type ReactNode,
    type MouseEvent as ReactMouseEvent,
} from 'react';
import FrontendLayout from '@/layouts/FrontendLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

/* ============================================================================
 * Local fade-up + stagger helpers — mirror the About page so the Our Solutions
 * section animates identically to About → Our Journey timeline.
 * ============================================================================ */
const journeyFadeUpVar: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] } },
};
const journeyStaggerContainerVar: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const journeyStaggerItemVar: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] } },
};

const RevealUp: FC<{ children: ReactNode; className?: string }> = ({ children, className }) => {
    const reduced = useReducedMotion();
    if (reduced) return <div className={className}>{children}</div>;
    return (
        <motion.div className={className} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={journeyFadeUpVar}>
            {children}
        </motion.div>
    );
};

const StaggerWrap: FC<{ children: ReactNode; className?: string }> = ({ children, className }) => {
    const reduced = useReducedMotion();
    if (reduced) return <div className={className}>{children}</div>;
    return (
        <motion.div className={className} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={journeyStaggerContainerVar}>
            {children}
        </motion.div>
    );
};

const StaggerCh: FC<{ children: ReactNode; className?: string }> = ({ children, className }) => {
    const reduced = useReducedMotion();
    if (reduced) return <div className={className}>{children}</div>;
    return (
        <motion.div className={className} variants={journeyStaggerItemVar}>
            {children}
        </motion.div>
    );
};

/* ============================================================================
 * SlideInRight — slides each card from the right edge to its resting place
 * when it scrolls into view. Used for the sticky "Website Development
 * Solutions" cards on the home page. JS-driven so it bypasses the welcome
 * page's universal CSS animation/transition killer entirely.
 * ============================================================================ */
const SlideInRight: FC<{ children: ReactNode; className?: string; delay?: number }> = ({ children, className, delay = 0 }) => {
    const reduced = useReducedMotion();
    if (reduced) return <div className={className}>{children}</div>;
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1], delay }}
            style={{ willChange: 'transform, opacity' }}
        >
            {children}
        </motion.div>
    );
};

/* ============================================================================
 * Welcome page — lightweight rendering.
 * All scroll-triggered Framer Motion reveals were removed: they (a) wrote
 * inline opacity:0 until their IntersectionObserver fired, which caused text
 * to disappear on refresh, and (b) added one IO per motion element, which
 * compounded scroll lag on mid-tier devices. Content now renders visible
 * immediately. Decorative CSS animations are killed via an injected stylesheet
 * (see useEffect below) so the page paints once and stays still while
 * scrolling.
 * ============================================================================ */

/* ============================================================================
 * Reveal / StaggerGroup / StaggerChild — kept as plain wrappers so existing
 * call sites compile. They render their children directly with no animation.
 * ============================================================================ */
const Reveal: FC<{ children: ReactNode; className?: string; delay?: number }> = memo(({ children, className }) => (
    <div className={className}>{children}</div>
));
Reveal.displayName = 'Reveal';

const StaggerGroup: FC<{ children: ReactNode; className?: string }> = memo(
    ({ children, className }) => <div className={className}>{children}</div>
);
StaggerGroup.displayName = 'StaggerGroup';

const StaggerChild: FC<{ children: ReactNode; className?: string }> = memo(
    ({ children, className }) => <div className={className}>{children}</div>
);
StaggerChild.displayName = 'StaggerChild';

/* ============================================================================
 * Magnetic button — pulls toward cursor on hover.
 * Single rAF lerp loop chases a target — no CSS transition, no per-mousemove
 * tween restart. Self-stops when at rest, so we don't burn frames idling.
 * ============================================================================ */
const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const MagneticBox: FC<{ children: ReactNode; className?: string; strength?: number }> = memo(
    ({ children, className, strength = 14 }) => {
        const ref = useRef<HTMLDivElement>(null);
        const reducedMotion = prefersReducedMotion();
        const rafRef = useRef(0);
        const targetRef = useRef({ x: 0, y: 0 });
        const currentRef = useRef({ x: 0, y: 0 });
        const rectRef = useRef<DOMRect | null>(null);

        const tick = useCallback(() => {
            const t = targetRef.current;
            const c = currentRef.current;
            // exponential smoothing — 0.18 ≈ Apple's typical follow feel
            c.x += (t.x - c.x) * 0.18;
            c.y += (t.y - c.y) * 0.18;
            const el = ref.current;
            if (el) {
                el.style.transform = `translate3d(${c.x.toFixed(2)}px, ${c.y.toFixed(2)}px, 0)`;
            }
            // stop the loop once we're within sub-pixel of the target
            if (Math.abs(t.x - c.x) > 0.05 || Math.abs(t.y - c.y) > 0.05) {
                rafRef.current = requestAnimationFrame(tick);
            } else {
                rafRef.current = 0;
                // snap final pixel-aligned value to avoid blurring
                if (el) el.style.transform = `translate3d(${t.x}px, ${t.y}px, 0)`;
            }
        }, []);

        const handleMouseEnter = useCallback(() => {
            // Cache rect once per hover so mousemove doesn't trigger forced layout
            if (ref.current) rectRef.current = ref.current.getBoundingClientRect();
        }, []);

        const handleMouseMove = useCallback(
            (e: ReactMouseEvent<HTMLDivElement>) => {
                if (reducedMotion) return;
                const rect = rectRef.current;
                if (!rect) return;
                targetRef.current.x = ((e.clientX - rect.left - rect.width / 2) / rect.width) * strength;
                targetRef.current.y = ((e.clientY - rect.top - rect.height / 2) / rect.height) * strength;
                if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
            },
            [reducedMotion, strength, tick]
        );

        const handleMouseLeave = useCallback(() => {
            targetRef.current.x = 0;
            targetRef.current.y = 0;
            rectRef.current = null;
            if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
        }, [tick]);

        useEffect(
            () => () => {
                if (rafRef.current) cancelAnimationFrame(rafRef.current);
            },
            []
        );

        return (
            <div
                ref={ref}
                className={className}
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    display: 'inline-block',
                    willChange: 'transform',
                    transform: 'translate3d(0,0,0)',
                }}
            >
                {children}
            </div>
        );
    }
);
MagneticBox.displayName = 'MagneticBox';

/* ============================================================================
 * "More Services" handler — instead of navigating, scrolls to top and
 * force-opens the existing nav mega-menu (the one that normally appears on
 * hover). Reuses the same dropdown DOM that lives in <Header />, no new
 * markup. Closes on click-outside, mouseleave, or Escape.
 * ============================================================================ */
const openServicesMegaMenu = (e: ReactMouseEvent<Element>) => {
    e.preventDefault();
    if (typeof window === 'undefined') return;

    const li = document.querySelector<HTMLElement>('[data-mega-trigger="services"]');
    if (!li) {
        // fallback: if the trigger isn't mounted, just navigate as the link would
        const target = e.currentTarget as HTMLAnchorElement;
        if (target?.href) window.location.href = target.href;
        return;
    }

    const reveal = () => {
        li.classList.add('is-mega-open');

        const close = (ev: Event) => {
            if (ev.type === 'keydown' && (ev as KeyboardEvent).key !== 'Escape') return;
            if (ev.type === 'click' && li.contains(ev.target as Node)) return;
            li.classList.remove('is-mega-open');
            document.removeEventListener('click', close, true);
            document.removeEventListener('keydown', close);
            li.removeEventListener('mouseleave', close);
        };

        // Defer binding so the originating click doesn't immediately fire close.
        window.setTimeout(() => {
            document.addEventListener('click', close, true);
            document.addEventListener('keydown', close);
            li.addEventListener('mouseleave', close);
        }, 60);
    };

    if (window.scrollY < 8) {
        // already at top — no scroll needed
        reveal();
        return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Wait for smooth-scroll to settle. 700ms covers most viewport heights;
    // shorter than the full duration is fine — the menu just appears as the
    // page is finishing its glide.
    window.setTimeout(reveal, 700);
};

/* ============================================================================
 * Home Video Showcase
 * ============================================================================ */
const HOME_SHOWCASE_VIDEO = '/assets/images/header/demo/dawki_video.mp4';
const HOME_STORIES_VIDEO = '/assets/images/about/review-video-2.mp4';

const HomeVideoShowcase: FC = memo(() => {
    const ref = useRef<HTMLVideoElement>(null);
    const [started, setStarted] = useState(false);

    const handleStart = useCallback(() => {
        setStarted(true);
        // microtask is enough — no need for setTimeout
        queueMicrotask(() => {
            ref.current?.play().catch(() => {});
        });
    }, []);

    return (
        <section className="dawki-ent-video" style={{ contentVisibility: 'auto', containIntrinsicSize: '900px' }}>
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

                <div className="dawki-ent-video-frame">
                    <div className="dawki-ent-video-frame-glow"></div>
                    <video
                        ref={ref}
                        src={HOME_SHOWCASE_VIDEO}
                        poster="/assets/images/testimonial/client_feedback.jpg"
                        controls
                        preload="none"
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
                </div>
            </div>
        </section>
    );
});
HomeVideoShowcase.displayName = 'HomeVideoShowcase';

/* ============================================================================
 * Home Success Stories
 * ============================================================================ */
const HOME_STORY_TESTIMONIALS = [
    {
        name: 'Aarav Sharma',
        role: 'Director of Operations, Saanvi Consulting',
        text: 'The team at Dawki Infotech delivered quality work on time. Their ability to adapt was impressive — a reliable partner for ambitious software projects.',
        rating: 5,
    },
    {
        name: 'Priya Patel',
        role: 'CEO, Lumen Global Solutions',
        text: 'Responsive and professional throughout. Smooth collaboration and a polished result that met every expectation we set out at the start.',
        rating: 5,
    },
    {
        name: 'Rohan Verma',
        role: 'CTO, Zenith Technologies',
        text: 'Handled our complex project with strong problem-solving. The final product met expectations on every dimension and shipped without surprises.',
        rating: 5,
    },
] as const;

const HomeSuccessStories: FC = memo(() => {
    const ref = useRef<HTMLVideoElement>(null);
    const [started, setStarted] = useState(false);

    const handleStart = useCallback(() => {
        setStarted(true);
        queueMicrotask(() => {
            ref.current?.play().catch(() => {});
        });
    }, []);

    /* No external poster image exists for this video, so we hint the browser
     * to render a frame from the actual clip as its visible thumbnail —
     * once metadata loads, seek to 0.8s where the speaker is clearly framed.
     * This makes the person in the video appear as the still image. */
    useEffect(() => {
        const v = ref.current;
        if (!v) return;
        const onMeta = () => {
            try {
                if (v.currentTime < 0.1) v.currentTime = 0.8;
            } catch {
                /* some browsers throw if seek is too early — safe to ignore */
            }
        };
        v.addEventListener('loadedmetadata', onMeta);
        return () => v.removeEventListener('loadedmetadata', onMeta);
    }, []);

    return (
        <section className="dawki-home-stories" style={{ contentVisibility: 'auto', containIntrinsicSize: '1100px' }}>
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
                    <div className="dawki-home-stories-left">
                        <div className="dawki-home-stories-video">
                            <div className="dawki-home-stories-video-glow"></div>
                            <video
                                ref={ref}
                                src={`${HOME_STORIES_VIDEO}#t=0.8`}
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
                            <a href="/contact" className="dawki-home-stories-cta-btn">
                                <span>Explore More Stories</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                            </a>
                        </div>
                    </div>

                    <div className="dawki-home-stories-right">
                        {HOME_STORY_TESTIMONIALS.map((t, i) => (
                            <article
                                key={i}
                                className="dawki-home-stories-card"
                            >
                                <div className="dawki-home-stories-card-head dawki-home-stories-card-head--no-avatar">
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
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
});
HomeSuccessStories.displayName = 'HomeSuccessStories';

/* ============================================================================
 * Home Industries — scroll-pinned horizontal slide carousel.
 * The section becomes ~300vh tall, the inner content sticks to the viewport,
 * and as the user scrolls the cards translate horizontally — a premium
 * "scrollytelling" pattern. Every card carries a real Unsplash image so the
 * verticals feel concrete, not abstract. On reduced-motion / mobile we fall
 * back to a normal stacked grid with no sticky/horizontal trickery.
 * ============================================================================ */
type IndustryCard = {
    name: string;
    desc: string;
    a: string; b: string; glow: string; color: string;
    tags: string[];
    icon: ReactNode;
    image: string;     // hero image shown on the card (Unsplash CDN)
};

const HOME_INDUSTRIES: IndustryCard[] = [
    {
        name: 'Healthcare',
        desc: 'HIPAA-grade portals, telehealth, and clinical workflows for hospitals, clinics, and digital-first health brands.',
        a: '#06b6d4', b: '#4f7cff', glow: 'rgba(6, 182, 212, 0.32)', color: '#67e8f9',
        tags: ['HIPAA', 'Telehealth', 'EMR'],
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80',
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
        image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=80',
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
        image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=900&q=80',
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
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80',
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
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=900&q=80',
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
        image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=80',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
            </svg>
        ),
    },
    {
        name: 'Travel & Hospitality',
        desc: 'Booking engines, itinerary apps, hotel CMS, and loyalty platforms — for OTAs, airlines, and resorts.',
        a: '#0ea5e9', b: '#22d3ee', glow: 'rgba(14, 165, 233, 0.32)', color: '#7dd3fc',
        tags: ['Booking', 'PMS', 'Loyalty'],
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
            </svg>
        ),
    },
    {
        name: 'Logistics & Supply Chain',
        desc: 'Fleet tracking, warehouse management, route optimization, and last-mile delivery dashboards.',
        a: '#eab308', b: '#f97316', glow: 'rgba(234, 179, 8, 0.32)', color: '#fde68a',
        tags: ['Fleet', 'WMS', 'Routing'],
        image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=900&q=80',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
        ),
    },
    {
        name: 'Media & Entertainment',
        desc: 'Streaming platforms, OTT apps, video pipelines, and creator tools — built to scale to millions of users.',
        a: '#dc2626', b: '#a855f7', glow: 'rgba(220, 38, 38, 0.32)', color: '#fca5a5',
        tags: ['OTT', 'Streaming', 'CMS'],
        image: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=900&q=80',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
        ),
    },
];

/**
 * Renders one industry card. Same markup for both layouts (scrollytelling +
 * grid fallback) so styles stay in sync. Image is set as a CSS bg via inline
 * style + lazy-loaded via a hidden <img> for browser preload.
 */
const IndustryCardItem: FC<{ ind: IndustryCard }> = memo(({ ind }) => (
    <article
        className="dawki-home-ind-card"
        style={{
            ['--ic-a' as string]: ind.a,
            ['--ic-b' as string]: ind.b,
            ['--ic-glow' as string]: ind.glow,
            ['--ic-color' as string]: ind.color,
        }}
    >
        <div
            className="dawki-home-ind-card-image"
            style={{ backgroundImage: `url(${ind.image})` }}
            aria-hidden="true"
        >
            <div className="dawki-home-ind-card-image-overlay"></div>
        </div>
        <div className="dawki-home-ind-card-body">
            <span className="dawki-home-ind-card-icon">{ind.icon}</span>
            <h3 className="dawki-home-ind-card-title">{ind.name}</h3>
            <p className="dawki-home-ind-card-desc">{ind.desc}</p>
            <div className="dawki-home-ind-card-tags">
                {ind.tags.map((t) => (
                    <span key={t} className="dawki-home-ind-card-tag">{t}</span>
                ))}
            </div>
        </div>
    </article>
));
IndustryCardItem.displayName = 'IndustryCardItem';

const HomeIndustries: FC = memo(() => {
    const reduced = useReducedMotion();
    return (
        <section className="dawki-home-ind dawki-home-ind--bento" style={{ contentVisibility: 'auto', containIntrinsicSize: '1400px' }}>
            <div className="container">
                <RevealUp>
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
                </RevealUp>

                <motion.div
                    className="dawki-home-ind-grid"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
                    }}
                >
                    {HOME_INDUSTRIES.map((ind, i) => (
                        <motion.div
                            key={ind.name}
                            className="dawki-home-ind-grid-cell"
                            variants={
                                reduced
                                    ? undefined
                                    : {
                                          hidden: { opacity: 0, y: 60, scale: 0.92, rotateX: -10 },
                                          visible: {
                                              opacity: 1,
                                              y: 0,
                                              scale: 1,
                                              rotateX: 0,
                                              transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] },
                                          },
                                      }
                            }
                            whileHover={
                                reduced
                                    ? undefined
                                    : { y: -10, scale: 1.02, transition: { duration: 0.35, ease: 'easeOut' } }
                            }
                            /* Alternate cards float subtly in opposite directions
                             * — gives a "living grid" feel without scroll
                             * jacking. Pure CSS animation re-enabled below. */
                            style={{
                                animationDelay: `${(i % 4) * 0.4}s`,
                            }}
                        >
                            <IndustryCardItem ind={ind} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
});
HomeIndustries.displayName = 'HomeIndustries';

/* ============================================================================
 * HomeContact — premium contact section ("Let's Build Something Great
 * Together"). White card with name + email + phone + radio-card help type +
 * "what are you building" textarea. Posts to the same /contact endpoint as
 * the dedicated Contact page so messages reach the same backend handler.
 * ============================================================================ */
const HOME_CONTACT_HELP_OPTIONS = [
    {
        id: 'team',
        title: 'Dedicated Team',
        desc: 'Extend your engineering team',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
    },
    {
        id: 'software',
        title: 'Software Development',
        desc: 'End-to-end project build',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
            </svg>
        ),
    },
    {
        id: 'automation',
        title: 'AI Automations',
        desc: 'Agents, workflows & integrations',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <path d="M14 17.5h7" />
                <path d="M17.5 14v7" />
            </svg>
        ),
    },
    {
        id: 'marketing',
        title: 'Digital Marketing',
        desc: 'SEO, ads & growth strategy',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
        ),
    },
    {
        id: 'other',
        title: 'Something else',
        desc: 'Tell us in the message',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        ),
    },
] as const;

const HomeContact: FC = memo(() => {
    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        name: '',
        email: '',
        phone: '',
        help_type: 'software',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/contact', {
            preserveScroll: true,
            onSuccess: () => reset('name', 'email', 'phone', 'message'),
        });
    };

    return (
        <section className="dawki-home-contact dawki-home-contact--centered" style={{ contentVisibility: 'auto', containIntrinsicSize: '900px' }}>
            <div className="container">
                {/* TOP — heading + supporting copy, centered */}
                <RevealUp className="dawki-home-contact-top">
                    <span className="dawki-home-contact-pill">
                        <span className="dawki-home-contact-pill-dot"></span>
                        Get in Touch
                    </span>
                    <h2 className="dawki-home-contact-title">
                        Let's Build Something <span>Great Together</span>
                    </h2>
                    <p className="dawki-home-contact-subtitle">
                        Tell us about your project — we'll respond within 24 hours with a tailored plan and free quote.
                    </p>
                </RevealUp>

                {/* BELOW — the form card, centered single column */}
                <div className="dawki-home-contact-form-wrap">
                    <RevealUp className="dawki-home-contact-right">
                        <div className="dawki-home-contact-card">
                            {recentlySuccessful && (
                                <div className="dawki-home-contact-success" role="status">
                                    Message sent. We'll be in touch within 24 hours.
                                </div>
                            )}
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="dawki-home-contact-row">
                                    <div className="dawki-home-contact-field">
                                        <label htmlFor="hc-name">
                                            Name <span className="dawki-home-contact-required">*</span>
                                        </label>
                                        <input
                                            id="hc-name"
                                            type="text"
                                            placeholder="Jane Smith"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                        />
                                        {errors.name && <span className="dawki-home-contact-error">{errors.name}</span>}
                                    </div>
                                </div>

                                <div className="dawki-home-contact-row dawki-home-contact-row--two">
                                    <div className="dawki-home-contact-field">
                                        <label htmlFor="hc-email">
                                            Email <span className="dawki-home-contact-required">*</span>
                                        </label>
                                        <input
                                            id="hc-email"
                                            type="email"
                                            placeholder="you@example.com"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                        />
                                        {errors.email && <span className="dawki-home-contact-error">{errors.email}</span>}
                                    </div>
                                    <div className="dawki-home-contact-field">
                                        <label htmlFor="hc-phone">
                                            Phone <span className="dawki-home-contact-optional">optional</span>
                                        </label>
                                        <div className="dawki-home-contact-phone">
                                            <span className="dawki-home-contact-phone-cc" aria-label="India +91">
                                                🇮🇳 +91
                                            </span>
                                            <input
                                                id="hc-phone"
                                                type="tel"
                                                placeholder="555 000 0000"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                            />
                                        </div>
                                        {errors.phone && <span className="dawki-home-contact-error">{errors.phone}</span>}
                                    </div>
                                </div>

                                <div className="dawki-home-contact-help">
                                    <div className="dawki-home-contact-help-label">
                                        How can we help? <span className="dawki-home-contact-help-hint">choose one</span>
                                    </div>
                                    <div className="dawki-home-contact-help-options">
                                        {HOME_CONTACT_HELP_OPTIONS.map((opt) => {
                                            const checked = data.help_type === opt.id;
                                            return (
                                                <label
                                                    key={opt.id}
                                                    className={`dawki-home-contact-help-option ${checked ? 'is-active' : ''}`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="help_type"
                                                        value={opt.id}
                                                        checked={checked}
                                                        onChange={() => setData('help_type', opt.id)}
                                                    />
                                                    <span className="dawki-home-contact-help-icon">{opt.icon}</span>
                                                    <span className="dawki-home-contact-help-text">
                                                        <strong>{opt.title}</strong>
                                                        <span>{opt.desc}</span>
                                                    </span>
                                                    <span className="dawki-home-contact-help-check" aria-hidden="true">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="dawki-home-contact-field">
                                    <label htmlFor="hc-message">
                                        What are you building? <span className="dawki-home-contact-required">*</span>
                                    </label>
                                    <textarea
                                        id="hc-message"
                                        rows={4}
                                        placeholder="Describe your project — what it does, who you serve, and any rough timeline."
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        required
                                    />
                                    {errors.message && <span className="dawki-home-contact-error">{errors.message}</span>}
                                </div>

                                <button
                                    type="submit"
                                    className="dawki-home-contact-submit"
                                    disabled={processing}
                                >
                                    <span>{processing ? 'Sending…' : 'Send Message'}</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                                </button>
                            </form>
                        </div>
                    </RevealUp>
                </div>
            </div>
        </section>
    );
});
HomeContact.displayName = 'HomeContact';

/* ============================================================================
 * HomeStats — animated impact counters. requestAnimationFrame-driven so it's
 * lightweight and respects reduced-motion. Each stat counts up once when the
 * section first scrolls into view.
 * ============================================================================ */
type StatItem = { label: string; target: number; suffix: string; format?: 'k' };
const HOME_STATS: readonly StatItem[] = [
    { label: 'Successful Projects', target: 500, suffix: '+' },
    { label: 'Happy Clients', target: 200, suffix: '+' },
    { label: 'Years of Experience', target: 10, suffix: '+' },
    { label: 'Countries Served', target: 25, suffix: '+' },
];

const Counter: FC<{ target: number; suffix: string; reduced: boolean }> = ({ target, suffix, reduced }) => {
    const [value, setValue] = useState(reduced ? target : 0);
    const ref = useRef<HTMLSpanElement>(null);
    const startedRef = useRef(false);

    useEffect(() => {
        if (reduced) return;
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting || startedRef.current) return;
                    startedRef.current = true;
                    const duration = 1600;
                    const start = performance.now();
                    const tick = (now: number) => {
                        const elapsed = Math.min(1, (now - start) / duration);
                        // ease-out cubic for nice deceleration
                        const eased = 1 - Math.pow(1 - elapsed, 3);
                        setValue(Math.round(target * eased));
                        if (elapsed < 1) requestAnimationFrame(tick);
                    };
                    requestAnimationFrame(tick);
                    io.disconnect();
                });
            },
            { threshold: 0.4 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [target, reduced]);

    return (
        <span ref={ref}>
            {value}
            <em>{suffix}</em>
        </span>
    );
};

const HomeStats: FC = memo(() => {
    const reduced = useReducedMotion();
    return (
        <section className="dawki-home-stats" style={{ contentVisibility: 'auto', containIntrinsicSize: '500px' }}>
            <div className="container">
                <RevealUp>
                    <div className="dawki-home-stats-heading">
                        <span className="dawki-home-stats-pill">
                            <span className="dawki-home-stats-pill-dot"></span>
                            By the Numbers
                        </span>
                        <h2 className="dawki-home-stats-title">
                            A Decade of <span>Shipping Real Results</span>
                        </h2>
                        <p className="dawki-home-stats-subtitle">
                            Numbers that prove momentum — projects delivered, clients trusted, and milestones hit on time.
                        </p>
                    </div>
                </RevealUp>

                <motion.div
                    className="dawki-home-stats-grid"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
                    }}
                >
                    {HOME_STATS.map((s) => (
                        <motion.div
                            key={s.label}
                            className="dawki-home-stats-card"
                            variants={
                                reduced
                                    ? undefined
                                    : {
                                          hidden: { opacity: 0, y: 30 },
                                          visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] } },
                                      }
                            }
                        >
                            <div className="dawki-home-stats-num">
                                <Counter target={s.target} suffix={s.suffix} reduced={!!reduced} />
                            </div>
                            <div className="dawki-home-stats-label">{s.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
});
HomeStats.displayName = 'HomeStats';

/* ============================================================================
 * HomeWhyChoose — 6 differentiator cards in a 3-column grid with stagger
 * entrance + hover lift + per-card accent glow.
 * ============================================================================ */
type WhyCard = { title: string; desc: string; icon: ReactNode; a: string; b: string };
const HOME_WHY_CARDS: readonly WhyCard[] = [
    {
        title: 'Senior Engineers Only',
        desc: 'No juniors learning on your dime. Every developer has 5+ years shipping production code.',
        a: '#5b9eff', b: '#06b6d4',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
        ),
    },
    {
        title: '24-Hour Response',
        desc: 'Real humans, real answers — no bots, no week-long email chains. Average reply: 4 hours.',
        a: '#a855f7', b: '#ec4899',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </svg>
        ),
    },
    {
        title: 'Fixed-Price Quotes',
        desc: 'Scope locked, price locked. No surprise invoices halfway through the project — ever.',
        a: '#22c55e', b: '#06b6d4',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
        ),
    },
    {
        title: 'NDA + IP Protection',
        desc: 'Your idea, your IP. Mutual NDA day-one, code transferred to your repo on every commit.',
        a: '#0ea5e9', b: '#6366f1',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
        ),
    },
    {
        title: 'On-Time Delivery',
        desc: '94% of projects shipped on or before deadline. We commit to dates we can hit, not dates that sell.',
        a: '#f97316', b: '#eab308',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
                <polyline points="9 16 11 18 15 14" />
            </svg>
        ),
    },
    {
        title: '90-Day Bug Warranty',
        desc: 'Found a bug post-launch? We fix it free for 90 days. Skin in the game beyond delivery.',
        a: '#ec4899', b: '#a855f7',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M9 12l2 2 4-4" />
            </svg>
        ),
    },
];

const HomeWhyChoose: FC = memo(() => {
    const reduced = useReducedMotion();
    return (
        <section className="dawki-home-why" style={{ contentVisibility: 'auto', containIntrinsicSize: '900px' }}>
            <div className="dawki-home-why-orb dawki-home-why-orb--a" aria-hidden="true"></div>
            <div className="dawki-home-why-orb dawki-home-why-orb--b" aria-hidden="true"></div>
            <div className="container">
                <RevealUp>
                    <div className="dawki-home-why-heading">
                        <span className="dawki-home-why-pill">
                            <span className="dawki-home-why-pill-dot"></span>
                            Why Choose Dawki
                        </span>
                        <h2 className="dawki-home-why-title">
                            Built Different. <span>Built to Last.</span>
                        </h2>
                        <p className="dawki-home-why-subtitle">
                            Six reasons teams pick us over the agency next door — and stay for the long haul.
                        </p>
                    </div>
                </RevealUp>

                <motion.div
                    className="dawki-home-why-grid"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
                    }}
                >
                    {HOME_WHY_CARDS.map((c) => (
                        <motion.div
                            key={c.title}
                            className="dawki-home-why-card"
                            style={{
                                ['--w-a' as string]: c.a,
                                ['--w-b' as string]: c.b,
                            }}
                            variants={
                                reduced
                                    ? undefined
                                    : {
                                          hidden: { opacity: 0, y: 40, scale: 0.95 },
                                          visible: {
                                              opacity: 1, y: 0, scale: 1,
                                              transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] },
                                          },
                                      }
                            }
                        >
                            <div className="dawki-home-why-card-icon">{c.icon}</div>
                            <h3 className="dawki-home-why-card-title">{c.title}</h3>
                            <p className="dawki-home-why-card-desc">{c.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
});
HomeWhyChoose.displayName = 'HomeWhyChoose';

/* ============================================================================
 * HomeFAQ — accordion of pre-sales questions. Smooth expand/collapse via
 * framer-motion height animation. Single-open behavior for clarity.
 * ============================================================================ */
const HOME_FAQ_ITEMS = [
    {
        q: 'How long does a typical project take?',
        a: 'Most MVPs ship in 6–10 weeks. Larger platforms run 3–6 months. We give you a precise, fixed timeline after the discovery call — no padded estimates.',
    },
    {
        q: 'Which tech stacks do you build on?',
        a: 'React, Next.js, Vue, Node, Laravel, Python, Flutter, React Native, plus AWS / GCP / Azure on the cloud side. We pick the stack that fits your problem — not the other way round.',
    },
    {
        q: 'Do you sign an NDA before discussions?',
        a: 'Always. We send a mutual NDA before our first call so you can talk freely about your idea, IP, and customers without holding back.',
    },
    {
        q: 'Who owns the code you write for me?',
        a: 'You do — 100%. Code commits to your GitHub from day one, and full IP transfer is in our standard contract. No vendor lock-in.',
    },
    {
        q: 'What happens after the project launches?',
        a: 'Every project includes a 90-day bug warranty (free fixes) and an optional ongoing support retainer covering hosting, monitoring, updates, and feature work.',
    },
    {
        q: 'Can you work with our existing team or legacy codebase?',
        a: 'Absolutely. We embed engineers into your team (staff augmentation) or take over a legacy codebase for modernization. Onboarding is usually 3–5 days.',
    },
    {
        q: 'Do you also handle SEO and digital marketing?',
        a: 'Yes — full-service SEO (technical audits, on-page, off-page link building, content strategy) plus paid ads on Google, Meta and LinkedIn. We track every campaign in GA4 and Search Console with monthly transparent reports.',
    },
    {
        q: 'How long does SEO take to show results?',
        a: 'Technical fixes and Core Web Vitals improvements show within weeks. Meaningful organic ranking lifts typically take 3–6 months — faster for low-competition niches, longer for competitive verticals where we layer content + authority building.',
    },
    {
        q: 'Do you provide a free SEO audit before we engage?',
        a: 'Yes. We run a 30-point technical + content audit — covering Core Web Vitals, indexability, schema, backlink profile, and competitor gaps — and deliver it as a no-obligation PDF you can keep either way.',
    },
];

const HomeFAQ: FC = memo(() => {
    const [openIdx, setOpenIdx] = useState<number | null>(0);
    return (
        <section className="dawki-home-faq" style={{ contentVisibility: 'auto', containIntrinsicSize: '900px' }}>
            <div className="container">
                <div className="dawki-home-faq-grid">
                    <RevealUp className="dawki-home-faq-left">
                        <span className="dawki-home-faq-pill">
                            <span className="dawki-home-faq-pill-dot"></span>
                            FAQ
                        </span>
                        <h2 className="dawki-home-faq-title">
                            Questions <span>We Get a Lot.</span>
                        </h2>
                        <p className="dawki-home-faq-subtitle">
                            Everything most teams want to know before kicking off a project — straight answers, no jargon.
                        </p>
                        <a href="/faq" className="dawki-home-faq-link">
                            <span>See all FAQs</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                        </a>
                    </RevealUp>

                    <div className="dawki-home-faq-right">
                        {HOME_FAQ_ITEMS.map((item, i) => {
                            const isOpen = openIdx === i;
                            return (
                                <div key={i} className={`dawki-home-faq-item ${isOpen ? 'is-open' : ''}`}>
                                    <button
                                        type="button"
                                        className="dawki-home-faq-q"
                                        aria-expanded={isOpen}
                                        onClick={() => setOpenIdx(isOpen ? null : i)}
                                    >
                                        <span>{item.q}</span>
                                        <span className="dawki-home-faq-icon" aria-hidden="true">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="12" y1="5" x2="12" y2="19" />
                                                <line x1="5" y1="12" x2="19" y2="12" />
                                            </svg>
                                        </span>
                                    </button>
                                    <motion.div
                                        className="dawki-home-faq-a"
                                        initial={false}
                                        animate={{
                                            height: isOpen ? 'auto' : 0,
                                            opacity: isOpen ? 1 : 0,
                                        }}
                                        transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <p>{item.a}</p>
                                    </motion.div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
});
HomeFAQ.displayName = 'HomeFAQ';

/* ============================================================================
 * HomeEngagement — "How You Hire Us" tab-switcher. Click a tab to reveal a
 * detail panel with morphing slide+fade animation (different feel from the
 * 3D coverflow). Each model shows a description, 3 highlights, and an ideal
 * use-case so prospects self-qualify before booking a call.
 * ============================================================================ */
type EngagementModel = {
    id: string;
    label: string;
    title: string;
    desc: string;
    highlights: string[];
    bestFor: string;
    icon: ReactNode;
};

const HOME_ENGAGEMENT_MODELS: readonly EngagementModel[] = [
    {
        id: 'fixed',
        label: 'Fixed Price',
        title: 'Fixed Price, Fixed Scope',
        desc: 'Lock in scope, timeline, and total cost before we write a line of code. You get a single invoice and a guaranteed delivery date — no surprise change orders mid-build.',
        highlights: [
            'Detailed SOW with milestones & exact deliverables',
            'Guaranteed delivery date or your money back',
            '90-day post-launch bug warranty included',
        ],
        bestFor: 'MVPs, marketing sites, and well-defined feature builds',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
        ),
    },
    {
        id: 'tnm',
        label: 'Time & Material',
        title: 'Pay-as-You-Go',
        desc: 'Best when scope evolves week to week. We bill weekly hours at a transparent senior rate, with a sprint demo every Friday so you stay in control of priorities.',
        highlights: [
            'Weekly invoices — no long-term commitment',
            'Re-prioritize the backlog any sprint',
            'Full visibility into hours, tasks, and burn rate',
        ],
        bestFor: 'Agile feature work, R&D, and discovery-heavy projects',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </svg>
        ),
    },
    {
        id: 'team',
        label: 'Dedicated Team',
        title: 'Your Outsourced Squad',
        desc: 'A self-managed pod of senior engineers, a tech lead, and a project manager — embedded in your Slack and Jira — owning a product or business line end-to-end.',
        highlights: [
            'Dedicated tech lead + 3-6 engineers',
            'Daily standups in your tooling',
            'Monthly retainer, scale up/down anytime',
        ],
        bestFor: 'Long-term product ownership and dedicated capacity',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
    },
    {
        id: 'staff',
        label: 'Staff Augmentation',
        title: 'Plug-In Engineers',
        desc: 'Hand-picked engineers who join your team, attend your standups, and ship into your repo — like full-time hires, but onboarded in under a week and contractually flexible.',
        highlights: [
            'Pre-vetted senior talent in 5–7 days',
            'You direct the work day-to-day',
            'Cancel with 2 weeks notice — no hidden lock-in',
        ],
        bestFor: 'Filling skill gaps and burst capacity inside an existing team',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
        ),
    },
];

const HomeEngagement: FC = memo(() => {
    const reduced = useReducedMotion();
    const [activeId, setActiveId] = useState(HOME_ENGAGEMENT_MODELS[0].id);
    const active = HOME_ENGAGEMENT_MODELS.find((m) => m.id === activeId) ?? HOME_ENGAGEMENT_MODELS[0];

    return (
        <section className="dawki-home-eng" style={{ contentVisibility: 'auto', containIntrinsicSize: '700px' }}>
            <div className="container">
                <RevealUp>
                    <div className="dawki-home-eng-heading">
                        <span className="dawki-home-eng-pill">
                            <span className="dawki-home-eng-pill-dot"></span>
                            How You Hire Us
                        </span>
                        <h2 className="dawki-home-eng-title">
                            Engagement Models <span>Built Around You</span>
                        </h2>
                        <p className="dawki-home-eng-subtitle">
                            Four flexible ways to work together — pick the one that matches your scope, timeline, and team.
                        </p>
                    </div>
                </RevealUp>

                {/* Tab pills */}
                <RevealUp className="dawki-home-eng-tabs-wrap">
                    <div className="dawki-home-eng-tabs" role="tablist">
                        {HOME_ENGAGEMENT_MODELS.map((m) => (
                            <button
                                key={m.id}
                                type="button"
                                role="tab"
                                aria-selected={m.id === activeId}
                                onClick={() => setActiveId(m.id)}
                                className={`dawki-home-eng-tab ${m.id === activeId ? 'is-active' : ''}`}
                            >
                                <span className="dawki-home-eng-tab-icon">{m.icon}</span>
                                <span>{m.label}</span>
                            </button>
                        ))}
                    </div>
                </RevealUp>

                {/* Detail panel — morphs between models with crossfade + slide */}
                <div className="dawki-home-eng-panel-wrap">
                    <motion.article
                        key={active.id}
                        className="dawki-home-eng-panel"
                        initial={reduced ? false : { opacity: 0, y: 16 }}
                        animate={reduced ? undefined : { opacity: 1, y: 0 }}
                        transition={reduced ? undefined : { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                    >
                        <div className="dawki-home-eng-panel-left">
                            <div className="dawki-home-eng-panel-icon">{active.icon}</div>
                            <h3 className="dawki-home-eng-panel-title">{active.title}</h3>
                            <p className="dawki-home-eng-panel-desc">{active.desc}</p>
                            <div className="dawki-home-eng-panel-best">
                                <strong>Best for:</strong> {active.bestFor}
                            </div>
                        </div>
                        <div className="dawki-home-eng-panel-right">
                            <h4>What's Included</h4>
                            <ul>
                                {active.highlights.map((h) => (
                                    <li key={h}>
                                        <span className="dawki-home-eng-check" aria-hidden="true">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                        </span>
                                        {h}
                                    </li>
                                ))}
                            </ul>
                            <a href="/contact" className="dawki-home-eng-cta">
                                <span>Discuss this model</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                            </a>
                        </div>
                    </motion.article>
                </div>
            </div>
        </section>
    );
});
HomeEngagement.displayName = 'HomeEngagement';

/* ============================================================================
 * HomeLifecycle — "From Idea to Launch" 5-step horizontal flow with progress
 * indicator. Each step reveals on scroll with a different rhythm than the
 * coverflow / tab switcher above. Pure scroll-based reveal, not click-driven.
 * ============================================================================ */
const HOME_LIFECYCLE_STEPS = [
    {
        n: '01',
        title: 'Discovery Call',
        desc: '30-min Zoom to understand your business, users, constraints, and what success looks like for you.',
        time: '~30 min',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
        ),
    },
    {
        n: '02',
        title: 'Proposal & SOW',
        desc: 'Within 48 hours: a tailored proposal with scope, timeline, fixed price, and tech recommendations.',
        time: '< 48 hrs',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
        ),
    },
    {
        n: '03',
        title: 'Design & Architecture',
        desc: 'High-fidelity Figma mockups + system architecture diagrams reviewed and signed off before code starts.',
        time: '1–2 weeks',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
        ),
    },
    {
        n: '04',
        title: 'Build & Iterate',
        desc: 'Two-week sprints with Friday demos. You see working software every fortnight and steer priorities live.',
        time: '4–12 weeks',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
            </svg>
        ),
    },
    {
        n: '05',
        title: 'Launch & Support',
        desc: 'Go-live with monitoring, runbooks, and a 90-day bug warranty. Optional ongoing retainer for new features.',
        time: 'Day 1 + ongoing',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
            </svg>
        ),
    },
];

const HomeLifecycle: FC = memo(() => {
    const reduced = useReducedMotion();
    return (
        <section className="dawki-home-life" style={{ contentVisibility: 'auto', containIntrinsicSize: '800px' }}>
            <div className="container">
                <RevealUp>
                    <div className="dawki-home-life-heading">
                        <span className="dawki-home-life-pill">
                            <span className="dawki-home-life-pill-dot"></span>
                            From Idea to Launch
                        </span>
                        <h2 className="dawki-home-life-title">
                            Five Steps. <span>One Predictable Path.</span>
                        </h2>
                        <p className="dawki-home-life-subtitle">
                            How a project flows from your first email to a shipped product — no mystery, no missed milestones.
                        </p>
                    </div>
                </RevealUp>

                <div className="dawki-home-life-track">
                    {/* Connecting line behind cards (animates from 0 → 100% as user scrolls) */}
                    <motion.div
                        className="dawki-home-life-progress"
                        initial={reduced ? false : { scaleX: 0 }}
                        whileInView={reduced ? undefined : { scaleX: 1 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={reduced ? undefined : { duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
                        aria-hidden="true"
                    />
                    <motion.div
                        className="dawki-home-life-grid"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-60px' }}
                        variants={{
                            hidden: {},
                            visible: { transition: { staggerChildren: 0.15, delayChildren: 0.15 } },
                        }}
                    >
                        {HOME_LIFECYCLE_STEPS.map((s) => (
                            <motion.div
                                key={s.n}
                                className="dawki-home-life-step"
                                variants={
                                    reduced
                                        ? undefined
                                        : {
                                              hidden: { opacity: 0, y: 40, scale: 0.9 },
                                              visible: {
                                                  opacity: 1, y: 0, scale: 1,
                                                  transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] },
                                              },
                                          }
                                }
                            >
                                <div className="dawki-home-life-step-marker">
                                    <span className="dawki-home-life-step-icon">{s.icon}</span>
                                    <span className="dawki-home-life-step-num">{s.n}</span>
                                </div>
                                <div className="dawki-home-life-step-body">
                                    <span className="dawki-home-life-step-time">{s.time}</span>
                                    <h3 className="dawki-home-life-step-title">{s.title}</h3>
                                    <p className="dawki-home-life-step-desc">{s.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
});
HomeLifecycle.displayName = 'HomeLifecycle';

/* ============================================================================
 * HomeMobileShowcase — Mobile app development showcase with an animated
 * phone mockup. The phone has a screen with sliding "app screens", floating
 * notification bubbles, and subtle bob animation. All pure CSS keyframes
 * (transform/opacity only) → GPU-composited, ~0 main-thread cost while idle.
 * ============================================================================ */
const HomeMobileShowcase: FC = memo(() => (
    <section className="dawki-mobile-show" style={{ contentVisibility: 'auto', containIntrinsicSize: '700px' }}>
        <div className="container">
            <div className="dawki-mobile-show-grid">
                {/* LEFT — copy */}
                <RevealUp className="dawki-mobile-show-content">
                    <span className="dawki-mobile-show-pill">
                        <span className="dawki-mobile-show-pill-dot"></span>
                        Mobile App Development
                    </span>
                    <h2 className="dawki-mobile-show-title">
                        Apps That Live <span>Inside Your Pocket</span>
                    </h2>
                    <p className="dawki-mobile-show-subtitle">
                        Native-feeling iOS and Android apps engineered with React Native, Flutter, or fully native Swift/Kotlin — fast launches, smooth gestures, and the polish your users expect.
                    </p>
                    <ul className="dawki-mobile-show-list">
                        <li><span className="dawki-mobile-show-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span>Cross-platform from a single codebase</li>
                        <li><span className="dawki-mobile-show-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span>Push notifications, payments &amp; offline mode</li>
                        <li><span className="dawki-mobile-show-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span>App Store + Play Store launch handled by us</li>
                    </ul>
                    <a href="/contact" className="dawki-mobile-show-cta">
                        <span>Build my app</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                    </a>
                </RevealUp>

                {/* RIGHT — animated phone mockup */}
                <RevealUp className="dawki-mobile-show-visual">
                    <div className="dawki-mobile-show-stage" aria-hidden="true">
                        {/* Floating decorative chips */}
                        <div className="dawki-mobile-show-chip dawki-mobile-show-chip--star">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFB400" stroke="#FFB400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            <span>5.0</span>
                        </div>
                        <div className="dawki-mobile-show-chip dawki-mobile-show-chip--users">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5b9eff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
                            <span>100k Users</span>
                        </div>
                        <div className="dawki-mobile-show-chip dawki-mobile-show-chip--notif">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                            <span>New order</span>
                        </div>

                        {/* Phone frame */}
                        <div className="dawki-mobile-show-phone">
                            <div className="dawki-mobile-show-phone-notch"></div>
                            <div className="dawki-mobile-show-phone-screen">
                                {/* Status bar */}
                                <div className="dawki-mobile-show-statusbar">
                                    <span>9:41</span>
                                    <span className="dawki-mobile-show-statusbar-icons">
                                        <i></i><i></i><i></i>
                                    </span>
                                </div>
                                {/* Sliding screen carousel — pure CSS @keyframes shifts the track */}
                                <div className="dawki-mobile-show-carousel">
                                    <div className="dawki-mobile-show-screen dawki-mobile-show-screen--home">
                                        <div className="dawki-mobile-show-greet">Hi, Aarav 👋</div>
                                        <div className="dawki-mobile-show-balance">
                                            <span>Balance</span>
                                            <strong>₹ 84,250</strong>
                                        </div>
                                        <div className="dawki-mobile-show-actions">
                                            <span>Send</span><span>Pay</span><span>Top-up</span><span>More</span>
                                        </div>
                                        <div className="dawki-mobile-show-list-tx">
                                            <div><i style={{ background: '#22c55e' }}></i><span>Salary credited</span><strong>+ 50K</strong></div>
                                            <div><i style={{ background: '#ec4899' }}></i><span>Zomato</span><strong>− 420</strong></div>
                                            <div><i style={{ background: '#5b9eff' }}></i><span>Netflix</span><strong>− 649</strong></div>
                                        </div>
                                    </div>
                                    <div className="dawki-mobile-show-screen dawki-mobile-show-screen--chart">
                                        <div className="dawki-mobile-show-greet">Spending</div>
                                        <div className="dawki-mobile-show-bars">
                                            <span style={{ height: '40%' }}></span>
                                            <span style={{ height: '70%' }}></span>
                                            <span style={{ height: '55%' }}></span>
                                            <span style={{ height: '85%' }}></span>
                                            <span style={{ height: '60%' }}></span>
                                            <span style={{ height: '90%' }}></span>
                                            <span style={{ height: '45%' }}></span>
                                        </div>
                                        <div className="dawki-mobile-show-stats-row">
                                            <div><strong>↓ 18%</strong><span>vs last month</span></div>
                                            <div><strong>₹ 24K</strong><span>saved</span></div>
                                        </div>
                                    </div>
                                    <div className="dawki-mobile-show-screen dawki-mobile-show-screen--chat">
                                        <div className="dawki-mobile-show-greet">Support</div>
                                        <div className="dawki-mobile-show-chat">
                                            <div className="dawki-mobile-show-bubble dawki-mobile-show-bubble--in">Hi! How can I help today?</div>
                                            <div className="dawki-mobile-show-bubble dawki-mobile-show-bubble--out">Need to upgrade my plan</div>
                                            <div className="dawki-mobile-show-bubble dawki-mobile-show-bubble--in">Sure! Sending options now…</div>
                                            <div className="dawki-mobile-show-typing"><i></i><i></i><i></i></div>
                                        </div>
                                    </div>
                                </div>
                                {/* Home indicator */}
                                <div className="dawki-mobile-show-home-indicator"></div>
                            </div>
                        </div>
                    </div>
                </RevealUp>
            </div>
        </div>
    </section>
));
HomeMobileShowcase.displayName = 'HomeMobileShowcase';

/* ============================================================================
 * HomeWebShowcase — Web development showcase with an animated browser/monitor
 * mockup. Browser frame contains a dashboard whose chart bars grow + KPI
 * counter ticks + cursor moves between hotspots. CSS-keyframe driven for
 * minimal main-thread cost.
 * ============================================================================ */
const HomeWebShowcase: FC = memo(() => (
    <section className="dawki-web-show" style={{ contentVisibility: 'auto', containIntrinsicSize: '700px' }}>
        <div className="container">
            <div className="dawki-web-show-grid">
                {/* LEFT — animated monitor mockup */}
                <RevealUp className="dawki-web-show-visual">
                    <div className="dawki-web-show-stage" aria-hidden="true">
                        {/* Floating decorative chips */}
                        <div className="dawki-web-show-chip dawki-web-show-chip--score">
                            <span className="dawki-web-show-chip-num">98</span>
                            <span>Lighthouse</span>
                        </div>
                        <div className="dawki-web-show-chip dawki-web-show-chip--code">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5b9eff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                            <span>Clean Code</span>
                        </div>
                        <div className="dawki-web-show-chip dawki-web-show-chip--users">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            <span>Live</span>
                        </div>

                        {/* Browser frame */}
                        <div className="dawki-web-show-monitor">
                            <div className="dawki-web-show-bar">
                                <div className="dawki-web-show-bar-dots">
                                    <span></span><span></span><span></span>
                                </div>
                                <div className="dawki-web-show-bar-url">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                    <span>https://your-app.com/dashboard</span>
                                </div>
                                <div className="dawki-web-show-bar-tabs">
                                    <span></span><span></span>
                                </div>
                            </div>
                            <div className="dawki-web-show-content">
                                {/* Sidebar */}
                                <div className="dawki-web-show-sidebar">
                                    <div className="dawki-web-show-logo"></div>
                                    <span className="dawki-web-show-nav-item is-active"></span>
                                    <span className="dawki-web-show-nav-item"></span>
                                    <span className="dawki-web-show-nav-item"></span>
                                    <span className="dawki-web-show-nav-item"></span>
                                    <span className="dawki-web-show-nav-item"></span>
                                </div>
                                {/* Main panel */}
                                <div className="dawki-web-show-main">
                                    <div className="dawki-web-show-header">
                                        <div className="dawki-web-show-h1"></div>
                                        <div className="dawki-web-show-search"></div>
                                    </div>
                                    <div className="dawki-web-show-kpis">
                                        <div className="dawki-web-show-kpi">
                                            <span>Revenue</span>
                                            <strong>$ 184K</strong>
                                            <em className="up">↑ 12%</em>
                                        </div>
                                        <div className="dawki-web-show-kpi">
                                            <span>Orders</span>
                                            <strong>2,431</strong>
                                            <em className="up">↑ 8%</em>
                                        </div>
                                        <div className="dawki-web-show-kpi">
                                            <span>Visitors</span>
                                            <strong>54.2K</strong>
                                            <em className="up">↑ 24%</em>
                                        </div>
                                    </div>
                                    <div className="dawki-web-show-chart">
                                        <div className="dawki-web-show-chart-bars">
                                            <span style={{ height: '35%' }}></span>
                                            <span style={{ height: '60%' }}></span>
                                            <span style={{ height: '45%' }}></span>
                                            <span style={{ height: '75%' }}></span>
                                            <span style={{ height: '55%' }}></span>
                                            <span style={{ height: '88%' }}></span>
                                            <span style={{ height: '70%' }}></span>
                                            <span style={{ height: '92%' }}></span>
                                        </div>
                                    </div>
                                    <div className="dawki-web-show-rows">
                                        <div></div><div></div><div></div>
                                    </div>
                                </div>
                                {/* Animated cursor that hops between hotspots */}
                                <div className="dawki-web-show-cursor">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#0a1628" stroke="#fff" strokeWidth="1.5"><path d="M3 2l7 18 2.5-7 7-2.5L3 2z"/></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </RevealUp>

                {/* RIGHT — copy */}
                <RevealUp className="dawki-web-show-content">
                    <span className="dawki-web-show-pill">
                        <span className="dawki-web-show-pill-dot"></span>
                        Web Development
                    </span>
                    <h2 className="dawki-web-show-title">
                        Websites &amp; Web Apps <span>Built to Convert</span>
                    </h2>
                    <p className="dawki-web-show-subtitle">
                        From marketing sites that load in under a second to multi-tenant SaaS dashboards — engineered with React, Next.js, Laravel, and Node, then tuned for Core Web Vitals and conversion.
                    </p>
                    <ul className="dawki-web-show-list">
                        <li><span className="dawki-web-show-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span>90+ Lighthouse on every project</li>
                        <li><span className="dawki-web-show-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span>Headless CMS &amp; CMS-free options</li>
                        <li><span className="dawki-web-show-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span>SEO-friendly with structured data baked in</li>
                    </ul>
                    <a href="/contact" className="dawki-web-show-cta">
                        <span>Get a quote</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                    </a>
                </RevealUp>
            </div>
        </div>
    </section>
));
HomeWebShowcase.displayName = 'HomeWebShowcase';

/* ============================================================================
 * Home Service Showcase — 3D coverflow carousel inspired by appinventiv.com.
 * Tabs at top let the user switch between services; the active card sits
 * straight & centered while neighbours tilt back at an angle. Click a tab
 * (or the side card itself) and framer-motion smoothly springs the new card
 * into place. JS-driven so it bypasses the welcome page's CSS killer.
 * ============================================================================ */
type ShowcaseService = {
    id: string;
    name: string;
    tagline: string;
    desc: string;
    bg: string;          // pastel card background
    accent: string;      // accent text/icon color
    icon: ReactNode;     // service icon (small, rendered in pill)
    stat1: string;
    stat1Label: string;
    stat2: string;
    stat2Label: string;
    visual: ReactNode;   // bottom visual block (mockup-ish)
};

const SHOWCASE_SERVICES: ShowcaseService[] = [
    {
        id: 'web',
        name: 'Custom Web Development',
        tagline: 'Goal-driven websites that convert visitors into customers.',
        desc: 'We craft custom websites designed to help businesses achieve their goals and deliver a memorable experience to their customers.',
        bg: '#FEF3C7',
        accent: '#B45309',
        stat1: '180+', stat1Label: 'Sites delivered',
        stat2: '99%',  stat2Label: 'Client satisfaction',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
        ),
        visual: (
            <div className="dawki-showcase-mock">
                <div className="dawki-showcase-mock-bar"><span></span><span></span><span></span><em className="dawki-showcase-mock-url">your-business.com</em></div>
                <div className="dawki-showcase-mock-body">
                    <div className="dawki-showcase-mock-hero">
                        <div className="dawki-showcase-mock-hero-tag">Built with Next.js</div>
                        <div className="dawki-showcase-mock-hero-title">Grow your business 4x faster</div>
                        <div className="dawki-showcase-mock-hero-cta">Get Started →</div>
                    </div>
                    <div className="dawki-showcase-mock-features">
                        <div><span style={{ background: '#fef3c7', color: '#b45309' }}>⚡</span><strong>Fast</strong><em>1.2s LCP</em></div>
                        <div><span style={{ background: '#fce7f3', color: '#be185d' }}>🎯</span><strong>SEO</strong><em>98 score</em></div>
                        <div><span style={{ background: '#dbeafe', color: '#1e40af' }}>🛡️</span><strong>Secure</strong><em>SSL + WAF</em></div>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 'ecom',
        name: 'E-commerce Development',
        tagline: 'Fast, scalable storefronts engineered to grow revenue.',
        desc: 'We build custom e-commerce websites that are fast, scalable, and designed to turn visitors into loyal, repeat customers.',
        bg: '#FCE7F3',
        accent: '#BE185D',
        stat1: '4.5x', stat1Label: 'Avg. revenue lift',
        stat2: '120+', stat2Label: 'Stores launched',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        ),
        visual: (
            <div className="dawki-showcase-mock">
                <div className="dawki-showcase-mock-bar"><span></span><span></span><span></span><em className="dawki-showcase-mock-url">your-store.com</em></div>
                <div className="dawki-showcase-mock-body">
                    <div className="dawki-showcase-mock-shop-products">
                        <div className="dawki-showcase-mock-shop-prod">
                            <div className="dawki-showcase-mock-shop-img" style={{ background: 'linear-gradient(135deg, #fbcfe8, #f9a8d4)' }}></div>
                            <strong>Sneakers</strong>
                            <span>$89</span>
                        </div>
                        <div className="dawki-showcase-mock-shop-prod">
                            <div className="dawki-showcase-mock-shop-img" style={{ background: 'linear-gradient(135deg, #fde68a, #fbbf24)' }}></div>
                            <strong>Backpack</strong>
                            <span>$120</span>
                        </div>
                        <div className="dawki-showcase-mock-shop-prod">
                            <div className="dawki-showcase-mock-shop-img" style={{ background: 'linear-gradient(135deg, #c7d2fe, #818cf8)' }}></div>
                            <strong>Watch</strong>
                            <span>$249</span>
                        </div>
                    </div>
                    <div className="dawki-showcase-mock-shop-cart">
                        <span>🛒 Cart · 3 items</span>
                        <strong>$458 →</strong>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 'cloud',
        name: 'Cloud-Based Web Apps',
        tagline: 'Cloud-native platforms that scale on demand.',
        desc: 'We build secure, scalable, and high-performance cloud-powered websites that grow with your business and never go down.',
        bg: '#DBEAFE',
        accent: '#1E40AF',
        stat1: '99.99%', stat1Label: 'Uptime SLA',
        stat2: '60%',    stat2Label: 'Lower infra cost',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>
        ),
        visual: (
            <div className="dawki-showcase-mock">
                <div className="dawki-showcase-mock-bar"><span></span><span></span><span></span><em className="dawki-showcase-mock-url">cloud-console</em></div>
                <div className="dawki-showcase-mock-body">
                    <div className="dawki-showcase-mock-cloud-kpis">
                        <div><strong>99.99%</strong><span>Uptime</span></div>
                        <div><strong>42ms</strong><span>p95 latency</span></div>
                        <div><strong>1.2M</strong><span>req/min</span></div>
                    </div>
                    <div className="dawki-showcase-mock-chart">
                        <span style={{ height: '40%' }}></span>
                        <span style={{ height: '70%' }}></span>
                        <span style={{ height: '55%' }}></span>
                        <span style={{ height: '85%' }}></span>
                        <span style={{ height: '60%' }}></span>
                        <span style={{ height: '92%' }}></span>
                        <span style={{ height: '78%' }}></span>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 'uiux',
        name: 'UI/UX Design',
        tagline: 'Interfaces engineered for delight and conversion.',
        desc: 'We design intuitive, user-friendly interfaces that enhance engagement and create seamless digital experiences across every device.',
        bg: '#E9D5FF',
        accent: '#6D28D9',
        stat1: '40+', stat1Label: 'Design systems shipped',
        stat2: '2.3x', stat2Label: 'Avg. engagement lift',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        ),
        visual: (
            <div className="dawki-showcase-mock">
                <div className="dawki-showcase-mock-bar"><span></span><span></span><span></span><em className="dawki-showcase-mock-url">figma · design system</em></div>
                <div className="dawki-showcase-mock-body">
                    <div className="dawki-showcase-mock-uiux-row">
                        <div className="dawki-showcase-mock-uiux-card" style={{ background: '#e9d5ff' }}>
                            <div className="dawki-showcase-mock-uiux-thumb" style={{ background: '#a855f7' }}>Aa</div>
                            <strong>Typography</strong>
                            <span>12 styles</span>
                        </div>
                        <div className="dawki-showcase-mock-uiux-card" style={{ background: '#fce7f3' }}>
                            <div className="dawki-showcase-mock-uiux-swatches">
                                <i style={{ background: '#a855f7' }}></i>
                                <i style={{ background: '#ec4899' }}></i>
                                <i style={{ background: '#f97316' }}></i>
                            </div>
                            <strong>Color tokens</strong>
                            <span>48 variables</span>
                        </div>
                    </div>
                    <div className="dawki-showcase-mock-uiux-comp">
                        <span className="dawki-showcase-mock-uiux-btn">Primary</span>
                        <span className="dawki-showcase-mock-uiux-btn outline">Outline</span>
                        <span className="dawki-showcase-mock-uiux-input">Input</span>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 'mobile',
        name: 'Mobile App Development',
        tagline: 'Native-feeling apps for iOS, Android, and beyond.',
        desc: 'Fast, intuitive iOS and Android apps built with React Native, Flutter, or native — engineered to keep users engaged and coming back.',
        bg: '#DCFCE7',
        accent: '#15803D',
        stat1: '90+', stat1Label: 'Apps in App Store',
        stat2: '4.7★', stat2Label: 'Avg. store rating',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>
        ),
        visual: (
            <div className="dawki-showcase-mock dawki-showcase-mock--phone">
                <div className="dawki-showcase-mock-phone">
                    <div className="dawki-showcase-mock-phone-notch"></div>
                    <div className="dawki-showcase-mock-phone-screen">
                        <div className="dawki-showcase-mock-phone-status">9:41</div>
                        <div className="dawki-showcase-mock-phone-greet">Hi Aarav 👋</div>
                        <div className="dawki-showcase-mock-phone-card">
                            <span>Today's earnings</span>
                            <strong>$ 1,284</strong>
                        </div>
                        <div className="dawki-showcase-mock-phone-grid">
                            <span>📦</span><span>💳</span><span>📊</span><span>⚙️</span>
                        </div>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 'ai',
        name: 'AI / ML Solutions',
        tagline: 'Production AI that automates work and unlocks growth.',
        desc: 'GenAI assistants, predictive models, RAG-powered search, and intelligent agents — built and deployed end-to-end on your stack.',
        bg: '#FED7AA',
        accent: '#C2410C',
        stat1: '50+', stat1Label: 'AI features shipped',
        stat2: '10x', stat2Label: 'Throughput on tasks',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"/></svg>
        ),
        visual: (
            <div className="dawki-showcase-mock">
                <div className="dawki-showcase-mock-bar"><span></span><span></span><span></span><em className="dawki-showcase-mock-url">ai-assistant</em></div>
                <div className="dawki-showcase-mock-body">
                    <div className="dawki-showcase-mock-ai-chat">
                        <div className="dawki-showcase-mock-ai-msg in">
                            <span className="dawki-showcase-mock-ai-avatar">U</span>
                            <p>Summarize Q3 sales</p>
                        </div>
                        <div className="dawki-showcase-mock-ai-msg out">
                            <span className="dawki-showcase-mock-ai-avatar ai">✦</span>
                            <p>Q3 revenue +24% YoY. Top SKU: Pro Plan (+38%). Churn dropped to 2.1%.</p>
                        </div>
                        <div className="dawki-showcase-mock-ai-tags">
                            <span>GPT-4</span>
                            <span>RAG</span>
                            <span>Vector DB</span>
                        </div>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 'devops',
        name: 'DevOps & Cloud Ops',
        tagline: 'Automated pipelines, zero-downtime deploys, 24/7 reliability.',
        desc: 'CI/CD pipelines, IaC, container orchestration, and managed cloud operations — so your team ships faster with confidence.',
        bg: '#CFFAFE',
        accent: '#0E7490',
        stat1: '12x', stat1Label: 'Faster deploys',
        stat2: '99.99%', stat2Label: 'Production uptime',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        ),
        visual: (
            <div className="dawki-showcase-mock">
                <div className="dawki-showcase-mock-bar"><span></span><span></span><span></span><em className="dawki-showcase-mock-url">ci/cd · main</em></div>
                <div className="dawki-showcase-mock-body">
                    <div className="dawki-showcase-mock-devops-pipeline">
                        <div className="dawki-showcase-mock-devops-step done"><span>✓</span>Build</div>
                        <div className="dawki-showcase-mock-devops-step done"><span>✓</span>Test</div>
                        <div className="dawki-showcase-mock-devops-step done"><span>✓</span>Lint</div>
                        <div className="dawki-showcase-mock-devops-step running"><span>⟳</span>Deploy</div>
                    </div>
                    <div className="dawki-showcase-mock-devops-meta">
                        <span>🐳 docker · v2.4.1</span>
                        <span className="ok">● production · healthy</span>
                    </div>
                </div>
            </div>
        ),
    },
];

/* Hoisted constants — zero allocation per render */
const SHOWCASE_SPRING = { type: 'spring' as const, stiffness: 130, damping: 18, mass: 0.9 };
const SHOWCASE_INSTANT = { duration: 0 };

/* Pure JSX content for one card. Wrapped in memo so when its parent re-renders
 * because `active` changed elsewhere, this component's expensive children
 * (SVG mockups, stats blocks, etc.) skip reconciliation entirely as long as
 * `service` is the same reference. Only the outer motion.article's animate
 * prop changes — that's GPU-composited via framer-motion, no React work. */
const ShowcaseCardContent: FC<{ service: ShowcaseService }> = memo(({ service }) => (
    <>
        <header className="dawki-showcase-card-head">
            <span className="dawki-showcase-card-icon" style={{ color: service.accent }}>
                {service.icon}
            </span>
            <h3 className="dawki-showcase-card-name">{service.name}</h3>
        </header>
        <p className="dawki-showcase-card-tagline">{service.tagline}</p>
        <p className="dawki-showcase-card-desc">{service.desc}</p>
        <div className="dawki-showcase-card-stats">
            <div>
                <strong style={{ color: service.accent }}>{service.stat1}</strong>
                <span>{service.stat1Label}</span>
            </div>
            <div>
                <strong style={{ color: service.accent }}>{service.stat2}</strong>
                <span>{service.stat2Label}</span>
            </div>
        </div>
        <div className="dawki-showcase-card-visual">{service.visual}</div>
    </>
));
ShowcaseCardContent.displayName = 'ShowcaseCardContent';

/* Outer motion.article that handles position/rotation animation. Gets a stable
 * onActivate callback so memo prevents re-render unless offset/isActive
 * actually changed for THIS card. Inner content is the memoized component
 * above so SVGs / mockups never reconcile. */
const ShowcaseCard: FC<{
    service: ShowcaseService;
    offset: number;
    isActive: boolean;
    visible: boolean;
    reduced: boolean;
    onActivate: (id: string) => void;
}> = memo(({ service, offset, isActive, visible, reduced, onActivate }) => {
    /* useMemo so the animate object is stable when inputs don't change —
     * framer-motion only kicks off a new tween when values actually differ. */
    const animate = useMemo(
        () =>
            reduced
                ? { x: offset * 360, y: 0, rotate: 0, scale: 1, opacity: visible ? 1 : 0 }
                : {
                      x: offset * 320,
                      y: isActive ? 0 : 24,
                      rotate: offset * -13,
                      scale: isActive ? 1 : 0.92,
                      opacity: visible ? (isActive ? 1 : 0.92) : 0,
                  },
        [offset, isActive, visible, reduced]
    );

    const style = useMemo(
        () => ({
            background: service.bg,
            zIndex: isActive ? 20 : 10 - Math.abs(offset),
            pointerEvents: (visible ? 'auto' : 'none') as 'auto' | 'none',
        }),
        [service.bg, isActive, offset, visible]
    );

    const handleClick = useCallback(() => {
        if (!isActive) onActivate(service.id);
    }, [isActive, onActivate, service.id]);

    return (
        <motion.article
            className={`dawki-showcase-card ${isActive ? 'is-active' : ''}`}
            animate={animate}
            initial={false}
            transition={reduced ? SHOWCASE_INSTANT : SHOWCASE_SPRING}
            style={style}
            onClick={handleClick}
            aria-hidden={!isActive}
        >
            <ShowcaseCardContent service={service} />
        </motion.article>
    );
});
ShowcaseCard.displayName = 'ShowcaseCard';

const HomeServiceShowcase: FC = memo(() => {
    const reduced = useReducedMotion();
    const [active, setActive] = useState(0);
    const total = SHOWCASE_SERVICES.length;

    const goPrev = useCallback(() => setActive((i) => (i - 1 + total) % total), [total]);
    const goNext = useCallback(() => setActive((i) => (i + 1) % total), [total]);
    /* Stable callback for cards — id-based so each card re-uses the same fn ref */
    const handleActivate = useCallback((id: string) => {
        const next = SHOWCASE_SERVICES.findIndex((s) => s.id === id);
        if (next >= 0) setActive(next);
    }, []);

    return (
        <section className="dawki-showcase" style={{ contentVisibility: 'auto', containIntrinsicSize: '900px' }}>
            <div className="container">
                <div className="dawki-showcase-heading">
                    <span className="dawki-showcase-pill">
                        <span className="dawki-showcase-dot"></span>
                        Our Services
                    </span>
                    <h2 className="dawki-showcase-title">
                        Solutions <span>Built to Scale</span>
                    </h2>
                    <p className="dawki-showcase-subtitle">
                        From custom web apps to AI — pick a service to see what we deliver.
                    </p>
                </div>

                {/* Tab bar */}
                <div className="dawki-showcase-tabs-wrap">
                    <button className="dawki-showcase-nav dawki-showcase-nav--prev" onClick={goPrev} aria-label="Previous service">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                    </button>
                    <div className="dawki-showcase-tabs" role="tablist">
                        {SHOWCASE_SERVICES.map((s, i) => (
                            <button
                                key={s.id}
                                role="tab"
                                aria-selected={i === active}
                                onClick={() => setActive(i)}
                                className={`dawki-showcase-tab ${i === active ? 'is-active' : ''}`}
                            >
                                {s.name}
                            </button>
                        ))}
                    </div>
                    <button className="dawki-showcase-nav dawki-showcase-nav--next" onClick={goNext} aria-label="Next service">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </button>
                </div>

                {/* Stage — all cards rendered once, motion only updates transform/opacity */}
                <div className="dawki-showcase-stage">
                    {SHOWCASE_SERVICES.map((s, i) => {
                        // Shortest signed offset around the loop (so wrap-around feels natural)
                        let offset = i - active;
                        if (offset > total / 2) offset -= total;
                        if (offset < -total / 2) offset += total;
                        const visible = Math.abs(offset) <= 1;
                        const isActive = offset === 0;
                        return (
                            <ShowcaseCard
                                key={s.id}
                                service={s}
                                offset={offset}
                                isActive={isActive}
                                visible={visible}
                                reduced={reduced ?? false}
                                onActivate={handleActivate}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
});
HomeServiceShowcase.displayName = 'HomeServiceShowcase';

/* ============================================================================
 * Static page data — hoisted to module scope so they aren't recreated each
 * render of <Welcome /> (was a measurable cost — these arrays held SVG / JSX
 * that React re-allocated on every parent state change).
 * ============================================================================ */
/* ============================================================================
 * Tech Stack — flat list of tools/languages displayed as a static white grid.
 * Logos use full-color devicon SVGs where available (recognizable language
 * mascots like Java's coffee cup, Python's snake, PHP's elephant) and fall
 * back to simpleicons for brands not in devicon.
 * ============================================================================ */
type Tech = { name: string; src: string };

const DEVICON = (path: string) =>
    `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${path}.svg`;
const SIMPLEICON = (slug: string, color: string) =>
    `https://cdn.simpleicons.org/${slug}/${color}`;

const TECH_STACK: readonly Tech[] = [
    // Core web languages
    { name: 'JavaScript', src: DEVICON('javascript/javascript-original') },
    { name: 'TypeScript', src: DEVICON('typescript/typescript-original') },
    { name: 'HTML5', src: DEVICON('html5/html5-original') },
    { name: 'CSS3', src: DEVICON('css3/css3-original') },
    { name: 'Sass', src: DEVICON('sass/sass-original') },
    { name: 'Tailwind CSS', src: DEVICON('tailwindcss/tailwindcss-original') },
    { name: 'Bootstrap', src: DEVICON('bootstrap/bootstrap-original') },

    // Programming languages
    { name: 'Python', src: DEVICON('python/python-original') },
    { name: 'Java', src: DEVICON('java/java-original') },
    { name: 'PHP', src: DEVICON('php/php-original') },
    { name: 'C', src: DEVICON('c/c-original') },
    { name: 'C++', src: DEVICON('cplusplus/cplusplus-original') },
    { name: 'C#', src: DEVICON('csharp/csharp-original') },
    { name: 'Ruby', src: DEVICON('ruby/ruby-original') },
    { name: 'Rust', src: DEVICON('rust/rust-original') },
    { name: 'Scala', src: DEVICON('scala/scala-original') },
    { name: 'R', src: DEVICON('r/r-original') },
    { name: 'Bash', src: DEVICON('bash/bash-original') },
    { name: 'Elixir', src: DEVICON('elixir/elixir-original') },
    { name: 'Solidity', src: DEVICON('solidity/solidity-original') },
    { name: 'Golang', src: DEVICON('go/go-original') },
    { name: 'Kotlin', src: DEVICON('kotlin/kotlin-original') },
    { name: 'Swift', src: DEVICON('swift/swift-original') },
    { name: 'Dart', src: DEVICON('dart/dart-original') },
    { name: 'Flutter', src: DEVICON('flutter/flutter-original') },
    { name: '.NET', src: DEVICON('dot-net/dot-net-original') },

    // Frontend frameworks & UI
    { name: 'React JS', src: DEVICON('react/react-original') },
    // { name: 'Next.js', src: DEVICON('nextjs/nextjs-original') },
    { name: 'Next.js', src: '/assets/images/header/demo/NEXT-JS.png' },
    { name: 'Angular JS', src: DEVICON('angularjs/angularjs-original') },
    { name: 'Vue.js', src: DEVICON('vuejs/vuejs-original') },
    { name: 'React Native', src: DEVICON('react/react-original') },
    { name: 'Material UI', src: DEVICON('materialui/materialui-original') },
    { name: 'Three.js', src: DEVICON('threejs/threejs-original') },
    { name: 'Electron JS', src: DEVICON('electron/electron-original') },
    { name: 'WordPress', src: DEVICON('wordpress/wordpress-plain') },
    { name: 'Shadcn UI', src: SIMPLEICON('shadcnui', '000000') },
    { name: 'UIkit', src: SIMPLEICON('uikit', '2396F3') },
    { name: 'Semantic UI', src: SIMPLEICON('semanticuireact', '35BDB2') },
    { name: 'Framer', src: SIMPLEICON('framer', '0055FF') },

    // Backend / runtime / frameworks
    { name: 'Node JS', src: DEVICON('nodejs/nodejs-original') },
    { name: 'Express', src: DEVICON('express/express-original') },
    // { name: 'NestJS', src: DEVICON('nestjs/nestjs-plain') },
    { name: 'Next.js', src: '/assets/images/header/demo/NEXT-JS.png' },
    { name: 'Django', src: DEVICON('django/django-plain') },
    { name: 'FastAPI', src: DEVICON('fastapi/fastapi-original') },
    { name: 'Laravel', src: DEVICON('laravel/laravel-original') },
    { name: 'GraphQL', src: DEVICON('graphql/graphql-plain') },
    { name: 'Strapi', src: SIMPLEICON('strapi', '4945FF') },

    // Databases & storage
    { name: 'MySQL', src: DEVICON('mysql/mysql-original') },
    { name: 'PostgreSQL', src: DEVICON('postgresql/postgresql-original') },
    { name: 'MongoDB', src: DEVICON('mongodb/mongodb-original') },
    { name: 'Redis', src: DEVICON('redis/redis-original') },
    { name: 'Firebase', src: DEVICON('firebase/firebase-plain') },

    // DevOps / cloud / hosting
    { name: 'Docker', src: DEVICON('docker/docker-original') },
    { name: 'Kubernetes', src: DEVICON('kubernetes/kubernetes-plain') },
    { name: 'Jenkins', src: DEVICON('jenkins/jenkins-original') },
    // { name: 'AWS', src: SIMPLEICON('amazonwebservices', 'FF9900') },
    { name: 'AWS', src: '/assets/images/header/demo/aws_ai.png' },
    { name: 'Google Cloud', src: DEVICON('googlecloud/googlecloud-original') },
    { name: 'Microsoft Azure', src: DEVICON('azure/azure-original') },
    { name: 'Digital Ocean', src: SIMPLEICON('digitalocean', '0080FF') },
    { name: 'Vercel', src: SIMPLEICON('vercel', '000000') },

    // Version control
    { name: 'Git', src: DEVICON('git/git-original') },
    { name: 'GitHub', src: SIMPLEICON('github', '181717') },
    { name: 'Bitbucket', src: DEVICON('bitbucket/bitbucket-original') },

    // E-commerce & payments
    { name: 'Shopify', src: SIMPLEICON('shopify', '7AB55C') },
    { name: 'Stripe', src: SIMPLEICON('stripe', '008CDD') },
    { name: 'Razorpay', src: SIMPLEICON('razorpay', '0066FF') },

    // AI & APIs
    // { name: 'OpenAI APIs', src: SIMPLEICON('openai', '412991') },
    { name: 'OpenAI APIs', src: '/assets/images/header/demo/open_ai.png' },
    { name: 'Gemini APIs', src: SIMPLEICON('googlegemini', '8E75B2') },
    { name: 'TensorFlow', src: DEVICON('tensorflow/tensorflow-original') },
    { name: 'Google APIs', src: SIMPLEICON('google', '4285F4') },
    { name: 'AMP', src: SIMPLEICON('amp', '005AF0') },

    // Design tools
    { name: 'Figma', src: DEVICON('figma/figma-original') },
    { name: 'Adobe Illustrator', src: DEVICON('illustrator/illustrator-plain') },
] as const;

const GOOGLE_TESTIMONIALS = [
    { name: 'Aarav Sharma', des: 'Director of Operations, Saanvi Consulting', img: '6.png', text: 'The team at Dawki Infotech was committed and delivered quality work on time. Their ability to adapt to changes was impressive. That said, we would appreciate more proactive updates during critical milestones to ensure complete alignment. With better communication, they can become an exceptional service provider.', color: '#3b82f6' },
    { name: 'Priya Patel', des: 'CEO, Lumen Global Solutions', img: '7.png', text: 'The team was responsive and professional throughout. However, we felt that initial requirement gathering could have been more detailed to avoid minor revisions later. Improving this process would make collaboration even smoother.', color: '#10b981' },
    { name: 'Rohan Verma', des: 'CTO, Zenith Technologies', img: '8.png', text: 'Dawki Infotech handled our complex project well and demonstrated strong problem-solving skills. The final product met expectations, but the documentation could have been more comprehensive for easier handover. Enhancing this aspect would add significant value. Overall, a reliable and skilled team worth working with.', color: '#a855f7' },
    { name: 'Ananya Iyer', des: 'Managing Partner, Iyer & Associates', img: '9.png', text: 'We were pleased with Dawki Infotech’s professionalism and timely delivery. Their technical expertise is commendable. One area for improvement is providing clearer timelines when unexpected challenges arise. Transparency in such cases would strengthen trust even further. A solid partner for IT solutions.', color: '#ec4899' },
] as const;

const initialsOf = (name: string) =>
    name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

/* ============================================================================
 * Welcome — landing page
 * ============================================================================ */
export const Welcome: FC = () => {

    /* ------------------------------------------------------------------------
     * Lightweight scroll handler — only toggles the back-to-top button.
     * Hero parallax + scroll-progress bar were removed: each scroll tick
     * called getBoundingClientRect() (forced layout) and wrote CSS vars
     * that invalidated style on the documentElement, which was the main
     * source of scroll-jank on this page on mid-tier devices.
     * ------------------------------------------------------------------------ */
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const backToTopBtn = document.querySelector('.dawki-back-to-top') as HTMLButtonElement | null;
        if (!backToTopBtn) return;

        let raf = 0;
        let lastVisible: boolean | null = null;

        const tick = () => {
            raf = 0;
            const shouldShow = (window.scrollY || document.documentElement.scrollTop) > 600;
            if (shouldShow !== lastVisible) {
                backToTopBtn.classList.toggle('visible', shouldShow);
                lastVisible = shouldShow;
            }
        };

        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(tick);
        };

        tick();
        window.addEventListener('scroll', onScroll, { passive: true });

        const handleBackToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
        backToTopBtn.addEventListener('click', handleBackToTop);

        return () => {
            window.removeEventListener('scroll', onScroll);
            backToTopBtn.removeEventListener('click', handleBackToTop);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    /* ------------------------------------------------------------------------
     * One IntersectionObserver to handle ALL legacy reveal classes
     * (.wow, .tj-fadein-right-on-scroll, .text-anim, .dawki-reveal).
     *
     * Replaces:
     *   - WOW.js   (its own scroll listener + class scan)
     *   - GSAP ScrollTrigger fade-right blocks
     *   - GSAP SplitText "text-anim" blocks (which forced layout per line and
     *     produced the most visible jank — those headings used to lock the
     *     scroll for 100–200ms each).
     *
     * Also wires up the data-bg-image background-image swap that the old
     * jQuery loop did.
     * ------------------------------------------------------------------------ */
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Apply data-bg-image immediately (no scroll dep) so reveals get the bg.
        document.querySelectorAll<HTMLElement>('[data-bg-image]').forEach((el) => {
            const bg = el.getAttribute('data-bg-image');
            if (bg) el.style.backgroundImage = `url(${bg.startsWith('/') ? bg : '/' + bg})`;
        });

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduced) {
            // Reveal everything immediately — same end state, no animation cost.
            document
                .querySelectorAll('.wow, .tj-fadein-right-on-scroll, .text-anim, .dawki-reveal')
                .forEach((el) => el.classList.add('animated', 'dawki-revealed'));
            return;
        }

        // Prep classes that need an "off" state before the observer fires
        document.querySelectorAll<HTMLElement>('.tj-fadein-right-on-scroll, .text-anim').forEach((el) => {
            el.classList.add('dawki-prep');
        });

        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;
                    const el = entry.target as HTMLElement;

                    // WOW-style elements: read data-wow-delay, add 'animated'
                    if (el.classList.contains('wow')) {
                        const delay = el.dataset.wowDelay;
                        if (delay) el.style.animationDelay = delay;
                        el.classList.add('animated');
                    }
                    // Other reveal flavors share a single fade-up class
                    if (el.classList.contains('tj-fadein-right-on-scroll') || el.classList.contains('text-anim')) {
                        el.classList.add('dawki-revealed');
                    }
                    if (el.classList.contains('dawki-reveal')) {
                        el.classList.add('dawki-revealed');
                    }
                    io.unobserve(el);
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
        );

        const targets = document.querySelectorAll(
            '.wow, .tj-fadein-right-on-scroll, .text-anim, .dawki-reveal'
        );
        targets.forEach((el) => io.observe(el));

        return () => io.disconnect();
    }, []);

    /* ------------------------------------------------------------------------
     * Third-party widget bootstrap (Swiper, NiceSelect, Venobox).
     * Deferred to idle so it never competes with the first paint.
     * Marquees are paused via IntersectionObserver when off-screen.
     * ------------------------------------------------------------------------ */
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const w = window as unknown as {
            jQuery?: any;
            Swiper?: any;
            VenoBox?: any;
            requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
            cancelIdleCallback?: (id: number) => void;
        };

        let cleanup: (() => void) | undefined;

        const boot = () => {
            const $ = w.jQuery;
            const Swiper = w.Swiper;
            if (!$ || !Swiper) return;

            // Nice Select
            if (typeof $.fn?.niceSelect === 'function') {
                $('select').niceSelect();
            }

            // Brand marquee Swipers (the continuously-animating ones)
            const clientSwipers: any[] = [];
            document.querySelectorAll('.client-slider-2').forEach((el) => {
                clientSwipers.push(
                    new Swiper(el as HTMLElement, {
                        slidesPerView: 'auto',
                        spaceBetween: 40,
                        loop: true,
                        speed: 4000,
                        allowTouchMove: false,
                        freeMode: true,
                        autoplay: { delay: 0, disableOnInteraction: false, pauseOnMouseEnter: false },
                    })
                );
            });

            // Pause off-screen marquees so they stop repainting every frame
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

            // Blog slider (paginated, on demand)
            const blogSwiper = new Swiper('.blog-slider', {
                slidesPerView: 2,
                spaceBetween: 30,
                loop: true,
                speed: 1500,
                autoplay: { delay: 4000 }, // slowed from 2000 — less rerendering
                navigation: { nextEl: '.slider-next', prevEl: '.slider-prev' },
                pagination: { el: '.swiper-pagination-area', clickable: true },
                breakpoints: {
                    0: { slidesPerView: 1, spaceBetween: 15 },
                    576: { slidesPerView: 1, spaceBetween: 15 },
                    768: { slidesPerView: 1, spaceBetween: 20 },
                    992: { slidesPerView: 2, spaceBetween: 20 },
                    1200: { slidesPerView: 2 },
                },
            });

            // Pause blog slider too when off-screen
            const blogEl = document.querySelector('.blog-slider');
            let blogObserver: IntersectionObserver | undefined;
            if (blogEl && blogSwiper?.autoplay) {
                blogObserver = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting) blogSwiper.autoplay.start();
                            else blogSwiper.autoplay.stop();
                        });
                    },
                    { rootMargin: '200px 0px' }
                );
                blogObserver.observe(blogEl);
            }

            // Odometer numbers — IntersectionObserver instead of GSAP ScrollTrigger
            const odoObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) return;
                        const el = entry.target as HTMLElement;
                        const count = el.getAttribute('data-count');
                        if (count) el.innerHTML = count;
                        odoObserver.unobserve(el);
                    });
                },
                { threshold: 0.4 }
            );
            document.querySelectorAll('.odometer').forEach((el) => odoObserver.observe(el));

            // VenoBox lightbox (defer)
            if (typeof w.VenoBox === 'function') {
                new w.VenoBox({
                    selector: '.venobox',
                    numeration: true,
                    infinigall: true,
                    share: true,
                    spinner: 'rotating-plane',
                });
            }

            cleanup = () => {
                marqueeObserver.disconnect();
                blogObserver?.disconnect();
                odoObserver.disconnect();
                clientSwipers.forEach((s) => s?.destroy?.(true, true));
                blogSwiper?.destroy?.(true, true);
            };
        };

        // Run after first paint — never block the main thread up front.
        const idleId = w.requestIdleCallback
            ? w.requestIdleCallback(boot, { timeout: 1500 })
            : (window.setTimeout(boot, 200) as unknown as number);

        return () => {
            if (w.cancelIdleCallback && typeof idleId === 'number') {
                w.cancelIdleCallback(idleId);
            } else {
                window.clearTimeout(idleId as unknown as number);
            }
            cleanup?.();
        };
    }, []);

    /* ------------------------------------------------------------------------
     * Inject a stylesheet that:
     *  - kills every running CSS animation/transition (the theme has ~148
     *    infinite keyframes — orbs, glows, gradient shimmers, etc. — that
     *    repaint every frame and were the main scroll-jank culprit);
     *  - hides the most paint-heavy purely-decorative elements;
     *  - forces every legacy reveal class (.wow, .dawki-reveal, …) into its
     *    final visible state, so text never starts hidden after a refresh.
     * ------------------------------------------------------------------------ */
    useEffect(() => {
        if (typeof document === 'undefined') return;
        const tag = document.createElement('style');
        tag.id = 'dawki-welcome-perf-overrides';
        tag.textContent = `
            /* Kill every running CSS animation/transition globally */
            *, *::before, *::after {
                animation-duration: 0.001ms !important;
                animation-delay: 0ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.001ms !important;
                transition-delay: 0ms !important;
            }
            /* Hide pure decoration that paints continuously */
            .dawki-products-orb,
            .dawki-cta-orb,
            .dawki-cta-grid,
            .dawki-product-frame-glow,
            .dawki-product-frame-glow--alt,
            .dawki-home-stories-video-glow,
            .dawki-ent-video-frame-glow,
            .dawki-csd-svc-card-glow,
            .dawki-csd-svc-timeline-node-pulse,
            .dawki-ent-video-play-pulse,
            .dawki-home-stories-play-pulse,
            .dawki-products-dot,
            .dawki-cta-badge-dot,
            .h7-team-floats,
            .h7-team-float {
                display: none !important;
            }
            /* Re-enable the testimonial marquee — the universal animation-killer
             * above clamps every keyframe to 0.001ms with iteration-count:1 which
             * freezes the Success Stories cards. Class-level specificity wins
             * over the universal selector, so these rules restore the scroll. */
            .google-reviews-track {
                animation-duration: 60s !important;
                animation-iteration-count: infinite !important;
                animation-play-state: running !important;
                transform: none;
            }
            @media (max-width: 575px) {
                .google-reviews-track {
                    animation-duration: 45s !important;
                }
            }
            .google-reviews-marquee:hover .google-reviews-track {
                animation-play-state: paused !important;
            }
            /* Re-enable smooth hover transitions on the Home Service Showcase
             * tab pills + nav buttons so they fade instead of snapping under
             * the universal transition killer above. */
            .dawki-showcase-tab,
            .dawki-showcase-nav {
                transition-duration: 0.3s !important;
                transition-delay: 0ms !important;
            }
            /* Re-enable hover transitions on the Our Process cards (lift, shine
             * sweep, number scale, arrow pulse, CTA gradient fill). */
            .dawki-process-card,
            .dawki-process-card-num,
            .dawki-process-card-shine,
            .dawki-process-arrow,
            .dawki-process-cta,
            .dawki-process-cta::after,
            .dawki-process-cta svg {
                transition-duration: 0.4s !important;
                transition-delay: 0ms !important;
            }
            .dawki-process-card-shine {
                transition-duration: 0.9s !important;
            }
            /* Re-enable Industries scrolly bits — image zoom on hover, scroll
             * hint bob, and card hover transitions. */
            .dawki-home-ind-card,
            .dawki-home-ind-card-image,
            .dawki-home-ind-card-icon {
                transition-duration: 0.6s !important;
                transition-delay: 0ms !important;
            }
            /* Subtle infinite float on each industry bento card so the grid
             * feels alive instead of static. Each cell has its own delay/dur
             * variation set in CSS. */
            .dawki-home-ind-grid-cell {
                animation-duration: 6s !important;
                animation-iteration-count: infinite !important;
            }
            .dawki-home-ind-grid-cell:nth-child(3n) {
                animation-duration: 7s !important;
            }
            .dawki-home-ind-grid-cell:nth-child(4n) {
                animation-duration: 8s !important;
            }
            /* Re-enable smooth focus / hover transitions on the new home
             * contact form so inputs glow on focus instead of snapping. */
            .dawki-home-contact-field input,
            .dawki-home-contact-field textarea,
            .dawki-home-contact-phone,
            .dawki-home-contact-help-option,
            .dawki-home-contact-help-check,
            .dawki-home-contact-help-check svg,
            .dawki-home-contact-submit,
            .dawki-home-contact-submit svg {
                transition-duration: 0.3s !important;
                transition-delay: 0ms !important;
            }
            /* Re-enable smooth hover/focus transitions on the new Stats /
             * WhyChoose / FAQ sections so cards lift gracefully and accordion
             * expansion animates instead of snapping. */
            .dawki-home-stats-card,
            .dawki-home-why-card,
            .dawki-home-why-card::before,
            .dawki-home-why-card-icon,
            .dawki-home-faq-item,
            .dawki-home-faq-q,
            .dawki-home-faq-icon,
            .dawki-home-faq-link {
                transition-duration: 0.4s !important;
                transition-delay: 0ms !important;
            }
            /* Smooth tab pill switching + lifecycle marker hover */
            .dawki-home-eng-tab,
            .dawki-home-eng-cta,
            .dawki-home-eng-cta svg,
            .dawki-home-life-step-marker {
                transition-duration: 0.35s !important;
                transition-delay: 0ms !important;
            }
            /* Mobile + Web showcase — phone bob, screen carousel, chips,
             * chart bars, typing dots, cursor hop. All keyframe-based, must
             * stay running infinitely. */
            .dawki-mobile-show-phone,
            .dawki-web-show-monitor,
            .dawki-web-show-cursor {
                animation-duration: 6s !important;
                animation-iteration-count: infinite !important;
            }
            .dawki-mobile-show-carousel {
                animation-duration: 12s !important;
                animation-iteration-count: infinite !important;
            }
            .dawki-mobile-show-chip--star,
            .dawki-mobile-show-chip--users,
            .dawki-mobile-show-chip--notif,
            .dawki-web-show-chip--score,
            .dawki-web-show-chip--code,
            .dawki-web-show-chip--users {
                animation-duration: 4.5s !important;
                animation-iteration-count: infinite !important;
            }
            .dawki-mobile-show-typing i {
                animation-duration: 1.4s !important;
                animation-iteration-count: infinite !important;
            }
            /* Chart bars only animate ONCE on mount (don't loop) — keep their
             * grow keyframe but allow it to run normally instead of clamped. */
            .dawki-mobile-show-bars span,
            .dawki-web-show-chart-bars span {
                animation-duration: 1.4s !important;
                animation-iteration-count: 1 !important;
            }
            /* CTA hover smoothness */
            .dawki-mobile-show-cta,
            .dawki-mobile-show-cta svg,
            .dawki-web-show-cta,
            .dawki-web-show-cta svg {
                transition-duration: 0.3s !important;
                transition-delay: 0ms !important;
            }
            /* Showcase mock: spinning "Deploy" indicator inside DevOps card */
            .dawki-showcase-mock-devops-step.running span {
                animation-duration: 1.4s !important;
                animation-iteration-count: infinite !important;
            }
            /* Floating Estimate Calculator FAB — gradient flow + bob + pulse
             * rings + tilting "NEW" badge. All must keep running on the
             * welcome page where the universal animation killer is active. */
            .dawki-est-fab {
                animation-duration: 5s, 3s !important;
                animation-iteration-count: infinite, infinite !important;
            }
            .dawki-est-fab-pulse {
                animation-duration: 2.4s !important;
                animation-iteration-count: infinite !important;
            }
            .dawki-est-fab-badge {
                animation-duration: 2.6s !important;
                animation-iteration-count: infinite !important;
            }
            /* Re-enable the global right-to-left gradient flow on every
             * gradient-text title (Shipped Reality, etc.) — main.css defines
             * the keyframe; this keeps the universal animation killer above
             * from clamping the duration to 0.001ms. */
            [class*="dawki-"][class*="-title"] span,
            .tj-banner-section .banner-content .banner-title span,
            .banner-content .banner-title span,
            .gradient-text-blue,
            .gradient-text {
                animation-duration: 6s !important;
                animation-iteration-count: infinite !important;
                animation-delay: 0ms !important;
                animation-play-state: running !important;
            }
            /* Reveal everything that uses legacy classes in final state */
            .wow, .tj-fadein-right-on-scroll, .text-anim, .dawki-reveal {
                opacity: 1 !important;
                transform: none !important;
                visibility: visible !important;
            }
            /* NOTE: previously had a [style*="opacity: 0"] safety-net here that
             * forced opacity:1 on anything with inline opacity:0. That defeated
             * framer-motion's initial hidden state on the journey timeline (it
             * sets style="opacity:0; transform:..." then animates), so the slide
             * appeared without a fade and felt jerky. Removed — legacy reveal
             * classes are still kept visible by the rule above. */
        `;
        document.head.appendChild(tag);
        return () => {
            tag.remove();
        };
    }, []);

    return (
        <FrontendLayout>
            <Head title="Dawki Infotech | Software Development, Marketing & Automation Experts">
                <meta name="description" content="Dawki Infotech builds custom software, AI automations, and growth engines for businesses across India, the US, the UK, and the UAE. Senior teams, transparent pricing, measurable outcomes." head-key="description" />
                <meta property="og:title" content="Dawki Infotech | Software Development, Marketing & Automation Experts" head-key="og:title" />
                <meta property="og:description" content="Custom software, AI automation, and digital marketing built by a senior team across India, US, UK and UAE." head-key="og:description" />
                <meta name="twitter:title" content="Dawki Infotech | Software Development, Marketing & Automation Experts" head-key="twitter:title" />
                <meta name="twitter:description" content="Custom software, AI automation, and digital marketing built by a senior team across India, US, UK and UAE." head-key="twitter:description" />
            </Head>
            <main id="primary" className="site-main">
                <div className="space-for-header"></div>

                {/* start: Banner Section — full-screen hero with custom bg image.
                    Background image set inline so it can't be overridden by any
                    cached CSS or theme rule. Aggressive cache-bust on the image
                    URL forces a fresh download each session. */}
                <section
                    className="tj-banner-section section-gap-x dawki-hero-bg"
                    style={{
                        backgroundImage: 'url("/assets/images/header/demo/hero-bg.png?nocache=20260503-v5")',
 
                        backgroundSize: 'cover',
                        backgroundPosition: 'center center',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: '#050d1c',
                        minHeight: '100vh',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    <div className="dawki-hero-bg-overlay" aria-hidden="true"></div>
                    <div className="banner-area">
                        <div className="banner-left-box">
                            <div className="banner-content">
                                <span className="sub-title">
                                    <i className="tji-excellence"></i> Trusted Software & Marketing Partner
                                </span>
                                <h1 className="banner-title">
                                    Empowering Growth That Turns Ideas Into <span>Shipped Reality.</span>
                                </h1>
                                <p className="banner-tagline">
                                    Web Development. SEO. Mobile Apps. <span>Digital Marketing.</span>
                                </p>
                                <div className="banner-desc-area">
                                    <MagneticBox>
                                        <a className="banner-link" href="/contact">
                                            <span className="banner-link-text">Schedule a Call</span>
                                            <span className="banner-link-icon"><i className="tji-arrow-right-big"></i></span>
                                        </a>
                                    </MagneticBox>
                                    <div className="banner-desc">
                                        We help startups and enterprises ship websites, mobile apps, and SEO strategies that drive real growth—delivered on time, built to scale, and designed to last.
                                    </div>
                                </div>
                                <div className="banner-trust-row">
                                    <span className="trust-item"><strong>4.9/5</strong> Client Rating</span>
                                    <span className="trust-divider"></span>
                                    <span className="trust-item"><strong>500+</strong> Happy Clients</span>
                                    <span className="trust-divider"></span>
                                    <span className="trust-item"><strong>10+</strong> Years Experience</span>
                                    <span className="trust-divider"></span>
                                    <span className="trust-item"><strong>200+</strong> Projects Shipped</span>
                                </div>

                                {/* Tech-stack logos row — small chip cards under the trust row */}
                                <div className="dawki-hero-tech">
                                    {[
                                        { name: 'HTML5', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg' },
                                        { name: 'CSS3', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg' },
                                        { name: 'JavaScript', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' },
                                        { name: 'React', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' },
                                        { name: 'Next.js', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg' },
                                        { name: 'Node.js', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg' },
                                    ].map((t) => (
                                        <div className="dawki-hero-tech-chip" key={t.name} title={t.name}>
                                            <img
                                                src={t.src}
                                                alt={t.name}
                                                loading="eager"
                                                decoding="async"
                                                width={28}
                                                height={28}
                                                className="dawki-hero-tech-img"
                                            />
                                            <span>{t.name}</span>
                                        </div>
                                    ))}
                                </div>
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

                {/* Stats / Impact — animated counters showing scale & track record */}
                <HomeStats />

                {/* Choose Section ("Empowering Business with Expertise") removed —
                    user reported it felt laggy. Other sections (Industries, Tech Stack,
                    Solutions Timeline, Success Stories) cover the same trust narrative. */}

                {/* About Section removed — replaced by other sections (Industries,
                    Tech Stack, Solutions, etc.) that already cover the same ground. */}

                {/* Sticky "Our Solutions" service section (Custom Web Dev / E-commerce
                    / Cloud / UI-UX) removed on user request. */}

                {/* "Tailor Business Solutions for Corporates" timeline section
                    removed on user request. */}

                {/* Working Process section ("Seamless Process, Great Results") removed
                    on user request — keeping page lighter. */}

                {/* Home Service Showcase — appinventiv-style 3D coverflow */}
                <HomeServiceShowcase />

                {/* Engagement Models — tab switcher (different feel from coverflow above) */}
                <HomeEngagement />

                {/* From Idea to Launch — 5-step lifecycle with stagger reveal */}
                <HomeLifecycle />

                {/* Mobile App Development showcase — animated phone mockup */}
                <HomeMobileShowcase />

                {/* Web Development showcase — animated browser/dashboard mockup */}
                <HomeWebShowcase />

                {/* ========================================================
                 * Tailor Business Solutions — journey-timeline style
                 * (mirrors About → Our Journey: alternating left/right cards
                 * with center spine + relevant image opposite each card)
                 * ======================================================== */}
                <section className="dawki-journey" style={{ contentVisibility: 'auto', containIntrinsicSize: '1400px' }}>
                    <div className="container">
                        <RevealUp>
                            <div className="dawki-journey-heading">
                                <span className="dawki-journey-pill">
                                    <span className="dawki-values-dot"></span>
                                    Our Solutions
                                </span>
                                <h2 className="dawki-journey-title">
                                    Tailor Business Solutions <span>for Corporates.</span>
                                </h2>
                                <p className="dawki-journey-subtitle">
                                    From AI to cloud — we engineer end-to-end solutions that scale with your business and ship without surprises.
                                </p>
                            </div>
                        </RevealUp>

                        <StaggerWrap className="dawki-timeline">
                            {[
                                {
                                    label: '01',
                                    title: 'AI Development',
                                    desc: 'Intelligent solutions that automate work, sharpen decisions, and unlock new growth opportunities.',
                                    img: '/assets/images/service/ai_development.webp',
                                    fallback: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
                                },
                                {
                                    label: '02',
                                    title: 'Mobile App Development',
                                    desc: 'Fast, intuitive iOS and Android apps built to keep users engaged and coming back.',
                                    img: '/assets/images/service/mobile_development.webp',
                                    fallback: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
                                },
                                {
                                    label: '03',
                                    title: 'Software Development',
                                    desc: 'Custom software that scales with your business and runs without friction across teams.',
                                    img: '/assets/images/service/software_development.webp',
                                    fallback: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
                                },
                                {
                                    label: '04',
                                    title: 'IT Consulting',
                                    desc: 'Expert guidance to modernize your stack, cut costs, and align IT with business goals.',
                                    img: '/assets/images/service/IT_consulting.webp',
                                    fallback: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
                                },
                                {
                                    label: '05',
                                    title: 'DevOps',
                                    desc: 'Automated pipelines and reliable infrastructure to ship faster with full confidence.',
                                    img: '/assets/images/service/dev_ops.webp',
                                    fallback: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
                                },
                                {
                                    label: '06',
                                    title: 'Cloud Managed Services',
                                    desc: 'Secure, scalable cloud operations with less downtime and stronger performance worldwide.',
                                    img: '/assets/images/service/cloud_services.webp',
                                    fallback: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
                                },
                                {
                                    label: '07',
                                    title: 'Blockchain Development',
                                    desc: 'Smart contracts, DeFi platforms, and Web3 applications engineered for security and scale.',
                                    img: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80',
                                    fallback: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80',
                                },
                                {
                                    label: '08',
                                    title: 'Data Engineering & Analytics',
                                    desc: 'Pipelines, warehouses, and BI dashboards that turn raw data into business decisions.',
                                    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
                                    fallback: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
                                },
                                {
                                    label: '09',
                                    title: 'Cybersecurity Services',
                                    desc: 'Penetration testing, secure SDLC, and 24/7 monitoring to keep your systems and data safe.',
                                    img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
                                    fallback: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
                                },
                            ].map((s, i) => (
                                <StaggerCh key={i} className={`dawki-timeline-item dawki-timeline-item--${i % 2 === 0 ? 'left' : 'right'}`}>
                                    <div className="dawki-timeline-content">
                                        <span className="dawki-timeline-year">{s.label}</span>
                                        <h3 className="dawki-timeline-title">{s.title}</h3>
                                        <p className="dawki-timeline-desc">{s.desc}</p>
                                    </div>
                                    <div className="dawki-timeline-marker">
                                        <span className="dawki-timeline-dot"></span>
                                    </div>
                                    <div className="dawki-timeline-image">
                                        <img
                                            loading="lazy"
                                            decoding="async"
                                            src={s.img}
                                            alt={s.title}
                                            onError={(e) => {
                                                const img = e.currentTarget;
                                                if (img.src !== s.fallback) img.src = s.fallback;
                                            }}
                                        />
                                        <div className="dawki-timeline-image-glow"></div>
                                    </div>
                                </StaggerCh>
                            ))}
                        </StaggerWrap>

                        <div className="service-btn-area text-center" style={{ marginTop: 40 }}>
                            <Link className="tj-primary-btn" href="/about" onClick={openServicesMegaMenu}>
                                <span className="btn-text"><span>More Services</span></span>
                                <span className="btn-icon"><i className="tji-arrow-right-long"></i></span>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* "Our Process" 3-step section removed on user request — felt laggy. */}

                {/* Why Choose Us — 6 differentiator cards */}
                <HomeWhyChoose />

                {/* start: Our Products Section (CRM + AI Grow) */}
                <section className="dawki-products" style={{ contentVisibility: 'auto', containIntrinsicSize: '1300px' }}>
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
                                        <a href="/contact" className="dawki-product-btn">
                                            <span>Request a Demo</span>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                                        </a>
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
                                        <a href="/contact" className="dawki-product-btn">
                                            <span>Try AI Grow</span>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                                        </a>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </div>
                </section>
                {/* end: Our Products Section */}

                {/* start: Robust Tools & Technologies — static white grid */}
                <section className="dawki-tech-section" style={{ contentVisibility: 'auto', containIntrinsicSize: '900px' }}>
                    <div className="container">
                        <div className="dawki-tech-heading">
                            <span className="dawki-tech-pill">
                                <span className="dawki-tech-dot"></span>
                                Powering Every Build
                            </span>
                            <h2 className="dawki-tech-title">
                                Robust Tools &amp; Technologies <span>We Work With</span>
                            </h2>
                            <p className="dawki-tech-subtitle">
                                From classic programming languages to cutting-edge frameworks, databases, cloud platforms and AI APIs — we work across the entire stack to bring your ideas to life.
                            </p>
                        </div>
                        <div className="dawki-tech-grid">
                            {TECH_STACK.map((t) => (
                                <div className="dawki-tech-card" key={t.name} title={t.name}>
                                    <img
                                        className="dawki-tech-icon"
                                        loading="lazy"
                                        decoding="async"
                                        src={t.src}
                                        alt={t.name}
                                        width={36}
                                        height={36}
                                    />
                                    <span className="dawki-tech-name">{t.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                {/* end: Robust Tools & Technologies */}

                {/* start: Success Stories — video on left + testimonials on right */}
                <HomeSuccessStories />
                {/* end: Success Stories */}

                {/* start: Testimonial Section */}
                <section className="h5-testimonial section-gap section-gap-x" style={{ contentVisibility: 'auto', containIntrinsicSize: '900px' }}>
                    <div className="container">
                        <div className="row justify-content-between">
                            <div className="col-12">
                                <Reveal>
                                    <div className="sec-heading style-3 sec-heading-centered">
                                        <span className="sub-title"><i className="tji-box"></i>CLIENT FEEDBACKS</span>
                                        <h2 className="sec-title">Success Stories Fuel our Innovation.</h2>
                                    </div>
                                </Reveal>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="testimonial-wrapper h5-testimonial-wrapper">
                                    <div className="google-reviews-marquee">
                                        <div className="google-reviews-track">
                                            {[...GOOGLE_TESTIMONIALS, ...GOOGLE_TESTIMONIALS].map((item, idx) => (
                                                <div className="google-review-card" key={`gt-${idx}`}>
                                                    <div className="google-review-header">
                                                        <div className="google-review-avatar" style={{ background: item.color }}>{initialsOf(item.name)}</div>
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
                                                    <a href="/contact" className="google-review-readmore">Read more</a>
                                                </div>
                                            ))}
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
                </section>
                {/* end: Testimonial Section */}

                {/* Industries We Power section removed on user request. */}

                {/* start: Behind the Build — Video Showcase */}
                <HomeVideoShowcase />
                {/* end: Behind the Build */}

                {/* FAQ — pre-sales questions to remove buyer hesitation */}
                <HomeFAQ />

                {/* start: Contact Section — premium "Let's Build Something Great Together" */}
                <HomeContact />
                {/* end: Contact Section */}

                {/* Blog Section ("Strategies and Insights") removed —
                    user reported it felt laggy (Swiper slider was the heavy bit). */}

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
                                            <a className="dawki-cta-btn dawki-cta-btn-primary" href="/contact">
                                                <span>Book a Free Consultation</span>
                                                <i className="tji-arrow-right-long"></i>
                                            </a>
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
