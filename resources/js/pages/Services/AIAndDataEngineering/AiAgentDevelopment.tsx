import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ServicePageTemplate, { ICON } from '@/components/ServicePageTemplate';

/* ===========================================================================
 * Section 1: Agent Reasoning Trace — debug-style step-by-step trace
 * =========================================================================== */
type TraceStep = {
    tag: string;
    tagBg: string;
    tagBorder: string;
    tagColor: string;
    content: React.ReactNode;
    code?: React.ReactNode;
    meta?: { label: string; value: string }[];
};

const TRACE_STEPS: TraceStep[] = [
    {
        tag: 'INPUT',
        tagBg: 'rgba(148, 163, 184, 0.10)',
        tagBorder: 'rgba(148, 163, 184, 0.35)',
        tagColor: '#cbd5e1',
        content: (
            <>
                <strong>User:</strong> "Find the three most-shipped customer-support tickets from last week and draft a help-center article about each."
            </>
        ),
        meta: [{ label: 'Session', value: 'sess_42a9f1' }, { label: 'Tokens', value: '38' }],
    },
    {
        tag: 'THOUGHT',
        tagBg: 'rgba(168, 85, 247, 0.10)',
        tagBorder: 'rgba(168, 85, 247, 0.32)',
        tagColor: '#d8b4fe',
        content: (
            <>
                The user wants ticket analysis + content generation. I'll need to (1) query the support DB for last week's tickets, (2) cluster them by topic, (3) pick the top three, (4) draft articles using our help-center voice.
            </>
        ),
    },
    {
        tag: 'TOOL_CALL',
        tagBg: 'rgba(79, 124, 255, 0.10)',
        tagBorder: 'rgba(79, 124, 255, 0.32)',
        tagColor: '#93c5fd',
        content: <>Calling internal Postgres tool to fetch tickets:</>,
        code: (
            <>
                <span className="csw-fn">query_postgres</span>
                <span>(</span>
                <span className="csw-prop">sql</span>
                <span>=</span>
                <span className="csw-str">"SELECT id, subject, body, created_at FROM tickets WHERE created_at &gt;= NOW() - INTERVAL '7 days'"</span>
                <span>)</span>
            </>
        ),
        meta: [{ label: 'Tool', value: 'query_postgres' }, { label: 'Latency', value: '142ms' }],
    },
    {
        tag: 'OBSERVATION',
        tagBg: 'rgba(6, 182, 212, 0.10)',
        tagBorder: 'rgba(6, 182, 212, 0.32)',
        tagColor: '#67e8f9',
        content: (
            <>
                Returned <strong>1,284 tickets</strong>. Top topics surfaced via embedding cluster: <em>"Stripe webhook timing"</em>, <em>"SSO with Okta"</em>, <em>"Bulk export limits"</em>.
            </>
        ),
        meta: [{ label: 'Rows', value: '1284' }, { label: 'Clusters', value: '12' }],
    },
    {
        tag: 'TOOL_CALL',
        tagBg: 'rgba(79, 124, 255, 0.10)',
        tagBorder: 'rgba(79, 124, 255, 0.32)',
        tagColor: '#93c5fd',
        content: <>Calling content-generation tool with brand-voice context:</>,
        code: (
            <>
                <span className="csw-fn">draft_article</span>
                <span>(</span>
                <span className="csw-prop">topic</span>
                <span>=</span>
                <span className="csw-str">"Stripe webhook timing"</span>
                <span className="csw-punc">,</span>{' '}
                <span className="csw-prop">voice</span>
                <span>=</span>
                <span className="csw-str">"helpful + technical + friendly"</span>
                <span>)</span>
            </>
        ),
        meta: [{ label: 'Tool', value: 'draft_article' }, { label: 'Latency', value: '2.4s' }],
    },
    {
        tag: 'OBSERVATION',
        tagBg: 'rgba(6, 182, 212, 0.10)',
        tagBorder: 'rgba(6, 182, 212, 0.32)',
        tagColor: '#67e8f9',
        content: (
            <>
                Drafted three articles (<strong>1,200–1,800 words each</strong>), passed PII redaction, brand-voice eval scored <em>0.94 / 1.00</em>.
            </>
        ),
    },
    {
        tag: 'RESPONSE',
        tagBg: 'rgba(34, 197, 94, 0.10)',
        tagBorder: 'rgba(34, 197, 94, 0.35)',
        tagColor: '#86efac',
        content: (
            <>
                <strong>Done.</strong> Three help-center articles drafted from last week's top tickets — each linked to the originating cluster, ready for editor review. Saved to <em>/drafts/2026-04-w4/</em>.
            </>
        ),
        meta: [{ label: 'Total', value: '6 steps · 4.1s' }, { label: 'Cost', value: '$0.18' }],
    },
];

