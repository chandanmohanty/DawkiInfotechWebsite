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
 * Tiny inline sparkline (used inside KPI tiles)
 * =========================================================================== */
const TinySpark: React.FC<{ points: number[]; color: string }> = ({ points, color }) => {
    const ref = useRef<SVGSVGElement>(null);
    const inView = useInView(ref, { once: true });
    const W = 70, H = 28;
    const max = Math.max(...points), min = Math.min(...points);
    const range = max - min || 1;
    const stepX = W / (points.length - 1);
    const path = points
        .map((p, i) => {
            const x = i * stepX;
            const y = H - 3 - ((p - min) / range) * (H - 6);
            return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
        })
        .join(' ');
    return (
        <svg ref={ref} className="dawki-bi-dash-kpi-spark" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
            <motion.path
                d={path}
                fill="none"
                stroke={color}
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: inView ? 1 : 0 }}
                transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1], delay: 0.4 }}
                style={{ filter: `drop-shadow(0 0 3px ${color})` }}
            />
        </svg>
    );
};

/* ===========================================================================
 * Section 1: BI Live Dashboard Mockup
 * =========================================================================== */
const BARS = [
    { m: 'May', h: 38 }, { m: 'Jun', h: 52 }, { m: 'Jul', h: 46 },
    { m: 'Aug', h: 64 }, { m: 'Sep', h: 78 }, { m: 'Oct', h: 90 },
];

const DONUT_SEGS = [
    { name: 'Direct',  pct: 36, color: '#22c55e' },
    { name: 'Organic', pct: 28, color: '#06b6d4' },
    { name: 'Paid',    pct: 20, color: '#a855f7' },
    { name: 'Email',   pct: 10, color: '#ec4899' },
    { name: 'Other',   pct:  6, color: '#f97316' },
];

const TABLE_ROWS = [
    { name: 'Q4 Renewal · Acme Corp',   stage: 'Proposal',     amt: '$248K' },
    { name: 'Expansion · Vertex Mfg',   stage: 'Negotiation',  amt: '$184K' },
    { name: 'New Logo · Pulsemark',     stage: 'Discovery',    amt: '$92K'  },
    { name: 'Renewal · MeshCart',       stage: 'Closed Won',   amt: '$148K' },
];

