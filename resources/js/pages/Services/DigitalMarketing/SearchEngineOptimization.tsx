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
 * Section 1: SERP Mockup — Google search results with #1 rank highlighted
 * =========================================================================== */
const SERP_RESULTS = [
    {
        favicon: 'D', favColor: 'linear-gradient(135deg, #4f7cff, #a855f7)',
        url: 'dawkiinfotech.com', breadcrumb: '› seo-services',
        title: 'Best SEO Services in 2026 — Compounding Organic Growth | Dawki',
        desc: 'Rank higher, capture intent, and grow organic traffic. Technical SEO, content, and link building that compound — backed by white-hat practice and revenue reporting.',
        featured: true,
    },
    {
        favicon: 'A', favColor: '#94a3b8',
        url: 'agency-example.com', breadcrumb: '› services',
        title: 'SEO Services Agency — Rankings, Traffic & Leads',
        desc: 'A boutique SEO agency offering keyword research, technical SEO, and content marketing for SMB and enterprise clients across markets.',
    },
    {
        favicon: 'B', favColor: '#cbd5e1',
        url: 'bigseo.com', breadcrumb: '› what-we-do',
        title: 'BigSEO — Affordable SEO Packages Starting at $499',
        desc: 'Get monthly SEO services with content writing, link building, and reporting. Plans for small business, ecommerce, and SaaS — no contracts required.',
    },
    {
        favicon: 'C', favColor: '#e2e8f0',
        url: 'consulting-firm.com', breadcrumb: '› digital › seo',
        title: 'Enterprise SEO Consulting — Strategy & Execution',
        desc: 'Strategic SEO consulting for enterprise teams — site migrations, technical audits, content strategy, and senior advisory across 30+ industries.',
    },
    {
        favicon: 'L', favColor: '#cbd5e1',
        url: 'list-of-best.com', breadcrumb: '› top-seo-agencies-2026',
        title: 'Top 25 SEO Agencies of 2026 (Updated List)',
        desc: 'Looking for the best SEO agencies? We\'ve reviewed and ranked 25 top firms based on case studies, retention rate, and verified outcomes.',
    },
];

const SerpMockup: React.FC = () => (
    <section className="dawki-seo-serp">
        <div className="container">
            <div className="dawki-seo-serp-heading">
                <span className="dawki-seo-serp-pill">
                    <span></span>
                    SERP Snapshot
                </span>
                <h2 className="dawki-seo-serp-title">
                    Where Our Clients Land — <span>Position #1</span>
                </h2>
                <p className="dawki-seo-serp-subtitle">
                    Compounding rankings, click-through optimization, and rich-snippet eligibility — engineered into every page we ship.
                </p>
            </div>

            <motion.div
                className="dawki-seo-serp-frame"
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
            >
                <div className="dawki-seo-serp-chrome">
                    <div className="dawki-seo-serp-chrome-dots">
                        <span></span><span></span><span></span>
                    </div>
                    <div className="dawki-seo-serp-chrome-url">
                        <span className="dawki-seo-serp-chrome-url-protocol">https://</span>
                        google.com/search?q=best+seo+services+2026
                    </div>
                </div>

                <div className="dawki-seo-serp-body">
                    <div className="dawki-seo-serp-search-bar">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <span className="dawki-seo-serp-search-bar-text">
                            best seo services 2026
                            <span className="dawki-seo-serp-search-bar-cursor"></span>
                        </span>
                    </div>

                    <div className="dawki-seo-serp-meta">About 142,000,000 results (0.41 seconds)</div>

                    <motion.div
                        className="dawki-seo-serp-results"
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: '-60px' }}
                        variants={{
                            hidden: {},
                            show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
                        }}
                    >
                        {SERP_RESULTS.map((r, i) => (
                            <motion.div
                                key={i}
                                className={`dawki-seo-serp-result${r.featured ? ' dawki-seo-serp-result--featured' : ''}`}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] } },
                                }}
                            >
                                {r.featured && (
                                    <span className="dawki-seo-serp-result-rank-badge">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                                        Position #1
                                    </span>
                                )}
                                <div className="dawki-seo-serp-result-url">
                                    <span className="dawki-seo-serp-result-url-favicon" style={{ background: r.favColor as string }}>
                                        {r.favicon}
                                    </span>
                                    <span className="dawki-seo-serp-result-url-text">
                                        {r.url} {r.breadcrumb}
                                    </span>
                                </div>
                                <h3 className="dawki-seo-serp-result-title">{r.title}</h3>
                                <p className="dawki-seo-serp-result-desc">{r.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.div>
        </div>
    </section>
);

