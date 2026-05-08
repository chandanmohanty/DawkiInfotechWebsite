import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import ServicePageTemplate, { ICON } from '@/components/ServicePageTemplate';

/* ===========================================================================
 * Section 1: Live Portfolio Console — animated chart + positions feed
 * ----------------------------------------------------------------------------
 * Trading-style dashboard with an SVG area chart that draws in, count-up KPIs
 * for AUM / Day P&L / Returns, plus a live positions feed that auto-cycles a
 * row highlight (BUY / SELL / HOLD pulses). Distinct visual language —
 * specific to financial apps, not used on any other page.
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

/* SVG chart geometry */
const CHART_W = 720;
const CHART_H = 220;
const CHART_PAD_X = 12;
const CHART_PAD_Y = 18;
const CHART_POINTS = [
    44, 48, 42, 50, 56, 53, 60, 64, 62, 70, 68, 74, 78, 76, 82, 80, 88, 92, 90, 96, 94, 102, 108, 112,
];

const buildChartPaths = () => {
    const minV = Math.min(...CHART_POINTS);
    const maxV = Math.max(...CHART_POINTS);
    const range = Math.max(1, maxV - minV);
    const stepX = (CHART_W - CHART_PAD_X * 2) / (CHART_POINTS.length - 1);
    const pts = CHART_POINTS.map((v, i) => {
        const x = CHART_PAD_X + i * stepX;
        const y = CHART_PAD_Y + (1 - (v - minV) / range) * (CHART_H - CHART_PAD_Y * 2);
        return [x, y] as const;
    });
    const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
    const area = `${line} L${pts[pts.length - 1][0].toFixed(1)} ${(CHART_H - CHART_PAD_Y).toFixed(1)} L${pts[0][0].toFixed(1)} ${(CHART_H - CHART_PAD_Y).toFixed(1)} Z`;
    return { line, area, pts };
};

type Position = { sym: string; name: string; qty: number; price: number; chg: number; side: 'BUY' | 'SELL' | 'HOLD' };
const POSITIONS: Position[] = [
    { sym: 'AAPL', name: 'Apple Inc',          qty: 240, price: 198.42, chg:  1.24, side: 'BUY'  },
    { sym: 'MSFT', name: 'Microsoft',          qty: 180, price: 412.65, chg:  0.86, side: 'HOLD' },
    { sym: 'NVDA', name: 'NVIDIA',             qty:  60, price: 942.30, chg:  3.42, side: 'BUY'  },
    { sym: 'TSLA', name: 'Tesla',              qty:  80, price: 226.18, chg: -1.18, side: 'SELL' },
    { sym: 'INFY', name: 'Infosys',            qty: 320, price:  18.42, chg:  0.62, side: 'HOLD' },
    { sym: 'HDFC', name: 'HDFC Bank',          qty: 200, price:  19.80, chg:  0.94, side: 'BUY'  },
    { sym: 'BTC',  name: 'Bitcoin',            qty:  1.4, price: 68420,  chg:  2.18, side: 'BUY'  },
    { sym: 'ETH',  name: 'Ethereum',           qty:  12,  price:  3284,  chg: -0.42, side: 'HOLD' },
];

const TICKER = ['AAPL +1.24%', 'MSFT +0.86%', 'NVDA +3.42%', 'TSLA −1.18%', 'INFY +0.62%', 'BTC +2.18%', 'ETH −0.42%', 'GBP/USD +0.31%', 'GOLD +0.74%', 'S&P500 +0.92%'];

