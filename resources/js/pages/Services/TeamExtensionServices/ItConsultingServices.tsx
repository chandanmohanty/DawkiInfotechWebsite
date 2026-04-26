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
 * Section 1: IT Maturity Radar Chart (current vs target polygons)
 * =========================================================================== */
type RadarDim = { name: string; sub: string; current: number; target: number };

const RADAR_DIMS: RadarDim[] = [
    { name: 'Strategy',     sub: 'Roadmap & investment',       current: 4, target: 9 },
    { name: 'Architecture', sub: 'Stack & integration',        current: 5, target: 8 },
    { name: 'Security',     sub: 'Posture & compliance',       current: 3, target: 9 },
    { name: 'Operations',   sub: 'Reliability & SRE',          current: 5, target: 8 },
    { name: 'Data & AI',    sub: 'Platform & analytics',       current: 4, target: 9 },
    { name: 'People',       sub: 'Talent & culture',           current: 6, target: 9 },
];

const ItMaturityRadar: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });

    const cx = 50, cy = 50;
    const radius = 38; // outer radius in viewBox units (0–100)
    const sides = RADAR_DIMS.length;
    const max = 10;

    // Compute polygon points from value array
    const pts = (values: number[]) => values.map((v, i) => {
        const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
        const r = (v / max) * radius;
        return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
    });
    const ptsToString = (points: number[][]) => points.map((p) => p.join(',')).join(' ');

    const currentPts = pts(RADAR_DIMS.map(d => d.current));
    const targetPts  = pts(RADAR_DIMS.map(d => d.target));

    // Concentric grid polygons (0.2, 0.4, 0.6, 0.8, 1.0 of radius)
    const gridPoly = (frac: number) => {
        const points = Array.from({ length: sides }, (_, i) => {
            const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
            const r = frac * radius;
            return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
        });
        return ptsToString(points);
    };

    // Axis labels
    const axisLabel = (i: number, label: string) => {
        const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
        const r = radius + 10;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle) + 1;
        return { x, y, label };
    };

    return (
        <section className="dawki-itc-radar">
            <div className="container">
                <div className="dawki-itc-radar-heading">
                    <span className="dawki-itc-radar-pill">
                        <span></span>
                        Maturity Assessment
                    </span>
                    <h2 className="dawki-itc-radar-title">
                        Where Your IT Stands — <span>And Where It Needs to Be</span>
                    </h2>
                    <p className="dawki-itc-radar-subtitle">
                        Every engagement starts with an honest score. Six dimensions, scored 1–10, benchmarked against industry peers — and a target curve we agree on before we touch a thing.
                    </p>
                </div>

                <motion.div
                    ref={ref}
                    className="dawki-itc-radar-frame"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                >
                    <div className="dawki-itc-radar-canvas">
                        <svg className="dawki-itc-radar-svg" viewBox="0 0 100 100" aria-hidden="true">
                            {/* Concentric grid */}
                            {[0.2, 0.4, 0.6, 0.8, 1.0].map((f) => (
                                <polygon key={f} className="dawki-itc-radar-grid" points={gridPoly(f)} />
                            ))}
                            {/* Axes */}
                            {RADAR_DIMS.map((_, i) => {
                                const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
                                const x2 = cx + radius * Math.cos(angle);
                                const y2 = cy + radius * Math.sin(angle);
                                return <line key={i} className="dawki-itc-radar-axis" x1={cx} y1={cy} x2={x2} y2={y2} />;
                            })}

                            {/* Target polygon */}
                            <motion.polygon
                                className="dawki-itc-radar-poly-target"
                                points={ptsToString(targetPts)}
                                initial={{ opacity: 0, scale: 0.6 }}
                                animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0.6 }}
                                transition={{ duration: 1.0, delay: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                                style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
                            />
                            {/* Current polygon (drawn after) */}
                            <motion.polygon
                                className="dawki-itc-radar-poly-current"
                                points={ptsToString(currentPts)}
                                initial={{ opacity: 0, scale: 0.6 }}
                                animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0.6 }}
                                transition={{ duration: 1.0, delay: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                                style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
                            />

                            {/* Vertex dots */}
                            {targetPts.map((p, i) => (
                                <motion.circle
                                    key={`t-${i}`} cx={p[0]} cy={p[1]} r="1.4"
                                    className="dawki-itc-radar-dot-target"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: inView ? 1 : 0 }}
                                    transition={{ delay: 1.3 + i * 0.05, duration: 0.3 }}
                                />
                            ))}
                            {currentPts.map((p, i) => (
                                <motion.circle
                                    key={`c-${i}`} cx={p[0]} cy={p[1]} r="1.4"
                                    className="dawki-itc-radar-dot-current"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: inView ? 1 : 0 }}
                                    transition={{ delay: 1.5 + i * 0.05, duration: 0.3 }}
                                />
                            ))}

                            {/* Axis labels */}
                            {RADAR_DIMS.map((d, i) => {
                                const { x, y, label } = axisLabel(i, d.name);
                                return (
                                    <text key={d.name} x={x} y={y} className="dawki-itc-radar-axis-label">
                                        {label}
                                    </text>
                                );
                            })}
                        </svg>
                    </div>

                    {/* Right side — dimension scores */}
                    <div className="dawki-itc-radar-key">
                        <div className="dawki-itc-radar-key-toggle">
                            <span className="dawki-itc-radar-key-pill" style={{ ['--key-color' as string]: '#f97316' }}>Current</span>
                            <span className="dawki-itc-radar-key-pill" style={{ ['--key-color' as string]: '#22c55e' }}>Target (12 mo)</span>
                        </div>

                        <motion.div
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: '-60px' }}
                            variants={{
                                hidden: {},
                                show: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } },
                            }}
                            style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
                        >
                            {RADAR_DIMS.map((d) => (
                                <motion.div
                                    key={d.name}
                                    className="dawki-itc-radar-row"
                                    variants={{
                                        hidden: { opacity: 0, x: 20 },
                                        show: { opacity: 1, x: 0, transition: { duration: 0.45 } },
                                    }}
                                >
                                    <div className="dawki-itc-radar-row-name">
                                        {d.name}
                                        <small>{d.sub}</small>
                                    </div>
                                    <div className="dawki-itc-radar-row-score">
                                        <div className="dawki-itc-radar-row-score-val" style={{ ['--score-color' as string]: '#f97316' }}>{d.current}</div>
                                        <div className="dawki-itc-radar-row-score-label">Now</div>
                                    </div>
                                    <span className="dawki-itc-radar-row-arrow">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                                    </span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

/* ===========================================================================
 * Section 2: IT Transformation Gantt Roadmap
 * =========================================================================== */
type GanttPhase = {
    name: string;
    owner: string;
    start: number;       // 0-11 (months)
    end: number;         // 0-11
    a: string; b: string;
    glow: string;
    milestones?: { at: number; color: string }[];
};

const GANTT_PHASES: GanttPhase[] = [
    {
        name: 'Discovery & Audit',
        owner: 'Strategy · Q1',
        start: 0, end: 1.4,
        a: '#06b6d4', b: '#4f7cff', glow: 'rgba(6, 182, 212, 0.4)',
        milestones: [{ at: 1.2, color: '#06b6d4' }],
    },
    {
        name: 'Target Architecture',
        owner: 'Architects · Q1–Q2',
        start: 1.0, end: 3.5,
        a: '#4f7cff', b: '#6366f1', glow: 'rgba(79, 124, 255, 0.4)',
        milestones: [{ at: 2.4, color: '#4f7cff' }, { at: 3.2, color: '#4f7cff' }],
    },
    {
        name: 'Security & Compliance',
        owner: 'Security · Q1–Q3',
        start: 1.5, end: 7.5,
        a: '#a855f7', b: '#ec4899', glow: 'rgba(168, 85, 247, 0.4)',
        milestones: [{ at: 3.5, color: '#a855f7' }, { at: 6.5, color: '#ec4899' }],
    },
    {
        name: 'Cloud Migration',
        owner: 'Platform · Q2–Q3',
        start: 3.2, end: 7.0,
        a: '#ec4899', b: '#f97316', glow: 'rgba(236, 72, 153, 0.4)',
        milestones: [{ at: 5.0, color: '#ec4899' }, { at: 6.5, color: '#f97316' }],
    },
    {
        name: 'Data & AI Platform',
        owner: 'Data · Q3',
        start: 5.5, end: 9.0,
        a: '#f97316', b: '#fbbf24', glow: 'rgba(249, 115, 22, 0.4)',
        milestones: [{ at: 8.4, color: '#f97316' }],
    },
    {
        name: 'Operate & Optimize',
        owner: 'SRE · Q4+',
        start: 8.0, end: 12,
        a: '#22c55e', b: '#06b6d4', glow: 'rgba(34, 197, 94, 0.4)',
        milestones: [{ at: 11.5, color: '#22c55e' }],
    },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const QUARTERS = ['Q1', 'Q1', 'Q1', 'Q2', 'Q2', 'Q2', 'Q3', 'Q3', 'Q3', 'Q4', 'Q4', 'Q4'];
const TODAY_INDEX = 4.5; // mid-May indicator

const ItGanttRoadmap: React.FC = () => {
    const phases = useCountUp(28, 1500, 0);
    const milestones = useCountUp(72, 1500, 0);
    const months = useCountUp(12, 1500, 0);
    const teams = useCountUp(6, 1500, 0);

    return (
        <section className="dawki-itc-gantt">
            <div className="container">
                <div className="dawki-itc-gantt-heading">
                    <span className="dawki-itc-gantt-pill">
                        <span></span>
                        Transformation Roadmap
                    </span>
                    <h2 className="dawki-itc-gantt-title">
                        12 Months. <span>Every Bet Sequenced.</span>
                    </h2>
                    <p className="dawki-itc-gantt-subtitle">
                        We don't ship vague slides. Every IT engagement leaves you with a working Gantt — phases, owners, dependencies, milestones — ready to track every sprint.
                    </p>
                </div>

                <motion.div
                    className="dawki-itc-gantt-frame"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                >
                    <div className="dawki-itc-gantt-toolbar">
                        <div className="dawki-itc-gantt-toolbar-name">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                            FY26 Modernization Plan
                            <span className="dawki-itc-gantt-toolbar-stat">On-track</span>
                        </div>
                        <div className="dawki-itc-gantt-toolbar-legend">
                            <span className="dawki-itc-gantt-toolbar-legend-item">
                                <span className="dawki-itc-gantt-toolbar-legend-dot" style={{ ['--leg' as string]: '#4f7cff' }}></span>
                                Phase
                            </span>
                            <span className="dawki-itc-gantt-toolbar-legend-item">
                                <span className="dawki-itc-gantt-toolbar-legend-dot" style={{ ['--leg' as string]: '#ec4899', borderRadius: '50%', transform: 'rotate(45deg)' }}></span>
                                Milestone
                            </span>
                            <span className="dawki-itc-gantt-toolbar-legend-item">
                                <span className="dawki-itc-gantt-toolbar-legend-dot" style={{ ['--leg' as string]: 'transparent', borderLeft: '2px dashed #a855f7', width: 2, height: 12, borderRadius: 0 }}></span>
                                Dependency
                            </span>
                        </div>
                    </div>

                    <div className="dawki-itc-gantt-grid">
                        {/* Month headers */}
                        <div className="dawki-itc-gantt-headers">
                            {MONTHS.map((m, i) => (
                                <div key={m} className="dawki-itc-gantt-header-month">
                                    <strong>{QUARTERS[i]}</strong>
                                    {m}
                                </div>
                            ))}
                        </div>

                        {GANTT_PHASES.map((phase, i) => {
                            const startPct = (phase.start / 12) * 100;
                            const widthPct = ((phase.end - phase.start) / 12) * 100;
                            return (
                                <motion.div
                                    key={phase.name}
                                    className="dawki-itc-gantt-row"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: '-60px' }}
                                    transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                                >
                                    <div className="dawki-itc-gantt-label">
                                        <div className="dawki-itc-gantt-label-name">{phase.name}</div>
                                        <div className="dawki-itc-gantt-label-owner">{phase.owner}</div>
                                    </div>

                                    <div className="dawki-itc-gantt-track">
                                        <motion.div
                                            className="dawki-itc-gantt-bar"
                                            style={{
                                                left: `${startPct}%`,
                                                width: `${widthPct}%`,
                                                ['--bar-a' as string]: phase.a,
                                                ['--bar-b' as string]: phase.b,
                                                ['--bar-glow' as string]: phase.glow,
                                            }}
                                            initial={{ scaleX: 0 }}
                                            whileInView={{ scaleX: 1 }}
                                            viewport={{ once: true, margin: '-60px' }}
                                            transition={{ delay: 0.5 + i * 0.1, duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                                        >
                                            {phase.name}
                                        </motion.div>

                                        {phase.milestones?.map((m, mi) => (
                                            <motion.div
                                                key={mi}
                                                className="dawki-itc-gantt-bar-mile"
                                                style={{
                                                    left: `${(m.at / 12) * 100}%`,
                                                    ['--mile-color' as string]: m.color,
                                                }}
                                                initial={{ opacity: 0, scale: 0 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 1.4 + i * 0.1 + mi * 0.08, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                                            />
                                        ))}

                                        {/* Today line drawn only on the first row's track */}
                                        {i === 0 && (
                                            <span
                                                className="dawki-itc-gantt-today"
                                                style={{ left: `${(TODAY_INDEX / 12) * 100}%` }}
                                                aria-hidden="true"
                                            ></span>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                <motion.div
                    className="dawki-itc-gantt-stats"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-60px' }}
                    variants={{
                        hidden: {},
                        show: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } },
                    }}
                >
                    <motion.div className="dawki-itc-gantt-stat" variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
                        <div className="dawki-itc-gantt-stat-key">Phases Planned</div>
                        <div className="dawki-itc-gantt-stat-val"><span ref={phases.ref}>{phases.value}</span></div>
                        <div className="dawki-itc-gantt-stat-sub">Across strategy, security, cloud, data, and operations.</div>
                    </motion.div>
                    <motion.div className="dawki-itc-gantt-stat" variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
                        <div className="dawki-itc-gantt-stat-key">Milestones Tracked</div>
                        <div className="dawki-itc-gantt-stat-val"><span ref={milestones.ref}>{milestones.value}</span></div>
                        <div className="dawki-itc-gantt-stat-sub">Each one tied to a metric, owner, and acceptance criteria.</div>
                    </motion.div>
                    <motion.div className="dawki-itc-gantt-stat" variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
                        <div className="dawki-itc-gantt-stat-key">Roadmap Horizon</div>
                        <div className="dawki-itc-gantt-stat-val"><span ref={months.ref}>{months.value}</span> mo</div>
                        <div className="dawki-itc-gantt-stat-sub">Reviewed quarterly, re-baselined as priorities shift.</div>
                    </motion.div>
                    <motion.div className="dawki-itc-gantt-stat" variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
                        <div className="dawki-itc-gantt-stat-key">Cross-Functional Teams</div>
                        <div className="dawki-itc-gantt-stat-val"><span ref={teams.ref}>{teams.value}</span></div>
                        <div className="dawki-itc-gantt-stat-sub">Architects, security, platform, data, SRE, change management.</div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

/* ===========================================================================
 * Section 3: IT Consulting Video Showcase
 * =========================================================================== */
const ItcVideo: React.FC = () => {
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
                        Inside The Advisory Room
                    </span>
                    <h2 className="dawki-ent-video-title">
                        See How We Turn IT Strategy <span>Into Real Outcomes</span>
                    </h2>
                    <p className="dawki-ent-video-subtitle">
                        A behind-the-scenes look at how our advisors run discovery, score maturity, and build IT roadmaps that deliver — not just look pretty in a deck.
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
export default function ItConsultingServices() {
    return (
        <ServicePageTemplate
            pageTitle="IT Consulting Services"
            breadcrumbCategory="Team Extension Services"
            heroPill="Team Extension Services"
            heroTitleStart="IT Consulting"
            heroTitleHighlight="Services"
            heroSubtitle="Strategic IT consulting that aligns technology to business outcomes — architecture, cloud, security, and digital transformation."
            heroVideoSrc="/assets/images/header/demo/it-consulting-services.mp4"
            featuresPill="Strategy + Execution"
            featuresTitleStart="Technology Advice"
            featuresTitleHighlight="That Drives Outcomes"
            featuresSubtitle="From CIO advisory to architecture reviews — we help leaders make smart technology bets and execute them with confidence."
            features={[
                { title: 'Senior Technology Advisors', desc: 'CIOs, CTOs, and architects with 15+ years of enterprise experience.', icon: '🎓' },
                { title: 'Architecture & Stack Reviews', desc: 'Independent assessments of architecture, vendors, and technical debt.', icon: '🏗️' },
                { title: 'Cloud Strategy', desc: 'Multi-cloud strategy, migration planning, and FinOps.', icon: '☁️' },
                { title: 'Security & Compliance', desc: 'SOC 2, HIPAA, GDPR, ISO 27001 readiness and remediation.', icon: '🛡️' },
                { title: 'Digital Transformation', desc: 'Roadmaps that modernize processes, systems, and customer experience.', icon: '🚀' },
                { title: 'Vendor & Tool Selection', desc: 'Independent RFPs, evaluations, and contract negotiation support.', icon: '⚖️' },
            ]}
            processSteps={[
                { n: '01', t: 'Discovery', d: 'Stakeholder interviews, current-state assessment, and goal alignment.' },
                { n: '02', t: 'Strategy', d: 'Recommendations, roadmap, and business case for technology investments.' },
                { n: '03', t: 'Activate', d: 'Vendor selection, hiring support, and execution planning.' },
                { n: '04', t: 'Govern', d: 'Ongoing advisory, KPI reviews, and course corrections.' },
            ]}
            servicesPill="Our Capabilities"
            servicesTitleStart="IT Consulting"
            servicesTitleHighlight="Services We Offer"
            servicesSubtitle="Independent advisory, hands-on execution support, and fractional leadership."
            servicesLayout="timeline"
            serviceCards={[
                { title: 'CIO / CTO Advisory', desc: 'Fractional and embedded leadership for tech strategy, hiring, and execution.', icon: ICON.target },
                { title: 'IT Strategy & Roadmaps', desc: '12–36 month roadmaps tied to business goals, KPIs, and budget.', icon: ICON.chart },
                { title: 'Enterprise Architecture', desc: 'Reference architectures, integration patterns, and tech standards.', icon: ICON.cog },
                { title: 'Cloud Strategy & Migration', desc: 'AWS, Azure, GCP planning, migration, and cost optimization.', icon: ICON.cloud },
                { title: 'Cybersecurity Consulting', desc: 'Risk assessments, threat modeling, and security program development.', icon: ICON.lock },
                { title: 'Compliance & Audit Readiness', desc: 'SOC 2, HIPAA, GDPR, ISO 27001, PCI DSS — readiness, audit, and remediation.', icon: ICON.shield },
                { title: 'Digital Transformation', desc: 'Process, systems, and customer experience modernization.', icon: ICON.rocket },
                { title: 'IT Modernization', desc: 'Legacy system replacement, monolith-to-microservices, and platform upgrades.', icon: ICON.refresh },
                { title: 'Vendor Selection & RFPs', desc: 'Independent vendor evaluations, RFPs, and contract reviews.', icon: ICON.search },
                { title: 'IT Cost Optimization', desc: 'License audits, FinOps, infrastructure right-sizing, and tooling consolidation.', icon: ICON.box },
                { title: 'Data & AI Strategy', desc: 'Data platform and AI/ML strategy aligned to business value.', icon: ICON.database },
                { title: 'IT Governance & PMO', desc: 'Governance frameworks, portfolio management, and program oversight.', icon: ICON.headset },
            ]}
            toolsTitleStart="IT Advisory &"
            toolsTitleHighlight="Operations Tools We Run On"
            toolsSubtitle="A purpose-built advisory toolkit — assessments, ITSM, identity, observability, and program management — operated end-to-end."
            toolsLayout="vertical"
            tools={[
                { n: 'ServiceNow',         s: 'servicenow',     c: '00C3A0', desc: 'Enterprise ITSM — incident, change, and CMDB workflows for the orgs we modernize.' },
                { n: 'Jira Service Management', s: 'jirasoftware', c: '0052CC', desc: 'Lightweight ITSM and request fulfillment — preferred for product-led companies on Atlassian.' },
                { n: 'Atlassian Confluence', s: 'confluence',   c: '172B4D', desc: 'Architecture decision records, runbooks, and policy docs — the source of truth we leave behind.' },
                { n: 'Lucidchart',         s: 'lucid',          c: 'F36B16', desc: 'Reference architectures, network diagrams, and data flows — exported into every advisory deck.' },
                { n: 'LeanIX',             s: 'leanix',         c: 'F36B16', desc: 'Enterprise architecture management — application portfolios, business capabilities, lifecycle.' },
                { n: 'Apptio',             s: 'apptio',         c: '0040AA', desc: 'Technology business management — IT cost transparency, FinOps, and TCO modeling.' },
                { n: 'Okta',               s: 'okta',           c: '007DC1', desc: 'Identity & SSO — centralizes auth across SaaS for compliance, security, and JIT provisioning.' },
                { n: 'Splunk',             s: 'splunk',         c: '000000', desc: 'Logging, observability, and SIEM — operational telemetry and security audit trails.' },
                { n: 'Datadog',            s: 'datadog',        c: '632CA6', desc: 'Unified observability — APM, infrastructure metrics, logs, and synthetic monitoring.' },
                { n: 'PagerDuty',          s: 'pagerduty',      c: '06AC38', desc: 'On-call orchestration — runbooks, escalations, and incident retrospectives.' },
                { n: 'Microsoft 365',      url: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Microsoft_Office_logo_%282019%E2%80%93present%29.svg', desc: 'Productivity backbone — Teams, SharePoint, and Entra ID for the orgs we advise.' },
                { n: 'Slack',              s: 'slack',          c: '4A154B', desc: 'Cross-team collaboration, on-call channels, and lightweight ChatOps integrations.' },
                { n: 'Notion',             s: 'notion',         c: '000000', desc: 'Strategy decks, advisory artifacts, and decision logs — searchable across every engagement.' },
                { n: 'Asana',              s: 'asana',          c: 'F06A6A', desc: 'Program management for transformations — cross-team milestones, owners, and accountability.' },
                { n: 'Figma / FigJam',     s: 'figma',          c: 'F24E1E', desc: 'Collaborative whiteboards — workshops, journey maps, and stakeholder co-design sessions.' },
                { n: 'Tableau',            s: 'tableau',        c: 'E97627', desc: 'Executive-ready dashboards — IT spend, license utilization, and KPI tracking for the C-suite.' },
            ]}
            hideProjects={true}
            hideTestimonial={true}
            showClients={true}
            clientsPill="Trusted By IT Leaders"
            clientsHeading="From Mid-Market CIOs to Fortune 500 Boards,"
            clientsHeadingHighlight="We Make IT Strategy Real"
            extraSections={
                <>
                    <ItMaturityRadar />
                    <ItGanttRoadmap />
                    <ItcVideo />
                </>
            }
            googleReviews={[
                {
                    name: 'Christine Vandermeer',
                    role: 'CIO, Brightline Health',
                    rating: 5,
                    date: '2 months ago',
                    text: 'Their honest maturity score told us we were a 4 on security, not the 7 we were telling ourselves. Their remediation roadmap got us through SOC 2 + HIPAA cleanly within nine months.',
                },
                {
                    name: 'Imani Okonkwo',
                    role: 'VP Strategy, FinFleet',
                    rating: 5,
                    date: '4 months ago',
                    text: 'Independent vendor RFP across eleven categories. Their analysis was the cleanest, most opinionated decision document I have received from any consultancy. Saved us $1.4M over three years.',
                },
                {
                    name: 'Ben Kowalski',
                    role: 'Founder, Cordwell SaaS',
                    rating: 5,
                    date: '6 months ago',
                    text: 'Six-week strategy engagement that actually shipped. We had a roadmap, a Phase-1 PoC, and a hire plan — and the first two phases were live within four months.',
                },
                {
                    name: 'Anika Sharma',
                    role: 'Head of IT, Vertex Manufacturing',
                    rating: 5,
                    date: '3 months ago',
                    text: 'Their fractional CIO ran our IT for nine months while we hired a permanent leader. Costs dropped, two failing migrations got rescued, and the team held it together through the transition.',
                },
                {
                    name: 'Lukas Bauer',
                    role: 'Chief of Staff, Pulsemark Labs',
                    rating: 5,
                    date: '5 months ago',
                    text: 'Cloud cost audit + remediation cut our AWS bill 36%. They returned the engagement fee in the first month of savings alone.',
                },
                {
                    name: 'Sofia Gallo',
                    role: 'CTO, MeshCart',
                    rating: 5,
                    date: '7 months ago',
                    text: 'Honest assessment that our data wasn\'t ready for the AI use cases we wanted. They built the data plan first, then the AI plan — saved us a year of false starts.',
                },
            ]}
            googleReviewsHeading="What IT Leaders Say About Us"
            googleReviewsSubtitle="Verified reviews from CIOs, CTOs, and chiefs of staff we've shipped IT strategy and modernization with."
            faqs={[
                { q: 'What is IT consulting?', a: 'IT consulting helps leaders make smart technology decisions — strategy, architecture, vendor choice, security, cloud, and digital transformation — and execute them.' },
                { q: 'When should I hire an IT consultant?', a: 'Common moments include a major investment decision, modernization, growth or M&A, security or compliance need, or when internal teams lack the specific expertise.' },
                { q: 'Are you vendor-independent?', a: 'Yes. We are technology-agnostic. We recommend the right vendor or build approach for your situation, not based on partner incentives.' },
                { q: 'Can you also implement what you recommend?', a: 'Yes. We have engineering, cloud, DevOps, and AI delivery teams who can execute, or we can support your in-house team.' },
                { q: 'How does fractional CTO/CIO work?', a: 'A senior leader embeds with your team for a defined number of days per week or month, owning strategy and execution support without a full-time hire.' },
                { q: 'How do you handle confidentiality?', a: 'NDAs and strict access controls are standard. We treat your data and systems with the same discipline as a regulated enterprise.' },
                { q: 'How is success measured?', a: 'Clear outcomes — cost savings, faster releases, reduced incidents, completed audits, or new capabilities — agreed up front and tracked.' },
            ]}
        />
    );
}
