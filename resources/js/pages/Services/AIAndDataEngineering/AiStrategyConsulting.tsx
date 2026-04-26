import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import ServicePageTemplate, { ICON } from '@/components/ServicePageTemplate';

/* ===========================================================================
 * Section 1: AI Chat Mockup — typing indicator + streaming response
 * =========================================================================== */
const STREAM_TEXT = 'Here are the three highest-ROI moves for an AI-augmented support function:';

const AIChatMockup: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });
    const [phase, setPhase] = useState<'idle' | 'typing' | 'stream' | 'done'>('idle');
    const [streamed, setStreamed] = useState('');

    useEffect(() => {
        if (!inView) return;
        let t1: number | undefined, t2: number | undefined, raf: number | undefined;
        // Show typing indicator for ~900ms, then start streaming
        t1 = window.setTimeout(() => setPhase('typing'), 600);
        t2 = window.setTimeout(() => {
            setPhase('stream');
            let i = 0;
            const tick = () => {
                if (i >= STREAM_TEXT.length) {
                    setPhase('done');
                    return;
                }
                i += 1;
                setStreamed(STREAM_TEXT.slice(0, i));
                raf = window.setTimeout(tick, 22);
            };
            tick();
        }, 1500);
        return () => {
            if (t1) clearTimeout(t1);
            if (t2) clearTimeout(t2);
            if (raf) clearTimeout(raf);
        };
    }, [inView]);

    return (
        <section className="dawki-aic-chat">
            <div className="container">
                <div className="dawki-aic-chat-heading">
                    <span className="dawki-aic-chat-pill">
                        <span></span>
                        AI Strategy In Action
                    </span>
                    <h2 className="dawki-aic-chat-title">
                        From Vague Brief to <span>Shippable Roadmap</span>
                    </h2>
                    <p className="dawki-aic-chat-subtitle">
                        We pair domain experts with an AI strategy copilot. The output: a prioritized, ROI-scored list of use cases your engineering team can start on Monday.
                    </p>
                </div>

                <motion.div
                    ref={ref}
                    className="dawki-aic-chat-window"
                    initial={{ opacity: 0, y: 30, scale: 0.97 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.85, ease: [0.2, 0.8, 0.2, 1] }}
                >
                    <div className="dawki-aic-chat-titlebar">
                        <div className="dawki-aic-chat-titlebar-dots">
                            <span></span><span></span><span></span>
                        </div>
                        <div className="dawki-aic-chat-titlebar-name">
                            <span className="dawki-aic-chat-titlebar-badge">D</span>
                            Dawki AI Strategy Copilot
                        </div>
                        <span className="dawki-aic-chat-titlebar-status">Online</span>
                    </div>

                    <div className="dawki-aic-chat-body">
                        {/* User message */}
                        <motion.div
                            className="dawki-aic-chat-msg dawki-aic-chat-msg--user"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 12 }}
                            transition={{ duration: 0.45, delay: 0.2 }}
                        >
                            <div className="dawki-aic-chat-msg-bubble">
                                We're a 400-person SaaS. Where should we add AI to our customer support function first — and what's the realistic ROI?
                            </div>
                            <div className="dawki-aic-chat-msg-avatar" style={{ ['--av-a' as string]: '#94a3b8', ['--av-b' as string]: '#475569' }}>U</div>
                        </motion.div>

                        {/* AI message */}
                        <motion.div
                            className="dawki-aic-chat-msg dawki-aic-chat-msg--ai"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 12 }}
                            transition={{ duration: 0.45, delay: 0.5 }}
                        >
                            <div className="dawki-aic-chat-msg-avatar" style={{ ['--av-a' as string]: '#4f7cff', ['--av-b' as string]: '#06b6d4' }}>D</div>
                            <div className="dawki-aic-chat-msg-bubble">
                                {phase === 'idle' || phase === 'typing' ? (
                                    <span className="dawki-aic-chat-msg-typing">
                                        <span></span><span></span><span></span>
                                    </span>
                                ) : (
                                    <>
                                        <span>{streamed}</span>
                                        {phase === 'stream' && <span className="dawki-aic-chat-msg-stream"></span>}

                                        {phase === 'done' && (
                                            <motion.ul
                                                className="dawki-aic-chat-msg-bullets"
                                                initial="hidden"
                                                animate="show"
                                                variants={{
                                                    hidden: {},
                                                    show: { transition: { staggerChildren: 0.18, delayChildren: 0.1 } },
                                                }}
                                            >
                                                <motion.li
                                                    className="dawki-aic-chat-msg-bullet"
                                                    variants={{
                                                        hidden: { opacity: 0, y: 8 },
                                                        show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                                                    }}
                                                >
                                                    <span className="dawki-aic-chat-msg-bullet-num">1</span>
                                                    <span>
                                                        <strong>Auto-tag and route incoming tickets</strong> with a small classifier on top of GPT-4 or Claude. <em>~80% accuracy, 4-week build, $40K savings/yr</em>
                                                    </span>
                                                </motion.li>
                                                <motion.li
                                                    className="dawki-aic-chat-msg-bullet"
                                                    variants={{
                                                        hidden: { opacity: 0, y: 8 },
                                                        show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                                                    }}
                                                >
                                                    <span className="dawki-aic-chat-msg-bullet-num">2</span>
                                                    <span>
                                                        <strong>RAG-powered FAQ assistant</strong> grounded in your help center + product docs. Deflects ~35% of tier-1 volume. <em>6-week build, ~$140K savings/yr</em>
                                                    </span>
                                                </motion.li>
                                                <motion.li
                                                    className="dawki-aic-chat-msg-bullet"
                                                    variants={{
                                                        hidden: { opacity: 0, y: 8 },
                                                        show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                                                    }}
                                                >
                                                    <span className="dawki-aic-chat-msg-bullet-num">3</span>
                                                    <span>
                                                        <strong>Reply-draft copilot for agents</strong> with tone matched to your brand and CSAT-score safety net. <em>3-week build, +18% agent throughput</em>
                                                    </span>
                                                </motion.li>
                                            </motion.ul>
                                        )}

                                        {phase === 'done' && (
                                            <motion.div
                                                className="dawki-aic-chat-msg-suggestions"
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.7, duration: 0.4 }}
                                            >
                                                <span className="dawki-aic-chat-msg-suggestion">
                                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/></svg>
                                                    Show me the data-readiness checklist
                                                </span>
                                                <span className="dawki-aic-chat-msg-suggestion">
                                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                                                    Build me a 12-week roadmap
                                                </span>
                                                <span className="dawki-aic-chat-msg-suggestion">
                                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 3v18h18"/><polyline points="7 12 12 7 16 11 21 6"/></svg>
                                                    Estimate full ROI
                                                </span>
                                            </motion.div>
                                        )}
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    <div className="dawki-aic-chat-input">
                        <div className="dawki-aic-chat-input-tools">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                        </div>
                        <div className="dawki-aic-chat-input-box">Ask about your AI roadmap, data readiness, or use cases…</div>
                        <button className="dawki-aic-chat-input-send" type="button" aria-label="Send">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

