import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import ServicePageTemplate, { ICON } from '@/components/ServicePageTemplate';

/* ===========================================================================
 * Shared count-up
 * =========================================================================== */
const useCountUp = (target: number, duration = 1800, decimals = 0) => {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: '-50px' });
    const [val, setVal] = useState(0);

    useEffect(() => {
        if (!inView) return;
        let raf = 0;
        const start = performance.now();
        const tick = (t: number) => {
            const p = Math.min((t - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(eased * target);
            if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [inView, target, duration]);

    return { ref, value: val.toFixed(decimals) };
};

/* ===========================================================================
 * Section 1: Social Feed Phone Mockup — IG-style feed with stories + posts
 * =========================================================================== */
const STORIES = [
    { name: 'You',     a: '#94a3b8', b: '#64748b', seen: false, isYou: true },
    { name: 'launch',  a: '#f97316', b: '#ec4899', seen: false },
    { name: 'team',    a: '#a855f7', b: '#ec4899', seen: false },
    { name: 'office',  a: '#06b6d4', b: '#4f7cff', seen: true  },
    { name: 'event',   a: '#22c55e', b: '#06b6d4', seen: true  },
];

const PhoneFeedMockup: React.FC = () => {
    const followers = useCountUp(48200, 1800, 0);
    const engagement = useCountUp(7.2, 1800, 1);
    const reach = useCountUp(312, 1800, 0);

    return (
        <section className="dawki-soc-feed">
            <div className="container">
                <div className="dawki-soc-feed-heading">
                    <span className="dawki-soc-feed-pill">
                        <span></span>
                        Always-On Content
                    </span>
                    <h2 className="dawki-soc-feed-title">
                        Feeds Built To <span>Stop The Scroll</span>
                    </h2>
                    <p className="dawki-soc-feed-subtitle">
                        Native to each platform, scripted to hook in 1.5 seconds, and posted on a cadence that compounds. Here's a peek at what your social presence can look like.
                    </p>
                </div>

                <div className="dawki-soc-feed-grid">
                    <motion.div
                        className="dawki-soc-phone-stage"
                        initial={{ opacity: 0, y: 30, scale: 0.92 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.85, ease: [0.2, 0.8, 0.2, 1] }}
                    >
                        <div className="dawki-soc-floats" aria-hidden="true">
                            <span className="dawki-soc-float dawki-soc-float--a" style={{ ['--f-a' as string]: '#ef4444', ['--f-b' as string]: '#ec4899', ['--f-glow' as string]: 'rgba(239, 68, 68, 0.55)' }}>♥</span>
                            <span className="dawki-soc-float dawki-soc-float--b" style={{ ['--f-a' as string]: '#a855f7', ['--f-b' as string]: '#4f7cff', ['--f-glow' as string]: 'rgba(168, 85, 247, 0.55)' }}>💬</span>
                            <span className="dawki-soc-float dawki-soc-float--c" style={{ ['--f-a' as string]: '#22c55e', ['--f-b' as string]: '#06b6d4', ['--f-glow' as string]: 'rgba(34, 197, 94, 0.55)' }}>↗</span>
                            <span className="dawki-soc-float dawki-soc-float--d" style={{ ['--f-a' as string]: '#f97316', ['--f-b' as string]: '#fbbf24', ['--f-glow' as string]: 'rgba(249, 115, 22, 0.55)' }}>★</span>
                        </div>

                        <div className="dawki-soc-phone">
                            <div className="dawki-soc-phone-screen">
                                <div className="dawki-soc-phone-statusbar">
                                    <span>9:41</span>
                                    <span className="dawki-soc-phone-statusbar-icons">
                                        <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor" aria-hidden="true">
                                            <rect x="0" y="6" width="2" height="4" rx="0.5"/>
                                            <rect x="4" y="4" width="2" height="6" rx="0.5"/>
                                            <rect x="8" y="2" width="2" height="8" rx="0.5"/>
                                            <rect x="12" y="0" width="2" height="10" rx="0.5"/>
                                        </svg>
                                        <svg width="16" height="10" viewBox="0 0 24 16" fill="currentColor" aria-hidden="true">
                                            <path d="M2 0h20v16H2zm0 2v12h20V2zM3 3v10h17V3z"/>
                                            <rect x="22" y="6" width="2" height="4" rx="0.5"/>
                                        </svg>
                                    </span>
                                </div>

                                <div className="dawki-soc-phone-app-header">
                                    <span className="dawki-soc-phone-app-header-brand">yourbrand</span>
                                    <span className="dawki-soc-phone-app-header-icons">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s-7-5.5-7-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.5-7 11-7 11z"/></svg>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                                    </span>
                                </div>

                                <div className="dawki-soc-stories-row">
                                    {STORIES.map((s) => (
                                        <div key={s.name} className="dawki-soc-story">
                                            <div className={`dawki-soc-story-ring${s.seen ? ' dawki-soc-story-ring--seen' : ''}`}>
                                                <div
                                                    className="dawki-soc-story-inner"
                                                    style={{ ['--st-a' as string]: s.a, ['--st-b' as string]: s.b }}
                                                ></div>
                                            </div>
                                            <span className="dawki-soc-story-name">{s.name}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="dawki-soc-feed-scroll">
                                    {/* Post 1: Reel */}
                                    <div className="dawki-soc-post">
                                        <div className="dawki-soc-post-header">
                                            <div
                                                className="dawki-soc-post-header-avatar"
                                                style={{ ['--av-a' as string]: '#ec4899', ['--av-b' as string]: '#f97316' }}
                                            ></div>
                                            <div className="dawki-soc-post-header-handle">
                                                yourbrand
                                                <small>Sponsored · 1h</small>
                                            </div>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ color: '#0f172a' }}>
                                                <circle cx="5" cy="12" r="2"/>
                                                <circle cx="12" cy="12" r="2"/>
                                                <circle cx="19" cy="12" r="2"/>
                                            </svg>
                                        </div>
                                        <div
                                            className="dawki-soc-post-image"
                                            style={{ ['--p-a' as string]: '#ec4899', ['--p-b' as string]: '#a855f7', ['--p-c' as string]: '#4f7cff' }}
                                        >
                                            <span className="dawki-soc-post-image-tag">
                                                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
                                                Reel · 0:24
                                            </span>
                                            <div className="dawki-soc-post-image-caption">
                                                Behind the launch
                                                <br/>that broke our DMs
                                            </div>
                                        </div>
                                        <div className="dawki-soc-post-actions">
                                            <svg className="heart" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21s-7-5-7-11a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 6-7 11-7 11z"/></svg>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                                            <span className="dawki-soc-post-actions-spacer"></span>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                                        </div>
                                        <div className="dawki-soc-post-meta">
                                            <div className="dawki-soc-post-likes">12,482 likes</div>
                                            <p className="dawki-soc-post-caption">
                                                <strong>yourbrand</strong> What it really took to ship our biggest drop yet — captions, scripts and the bloopers no one sees. <span className="tag">#brandstory</span>
                                            </p>
                                            <div className="dawki-soc-post-time">2 hours ago</div>
                                        </div>
                                    </div>

                                    {/* Post 2: Carousel */}
                                    <div className="dawki-soc-post">
                                        <div className="dawki-soc-post-header">
                                            <div
                                                className="dawki-soc-post-header-avatar"
                                                style={{ ['--av-a' as string]: '#06b6d4', ['--av-b' as string]: '#4f7cff' }}
                                            ></div>
                                            <div className="dawki-soc-post-header-handle">
                                                yourbrand
                                                <small>3 hours ago</small>
                                            </div>
                                        </div>
                                        <div
                                            className="dawki-soc-post-image"
                                            style={{ ['--p-a' as string]: '#06b6d4', ['--p-b' as string]: '#22c55e', ['--p-c' as string]: '#a855f7' }}
                                        >
                                            <span className="dawki-soc-post-image-tag">
                                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><rect x="7" y="7" width="10" height="10" rx="1"/></svg>
                                                1 / 5
                                            </span>
                                            <div className="dawki-soc-post-image-caption">
                                                5 plays we made
                                                <br/>that 3×'d our reach
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="dawki-soc-side"
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: '-60px' }}
                        variants={{
                            hidden: {},
                            show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
                        }}
                    >
                        <motion.div
                            className="dawki-soc-side-stat"
                            variants={{
                                hidden: { opacity: 0, x: 30 },
                                show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] } },
                            }}
                            style={{ ['--ic-a' as string]: '#ec4899', ['--ic-b' as string]: '#f97316' }}
                        >
                            <span className="dawki-soc-side-stat-icon">👥</span>
                            <div className="dawki-soc-side-stat-content">
                                <div className="dawki-soc-side-stat-value">+<span ref={followers.ref}>{followers.value}</span></div>
                                <div className="dawki-soc-side-stat-label">New followers in the last 90 days</div>
                                <span className="dawki-soc-side-stat-trend">▲ 24% vs prior period</span>
                            </div>
                        </motion.div>

                        <motion.div
                            className="dawki-soc-side-stat"
                            variants={{
                                hidden: { opacity: 0, x: 30 },
                                show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] } },
                            }}
                            style={{ ['--ic-a' as string]: '#a855f7', ['--ic-b' as string]: '#4f7cff' }}
                        >
                            <span className="dawki-soc-side-stat-icon">💬</span>
                            <div className="dawki-soc-side-stat-content">
                                <div className="dawki-soc-side-stat-value"><span ref={engagement.ref}>{engagement.value}</span>%</div>
                                <div className="dawki-soc-side-stat-label">Avg engagement rate across feed</div>
                                <span className="dawki-soc-side-stat-trend">▲ 2.1pt vs industry average</span>
                            </div>
                        </motion.div>

                        <motion.div
                            className="dawki-soc-side-stat"
                            variants={{
                                hidden: { opacity: 0, x: 30 },
                                show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] } },
                            }}
                            style={{ ['--ic-a' as string]: '#22c55e', ['--ic-b' as string]: '#06b6d4' }}
                        >
                            <span className="dawki-soc-side-stat-icon">📈</span>
                            <div className="dawki-soc-side-stat-content">
                                <div className="dawki-soc-side-stat-value"><span ref={reach.ref}>{reach.value}</span>K</div>
                                <div className="dawki-soc-side-stat-label">Monthly accounts reached</div>
                                <span className="dawki-soc-side-stat-trend">▲ 3.4× since program kickoff</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

