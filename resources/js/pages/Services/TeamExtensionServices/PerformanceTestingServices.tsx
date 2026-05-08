import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ServicePageTemplate, { ICON } from '@/components/ServicePageTemplate';

/* ===========================================================================
 * Section 1: Live Load Test Dashboard — animated monitoring console mockup
 * with RPS counter, latency KPIs, concurrent-users gauge, and a sparkline.
 * Visually unique to this page — no other service page uses this layout.
 * =========================================================================== */

/** Smooth ease-out ramp from 0 → target over `duration` ms, paused until
 * the element scrolls into view (`active`). Lightweight rAF, no libs. */
const useCountUp = (target: number, duration = 2200, active = true) => {
    const [val, setVal] = useState(0);
    useEffect(() => {
        if (!active) return;
        let raf = 0;
        const start = performance.now();
        const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setVal(Math.round(target * eased));
            if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [target, duration, active]);
    return val;
};

const LiveDashboard: React.FC = () => {
    const [active, setActive] = useState(false);
    const ref = React.useRef<HTMLDivElement>(null);

    /* Trigger counters once when the dashboard scrolls into view */
    useEffect(() => {
        if (!ref.current) return;
        const io = new IntersectionObserver(
            (entries) => entries.forEach((e) => e.isIntersecting && setActive(true)),
            { threshold: 0.3 }
        );
        io.observe(ref.current);
        return () => io.disconnect();
    }, []);

    const rps = useCountUp(12847, 2400, active);
    const users = useCountUp(98420, 2600, active);
    const p50 = useCountUp(42, 2000, active);
    const p95 = useCountUp(128, 2200, active);
    const p99 = useCountUp(312, 2400, active);

    // Gauge percentage (concurrent users / capacity 100k)
    const gaugePct = active ? Math.min(100, (users / 100000) * 100) : 0;

    return (
        <section className="dawki-perf-dash">
            <div className="container">
                <div className="dawki-perf-dash-heading">
                    <span className="dawki-perf-dash-pill">
                        <span className="dawki-perf-dash-pill-dot"></span>
                        Live Test Console
                    </span>
                    <h2 className="dawki-perf-dash-title">
                        See How Your Stack <span>Holds Up Under Load</span>
                    </h2>
                    <p className="dawki-perf-dash-subtitle">
                        A real-time view of every load test we run for you — RPS, p50 / p95 / p99 latency, error rate, and live capacity utilisation streamed straight from k6 + Datadog.
                    </p>
                </div>

                <motion.div
                    ref={ref}
                    className="dawki-perf-dash-frame"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                >
                    {/* Console top bar */}
                    <div className="dawki-perf-dash-bar">
                        <div className="dawki-perf-dash-bar-dots">
                            <span></span><span></span><span></span>
                        </div>
                        <div className="dawki-perf-dash-bar-tabs">
                            <span className="dawki-perf-dash-bar-tab is-active">Live Test · prod-load</span>
                            <span className="dawki-perf-dash-bar-tab">Capacity</span>
                            <span className="dawki-perf-dash-bar-tab">Errors</span>
                        </div>
                        <div className="dawki-perf-dash-bar-status">
                            <span className="dawki-perf-dash-pulse"></span>
                            RUNNING · 04:23
                        </div>
                    </div>

                    <div className="dawki-perf-dash-grid">
                        {/* RPS — hero metric */}
                        <div className="dawki-perf-dash-rps">
                            <span className="dawki-perf-dash-label">REQUESTS / SEC</span>
                            <strong>{rps.toLocaleString('en-US')}</strong>
                            <span className="dawki-perf-dash-trend up">↑ 12.4% above target</span>
                        </div>

                        {/* Concurrent users — circular gauge */}
                        <div className="dawki-perf-dash-gauge">
                            <svg viewBox="0 0 100 100" aria-hidden="true">
                                <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="none" />
                                <motion.circle
                                    cx="50" cy="50" r="42"
                                    stroke="url(#perfGaugeGrad)"
                                    strokeWidth="8"
                                    fill="none"
                                    strokeLinecap="round"
                                    transform="rotate(-90 50 50)"
                                    strokeDasharray={2 * Math.PI * 42}
                                    initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                                    animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - gaugePct / 100) }}
                                    transition={{ duration: 2.4, ease: [0.2, 0.8, 0.2, 1] }}
                                />
                                <defs>
                                    <linearGradient id="perfGaugeGrad" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#22c55e" />
                                        <stop offset="100%" stopColor="#06b6d4" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="dawki-perf-dash-gauge-text">
                                <strong>{users.toLocaleString('en-US')}</strong>
                                <span>active users</span>
                            </div>
                        </div>

                        {/* Latency KPIs */}
                        <div className="dawki-perf-dash-kpi">
                            <span>p50</span>
                            <strong>{p50}<em>ms</em></strong>
                        </div>
                        <div className="dawki-perf-dash-kpi">
                            <span>p95</span>
                            <strong>{p95}<em>ms</em></strong>
                        </div>
                        <div className="dawki-perf-dash-kpi">
                            <span>p99</span>
                            <strong>{p99}<em>ms</em></strong>
                        </div>
                        <div className="dawki-perf-dash-kpi dawki-perf-dash-kpi--err">
                            <span>error rate</span>
                            <strong>0.04<em>%</em></strong>
                        </div>

                        {/* Sparkline graph */}
                        <div className="dawki-perf-dash-graph">
                            <div className="dawki-perf-dash-graph-head">
                                <span>RPS over last 5 min</span>
                                <span className="dawki-perf-dash-graph-legend">
                                    <i style={{ background: '#22c55e' }}></i>actual
                                    <i style={{ background: '#5b9eff', marginLeft: 10 }}></i>target
                                </span>
                            </div>
                            <svg viewBox="0 0 400 100" preserveAspectRatio="none" aria-hidden="true">
                                {/* Target line */}
                                <line x1="0" y1="60" x2="400" y2="60" stroke="rgba(91,158,255,0.40)" strokeWidth="1" strokeDasharray="4 4" />
                                {/* Actual sparkline (precomputed control points) */}
                                <motion.path
                                    d="M0,80 L40,72 L80,68 L120,55 L160,48 L200,42 L240,38 L280,30 L320,28 L360,22 L400,18"
                                    fill="none"
                                    stroke="url(#perfLineGrad)"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    initial={{ pathLength: 0 }}
                                    whileInView={{ pathLength: 1 }}
                                    viewport={{ once: true, margin: '-80px' }}
                                    transition={{ duration: 2.0, ease: [0.2, 0.8, 0.2, 1] }}
                                />
                                <motion.path
                                    d="M0,80 L40,72 L80,68 L120,55 L160,48 L200,42 L240,38 L280,30 L320,28 L360,22 L400,18 L400,100 L0,100 Z"
                                    fill="url(#perfFillGrad)"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true, margin: '-80px' }}
                                    transition={{ duration: 1.0, delay: 1.5 }}
                                />
                                <defs>
                                    <linearGradient id="perfLineGrad" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#22c55e" />
                                        <stop offset="100%" stopColor="#06b6d4" />
                                    </linearGradient>
                                    <linearGradient id="perfFillGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="rgba(34,197,94,0.30)" />
                                        <stop offset="100%" stopColor="rgba(34,197,94,0)" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