/* ===========================================================================
 * Section 2: Use Case Impact/Effort Matrix — 2D quadrant scatter plot
 * =========================================================================== */
type UseCase = {
    name: string;
    eff: number; // 0–100 effort
    imp: number; // 0–100 impact
    size: number;
    cat: 'support' | 'sales' | 'ops' | 'product' | 'marketing';
    label: string;
};

const CATEGORIES = [
    { key: 'support',   name: 'Customer Support', color: '#4f7cff' },
    { key: 'sales',     name: 'Sales & Revenue',  color: '#22c55e' },
    { key: 'ops',       name: 'Operations',       color: '#a855f7' },
    { key: 'product',   name: 'Product',          color: '#ec4899' },
    { key: 'marketing', name: 'Marketing',        color: '#f97316' },
];

const USE_CASES: UseCase[] = [
    { name: '01', label: 'Auto-tag support tickets',    eff: 18, imp: 62, size: 38, cat: 'support'   },
    { name: '02', label: 'RAG FAQ assistant',           eff: 30, imp: 78, size: 50, cat: 'support'   },
    { name: '03', label: 'Reply-draft copilot',         eff: 22, imp: 70, size: 42, cat: 'support'   },
    { name: '04', label: 'Lead-scoring model',          eff: 42, imp: 76, size: 48, cat: 'sales'     },
    { name: '05', label: 'AI sales-call notetaker',     eff: 12, imp: 55, size: 36, cat: 'sales'     },
    { name: '06', label: 'Proposal-draft generator',    eff: 28, imp: 65, size: 40, cat: 'sales'     },
    { name: '07', label: 'Demand forecasting',          eff: 70, imp: 88, size: 60, cat: 'ops'       },
    { name: '08', label: 'Doc-summary copilot',         eff: 16, imp: 50, size: 34, cat: 'ops'       },
    { name: '09', label: 'Vendor contract analyzer',    eff: 38, imp: 60, size: 38, cat: 'ops'       },
    { name: '10', label: 'In-product AI features',      eff: 65, imp: 92, size: 64, cat: 'product'   },
    { name: '11', label: 'AI-powered onboarding',       eff: 52, imp: 80, size: 50, cat: 'product'   },
    { name: '12', label: 'Personalized email copy',     eff: 24, imp: 68, size: 42, cat: 'marketing' },
    { name: '13', label: 'Programmatic ad creative',    eff: 48, imp: 72, size: 44, cat: 'marketing' },
    { name: '14', label: 'Image alt-text generator',    eff: 10, imp: 28, size: 28, cat: 'marketing' },
    { name: '15', label: 'Custom-trained foundation LLM', eff: 92, imp: 35, size: 36, cat: 'product' },
];