/* ===========================================================================
 * Section 2: Content Calendar — month grid with platform-coded scheduled posts
 * =========================================================================== */
const PLATFORMS_LEG = [
    { code: 'ig', name: 'Instagram', color: '#ec4899' },
    { code: 'fb', name: 'Facebook',  color: '#1877F2' },
    { code: 'tw', name: 'X / Twitter', color: '#000000' },
    { code: 'li', name: 'LinkedIn',  color: '#0A66C2' },
    { code: 'tt', name: 'TikTok',    color: '#fe2c55' },
    { code: 'yt', name: 'YouTube',   color: '#FF0000' },
];

// Build a deterministic October 2026 calendar (Wed Oct 1)
// Days previous month: 28, 29, 30 fill Sun/Mon/Tue
const CAL_DAYS: { num: number; isThis: boolean; isToday?: boolean; posts: string[] }[] = [
    { num: 28, isThis: false, posts: [] },
    { num: 29, isThis: false, posts: [] },
    { num: 30, isThis: false, posts: [] },
    { num: 1,  isThis: true,  posts: ['ig', 'tt'] },
    { num: 2,  isThis: true,  posts: ['li'] },
    { num: 3,  isThis: true,  posts: ['ig', 'fb', 'tw'] },
    { num: 4,  isThis: true,  posts: ['yt'] },

    { num: 5,  isThis: true,  posts: ['ig'] },
    { num: 6,  isThis: true,  posts: ['li', 'tw'] },
    { num: 7,  isThis: true,  posts: ['ig', 'tt'] },
    { num: 8,  isThis: true,  posts: ['fb'] },
    { num: 9,  isThis: true,  posts: ['ig', 'li', 'yt'] },
    { num: 10, isThis: true,  posts: ['tt', 'tw'] },
    { num: 11, isThis: true,  posts: [] },

    { num: 12, isThis: true,  posts: ['ig'] },
    { num: 13, isThis: true,  posts: ['li', 'fb'] },
    { num: 14, isThis: true,  posts: ['ig', 'tt'] },
    { num: 15, isThis: true,  posts: ['tw'] },
    { num: 16, isThis: true,  isToday: true, posts: ['ig', 'fb', 'li', 'yt'] },
    { num: 17, isThis: true,  posts: ['ig', 'tt'] },
    { num: 18, isThis: true,  posts: [] },

    { num: 19, isThis: true,  posts: ['ig', 'tw'] },
    { num: 20, isThis: true,  posts: ['li'] },
    { num: 21, isThis: true,  posts: ['ig', 'fb', 'tt'] },
    { num: 22, isThis: true,  posts: ['yt', 'tw'] },
    { num: 23, isThis: true,  posts: ['ig', 'li'] },
    { num: 24, isThis: true,  posts: ['tt'] },
    { num: 25, isThis: true,  posts: [] },

    { num: 26, isThis: true,  posts: ['ig', 'tw'] },
    { num: 27, isThis: true,  posts: ['li', 'yt'] },
    { num: 28, isThis: true,  posts: ['ig', 'fb', 'tt'] },
    { num: 29, isThis: true,  posts: ['tw'] },
    { num: 30, isThis: true,  posts: ['ig', 'li'] },
    { num: 31, isThis: true,  posts: ['tt', 'fb'] },
    { num: 1,  isThis: false, posts: [] },
];

