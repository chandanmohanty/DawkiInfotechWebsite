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
 * Section 1: Test Runner Terminal Output
 * =========================================================================== */
type TestStatus = 'pass' | 'fail' | 'skip';
type TestRow = { name: string; time: string; status: TestStatus };
type TestSuite = {
    file: string;
    label: string;
    time: string;
    status: TestStatus;
    tests: TestRow[];
    failBlock?: string[];
};

const SUITES: TestSuite[] = [
    {
        file: 'src/components/Button.test.tsx',
        label: 'Button',
        time: '184 ms',
        status: 'pass',
        tests: [
            { name: 'renders with default variant',           time: '38 ms',  status: 'pass' },
            { name: 'fires onClick when clicked',             time: '42 ms',  status: 'pass' },
            { name: 'is disabled when prop is set',           time: '29 ms',  status: 'pass' },
            { name: 'shows loading spinner when loading',     time: '52 ms',  status: 'pass' },
            { name: 'matches Figma token snapshot',           time: '23 ms',  status: 'pass' },
        ],
    },
    {
        file: 'src/api/billing.spec.ts',
        label: 'Billing API',
        time: '612 ms',
        status: 'fail',
        tests: [
            { name: 'creates a subscription with valid card', time: '142 ms', status: 'pass' },
            { name: 'handles 3DS challenge correctly',        time: '168 ms', status: 'pass' },
            { name: 'retries failed webhook with backoff',    time: '209 ms', status: 'fail' },
            { name: 'cancels at period end',                  time: '93 ms',  status: 'pass' },
        ],
        failBlock: [
            '✗ retries failed webhook with backoff',
            '  expected: 3 retry attempts',
            '  received: 2 retry attempts',
            '  at billing.spec.ts:42:12',
        ],
    },
    {
        file: 'e2e/checkout.spec.ts',
        label: 'Checkout · E2E',
        time: '2.41 s',
        status: 'pass',
        tests: [
            { name: 'guest checkout completes on Chrome',     time: '684 ms', status: 'pass' },
            { name: 'logged-in user pays with saved card',    time: '512 ms', status: 'pass' },
            { name: 'applies discount code at review step',   time: '438 ms', status: 'pass' },
            { name: 'shows OOS message when stock = 0',       time: '202 ms', status: 'skip' },
        ],
    },
];

const StatusIcon: React.FC<{ status: TestStatus }> = ({ status }) => {
    if (status === 'pass') {
        return (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
            </svg>
        );
    }
    if (status === 'fail') {
        return (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
        );
    }
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="6" />
        </svg>
    );
};