const colorFor = (cat: UseCase['cat']) =>
    CATEGORIES.find(c => c.key === cat)?.color ?? '#4f7cff';

const UseCaseMatrix: React.FC = () => (
    <section className="dawki-aic-matrix">
        <div className="container">
            <div className="dawki-aic-matrix-heading">
                <span className="dawki-aic-matrix-pill">
                    <span></span>
                    Use Case Prioritization
                </span>
                <h2 className="dawki-aic-matrix-title">
                    Where Your AI Budget <span>Should Land First</span>
                </h2>
                <p className="dawki-aic-matrix-subtitle">
                    A composite portfolio of fifteen common AI use cases plotted by impact and effort. Quick Wins go first, Strategic Bets get scoped, Avoid stays unbuilt.
                </p>
            </div>

            <motion.div
                className="dawki-aic-matrix-frame"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
            >
                <div className="dawki-aic-matrix-canvas">
                    {/* Axis labels */}
                    <span className="dawki-aic-matrix-axis-y" aria-hidden="true">Business Impact</span>
                    <span className="dawki-aic-matrix-axis-y-end" aria-hidden="true">High</span>
                    <span className="dawki-aic-matrix-axis-y-start" aria-hidden="true">Low</span>
                    <span className="dawki-aic-matrix-axis-x" aria-hidden="true">Effort &amp; Cost →</span>
                    <span className="dawki-aic-matrix-axis-x-start" aria-hidden="true">Low</span>
                    <span className="dawki-aic-matrix-axis-x-end" aria-hidden="true">High</span>

                    {/* Quadrant labels */}
                    <span className="dawki-aic-matrix-quadrant dawki-aic-matrix-quadrant--tl" style={{ ['--q-color' as string]: '#22c55e' }}>
                        <strong>Quick Wins</strong>Build now
                    </span>
                    <span className="dawki-aic-matrix-quadrant dawki-aic-matrix-quadrant--tr" style={{ ['--q-color' as string]: '#a855f7' }}>
                        <strong>Strategic Bets</strong>Scope &amp; sequence
                    </span>
                    <span className="dawki-aic-matrix-quadrant dawki-aic-matrix-quadrant--bl" style={{ ['--q-color' as string]: '#94a3b8' }}>
                        <strong>Background</strong>Maybe later
                    </span>
                    <span className="dawki-aic-matrix-quadrant dawki-aic-matrix-quadrant--br" style={{ ['--q-color' as string]: '#ef4444' }}>
                        <strong>Avoid</strong>Don't build
                    </span>

                    {/* Bubbles */}
                    {USE_CASES.map((u, i) => (
                        <motion.div
                            key={u.name}
                            className="dawki-aic-matrix-bubble"
                            style={{
                                left: `${u.eff}%`,
                                bottom: `${u.imp}%`,
                                ['--b-size' as string]: `${u.size}px`,
                                ['--b-color' as string]: colorFor(u.cat),
                            }}
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ delay: 0.35 + i * 0.06, duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
                        >
                            {u.name}
                            <span className="dawki-aic-matrix-bubble-tooltip">{u.label}</span>
                        </motion.div>
                    ))}
                </div>

                <div className="dawki-aic-matrix-legend">
                    {CATEGORIES.map((c) => (
                        <span key={c.key} className="dawki-aic-matrix-legend-item">
                            <span className="dawki-aic-matrix-legend-dot" style={{ ['--leg' as string]: c.color }}></span>
                            {c.name}
                        </span>
                    ))}
                </div>
            </motion.div>
        </div>
    </section>
);