/* ===========================================================================
 * Section 2: Test Type Quadrant — 2x2 axis-mapped matrix of the four
 * canonical performance test types, positioned by intensity vs duration.
 * Visually completely distinct from any previous custom section.
 * =========================================================================== */
type QuadrantCard = {
    pos: 'tl' | 'tr' | 'bl' | 'br';
    name: string;
    short: string;
    desc: string;
    when: string;
    a: string; b: string; glow: string;
    icon: React.ReactNode;
};

const QUADRANT: QuadrantCard[] = [
    {
        pos: 'tl',  // high intensity, short duration
        name: 'Spike Test',
        short: 'Sudden surge',
        desc: 'Slam the system with a 10× traffic spike in seconds — validates auto-scaling, load balancers, and cold-start behaviour.',
        when: 'Pre-launch · viral campaigns · Black-Friday rehearsal',
        a: '#ef4444', b: '#f97316', glow: 'rgba(239, 68, 68, 0.40)',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
        ),
    },
    {
        pos: 'tr',  // high intensity, long duration
        name: 'Stress Test',
        short: 'Push to breaking',
        desc: 'Ramp load past expected peak until something gives — exposes bottlenecks, cascading failures, and graceful-degradation gaps.',
        when: 'Capacity planning · architecture reviews · pre-IPO scale tests',
        a: '#a855f7', b: '#ec4899', glow: 'rgba(168, 85, 247, 0.40)',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
        ),
    },
    {
        pos: 'bl',  // low intensity, short duration
        name: 'Smoke Test',
        short: 'Sanity check',
        desc: 'Light, quick run with a handful of virtual users — confirms the test rig works and the system is responsive before deeper testing.',
        when: 'Every CI build · post-deploy verification · feature gates',
        a: '#06b6d4', b: '#4f7cff', glow: 'rgba(6, 182, 212, 0.40)',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
            </svg>
        ),
    },
    {
        pos: 'br',  // low intensity, long duration
        name: 'Soak / Endurance',
        short: 'Run for hours',
        desc: 'Sustained moderate load over 8–72 hours — surfaces memory leaks, slow cache eviction, FD exhaustion, and degradation patterns.',
        when: 'Pre-prod sign-off · long-running services · subscription platforms',
        a: '#22c55e', b: '#06b6d4', glow: 'rgba(34, 197, 94, 0.40)',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.739-8z" />
            </svg>
        ),
    },
];

