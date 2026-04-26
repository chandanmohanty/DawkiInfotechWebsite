import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import ServicePageTemplate, { ICON } from '@/components/ServicePageTemplate';

/* ===========================================================================
 * Section 1: Channel Mix Donut — animated SVG donut with channel allocation
 * =========================================================================== */
const CHANNELS = [
    { name: 'Paid Acquisition', pct: 28, color: '#4f7cff', desc: 'Google Ads, Meta, LinkedIn — pay only where ROAS is proven.' },
    { name: 'SEO & Content',    pct: 22, color: '#06b6d4', desc: 'Compounding organic traffic and topical authority.' },
    { name: 'Email Lifecycle',  pct: 16, color: '#a855f7', desc: 'Nurture, lifecycle, and reactivation flows that lift LTV.' },
    { name: 'Social & Community', pct: 14, color: '#ec4899', desc: 'Owned social, creator partnerships, and community building.' },
    { name: 'Partnerships & PR', pct: 12, color: '#f97316', desc: 'Co-marketing, integrations, and earned-media placement.' },
    { name: 'Brand & Events',    pct:  8, color: '#22c55e', desc: 'Brand campaigns, podcasts, conferences — long-term equity.' },
];

const ChannelMixDonut: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });

    const r = 80;
    const circ = 2 * Math.PI * r;
    let runningOffset = 0;

    return (
        <section className="dawki-mkt-donut">
            <div className="container">
                <div className="dawki-mkt-donut-heading">
                    <span className="dawki-mkt-donut-pill">
                        <span></span>
                        Channel Mix
                    </span>
                    <h2 className="dawki-mkt-donut-title">
                        Budget Allocated to <span>Channels That Convert</span>
                    </h2>
                    <p className="dawki-mkt-donut-subtitle">
                        Every marketing dollar mapped to the channel that earns it back. We rebalance quarterly based on attribution, ROAS, and what's actually working.
                    </p>
                </div>

                <div ref={ref} className="dawki-mkt-donut-grid">
                    <div className="dawki-mkt-donut-canvas">
                        <svg className="dawki-mkt-donut-svg" viewBox="0 0 200 200" aria-hidden="true">
                            <g transform="rotate(-90 100 100)">
                                {/* Track ring */}
                                <circle cx="100" cy="100" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="22" />
                                {CHANNELS.map((c) => {
                                    const len = (c.pct / 100) * circ;
                                    const segment = (
                                        <motion.circle
                                            key={c.name}
                                            cx="100" cy="100" r={r}
                                            fill="none"
                                            stroke={c.color}
                                            strokeWidth="22"
                                            strokeLinecap="butt"
                                            strokeDasharray={`${len - 1.6} ${circ}`}
                                            strokeDashoffset={-runningOffset}
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                                            transition={{ duration: 0.9, delay: runningOffset / circ * 1.2, ease: [0.2, 0.8, 0.2, 1] }}
                                        />
                                    );
                                    runningOffset += len;
                                    return segment;
                                })}
                            </g>
                        </svg>

                        <div className="dawki-mkt-donut-center">
                            <span className="dawki-mkt-donut-center-eyebrow">Avg ROAS</span>
                            <span className="dawki-mkt-donut-center-value">4.6×</span>
                            <span className="dawki-mkt-donut-center-label">Across portfolio</span>
                        </div>
                    </div>

                    <motion.div
                        className="dawki-mkt-donut-legend"
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: '-60px' }}
                        variants={{
                            hidden: {},
                            show: { transition: { staggerChildren: 0.08, delayChildren: 0.4 } },
                        }}
                    >
                        {CHANNELS.map((c) => (
                            <motion.div
                                key={c.name}
                                className="dawki-mkt-donut-legend-row"
                                style={{ ['--seg-color' as string]: c.color }}
                                variants={{
                                    hidden: { opacity: 0, x: 30 },
                                    show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] } },
                                }}
                            >
                                <span className="dawki-mkt-donut-legend-dot" aria-hidden="true"></span>
                                <div className="dawki-mkt-donut-legend-content">
                                    <div className="dawki-mkt-donut-legend-name">{c.name}</div>
                                    <div className="dawki-mkt-donut-legend-desc">{c.desc}</div>
                                </div>
                                <span className="dawki-mkt-donut-legend-pct">{c.pct}%</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