/* ===========================================================================
 * Section 3: AI Strategy Video Showcase
 * =========================================================================== */
const AiStrategyVideo: React.FC = () => {
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
                        See How We Turn AI Hype <span>Into Roadmaps</span>
                    </h2>
                    <p className="dawki-ent-video-subtitle">
                        A behind-the-scenes look at how we run discovery workshops, score use cases, and ship roadmaps engineering teams can actually execute.
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
export default function AiStrategyConsulting() {
    return (
        <ServicePageTemplate
            pageTitle="AI Strategy Consulting"
            breadcrumbCategory="AI & Data Engineering"
            heroPill="AI & Data Engineering"
            heroTitleStart="AI Strategy"
            heroTitleHighlight="Consulting"
            heroSubtitle="Practical AI strategy that turns hype into measurable ROI — use-case discovery, roadmaps, governance, and execution support."
            heroVideoSrc="/assets/images/header/demo/ai.mp4"
            featuresPill="Strategy that Ships"
            featuresTitleStart="AI Roadmaps"
            featuresTitleHighlight="Built to Deliver Value"
            featuresSubtitle="From idea to ROI — we help leaders identify high-impact AI use cases, design responsible architectures, and bring them to production."
            features={[
                { title: 'AI Opportunity Discovery', desc: 'Workshops to identify, score, and prioritize high-ROI AI use cases.', icon: '💡' },
                { title: 'Build vs Buy Analysis', desc: 'Honest evaluation of off-the-shelf vs custom vs fine-tuned solutions.', icon: '⚖️' },
                { title: 'Data Readiness Audit', desc: 'Assess data quality, governance, and infrastructure for AI-readiness.', icon: '🔍' },
                { title: 'Responsible AI Governance', desc: 'Bias, safety, and compliance frameworks aligned to EU AI Act and NIST AI RMF.', icon: '🛡️' },
                { title: 'AI Operating Model', desc: 'Org design, talent plan, and governance for sustainable AI adoption.', icon: '🏗️' },
                { title: 'Pilot to Production', desc: 'Roadmaps, success metrics, and execution support from PoC to production.', icon: '🚀' },
            ]}
            processSteps={[
                { n: '01', t: 'Discovery', d: 'Stakeholder interviews, current-state assessment, and AI literacy workshops.' },
                { n: '02', t: 'Use-Case Mapping', d: 'Identify, score, and prioritize use cases by ROI, feasibility, and risk.' },
                { n: '03', t: 'Roadmap', d: 'Phased plan with technology, data, talent, and governance components.' },
                { n: '04', t: 'Activate', d: 'Execution support — pilots, vendor selection, governance, and change management.' },
            ]}
            servicesPill="Our Capabilities"
            servicesTitleStart="AI Strategy"
            servicesTitleHighlight="Services We Offer"
            servicesSubtitle="From AI vision to delivery support — strategic, technical, and operational expertise."
            servicesLayout="timeline"
            serviceCards={[
                { title: 'AI Opportunity Workshops', desc: 'Interactive workshops with leadership to surface high-impact AI use cases.', icon: ICON.target },
                { title: 'AI Use-Case Scoring', desc: 'Quantitative scoring of use cases by ROI, feasibility, risk, and time-to-value.', icon: ICON.chart },
                { title: 'AI Maturity Assessment', desc: 'Benchmark your data, talent, infrastructure, and governance against industry peers.', icon: ICON.eye },
                { title: 'GenAI Strategy', desc: 'Strategic guidance on LLMs, RAG, and AI agents tailored to your business model.', icon: ICON.bot },
                { title: 'AI Roadmap Development', desc: '12–24 month phased plans with milestones, dependencies, and ROI projections.', icon: ICON.rocket },
                { title: 'Data Strategy', desc: 'Data architecture, governance, and quality strategy aligned to AI ambitions.', icon: ICON.database },
                { title: 'Build vs Buy Advisory', desc: 'Vendor evaluation, RFPs, and custom build recommendations.', icon: ICON.refresh },
                { title: 'Responsible AI & Governance', desc: 'Bias, safety, transparency, and compliance frameworks (EU AI Act, NIST AI RMF).', icon: ICON.shield },
                { title: 'AI Operating Model', desc: 'Org design, AI Center of Excellence setup, and talent strategy.', icon: ICON.users },
                { title: 'AI ROI & Business Case', desc: 'Investment justification, financial models, and success metrics.', icon: ICON.cog },
                { title: 'Change Management', desc: 'Training, communication, and adoption strategies for AI-augmented teams.', icon: ICON.megaphone },
                { title: 'Fractional AI Leadership', desc: 'Embedded fractional Chief AI Officer to lead strategy and execution.', icon: ICON.headset },
            ]}
            toolsTitleStart="AI Models &"
            toolsTitleHighlight="Frameworks We Recommend"
            toolsSubtitle="A pragmatic AI stack — foundation models, orchestration, vector search, and evaluation — chosen per use case."
            toolsLayout="vertical"
            tools={[
                { n: 'OpenAI / GPT-4',     url: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg', desc: 'Default reasoning + generation model — strong general intelligence and a mature API ecosystem.' },
                { n: 'Anthropic Claude',   s: 'anthropic',         c: 'D97757', desc: 'Best-in-class for long-context reasoning, code analysis, and agentic workflows that need careful judgment.' },
                { n: 'Google Gemini',      s: 'googlegemini',      c: '8E75B2', desc: 'Multimodal model — image-aware AI features and long-context document processing on Google Cloud.' },
                { n: 'Meta Llama 3',       s: 'meta',              c: '0467DF', desc: 'Open-weights LLM for on-premise deployments — privacy, cost control, and fine-tuning flexibility.' },
                { n: 'Mistral',            s: 'mistralai',         c: 'FF7000', desc: 'Compact, efficient European LLMs — strong for hosted EU deployments and cost-sensitive workloads.' },
                { n: 'Hugging Face',       s: 'huggingface',       c: 'FFD21E', desc: 'Model hub, datasets, and Inference API — where we benchmark, fine-tune, and deploy specialized models.' },
                { n: 'LangChain',          s: 'langchain',         c: '1C3C3C', desc: 'Orchestration framework for chains, tool use, and agent workflows — paired with our own Python utilities.' },
                { n: 'LlamaIndex',         s: 'llama',             c: '000000', desc: 'RAG framework optimized for indexing — strong on enterprise-document Q&A and structured retrieval.' },
                { n: 'Pinecone',           s: 'pinecone',          c: '000000', desc: 'Managed vector database for RAG — fast, scalable, with metadata filtering and hybrid search.' },
                { n: 'Weaviate',           s: 'weaviate',          c: '00ADB5', desc: 'Open-source vector DB for self-hosted RAG — strong with hybrid search and modular vectorizers.' },
                { n: 'pgvector',           s: 'postgresql',        c: '4169E1', desc: 'Postgres extension for embeddings — our default when teams already run Postgres and want one fewer system.' },
                { n: 'Vercel AI SDK',      s: 'vercel',            c: '000000', desc: 'TypeScript-first SDK for streaming UI, tool calls, and provider-agnostic AI in Next.js apps.' },
                { n: 'Replicate',          s: 'replicate',         c: '000000', desc: 'Run open-source models on demand — perfect for image/video generation and proof-of-concept work.' },
                { n: 'OpenAI Whisper',     url: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg', desc: 'State-of-the-art speech-to-text — meeting transcription, voice agents, and audio-search workloads.' },
                { n: 'ElevenLabs',         s: 'elevenlabs',        c: '000000', desc: 'Hyper-realistic text-to-speech and voice cloning — used in voice agents, audio content, and accessibility.' },
                { n: 'Weights & Biases',   s: 'weightsandbiases',  c: 'FFBE00', desc: 'Experiment tracking and model evaluation — required when fine-tuning or comparing models systematically.' },
            ]}
            hideProjects={true}
            hideTestimonial={true}
            showClients={true}
            clientsPill="Trusted By AI Leaders"
            clientsHeading="From Lean Startups to Fortune 500 Boards,"
            clientsHeadingHighlight="We Turn AI Strategy Into Real Outcomes"
            extraSections={
                <>
                    <AIChatMockup />
                    <UseCaseMatrix />
                    <AiStrategyVideo />
                </>
            }
            googleReviews={[
                {
                    name: 'Christine Vandermeer',
                    role: 'CDO, Brightline Health',
                    rating: 5,
                    date: '2 months ago',
                    text: 'Their AI use-case scoring framework killed three projects we were ready to fund — and surfaced two we hadn\'t considered. The board adopted their roadmap whole-cloth.',
                },
                {
                    name: 'Imani Okonkwo',
                    role: 'VP Strategy, FinFleet',
                    rating: 5,
                    date: '4 months ago',
                    text: 'Build-vs-buy advisory across eleven vendor categories. Their analysis was the cleanest, most opinionated decision document I\'ve received from any consultancy.',
                },
                {
                    name: 'Ben Kowalski',
                    role: 'Founder, Cordwell SaaS',
                    rating: 5,
                    date: '6 months ago',
                    text: 'A six-week strategy engagement that actually shipped. We had a roadmap, a Phase 1 PoC, and a hire plan — and the first two use cases were live within four months.',
                },
                {
                    name: 'Anika Sharma',
                    role: 'Head of Innovation, Vertex Manufacturing',
                    rating: 5,
                    date: '3 months ago',
                    text: 'Responsible-AI governance framework aligned to the EU AI Act before we needed it. Two of our European customers cited it during procurement reviews.',
                },
                {
                    name: 'Lukas Bauer',
                    role: 'Chief of Staff, Pulsemark Labs',
                    rating: 5,
                    date: '5 months ago',
                    text: 'Fractional CAIO engagement for nine months — they ran AI strategy for our entire C-suite and helped us hire a permanent leader to take it forward.',
                },
                {
                    name: 'Sofia Gallo',
                    role: 'CTO, MeshCart',
                    rating: 5,
                    date: '7 months ago',
                    text: 'Honest assessment that our data wasn\'t ready for the use cases we wanted. They built the data plan first, then the AI plan — saved us a year of false starts.',
                },
            ]}
            googleReviewsHeading="What AI Leaders Say About Us"
            googleReviewsSubtitle="Verified reviews from CDOs, CTOs, and innovation leads we've shipped AI strategy with."
            faqs={[
                { q: 'What is AI strategy consulting?', a: 'AI strategy consulting helps organizations identify, prioritize, and execute AI initiatives that deliver real business value — covering use cases, data, talent, governance, and ROI.' },
                { q: 'How do I know if AI is right for my business?', a: 'Most businesses have at least a few high-ROI AI opportunities. Our discovery workshops surface and score them so you invest only where it pays off.' },
                { q: 'Should we build or buy AI?', a: 'Both have a place. Buy commodity capabilities, build where AI is core to your differentiation. We help analyze the trade-offs.' },
                { q: 'What is responsible AI?', a: 'Frameworks for fairness, safety, transparency, and accountability — increasingly required by regulation (EU AI Act, NIST AI RMF) and customers.' },
                { q: 'How long does an AI strategy engagement take?', a: 'Discovery and strategy phases typically run 6–10 weeks. Roadmap execution support extends across 6–18 months.' },
                { q: 'Do you also implement the AI solutions?', a: 'Yes. We have separate AI Agent Development and Data Engineering practices that execute the roadmaps we design.' },
                { q: 'How do you measure AI success?', a: 'We tie use cases to specific KPIs — revenue lift, cost savings, cycle time, accuracy, NPS — and report on them through delivery.' },
            ]}
        />
    );
}