const AgentTrace: React.FC = () => (
    <section className="dawki-aag-trace">
        <div className="container">
            <div className="dawki-aag-trace-heading">
                <span className="dawki-aag-trace-pill">
                    <span></span>
                    Agent Trace
                </span>
                <h2 className="dawki-aag-trace-title">
                    Inside an Agent's <span>Reasoning Loop</span>
                </h2>
                <p className="dawki-aag-trace-subtitle">
                    Every agent we ship is fully observable. Here's a real-shaped trace of one of ours doing a multi-step support-content task — instrumented end to end.
                </p>
            </div>

            <motion.div
                className="dawki-aag-trace-frame"
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
            >
                <div className="dawki-aag-trace-titlebar">
                    <div className="dawki-aag-trace-titlebar-dots">
                        <span></span><span></span><span></span>
                    </div>
                    <span className="dawki-aag-trace-titlebar-name">trace · agent_v3 · session sess_42a9f1</span>
                    <span className="dawki-aag-trace-titlebar-status">Streaming</span>
                </div>

                <motion.div
                    className="dawki-aag-trace-body"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-60px' }}
                    variants={{
                        hidden: {},
                        show: { transition: { staggerChildren: 0.18, delayChildren: 0.3 } },
                    }}
                >
                    {TRACE_STEPS.map((step, i) => (
                        <motion.div
                            key={i}
                            className="dawki-aag-trace-step"
                            variants={{
                                hidden: { opacity: 0, x: -10 },
                                show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] } },
                            }}
                        >
                            <span
                                className="dawki-aag-trace-step-tag"
                                style={{
                                    ['--tg-bg' as string]: step.tagBg,
                                    ['--tg-border' as string]: step.tagBorder,
                                    ['--tg-color' as string]: step.tagColor,
                                }}
                            >
                                {step.tag}
                            </span>
                            <div className="dawki-aag-trace-step-content">
                                {step.content}
                                {step.code && <code className="dawki-aag-trace-step-code">{step.code}</code>}
                                {step.meta && (
                                    <div className="dawki-aag-trace-step-meta">
                                        {step.meta.map((m) => (
                                            <span key={m.label} className="dawki-aag-trace-step-meta-pill">
                                                {m.label}: {m.value}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    </section>
);

/* ===========================================================================
 * Section 2: Multi-Agent Workflow DAG — specialized agents + animated edges
 * =========================================================================== */
type AgentNode = {
    id: string;
    name: string;
    role: string;
    task: string;
    icon: React.ReactNode;
    a: string; b: string; glow: string;
    statusColor: string;
    statusText: string;
    x: number; y: number; // % positions in the stage
    terminal?: boolean;
};

const AGENTS: AgentNode[] = [
    {
        id: 'input',
        name: 'User Query',
        role: 'Input',
        task: '"Plan and ship a feature spec for the new pricing page."',
        terminal: true,
        a: '#94a3b8', b: '#475569', glow: 'rgba(148, 163, 184, 0.4)',
        statusColor: '#94a3b8',
        statusText: 'Received',
        x: 50, y: 9,
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
            </svg>
        ),
    },
    {
        id: 'researcher',
        name: 'Researcher',
        role: 'Knowledge Retrieval',
        task: 'Searches docs, transcripts, and Linear tickets for relevant context.',
        a: '#06b6d4', b: '#4f7cff', glow: 'rgba(6, 182, 212, 0.55)',
        statusColor: '#67e8f9',
        statusText: 'Querying',
        x: 22, y: 38,
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
        ),
    },
    {
        id: 'planner',
        name: 'Planner',
        role: 'Task Decomposition',
        task: 'Breaks the goal into ordered subtasks with dependencies and DoD.',
        a: '#a855f7', b: '#ec4899', glow: 'rgba(168, 85, 247, 0.55)',
        statusColor: '#d8b4fe',
        statusText: 'Planning',
        x: 78, y: 38,
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="6"/>
                <circle cx="12" cy="12" r="2"/>
            </svg>
        ),
    },
    {
        id: 'writer',
        name: 'Writer',
        role: 'Spec Drafting',
        task: 'Writes the spec in your team\'s structure: goals, scope, edge cases, KPIs.',
        a: '#4f7cff', b: '#a855f7', glow: 'rgba(79, 124, 255, 0.55)',
        statusColor: '#93c5fd',
        statusText: 'Drafting',
        x: 22, y: 70,
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/>
            </svg>
        ),
    },
    {
        id: 'critic',
        name: 'Critic',
        role: 'Eval & Safety',
        task: 'Reviews drafts against rubric, flags hallucinations, runs safety guardrails.',
        a: '#f97316', b: '#ec4899', glow: 'rgba(249, 115, 22, 0.55)',
        statusColor: '#fed7aa',
        statusText: 'Reviewing',
        x: 78, y: 70,
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="M9 12l2 2 4-4"/>
            </svg>
        ),
    },
    {
        id: 'output',
        name: 'Final Output',
        role: 'Result',
        task: 'Approved spec doc + Linear epic + handoff notes for engineering.',
        terminal: true,
        a: '#22c55e', b: '#06b6d4', glow: 'rgba(34, 197, 94, 0.55)',
        statusColor: '#86efac',
        statusText: 'Done',
        x: 50, y: 95,
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
        ),
    },
];