/* ===========================================================================
 * Section 2: Customer Journey Curve — wavy SVG path with 5 stages
 * =========================================================================== */
const JOURNEY_STAGES = [
    {
        name: 'Awareness',
        metric: 'CTR · Impressions',
        desc: 'First impression — a search result, an ad, a creator, a referral.',
        a: '#ec4899', b: '#f97316', glow: 'rgba(236, 72, 153, 0.55)',
        bg: 'rgba(236, 72, 153, 0.12)', border: 'rgba(236, 72, 153, 0.30)',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
            </svg>
        ),
    },
    {
        name: 'Consideration',
        metric: 'Engagement Time',
        desc: 'They visit, compare, read, watch — your content has to win the deliberation.',
        a: '#a855f7', b: '#ec4899', glow: 'rgba(168, 85, 247, 0.55)',
        bg: 'rgba(168, 85, 247, 0.12)', border: 'rgba(168, 85, 247, 0.30)',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
        ),
    },
    {
        name: 'Decision',
        metric: 'Conversion Rate',
        desc: 'They click buy, sign up, or schedule — friction here costs you the most.',
        a: '#6366f1', b: '#a855f7', glow: 'rgba(99, 102, 241, 0.55)',
        bg: 'rgba(99, 102, 241, 0.12)', border: 'rgba(99, 102, 241, 0.30)',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
            </svg>
        ),
    },
    {
        name: 'Retention',
        metric: 'NPS · Repeat Rate',
        desc: 'Lifecycle nurture, support, and product education to compound LTV.',
        a: '#06b6d4', b: '#4f7cff', glow: 'rgba(6, 182, 212, 0.55)',
        bg: 'rgba(6, 182, 212, 0.12)', border: 'rgba(6, 182, 212, 0.30)',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
        ),
    },
    {
        name: 'Advocacy',
        metric: 'Referral · Reviews',
        desc: 'Customers become the channel — referrals, testimonials, and word of mouth.',
        a: '#22c55e', b: '#06b6d4', glow: 'rgba(34, 197, 94, 0.55)',
        bg: 'rgba(34, 197, 94, 0.12)', border: 'rgba(34, 197, 94, 0.30)',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 11l18-5v12L3 14v-3z" />
                <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
            </svg>
        ),
    },
];

