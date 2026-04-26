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
 * Section 1: Ad Creative Gallery — Google Search + Meta Feed + YouTube
 * =========================================================================== */
const AdCreativeGallery: React.FC = () => (
    <section className="dawki-pad-gallery">
        <div className="container">
            <div className="dawki-pad-gallery-heading">
                <span className="dawki-pad-gallery-pill">
                    <span></span>
                    Creative That Converts
                </span>
                <h2 className="dawki-pad-gallery-title">
                    The Ads We Ship — Across <span>Every Major Channel</span>
                </h2>
                <p className="dawki-pad-gallery-subtitle">
                    Native to each platform, tested in disciplined creative cycles, and instrumented end-to-end. From Google search to TikTok pre-roll — we run it all.
                </p>
            </div>

            <motion.div
                className="dawki-pad-gallery-grid"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-60px' }}
                variants={{
                    hidden: {},
                    show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
                }}
            >
                {/* ===== Google Search Ad ===== */}
                <motion.div
                    className="dawki-pad-mockup dawki-pad-mockup--google"
                    variants={{
                        hidden: { opacity: 0, y: 30, scale: 0.95 },
                        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] } },
                    }}
                    whileHover={{ y: -8 }}
                >
                    <div className="dawki-pad-mockup-head">
                        <span className="dawki-pad-mockup-head-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M21.35 11.1H12v3.2h5.35c-.5 2.4-2.55 3.6-5.35 3.6-3.25 0-5.85-2.6-5.85-5.85S8.75 6.2 12 6.2c1.4 0 2.65.5 3.65 1.35l2.4-2.4C16.45 3.65 14.35 2.85 12 2.85 6.95 2.85 2.85 6.95 2.85 12s4.1 9.15 9.15 9.15c5.3 0 8.85-3.7 8.85-8.95 0-.55-.05-1.05-.15-1.6z" />
                            </svg>
                        </span>
                        Google Search
                    </div>
                    <div className="dawki-pad-mockup-body">
                        <div className="dawki-pad-google-search">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                            best crm software for small business
                        </div>

                        <div className="dawki-pad-google-ad">
                            <span className="dawki-pad-google-ad-tag">Sponsored</span>
                            <div className="dawki-pad-google-ad-url">
                                <span className="dawki-pad-google-ad-url-favicon">D</span>
                                dawkicrm.com › features
                            </div>
                            <h3 className="dawki-pad-google-ad-title">Dawki CRM — Run Your Sales Team in One Place</h3>
                            <p className="dawki-pad-google-ad-desc">
                                Built-in dialer, role-based access, real-time dashboards, and automated follow-ups. Free 14-day trial. No credit card required.
                            </p>
                            <div className="dawki-pad-google-ad-sitelinks">
                                <span className="dawki-pad-google-ad-sitelink">Pricing</span>
                                <span className="dawki-pad-google-ad-sitelink">Features</span>
                                <span className="dawki-pad-google-ad-sitelink">Customers</span>
                                <span className="dawki-pad-google-ad-sitelink">Free Trial</span>
                            </div>
                        </div>

                        <div className="dawki-pad-google-organic">
                            <span style={{ fontWeight: 600 }}>3 Best CRM Software in 2026 — Comparison …</span><br />
                            Compare features, pricing, and reviews of the top CRM platforms…
                        </div>
                    </div>
                </motion.div>

                {/* ===== Meta Feed Ad ===== */}
                <motion.div
                    className="dawki-pad-mockup dawki-pad-mockup--meta"
                    variants={{
                        hidden: { opacity: 0, y: 30, scale: 0.95 },
                        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] } },
                    }}
                    whileHover={{ y: -8 }}
                >
                    <div className="dawki-pad-mockup-head">
                        <span className="dawki-pad-mockup-head-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                            </svg>
                        </span>
                        Meta Feed
                    </div>
                    <div className="dawki-pad-mockup-body">
                        <div className="dawki-pad-meta-card-header">
                            <div className="dawki-pad-meta-avatar"></div>
                            <div className="dawki-pad-meta-meta">
                                <span className="dawki-pad-meta-name">Northsail Travel</span>
                                <span className="dawki-pad-meta-sponsored">
                                    Sponsored ·
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                                </span>
                            </div>
                        </div>

                        <p className="dawki-pad-meta-text">
                            Skip the airport queues this winter. Hand-picked Mediterranean cruises from $799 — book by Friday and get a free cabin upgrade.
                        </p>

                        <div className="dawki-pad-meta-image">
                            <span className="dawki-pad-meta-image-badge">7-night Mediterranean</span>
                        </div>

                        <div className="dawki-pad-meta-cta">
                            <div>
                                <div style={{ fontSize: 11, color: '#65676B', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 2 }}>NORTHSAIL.CO</div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: '#050505' }}>From $799 — Cabins Filling Fast</div>
                            </div>
                            <span className="dawki-pad-meta-cta-btn">Book Now</span>
                        </div>

                        <div className="dawki-pad-meta-actions">
                            <span>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 9V5a3 3 0 0 0-6 0v4H5l-1 14h16l-1-14h-3z" /></svg>
                                Like
                            </span>
                            <span>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                Comment
                            </span>
                            <span>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
                                Share
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* ===== YouTube Preroll ===== */}
                <motion.div
                    className="dawki-pad-mockup dawki-pad-mockup--youtube"
                    variants={{
                        hidden: { opacity: 0, y: 30, scale: 0.95 },
                        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] } },
                    }}
                    whileHover={{ y: -8 }}
                >
                    <div className="dawki-pad-mockup-head">
                        <span className="dawki-pad-mockup-head-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M23.5 6.2c-.3-1-1-1.8-2-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.5.6c-1 .3-1.7 1.1-2 2.1C0 8.2 0 12 0 12s0 3.8.5 5.8c.3 1 1 1.8 2 2.1 2 .6 9.5.6 9.5.6s7.5 0 9.5-.6c1-.3 1.7-1.1 2-2.1.5-2 .5-5.8.5-5.8s0-3.8-.5-5.8zM9.6 15.5V8.5L15.8 12l-6.2 3.5z" />
                            </svg>
                        </span>
                        YouTube Pre-roll
                    </div>
                    <div className="dawki-pad-mockup-body">
                        <div className="dawki-pad-youtube-player">
                            <span className="dawki-pad-youtube-tag">AD · 0:15</span>
                            <button className="dawki-pad-youtube-play" aria-label="Play">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </button>
                            <div className="dawki-pad-youtube-skip">
                                Skip Ad
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <polygon points="5 4 15 12 5 20 5 4" />
                                    <rect x="17" y="4" width="2" height="16" />
                                </svg>
                            </div>
                            <div className="dawki-pad-youtube-progress"></div>
                        </div>

                        <div className="dawki-pad-youtube-info">
                            <div className="dawki-pad-youtube-channel-avatar"></div>
                            <div className="dawki-pad-youtube-meta">
                                <h3 className="dawki-pad-youtube-title">AI Grow — How To Run Bulk WhatsApp Campaigns Without Burning Your Number</h3>
                                <span className="dawki-pad-youtube-channel">AI Grow · 2.4K views · Sponsored</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    </section>
);