const BiDashboard: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });

    const revenue = useCountUp(842, 1800, 0);
    const mrr = useCountUp(184, 1800, 0);
    const customers = useCountUp(2381, 1800, 0);
    const churn = useCountUp(1.4, 1800, 1);

    const r = 38;
    const circ = 2 * Math.PI * r;
    let runningOffset = 0;

    return (
        <section className="dawki-bi-dash">
            <div className="container">
                <div className="dawki-bi-dash-heading">
                    <span className="dawki-bi-dash-pill">
                        <span></span>
                        Live Dashboards
                    </span>
                    <h2 className="dawki-bi-dash-title">
                        Dashboards Leaders <span>Actually Open</span>
                    </h2>
                    <p className="dawki-bi-dash-subtitle">
                        We don't ship walls of charts. We ship five-tile executive views, monthly trend cards, and pipeline tables — built on a governed semantic layer that everyone trusts.
                    </p>
                </div>

                <motion.div
                    ref={ref}
                    className="dawki-bi-dash-frame"
                    initial={{ opacity: 0, y: 30, scale: 0.97 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                >
                    <div className="dawki-bi-dash-toolbar">
                        <div className="dawki-bi-dash-toolbar-dots">
                            <span></span><span></span><span></span>
                        </div>
                        <div className="dawki-bi-dash-toolbar-name">
                            <span className="dawki-bi-dash-toolbar-name-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>
                                </svg>
                            </span>
                            Executive Overview · Q4 2026
                        </div>
                        <div className="dawki-bi-dash-toolbar-filters">
                            <span className="dawki-bi-dash-toolbar-filter">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                Last 6 mo
                            </span>
                            <span className="dawki-bi-dash-toolbar-filter">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                                All segments
                            </span>
                        </div>
                    </div>

                    <div className="dawki-bi-dash-body">
                        <motion.div
                            className="dawki-bi-dash-kpis"
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: '-60px' }}
                            variants={{
                                hidden: {},
                                show: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
                            }}
                        >
                            <motion.div
                                className="dawki-bi-dash-kpi"
                                variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                            >
                                <div className="dawki-bi-dash-kpi-label">Revenue · M</div>
                                <div className="dawki-bi-dash-kpi-value">$<span ref={revenue.ref}>{revenue.value}</span>K</div>
                                <span className="dawki-bi-dash-kpi-trend dawki-bi-dash-kpi-trend--up">▲ 18.2%</span>
                                <TinySpark points={[42, 48, 55, 62, 70, 84]} color="#22c55e" />
                            </motion.div>
                            <motion.div
                                className="dawki-bi-dash-kpi"
                                variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                            >
                                <div className="dawki-bi-dash-kpi-label">MRR</div>
                                <div className="dawki-bi-dash-kpi-value">$<span ref={mrr.ref}>{mrr.value}</span>K</div>
                                <span className="dawki-bi-dash-kpi-trend dawki-bi-dash-kpi-trend--up">▲ 6.4%</span>
                                <TinySpark points={[18, 19, 20, 21, 22, 24]} color="#06b6d4" />
                            </motion.div>
                            <motion.div
                                className="dawki-bi-dash-kpi"
                                variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                            >
                                <div className="dawki-bi-dash-kpi-label">Active Customers</div>
                                <div className="dawki-bi-dash-kpi-value"><span ref={customers.ref}>{customers.value}</span></div>
                                <span className="dawki-bi-dash-kpi-trend dawki-bi-dash-kpi-trend--up">▲ 9.1%</span>
                                <TinySpark points={[1.8, 1.95, 2.05, 2.18, 2.28, 2.38]} color="#a855f7" />
                            </motion.div>
                            <motion.div
                                className="dawki-bi-dash-kpi"
                                variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                            >
                                <div className="dawki-bi-dash-kpi-label">Net Churn</div>
                                <div className="dawki-bi-dash-kpi-value"><span ref={churn.ref}>{churn.value}</span>%</div>
                                <span className="dawki-bi-dash-kpi-trend dawki-bi-dash-kpi-trend--down">▼ 0.6pt</span>
                                <TinySpark points={[2.3, 2.1, 2.0, 1.8, 1.6, 1.4]} color="#fca5a5" />
                            </motion.div>
                        </motion.div>

                        <div className="dawki-bi-dash-grid">
                            <motion.div
                                className="dawki-bi-dash-card"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-60px' }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                            >
                                <div className="dawki-bi-dash-card-head">
                                    <span className="dawki-bi-dash-card-title">Revenue by Month</span>
                                    <span className="dawki-bi-dash-card-action">Last 6 months</span>
                                </div>
                                <div className="dawki-bi-dash-bars">
                                    {BARS.map((b, i) => (
                                        <div key={b.m} className="dawki-bi-dash-bar">
                                            <motion.div
                                                className="dawki-bi-dash-bar-fill"
                                                initial={{ scaleY: 0 }}
                                                animate={{ scaleY: inView ? b.h / 100 : 0 }}
                                                transition={{ duration: 0.85, delay: 0.7 + i * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
                                                style={{ height: '100%' }}
                                            />
                                            <span className="dawki-bi-dash-bar-label">{b.m}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div
                                className="dawki-bi-dash-card"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-60px' }}
                                transition={{ delay: 0.7, duration: 0.5 }}
                            >
                                <div className="dawki-bi-dash-card-head">
                                    <span className="dawki-bi-dash-card-title">Revenue by Channel</span>
                                    <span className="dawki-bi-dash-card-action">Q4</span>
                                </div>
                                <div className="dawki-bi-dash-donut-wrap">
                                    <svg className="dawki-bi-dash-donut" viewBox="0 0 100 100" aria-hidden="true">
                                        <g transform="rotate(-90 50 50)">
                                            <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="14" />
                                            {DONUT_SEGS.map((s) => {
                                                const len = (s.pct / 100) * circ;
                                                const arc = (
                                                    <motion.circle
                                                        key={s.name}
                                                        cx="50" cy="50" r={r}
                                                        fill="none"
                                                        stroke={s.color}
                                                        strokeWidth="14"
                                                        strokeLinecap="butt"
                                                        strokeDasharray={`${len - 0.8} ${circ}`}
                                                        strokeDashoffset={-runningOffset}
                                                        initial={{ pathLength: 0, opacity: 0 }}
                                                        animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                                                        transition={{ duration: 0.7, delay: 0.9 + (runningOffset / circ) * 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                                                    />
                                                );
                                                runningOffset += len;
                                                return arc;
                                            })}
                                        </g>
                                        <text x="50" y="50" className="dawki-bi-dash-donut-center">100%</text>
                                        <text x="50" y="62" className="dawki-bi-dash-donut-center-sub">REVENUE</text>
                                    </svg>
                                    <div className="dawki-bi-dash-donut-legend">
                                        {DONUT_SEGS.map((s) => (
                                            <div key={s.name} className="dawki-bi-dash-donut-legend-row">
                                                <span className="dawki-bi-dash-donut-legend-name">
                                                    <span className="dawki-bi-dash-donut-legend-dot" style={{ ['--leg' as string]: s.color }}></span>
                                                    {s.name}
                                                </span>
                                                <span className="dawki-bi-dash-donut-legend-pct">{s.pct}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        <motion.div
                            className="dawki-bi-dash-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                        >
                            <div className="dawki-bi-dash-card-head">
                                <span className="dawki-bi-dash-card-title">Top Open Deals</span>
                                <span className="dawki-bi-dash-card-action">Pipeline view</span>
                            </div>
                            <table className="dawki-bi-dash-table">
                                <thead>
                                    <tr>
                                        <th>Deal</th>
                                        <th>Stage</th>
                                        <th style={{ textAlign: 'right' }}>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {TABLE_ROWS.map((row, i) => (
                                        <motion.tr
                                            key={i}
                                            initial={{ opacity: 0, x: -8 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 1.0 + i * 0.08, duration: 0.4 }}
                                        >
                                            <td>{row.name}</td>
                                            <td><span className="dawki-bi-dash-table-pill">{row.stage}</span></td>
                                            <td>{row.amt}</td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

/* ===========================================================================
 * Section 2: Modern Data Stack Pipeline (5-stage horizontal flow)
 * =========================================================================== */
type PipeStage = {
    num: string;
    name: string;
    desc: string;
    tools: string[];
    a: string; b: string; glow: string;
    color: string;
};

const PIPE_STAGES: PipeStage[] = [
    {
        num: '01',
        name: 'Sources',
        desc: 'CRM, billing, product, ads, support — every system that produces data your business needs.',
        tools: ['Salesforce', 'Stripe', 'Postgres', 'GA4', 'HubSpot'],
        a: '#06b6d4', b: '#4f7cff', glow: 'rgba(6, 182, 212, 0.55)',
        color: '#06b6d4',
    },
    {
        num: '02',
        name: 'Ingestion',
        desc: 'Managed connectors and CDC feeds. No custom Python pipelines we have to babysit at 3am.',
        tools: ['Fivetran', 'Airbyte', 'Stitch'],
        a: '#4f7cff', b: '#6366f1', glow: 'rgba(79, 124, 255, 0.55)',
        color: '#4f7cff',
    },
    {
        num: '03',
        name: 'Warehouse',
        desc: 'A single source of truth — schema-managed, query-optimized, separated by environment.',
        tools: ['Snowflake', 'BigQuery', 'Databricks'],
        a: '#a855f7', b: '#6366f1', glow: 'rgba(168, 85, 247, 0.55)',
        color: '#a855f7',
    },
    {
        num: '04',
        name: 'Transform',
        desc: 'dbt models, tests, lineage, and a semantic layer — analytics engineering done right.',
        tools: ['dbt', 'SQLMesh', 'Cube'],
        a: '#ec4899', b: '#a855f7', glow: 'rgba(236, 72, 153, 0.55)',
        color: '#ec4899',
    },
    {
        num: '05',
        name: 'Activate',
        desc: 'Dashboards, alerts, and reverse-ETL — pushing trusted data to the tools your team lives in.',
        tools: ['Tableau', 'Looker', 'Hightouch'],
        a: '#22c55e', b: '#06b6d4', glow: 'rgba(34, 197, 94, 0.55)',
        color: '#22c55e',
    },
];

const BiDataPipeline: React.FC = () => {
    const records = useCountUp(2.4, 1800, 1);
    const sources = useCountUp(38, 1800, 0);
    const dashboards = useCountUp(124, 1800, 0);
    const freshness = useCountUp(99.7, 1800, 1);

    return (
        <section className="dawki-bi-pipe">
            <div className="container">
                <div className="dawki-bi-pipe-heading">
                    <span className="dawki-bi-pipe-pill">
                        <span></span>
                        Modern Data Stack
                    </span>
                    <h2 className="dawki-bi-pipe-title">
                        From Raw Source to <span>Trusted Insight</span>
                    </h2>
                    <p className="dawki-bi-pipe-subtitle">
                        A reliable five-stage pipeline that ingests from every business system, models cleanly in your warehouse, and pushes trusted metrics back into the tools your teams already use.
                    </p>
                </div>

                <motion.div
                    className="dawki-bi-pipe-flow"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-60px' }}
                    variants={{
                        hidden: {},
                        show: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } },
                    }}
                >
                    {PIPE_STAGES.map((s, i) => (
                        <motion.div
                            key={s.num}
                            className="dawki-bi-pipe-stage"
                            style={{
                                ['--st-a' as string]: s.a,
                                ['--st-b' as string]: s.b,
                                ['--st-glow' as string]: s.glow,
                                ['--st-color' as string]: s.color,
                            }}
                            variants={{
                                hidden: { opacity: 0, y: 24 },
                                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] } },
                            }}
                        >
                            <div className="dawki-bi-pipe-stage-num">{s.num}</div>
                            <h3 className="dawki-bi-pipe-stage-name">{s.name}</h3>
                            <p className="dawki-bi-pipe-stage-desc">{s.desc}</p>
                            <div className="dawki-bi-pipe-stage-tools">
                                {s.tools.map((t) => (
                                    <span key={t} className="dawki-bi-pipe-stage-tool">{t}</span>
                                ))}
                            </div>
                            {i < PIPE_STAGES.length - 1 && <div className="dawki-bi-pipe-stage-mobile-arrow">↓</div>}
                        </motion.div>
                    ))}
                </motion.div>

                <div className="dawki-bi-pipe-track" aria-hidden="true">
                    <span className="dawki-bi-pipe-track-bullet"></span>
                    <span className="dawki-bi-pipe-track-bullet dawki-bi-pipe-track-bullet--b"></span>
                    <span className="dawki-bi-pipe-track-bullet dawki-bi-pipe-track-bullet--c"></span>
                </div>

                <motion.div
                    className="dawki-bi-pipe-stats"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-60px' }}
                    variants={{
                        hidden: {},
                        show: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } },
                    }}
                >
                    <motion.div className="dawki-bi-pipe-stat" variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
                        <div className="dawki-bi-pipe-stat-key">Records / Day</div>
                        <div className="dawki-bi-pipe-stat-val"><span ref={records.ref}>{records.value}</span>B</div>
                        <div className="dawki-bi-pipe-stat-sub">Across all customer warehouses we operate.</div>
                    </motion.div>
                    <motion.div className="dawki-bi-pipe-stat" variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
                        <div className="dawki-bi-pipe-stat-key">Source Connectors</div>
                        <div className="dawki-bi-pipe-stat-val"><span ref={sources.ref}>{sources.value}</span>+</div>
                        <div className="dawki-bi-pipe-stat-sub">Pre-built integrations live in production today.</div>
                    </motion.div>
                    <motion.div className="dawki-bi-pipe-stat" variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
                        <div className="dawki-bi-pipe-stat-key">Dashboards Shipped</div>
                        <div className="dawki-bi-pipe-stat-val"><span ref={dashboards.ref}>{dashboards.value}</span>+</div>
                        <div className="dawki-bi-pipe-stat-sub">Executive, ops, finance, and customer-facing analytics.</div>
                    </motion.div>
                    <motion.div className="dawki-bi-pipe-stat" variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
                        <div className="dawki-bi-pipe-stat-key">Pipeline Freshness SLA</div>
                        <div className="dawki-bi-pipe-stat-val"><span ref={freshness.ref}>{freshness.value}</span>%</div>
                        <div className="dawki-bi-pipe-stat-sub">Monte Carlo + dbt tests catch issues before users do.</div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

/* ===========================================================================
 * Section 3: BI Video Showcase
 * =========================================================================== */
const BiVideo: React.FC = () => {
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
                        Inside The Data Lab
                    </span>
                    <h2 className="dawki-ent-video-title">
                        See How We Build <span>BI That Leaders Trust</span>
                    </h2>
                    <p className="dawki-ent-video-subtitle">
                        A behind-the-scenes look at how we audit data sources, build the warehouse, and ship governed dashboards business teams actually use every day.
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
export default function BusinessIntelligenceServices() {
    return (
        <ServicePageTemplate
            pageTitle="Business Intelligence Services"
            breadcrumbCategory="AI & Data Engineering"
            heroPill="AI & Data Engineering"
            heroTitleStart="Business Intelligence"
            heroTitleHighlight="Services"
            heroSubtitle="Modern data warehouses, ELT pipelines, and dashboards — turn raw business data into decisions you can trust."
            heroVideoSrc="/assets/images/header/demo/business-intelligence-services.mp4"
            featuresPill="Decisions, Faster"
            featuresTitleStart="From Raw Data to"
            featuresTitleHighlight="Trusted Insights"
            featuresSubtitle="From Snowflake and BigQuery to Looker, Power BI, and Tableau — we engineer the modern data stack and the dashboards leaders actually use."
            features={[
                { title: 'Modern Data Stack', desc: 'Snowflake, BigQuery, Databricks, dbt, Fivetran, Airbyte — production-grade.', icon: '🏛️' },
                { title: 'ELT Pipelines', desc: 'Reliable, observable, version-controlled pipelines built with dbt and orchestrators.', icon: '🚰' },
                { title: 'Self-Serve Analytics', desc: 'Semantic layers and governed metrics so business users get answers without SQL.', icon: '👥' },
                { title: 'Embedded Analytics', desc: 'Dashboards and metrics embedded into your SaaS product or internal apps.', icon: '📈' },
                { title: 'Data Quality & Governance', desc: 'Tests, alerts, lineage, catalogs, and access controls — Monte Carlo, Atlan, OpenLineage.', icon: '🛡️' },
                { title: 'Predictive Analytics', desc: 'Forecasts, churn, scoring, and anomaly detection on your trusted data layer.', icon: '🔮' },
            ]}
            processSteps={[
                { n: '01', t: 'Audit & Strategy', d: 'Audit data sources, gaps, and stakeholder needs; design target architecture.' },
                { n: '02', t: 'Build', d: 'Stand up warehouse, ELT, semantic layer, and core dashboards.' },
                { n: '03', t: 'Activate', d: 'Roll out self-serve analytics, training, and adoption playbooks.' },
                { n: '04', t: 'Operate & Improve', d: 'Monitor pipeline health, evolve data models, and add predictive capabilities.' },
            ]}
            servicesPill="Our Capabilities"
            servicesTitleStart="Business Intelligence"
            servicesTitleHighlight="Services We Offer"
            servicesSubtitle="Strategy, engineering, dashboards, and governance — across the modern data stack."
            servicesLayout="timeline"
            serviceCards={[
                { title: 'BI Strategy & Roadmap', desc: 'Data vision, target architecture, tooling decisions, and adoption plan.', icon: ICON.target },
                { title: 'Cloud Data Warehousing', desc: 'Snowflake, BigQuery, Redshift, Databricks lakehouse implementation and tuning.', icon: ICON.cloud },
                { title: 'Data Pipelines & ETL/ELT', desc: 'Pipelines with Fivetran, Airbyte, Stitch, and custom Python — orchestrated by Airflow/Prefect.', icon: ICON.refresh },
                { title: 'dbt Development', desc: 'Modular dbt models, tests, docs, and CI/CD for analytics engineering at scale.', icon: ICON.code },
                { title: 'Semantic Layer & Metrics', desc: 'LookML, Cube, dbt Semantic Layer — governed metrics consumed across tools.', icon: ICON.cog },
                { title: 'Dashboards & Reporting', desc: 'Looker, Power BI, Tableau, Metabase, Sigma — designed for executives and operators.', icon: ICON.chart },
                { title: 'Embedded Analytics', desc: 'Embed dashboards and customer-facing analytics into your SaaS product.', icon: ICON.box },
                { title: 'Data Quality & Observability', desc: 'Monte Carlo, dbt tests, anomaly detection, freshness checks, and SLA alerting.', icon: ICON.shield },
                { title: 'Data Governance & Catalogs', desc: 'Atlan, DataHub, Collibra — lineage, glossaries, and access controls.', icon: ICON.database },
                { title: 'Reverse ETL', desc: 'Activate warehouse data into Salesforce, HubSpot, Marketo via Hightouch or Census.', icon: ICON.link },
                { title: 'Predictive & Advanced Analytics', desc: 'Forecasts, churn, LTV, and segmentation models built on your data warehouse.', icon: ICON.bot },
                { title: 'Data Team Augmentation', desc: 'Embedded analytics engineers, BI developers, and data architects for your team.', icon: ICON.headset },
            ]}
            toolsTitleStart="Modern Data Stack &"
            toolsTitleHighlight="BI Tools We Run On"
            toolsSubtitle="A purpose-built BI stack — warehouse, pipelines, transformation, semantic layer, dashboards, and reverse-ETL — operated end-to-end."
            toolsLayout="vertical"
            tools={[
                { n: 'Snowflake',      s: 'snowflake',     c: '29B5E8', desc: 'Default cloud warehouse — separation of compute and storage, near-zero admin, multi-cluster reads.' },
                { n: 'Google BigQuery',s: 'googlebigquery',c: '4285F4', desc: 'Serverless, columnar warehouse for petabyte-scale analytics — pay only for the queries you run.' },
                { n: 'Databricks',     s: 'databricks',    c: 'FF3621', desc: 'Lakehouse for teams that want SQL + Spark + ML in one platform — Delta Lake under the hood.' },
                { n: 'PostgreSQL',     s: 'postgresql',    c: '4169E1', desc: 'Reliable open-source warehouse for smaller stacks — pgvector, partitioning, and rich SQL.' },
                { n: 'Fivetran',       s: 'fivetran',      c: '0073FF', desc: 'Managed CDC connectors — Salesforce, Stripe, Postgres, and 400+ sources to your warehouse.' },
                { n: 'Airbyte',        s: 'airbyte',       c: '615EFF', desc: 'Open-source ELT — when you need to self-host or build custom connectors quickly.' },
                { n: 'Stitch',         s: 'stitch',        c: 'F75D3D', desc: 'Lightweight ELT pipelines — fast to set up for SMB stacks and standard SaaS sources.' },
                { n: 'dbt',            s: 'dbt',           c: 'FF694A', desc: 'Analytics engineering layer — modular SQL models, tests, docs, and lineage we ship in every build.' },
                { n: 'Apache Airflow', s: 'apacheairflow', c: '017CEE', desc: 'Workflow orchestration — DAGs for batch jobs, ML training, and complex multi-step pipelines.' },
                { n: 'Tableau',        s: 'tableau',       c: 'E97627', desc: 'Executive dashboards and rich data exploration — preferred when stakeholders demand pixel-perfect viz.' },
                { n: 'Looker',         s: 'looker',        c: '4285F4', desc: 'LookML semantic layer + governed dashboards — every metric defined once and consumed everywhere.' },
                { n: 'Power BI',       s: 'powerbi',       c: 'F2C811', desc: 'Microsoft-stack BI — strong in regulated enterprises with deep Office 365 + Azure investment.' },
                { n: 'Metabase',       s: 'metabase',      c: '509EE3', desc: 'Self-serve open-source BI — fast to deploy, intuitive for non-SQL users, low cost at scale.' },
                { n: 'Cube',           s: 'cube',          c: 'A626E2', desc: 'Headless semantic layer + APIs — for embedded analytics in SaaS products and custom dashboards.' },
                { n: 'Hightouch',      s: 'hightouch',     c: '422DC9', desc: 'Reverse-ETL — sync warehouse-modeled data back into Salesforce, HubSpot, Marketo, and ad platforms.' },
                { n: 'Monte Carlo',    s: 'montecarlo',    c: '1E1B26', desc: 'Data observability — anomaly detection, freshness, schema-change alerts that catch issues before users.' },
            ]}
            hideProjects={true}
            hideTestimonial={true}
            showClients={true}
            clientsPill="Trusted By Data Teams"
            clientsHeading="From Series-A Data Stacks to Enterprise Warehouses,"
            clientsHeadingHighlight="We Build Decisions Worth Trusting"
            extraSections={
                <>
                    <BiDashboard />
                    <BiDataPipeline />
                    <BiVideo />
                </>
            }
            googleReviews={[
                {
                    name: 'Olivia Whitfield',
                    role: 'VP Analytics, Brightline Health',
                    rating: 5,
                    date: '2 months ago',
                    text: 'Their dbt + Snowflake build replaced six manual Excel reports the executives used to argue about. Within two months everyone was citing the same numbers in the same meetings.',
                },
                {
                    name: 'Marcus Reyes',
                    role: 'Head of Data, Cordwell SaaS',
                    rating: 5,
                    date: '4 months ago',
                    text: 'Embedded customer-facing dashboards built on Cube and Snowflake. Three of our largest customers cited "the analytics" as a renewal driver — which means this work paid for itself in one quarter.',
                },
                {
                    name: 'Aisha Suleiman',
                    role: 'CFO, Vertex Manufacturing',
                    rating: 5,
                    date: '6 months ago',
                    text: 'My monthly close report ran in dbt as 14 chained models — auditable, versioned, and tested. We trust the numbers now without manually reconciling against the source system every cycle.',
                },
                {
                    name: 'Daniel Albrecht',
                    role: 'CTO, MeshCart',
                    rating: 5,
                    date: '3 months ago',
                    text: 'Reverse-ETL into Salesforce + HubSpot meant our reps saw account health and product usage right inside the CRM. Win rates on at-risk renewals climbed 22% in the first quarter.',
                },
                {
                    name: 'Hana Lindgren',
                    role: 'Head of FinOps, FinFleet',
                    rating: 5,
                    date: '5 months ago',
                    text: 'Snowflake cost dropped 41% after their tuning + warehouse-sizing audit. They returned the engagement fee in the first month of savings alone.',
                },
                {
                    name: 'Tomás Ferreira',
                    role: 'Director of BI, Pulsemark Labs',
                    rating: 5,
                    date: '7 months ago',
                    text: 'Monte Carlo + dbt test coverage that actually catches things. Three pipeline incidents this year were detected and fixed before any executive saw a wrong number.',
                },
            ]}
            googleReviewsHeading="What Data Leaders Say About Us"
            googleReviewsSubtitle="Verified reviews from VPs of Analytics, CFOs, and heads of data we've shipped warehouses and dashboards with."
            faqs={[
                { q: 'What is business intelligence?', a: 'Business Intelligence is the practice of turning raw business data into trusted dashboards, metrics, and insights that drive better decisions across the organization.' },
                { q: 'Which BI tools do you work with?', a: 'Looker, Power BI, Tableau, Metabase, Sigma, and Mode — chosen based on your data team, budget, and existing stack.' },
                { q: 'Which data warehouses do you support?', a: 'Snowflake, BigQuery, Redshift, Databricks lakehouse, and Postgres-based warehouses — including migration between them.' },
                { q: 'Do you build the pipelines too?', a: 'Yes. We design and build pipelines with Fivetran, Airbyte, Stitch, custom Python, and orchestrators like Airflow, Prefect, or Dagster.' },
                { q: 'Can you embed analytics into our product?', a: 'Yes. We embed dashboards and build customer-facing analytics into SaaS products using Looker, Sigma, Cube, or custom builds.' },
                { q: 'How do you handle data quality?', a: 'dbt tests, Monte Carlo or similar observability platforms, freshness alerts, anomaly detection, and clear data SLAs.' },
                { q: 'How long does a BI implementation take?', a: 'A foundational warehouse + core dashboards typically launches in 8–14 weeks. Larger enterprise BI programs run 4–9 months in phases.' },
            ]}
        />
    );
}