const PortfolioConsole: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });

    /* KPIs */
    const aum   = useCountUp(248, 2000, inView);   // $2.48M shown
    const dayPL = useCountUp(842, 1800, inView);   // +$8,420 shown
    const ret   = useCountUp(184, 1500, inView);   // +18.4% shown
    const trades = useCountUp(46, 1500, inView);

    const { line, area } = useMemo(buildChartPaths, []);

    /* Auto-cycle the active position row to feel "live" */
    const [active, setActive] = useState(0);
    useEffect(() => {
        if (!inView) return;
        const id = setInterval(() => {
            setActive((a) => (a + 1) % POSITIONS.length);
        }, 1400);
        return () => clearInterval(id);
    }, [inView]);

    return (
        <section className="dawki-fin-port">
            <div className="container">
                <div className="dawki-fin-port-heading">
                    <span className="dawki-fin-port-pill">
                        <span></span>
                        Investment &amp; Trading
                    </span>
                    <h2 className="dawki-fin-port-title">
                        Build Trading &amp; Wealth Apps That <span>Move Money in Milliseconds</span>
                    </h2>
                    <p className="dawki-fin-port-subtitle">
                        Brokerage, robo-advisor, neo-banking, and wealth-management apps engineered for sub-second order flow, live P&amp;L, and bullet-proof regulatory ledgers.
                    </p>
                </div>

                <motion.div
                    ref={ref}
                    className="dawki-fin-port-frame"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                >
                    {/* Live ticker strip across top */}
                    <div className="dawki-fin-port-ticker" aria-hidden="true">
                        <div className="dawki-fin-port-ticker-track">
                            {[...TICKER, ...TICKER].map((t, i) => (
                                <span key={i} className={t.includes('−') ? 'is-down' : 'is-up'}>{t}</span>
                            ))}
                        </div>
                    </div>

                    {/* Top bar */}
                    <div className="dawki-fin-port-bar">
                        <span className="dawki-fin-port-bar-name"><i></i>BROKERAGE · Quantum Wealth · LIVE 14:32:18</span>
                        <span className="dawki-fin-port-bar-meta">{trades} trades today · NSE / NASDAQ</span>
                    </div>

                    {/* KPIs */}
                    <div className="dawki-fin-port-kpis">
                        <div className="dawki-fin-port-kpi">
                            <span>AUM</span>
                            <strong>$<span>{(aum / 100).toFixed(2)}</span>M</strong>
                            <em>↑ $124K · 7d</em>
                        </div>
                        <div className="dawki-fin-port-kpi">
                            <span>Day P&amp;L</span>
                            <strong className="is-pos">+ $<span>{dayPL.toLocaleString()}</span></strong>
                            <em>↑ 1.42%</em>
                        </div>
                        <div className="dawki-fin-port-kpi">
                            <span>YTD Return</span>
                            <strong className="is-pos">+<span>{(ret / 10).toFixed(1)}</span>%</strong>
                            <em>vs S&amp;P +12.4%</em>
                        </div>
                        <div className="dawki-fin-port-kpi">
                            <span>Sharpe</span>
                            <strong>1.82</strong>
                            <em>3-yr rolling</em>
                        </div>
                    </div>

                    {/* Chart + Positions */}
                    <div className="dawki-fin-port-grid">
                        {/* Chart */}
                        <div className="dawki-fin-port-chart">
                            <div className="dawki-fin-port-chart-head">
                                <div>
                                    <span className="dawki-fin-port-chart-label">Portfolio Value · 24H</span>
                                    <span className="dawki-fin-port-chart-value">$2,481,420</span>
                                </div>
                                <div className="dawki-fin-port-chart-tabs">
                                    <span>1H</span><span>1D</span><span className="is-active">1W</span><span>1M</span><span>1Y</span>
                                </div>
                            </div>
                            <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="dawki-fin-port-chart-svg" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="dawki-fin-area" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%"   stopColor="#22c55e" stopOpacity="0.42" />
                                        <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                                    </linearGradient>
                                    <linearGradient id="dawki-fin-line" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%"   stopColor="#5b9eff" />
                                        <stop offset="50%"  stopColor="#22c55e" />
                                        <stop offset="100%" stopColor="#a855f7" />
                                    </linearGradient>
                                </defs>
                                {/* faint horizontal grid */}
                                {[40, 80, 120, 160].map((y) => (
                                    <line key={y} x1="0" y1={y} x2={CHART_W} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                                ))}
                                {/* area */}
                                <motion.path
                                    d={area}
                                    fill="url(#dawki-fin-area)"
                                    initial={{ opacity: 0 }}
                                    animate={inView ? { opacity: 1 } : {}}
                                    transition={{ duration: 0.9, delay: 0.3 }}
                                />
                                {/* line */}
                                <motion.path
                                    d={line}
                                    fill="none"
                                    stroke="url(#dawki-fin-line)"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    initial={{ pathLength: 0 }}
                                    animate={inView ? { pathLength: 1 } : {}}
                                    transition={{ duration: 1.6, ease: [0.2, 0.8, 0.2, 1] }}
                                />
                            </svg>
                        </div>

                        {/* Positions */}
                        <div className="dawki-fin-port-positions">
                            <div className="dawki-fin-port-positions-head">
                                <span>Positions</span>
                                <span>{POSITIONS.length} holdings</span>
                            </div>
                            <ul className="dawki-fin-port-positions-list">
                                {POSITIONS.map((p, i) => (
                                    <li
                                        key={p.sym}
                                        className={`dawki-fin-port-pos ${i === active ? 'is-active' : ''}`}
                                    >
                                        <span className="dawki-fin-port-pos-sym">{p.sym}</span>
                                        <span className="dawki-fin-port-pos-name">{p.name}</span>
                                        <span className={`dawki-fin-port-pos-chg ${p.chg >= 0 ? 'is-pos' : 'is-neg'}`}>
                                            {p.chg >= 0 ? '+' : ''}{p.chg.toFixed(2)}%
                                        </span>
                                        <span className={`dawki-fin-port-pos-side is-${p.side.toLowerCase()}`}>{p.side}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

/* ===========================================================================
 * Section 2: AI Fraud Defense — live transaction stream + verdict wall
 * ----------------------------------------------------------------------------
 * Stream of transactions with AI risk score (0-100). The "active" txn moves
 * through three gates: SCAN → SCORE → VERDICT, then settles into one of
 * three buckets — APPROVED / REVIEW / BLOCKED. Visually a defense pipeline,
 * not a dashboard, not a stepper. Specific to fintech.
 * =========================================================================== */
type Verdict = 'APPROVED' | 'REVIEW' | 'BLOCKED';
type Txn = { merchant: string; amount: string; cc: string; loc: string; risk: number; verdict: Verdict };

const TXNS: Txn[] = [
    { merchant: 'Amazon UK',         amount: '$84.20',   cc: '•• 4242', loc: 'London, UK',     risk: 12, verdict: 'APPROVED' },
    { merchant: 'Apple Store',       amount: '$1,899.00', cc: '•• 8841', loc: 'San Jose, CA',   risk: 8,  verdict: 'APPROVED' },
    { merchant: 'unknown.shop',      amount: '$3,420.00', cc: '•• 0184', loc: 'Lagos, NG',      risk: 92, verdict: 'BLOCKED'  },
    { merchant: 'Uber',              amount: '$22.40',    cc: '•• 6610', loc: 'Mumbai, IN',     risk: 18, verdict: 'APPROVED' },
    { merchant: 'wire-transfer-x',   amount: '$48,000.00',cc: '•• 9921', loc: 'Moscow, RU',     risk: 86, verdict: 'BLOCKED'  },
    { merchant: 'Tesla Charging',    amount: '$18.60',    cc: '•• 4242', loc: 'Berlin, DE',     risk: 6,  verdict: 'APPROVED' },
    { merchant: 'crypto.swap',       amount: '$2,160.00', cc: '•• 0181', loc: 'Tallinn, EE',    risk: 64, verdict: 'REVIEW'   },
    { merchant: 'British Airways',   amount: '$1,180.00', cc: '•• 8841', loc: 'Heathrow, UK',   risk: 14, verdict: 'APPROVED' },
    { merchant: 'sketchy-marketplace', amount: '$590.00', cc: '•• 0184', loc: 'Vladivostok, RU',risk: 78, verdict: 'BLOCKED'  },
    { merchant: 'Netflix',           amount: '$15.99',    cc: '•• 4242', loc: 'Auto-renew',     risk: 4,  verdict: 'APPROVED' },
];

const FraudShield: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });

    const [idx, setIdx] = useState(0);

    /* Auto-advance the active txn through the pipeline every 1.5s */
    useEffect(() => {
        if (!inView) return;
        const id = setInterval(() => {
            setIdx((i) => (i + 1) % TXNS.length);
        }, 1500);
        return () => clearInterval(id);
    }, [inView]);

    const screened = useCountUp(2840, 1800, inView);
    const blockedC = useCountUp(94, 1500, inView);
    const reviewC = useCountUp(38, 1300, inView);
    const acc = useCountUp(998, 1500, inView); // 99.8 shown

    const active = TXNS[idx];

    return (
        <section className="dawki-fin-fraud">
            <div className="container">
                <div className="dawki-fin-fraud-heading">
                    <span className="dawki-fin-fraud-pill">
                        <span></span>
                        AI Fraud Defense
                    </span>
                    <h2 className="dawki-fin-fraud-title">
                        Stop Fraud Before <span>The Card Is Even Charged</span>
                    </h2>
                    <p className="dawki-fin-fraud-subtitle">
                        We engineer real-time scoring engines that screen every transaction in under 80ms — block, step-up, or pass — with explainable risk reasoning your compliance team can audit.
                    </p>
                </div>

                <motion.div
                    ref={ref}
                    className="dawki-fin-fraud-frame"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                >
                    {/* KPIs */}
                    <div className="dawki-fin-fraud-stats">
                        <div className="dawki-fin-fraud-stat">
                            <span>Screened today</span>
                            <strong>{screened.toLocaleString()}</strong>
                        </div>
                        <div className="dawki-fin-fraud-stat">
                            <span>Blocked</span>
                            <strong className="is-bad">{blockedC}</strong>
                        </div>
                        <div className="dawki-fin-fraud-stat">
                            <span>Step-up review</span>
                            <strong className="is-warn">{reviewC}</strong>
                        </div>
                        <div className="dawki-fin-fraud-stat">
                            <span>Model accuracy</span>
                            <strong className="is-good">{(acc / 10).toFixed(1)}<i>%</i></strong>
                        </div>
                    </div>

                    {/* Pipeline */}
                    <div className="dawki-fin-fraud-pipe">
                        {/* Stage 1: Incoming stream */}
                        <div className="dawki-fin-fraud-col">
                            <span className="dawki-fin-fraud-col-tag">01 · INCOMING</span>
                            <div className="dawki-fin-fraud-stream">
                                {TXNS.slice(0, 5).map((t, i) => (
                                    <div key={i} className="dawki-fin-fraud-row">
                                        <span className="dawki-fin-fraud-row-merch">{t.merchant}</span>
                                        <span className="dawki-fin-fraud-row-amt">{t.amount}</span>
                                        <span className="dawki-fin-fraud-row-meta">{t.cc} · {t.loc}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Stage 2: AI scoring (active txn highlighted) */}
                        <div className="dawki-fin-fraud-col dawki-fin-fraud-col-score">
                            <span className="dawki-fin-fraud-col-tag">02 · AI SCORING · 80ms</span>
                            <motion.div
                                key={idx}
                                className="dawki-fin-fraud-score"
                                initial={{ opacity: 0, scale: 0.94 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                            >
                                <div className="dawki-fin-fraud-score-head">
                                    <span>{active.merchant}</span>
                                    <strong>{active.amount}</strong>
                                </div>
                                <div className="dawki-fin-fraud-score-meter">
                                    <div className="dawki-fin-fraud-score-meter-bar">
                                        <span style={{ width: `${active.risk}%` }} className={
                                            active.risk >= 75 ? 'is-bad'
                                            : active.risk >= 45 ? 'is-warn'
                                            : 'is-good'
                                        }></span>
                                    </div>
                                    <strong className={
                                        active.risk >= 75 ? 'is-bad'
                                        : active.risk >= 45 ? 'is-warn'
                                        : 'is-good'
                                    }>{active.risk}</strong>
                                </div>
                                <ul className="dawki-fin-fraud-score-reasons">
                                    {active.risk >= 75 ? (
                                        <>
                                            <li><i></i>Velocity: 14× normal in 60s</li>
                                            <li><i></i>Geo mismatch · IP / billing</li>
                                            <li><i></i>Merchant bin: high-risk</li>
                                        </>
                                    ) : active.risk >= 45 ? (
                                        <>
                                            <li><i></i>New merchant for cardholder</li>
                                            <li><i></i>Amount &gt; 90th percentile</li>
                                            <li><i></i>Step-up 3DS challenge</li>
                                        </>
                                    ) : (
                                        <>
                                            <li><i></i>Recurring cardholder pattern</li>
                                            <li><i></i>Trusted merchant + geo</li>
                                            <li><i></i>Device fingerprint clean</li>
                                        </>
                                    )}
                                </ul>
                            </motion.div>
                        </div>

                        {/* Stage 3: Verdict gates */}
                        <div className="dawki-fin-fraud-col dawki-fin-fraud-col-verdict">
                            <span className="dawki-fin-fraud-col-tag">03 · VERDICT</span>
                            <div className={`dawki-fin-fraud-gate is-good ${active.verdict === 'APPROVED' ? 'is-active' : ''}`}>
                                <span>APPROVED</span>
                                <strong>83%</strong>
                                <em>auto-pass</em>
                            </div>
                            <div className={`dawki-fin-fraud-gate is-warn ${active.verdict === 'REVIEW' ? 'is-active' : ''}`}>
                                <span>STEP-UP REVIEW</span>
                                <strong>14%</strong>
                                <em>3DS / OTP</em>
                            </div>
                            <div className={`dawki-fin-fraud-gate is-bad ${active.verdict === 'BLOCKED' ? 'is-active' : ''}`}>
                                <span>BLOCKED</span>
                                <strong>3%</strong>
                                <em>auto-decline</em>
                            </div>
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
export default function FinancialApps() {
    return (
        <ServicePageTemplate
            pageTitle="Financial Apps & FinTech Platforms"
            breadcrumbCategory="Industries"
            heroPill="Industries"
            heroTitleStart="FinTech Apps &"
            heroTitleHighlight="Banking Platforms"
            heroSubtitle="Neo-banks, brokerage apps, robo-advisors, lending platforms, payments, KYC + AML, and AI fraud defense — engineered for licensed banks, fintech challengers, and payment networks."
            heroVideoSrc="/assets/images/header/demo/saas_app.mp4"
            featuresPill="FinTech Engineering"
            featuresTitleStart="Software That Moves Money"
            featuresTitleHighlight="Securely, Compliantly, in Real Time"
            featuresSubtitle="From a Series-A neo-bank to a Tier-1 acquirer — we ship fintech tech that lifts approval rates, cuts fraud, and clears regulator audits without a sweat."
            features={[
                { title: 'Real-Time Payment Rails',    desc: 'Stripe, Adyen, Razorpay, Visa, MC, UPI, ACH, FedNow, SEPA Instant — orchestrated by us.', icon: '💳' },
                { title: 'AI Fraud & Risk Scoring',    desc: 'Sub-80ms scoring per txn with explainable risk reasoning + chargeback-rate dashboards.',  icon: '🛡️' },
                { title: 'KYC / KYB / AML',            desc: 'Onfido, Persona, ComplyAdvantage, Sumsub — onboarding flows that pass regulator audits.', icon: '🔍' },
                { title: 'Open Banking & Aggregation', desc: 'Plaid, Yodlee, MX, TrueLayer, Tink — aggregated account + transaction data + insights.',  icon: '🔗' },
                { title: 'Trading & Wealth APIs',      desc: 'Brokerage, robo-advisor, custody, fractional shares, crypto + traditional unified.',       icon: '📈' },
                { title: 'Compliance & Audit Trails',  desc: 'PCI-DSS L1, SOC 2, ISO 27001, RBI, MAS, FCA, GDPR — bank-grade by default.',                icon: '🏛️' },
            ]}
            processSteps={[
                { n: '01', t: 'Discovery',          d: 'Map your money-flow + license posture + risk appetite + target geographies + integration points.' },
                { n: '02', t: 'Architecture',      d: 'Ledger design, settlement engine, AI risk pipeline, KYC vendor map, regulator-ready audit logs.' },
                { n: '03', t: 'Build',              d: 'Iterative sprints with risk-team in the loop + chargeback tabletop drills + load tests at peak.' },
                { n: '04', t: 'Launch & Operate',  d: 'Phased rollout per geo + reg sandbox approval + 24/7 fraud-ops + ongoing AI model retraining.' },
            ]}
            servicesPill="Our Capabilities"
            servicesTitleStart="Explore Our Range of"
            servicesTitleHighlight="FinTech Services"
            servicesSubtitle="Banking, payments, lending, wealth, crypto, insurance, and B2B finance — across challenger banks, established issuers, fintech startups, and payment networks."
            servicesLayout="timeline"
            serviceCards={[
                { title: 'Neo-Bank & Mobile Banking',     desc: 'Account opening, debit cards, ledger, transfers, savings pots, and AI insights — bank-grade in the pocket.', icon: ICON.box },
                { title: 'Payment Gateways & Orchestration', desc: 'Multi-PSP routing, retry logic, smart 3DS, currency conversion, dispute & chargeback automation.',         icon: ICON.cog },
                { title: 'Lending & BNPL Platforms',      desc: 'Underwriting, e-KYC, e-sign, instant disbursal, EMI ledger, collections, AI credit-scoring models.',          icon: ICON.refresh },
                { title: 'Trading & Brokerage Apps',      desc: 'Order management, market-data ingestion, sub-second execution, portfolio + tax reports.',                     icon: ICON.rocket },
                { title: 'Wealth & Robo-Advisors',        desc: 'Goal-based portfolios, glide-path rebalancing, Monte Carlo planners, AI advisor chat.',                       icon: ICON.bot },
                { title: 'KYC / KYB / AML Engines',       desc: 'Onfido, Persona, Sumsub, ComplyAdvantage adapters — modular SCA + step-up + sanction-screen flows.',           icon: ICON.shield },
                { title: 'AI Fraud & Risk Scoring',       desc: 'Real-time scoring, explainable reasons, rules + ML hybrid, fraud-ops case-management UI.',                    icon: ICON.eye },
                { title: 'Open Banking Aggregation',      desc: 'Plaid, Yodlee, MX, TrueLayer, Tink — unified account + balance + cashflow + categorisation.',                  icon: ICON.cloud },
                { title: 'Crypto & Custody',              desc: 'Wallet infra, KMS / HSM, on-ramp / off-ramp, Travel Rule, multi-sig, on-chain analytics.',                    icon: ICON.headset },
                { title: 'Insurance & InsurTech',         desc: 'Quote-bind-issue, embedded insurance, claims, fraud detection on imagery, telematics.',                       icon: ICON.users },
                { title: 'B2B Finance & Treasury',        desc: 'Spend management, AP / AR automation, virtual cards, real-time treasury dashboards.',                         icon: ICON.chart },
                { title: 'Compliance & Reg-Reporting',    desc: 'PCI-DSS L1, SOC 2, ISO 27001, RBI / SEBI / MAS / FCA / FinCEN reg-reporting + audit logs.',                     icon: ICON.palette },
            ]}
            toolsTitleStart="FinTech Stack &"
            toolsTitleHighlight="AI Tools We Build With"
            toolsSubtitle="Battle-tested payment rails, KYC vendors, fraud engines, market-data feeds, and AI scoring models — the stack we ship every fintech engagement on."
            toolsLayout="vertical"
            tools={[
                { n: 'Stripe',           s: 'stripe',           c: '008CDD', desc: 'Card-present + card-not-present, Connect for marketplaces, Issuing, Treasury, Tax, Identity.' },
                { n: 'Adyen',            s: 'adyen',            c: '0ABF53', desc: 'Enterprise-grade unified commerce + acquirer in 100+ countries — direct integrations.' },
                { n: 'Razorpay',         s: 'razorpay',         c: '0066FF', desc: 'India-first payments + UPI + RazorpayX banking + lending + payouts orchestration.' },
                { n: 'Plaid',            s: 'plaid',            c: '111111', desc: 'Open-banking + account aggregation + Identity Verification + Income Insights.' },
                { n: 'Visa & Mastercard APIs', s: 'visa',       c: '1A1F71', desc: 'Issuing + acquiring + Visa Direct / Mastercard Send for real-time cross-border payouts.' },
                { n: 'Onfido',           s: 'onfido',           c: '0073C6', desc: 'KYC + biometric verification + document checks for global onboarding.' },
                { n: 'Persona',          s: 'persona',          c: '4353FF', desc: 'Identity verification, KYB, government-database checks, fraud signals.' },
                { n: 'ComplyAdvantage',  s: 'complyadvantage',  c: 'FF6B35', desc: 'AML, sanctions, PEP screening, ongoing monitoring with explainable adverse-media.' },
                { n: 'Sift',             s: 'sift',             c: 'FF7700', desc: 'Real-time fraud scoring with rules + ML — ATO, payment, content, account fraud.' },
                { n: 'Sardine',          s: 'sardine',          c: '00B4D8', desc: 'Crypto-native fraud + compliance + behavioural biometrics for high-risk fintech.' },
                { n: 'OpenAI / GPT-4',   s: 'openai',           c: '412991', desc: 'Customer-facing AI advisor chat, dispute summary generation, KYC document reasoning.' },
                { n: 'Claude',           s: 'anthropic',        c: 'D97757', desc: 'Long-context regulatory document analysis + policy drafting + risk-memo generation.' },
                { n: 'Hugging Face',     s: 'huggingface',      c: 'FFD21E', desc: 'Custom credit-scoring + transaction-categorisation models tuned per market.' },
                { n: 'AWS Bedrock',      s: 'aws',              c: 'FF9900', desc: 'Bank-grade hosting of LLMs — VPC isolation, KMS encryption, FedRAMP / PCI-DSS.' },
                { n: 'Snowflake',        s: 'snowflake',        c: '29B5E8', desc: 'Data warehouse for risk + reg-reporting + lookup-rich AI feature stores.' },
                { n: 'Bloomberg + Alpaca', s: 'bloomberg',      c: 'FF6700', desc: 'Market-data feeds (Bloomberg) + brokerage execution APIs (Alpaca, IBKR, Zerodha).' },
            ]}
            hideProjects={true}
            hideTestimonial={true}
            showClients={true}
            clientsPill="Trusted By Banks, FinTechs & Payment Networks"
            clientsHeading="From Series-A Challengers to Tier-1 Banks,"
            clientsHeadingHighlight="We Engineer FinTech That Clears Regulators"
            extraSections={
                <>
                    <PortfolioConsole />
                    <FraudShield />
                </>
            }
            googleReviews={[
                {
                    name: 'Aakash Verma',
                    role: 'CTO, Quantum Wealth (RIA, AUM $480M)',
                    rating: 5,
                    date: '2 months ago',
                    text: 'They rebuilt our brokerage stack on a custom ledger + Alpaca + Plaid. Order acknowledgement under 220ms even at peak open and our compliance team finally has the audit trail SEBI asked for.',
                },
                {
                    name: 'Hannah Reed',
                    role: 'Head of Risk, Northbeam Pay (UK)',
                    rating: 5,
                    date: '4 months ago',
                    text: 'AI fraud-scoring engine plugged in front of our PSP. False-decline rate dropped from 2.4% to 0.6% in eight weeks and we are blocking 94 high-risk attempts a day that the old rules engine missed.',
                },
                {
                    name: 'Marcus Holloway',
                    role: 'Founder, Arc Lending (BNPL)',
                    rating: 5,
                    date: '6 months ago',
                    text: 'End-to-end BNPL platform — eKYC, underwriting, disbursal, EMI ledger, collections. Approval-to-disbursal time went from 11 minutes to 38 seconds. RBI inspection passed first try.',
                },
                {
                    name: 'Rohini Shankar',
                    role: 'COO, BrightCloud Banking (Neo-Bank)',
                    rating: 5,
                    date: '3 months ago',
                    text: 'Mobile banking app + ledger + cards via BIN-sponsor, all built in 7 months. We launched in two markets simultaneously and our fraud-ops team is one person with the AI scoring engine doing the heavy lifting.',
                },
                {
                    name: 'Diego Salazar',
                    role: 'VP Engineering, Spectra Payments',
                    rating: 5,
                    date: '5 months ago',
                    text: 'Multi-PSP orchestration with smart routing + retry + 3DS step-up. Authorisation rates climbed 4.6 percentage points across the EU and our finance team finally has reconciliation that matches the cent.',
                },
                {
                    name: 'Felix Aguirre',
                    role: 'Founder, Polestar Crypto Exchange',
                    rating: 5,
                    date: '7 months ago',
                    text: 'Custody infra with KMS / HSM + Travel Rule + multi-sig. We onboard institutional clients in days, not months, and our security audit by a Tier-1 firm came back with zero criticals.',
                },
            ]}
            googleReviewsHeading="What CTOs &amp; FinTech Founders Say About Us"
            googleReviewsSubtitle="Verified reviews from heads of risk, CTOs, and founders we've shipped fintech platforms with."
            faqs={[
                { q: 'Do you build for regulated banks or only fintech startups?',
                  a: 'Both. We work with Tier-1 banks, BIN-sponsor neo-banks, fintech startups, payment networks, and crypto exchanges. Our compliance + audit posture is bank-grade by default.' },
                { q: 'Do you handle payments + multi-PSP orchestration?',
                  a: 'Yes — Stripe, Adyen, Razorpay, Worldpay, Cybersource, Authorize.Net, plus card networks (Visa, MC) and ACH / FedNow / SEPA Instant / UPI / FPS. Smart routing + retry + 3DS step-up included.' },
                { q: 'Do you build AI fraud scoring or only integrate vendors?',
                  a: 'Both. We integrate Sift, Sardine, Riskified, Forter, Ravelin where it fits — and we build custom scoring engines for clients with proprietary signals.' },
                { q: 'Can you handle KYC / KYB / AML for global onboarding?',
                  a: 'Yes — Onfido, Persona, Sumsub, ComplyAdvantage, Veriff, plus government databases (Aadhaar, SSN, GOV.UK Verify). Full audit-trail + adverse-media monitoring.' },
                { q: 'Are you PCI-DSS / SOC 2 / ISO 27001 compliant?',
                  a: 'Yes — PCI-DSS Level 1 + SOC 2 Type II + ISO 27001 controls baked into our build process. Tokenisation, KMS / HSM, scoped CDE, audit logs from day one.' },
                { q: 'Can you build for crypto + traditional finance together?',
                  a: 'Yes — wallet infra, KMS / HSM custody, Travel Rule, on-ramp / off-ramp, on-chain analytics, plus traditional ledger + brokerage in the same platform.' },
                { q: 'How long does a fintech build take?',
                  a: 'A focused module (e.g. payment gateway or KYC flow) launches in 8–14 weeks. A full neo-bank or brokerage platform typically launches in 6–11 months.' },
                { q: 'Do you offer 24/7 fraud-ops + on-call engineering?',
                  a: 'Yes. Money-movement is 24/7. Phone, WhatsApp, fraud-ops triage rotations, and SRE on-call rotations included on enterprise contracts.' },
            ]}
        />
    );
}
