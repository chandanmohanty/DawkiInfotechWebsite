import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import ServicePageTemplate, { ICON } from '@/components/ServicePageTemplate';

/* ===========================================================================
 * Section 1: OKR Cascade Tree
 * ----------------------------------------------------------------------------
 * Visual hierarchy: 1 Company OKR → 3 Department OKRs → 6 Individual key
 * results. Each node shows progress %, owner avatar, status pill. Connector
 * lines draw in on scroll. Distinct visual: a bottom-up org-tree, not a
 * dashboard, not a kanban. Specific to performance-management software.
 * =========================================================================== */

/** ease-out count-up. Triggers on scroll-into-view. */
const useCountUp = (target: number, dur = 1500, active = true) => {
    const [v, setV] = useState(0);
    useEffect(() => {
        if (!active) return;
        let raf = 0;
        const start = performance.now();
        const tick = (now: number) => {
            const t = Math.min(1, (now - start) / dur);
            const eased = 1 - Math.pow(1 - t, 3);
            setV(Math.round(target * eased));
            if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [target, dur, active]);
    return v;
};

type Status = 'on-track' | 'at-risk' | 'off-track';
const STATUS_LABEL: Record<Status, string> = { 'on-track': 'On Track', 'at-risk': 'At Risk', 'off-track': 'Off Track' };

const OkrCascade: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });

    /* Top-of-section count-ups */
    const okrsTracked = useCountUp(842, 1800, inView);
    const onTrack = useCountUp(72, 1600, inView);
    const cycleDays = useCountUp(91, 1200, inView);

    /* Company OKR progress (single big ring) */
    const ringTarget = 68;
    const ring = useCountUp(ringTarget, 1800, inView);
    const ringDash = useMemo(() => 2 * Math.PI * 56, []);
    const ringOffset = ringDash * (1 - ring / 100);

    const departments: { name: string; pct: number; status: Status; accent: string; glow: string }[] = [
        { name: 'Product',     pct: 76, status: 'on-track', accent: '#5b9eff', glow: 'rgba(91, 158, 255, 0.40)' },
        { name: 'Engineering', pct: 64, status: 'on-track', accent: '#a855f7', glow: 'rgba(168, 85, 247, 0.40)' },
        { name: 'Go-To-Market', pct: 48, status: 'at-risk', accent: '#f97316', glow: 'rgba(249, 115, 22, 0.40)' },
    ];

    const keyResults: { dept: number; title: string; owner: string; pct: number; status: Status }[] = [
        { dept: 0, title: 'Ship 4 enterprise modules',  owner: 'AP', pct: 82, status: 'on-track' },
        { dept: 0, title: 'NPS ≥ 56 across cohorts',     owner: 'MK', pct: 70, status: 'on-track' },
        { dept: 1, title: 'P95 latency under 220ms',     owner: 'RH', pct: 64, status: 'on-track' },
        { dept: 1, title: 'Reduce incident MTTR to 18m', owner: 'JW', pct: 58, status: 'at-risk' },
        { dept: 2, title: 'Pipeline coverage 3.2×',      owner: 'DS', pct: 51, status: 'at-risk' },
        { dept: 2, title: 'EMEA expansion: 12 logos',    owner: 'EM', pct: 34, status: 'off-track' },
    ];

    return (
        <section className="dawki-pm-okr">
            <div className="container">
                <div className="dawki-pm-okr-heading">
                    <span className="dawki-pm-okr-pill">
                        <span></span>
                        OKRs &amp; Goal Cascade
                    </span>
                    <h2 className="dawki-pm-okr-title">
                        From Company Mission Down to <span>Every Individual Key Result</span>
                    </h2>
                    <p className="dawki-pm-okr-subtitle">
                        Performance-management software we ship cascades a single company OKR through every department and lands on the individual KR — with live progress and AI status calls.
                    </p>
                </div>

                <motion.div
                    ref={ref}
                    className="dawki-pm-okr-frame"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                >
                    {/* Top stats bar */}
                    <div className="dawki-pm-okr-bar">
                        <div className="dawki-pm-okr-bar-meta">
                            <span><i></i>LIVE · cascade refreshed 14:32</span>
                        </div>
                        <div className="dawki-pm-okr-bar-stats">
                            <span><strong>{okrsTracked}</strong> OKRs tracked</span>
                            <span><strong>{onTrack}%</strong> on track</span>
                            <span>cycle <strong>day {cycleDays}/90</strong></span>
                        </div>
                    </div>

                    <div className="dawki-pm-okr-tree">
                        {/* Company node */}
                        <div className="dawki-pm-okr-row dawki-pm-okr-row-company">
                            <div className="dawki-pm-okr-company">
                                <div className="dawki-pm-okr-company-ring">
                                    <svg viewBox="0 0 128 128" aria-hidden="true">
                                        <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(255, 255, 255, 0.10)" strokeWidth="10" />
                                        <circle
                                            cx="64" cy="64" r="56"
                                            fill="none"
                                            stroke="url(#dawki-pm-ring-grad)"
                                            strokeWidth="10"
                                            strokeLinecap="round"
                                            strokeDasharray={ringDash}
                                            strokeDashoffset={ringOffset}
                                            transform="rotate(-90 64 64)"
                                            style={{ transition: 'stroke-dashoffset 1.4s ease' }}
                                        />
                                        <defs>
                                            <linearGradient id="dawki-pm-ring-grad" x1="0" y1="0" x2="1" y2="1">
                                                <stop offset="0%" stopColor="#5b9eff" />
                                                <stop offset="100%" stopColor="#a855f7" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <span className="dawki-pm-okr-company-pct">{ring}<i>%</i></span>
                                </div>
                                <div className="dawki-pm-okr-company-body">
                                    <span className="dawki-pm-okr-company-tag">COMPANY OKR · Q3 FY26</span>
                                    <h3 className="dawki-pm-okr-company-title">Become the #1 mid-market HR platform in APAC</h3>
                                    <p className="dawki-pm-okr-company-meta">Owner · CEO · 14 KRs · 3 functions</p>
                                </div>
                            </div>
                        </div>

                        {/* Connector lines (decorative) */}
                        <div className="dawki-pm-okr-connectors" aria-hidden="true">
                            <span></span><span></span><span></span>
                        </div>

                        {/* Department row */}
                        <div className="dawki-pm-okr-row dawki-pm-okr-row-dept">
                            {departments.map((d, i) => (
                                <motion.div
                                    key={d.name}
                                    className="dawki-pm-okr-dept"
                                    style={{
                                        ['--n-accent' as string]: d.accent,
                                        ['--n-glow' as string]: d.glow,
                                    }}
                                    initial={{ opacity: 0, y: 14 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-80px' }}
                                    transition={{ duration: 0.5, delay: 0.15 + i * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
                                >
                                    <div className="dawki-pm-okr-dept-head">
                                        <span className="dawki-pm-okr-dept-name">{d.name}</span>
                                        <span className={`dawki-pm-okr-status is-${d.status}`}>{STATUS_LABEL[d.status]}</span>
                                    </div>
                                    <div className="dawki-pm-okr-bar-line">
                                        <span style={{ width: inView ? `${d.pct}%` : '0%' }}></span>
                                    </div>
                                    <div className="dawki-pm-okr-dept-foot">
                                        <span>{d.pct}% complete</span>
                                        <span>2 KRs</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Connector lines down */}
                        <div className="dawki-pm-okr-connectors dawki-pm-okr-connectors-down" aria-hidden="true">
                            <span></span><span></span><span></span><span></span><span></span><span></span>
                        </div>

                        {/* Key Results row */}
                        <div className="dawki-pm-okr-row dawki-pm-okr-row-kr">
                            {keyResults.map((k, i) => (
                                <motion.div
                                    key={i}
                                    className="dawki-pm-okr-kr"
                                    initial={{ opacity: 0, y: 14 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-80px' }}
                                    transition={{ duration: 0.45, delay: 0.45 + i * 0.06, ease: [0.2, 0.8, 0.2, 1] }}
                                >
                                    <div className="dawki-pm-okr-kr-top">
                                        <span className="dawki-pm-okr-kr-avatar">{k.owner}</span>
                                        <span className={`dawki-pm-okr-status is-${k.status}`}>{STATUS_LABEL[k.status]}</span>
                                    </div>
                                    <p className="dawki-pm-okr-kr-title">{k.title}</p>
                                    <div className="dawki-pm-okr-bar-line">
                                        <span style={{ width: inView ? `${k.pct}%` : '0%' }}></span>
                                    </div>
                                    <span className="dawki-pm-okr-kr-pct">{k.pct}%</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

/* ===========================================================================
 * Section 2: 360° Feedback Radar
 * ----------------------------------------------------------------------------
 * Animated polar / radar chart for an employee performance review showing
 * scores across 6 competencies — paths draw in. Side panel shows
 * Manager / Peer / Direct-Report / Self comparison + AI-summarised verdict.
 * Visually distinct (SVG radar) from anything else on the site.
 * =========================================================================== */
type Axis = { label: string; m: number; p: number; r: number; s: number };
const AXES: Axis[] = [
    { label: 'Leadership',     m: 4.4, p: 4.1, r: 4.0, s: 3.6 },
    { label: 'Technical',      m: 4.7, p: 4.5, r: 4.6, s: 4.3 },
    { label: 'Communication',  m: 4.2, p: 4.3, r: 4.1, s: 4.0 },
    { label: 'Collaboration',  m: 4.5, p: 4.6, r: 4.4, s: 4.1 },
    { label: 'Innovation',     m: 4.0, p: 3.8, r: 3.9, s: 3.7 },
    { label: 'Execution',      m: 4.6, p: 4.4, r: 4.5, s: 4.2 },
];

const RADAR_SIZE = 320;
const RADAR_CENTER = RADAR_SIZE / 2;
const RADAR_RADIUS = 130;
const RADAR_RINGS = 5;

/** Build an SVG polygon points string from axis values 0-5. */
const polyPoints = (vals: number[]) => {
    const n = vals.length;
    return vals
        .map((v, i) => {
            const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
            const r = (v / 5) * RADAR_RADIUS;
            const x = RADAR_CENTER + r * Math.cos(angle);
            const y = RADAR_CENTER + r * Math.sin(angle);
            return `${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(' ');
};

const FeedbackRadar: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });

    /* Auto-cycle which "rater group" is highlighted (Manager/Peer/Self/Report) */
    const RATERS = ['m', 'p', 'r', 's'] as const;
    type Rater = typeof RATERS[number];
    const RATER_LABEL: Record<Rater, string> = { m: 'Manager', p: 'Peers (4)', r: 'Reports (3)', s: 'Self' };
    const RATER_COLOR: Record<Rater, { stroke: string; fill: string; tag: string }> = {
        m: { stroke: '#5b9eff', fill: 'rgba(91, 158, 255, 0.18)', tag: 'rgba(91, 158, 255, 0.12)' },
        p: { stroke: '#a855f7', fill: 'rgba(168, 85, 247, 0.18)', tag: 'rgba(168, 85, 247, 0.12)' },
        r: { stroke: '#22c55e', fill: 'rgba(34, 197, 94, 0.18)',  tag: 'rgba(34, 197, 94, 0.12)' },
        s: { stroke: '#f97316', fill: 'rgba(249, 115, 22, 0.18)', tag: 'rgba(249, 115, 22, 0.12)' },
    };

    const [active, setActive] = useState<Rater>('m');
    useEffect(() => {
        if (!inView) return;
        const id = setInterval(() => {
            setActive((a) => RATERS[(RATERS.indexOf(a) + 1) % RATERS.length]);
        }, 2200);
        return () => clearInterval(id);
    }, [inView]);

    const overall = useCountUp(43, 1500, inView); // shown as "4.3"
    const trend = useCountUp(18, 1500, inView);   // +18% YoY

    /* Pre-compute polygon point strings */
    const polys = useMemo(() => ({
        m: polyPoints(AXES.map((a) => a.m)),
        p: polyPoints(AXES.map((a) => a.p)),
        r: polyPoints(AXES.map((a) => a.r)),
        s: polyPoints(AXES.map((a) => a.s)),
    }), []);

    return (
        <section className="dawki-pm-radar">
            <div className="container">
                <div className="dawki-pm-radar-heading">
                    <span className="dawki-pm-radar-pill">
                        <span></span>
                        360° Reviews &amp; Feedback
                    </span>
                    <h2 className="dawki-pm-radar-title">
                        Multi-Rater Reviews That <span>Reveal a Complete Picture, Not a Number</span>
                    </h2>
                    <p className="dawki-pm-radar-subtitle">
                        Performance platforms we engineer go beyond a single rating — manager, peers, reports, and self all measured on the same axes, with AI bias-checking baked in.
                    </p>
                </div>

                <motion.div
                    ref={ref}
                    className="dawki-pm-radar-frame"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                >
                    {/* Left: SVG radar */}
                    <div className="dawki-pm-radar-stage">
                        <div className="dawki-pm-radar-stage-head">
                            <div>
                                <span className="dawki-pm-radar-stage-name">Aarav Patel · Senior PM</span>
                                <span className="dawki-pm-radar-stage-meta">Cycle Q3 FY26 · 8 raters</span>
                            </div>
                            <div className="dawki-pm-radar-stage-score">
                                <strong>{(overall / 10).toFixed(1)}</strong>
                                <em>overall · ↑ {trend}%</em>
                            </div>
                        </div>

                        <svg className="dawki-pm-radar-svg" viewBox={`0 0 ${RADAR_SIZE} ${RADAR_SIZE}`} aria-hidden="true">
                            {/* concentric ring grid */}
                            {Array.from({ length: RADAR_RINGS }, (_, i) => {
                                const r = ((i + 1) / RADAR_RINGS) * RADAR_RADIUS;
                                const pts = AXES.map((_, j) => {
                                    const angle = -Math.PI / 2 + (j * 2 * Math.PI) / AXES.length;
                                    return `${(RADAR_CENTER + r * Math.cos(angle)).toFixed(1)},${(RADAR_CENTER + r * Math.sin(angle)).toFixed(1)}`;
                                }).join(' ');
                                return (
                                    <polygon
                                        key={i}
                                        points={pts}
                                        fill="none"
                                        stroke={i === RADAR_RINGS - 1 ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.08)'}
                                        strokeWidth={i === RADAR_RINGS - 1 ? 1.2 : 1}
                                    />
                                );
                            })}
                            {/* radial spokes + labels */}
                            {AXES.map((axis, i) => {
                                const angle = -Math.PI / 2 + (i * 2 * Math.PI) / AXES.length;
                                const x2 = RADAR_CENTER + RADAR_RADIUS * Math.cos(angle);
                                const y2 = RADAR_CENTER + RADAR_RADIUS * Math.sin(angle);
                                const lx = RADAR_CENTER + (RADAR_RADIUS + 22) * Math.cos(angle);
                                const ly = RADAR_CENTER + (RADAR_RADIUS + 22) * Math.sin(angle);
                                return (
                                    <g key={axis.label}>
                                        <line x1={RADAR_CENTER} y1={RADAR_CENTER} x2={x2} y2={y2} stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
                                        <text x={lx} y={ly} fill="rgba(255,255,255,0.75)" fontSize="11" fontWeight="700" textAnchor="middle" dominantBaseline="central">{axis.label}</text>
                                    </g>
                                );
                            })}
                            {/* polygons */}
                            {RATERS.map((r) => {
                                const c = RATER_COLOR[r];
                                const isActive = active === r;
                                return (
                                    <motion.polygon
                                        key={r}
                                        points={polys[r]}
                                        fill={c.fill}
                                        stroke={c.stroke}
                                        strokeWidth={isActive ? 2.5 : 1.4}
                                        initial={{ opacity: 0, scale: 0.4 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true, margin: '-80px' }}
                                        transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1], delay: RATERS.indexOf(r) * 0.18 }}
                                        style={{
                                            transformOrigin: `${RADAR_CENTER}px ${RADAR_CENTER}px`,
                                            transition: 'stroke-width 0.4s ease, opacity 0.4s ease',
                                            opacity: isActive ? 1 : 0.5,
                                        }}
                                    />
                                );
                            })}
                            {/* center dot */}
                            <circle cx={RADAR_CENTER} cy={RADAR_CENTER} r="4" fill="rgba(255,255,255,0.55)" />
                        </svg>

                        <div className="dawki-pm-radar-legend">
                            {RATERS.map((r) => {
                                const c = RATER_COLOR[r];
                                return (
                                    <button
                                        key={r}
                                        type="button"
                                        className={`dawki-pm-radar-legend-item ${active === r ? 'is-active' : ''}`}
                                        onClick={() => setActive(r)}
                                        style={{ ['--leg-c' as string]: c.stroke, ['--leg-tag' as string]: c.tag }}
                                    >
                                        <i></i>
                                        {RATER_LABEL[r]}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Rater feedback panel */}
                    <div className="dawki-pm-radar-side">
                        <div className="dawki-pm-radar-side-head">
                            <span className="dawki-pm-radar-side-tag">AI · BIAS-CHECKED</span>
                            <h3>Highlights from this cycle</h3>
                        </div>
                        <ul className="dawki-pm-radar-side-list">
                            <li className="dawki-pm-radar-side-row">
                                <span className="dawki-pm-radar-side-row-tag is-strength">STRENGTH</span>
                                <p>Technical depth + execution rated highest by both manager and direct reports — consistent across the 360.</p>
                            </li>
                            <li className="dawki-pm-radar-side-row">
                                <span className="dawki-pm-radar-side-row-tag is-growth">GROWTH AREA</span>
                                <p>Self-rating on Innovation is below all rater groups — coach to unblock confidence in proposing bolder bets.</p>
                            </li>
                            <li className="dawki-pm-radar-side-row">
                                <span className="dawki-pm-radar-side-row-tag is-watch">WATCH</span>
                                <p>Leadership scores diverge by 0.8 between Self and Manager — schedule a calibration conversation.</p>
                            </li>
                        </ul>

                        <div className="dawki-pm-radar-side-foot">
                            <div>
                                <span>Calibration confidence</span>
                                <strong>92%</strong>
                            </div>
                            <span className="dawki-pm-radar-side-cta">Generate review draft</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

/* ===========================================================================
 * Page
 * =========================================================================== */
export default function PerformanceManagement() {
    return (
        <ServicePageTemplate
            pageTitle="Performance Management Software"
            breadcrumbCategory="Industries"
            heroPill="Industries"
            heroTitleStart="Performance Management"
            heroTitleHighlight="Platforms & HR Tech"
            heroSubtitle="OKR platforms, 360° review systems, continuous-feedback tools, talent reviews, succession planning, and AI calibration — engineered for HR leaders, COOs, and people teams."
            heroVideoSrc="/assets/images/header/demo/business-intelligence-services.mp4"
            featuresPill="People-Tech Engineering"
            featuresTitleStart="Software That Aligns Goals,"
            featuresTitleHighlight="Reviews & Career Growth"
            featuresSubtitle="From a 200-person scale-up to a 50,000-person enterprise — we ship performance platforms that lift engagement, reduce attrition, and make calibration finally fair."
            features={[
                { title: 'OKR & Goal Cascade',         desc: 'Company → department → team → individual cascade with live progress + AI status.', icon: '🎯' },
                { title: '360° Multi-Rater Reviews',   desc: 'Manager, peers, reports, and self on the same axes — with AI bias-checking.',         icon: '🧭' },
                { title: 'Continuous Feedback',        desc: 'Lightweight kudos, 1:1 templates, real-time recognition feeds, AI summaries.',        icon: '💬' },
                { title: 'AI Calibration',              desc: 'Detect rating bias by manager / team / demographic before reviews close.',           icon: '🤖' },
                { title: 'Talent Review Boards',        desc: '9-box, succession plans, talent pools, internal-mobility recommendations.',          icon: '📊' },
                { title: 'HRIS & Slack Integrations',   desc: 'Workday, BambooHR, HiBob, Personio, Slack, MS Teams — single source of truth.',     icon: '🔗' },
            ]}
            processSteps={[
                { n: '01', t: 'Discovery',         d: 'Map your current performance cycle — cadence, rater pools, calibration norms, OKR maturity.' },
                { n: '02', t: 'Architecture',     d: 'Data model for orgs, cycles, axes, weights — plus HRIS adapters + AI bias-check pipeline.' },
                { n: '03', t: 'Build',             d: 'Iterative sprints with HRBP pilots + manager-in-the-loop testing + accessibility audits.' },
                { n: '04', t: 'Roll Out & Train', d: 'Phased per-business-unit rollout + manager enablement + 30-day hyper-care + AI re-tuning.' },
            ]}
            servicesPill="Our Capabilities"
            servicesTitleStart="Explore Our Range of"
            servicesTitleHighlight="Performance & People-Tech Services"
            servicesSubtitle="Goals, reviews, feedback, talent, succession, engagement, and learning — across global enterprises, tech-led scale-ups, and HR-tech startups."
            servicesLayout="timeline"
            serviceCards={[
                { title: 'OKR & Goal Platforms',           desc: 'Cascade, alignment maps, weekly check-ins, retrospective scoring — Workboard / Lattice-class systems.', icon: ICON.box },
                { title: '360° Review Systems',            desc: 'Multi-rater forms, weighted axes, anonymous peer prompts, calibration boards, AI verdict drafts.',      icon: ICON.users },
                { title: 'Continuous Feedback & Kudos',    desc: 'Slack / Teams native kudos, 1:1 templates, real-time recognition wall, sentiment tracking.',              icon: ICON.headset },
                { title: 'AI Bias & Calibration',          desc: 'Detect rater leniency / strictness / demographic bias before reviews are finalised.',                   icon: ICON.bot },
                { title: '9-Box & Talent Review',          desc: 'Performance × Potential grids, talent pools, succession depth charts, internal-mobility scoring.',     icon: ICON.chart },
                { title: 'Compensation & Promotion',       desc: 'Merit increase planning, equity refresh, promotion eligibility, total-rewards modelling.',              icon: ICON.shield },
                { title: 'Engagement & Pulse Surveys',     desc: 'NPS, eNPS, Glint-style pulse, AI theme extraction from open-text, action plans per manager.',           icon: ICON.refresh },
                { title: 'Career & Skills Frameworks',     desc: 'Skill ontologies, career-ladder builders, IDPs, learning recommendations powered by skills-graph AI.',  icon: ICON.palette },
                { title: 'HRIS / SSO / Provisioning',      desc: 'Workday, BambooHR, HiBob, ADP, Personio, Greenhouse — bi-directional sync + SCIM + Okta SSO.',         icon: ICON.cog },
                { title: 'Manager & Coaching Apps',        desc: 'Pre-1:1 prep, AI talk-track suggestions, action-item tracking, follow-up nudges.',                      icon: ICON.eye },
                { title: 'Analytics & Workforce Insights', desc: 'Attrition prediction, hot-team alerts, manager-effectiveness scores, DEI dashboards.',                  icon: ICON.cloud },
                { title: 'Compliance & Audit',             desc: 'GDPR, SOC 2, ISO 27001, EEOC reporting, calibration audit logs, retention policies per region.',        icon: ICON.rocket },
            ]}
            toolsTitleStart="People-Tech Stack &"
            toolsTitleHighlight="AI Tools We Build With"
            toolsSubtitle="Battle-tested HRIS adapters, OKR engines, review platforms, sentiment AI, and bias-check models — the stack we ship every performance-management engagement on."
            toolsLayout="vertical"
            tools={[
                { n: 'Workday',           s: 'workday',      c: '0875E1', desc: 'Workday HCM + Talent Optimization integrations — write-back of ratings, comp, promotion outcomes.' },
                { n: 'BambooHR',          s: 'bamboohr',     c: '8FCE3F', desc: 'Mid-market HRIS — bi-directional employee, org, and lifecycle event sync.' },
                { n: 'HiBob',             s: 'hibob',        c: 'E8447D', desc: 'Modern people-platform — sync orgs, lifecycle events, anniversaries, and time-off into reviews.' },
                { n: 'Personio',          s: 'personio',     c: '00B9B5', desc: 'European HRIS — full bi-directional integration including local compliance fields.' },
                { n: 'ADP',               s: 'adp',          c: 'D81F23', desc: 'Payroll + HCM data feed for compensation modelling and promotion-impact analysis.' },
                { n: 'Lattice',           s: 'lattice',      c: '7C3AED', desc: 'When clients want to extend Lattice — we build custom modules, not replace it.' },
                { n: '15Five',            s: '15five',       c: 'F0463A', desc: 'Continuous feedback + check-in extensions and custom analytics dashboards on top.' },
                { n: 'Culture Amp',       s: 'cultureamp',   c: '00C09F', desc: 'Engagement + survey integrations — pipe responses into our calibration + manager-coach AI.' },
                { n: 'OpenAI / GPT-4',    s: 'openai',       c: '412991', desc: 'Review summarisation, peer-feedback de-bias rewrites, manager talk-track generation.' },
                { n: 'Claude',            s: 'anthropic',    c: 'D97757', desc: 'Long-context calibration narratives, IDP drafting, succession-plan reasoning.' },
                { n: 'Hugging Face',      s: 'huggingface',  c: 'FFD21E', desc: 'Custom sentiment + theme-extraction models tuned to internal feedback corpora.' },
                { n: 'Eightfold AI',      s: 'eightfold',    c: '00A0DF', desc: 'Talent-intelligence overlay — internal mobility, skills-gap mapping, succession depth.' },
                { n: 'Greenhouse',        s: 'greenhouse',   c: '24A47F', desc: 'ATS integration — pipe new-hire profiles + interview scorecards into the review engine.' },
                { n: 'Slack',             s: 'slack',        c: '4A154B', desc: 'Slack-native kudos, 1:1 nudges, peer-feedback prompts, anonymous channels.' },
                { n: 'Microsoft Teams',   s: 'microsoftteams', c: '5059C9', desc: 'Teams-native check-ins + Viva Goals tie-in + meeting-aware coaching prompts.' },
                { n: 'Okta + SCIM',       s: 'okta',         c: '007DC1', desc: 'SSO + SCIM provisioning, role-based access, JIT user creation, audit logs.' },
            ]}
            hideProjects={true}
            hideTestimonial={true}
            showClients={true}
            clientsPill="Trusted By People Teams & HR Leaders"
            clientsHeading="From High-Growth Scale-Ups to Global Enterprises,"
            clientsHeadingHighlight="We Engineer Performance Tech That People Actually Use"
            extraSections={
                <>
                    <OkrCascade />
                    <FeedbackRadar />
                </>
            }
            googleReviews={[
                {
                    name: 'Sneha Krishnan',
                    role: 'CHRO, NorthLight Tech (3,400 employees)',
                    rating: 5,
                    date: '2 months ago',
                    text: 'Custom OKR + 360 platform replacing Lattice across our 4 BUs. Cycle completion went from 71% to 96% and average rating-write time dropped from 38 to 11 minutes per report.',
                },
                {
                    name: 'Hardik Bhargava',
                    role: 'VP People Ops, Saanvi Cloud',
                    rating: 5,
                    date: '4 months ago',
                    text: 'AI bias-check before calibration locked. Inter-rater drift came down by 31% in the first cycle and our DEI working-group lead said it was the cleanest calibration data they have seen.',
                },
                {
                    name: 'Marcus Holloway',
                    role: 'Head of Talent, Northbeam HR',
                    rating: 5,
                    date: '6 months ago',
                    text: 'Continuous feedback module wired into Slack with AI summaries before every 1:1. Manager NPS went from +12 to +47 in two quarters. Our engagement score followed.',
                },
                {
                    name: 'Rohini Shankar',
                    role: 'Founder, BrightCloud HR-Tech',
                    rating: 5,
                    date: '3 months ago',
                    text: 'White-label review platform for our customers. We launched in 14 weeks instead of the year our internal team estimated and our churn dropped by 22% post-launch.',
                },
                {
                    name: 'Diego Salazar',
                    role: 'COO, Spectra Hospitality (12 properties)',
                    rating: 5,
                    date: '5 months ago',
                    text: 'Performance + 9-box + succession across all our properties. We finally know our bench depth on every key role — first proper succession review in 11 years took 90 minutes, not 9 weeks.',
                },
                {
                    name: 'Emily Chen',
                    role: 'Director of People Analytics, Polestar Software',
                    rating: 5,
                    date: '7 months ago',
                    text: 'Custom analytics layer over our HRIS — attrition prediction, hot-team alerts, manager-effectiveness scores. Voluntary regrettable attrition fell 14% in two quarters.',
                },
            ]}
            googleReviewsHeading="What CHROs &amp; People Leaders Say About Us"
            googleReviewsSubtitle="Verified reviews from heads of HR, talent, and people analytics we've shipped performance platforms with."
            faqs={[
                { q: 'Do you build OKR / 360 / continuous-feedback platforms?',
                  a: 'All three — and the integrations between them. Most clients start with one (usually 360 reviews) and add OKR + continuous feedback in later phases.' },
                { q: 'Can you integrate with Workday / BambooHR / HiBob / Personio?',
                  a: 'Yes — bi-directional with all four, plus ADP, Greenhouse, Lattice, 15Five, Slack, Teams, Okta, and Google Workspace. SCIM provisioning is standard.' },
                { q: 'Can you build AI bias-checking and calibration?',
                  a: 'Yes — we build models that flag rater leniency, strictness, demographic skew, and inter-rater drift before calibration meetings, with explainable outputs.' },
                { q: 'Do you handle 9-box, succession, and internal mobility?',
                  a: 'Yes — Performance × Potential grids, talent pools, succession depth charts, and internal-mobility recommendations powered by a skills graph.' },
                { q: 'Is the platform multi-language and global-payroll aware?',
                  a: 'Yes — multi-language, multi-currency, region-specific compliance fields (EEOC, GDPR, India POSH, etc), and works across 40+ countries.' },
                { q: 'How long does a performance platform take to build?',
                  a: 'A focused module (e.g. 360 reviews) launches in 10–14 weeks. A full OKR + reviews + feedback + talent suite typically launches in 5–9 months.' },
                { q: 'Do you offer SOC 2 / ISO 27001 / GDPR-compliant builds?',
                  a: 'Yes — security and compliance are baked in from day one. SOC 2 Type II, ISO 27001, GDPR + UK GDPR, India DPDPA, and US-state privacy.' },
                { q: 'Do you offer 24/7 support after launch?',
                  a: 'Yes. Phone, WhatsApp, and on-call engineering rotations included on enterprise contracts — performance cycles do not stop for weekends.' },
            ]}
        />
    );
}