/* ===========================================================================
 * Section 2: Multi-Platform Performance Strip — sparkline cards per channel
 * =========================================================================== */
type PlatformPerf = {
    code: string;
    name: string;
    grad: string;
    accent: string;
    points: number[]; // sparkline values
    roas: number;
    rows: { k: string; v: string }[];
};

const PLATFORMS: PlatformPerf[] = [
    {
        code: 'G',
        name: 'Google Ads',
        grad: 'linear-gradient(135deg, #4285F4 0%, #34A853 100%)',
        accent: '#34A853',
        points: [22, 30, 28, 38, 42, 50, 58, 66, 72, 80],
        roas: 5.8,
        rows: [
            { k: 'Spend',  v: '$48K' },
            { k: 'CTR',    v: '6.1%' },
            { k: 'CPA',    v: '$24' },
        ],
    },
    {
        code: 'M',
        name: 'Meta Ads',
        grad: 'linear-gradient(135deg, #0866FF 0%, #1877F2 100%)',
        accent: '#1877F2',
        points: [40, 36, 42, 50, 48, 60, 68, 74, 70, 82],
        roas: 4.4,
        rows: [
            { k: 'Spend',  v: '$36K' },
            { k: 'CTR',    v: '3.4%' },
            { k: 'CPA',    v: '$31' },
        ],
    },
    {
        code: 'L',
        name: 'LinkedIn Ads',
        grad: 'linear-gradient(135deg, #0A66C2 0%, #0073B1 100%)',
        accent: '#0A66C2',
        points: [12, 18, 22, 28, 34, 40, 48, 50, 56, 62],
        roas: 3.9,
        rows: [
            { k: 'Spend',  v: '$22K' },
            { k: 'CTR',    v: '1.9%' },
            { k: 'CPA',    v: '$96' },
        ],
    },
    {
        code: 'T',
        name: 'TikTok Ads',
        grad: 'linear-gradient(135deg, #25F4EE 0%, #FE2C55 100%)',
        accent: '#FE2C55',
        points: [8, 14, 18, 30, 38, 32, 46, 58, 64, 70],
        roas: 4.7,
        rows: [
            { k: 'Spend',  v: '$18K' },
            { k: 'CTR',    v: '4.8%' },
            { k: 'CPA',    v: '$22' },
        ],
    },
    {
        code: 'Y',
        name: 'YouTube Ads',
        grad: 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)',
        accent: '#FF0000',
        points: [16, 20, 22, 28, 32, 30, 38, 44, 52, 58],
        roas: 3.4,
        rows: [
            { k: 'Spend',  v: '$14K' },
            { k: 'CTR',    v: '2.6%' },
            { k: 'CPA',    v: '$42' },
        ],
    },
];