const platformColor = (code: string) => PLATFORMS_LEG.find(p => p.code === code)?.color ?? '#94a3b8';

const ContentCalendar: React.FC = () => {
    const totalPosts = CAL_DAYS.reduce((sum, d) => sum + (d.isThis ? d.posts.length : 0), 0);

    return (
        <section className="dawki-soc-cal">
            <div className="container">
                <div className="dawki-soc-cal-heading">
                    <span className="dawki-soc-cal-pill">
                        <span></span>
                        Content Calendar
                    </span>
                    <h2 className="dawki-soc-cal-title">
                        A Month of Posts, <span>Planned and Approved</span>
                    </h2>
                    <p className="dawki-soc-cal-subtitle">
                        Every campaign, story, and reel mapped weeks in advance — color-coded per platform, reviewed every Monday, posted on schedule.
                    </p>
                </div>

                <motion.div
                    className="dawki-soc-cal-frame"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                >
                    <div className="dawki-soc-cal-toolbar">
                        <div className="dawki-soc-cal-month">
                            October 2026
                            <span className="dawki-soc-cal-month-stat">{totalPosts} posts scheduled</span>
                        </div>
                        <div className="dawki-soc-cal-legend">
                            {PLATFORMS_LEG.map((p) => (
                                <span key={p.code} className="dawki-soc-cal-legend-item">
                                    <span className="dawki-soc-cal-legend-dot" style={{ ['--leg' as string]: p.color }}></span>
                                    {p.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    <motion.div
                        className="dawki-soc-cal-grid"
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: '-60px' }}
                        variants={{
                            hidden: {},
                            show: { transition: { staggerChildren: 0.012, delayChildren: 0.2 } },
                        }}
                    >
                        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => (
                            <div key={d} className="dawki-soc-cal-weekday">{d}</div>
                        ))}

                        {CAL_DAYS.map((day, idx) => (
                            <motion.div
                                key={idx}
                                className={`dawki-soc-cal-day${day.isThis ? '' : ' dawki-soc-cal-day--other'}${day.isToday ? ' dawki-soc-cal-day--today' : ''}`}
                                variants={{
                                    hidden: { opacity: 0, scale: 0.85 },
                                    show: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] } },
                                }}
                            >
                                <span className="dawki-soc-cal-day-num">{day.num}</span>
                                {day.posts.length > 0 && (
                                    <div className="dawki-soc-cal-day-dots">
                                        {day.posts.map((p, i) => (
                                            <span
                                                key={i}
                                                className="dawki-soc-cal-dot"
                                                style={{ ['--dot' as string]: platformColor(p) }}
                                            ></span>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

/* ===========================================================================
 * Section 3: Social Media Video Showcase
 * =========================================================================== */
const SocialMediaVideo: React.FC = () => {
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
                        Inside The Studio
                    </span>
                    <h2 className="dawki-ent-video-title">
                        See How We Build <span>Social Brands</span>
                    </h2>
                    <p className="dawki-ent-video-subtitle">
                        A behind-the-scenes look at how we plan content calendars, shoot short-form video, and run community in real time across every platform.
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
                        poster="/assets/images/testimonial/client_feedback.jpg"
                        controls={started}
                        preload="metadata"
                        playsInline
                    >
                        <source src="/assets/images/header/demo/dawki_video.mp4" type="video/mp4" />
                    </video>

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

/* ===========================================================================
 * Page
 * =========================================================================== */
export default function SocialMediaManagement() {
    return (
        <ServicePageTemplate
            pageTitle="Social Media Management"
            breadcrumbCategory="Digital Marketing"
            heroPill="Digital Marketing"
            heroTitleStart="Social Media"
            heroTitleHighlight="Management"
            heroSubtitle="Strategy, content, and community for Instagram, LinkedIn, TikTok, X, YouTube, and Facebook — built to grow followers, engagement, and revenue."
            heroVideoSrc="/assets/images/header/demo/social-media-management.mp4"
            featuresPill="Always-On Social"
            featuresTitleStart="Social That Builds"
            featuresTitleHighlight="Brand & Pipeline"
            featuresSubtitle="From content production to community management — we run social media programs that convert audience into customers."
            features={[
                { title: 'Channel Strategy', desc: 'Right platforms, formats, and cadence for your audience and goals.', icon: '🎯' },
                { title: 'Content Production', desc: 'Reels, statics, carousels, and short-form video built for each platform.', icon: '🎬' },
                { title: 'Community Management', desc: 'Comment, DM, and review responses that build trust and conversion.', icon: '💬' },
                { title: 'Influencer Partnerships', desc: 'Vetted creator partnerships and UGC programs that drive ROI.', icon: '🌟' },
                { title: 'Social Listening', desc: 'Monitor brand, competitors, and trends to fuel content and react fast.', icon: '👂' },
                { title: 'Analytics & Reporting', desc: 'Reach, engagement, traffic, and conversion reported monthly.', icon: '📊' },
            ]}
            processSteps={[
                { n: '01', t: 'Audit & Strategy', d: 'Audit current social, audience research, channel selection, and content pillars.' },
                { n: '02', t: 'Production', d: 'Monthly content calendar, scripting, shooting, design, and editing.' },
                { n: '03', t: 'Publish & Engage', d: 'Publishing, community management, and trend-driven posts.' },
                { n: '04', t: 'Measure & Optimize', d: 'Monthly reporting and quarterly content strategy refresh.' },
            ]}
            servicesPill="Our Capabilities"
            servicesTitleStart="Social Media"
            servicesTitleHighlight="Services We Offer"
            servicesSubtitle="A full-service social practice — strategy, content, community, and analytics."
            servicesLayout="timeline"
            serviceCards={[
                { title: 'Social Media Strategy', desc: 'Channel selection, audience research, content pillars, and goal-driven roadmap.', icon: ICON.target },
                { title: 'Content Creation & Design', desc: 'Static, carousel, reel, and short-form video tailored per channel.', icon: ICON.palette },
                { title: 'Short-Form Video Production', desc: 'TikTok, Reels, and Shorts produced at scale with hook-driven scripts.', icon: ICON.rocket },
                { title: 'Community Management', desc: 'DM and comment response, sentiment monitoring, and crisis response.', icon: ICON.users },
                { title: 'Influencer Marketing', desc: 'Creator vetting, briefing, contracts, and performance tracking.', icon: ICON.megaphone },
                { title: 'Paid Social Boosting', desc: 'Boost top organic posts and run dark-post tests to scale reach.', icon: ICON.chart },
                { title: 'Social Media Audit', desc: 'Account audits with benchmarks, gaps, and a 90-day improvement plan.', icon: ICON.eye },
                { title: 'Profile Optimization', desc: 'Bio, link-in-bio, pinned content, and visual identity across networks.', icon: ICON.cog },
                { title: 'Social Listening', desc: 'Brand, competitor, and trend monitoring with weekly intelligence briefs.', icon: ICON.search },
                { title: 'LinkedIn Personal Branding', desc: 'Founder and exec ghostwriting and growth playbooks for LinkedIn.', icon: ICON.code },
                { title: 'Reputation Management', desc: 'Review response, sentiment monitoring, and crisis playbooks.', icon: ICON.shield },
                { title: 'Reporting & Analytics', desc: 'Monthly dashboards covering reach, engagement, traffic, and conversions.', icon: ICON.headset },
            ]}
            toolsTitleStart="Social Tools &"
            toolsTitleHighlight="Platforms We Run On"
            toolsSubtitle="A purpose-built social stack — scheduling, creative, listening, and reporting — operated end-to-end as a single team."
            toolsLayout="vertical"
            tools={[
                { n: 'Meta Business Suite', s: 'meta',         c: '0467DF', desc: 'Native scheduling, inbox, and ads for Facebook + Instagram — our default for any Meta-heavy program.' },
                { n: 'Hootsuite',           s: 'hootsuite',    c: '143059', desc: 'Cross-platform scheduling, social listening, and team workflows for multi-brand calendars.' },
                { n: 'Buffer',              s: 'buffer',       c: '231F20', desc: 'Lightweight scheduler for IG, X, LinkedIn, and TikTok — clean queues and approvals built in.' },
                { n: 'Sprout Social',       s: 'sprout',       c: '75DD66', desc: 'Enterprise-grade publishing, community management, and analytics — paired with strong listening.' },
                { n: 'Later',               s: 'later',        c: '000000', desc: 'Visual content calendar and link-in-bio for IG-first brands — drag-and-drop monthly grids.' },
                { n: 'Loomly',              s: 'loomly',       c: '0F1727', desc: 'Approval-heavy editorial calendars — perfect for brands with multiple stakeholders per post.' },
                { n: 'Canva',               s: 'canva',        c: '00C4CC', desc: 'Fast collaborative creative — campaign visuals, story templates, and brand-kit-locked design.' },
                { n: 'CapCut',              s: 'capcut',       c: '000000', desc: 'Short-form video editor for Reels, TikTok, and Shorts — fast cuts, trending audio, captions baked in.' },
                { n: 'Adobe Premiere Pro',  s: 'adobepremierepro', c: '9999FF', desc: 'Long-form and high-end short-form editing — when production value matters above speed.' },
                { n: 'Figma',               s: 'figma',        c: 'F24E1E', desc: 'Brand design templates, post variants, and content systems — designs that ship to scheduler-ready PNGs.' },
                { n: 'TikTok Creator Center', s: 'tiktok',     c: '000000', desc: 'Trending sounds, hashtags, and creator marketplace — our scout for what to build next.' },
                { n: 'LinkedIn Sales Navigator', s: 'linkedin',c: '0A66C2', desc: 'Audience research, lead lists, and account intel for B2B social and personal-brand content.' },
                { n: 'Brandwatch',          s: 'brandwatch',   c: '08A87E', desc: 'Enterprise social listening — brand sentiment, share-of-voice, and crisis early warnings.' },
                { n: 'Mention',             s: 'mention',      c: '00C0FF', desc: 'Affordable mention monitoring and reputation tracking — alerts the moment your brand surfaces.' },
                { n: 'BuzzSumo',            s: 'buzzsumo',     c: 'EE3A52', desc: 'Content research and influencer discovery — what topics get shared, who shares them.' },
                { n: 'Notion',              s: 'notion',       c: '000000', desc: 'Content briefs, post copy, and approvals — searchable across every campaign and brand.' },
            ]}
            hideProjects={true}
            hideTestimonial={true}
            showClients={true}
            clientsPill="Trusted By Social Teams"
            clientsHeading="From Indie Brands to Global Campaigns,"
            clientsHeadingHighlight="We Build Social That Scales"
            extraSections={
                <>
                    <PhoneFeedMockup />
                    <ContentCalendar />
                    <SocialMediaVideo />
                </>
            }
            googleReviews={[
                {
                    name: 'Mira Saldana',
                    role: 'Head of Brand, Holst Apparel',
                    rating: 5,
                    date: '2 months ago',
                    text: 'Their TikTok strategy doubled our follower count in 90 days and one of the Reels tipped 4M views. The hook-driven scripting is what made the difference.',
                },
                {
                    name: 'Ethan Kowalski',
                    role: 'CEO, Liminal Coffee',
                    rating: 5,
                    date: '4 months ago',
                    text: 'The team became part of our morning standup — they review trends before we even wake up. Our Instagram engagement rate climbed from 1.8% to 7.4% in two quarters.',
                },
                {
                    name: 'Aisha Yousef',
                    role: 'CMO, Cordwell SaaS',
                    rating: 5,
                    date: '6 months ago',
                    text: 'B2B LinkedIn personal branding for our exec team — daily posts, weekly newsletter, monthly carousel essays. Inbound demos from LinkedIn alone tripled.',
                },
                {
                    name: 'Tomás Rivera',
                    role: 'Founder, Northsail Travel',
                    rating: 5,
                    date: '3 months ago',
                    text: 'Their UGC program with twenty creators delivered more authentic content than any branded shoot we\'ve produced. CPM on boosted UGC was 60% lower than studio creative.',
                },
                {
                    name: 'Hanna Lindgren',
                    role: 'Director of Marketing, Pinemark Outdoor',
                    rating: 5,
                    date: '5 months ago',
                    text: 'Instagram + TikTok + YouTube Shorts running in lockstep — the same hook adapted three ways. Reach jumped 4× and we finally have a content engine, not a fire drill.',
                },
                {
                    name: 'Jonas Albrecht',
                    role: 'Head of Social, FinFleet',
                    rating: 5,
                    date: '7 months ago',
                    text: 'Crisis response playbook saved us during a viral negative thread. They had a measured, on-brand response live in under an hour. Worth the engagement on that day alone.',
                },
            ]}
            googleReviewsHeading="What Brand Leaders Say About Us"
            googleReviewsSubtitle="Verified reviews from CMOs, brand directors, and social leads we've shipped social programs with."
            faqs={[
                { q: 'Which social channels should my business be on?', a: 'It depends on where your audience is and your goals. B2C usually leans Instagram, TikTok, YouTube. B2B leans LinkedIn and X. Our audit recommends a focused mix.' },
                { q: 'How often should we post?', a: 'Cadence varies by channel — typically 3–5x/week on Instagram, daily on TikTok, 2–4x/week on LinkedIn. We tune to what your audience and bandwidth support.' },
                { q: 'Do you produce content too?', a: 'Yes. We script, shoot, design, and edit content — including short-form video — across formats and channels.' },
                { q: 'Can you manage paid social as well?', a: 'Yes. We can boost organic content and run full paid social campaigns under our PPC service.' },
                { q: 'How do you measure social media success?', a: 'Reach, engagement, follower growth, profile visits, link clicks, and conversions tied back to revenue when possible.' },
                { q: 'Do you respond to comments and DMs?', a: 'Yes. Community management — including comment, DM, mention, and review response — is part of our service.' },
                { q: 'How long until we see growth?', a: 'Engagement lifts in weeks; meaningful follower and revenue growth typically takes 3–6 months of consistent execution.' },
            ]}
        />
    );
}