const TestRunner: React.FC = () => (
    <section className="dawki-ats-runner">
        <div className="container">
            <div className="dawki-ats-runner-heading">
                <span className="dawki-ats-runner-pill">
                    <span></span>
                    Live Test Run
                </span>
                <h2 className="dawki-ats-runner-title">
                    Tests That <span>Catch Regressions Before Customers Do</span>
                </h2>
                <p className="dawki-ats-runner-subtitle">
                    A real-shaped test run from one of our suites. Unit, integration, and E2E — running in parallel, posting results to CI in seconds.
                </p>
            </div>

            <motion.div
                className="dawki-ats-runner-window"
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
            >
                <div className="dawki-ats-runner-titlebar">
                    <div className="dawki-ats-runner-titlebar-dots">
                        <span></span><span></span><span></span>
                    </div>
                    <span className="dawki-ats-runner-titlebar-name">jest · run #1287 · branch main</span>
                    <span className="dawki-ats-runner-titlebar-status">Running</span>
                </div>

                <div className="dawki-ats-runner-body">
                    <motion.div
                        className="dawki-ats-runner-cmd"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                    >
                        <span className="dawki-ats-runner-cmd-prompt">$</span>
                        <span className="dawki-ats-runner-cmd-text">pnpm test --shard=1/4 --coverage</span>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: '-60px' }}
                        variants={{
                            hidden: {},
                            show: { transition: { staggerChildren: 0.18, delayChildren: 0.5 } },
                        }}
                    >
                        {SUITES.map((suite) => (
                            <motion.div
                                key={suite.file}
                                className="dawki-ats-runner-suite"
                                variants={{
                                    hidden: { opacity: 0, x: -8 },
                                    show: { opacity: 1, x: 0, transition: { duration: 0.45 } },
                                }}
                            >
                                <div className="dawki-ats-runner-suite-head">
                                    <span className={`dawki-ats-runner-suite-tag dawki-ats-runner-suite-tag--${suite.status}`}>
                                        {suite.status === 'pass' ? 'PASS' : suite.status === 'fail' ? 'FAIL' : 'SKIP'}
                                    </span>
                                    <span className="dawki-ats-runner-suite-name">
                                        {suite.file} <strong>· {suite.label}</strong>
                                    </span>
                                    <span className="dawki-ats-runner-suite-time">{suite.time}</span>
                                </div>
                                <ul className="dawki-ats-runner-tests">
                                    {suite.tests.map((t, ti) => (
                                        <motion.li
                                            key={ti}
                                            className="dawki-ats-runner-test"
                                            initial={{ opacity: 0, x: -6 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.7 + ti * 0.08, duration: 0.35 }}
                                        >
                                            <span className={`dawki-ats-runner-test-icon dawki-ats-runner-test-icon--${t.status}`}>
                                                <StatusIcon status={t.status} />
                                            </span>
                                            <span className={`dawki-ats-runner-test-name${t.status === 'skip' ? ' dawki-ats-runner-test-name--skip' : ''}${t.status === 'fail' ? ' dawki-ats-runner-test-name--fail' : ''}`}>
                                                {t.name}
                                            </span>
                                            <span className="dawki-ats-runner-test-time">{t.time}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                                {suite.failBlock && (
                                    <motion.div
                                        className="dawki-ats-runner-fail-block"
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 1.1, duration: 0.35 }}
                                    >
                                        {suite.failBlock.map((line, li) => (
                                            <span key={li} className="dawki-ats-runner-fail-block-line">{line}</span>
                                        ))}
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                <motion.div
                    className="dawki-ats-runner-summary"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ delay: 1.4, duration: 0.5 }}
                >
                    <span className="dawki-ats-runner-summary-line dawki-ats-runner-summary-line-pass">
                        Tests: <strong>129 passed</strong>
                    </span>
                    <span className="dawki-ats-runner-summary-line dawki-ats-runner-summary-line-fail">
                        <strong>1 failed</strong>
                    </span>
                    <span className="dawki-ats-runner-summary-line dawki-ats-runner-summary-line-skip">
                        <strong>2 skipped</strong>
                    </span>
                    <span className="dawki-ats-runner-summary-line">
                        Suites: <strong>3 ran</strong>
                    </span>
                    <span className="dawki-ats-runner-summary-line">
                        Coverage: <strong>94.2%</strong>
                    </span>
                    <span className="dawki-ats-runner-summary-line">
                        Time: <strong>4.83 s</strong>
                    </span>

                    <div className="dawki-ats-runner-summary-bar" aria-hidden="true">
                        <motion.span
                            className="dawki-ats-runner-summary-bar-seg dawki-ats-runner-summary-bar-seg--pass"
                            initial={{ width: 0 }}
                            whileInView={{ width: '94%' }}
                            viewport={{ once: true }}
                            transition={{ delay: 1.6, duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
                        />
                        <motion.span
                            className="dawki-ats-runner-summary-bar-seg dawki-ats-runner-summary-bar-seg--skip"
                            initial={{ width: 0 }}
                            whileInView={{ width: '5%' }}
                            viewport={{ once: true }}
                            transition={{ delay: 2.5, duration: 0.45 }}
                        />
                        <motion.span
                            className="dawki-ats-runner-summary-bar-seg dawki-ats-runner-summary-bar-seg--fail"
                            initial={{ width: 0 }}
                            whileInView={{ width: '1%' }}
                            viewport={{ once: true }}
                            transition={{ delay: 2.95, duration: 0.3 }}
                        />
                    </div>
                </motion.div>
            </motion.div>
        </div>
    </section>
);

/* ===========================================================================
 * Section 2: Cross-Browser / Device Test Matrix
 * =========================================================================== */
type CellStatus = 'pass' | 'fail' | 'flake' | 'skip';

const COLS: { code: string; name: string; color: string; logo?: string }[] = [
    { code: 'CR', name: 'Chrome',     color: '#4285F4', logo: 'https://cdn.simpleicons.org/googlechrome/4285F4' },
    { code: 'FF', name: 'Firefox',    color: '#FF7139', logo: 'https://cdn.simpleicons.org/firefoxbrowser/FF7139' },
    { code: 'SF', name: 'Safari',     color: '#006CFF', logo: 'https://cdn.simpleicons.org/safari/006CFF' },
    { code: 'ED', name: 'Edge',       color: '#0078D4', logo: 'https://cdn.simpleicons.org/microsoftedge/0078D4' },
    { code: 'iOS', name: 'iOS Safari',color: '#000000', logo: 'https://cdn.simpleicons.org/ios/000000' },
    { code: 'AND', name: 'Android',   color: '#3DDC84', logo: 'https://cdn.simpleicons.org/android/3DDC84' },
];

const ROWS: { name: string; sub: string; cells: CellStatus[] }[] = [
    { name: 'Login & SSO',           sub: 'login.spec.ts',         cells: ['pass', 'pass', 'pass', 'pass', 'pass',  'pass'] },
    { name: 'Search & Filters',      sub: 'search.spec.ts',        cells: ['pass', 'pass', 'pass', 'pass', 'flake', 'pass'] },
    { name: 'Checkout & Payment',    sub: 'checkout.spec.ts',      cells: ['pass', 'pass', 'pass', 'pass', 'pass',  'pass'] },
    { name: 'Settings & Billing',    sub: 'settings.spec.ts',      cells: ['pass', 'pass', 'fail', 'pass', 'pass',  'pass'] },
    { name: 'Dashboard Charts',      sub: 'dashboard.spec.ts',     cells: ['pass', 'pass', 'pass', 'pass', 'skip',  'pass'] },
    { name: 'Visual Regression',     sub: 'visual.spec.ts',        cells: ['pass', 'pass', 'pass', 'pass', 'pass',  'pass'] },
    { name: 'Accessibility (a11y)',  sub: 'a11y.spec.ts',          cells: ['pass', 'pass', 'pass', 'flake','pass',  'pass'] },
];

const CellIcon: React.FC<{ s: CellStatus }> = ({ s }) => {
    if (s === 'pass') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>;
    if (s === 'fail') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
    if (s === 'flake') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M3 12h3M18 12h3M12 3v3M12 18v3"/></svg>;
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><line x1="6" y1="12" x2="18" y2="12"/></svg>;
};

const CrossBrowserMatrix: React.FC = () => {
    const totalCells = ROWS.length * COLS.length;
    const passCount = ROWS.flatMap(r => r.cells).filter(c => c === 'pass').length;
    const flakeCount = ROWS.flatMap(r => r.cells).filter(c => c === 'flake').length;
    const failCount = ROWS.flatMap(r => r.cells).filter(c => c === 'fail').length;
    const skipCount = ROWS.flatMap(r => r.cells).filter(c => c === 'skip').length;
    const passRate = ((passCount / totalCells) * 100).toFixed(1);

    const tests = useCountUp(totalCells, 1500, 0);
    const passRateNum = useCountUp(parseFloat(passRate), 1500, 1);
    const browsers = useCountUp(COLS.length, 1500, 0);
    const duration = useCountUp(8.4, 1500, 1);

    return (
        <section className="dawki-ats-matrix">
            <div className="container">
                <div className="dawki-ats-matrix-heading">
                    <span className="dawki-ats-matrix-pill">
                        <span></span>
                        Cross-Browser Coverage
                    </span>
                    <h2 className="dawki-ats-matrix-title">
                        Every Test, <span>Every Browser, Every Device</span>
                    </h2>
                    <p className="dawki-ats-matrix-subtitle">
                        BrowserStack and Sauce Labs orchestrate cross-browser runs. We chase down flakes the same week we see them — your matrix stays green.
                    </p>
                </div>

                <motion.div
                    className="dawki-ats-matrix-frame"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                >
                    <div className="dawki-ats-matrix-toolbar">
                        <div className="dawki-ats-matrix-toolbar-name">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                            E2E Matrix · run #1287
                            <span className="dawki-ats-matrix-toolbar-stat">{passCount} / {totalCells} pass</span>
                        </div>
                        <div className="dawki-ats-matrix-toolbar-legend">
                            <span className="dawki-ats-matrix-toolbar-legend-item">
                                <span className="dawki-ats-matrix-toolbar-legend-dot" style={{ ['--leg' as string]: '#22c55e' }}></span>
                                Pass
                            </span>
                            <span className="dawki-ats-matrix-toolbar-legend-item">
                                <span className="dawki-ats-matrix-toolbar-legend-dot" style={{ ['--leg' as string]: '#fbbf24' }}></span>
                                Flake
                            </span>
                            <span className="dawki-ats-matrix-toolbar-legend-item">
                                <span className="dawki-ats-matrix-toolbar-legend-dot" style={{ ['--leg' as string]: '#ef4444' }}></span>
                                Fail
                            </span>
                            <span className="dawki-ats-matrix-toolbar-legend-item">
                                <span className="dawki-ats-matrix-toolbar-legend-dot" style={{ ['--leg' as string]: '#94a3b8' }}></span>
                                Skip
                            </span>
                        </div>
                    </div>

                    <div className="dawki-ats-matrix-grid" style={{ ['--cols' as string]: COLS.length }}>
                        <div className="dawki-ats-matrix-corner">Test scenario / Browser</div>
                        {COLS.map((c) => (
                            <div key={c.code} className="dawki-ats-matrix-col-head">
                                <span
                                    className="dawki-ats-matrix-col-head-letter"
                                    style={{ ['--head-color' as string]: c.color }}
                                >
                                    {c.code}
                                </span>
                                <span className="dawki-ats-matrix-col-head-name">{c.name}</span>
                            </div>
                        ))}

                        {ROWS.map((row, ri) => (
                            <React.Fragment key={row.name}>
                                <motion.div
                                    className="dawki-ats-matrix-row-label"
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: '-40px' }}
                                    transition={{ delay: 0.3 + ri * 0.05, duration: 0.4 }}
                                >
                                    {row.name}
                                    <small>{row.sub}</small>
                                </motion.div>
                                {row.cells.map((s, ci) => (
                                    <motion.div
                                        key={ci}
                                        className={`dawki-ats-matrix-cell dawki-ats-matrix-cell--${s}`}
                                        initial={{ opacity: 0, scale: 0.6 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true, margin: '-40px' }}
                                        transition={{ delay: 0.5 + ri * 0.05 + ci * 0.04, duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                                    >
                                        <CellIcon s={s} />
                                    </motion.div>
                                ))}
                            </React.Fragment>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    className="dawki-ats-matrix-stats"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-60px' }}
                    variants={{
                        hidden: {},
                        show: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } },
                    }}
                >
                    <motion.div className="dawki-ats-matrix-stat" variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
                        <div className="dawki-ats-matrix-stat-key">Tests Per Run</div>
                        <div className="dawki-ats-matrix-stat-val"><span ref={tests.ref}>{tests.value}</span></div>
                        <div className="dawki-ats-matrix-stat-sub">7 scenarios × 6 browsers in this composite snapshot.</div>
                    </motion.div>
                    <motion.div className="dawki-ats-matrix-stat" variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
                        <div className="dawki-ats-matrix-stat-key">Pass Rate</div>
                        <div className="dawki-ats-matrix-stat-val"><span ref={passRateNum.ref}>{passRateNum.value}</span>%</div>
                        <div className="dawki-ats-matrix-stat-sub">{flakeCount} flake · {failCount} fail · {skipCount} skip in this run.</div>
                    </motion.div>
                    <motion.div className="dawki-ats-matrix-stat" variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
                        <div className="dawki-ats-matrix-stat-key">Browsers Covered</div>
                        <div className="dawki-ats-matrix-stat-val"><span ref={browsers.ref}>{browsers.value}</span></div>
                        <div className="dawki-ats-matrix-stat-sub">Desktop + mobile, parallelized via cloud devices.</div>
                    </motion.div>
                    <motion.div className="dawki-ats-matrix-stat" variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
                        <div className="dawki-ats-matrix-stat-key">Wall-Clock Time</div>
                        <div className="dawki-ats-matrix-stat-val"><span ref={duration.ref}>{duration.value}</span> min</div>
                        <div className="dawki-ats-matrix-stat-sub">Sharded across 8 parallel runners — fast enough for every PR.</div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

/* ===========================================================================
 * Section 3: Automated Testing Video Showcase
 * =========================================================================== */
const AtsVideo: React.FC = () => {
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
                        Inside The QA Lab
                    </span>
                    <h2 className="dawki-ent-video-title">
                        See How We Build <span>Test Suites That Stay Green</span>
                    </h2>
                    <p className="dawki-ent-video-subtitle">
                        A behind-the-scenes look at how we design test pyramids, hunt flakes, and embed automation into CI — so engineers ship more, with fewer hotfixes.
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
export default function AutomatedTestingServices() {
    return (
        <ServicePageTemplate
            pageTitle="Automated Testing Services"
            breadcrumbCategory="Team Extension Services"
            heroPill="Team Extension Services"
            heroTitleStart="Automated"
            heroTitleHighlight="Testing Services"
            heroSubtitle="Test automation strategy, framework engineering, and CI-integrated suites — ship faster with fewer regressions."
            heroVideoSrc="/assets/images/header/demo/automated-testing-services.mp4"
            featuresPill="Quality at Velocity"
            featuresTitleStart="Test Automation That"
            featuresTitleHighlight="Catches Bugs Early"
            featuresSubtitle="From unit tests to E2E suites — we engineer test automation that runs in CI, finds regressions early, and gives teams confidence to ship."
            features={[
                { title: 'Test Strategy & Pyramid', desc: 'Right balance of unit, integration, contract, and E2E tests.', icon: '🔺' },
                { title: 'Cross-Browser & Cross-Device', desc: 'Selenium, Playwright, Cypress, Appium across browsers and mobile devices.', icon: '🖥️' },
                { title: 'API Test Automation', desc: 'Postman, REST Assured, Karate, Pact contract tests — fast, reliable, low maintenance.', icon: '🔌' },
                { title: 'CI/CD Integration', desc: 'Tests embedded in GitHub Actions, GitLab CI, Jenkins, CircleCI pipelines.', icon: '🔄' },
                { title: 'Test Data Management', desc: 'Synthetic data, fixtures, and isolated environments for reliable runs.', icon: '🗄️' },
                { title: 'Reporting & Observability', desc: 'Allure, ReportPortal, and dashboards that surface flaky tests and trends.', icon: '📊' },
            ]}
            processSteps={[
                { n: '01', t: 'Audit', d: 'Review current QA, coverage, flakiness, and CI integration.' },
                { n: '02', t: 'Strategy', d: 'Test pyramid design, framework selection, and roadmap.' },
                { n: '03', t: 'Build', d: 'Framework engineering, suite migration, and CI integration.' },
                { n: '04', t: 'Operate', d: 'Maintenance, flake reduction, and continuous coverage growth.' },
            ]}
            servicesPill="Our Capabilities"
            servicesTitleStart="Automated Testing"
            servicesTitleHighlight="Services We Offer"
            servicesSubtitle="A full QA automation practice — strategy, frameworks, suites, and CI integration."
            servicesLayout="timeline"
            serviceCards={[
                { title: 'Test Automation Strategy', desc: 'Test pyramid design, ROI analysis, framework selection, and adoption roadmap.', icon: ICON.target },
                { title: 'Web UI Automation', desc: 'Playwright, Cypress, Selenium, and WebdriverIO frameworks for web UIs.', icon: ICON.globe },
                { title: 'Mobile App Test Automation', desc: 'Appium, XCUITest, Espresso, and Detox for iOS and Android automation.', icon: ICON.rocket },
                { title: 'API Test Automation', desc: 'REST Assured, Postman/Newman, Karate, and contract testing with Pact.', icon: ICON.code },
                { title: 'Performance Test Automation', desc: 'k6, JMeter, Gatling — load, stress, and soak tests in CI.', icon: ICON.chart },
                { title: 'BDD with Cucumber/SpecFlow', desc: 'Behavior-driven test automation that aligns business and engineering.', icon: ICON.users },
                { title: 'Test Framework Engineering', desc: 'Custom, scalable, low-maintenance frameworks built for your stack.', icon: ICON.cog },
                { title: 'CI/CD Integration', desc: 'Embed tests in GitHub Actions, GitLab CI, Jenkins, CircleCI with rich reporting.', icon: ICON.refresh },
                { title: 'Cross-Browser & Device Cloud', desc: 'BrowserStack, Sauce Labs, LambdaTest integration for matrix coverage.', icon: ICON.eye },
                { title: 'Test Data Management', desc: 'Synthetic data, fixtures, and seeding for reliable, isolated test runs.', icon: ICON.database },
                { title: 'Visual Regression Testing', desc: 'Percy, Chromatic, Applitools — pixel-level visual change detection.', icon: ICON.palette },
                { title: 'QA Automation Managed Services', desc: 'Embedded SDETs and ongoing maintenance of suites and pipelines.', icon: ICON.headset },
            ]}
            toolsTitleStart="QA Frameworks &"
            toolsTitleHighlight="Tools We Build With"
            toolsSubtitle="A purpose-built test-automation stack — UI, API, mobile, performance, visual, and reporting — operated end-to-end."
            toolsLayout="vertical"
            tools={[
                { n: 'Playwright',     s: 'playwright',     c: '2EAD33', desc: 'Modern web UI automation — auto-wait, multi-browser, network mocking, parallel by default.' },
                { n: 'Cypress',        s: 'cypress',        c: '17202C', desc: 'Developer-friendly E2E with rich debug UI — preferred for component + UI tests in JS apps.' },
                { n: 'Selenium',       s: 'selenium',       c: '43B02A', desc: 'Battle-tested cross-browser automation — preferred for legacy and Java/.NET ecosystems.' },
                { n: 'WebdriverIO',    s: 'webdriverio',    c: 'EA5906', desc: 'Selenium + Appium under one TypeScript roof — strong fit for cross-stack web + mobile automation.' },
                { n: 'Appium',         s: 'appium',         c: '662D91', desc: 'Cross-platform mobile automation — iOS (XCUITest) and Android (Espresso/UIAutomator2).' },
                { n: 'XCUITest',       s: 'xcode',          c: '147EFB', desc: 'Native iOS automation framework from Apple — fastest, most stable for iOS-only suites.' },
                { n: 'Detox',          s: 'detox',          c: 'B5172F', desc: 'Grey-box E2E framework for React Native — fast, deterministic, integrates with Jest.' },
                { n: 'Jest',           s: 'jest',           c: 'C21325', desc: 'Unit + component testing for JS — snapshots, mocks, parallel sharding, coverage built in.' },
                { n: 'Pytest',         s: 'pytest',         c: '0A9EDC', desc: 'Python testing framework of choice — fixtures, parameterization, plugin-rich ecosystem.' },
                { n: 'JUnit / TestNG', s: 'junit5',         c: '25A162', desc: 'JVM unit and parallel testing — the foundation of our Java automation suites.' },
                { n: 'Postman / Newman', s: 'postman',      c: 'FF6C37', desc: 'API exploration + automation — collections run in CI via Newman with rich HTML reports.' },
                { n: 'k6',             s: 'k6',             c: '7D64FF', desc: 'Modern load and performance testing — JS-scripted, CI-friendly, cloud-scaled.' },
                { n: 'JMeter',         s: 'apachejmeter',   c: 'D22128', desc: 'Battle-tested load testing — preferred for protocol-level, enterprise-grade workloads.' },
                { n: 'BrowserStack',   s: 'browserstack',   c: 'FF6F00', desc: 'Cloud device + browser farm — real iOS/Android, every desktop browser, parallelized.' },
                { n: 'Sauce Labs',     s: 'saucelabs',      c: 'E2231A', desc: 'Enterprise-grade cross-browser cloud — strong for regulated industries with audit needs.' },
                { n: 'Allure Report',  s: 'allure',         c: '00FFAA', desc: 'Beautiful, attached-artifact test reports — flake history, defect linking, trend analysis.' },
            ]}
            hideProjects={true}
            hideTestimonial={true}
            showClients={true}
            clientsPill="Trusted By QA Teams"
            clientsHeading="From Lean Startups to Regulated Enterprises,"
            clientsHeadingHighlight="We Make Releases Boring"
            extraSections={
                <>
                    <TestRunner />
                    <CrossBrowserMatrix />
                    <AtsVideo />
                </>
            }
            googleReviews={[
                {
                    name: 'Diego Fernández',
                    role: 'SRE Lead, MeshCart',
                    rating: 5,
                    date: '2 months ago',
                    text: 'Their Playwright + sharded GitHub Actions build cut our E2E suite from 42 minutes to 6. Engineers actually run it on every PR now — and bugs catch themselves before review.',
                },
                {
                    name: 'Karen Whitfield',
                    role: 'VP Engineering, Brightline Health',
                    rating: 5,
                    date: '4 months ago',
                    text: 'Flake rate dropped from 14% to under 1% in three months of disciplined work. They identified the root causes the rest of us were too busy to chase.',
                },
                {
                    name: 'Anna Volkov',
                    role: 'Director of QA, FinFleet',
                    rating: 5,
                    date: '6 months ago',
                    text: 'BrowserStack matrix across 14 browser/device combos integrated cleanly into our Jenkins pipeline. Coverage gaps we had been arguing about for a year are finally closed.',
                },
                {
                    name: 'Rashid Khan',
                    role: 'Engineering Manager, Pulse Media',
                    rating: 5,
                    date: '3 months ago',
                    text: 'They built our visual regression program with Percy + Chromatic. Production has not had a CSS regression in eight months — that is the part our designers cared about most.',
                },
                {
                    name: 'Sarah Linwood',
                    role: 'CTO, AeroPay',
                    rating: 5,
                    date: '5 months ago',
                    text: 'API contract testing with Pact saved us during a vendor schema change. Three services would have broken silently — Pact caught it the day they shipped the breaking change.',
                },
                {
                    name: 'Jonas Albrecht',
                    role: 'Head of Platform, Vekta SaaS',
                    rating: 5,
                    date: '7 months ago',
                    text: 'Their load-testing program found a database connection-pool issue that would have crashed our launch. ROI on the engagement was measured in the first week.',
                },
            ]}
            googleReviewsHeading="What QA Leaders Say About Us"
            googleReviewsSubtitle="Verified reviews from CTOs, QA directors, and SDETs we've shipped automation programs with."
            faqs={[
                { q: 'What is automated testing?', a: 'Automated testing uses code to verify software behavior — unit, integration, API, UI, and end-to-end — running automatically in CI to catch regressions early.' },
                { q: 'Which test frameworks do you use?', a: 'Playwright, Cypress, Selenium, WebdriverIO, Appium, REST Assured, Postman, k6, JMeter, Cucumber — chosen per project.' },
                { q: 'Will this slow our development team down?', a: 'The opposite. Once in place, automation gives engineers fast feedback, fewer hotfixes, and confidence to ship more often.' },
                { q: 'How much test coverage should we have?', a: 'It depends on risk. Critical user journeys deserve E2E coverage; business logic deserves strong unit/integration tests. We design the right pyramid.' },
                { q: 'Can you reduce test flakiness?', a: 'Yes. Flake reduction (waits, retries, isolation, data management) is core to our practice — most teams see 80%+ flake reduction within months.' },
                { q: 'Do you integrate with our CI/CD?', a: 'Yes. GitHub Actions, GitLab CI, Jenkins, CircleCI, Bitbucket Pipelines, Azure DevOps — with quality gates and rich reporting.' },
                { q: 'Do you provide ongoing maintenance?', a: 'Yes. We offer managed QA automation services — suite maintenance, flake hunting, framework upgrades, and coverage growth.' },
            ]}
        />
    );
}