const TestQuadrant: React.FC = () => (
    <section className="dawki-perf-quad">
        <div className="container">
            <div className="dawki-perf-quad-heading">
                <span className="dawki-perf-quad-pill">
                    <span></span>
                    Test Type Matrix
                </span>
                <h2 className="dawki-perf-quad-title">
                    Four Tests. <span>Four Decisions They Answer.</span>
                </h2>
                <p className="dawki-perf-quad-subtitle">
                    Every load testing engagement runs the right mix of these four — sized to your release calendar, traffic profile, and risk tolerance.
                </p>
            </div>

            <div className="dawki-perf-quad-frame">
                {/* Axis labels */}
                <span className="dawki-perf-quad-axis dawki-perf-quad-axis--y">
                    <span className="dawki-perf-quad-axis-arrow">↑</span>
                    Intensity
                </span>
                <span className="dawki-perf-quad-axis dawki-perf-quad-axis--x">
                    Duration
                    <span className="dawki-perf-quad-axis-arrow">→</span>
                </span>

                {/* Origin label */}
                <span className="dawki-perf-quad-origin">low</span>
                <span className="dawki-perf-quad-end-x">long</span>
                <span className="dawki-perf-quad-end-y">high</span>

                {/* 2x2 grid of test cards */}
                <motion.div
                    className="dawki-perf-quad-grid"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
                    }}
                >
                    {QUADRANT.map((q) => (
                        <motion.article
                            key={q.pos}
                            className={`dawki-perf-quad-card dawki-perf-quad-card--${q.pos}`}
                            style={{
                                ['--qc-a' as string]: q.a,
                                ['--qc-b' as string]: q.b,
                                ['--qc-glow' as string]: q.glow,
                            }}
                            variants={{
                                hidden: { opacity: 0, scale: 0.92 },
                                visible: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] } },
                            }}
                        >
                            <span className="dawki-perf-quad-card-icon">{q.icon}</span>
                            <span className="dawki-perf-quad-card-tag">{q.short}</span>
                            <h3 className="dawki-perf-quad-card-name">{q.name}</h3>
                            <p className="dawki-perf-quad-card-desc">{q.desc}</p>
                            <div className="dawki-perf-quad-card-when">
                                <span>BEST FOR</span>
                                <strong>{q.when}</strong>
                            </div>
                        </motion.article>
                    ))}
                </motion.div>
            </div>
        </div>
    </section>
);