/* ===========================================================================
 * Section 2: Organic Traffic Growth Chart — area chart with milestones
 * =========================================================================== */
const TRAFFIC_POINTS = [
    { x:  60, y: 240, m: 'M0', traffic: '12K' },
    { x: 145, y: 226, m: 'M1', traffic: '18K' },
    { x: 230, y: 215, m: 'M2', traffic: '24K' },
    { x: 315, y: 205, m: 'M3', traffic: '32K' },
    { x: 400, y: 188, m: 'M4', traffic: '46K' },
    { x: 485, y: 172, m: 'M5', traffic: '64K' },
    { x: 570, y: 148, m: 'M6', traffic: '92K' },
    { x: 655, y: 124, m: 'M7', traffic: '128K' },
    { x: 740, y:  96, m: 'M8', traffic: '180K' },
    { x: 825, y:  68, m: 'M9', traffic: '252K' },
    { x: 920, y:  44, m: 'M10', traffic: '340K' },
];

const MILESTONES = [
    { idx: 1,  label: 'Technical SEO',     sub: 'Audit + Core Web Vitals' },
    { idx: 4,  label: 'Content Hub Live',  sub: 'Pillar pages launched' },
    { idx: 7,  label: 'Authority Links',   sub: 'Digital PR campaign' },
    { idx: 10, label: 'New Plateau',       sub: '340K monthly visits' },
];