const Sparkline: React.FC<{ points: number[]; color: string }> = ({ points, color }) => {
    const ref = useRef<SVGSVGElement>(null);
    const inView = useInView(ref, { once: true, margin: '-40px' });
    const W = 200;
    const H = 60;
    const max = Math.max(...points);
    const min = Math.min(...points);
    const range = max - min || 1;
    const stepX = W / (points.length - 1);
    const path = points
        .map((p, i) => {
            const x = i * stepX;
            const y = H - 6 - ((p - min) / range) * (H - 12);
            return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
        })
        .join(' ');
    const lastX = (points.length - 1) * stepX;
    const lastY = H - 6 - ((points[points.length - 1] - min) / range) * (H - 12);
    const areaPath = `${path} L ${lastX} ${H} L 0 ${H} Z`;

    return (
        <svg ref={ref} className="dawki-pad-perf-spark" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
            <defs>
                <linearGradient id={`spark-area-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"  stopColor={color} stopOpacity="0.45" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <motion.path
                d={areaPath}
                fill={`url(#spark-area-${color.replace('#', '')})`}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: inView ? 1 : 0, scaleY: inView ? 1 : 0 }}
                transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1], delay: 0.5 }}
                style={{ transformOrigin: 'bottom' }}
            />
            <motion.path
                d={path}
                fill="none"
                stroke={color}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: inView ? 1 : 0 }}
                transition={{ duration: 1.4, ease: [0.2, 0.8, 0.2, 1], delay: 0.3 }}
                style={{ filter: `drop-shadow(0 0 4px ${color})` }}
            />
            <motion.circle
                cx={lastX} cy={lastY} r="3"
                fill="#ffffff"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0 }}
                transition={{ delay: 1.4, duration: 0.4 }}
                style={{ filter: `drop-shadow(0 0 6px ${color})` }}
            />
        </svg>
    );
};