const CustomerJourneyCurve: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section className="dawki-mkt-journey">
            <div className="container">
                <div className="dawki-mkt-journey-heading">
                    <span className="dawki-mkt-journey-pill">
                        <span></span>
                        Customer Journey
                    </span>
                    <h2 className="dawki-mkt-journey-title">
                        From First Click to <span>Lifelong Advocate</span>
                    </h2>
                    <p className="dawki-mkt-journey-subtitle">
                        Marketing isn't a campaign — it's a journey. We design every stage to reduce friction, raise NPS, and turn customers into your best growth channel.
                    </p>
                </div>

                <div ref={ref} className="dawki-mkt-journey-canvas">
                    <svg className="dawki-mkt-journey-curve" viewBox="0 0 1000 220" aria-hidden="true" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="dawkiMktJourneyGrad" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%"  stopColor="#ec4899" />
                                <stop offset="35%" stopColor="#a855f7" />
                                <stop offset="65%" stopColor="#06b6d4" />
                                <stop offset="100%" stopColor="#22c55e" />
                            </linearGradient>
                        </defs>
                        <motion.path
                            d="M 60 110 Q 175 30 290 110 Q 405 190 520 110 Q 635 30 750 110 Q 865 190 940 110"
                            fill="none"
                            stroke="url(#dawkiMktJourneyGrad)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: inView ? 1 : 0 }}
                            transition={{ duration: 1.8, ease: [0.2, 0.8, 0.2, 1] }}
                            style={{ filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.6))' }}
                        />
                        {/* Stage anchor dots on curve */}
                        {[60, 290, 520, 750, 940].map((cx, i) => (
                            <motion.circle
                                key={i}
                                cx={cx} cy="110" r="6"
                                fill="#ffffff"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0 }}
                                transition={{ delay: 1.2 + i * 0.12, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                                style={{ filter: 'drop-shadow(0 0 8px #ffffff)' }}
                            />
                        ))}
                    </svg>

                    <div className="dawki-mkt-journey-stages">
                        {JOURNEY_STAGES.map((s, i) => (
                            <motion.div
                                key={s.name}
                                className="dawki-mkt-journey-stage"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-60px' }}
                                transition={{ delay: i * 0.14, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                            >
                                <div
                                    className="dawki-mkt-journey-bubble"
                                    style={{
                                        ['--st-a' as string]: s.a,
                                        ['--st-b' as string]: s.b,
                                        ['--st-glow' as string]: s.glow,
                                    }}
                                >
                                    {s.icon}
                                </div>
                                <h3 className="dawki-mkt-journey-stage-name">{s.name}</h3>
                                <span
                                    className="dawki-mkt-journey-stage-metric"
                                    style={{
                                        ['--st-bg' as string]: s.bg,
                                        ['--st-border' as string]: s.border,
                                        ['--st-b' as string]: s.b,
                                    }}
                                >
                                    {s.metric}
                                </span>
                                <p className="dawki-mkt-journey-stage-desc">{s.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

/* ===========================================================================
 * Section 3: Marketing Video Showcase
 * =========================================================================== */
const MarketingVideo: React.FC = () => {
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
                        Inside The Strategy Room
                    </span>
                    <h2 className="dawki-ent-video-title">
                        See How We Turn Insight <span>Into Pipeline</span>
                    </h2>
                    <p className="dawki-ent-video-subtitle">
                        A behind-the-scenes look at how we audit brands, build positioning, and ship marketing programs that move the revenue line.
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
export default function MarketingStrategy() {
    return (
        <ServicePageTemplate
            pageTitle="Marketing Strategy"
            breadcrumbCategory="Digital Marketing"
            heroPill="Digital Marketing"
            heroTitleStart="Marketing"
            heroTitleHighlight="Strategy"
            heroSubtitle="Data-driven marketing strategy that aligns brand, channels, and budget to predictable revenue growth."
            heroVideoSrc="/assets/images/header/demo/marketing_strategy.mp4"
            featuresPill="Strategy First"
            featuresTitleStart="Marketing That"
            featuresTitleHighlight="Drives Growth"
            featuresSubtitle="From positioning to go-to-market — we build marketing strategies grounded in data, customer insight, and ROI."
            features={[
                { title: 'Market Research', desc: 'Deep market, competitor, and customer research that surfaces real opportunities.', icon: '📊' },
                { title: 'Brand Positioning', desc: 'Sharp positioning, messaging, and value props that cut through the noise.', icon: '🎯' },
                { title: 'Customer Personas', desc: 'Research-backed personas, ICPs, and buyer journeys to focus every campaign.', icon: '👥' },
                { title: 'Channel Mix Planning', desc: 'Right channels, right budget — SEO, paid, content, social, email, partnerships.', icon: '📡' },
                { title: 'KPI & Attribution', desc: 'Funnel metrics, multi-touch attribution, and dashboards that prove ROI.', icon: '📈' },
                { title: 'Roadmap & Execution', desc: 'Quarterly OKRs, campaign calendars, and clear ownership across teams.', icon: '🗺️' },
            ]}
            processSteps={[
                { n: '01', t: 'Audit & Research', d: 'Brand, market, competitor, and analytics audit to find growth levers.' },
                { n: '02', t: 'Strategy', d: 'Positioning, ICP, channel mix, budget, and KPI framework.' },
                { n: '03', t: 'Plan & Activate', d: 'Quarterly roadmap, campaign briefs, and team enablement.' },
                { n: '04', t: 'Measure & Optimize', d: 'Continuous experimentation, reporting, and quarterly refresh.' },
            ]}
            servicesPill="Our Capabilities"
            servicesTitleStart="Marketing Strategy"
            servicesTitleHighlight="Services We Offer"
            servicesSubtitle="From strategy and positioning to execution support — a partner for every stage of marketing growth."
            servicesLayout="timeline"
            serviceCards={[
                { title: 'Marketing Audit', desc: 'Full-funnel audit of brand, channels, content, analytics, and conversion paths.', icon: ICON.eye },
                { title: 'Market & Competitor Research', desc: 'Quantitative and qualitative research that uncovers segments, gaps, and threats.', icon: ICON.search },
                { title: 'Brand Strategy & Positioning', desc: 'Positioning, value props, brand pillars, and messaging frameworks.', icon: ICON.target },
                { title: 'Customer Persona Development', desc: 'Data-backed ICPs, personas, and journey maps to focus marketing investment.', icon: ICON.users },
                { title: 'Go-to-Market Strategy', desc: 'Launch playbooks for new products, markets, or pricing models.', icon: ICON.rocket },
                { title: 'Content Marketing Strategy', desc: 'Editorial strategy, content pillars, SEO topics, and distribution plans.', icon: ICON.palette },
                { title: 'Channel Strategy', desc: 'Right mix across SEO, paid, social, email, partnerships, and PR — budgeted by ROI.', icon: ICON.megaphone },
                { title: 'Pricing & Positioning', desc: 'Pricing research, packaging design, and competitive positioning recommendations.', icon: ICON.chart },
                { title: 'Marketing Analytics & Attribution', desc: 'Tracking, dashboards, multi-touch attribution, and revenue reporting.', icon: ICON.database },
                { title: 'Marketing Automation Strategy', desc: 'Lifecycle, lead scoring, and nurture flow design for HubSpot, Marketo, Customer.io.', icon: ICON.cog },
                { title: 'Conversion Rate Optimization (CRO)', desc: 'Funnel analysis, A/B testing roadmaps, and landing page optimization.', icon: ICON.refresh },
                { title: 'Fractional CMO Services', desc: 'Senior strategic leadership embedded with your team on a flexible basis.', icon: ICON.headset },
            ]}
            toolsTitleStart="Marketing Tools &"
            toolsTitleHighlight="Platforms We Run On"
            toolsSubtitle="A modern marketing stack — analytics, automation, ads, SEO, social, and CRO — operated end-to-end as a single system."
            toolsLayout="vertical"
            tools={[
                { n: 'Google Analytics 4',  s: 'googleanalytics', c: 'E37400', desc: 'Source of truth for traffic, events, audiences, and funnel reporting across every property we run.' },
                { n: 'Google Tag Manager',  s: 'googletagmanager', c: '246FDB', desc: 'Centralized tracking — pixels, conversions, server-side tagging, and consent mode without re-deploying code.' },
                { n: 'Google Ads',          s: 'googleads',        c: '4285F4', desc: 'Search, Performance Max, and YouTube — ROAS-targeted budgets with automated bidding and offline conversions.' },
                { n: 'Meta Business Suite', s: 'meta',             c: '0467DF', desc: 'Facebook + Instagram ads with audience matching, Advantage+ creative, and conversion API tracking.' },
                { n: 'LinkedIn Ads',        s: 'linkedin',         c: '0A66C2', desc: 'B2B account-based marketing — sponsored content, message ads, and matched-audience retargeting.' },
                { n: 'TikTok Ads',          s: 'tiktok',           c: '000000', desc: 'Spark Ads, brand effects, and creator partnerships for the consumer brands where TikTok wins attention.' },
                { n: 'HubSpot',             s: 'hubspot',          c: 'FF7A59', desc: 'CRM + marketing automation hub — contacts, lifecycle stages, lead scoring, and email workflows.' },
                { n: 'Salesforce',          s: 'salesforce',       c: '00A1E0', desc: 'Enterprise CRM and pipeline reporting — connected to ad platforms via offline conversions and audiences.' },
                { n: 'Mailchimp',           s: 'mailchimp',        c: 'FFE01B', desc: 'Email + SMS campaigns, transactional, and lifecycle automation for SMB and DTC brands.' },
                { n: 'Customer.io',         s: 'customerdotio',    c: '7C3AED', desc: 'Behaviour-driven email + push lifecycle marketing for product-led SaaS brands.' },
                { n: 'Klaviyo',             s: 'klaviyo',          c: '000000', desc: 'DTC e-commerce email + SMS — Shopify-native segmentation, flows, and revenue attribution.' },
                { n: 'SEMrush',             s: 'semrush',          c: 'FF642D', desc: 'Keyword research, competitor traffic, backlink profiles, and SERP tracking for SEO programs.' },
                { n: 'Ahrefs',              s: 'ahrefs',           c: '003366', desc: 'Backlinks, content gap analysis, keyword opportunities, and rank tracking — our SEO source of truth.' },
                { n: 'Hotjar',              s: 'hotjar',           c: 'FD3A5C', desc: 'Heatmaps, session recordings, and on-page surveys — qualitative input that fuels our CRO roadmap.' },
                { n: 'Mixpanel',            s: 'mixpanel',         c: '7856FF', desc: 'Product analytics for SaaS funnels — activation cohorts, retention curves, and feature adoption.' },
                { n: 'Canva',               s: 'canva',            c: '00C4CC', desc: 'Fast collaborative creative — campaign visuals, social variants, and brand-kit-locked templates.' },
            ]}
            hideProjects={true}
            hideTestimonial={true}
            showClients={true}
            clientsPill="Trusted By Growth Teams"
            clientsHeading="From Bootstrapped DTC to Scaled SaaS,"
            clientsHeadingHighlight="We Build Marketing That Compounds"
            extraSections={
                <>
                    <ChannelMixDonut />
                    <CustomerJourneyCurve />
                    <MarketingVideo />
                </>
            }
            googleReviews={[
                {
                    name: 'Cassandra Hill',
                    role: 'CMO, Truepine Outdoor',
                    rating: 5,
                    date: '2 months ago',
                    text: 'Their channel-mix audit moved 18% of our spend off Facebook into SEO and partnerships. Blended CAC dropped 26% in the next quarter — that\'s the kind of strategy work that pays for itself.',
                },
                {
                    name: 'Aniket Joshi',
                    role: 'Head of Growth, Cordwell SaaS',
                    rating: 5,
                    date: '4 months ago',
                    text: 'Our positioning was a mess across the website, ads, and sales decks. Three weeks of work with their team and the whole company was telling the same story — pipeline lifted in the same quarter.',
                },
                {
                    name: 'Maya Olafsdottir',
                    role: 'Founder, Liminal Coffee',
                    rating: 5,
                    date: '6 months ago',
                    text: 'Go-to-market plan for our DTC launch — channel sequencing, creator program, and lifecycle flows. Hit our 90-day revenue target in 47 days.',
                },
                {
                    name: 'David Mensah',
                    role: 'VP Marketing, NovaShift Logistics',
                    rating: 5,
                    date: '3 months ago',
                    text: 'Multi-touch attribution that finally answered the "where did this lead come from" question — across cold email, SEO, paid, and partnerships. The board reporting dashboard alone justified the engagement.',
                },
                {
                    name: 'Rin Takahashi',
                    role: 'Head of Marketing, FlowDesk',
                    rating: 5,
                    date: '5 months ago',
                    text: 'CRO roadmap with thirty experiments prioritized by impact. The first six lifted our trial-to-paid by 22% — and the team knows how to run the program now without us.',
                },
                {
                    name: 'Carla Méndez',
                    role: 'Founder, Kallio Skincare',
                    rating: 5,
                    date: '7 months ago',
                    text: 'Brand strategy refresh and content engine in the same engagement. Our organic traffic 3x\'d in 9 months and we now publish without it being a Tuesday-night fire drill.',
                },
            ]}
            googleReviewsHeading="What Marketing Leaders Say About Us"
            googleReviewsSubtitle="Verified reviews from CMOs, founders, and growth leads we've shipped strategy with."
            faqs={[
                { q: 'What is marketing strategy?', a: 'Marketing strategy defines who you serve, what value you deliver, which channels you invest in, and how you measure success — connecting brand to revenue.' },
                { q: 'How long does it take to build a marketing strategy?', a: 'A focused strategy engagement typically takes 4–8 weeks, including research, positioning, channel planning, and KPIs.' },
                { q: 'Do you also execute the strategy?', a: 'Yes — we can run SEO, paid, content, social, and email programs after the strategy phase, or coach your in-house team.' },
                { q: 'How do you measure marketing success?', a: 'We define funnel KPIs, lead and revenue attribution, channel ROI, and brand metrics — reported in dashboards updated weekly.' },
                { q: 'Can you help with brand positioning?', a: 'Yes. We craft positioning, value props, messaging frameworks, and brand pillars grounded in customer research.' },
                { q: 'Do you provide a fractional CMO?', a: 'Yes. We embed senior strategic leadership for early-stage and scaling companies that need direction without a full-time hire.' },
                { q: 'How often should marketing strategy be refreshed?', a: 'We recommend quarterly tuning and an annual deep refresh, or whenever the product, market, or pricing changes meaningfully.' },
            ]}
        />
    );
}