const TrafficGrowthChart: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });

    // Build path string from points
    const linePath = `M ${TRAFFIC_POINTS.map(p => `${p.x} ${p.y}`).join(' L ')}`;
    const areaPath = `${linePath} L ${TRAFFIC_POINTS[TRAFFIC_POINTS.length - 1].x} 280 L ${TRAFFIC_POINTS[0].x} 280 Z`;

    const headline = useCountUp(2680, 1800, 0); // 2680% growth
    const sessions = useCountUp(340, 1800, 0);
    const keywords = useCountUp(4200, 1800, 0);
    const conversions = useCountUp(180, 1800, 0);

    return (
        <section className="dawki-seo-growth">
            <div className="container">
                <div className="dawki-seo-growth-heading">
                    <span className="dawki-seo-growth-pill">
                        <span></span>
                        Organic Growth
                    </span>
                    <h2 className="dawki-seo-growth-title">
                        Compounding Traffic, <span>Quarter Over Quarter</span>
                    </h2>
                    <p className="dawki-seo-growth-subtitle">
                        SEO is the only marketing channel that gets cheaper over time. Here's what 10 months of compounding looks like for a typical client we ship.
                    </p>
                </div>

                <div className="dawki-seo-growth-headline">
                    <span className="dawki-seo-growth-headline-value">
                        +<span ref={headline.ref}>{headline.value}</span>%
                    </span>
                    <span className="dawki-seo-growth-headline-label">Average organic traffic lift in 10 months</span>
                </div>

                <div ref={ref} className="dawki-seo-growth-frame">
                    <svg className="dawki-seo-growth-svg" viewBox="0 0 1000 320" preserveAspectRatio="none" aria-hidden="true">
                        <defs>
                            <linearGradient id="dawkiSeoAreaGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%"   stopColor="#22c55e" stopOpacity="0.55" />
                                <stop offset="60%"  stopColor="#22c55e" stopOpacity="0.10" />
                                <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient id="dawkiSeoLineGrad" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%"  stopColor="#22c55e" />
                                <stop offset="50%" stopColor="#06b6d4" />
                                <stop offset="100%" stopColor="#4f7cff" />
                            </linearGradient>
                        </defs>

                        {/* Grid lines */}
                        <g className="dawki-seo-growth-grid">
                            {[60, 130, 200, 270].map((y) => (
                                <line key={y} x1="50" y1={y} x2="950" y2={y} />
                            ))}
                        </g>

                        {/* Y-axis labels */}
                        <g>
                            <text x="40" y="64"  textAnchor="end" className="dawki-seo-growth-axis-label">340K</text>
                            <text x="40" y="134" textAnchor="end" className="dawki-seo-growth-axis-label">220K</text>
                            <text x="40" y="204" textAnchor="end" className="dawki-seo-growth-axis-label">100K</text>
                            <text x="40" y="274" textAnchor="end" className="dawki-seo-growth-axis-label">12K</text>
                        </g>

                        {/* Area fill — animates by clip-path */}
                        <motion.path
                            d={areaPath}
                            className="dawki-seo-growth-area"
                            initial={{ opacity: 0, scaleY: 0 }}
                            animate={{ opacity: inView ? 1 : 0, scaleY: inView ? 1 : 0 }}
                            transition={{ duration: 1.6, ease: [0.2, 0.8, 0.2, 1], delay: 0.6 }}
                            style={{ transformOrigin: 'bottom' }}
                        />

                        {/* Line on top */}
                        <motion.path
                            d={linePath}
                            className="dawki-seo-growth-line"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: inView ? 1 : 0 }}
                            transition={{ duration: 2.0, ease: [0.2, 0.8, 0.2, 1], delay: 0.4 }}
                        />

                        {/* Milestones */}
                        {MILESTONES.map((m, mi) => {
                            const p = TRAFFIC_POINTS[m.idx];
                            const labelAbove = mi % 2 === 0;
                            const labelY = labelAbove ? p.y - 20 : p.y + 30;
                            return (
                                <motion.g
                                    key={m.label}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0 }}
                                    transition={{ delay: 1.8 + mi * 0.2, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                                    style={{ transformOrigin: `${p.x}px ${p.y}px` }}
                                >
                                    <line
                                        x1={p.x} y1={p.y - (labelAbove ? 6 : -6)}
                                        x2={p.x} y2={labelY + (labelAbove ? 4 : -16)}
                                        className="dawki-seo-growth-milestone-line"
                                    />
                                    <circle cx={p.x} cy={p.y} r="5" className="dawki-seo-growth-milestone-dot" />
                                    <text x={p.x} y={labelY} textAnchor="middle" className="dawki-seo-growth-milestone-label">{m.label}</text>
                                    <text x={p.x} y={labelY + 12} textAnchor="middle" className="dawki-seo-growth-milestone-sub">{m.sub}</text>
                                </motion.g>
                            );
                        })}

                        {/* X-axis labels */}
                        <g>
                            {['M0','M2','M4','M6','M8','M10'].map((m, i) => (
                                <text
                                    key={m}
                                    x={60 + i * (860 / 5)}
                                    y="305"
                                    textAnchor="middle"
                                    className="dawki-seo-growth-axis-label"
                                >
                                    {m}
                                </text>
                            ))}
                        </g>
                    </svg>

                    <div className="dawki-seo-growth-captions">
                        <div className="dawki-seo-growth-caption" style={{ ['--cap-color' as string]: '#86efac' }}>
                            <span className="dawki-seo-growth-caption-eyebrow">Sessions</span>
                            <span className="dawki-seo-growth-caption-value"><span ref={sessions.ref}>{sessions.value}</span>K / mo</span>
                            <p className="dawki-seo-growth-caption-text">Up from a 12K monthly baseline at month zero.</p>
                        </div>
                        <div className="dawki-seo-growth-caption" style={{ ['--cap-color' as string]: '#67e8f9' }}>
                            <span className="dawki-seo-growth-caption-eyebrow">Ranking Keywords</span>
                            <span className="dawki-seo-growth-caption-value"><span ref={keywords.ref}>{keywords.value}</span>+</span>
                            <p className="dawki-seo-growth-caption-text">Tracked positions across head terms, long-tail, and intent variants.</p>
                        </div>
                        <div className="dawki-seo-growth-caption" style={{ ['--cap-color' as string]: '#93c5fd' }}>
                            <span className="dawki-seo-growth-caption-eyebrow">Top-3 Positions</span>
                            <span className="dawki-seo-growth-caption-value">68%</span>
                            <p className="dawki-seo-growth-caption-text">Of target keywords now sit on page 1, top 3 of Google.</p>
                        </div>
                        <div className="dawki-seo-growth-caption" style={{ ['--cap-color' as string]: '#d8b4fe' }}>
                            <span className="dawki-seo-growth-caption-eyebrow">Organic Conversions</span>
                            <span className="dawki-seo-growth-caption-value">+<span ref={conversions.ref}>{conversions.value}</span>%</span>
                            <p className="dawki-seo-growth-caption-text">Organic-sourced sign-ups, leads, and revenue — period-over-period.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