// Edges from→to, control offsets define curve tension
const EDGES = [
    { from: 'input',      to: 'researcher' },
    { from: 'input',      to: 'planner'    },
    { from: 'researcher', to: 'writer'     },
    { from: 'planner',    to: 'writer'     },
    { from: 'planner',    to: 'critic'     },
    { from: 'writer',     to: 'critic'     },
    { from: 'writer',     to: 'output'     },
    { from: 'critic',     to: 'output'     },
];

const findAgent = (id: string) => AGENTS.find((a) => a.id === id)!;

const buildPath = (fromId: string, toId: string) => {
    const from = findAgent(fromId);
    const to = findAgent(toId);
    const x1 = from.x;
    const y1 = from.y;
    const x2 = to.x;
    const y2 = to.y;
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2;
    return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
};

const CrewWorkflow: React.FC = () => (
    <section className="dawki-aag-crew">
        <div className="container">
            <div className="dawki-aag-crew-heading">
                <span className="dawki-aag-crew-pill">
                    <span></span>
                    Multi-Agent Orchestration
                </span>
                <h2 className="dawki-aag-crew-title">
                    A Specialized Crew, <span>Working In Lockstep</span>
                </h2>
                <p className="dawki-aag-crew-subtitle">
                    Single-agent loops break on complex work. We build crews of role-specialized agents — each with its own tools, prompts, and guardrails — orchestrated by LangGraph or CrewAI.
                </p>
            </div>

            {/* Desktop / tablet — full DAG */}
            <motion.div
                className="dawki-aag-crew-stage"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
            >
                {/* SVG edges */}
                <svg className="dawki-aag-crew-edges" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                    <defs>
                        <linearGradient id="dawkiAagEdgeGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%"  stopColor="#06b6d4" />
                            <stop offset="50%" stopColor="#a855f7" />
                            <stop offset="100%" stopColor="#22c55e" />
                        </linearGradient>
                    </defs>
                    {EDGES.map((e, i) => (
                        <g key={`${e.from}-${e.to}`}>
                            <motion.path
                                id={`dawki-aag-edge-${i}`}
                                d={buildPath(e.from, e.to)}
                                className="dawki-aag-crew-edge"
                                initial={{ pathLength: 0, opacity: 0 }}
                                whileInView={{ pathLength: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.0, delay: 0.4 + i * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
                            />
                            <circle r="0.9" className="dawki-aag-crew-packet-dot">
                                <animateMotion dur={`${3 + (i % 3) * 0.6}s`} repeatCount="indefinite" begin={`${i * 0.4}s`}>
                                    <mpath href={`#dawki-aag-edge-${i}`} />
                                </animateMotion>
                            </circle>
                        </g>
                    ))}
                </svg>

                {/* Agent cards positioned absolutely */}
                {AGENTS.map((ag, i) => (
                    <motion.div
                        key={ag.id}
                        className={`dawki-aag-crew-agent${ag.terminal ? ' dawki-aag-crew-agent--terminal' : ''}`}
                        style={{
                            left: `${ag.x}%`,
                            top: `${ag.y}%`,
                            ['--ag-a' as string]: ag.a,
                            ['--ag-b' as string]: ag.b,
                            ['--ag-glow' as string]: ag.glow,
                            ['--st-c' as string]: ag.statusColor,
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ delay: 0.3 + i * 0.12, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                    >
                        <div className="dawki-aag-crew-agent-head">
                            <span className="dawki-aag-crew-agent-avatar">{ag.icon}</span>
                            <div className="dawki-aag-crew-agent-meta">
                                <h3 className="dawki-aag-crew-agent-name">{ag.name}</h3>
                                <span className="dawki-aag-crew-agent-role">{ag.role}</span>
                            </div>
                        </div>
                        <p className="dawki-aag-crew-agent-task">{ag.task}</p>
                        <span className="dawki-aag-crew-agent-status">{ag.statusText}</span>
                    </motion.div>
                ))}
            </motion.div>

            {/* Mobile — stacked agent cards with arrows */}
            <div className="dawki-aag-crew-stage--mobile">
                {AGENTS.map((ag, i) => (
                    <React.Fragment key={ag.id}>
                        {i > 0 && <span className="dawki-aag-crew-mobile-arrow">↓</span>}
                        <motion.div
                            className={`dawki-aag-crew-agent${ag.terminal ? ' dawki-aag-crew-agent--terminal' : ''}`}
                            style={{
                                ['--ag-a' as string]: ag.a,
                                ['--ag-b' as string]: ag.b,
                                ['--ag-glow' as string]: ag.glow,
                                ['--st-c' as string]: ag.statusColor,
                            }}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
                        >
                            <div className="dawki-aag-crew-agent-head">
                                <span className="dawki-aag-crew-agent-avatar">{ag.icon}</span>
                                <div className="dawki-aag-crew-agent-meta">
                                    <h3 className="dawki-aag-crew-agent-name">{ag.name}</h3>
                                    <span className="dawki-aag-crew-agent-role">{ag.role}</span>
                                </div>
                            </div>
                            <p className="dawki-aag-crew-agent-task">{ag.task}</p>
                            <span className="dawki-aag-crew-agent-status">{ag.statusText}</span>
                        </motion.div>
                    </React.Fragment>
                ))}
            </div>

            <div className="dawki-aag-crew-legend">
                <span className="dawki-aag-crew-legend-pill" style={{ ['--leg' as string]: '#06b6d4' }}><span></span>Researcher</span>
                <span className="dawki-aag-crew-legend-pill" style={{ ['--leg' as string]: '#a855f7' }}><span></span>Planner</span>
                <span className="dawki-aag-crew-legend-pill" style={{ ['--leg' as string]: '#4f7cff' }}><span></span>Writer</span>
                <span className="dawki-aag-crew-legend-pill" style={{ ['--leg' as string]: '#f97316' }}><span></span>Critic</span>
                <span className="dawki-aag-crew-legend-pill" style={{ ['--leg' as string]: '#22c55e' }}><span></span>Output</span>
            </div>
        </div>
    </section>
);

/* ===========================================================================
 * Section 3: AI Agent Video Showcase
 * =========================================================================== */
const AiAgentVideo: React.FC = () => {
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
                        Inside The Agent Lab
                    </span>
                    <h2 className="dawki-ent-video-title">
                        See How We Ship <span>Production AI Agents</span>
                    </h2>
                    <p className="dawki-ent-video-subtitle">
                        A behind-the-scenes look at how we design tool schemas, harden guardrails, and run evals — so the agents we deploy keep working under real-world load.
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
export default function AiAgentDevelopment() {
    return (
        <ServicePageTemplate
            pageTitle="AI Agent Development"
            breadcrumbCategory="AI & Data Engineering"
            heroPill="AI & Data Engineering"
            heroTitleStart="AI Agent"
            heroTitleHighlight="Development"
            heroSubtitle="Production-grade AI agents — RAG, tool use, multi-agent orchestration — built on GPT, Claude, Gemini, and open-source models."
            heroVideoSrc="/assets/images/header/demo/ai-agent.mp4"
            featuresPill="Agentic AI"
            featuresTitleStart="AI Agents That"
            featuresTitleHighlight="Actually Get Work Done"
            featuresSubtitle="From customer support copilots to autonomous research agents — we build LLM-powered systems that ship to production safely."
            features={[
                { title: 'RAG Pipelines', desc: 'Retrieval-augmented generation with vector DBs, hybrid search, and reranking.', icon: '🔎' },
                { title: 'Tool Use & Function Calling', desc: 'Agents that call APIs, search the web, run code, and act on enterprise systems.', icon: '🛠️' },
                { title: 'Multi-Agent Orchestration', desc: 'LangGraph, CrewAI, and Anthropic Agent SDK orchestration for complex workflows.', icon: '🤝' },
                { title: 'Model-Agnostic', desc: 'GPT, Claude, Gemini, Llama, Mistral — chosen per task with seamless swapping.', icon: '🧠' },
                { title: 'Safety & Guardrails', desc: 'Jailbreak resistance, PII redaction, output validation, and policy enforcement.', icon: '🛡️' },
                { title: 'Observability & Evals', desc: 'Tracing, eval suites, and red-teaming so you ship with confidence.', icon: '👁️' },
            ]}
            processSteps={[
                { n: '01', t: 'Use-Case Design', d: 'Define the agent\'s job, success criteria, tools, and escalation paths.' },
                { n: '02', t: 'Prototype', d: 'Working PoC in 2–3 weeks with realistic data and evals.' },
                { n: '03', t: 'Production Build', d: 'Hardened pipelines, guardrails, observability, and integrations.' },
                { n: '04', t: 'Operate & Improve', d: 'Continuous evals, prompt iteration, and safety monitoring.' },
            ]}
            servicesPill="Our Capabilities"
            servicesTitleStart="AI Agent Development"
            servicesTitleHighlight="Services We Offer"
            servicesSubtitle="End-to-end agentic AI — from concept to production-grade deployment."
            servicesLayout="timeline"
            serviceCards={[
                { title: 'Custom AI Agent Development', desc: 'Bespoke agents built around your workflows, knowledge, and business systems.', icon: ICON.bot },
                { title: 'RAG Implementation', desc: 'Vector DBs (Pinecone, Weaviate, pgvector), hybrid search, and reranking pipelines.', icon: ICON.search },
                { title: 'Conversational AI & Chatbots', desc: 'Multi-turn chat agents for support, sales, and internal productivity.', icon: ICON.megaphone },
                { title: 'AI Copilots & Assistants', desc: 'In-app copilots that draft, summarize, and act inside your product or workflow.', icon: ICON.rocket },
                { title: 'Multi-Agent Systems', desc: 'Orchestrated agent teams using LangGraph, CrewAI, and AutoGen.', icon: ICON.users },
                { title: 'Voice AI & IVR Agents', desc: 'Realtime voice agents with Twilio, Deepgram, ElevenLabs, and OpenAI Realtime.', icon: ICON.headset },
                { title: 'LLM Fine-Tuning', desc: 'Domain adaptation via SFT, DPO, and LoRA on open-source and proprietary models.', icon: ICON.cog },
                { title: 'Prompt Engineering', desc: 'Production-grade prompt design, few-shot, and chain-of-thought techniques.', icon: ICON.code },
                { title: 'AI Workflow Automation', desc: 'Automate document processing, research, and back-office workflows end to end.', icon: ICON.refresh },
                { title: 'AI Safety & Guardrails', desc: 'PII redaction, jailbreak prevention, output validation, and policy enforcement.', icon: ICON.shield },
                { title: 'Eval & Observability', desc: 'LangSmith, LangFuse, and custom eval suites for quality and regression testing.', icon: ICON.eye },
                { title: 'AI Agent Maintenance', desc: 'Model upgrades, prompt iteration, eval monitoring, and incident response.', icon: ICON.infinity },
            ]}
            toolsTitleStart="AI Agent Stack &"
            toolsTitleHighlight="Frameworks We Build On"
            toolsSubtitle="A pragmatic agentic-AI stack — orchestration, tooling, retrieval, eval, and observability — chosen per task and combined as needed."
            toolsLayout="vertical"
            tools={[
                { n: 'OpenAI / GPT-4',     url: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg', desc: 'Default reasoning model — strong tool-use, function calling, and a mature streaming API.' },
                { n: 'Anthropic Claude',   s: 'anthropic',         c: 'D97757', desc: 'Best-in-class for long-context reasoning and agentic workflows that need careful judgment.' },
                { n: 'Google Gemini',      s: 'googlegemini',      c: '8E75B2', desc: 'Multimodal model — image-aware agents and long-context document processing on Google Cloud.' },
                { n: 'Meta Llama 3',       s: 'meta',              c: '0467DF', desc: 'Open-weights LLM for self-hosted agents — privacy, cost control, and fine-tuning flexibility.' },
                { n: 'LangChain',          s: 'langchain',         c: '1C3C3C', desc: 'Orchestration framework for chains, tool use, and agent loops — paired with our Python utilities.' },
                { n: 'LangGraph',          s: 'langgraph',         c: '1C3C3C', desc: 'Graph-based agent orchestration — durable state, branching workflows, and human-in-the-loop checkpoints.' },
                { n: 'CrewAI',             s: 'crewai',            c: 'F89E0E', desc: 'Role-based multi-agent orchestration — specialized agents collaborating via tasks and goals.' },
                { n: 'AutoGen',            s: 'microsoft',         c: '00A4EF', desc: 'Microsoft\'s multi-agent conversation framework — strong for code-execution and tool-using agents.' },
                { n: 'LlamaIndex',         s: 'llama',             c: '000000', desc: 'RAG framework optimized for indexing — enterprise document Q&A, structured retrieval, and tool routing.' },
                { n: 'Pinecone',           s: 'pinecone',          c: '000000', desc: 'Managed vector database for RAG — fast, scalable, with metadata filtering and hybrid search.' },
                { n: 'Weaviate',           s: 'weaviate',          c: '00ADB5', desc: 'Open-source vector DB — strong with hybrid search and modular vectorizers for self-hosted RAG.' },
                { n: 'pgvector',           s: 'postgresql',        c: '4169E1', desc: 'Postgres extension for embeddings — our default when teams already run Postgres and want one fewer system.' },
                { n: 'LangSmith',          s: 'langchain',         c: '1C3C3C', desc: 'Tracing, evaluation, and prompt versioning — every agent we ship is observable end to end.' },
                { n: 'LangFuse',           s: 'langfuse',          c: '0F1117', desc: 'Open-source LLM observability — sessions, traces, and eval metrics for self-hosted stacks.' },
                { n: 'Anthropic Agent SDK', s: 'anthropic',        c: 'D97757', desc: 'Production tooling for Claude-based agents — long-running tasks, tool use, and durable execution.' },
                { n: 'Vercel AI SDK',      s: 'vercel',            c: '000000', desc: 'TypeScript SDK for streaming UI, tool calls, and provider-agnostic AI in Next.js apps.' },
            ]}
            hideProjects={true}
            hideTestimonial={true}
            showClients={true}
            clientsPill="Trusted By AI-Forward Teams"
            clientsHeading="From Founder PoCs to Fortune 500 Pilots,"
            clientsHeadingHighlight="We Ship Agents That Hold Up"
            extraSections={
                <>
                    <AgentTrace />
                    <CrewWorkflow />
                    <AiAgentVideo />
                </>
            }
            googleReviews={[
                {
                    name: 'Priya Mahajan',
                    role: 'Head of AI, Brightline Health',
                    rating: 5,
                    date: '2 months ago',
                    text: 'Their RAG pipeline cut our agent\'s hallucination rate from 11% to under 2%. The eval harness they built means we can ship updates with confidence — that\'s the part most agencies skip.',
                },
                {
                    name: 'Daniel Cho',
                    role: 'Director of Engineering, Cordwell SaaS',
                    rating: 5,
                    date: '4 months ago',
                    text: 'Multi-agent crew built on LangGraph that handles our customer-research workflow end to end. What used to take an analyst 3 hours runs in 4 minutes — same quality.',
                },
                {
                    name: 'Aiyana Ferguson',
                    role: 'CTO, Northwind Realty',
                    rating: 5,
                    date: '6 months ago',
                    text: 'Voice agent on OpenAI Realtime + Twilio for our after-hours leasing inquiries. Booked 187 tours in the first month — ROI was clear by the second week.',
                },
                {
                    name: 'Tomás Rivera',
                    role: 'Founder, Pulsemark Labs',
                    rating: 5,
                    date: '3 months ago',
                    text: 'They built our internal-research copilot grounded on Notion + Linear + Slack. Onboarding for new PMs went from two weeks to two days.',
                },
                {
                    name: 'Henrik Sondergaard',
                    role: 'VP Product, FinFleet',
                    rating: 5,
                    date: '5 months ago',
                    text: 'Guardrails and PII redaction designed for SOC 2 + GDPR — passed our security review on first pass. The agent has been in prod for 9 months without an incident.',
                },
                {
                    name: 'Maya Olafsdottir',
                    role: 'Head of Operations, MeshCart',
                    rating: 5,
                    date: '7 months ago',
                    text: 'Their honest assessment that one of our planned agents wasn\'t a good fit — and would underperform a workflow rule — saved us six months and a quarter\'s budget.',
                },
            ]}
            googleReviewsHeading="What AI Engineering Teams Say About Us"
            googleReviewsSubtitle="Verified reviews from heads of AI, product leads, and CTOs we've shipped agents into production with."
            faqs={[
                { q: 'What are AI agents?', a: 'AI agents are LLM-powered systems that can reason, plan, use tools, and take actions to complete multi-step tasks autonomously or with human oversight.' },
                { q: 'Which LLMs do you work with?', a: 'GPT (OpenAI), Claude (Anthropic), Gemini (Google), Llama, Mistral, Cohere, and self-hosted open-source models — chosen per task.' },
                { q: 'Will my data be used to train models?', a: 'No. We use enterprise-grade APIs with no-train policies (OpenAI, Anthropic, Azure OpenAI) or self-host open-source models entirely on your infrastructure.' },
                { q: 'How accurate are AI agents?', a: 'It depends on the task. With proper RAG, tool use, evals, and human-in-the-loop design, production agents can hit 90%+ task success on well-scoped problems.' },
                { q: 'How long does an AI agent project take?', a: 'A working PoC usually ships in 2–4 weeks. Production-grade agents with guardrails and integrations typically ship in 8–16 weeks.' },
                { q: 'How do you prevent hallucinations?', a: 'RAG over verified sources, output validation, citations, confidence scoring, and structured outputs — combined with rigorous eval suites.' },
                { q: 'Do you support voice and multimodal agents?', a: 'Yes. We build voice agents with OpenAI Realtime, Deepgram, ElevenLabs, and multimodal agents that handle text, image, and audio.' },
            ]}
        />
    );
}