/* ===========================================================================
 * Page
 * =========================================================================== */
export default function PerformanceTestingServices() {
    return (
        <ServicePageTemplate
            pageTitle="Performance Testing Services"
            breadcrumbCategory="Team Extension Services"
            heroPill="Team Extension Services"
            heroTitleStart="Performance"
            heroTitleHighlight="Testing Services"
            heroSubtitle="Load, stress, soak, and spike testing — find performance bottlenecks before your users do."
            heroVideoSrc="/assets/images/header/demo/automated-testing-services.mp4"
            featuresPill="Performance Engineered"
            featuresTitleStart="Know Your System"
            featuresTitleHighlight="Holds Up Under Load"
            featuresSubtitle="From peak-traffic launches to API SLAs — we engineer performance test programs that find issues early and validate scalability."
            features={[
                { title: 'Load Testing',           desc: 'Simulate realistic peak traffic to validate capacity and SLAs.', icon: '⚡' },
                { title: 'Stress & Soak Testing',  desc: 'Push beyond capacity to find breaking points; long-running tests to catch leaks.', icon: '💪' },
                { title: 'Spike Testing',          desc: 'Validate behavior under sudden traffic spikes from launches, marketing, or virality.', icon: '📈' },
                { title: 'AI-Driven Root Cause',   desc: 'LLM agents correlate APM traces, logs, and DB telemetry to surface root cause in minutes.', icon: '🤖' },
                { title: 'Frontend Performance',   desc: 'Lighthouse, WebPageTest, Core Web Vitals tuning for real-user performance.', icon: '🌐' },
                { title: 'Capacity Planning',      desc: 'Right-size infrastructure based on real load test data and growth forecasts.', icon: '📊' },
            ]}
            processSteps={[
                { n: '01', t: 'Plan',          d: 'Define SLAs, user journeys, traffic models, and success criteria.' },
                { n: '02', t: 'Build',         d: 'Test scripts, data, environments, and observability instrumented.' },
                { n: '03', t: 'Execute',       d: 'Run load, stress, soak, and spike scenarios with real-time observation.' },
                { n: '04', t: 'Analyze & Tune',d: 'Identify bottlenecks, recommend fixes, and re-test until SLAs are met.' },
            ]}
            servicesPill="Our Capabilities"
            servicesTitleStart="Performance Testing"
            servicesTitleHighlight="Services We Offer"
            servicesSubtitle="A full performance engineering practice — testing, profiling, tuning, and ongoing capacity management."
            servicesLayout="timeline"
            serviceCards={[
                { title: 'Performance Test Strategy',   desc: 'SLA definition, traffic modeling, tool selection, and success criteria.', icon: ICON.target },
                { title: 'Load Testing',                desc: 'Realistic peak-traffic load tests with k6, JMeter, Gatling, or Locust.', icon: ICON.chart },
                { title: 'Stress Testing',              desc: 'Push systems past capacity to find breakpoints and graceful-failure modes.', icon: ICON.rocket },
                { title: 'Soak / Endurance Testing',    desc: 'Long-running tests that surface memory leaks and slow degradation.', icon: ICON.infinity },
                { title: 'Spike Testing',               desc: 'Validate response to sudden traffic spikes from launches or promotions.', icon: ICON.refresh },
                { title: 'API Performance Testing',     desc: 'P50/P95/P99 latency under load, with assertions tied to SLAs.', icon: ICON.code },
                { title: 'Database Performance Tuning', desc: 'Index review, query optimization, and connection-pool tuning.', icon: ICON.database },
                { title: 'Frontend Performance Audits', desc: 'Lighthouse, WebPageTest, Core Web Vitals analysis and remediation.', icon: ICON.eye },
                { title: 'Mobile App Performance',      desc: 'Battery, network, and memory profiling on real devices.', icon: ICON.cog },
                { title: 'Capacity Planning',           desc: 'Sizing recommendations based on test data, growth, and seasonality.', icon: ICON.box },
                { title: 'CI Performance Gates',        desc: 'Automated performance tests run in CI with regression budgets.', icon: ICON.shield },
                { title: 'Observability & APM Setup',   desc: 'New Relic, Datadog, Dynatrace, OpenTelemetry instrumentation.', icon: ICON.headset },
            ]}
            toolsTitleStart="Load Generators, AI &"
            toolsTitleHighlight="Observability Stack"
            toolsSubtitle="Industry-leading load tools and AI-powered observability platforms — the same stack our engineers run on every performance engagement."
            toolsLayout="vertical"
            tools={[
                { n: 'Grafana k6',     s: 'k6',          c: '7D64FF', desc: 'Default JavaScript-based load tool — runs from CLI, CI, or Grafana Cloud at any scale.' },
                { n: 'Apache JMeter',  s: 'apachejmeter',c: 'D22128', desc: 'Battle-tested OSS load tool — perfect for protocol-level (HTTP, WebSocket, JDBC, MQTT) tests.' },
                { n: 'Gatling',        s: 'gatling',     c: 'F26122', desc: 'Scala-based DSL with brilliant HTML reports — preferred for high-throughput API benchmarks.' },
                { n: 'Locust',         s: 'locust',      c: '009B62', desc: 'Pythonic load tool with distributed-runner support — quick scripting + custom protocols.' },
                { n: 'Artillery',      s: 'artillery',   c: '3B82F6', desc: 'YAML-first cloud-native load tool — fast for serverless and event-driven backends.' },
                { n: 'BlazeMeter',     s: 'blazemeter',  c: '0091EA', desc: 'Massive-scale cloud load testing — when you need 1M+ virtual users from 50+ regions.' },
                { n: 'Datadog',        s: 'datadog',     c: '632CA6', desc: 'AI Watchdog auto-detects performance anomalies during tests + APM trace deep-dives.' },
                { n: 'New Relic',      s: 'newrelic',    c: '008C99', desc: 'Mira AI assistant + APM, infra, browser RUM — full observability for every test run.' },
                { n: 'Dynatrace',      s: 'dynatrace',   c: '1496FF', desc: 'Davis AI causal analysis — pinpoints root cause across services and infrastructure automatically.' },
                { n: 'OpenAI / GPT-4', s: 'openai',      c: '412991', desc: 'AI test-script generation from API specs + bottleneck root-cause hypothesis from APM traces.' },
                { n: 'AppDynamics',    s: 'appdynamics', c: 'FFC700', desc: 'Cisco-backed APM with business-transaction monitoring — used in enterprise engagements.' },
                { n: 'OpenTelemetry',  s: 'opentelemetry',c: '425CC7', desc: 'Vendor-neutral tracing + metrics + logs — instrumented before every load test.' },
                { n: 'Honeycomb',      s: 'honeycomb',   c: 'F5A623', desc: 'BubbleUp AI for high-cardinality observability — finds the slow query buried in millions of spans.' },
                { n: 'Lighthouse',     s: 'lighthouse',  c: 'F44B21', desc: 'Frontend perf budgets — Core Web Vitals checked on every PR via Lighthouse CI.' },
                { n: 'WebPageTest',    s: 'webpagetest', c: '3B82F6', desc: 'Real-browser RUM testing from 40+ global locations — frontend perf the way users see it.' },
             ]}
            hideProjects={true}
            hideTestimonial={true}
            showClients={true}
            clientsPill="Trusted By Performance Leaders"
            clientsHeading="From Series-A SaaS to Black Friday Retail,"
            clientsHeadingHighlight="We Keep Production Standing"
            extraSections={
                <>
                    <LiveDashboard />
                    <TestQuadrant />
                </>
            }
            googleReviews={[
                {
                    name: 'Naveen Iyer',
                    role: 'CTO, Trailspark Commerce',
                    rating: 5,
                    date: '2 months ago',
                    text: 'They ran a 50× spike test against our checkout service two weeks before Black Friday. Found a connection-pool exhaustion bug nobody had caught in three years. We did $4.2M of GMV that weekend without a single 5xx.',
                },
                {
                    name: 'Sienna Brooks',
                    role: 'VP Engineering, Cipherline SaaS',
                    rating: 5,
                    date: '4 months ago',
                    text: 'Soak test ran for 72 hours and surfaced two memory leaks plus a slow-query degradation curve we had been blaming on garbage collection for months. The remediation guide was as clear as the load report.',
                },
                {
                    name: 'Marcus Reid',
                    role: 'Director of SRE, Northwave Streaming',
                    rating: 5,
                    date: '6 months ago',
                    text: 'Their capacity planning model was the first one our finance team actually trusted. We rightsized our cluster and dropped infra spend 28% without hitting a single SLO.',
                },
                {
                    name: 'Elena Marchetti',
                    role: 'Engineering Manager, Ledgerline FinTech',
                    rating: 5,
                    date: '3 months ago',
                    text: 'They embedded k6 + Datadog into our GitHub Actions and now every PR gets perf-budget feedback. p95 regressions get blocked at PR-time, not in production. Game changer.',
                },
                {
                    name: 'Yusuf Demir',
                    role: 'Head of Platform, Spectra Mobility',
                    rating: 5,
                    date: '5 months ago',
                    text: 'Pre-launch load test for our ride-hailing API. Their report had 14 prioritized findings — we fixed the top 6 and shipped. Day-one peak traffic landed at p95 under 200ms with zero incidents.',
                },
                {
                    name: 'Ria Patel',
                    role: 'CTO, Verdant Mobility',
                    rating: 5,
                    date: '7 months ago',
                    text: 'AI-driven root-cause analysis pinpointed an N+1 query in our Rails app within three minutes of a load run. Our previous APM had been showing the symptom for weeks. Genuinely the best perf engineering team we have worked with.',
                },
            ]}
            googleReviewsHeading="What Engineering Leaders Say About Our Performance Work"
            googleReviewsSubtitle="Verified reviews from CTOs, SREs, and engineering managers we've delivered load, stress, and capacity engagements for."
            faqs={[
                { q: 'What is performance testing?',
                  a: 'Performance testing measures how your system behaves under various loads — speed, scalability, and stability — using tools that simulate users and traffic.' },
                { q: 'When should we run performance tests?',
                  a: 'Before major launches, after architecture changes, on a periodic schedule, and as part of CI for performance-sensitive paths.' },
                { q: 'Which tools do you use?',
                  a: 'k6, JMeter, Gatling, Locust, Artillery, BlazeMeter for load — and APMs like Datadog, New Relic, Dynatrace, AppDynamics, Honeycomb for observability.' },
                { q: 'How realistic are the tests?',
                  a: 'We model real user behavior using analytics data, run from multiple geographies, and use realistic data and pacing.' },
                { q: 'How do you find bottlenecks?',
                  a: 'We combine load testing with APM, profiling, distributed tracing, and database telemetry to pinpoint slow services, queries, and code paths.' },
                { q: 'Can you also fix the issues you find?',
                  a: 'Yes. Our performance engineers can recommend and implement fixes — from query tuning to caching to infrastructure changes.' },
                { q: 'Do you integrate performance tests into CI?',
                  a: 'Yes. We add performance regression gates to CI for critical APIs and user journeys, with budgets and alerting.' },
                { q: 'How do you use AI in performance testing?',
                  a: 'GPT-4 generates first-draft k6/JMeter scripts from API specs, and Datadog/Dynatrace/Honeycomb AI features cluster anomalies + propose root causes from telemetry — humans verify before we report.' },
            ]}
        />
    );
}