/* ===========================================================================
 * Section 3: SEO Video Showcase
 * =========================================================================== */
const SeoVideo: React.FC = () => {
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
                        Inside The SEO Lab
                    </span>
                    <h2 className="dawki-ent-video-title">
                        See How We Turn Search Intent <span>Into Pipeline</span>
                    </h2>
                    <p className="dawki-ent-video-subtitle">
                        A behind-the-scenes look at how we audit sites, build content engines, and earn authority links that actually move the rank line.
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
export default function SearchEngineOptimization() {
    return (
        <ServicePageTemplate
            pageTitle="Search Engine Optimization"
            breadcrumbCategory="Digital Marketing"
            heroPill="Digital Marketing"
            heroTitleStart="Search Engine"
            heroTitleHighlight="Optimization"
            heroSubtitle="Rank higher, capture intent, and grow organic traffic — with technical SEO, content, and link building that compounds over time."
            heroVideoSrc="/assets/images/header/demo/search.mp4"
            featuresPill="Compounding Organic Growth"
            featuresTitleStart="SEO That Wins"
            featuresTitleHighlight="The Long Game"
            featuresSubtitle="From technical foundations to topical authority — we build SEO programs that turn organic search into your most reliable growth channel."
            features={[
                { title: 'Technical SEO', desc: 'Crawlability, Core Web Vitals, schema, and site architecture done right.', icon: '⚙️' },
                { title: 'Keyword Strategy', desc: 'Intent-driven keyword research with competition, difficulty, and revenue mapping.', icon: '🔑' },
                { title: 'On-Page Optimization', desc: 'Titles, meta, internal links, and content structured for relevance and CTR.', icon: '📝' },
                { title: 'Content Hubs & Clusters', desc: 'Pillar pages and topic clusters that build topical authority over time.', icon: '🧩' },
                { title: 'Authority Link Building', desc: 'White-hat outreach, digital PR, and HARO links from authoritative domains.', icon: '🔗' },
                { title: 'Reporting & Attribution', desc: 'Rankings, traffic, conversions, and revenue tracked in clean dashboards.', icon: '📈' },
            ]}
            processSteps={[
                { n: '01', t: 'SEO Audit', d: 'Technical, on-page, off-page, and content audit to surface quick wins.' },
                { n: '02', t: 'Strategy', d: 'Keyword research, content map, and link-building plan aligned to revenue.' },
                { n: '03', t: 'Execute', d: 'Technical fixes, content production, internal linking, and authority building.' },
                { n: '04', t: 'Measure & Iterate', d: 'Monthly reporting, ranking analysis, and continuous optimization.' },
            ]}
            servicesPill="Our Capabilities"
            servicesTitleStart="SEO"
            servicesTitleHighlight="Services We Offer"
            servicesSubtitle="A full SEO practice — technical, content, off-page, and reporting — built around your revenue goals."
            servicesLayout="timeline"
            serviceCards={[
                { title: 'SEO Audit', desc: 'Comprehensive audit covering crawlability, on-page, content, links, and Core Web Vitals.', icon: ICON.eye },
                { title: 'Technical SEO', desc: 'Site architecture, schema, indexation, performance, and Core Web Vitals fixes.', icon: ICON.cog },
                { title: 'Keyword Research', desc: 'Intent-mapped keyword universe with difficulty, volume, and revenue scoring.', icon: ICON.search },
                { title: 'On-Page SEO', desc: 'Titles, metas, headings, internal links, and content structure aligned to intent.', icon: ICON.code },
                { title: 'Content Strategy & SEO Writing', desc: 'Topic clusters, briefs, and high-quality content production by SEO writers.', icon: ICON.palette },
                { title: 'Local SEO', desc: 'Google Business Profile, citations, reviews, and local landing pages for multi-location brands.', icon: ICON.home },
                { title: 'eCommerce SEO', desc: 'Category, product, and faceted-navigation optimization for Shopify, Magento, WooCommerce.', icon: ICON.box },
                { title: 'International / Multilingual SEO', desc: 'Hreflang, country targeting, and localized content for global expansion.', icon: ICON.globe },
                { title: 'Link Building & Digital PR', desc: 'White-hat outreach, guest posts, HARO, and PR-driven backlinks from authority sites.', icon: ICON.link },
                { title: 'Conversion Rate Optimization', desc: 'Landing page testing and optimization to convert organic traffic into pipeline.', icon: ICON.refresh },
                { title: 'SEO Migration Support', desc: 'Replatforming, redesigns, and domain moves done without losing rankings.', icon: ICON.shield },
                { title: 'SEO Reporting & Analytics', desc: 'GA4, GSC, Looker Studio dashboards with rankings, traffic, and revenue attribution.', icon: ICON.chart },
            ]}
            toolsTitleStart="SEO Tools &"
            toolsTitleHighlight="Platforms We Run On"
            toolsSubtitle="A purpose-built SEO stack — research, technical, content, links, analytics — operated end-to-end as a single system."
            toolsLayout="vertical"
            tools={[
                { n: 'Google Search Console', s: 'googlesearchconsole', c: '4285F4', desc: 'Source of truth for impressions, queries, and indexing — every site we run is connected here.' },
                { n: 'Google Analytics 4',    s: 'googleanalytics',    c: 'E37400', desc: 'Organic traffic, behaviour, and conversion reporting tied back to revenue.' },
                { n: 'Ahrefs',                s: 'ahrefs',             c: '003366', desc: 'Backlinks, keyword research, content gap analysis, and rank tracking — our primary SEO toolkit.' },
                { n: 'SEMrush',               s: 'semrush',            c: 'FF642D', desc: 'Competitor traffic, keyword opportunities, and SERP feature tracking across markets.' },
                { n: 'Moz Pro',               s: 'moz',                c: '1F73C5', desc: 'Domain authority, link metrics, and on-page grading — used in audits and link evaluation.' },
                { n: 'Screaming Frog',        s: 'screamingfrog',      c: '00FF41', desc: 'Site crawler — every technical audit starts here. Index bloat, broken links, schema, redirects.' },
                { n: 'Sitebulb',              s: 'sitebulb',           c: 'FF6B35', desc: 'Visual technical SEO audits with prioritized fix lists — pairs well with Screaming Frog.' },
                { n: 'Surfer SEO',            s: 'surfer',             c: '7950F2', desc: 'On-page content optimization — keyword density, structure, and SERP-driven content briefs.' },
                { n: 'Clearscope',            s: 'clearscope',         c: '4F46E5', desc: 'Content grading against top-ranking competitors — every brief and final draft scored before publish.' },
                { n: 'PageSpeed Insights',    s: 'googlepagespeedinsights', c: '4285F4', desc: 'Core Web Vitals scoring (LCP, INP, CLS) — our deploy gate for every SEO-critical page.' },
                { n: 'Schema.org',            s: 'schemadotorg',       c: 'B41E1E', desc: 'Structured data markup — Article, Product, FAQ, HowTo, BreadcrumbList — for rich-snippet eligibility.' },
                { n: 'BuzzStream',            s: 'buzzfeed',           c: 'EE3A52', desc: 'Outreach pipeline for digital PR and link building — track contacts, sequences, and reply rates.' },
                { n: 'HARO',                  s: 'haveibeenpwned',     c: '4f7cff', desc: 'Help A Reporter Out — earn authoritative editorial links by sourcing expert quotes for journalists.' },
                { n: 'Looker Studio',         s: 'looker',             c: '4285F4', desc: 'Client reporting dashboards — rankings, traffic, conversions, and revenue in one shareable view.' },
                { n: 'Hotjar',                s: 'hotjar',             c: 'FD3A5C', desc: 'Heatmaps and session recordings to fix UX issues that hurt SERP CTR and on-page engagement.' },
                { n: 'Cloudflare',            s: 'cloudflare',         c: 'F38020', desc: 'Edge caching, image optimization, and HTTP/3 — every SEO-critical site runs behind Cloudflare.' },
            ]}
            hideProjects={true}
            hideTestimonial={true}
            showClients={true}
            clientsPill="Trusted By Growth-Driven Brands"
            clientsHeading="From Local Businesses to Global SaaS,"
            clientsHeadingHighlight="We Build Compounding Search Visibility"
            extraSections={
                <>
                    <SerpMockup />
                    <TrafficGrowthChart />
                    <SeoVideo />
                </>
            }
            googleReviews={[
                {
                    name: 'Marina Petrova',
                    role: 'Head of Growth, Holst Apparel',
                    rating: 5,
                    date: '2 months ago',
                    text: 'Organic sessions 4x\'d in nine months and category-page rankings climbed across our top 25 keywords. Their content brief process is the cleanest I\'ve worked with.',
                },
                {
                    name: 'Jeremy Walsh',
                    role: 'Founder, FlowDesk SaaS',
                    rating: 5,
                    date: '4 months ago',
                    text: 'Their technical audit caught crawl waste and schema gaps our previous agency had missed for two years. Indexation jumped from 41% to 89% within six weeks.',
                },
                {
                    name: 'Aiyana Brooks',
                    role: 'Marketing Director, Coastal Realty Group',
                    rating: 5,
                    date: '6 months ago',
                    text: 'Local SEO across 38 office locations — Google Business Profiles, citations, reviews, and local pages. Phone leads up 71% in two quarters.',
                },
                {
                    name: 'Karim Saleh',
                    role: 'Head of SEO, Brightline Health',
                    rating: 5,
                    date: '3 months ago',
                    text: 'Migration support across a brand redesign + replatform — zero ranking drops. They mapped 12,000+ URL redirects and watched the index recover within ten days.',
                },
                {
                    name: 'Helena Forsberg',
                    role: 'Founder, Pinemark Outdoor',
                    rating: 5,
                    date: '5 months ago',
                    text: 'Topic-cluster strategy turned our blog from a graveyard into our highest-converting channel. Five pillars, forty-six articles, six months — and now organic outpaces paid for trial signups.',
                },
                {
                    name: 'Connor Hayes',
                    role: 'CMO, AeroPay',
                    rating: 5,
                    date: '7 months ago',
                    text: 'Digital PR + HARO program landed coverage in TechCrunch, Wired, and Forbes. The compound effect on domain authority was honestly more than we expected — DR climbed from 38 to 64.',
                },
            ]}
            googleReviewsHeading="What SEO Leaders Say About Us"
            googleReviewsSubtitle="Verified reviews from CMOs, growth leads, and SEO directors we've shipped programs with."
            faqs={[
                { q: 'What is SEO?', a: 'SEO is the practice of improving your website so search engines surface it for relevant queries — driving free, intent-driven traffic over the long term.' },
                { q: 'How long does SEO take to show results?', a: 'Initial improvements (3–4 months) come from technical fixes and quick wins. Compounding growth from content and links typically appears in 6–12 months.' },
                { q: 'Do you guarantee #1 rankings?', a: 'No reputable SEO does — search results depend on competition and algorithms. We commit to measurable improvements in rankings, traffic, and revenue.' },
                { q: 'Will SEO work for my industry?', a: 'SEO works for almost any industry where customers search. We assess opportunity in the audit and recommend SEO only when ROI is realistic.' },
                { q: 'Do you write the content too?', a: 'Yes. Our SEO writers and editors produce briefs, drafts, and final content optimized for intent and conversion.' },
                { q: 'What about Google algorithm updates?', a: 'We follow white-hat best practices, which protect rankings through updates. We also monitor and adjust quickly when changes happen.' },
                { q: 'How do you measure SEO success?', a: 'Rankings, organic traffic, conversions, and revenue from organic — reported in monthly dashboards tied to business KPIs.' },
            ]}
        />
    );
}