const PlatformCard: React.FC<{ platform: PlatformPerf; index: number }> = ({ platform, index }) => {
    const roas = useCountUp(platform.roas, 1500, 1);

    return (
        <motion.div
            className="dawki-pad-perf-card"
            style={{ ['--p-grad' as string]: platform.grad, ['--p-accent' as string]: platform.accent }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: index * 0.1, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        >
            <div className="dawki-pad-perf-card-head">
                <span className="dawki-pad-perf-card-logo">{platform.code}</span>
                <div className="dawki-pad-perf-card-meta">
                    <div className="dawki-pad-perf-card-name">{platform.name}</div>
                    <span className="dawki-pad-perf-card-status">Live · pacing on</span>
                </div>
            </div>

            <Sparkline points={platform.points} color={platform.accent} />

            <div className="dawki-pad-perf-card-roas">
                <span ref={roas.ref}>{roas.value}</span>
                <span className="dawki-pad-perf-card-roas-x">×</span>
            </div>
            <div className="dawki-pad-perf-card-roas-label">Avg ROAS</div>

            <div className="dawki-pad-perf-card-rows">
                {platform.rows.map((r) => (
                    <div key={r.k} className="dawki-pad-perf-card-row">
                        <span className="dawki-pad-perf-card-row-key">{r.k}</span>
                        <span className="dawki-pad-perf-card-row-val">{r.v}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

const PlatformPerformanceStrip: React.FC = () => (
    <section className="dawki-pad-perf">
        <div className="container">
            <div className="dawki-pad-perf-heading">
                <span className="dawki-pad-perf-pill">
                    <span></span>
                    Live Performance
                </span>
                <h2 className="dawki-pad-perf-title">
                    Every Platform, <span>Tracked Like Pipeline</span>
                </h2>
                <p className="dawki-pad-perf-subtitle">
                    A composite snapshot from a recent quarter — five paid channels, instrumented end-to-end, reported in a single pane every Monday.
                </p>
            </div>

            <div className="dawki-pad-perf-strip">
                {PLATFORMS.map((p, i) => (
                    <PlatformCard key={p.name} platform={p} index={i} />
                ))}
            </div>
        </div>
    </section>
);

/* ===========================================================================
 * Section 3: Paid Ads Video Showcase
 * =========================================================================== */
const PaidAdsVideo: React.FC = () => {
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
                        Inside The Ad Account
                    </span>
                    <h2 className="dawki-ent-video-title">
                        See How We Run <span>Profitable Paid Media</span>
                    </h2>
                    <p className="dawki-ent-video-subtitle">
                        A behind-the-scenes look at how we plan creative, structure campaigns, and optimize spend across five platforms — all while keeping CAC honest.
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
export default function PaidAdCampaigns() {
    return (
        <ServicePageTemplate
            pageTitle="Paid Ad Campaigns (PPC)"
            breadcrumbCategory="Digital Marketing"
            heroPill="Digital Marketing"
            heroTitleStart="Paid Ad Campaigns"
            heroTitleHighlight="(PPC)"
            heroSubtitle="Performance-driven paid media — Google Ads, Meta, LinkedIn, TikTok — built to lower CAC and scale revenue profitably."
            heroVideoSrc="/assets/images/header/demo/adv.mp4"
            featuresPill="Performance Marketing"
            featuresTitleStart="Paid Media That"
            featuresTitleHighlight="Pays for Itself"
            featuresSubtitle="From small-budget tests to enterprise spend — we run paid programs that drive qualified pipeline at predictable economics."
            features={[
                { title: 'Cross-Channel Strategy', desc: 'Right channel mix across Google, Meta, LinkedIn, TikTok, YouTube, and programmatic.', icon: '🎯' },
                { title: 'Conversion-First Creative', desc: 'Hooks, scripts, statics, and video that win the auction and the click.', icon: '🎬' },
                { title: 'Audience & Bid Engineering', desc: 'Tested audiences, exclusions, and bid strategies tuned weekly.', icon: '🤖' },
                { title: 'Landing Page Optimization', desc: 'Match-message landers and A/B testing for higher conversion rates.', icon: '🛬' },
                { title: 'Server-Side Tracking', desc: 'GA4, GTM Server, CAPI — clean data despite cookie loss and iOS changes.', icon: '📡' },
                { title: 'ROI Reporting', desc: 'Pipeline, CAC, ROAS, and incrementality reporting — not vanity metrics.', icon: '📈' },
            ]}
            processSteps={[
                { n: '01', t: 'Audit & Strategy', d: 'Account audit, channel selection, creative angles, and budget plan.' },
                { n: '02', t: 'Build & Launch', d: 'Tracking, audiences, creative, landers, and campaign architecture.' },
                { n: '03', t: 'Optimize', d: 'Daily/weekly bid, audience, and creative iteration based on data.' },
                { n: '04', t: 'Scale', d: 'Expand winning channels, segments, and geos while protecting CAC.' },
            ]}
            servicesPill="Our Capabilities"
            servicesTitleStart="Paid Ad"
            servicesTitleHighlight="Services We Offer"
            servicesSubtitle="A full performance media practice — strategy, creative, tracking, optimization, and scale."
            servicesLayout="timeline"
            serviceCards={[
                { title: 'Google Ads (Search & Performance Max)', desc: 'High-intent search, P-Max, and shopping campaigns optimized for ROAS.', icon: ICON.search },
                { title: 'Meta Ads (Facebook & Instagram)', desc: 'Prospecting and retargeting on Meta with tested creative and CAPI tracking.', icon: ICON.megaphone },
                { title: 'LinkedIn Ads', desc: 'B2B campaigns targeting account lists, job titles, and intent signals.', icon: ICON.users },
                { title: 'TikTok Ads', desc: 'Native, short-form video ads built for TikTok-first conversion.', icon: ICON.rocket },
                { title: 'YouTube Ads', desc: 'In-stream, shorts, and demand-gen video campaigns for awareness and conversion.', icon: ICON.eye },
                { title: 'Display & Programmatic', desc: 'Display, native, and CTV via DV360 and programmatic DSPs.', icon: ICON.globe },
                { title: 'Retargeting & Audience Building', desc: 'CRM, pixel, and lookalike audiences across networks for full-funnel retargeting.', icon: ICON.target },
                { title: 'Landing Page & CRO', desc: 'High-converting landing pages and A/B testing for paid traffic.', icon: ICON.palette },
                { title: 'Conversion Tracking Setup', desc: 'GA4, GTM, server-side tracking, Meta CAPI, and offline conversion uploads.', icon: ICON.cog },
                { title: 'Ad Creative Production', desc: 'Static, motion, and video ad creative built for each channel and tested at scale.', icon: ICON.box },
                { title: 'eCommerce PPC', desc: 'Shopping feeds, P-Max, Meta DPA, and Klaviyo flows tuned for ROAS.', icon: ICON.chart },
                { title: 'Paid Media Reporting', desc: 'Looker Studio dashboards with spend, CAC, ROAS, pipeline, and incrementality.', icon: ICON.headset },
            ]}
            toolsTitleStart="Ad Platforms &"
            toolsTitleHighlight="Tools We Run On"
            toolsSubtitle="A purpose-built paid-media stack — auction platforms, tracking, creative, and reporting — operated end-to-end."
            toolsLayout="vertical"
            tools={[
                { n: 'Google Ads',         s: 'googleads',        c: '4285F4', desc: 'Search, Performance Max, Shopping, and YouTube — our default volume engine for intent-driven traffic.' },
                { n: 'Meta Ads Manager',   s: 'meta',             c: '0467DF', desc: 'Facebook + Instagram prospecting, retargeting, and Advantage+ — paired with CAPI for clean tracking.' },
                { n: 'LinkedIn Campaign Manager', s: 'linkedin',  c: '0A66C2', desc: 'B2B account-based marketing — sponsored content, message ads, and matched-audience retargeting.' },
                { n: 'TikTok Ads Manager', s: 'tiktok',           c: '000000', desc: 'Spark Ads, brand effects, and creator partnerships — where consumer brands win attention in 2026.' },
                { n: 'YouTube Ads',        s: 'youtube',          c: 'FF0000', desc: 'Pre-roll, bumper, in-feed, and demand-gen — full-funnel video on the world\'s largest video platform.' },
                { n: 'Microsoft Ads',      s: 'microsoftbing',    c: '008373', desc: 'Bing search ads — often the cheapest CPCs you\'ll find, especially for B2B and finance.' },
                { n: 'Reddit Ads',         s: 'reddit',           c: 'FF4500', desc: 'Niche-community advertising — incredible CPMs for prosumer SaaS, gaming, and crypto audiences.' },
                { n: 'Pinterest Ads',      s: 'pinterest',        c: 'BD081C', desc: 'Visual-discovery ads for DTC, home, fashion, food, and weddings — long-tail intent at low CPCs.' },
                { n: 'DV360',              s: 'google',           c: '4285F4', desc: 'Programmatic display, native, and CTV — premium inventory and audience-based buys at enterprise scale.' },
                { n: 'Google Tag Manager', s: 'googletagmanager', c: '246FDB', desc: 'Centralized tag deployment and server-side tracking — the foundation of every clean attribution stack.' },
                { n: 'Google Analytics 4', s: 'googleanalytics',  c: 'E37400', desc: 'Source of truth for traffic, events, audiences, and funnel reporting across every property we run.' },
                { n: 'Looker Studio',      s: 'looker',           c: '4285F4', desc: 'Client reporting dashboards — spend, CAC, ROAS, pipeline, and revenue in one shareable view.' },
                { n: 'Hotjar',             s: 'hotjar',           c: 'FD3A5C', desc: 'Heatmaps and session recordings on landers — qualitative data that fuels our CRO roadmap.' },
                { n: 'Unbounce',           s: 'unbounce',         c: 'FF7B49', desc: 'High-converting landing pages — A/B tests, dynamic text replacement, and Smart Traffic on autopilot.' },
                { n: 'Canva',              s: 'canva',            c: '00C4CC', desc: 'Fast collaborative creative — campaign visuals, social variants, and brand-kit-locked templates.' },
                { n: 'Klaviyo',            s: 'klaviyo',          c: '000000', desc: 'DTC email + SMS — Shopify-native segmentation, flows, and retention revenue paired with paid.' },
            ]}
            hideProjects={true}
            hideTestimonial={true}
            showClients={true}
            clientsPill="Trusted By Performance Teams"
            clientsHeading="From Bootstrapped DTC to Enterprise B2B,"
            clientsHeadingHighlight="We Run Paid Media That Pays Off"
            extraSections={
                <>
                    <AdCreativeGallery />
                    <PlatformPerformanceStrip />
                    <PaidAdsVideo />
                </>
            }
            googleReviews={[
                {
                    name: 'Bryce Calderon',
                    role: 'Head of Growth, Holst Apparel',
                    rating: 5,
                    date: '2 months ago',
                    text: 'Blended ROAS climbed from 2.4× to 5.1× across Google + Meta in one quarter. Their creative testing rhythm — ten new concepts every two weeks — is the reason it worked.',
                },
                {
                    name: 'Imogen Walsh',
                    role: 'CMO, Cordwell SaaS',
                    rating: 5,
                    date: '4 months ago',
                    text: 'B2B LinkedIn account-based program with paired Google retargeting — pipeline up 3.4× in six months and our CAC payback dropped to under nine months.',
                },
                {
                    name: 'Dimitri Volkov',
                    role: 'Founder, Liminal Coffee',
                    rating: 5,
                    date: '6 months ago',
                    text: 'TikTok Spark Ads with our top creators delivered $1.40 CPCs on average. We had to slow-pace the budget twice to keep up with fulfillment.',
                },
                {
                    name: 'Aoife Brennan',
                    role: 'Director of Marketing, FinFleet',
                    rating: 5,
                    date: '3 months ago',
                    text: 'Server-side GTM + Meta CAPI + GA4 — the cleanest attribution stack I\'ve worked with. Cookie loss didn\'t move our reported numbers more than 2%.',
                },
                {
                    name: 'Caleb Reyes',
                    role: 'Performance Lead, Northsail Travel',
                    rating: 5,
                    date: '5 months ago',
                    text: 'Performance Max + DPA retargeting + a video pre-roll layer. Booked revenue up 80% YoY at flat CAC. Their landing-page work alone earned its keep.',
                },
                {
                    name: 'Naima Suleiman',
                    role: 'CEO, Pinemark Outdoor',
                    rating: 5,
                    date: '7 months ago',
                    text: 'They told us to pause one of our highest-spend campaigns because incrementality was zero — and they were right. That kind of honesty is rare in performance agencies.',
                },
            ]}
            googleReviewsHeading="What Performance Teams Say About Us"
            googleReviewsSubtitle="Verified reviews from CMOs, growth leads, and performance directors we've shipped paid programs with."
            faqs={[
                { q: 'What is PPC?', a: 'Pay-per-click advertising means you pay only when someone clicks your ad — across search, social, and display. It buys instant visibility and qualified traffic.' },
                { q: 'Which platforms should I advertise on?', a: 'It depends on your audience. B2C usually leans Google + Meta + TikTok. B2B leans Google + LinkedIn + select Meta. We recommend the mix in our audit.' },
                { q: 'How much should I spend on PPC?', a: 'Enough to gather statistically meaningful data on each channel — typically $3–10K/month per channel to start. We help right-size budget to goals.' },
                { q: 'Do you produce ad creative?', a: 'Yes. Our team produces statics, motion, and video creative tailored per channel and tested in disciplined creative cycles.' },
                { q: 'How do you handle iOS 14+ tracking issues?', a: 'We deploy server-side tracking (GTM Server, Meta CAPI, GA4 server-side) and offline conversion uploads to keep data quality high.' },
                { q: 'How soon will I see results?', a: 'Search ads can drive conversions in days. Social usually takes 2–4 weeks of testing before settling into scaled, profitable campaigns.' },
                { q: 'How do you report on performance?', a: 'Weekly summaries plus a live Looker Studio dashboard tracking spend, CAC, ROAS, pipeline, and revenue.' },
            ]}
        />
    );
}
