import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ServicePageTemplate, { ICON } from '@/components/ServicePageTemplate';

/* ===========================================================================
 * Section 1: Code Editor Mockup — VS Code-style with animated typed code
 * =========================================================================== */
const CODE_LINES = [
    { num: 1,  content: <><span className="csw-cmt">// AppRouter.tsx — built for your business logic</span></> },
    { num: 2,  content: <><span className="csw-kw">import</span> <span className="csw-punc">{'{'}</span> <span className="csw-var">useEffect</span><span className="csw-punc">,</span> <span className="csw-var">useState</span> <span className="csw-punc">{'}'}</span> <span className="csw-kw">from</span> <span className="csw-str">'react'</span><span className="csw-punc">;</span></> },
    { num: 3,  content: <><span className="csw-kw">import</span> <span className="csw-punc">{'{'}</span> <span className="csw-var">apiClient</span> <span className="csw-punc">{'}'}</span> <span className="csw-kw">from</span> <span className="csw-str">'@/lib/api'</span><span className="csw-punc">;</span></> },
    { num: 4,  content: <></> },
    { num: 5,  content: <><span className="csw-kw">export function</span> <span className="csw-fn">DashboardRoute</span><span className="csw-punc">() {'{'}</span></> },
    { num: 6,  content: <><span style={{ paddingLeft: '1em' }}><span className="csw-kw">const</span> <span className="csw-punc">[</span><span className="csw-var">data</span><span className="csw-punc">,</span> <span className="csw-fn">setData</span><span className="csw-punc">]</span> = <span className="csw-fn">useState</span><span className="csw-punc">(</span><span className="csw-kw">null</span><span className="csw-punc">);</span></span></> },
    { num: 7,  content: <></> },
    { num: 8,  content: <><span style={{ paddingLeft: '1em' }}><span className="csw-fn">useEffect</span><span className="csw-punc">(() {'=>'} {'{'}</span></span></> },
    { num: 9,  content: <><span style={{ paddingLeft: '2em' }}><span className="csw-var">apiClient</span><span className="csw-punc">.</span><span className="csw-fn">get</span><span className="csw-punc">(</span><span className="csw-str">'/api/dashboard'</span><span className="csw-punc">).</span><span className="csw-fn">then</span><span className="csw-punc">(</span><span className="csw-fn">setData</span><span className="csw-punc">);</span></span></> },
    { num: 10, content: <><span style={{ paddingLeft: '1em' }}><span className="csw-punc">{'}'}, []);</span></span></> },
    { num: 11, content: <></> },
    { num: 12, content: <><span style={{ paddingLeft: '1em' }}><span className="csw-kw">return</span> <span className="csw-punc">(</span></span></> },
    { num: 13, content: <><span style={{ paddingLeft: '2em' }}><span className="csw-punc">{'<'}</span><span className="csw-tag">Layout</span> <span className="csw-prop">title</span><span className="csw-punc">=</span><span className="csw-str">"Operations"</span><span className="csw-punc">{'>'}</span></span></> },
    { num: 14, content: <><span style={{ paddingLeft: '3em' }}><span className="csw-punc">{'<'}</span><span className="csw-tag">MetricsGrid</span> <span className="csw-prop">data</span><span className="csw-punc">{'={data}'}</span> <span className="csw-punc">{'/>'}</span></span></> },
    { num: 15, content: <><span style={{ paddingLeft: '3em' }}><span className="csw-punc">{'<'}</span><span className="csw-tag">ActivityFeed</span> <span className="csw-prop">limit</span><span className="csw-punc">{'={'}</span><span className="csw-num">50</span><span className="csw-punc">{'}'}</span> <span className="csw-punc">{'/>'}</span><span className="csw-cursor"></span></span></> },
    { num: 16, content: <><span style={{ paddingLeft: '2em' }}><span className="csw-punc">{'<'}/<span className="csw-tag">Layout</span><span className="csw-punc">{'>'}</span></span></span></> },
    { num: 17, content: <><span style={{ paddingLeft: '1em' }}><span className="csw-punc">);</span></span></> },
    { num: 18, content: <><span className="csw-punc">{'}'}</span></> },
];

const CodeEditorMockup: React.FC = () => (
    <section className="dawki-csw-code">
        <div className="container">
            <div className="dawki-csw-code-heading">
                <span className="dawki-csw-code-pill">
                    <span></span>
                    Engineering In Action
                </span>
                <h2 className="dawki-csw-code-title">
                    Clean Code, Production-Ready, <span>From Day One</span>
                </h2>
                <p className="dawki-csw-code-subtitle">
                    Type-safe, well-tested, well-documented — every commit reviewed, every PR shipped through automated quality gates.
                </p>
            </div>

            <motion.div
                className="dawki-csw-code-window"
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
            >
                <div className="dawki-csw-code-titlebar">
                    <div className="dawki-csw-code-dots">
                        <span></span><span></span><span></span>
                    </div>
                    <span className="dawki-csw-code-titlebar-title">your-product / src / routes / DashboardRoute.tsx</span>
                </div>

                <div className="dawki-csw-code-tabs">
                    <span className="dawki-csw-code-tab dawki-csw-code-tab--active">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        DashboardRoute.tsx
                        <span className="dawki-csw-code-tab-close">×</span>
                    </span>
                    <span className="dawki-csw-code-tab">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        api.ts
                    </span>
                    <span className="dawki-csw-code-tab">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        types.ts
                    </span>
                </div>

                <div className="dawki-csw-code-body">
                    <div className="dawki-csw-code-sidebar">
                        <div className="dawki-csw-code-tree">
                            <div className="dawki-csw-code-tree-item dawki-csw-code-tree-item--folder">
                                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
                                src
                            </div>
                            <div className="dawki-csw-code-tree-item dawki-csw-code-tree-item--child dawki-csw-code-tree-item--folder">
                                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
                                routes
                            </div>
                            <div className="dawki-csw-code-tree-item dawki-csw-code-tree-item--child dawki-csw-code-tree-item--active" style={{ paddingLeft: 36 }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                DashboardRoute.tsx
                            </div>
                            <div className="dawki-csw-code-tree-item dawki-csw-code-tree-item--child" style={{ paddingLeft: 36 }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                SettingsRoute.tsx
                            </div>
                            <div className="dawki-csw-code-tree-item dawki-csw-code-tree-item--child dawki-csw-code-tree-item--folder">
                                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
                                lib
                            </div>
                            <div className="dawki-csw-code-tree-item dawki-csw-code-tree-item--child" style={{ paddingLeft: 36 }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                api.ts
                            </div>
                        </div>
                    </div>

                    <motion.div
                        className="dawki-csw-code-editor"
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: '-60px' }}
                        variants={{
                            hidden: {},
                            show: { transition: { staggerChildren: 0.06, delayChildren: 0.4 } },
                        }}
                    >
                        {CODE_LINES.map((l) => (
                            <motion.div
                                key={l.num}
                                className="dawki-csw-code-line"
                                variants={{
                                    hidden: { opacity: 0, x: -8 },
                                    show: { opacity: 1, x: 0, transition: { duration: 0.35 } },
                                }}
                            >
                                <span className="dawki-csw-code-line-num">{l.num}</span>
                                <span className="dawki-csw-code-line-content">{l.content}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                <div className="dawki-csw-code-statusbar">
                    <span className="dawki-csw-code-statusbar-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                        TypeScript · 0 errors
                    </span>
                    <span className="dawki-csw-code-statusbar-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                        128 tests passing
                    </span>
                    <span className="dawki-csw-code-statusbar-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                        Lint clean
                    </span>
                    <span className="dawki-csw-code-statusbar-spacer"></span>
                    <span className="dawki-csw-code-statusbar-item">main · build #487</span>
                </div>
            </motion.div>
        </div>
    </section>
);

/* ===========================================================================
 * Section 2: Sprint Kanban Board — 4 columns with ticket cards
 * =========================================================================== */
const SPRINT_DATA = [
    {
        name: 'Backlog',
        color: '#94a3b8',
        cards: [
            { key: 'CSW-128', priority: 'Low',    priColor: '#94a3b8', title: 'Add bulk export to CSV for reports module',         points: 5, who: 'JM', av: ['#4f7cff', '#a855f7'] },
            { key: 'CSW-127', priority: 'Low',    priColor: '#94a3b8', title: 'Refactor legacy notification service',               points: 8, who: 'AS', av: ['#06b6d4', '#4f7cff'] },
            { key: 'CSW-125', priority: 'Medium', priColor: '#fbbf24', title: 'Audit log filtering UI',                              points: 3, who: 'PD', av: ['#f97316', '#ec4899'] },
        ],
    },
    {
        name: 'In Progress',
        color: '#4f7cff',
        cards: [
            { key: 'CSW-119', priority: 'High',   priColor: '#ec4899', title: 'Multi-tenant role permission inheritance',            points: 13, who: 'RS', av: ['#a855f7', '#ec4899'] },
            { key: 'CSW-117', priority: 'Medium', priColor: '#fbbf24', title: 'Stripe billing webhook idempotency fix',              points: 5,  who: 'KH', av: ['#22c55e', '#06b6d4'] },
        ],
    },
    {
        name: 'In Review',
        color: '#a855f7',
        cards: [
            { key: 'CSW-114', priority: 'High',   priColor: '#ec4899', title: 'API rate limiting middleware (token bucket)',         points: 8, who: 'NV', av: ['#4f7cff', '#06b6d4'] },
            { key: 'CSW-112', priority: 'Medium', priColor: '#fbbf24', title: 'Dashboard skeleton loaders + error states',           points: 3, who: 'JM', av: ['#4f7cff', '#a855f7'] },
        ],
    },
    {
        name: 'Done',
        color: '#22c55e',
        cards: [
            { key: 'CSW-108', priority: 'High',   priColor: '#ec4899', title: 'SSO via SAML + Okta integration',                     points: 13, who: 'RS', av: ['#a855f7', '#ec4899'] },
            { key: 'CSW-105', priority: 'High',   priColor: '#ec4899', title: 'Postgres row-level security for tenant scoping',     points: 8,  who: 'AS', av: ['#06b6d4', '#4f7cff'] },
            { key: 'CSW-101', priority: 'Medium', priColor: '#fbbf24', title: 'CI workflow: parallel test sharding',                 points: 5,  who: 'KH', av: ['#22c55e', '#06b6d4'] },
        ],
    },
];

const SprintBoard: React.FC = () => (
    <section className="dawki-csw-sprint">
        <div className="container">
            <div className="dawki-csw-sprint-heading">
                <span className="dawki-csw-sprint-pill">
                    <span></span>
                    How We Ship
                </span>
                <h2 className="dawki-csw-sprint-title">
                    Two-Week Sprints. <span>Weekly Demos. Always.</span>
                </h2>
                <p className="dawki-csw-sprint-subtitle">
                    Real Jira boards. Real velocity. Every story scored, reviewed, and shipped behind feature flags so nothing reaches production unfinished.
                </p>
            </div>

            <motion.div
                className="dawki-csw-sprint-board"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-60px' }}
                variants={{
                    hidden: {},
                    show: { transition: { staggerChildren: 0.1 } },
                }}
            >
                {SPRINT_DATA.map((col) => (
                    <motion.div
                        key={col.name}
                        className="dawki-csw-sprint-column"
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] } },
                        }}
                    >
                        <div className="dawki-csw-sprint-column-header">
                            <span className="dawki-csw-sprint-column-name" style={{ ['--col-color' as string]: col.color }}>
                                <span className="dawki-csw-sprint-column-name-dot"></span>
                                {col.name}
                            </span>
                            <span className="dawki-csw-sprint-column-count">{col.cards.length}</span>
                        </div>

                        {col.cards.map((card, i) => (
                            <motion.div
                                key={card.key}
                                className="dawki-csw-sprint-card"
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{ delay: 0.3 + i * 0.07, duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                            >
                                <div className="dawki-csw-sprint-card-meta">
                                    <span className="dawki-csw-sprint-card-key">{card.key}</span>
                                    <span className="dawki-csw-sprint-card-priority" style={{ ['--pri-color' as string]: card.priColor }}>
                                        <span className="dawki-csw-sprint-card-priority-dot"></span>
                                        {card.priority}
                                    </span>
                                </div>
                                <h3 className="dawki-csw-sprint-card-title">{card.title}</h3>
                                <div className="dawki-csw-sprint-card-footer">
                                    <span className="dawki-csw-sprint-card-points">{card.points} pts</span>
                                    <span
                                        className="dawki-csw-sprint-card-assignee"
                                        style={{ ['--av-a' as string]: card.av[0], ['--av-b' as string]: card.av[1] }}
                                    >
                                        {card.who}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ))}
            </motion.div>
        </div>
    </section>
);

/* ===========================================================================
 * Section 3: Custom Software Video Showcase
 * =========================================================================== */
const CustomSoftwareVideo: React.FC = () => {
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
                        Inside The Build
                    </span>
                    <h2 className="dawki-ent-video-title">
                        See How We Engineer <span>Custom Software</span>
                    </h2>
                    <p className="dawki-ent-video-subtitle">
                        A behind-the-scenes look at our discovery, architecture, and delivery workflow — from blank slate to shipped product.
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
export default function CustomSoftwareDevelopment() {
    return (
        <ServicePageTemplate
            pageTitle="Custom Software Development"
            breadcrumbCategory="Software Engineering"
            heroPill="Software Engineering"
            heroTitleStart="Custom"
            heroTitleHighlight="Software Development"
            heroSubtitle="Tailor-made applications engineered to fit your exact business workflow — scalable, secure, and built to last."
            featuresPill="What We Build"
            featuresTitleStart="Software That"
            featuresTitleHighlight="Solves Real Problems"
            featuresSubtitle="From concept to deployment — we engineer custom platforms, internal tools, and SaaS products that scale with your business."
            features={[
                { title: 'Tailored Architecture', desc: 'Built around your exact workflow — no off-the-shelf compromises, no bloated features.', icon: '🏗️' },
                { title: 'Scalable & Secure', desc: 'Cloud-native foundations, encrypted by default, ready for 10× growth without rewrites.', icon: '🛡️' },
                { title: 'API-First Design', desc: 'Every feature exposed via clean REST/GraphQL APIs — easy to integrate, easy to evolve.', icon: '🔌' },
                { title: 'DevOps Included', desc: 'Automated CI/CD pipelines, infrastructure-as-code, monitoring & alerts on day one.', icon: '⚙️' },
                { title: 'Modern Stack', desc: 'TypeScript, React, Node, Python, Go — chosen per project for the best fit.', icon: '💻' },
                { title: '24/7 Support', desc: 'Post-launch maintenance, performance tuning, and feature additions as you grow.', icon: '🛟' },
            ]}
            processSteps={[
                { n: '01', t: 'Discovery', d: 'Deep-dive workshops to understand goals, users, and constraints.' },
                { n: '02', t: 'Architect', d: 'Technical design, stack selection, and infrastructure planning.' },
                { n: '03', t: 'Build', d: 'Iterative sprints, weekly demos, transparent progress.' },
                { n: '04', t: 'Launch & Scale', d: 'Production deployment, monitoring, ongoing optimization.' },
            ]}
            servicesPill="Our Capabilities"
            servicesTitleStart="Custom Software Development"
            servicesTitleHighlight="Services We Offer"
            servicesSubtitle="End-to-end engineering services across the full product lifecycle — from concept to long-term scale."
            servicesLayout="timeline"
            serviceCards={[
                { title: 'Product Discovery', desc: 'Turn your vision into a market-fit product with our product discovery services. We help you define your MVP, the most suitable technology stack, must-have features, and the right architecture for your product.', icon: ICON.search },
                { title: 'UI/UX Design', desc: 'Design engaging, accessible, and intuitive software applications that boost engagement, increase retention, drive higher conversion rates, and enhance overall user satisfaction.', icon: ICON.palette },
                { title: 'Product Development', desc: 'Ensure unmatched quality, from identifying unique selling propositions (USPs) to designing and delivering user-friendly software products. Agile methodologies ensure flexibility and swift delivery.', icon: ICON.wrench },
                { title: 'Software Re-engineering', desc: 'Re-engineer legacy applications by migrating them to the latest technology stack and cloud infrastructure. We modernize outdated interfaces to improve usability and performance.', icon: ICON.refresh },
                { title: 'Cloud Application Development', desc: 'Leverage our strategic partnerships with AWS, GCP, and Microsoft to develop applications that are robust, scalable, secure, and cost-efficient.', icon: ICON.cloud },
                { title: 'Web Development Services', desc: 'We help you develop intuitive and scalable web applications such as eCommerce platforms, SaaS solutions, content management systems, customer portals, and enterprise dashboards.', icon: ICON.globe },
                { title: 'Software Testing Services', desc: 'Utilize rigorous software testing services that protect your applications against potential errors and performance issues. Manual and automated techniques cover functionality and security.', icon: ICON.check },
                { title: 'DevOps Services', desc: 'Optimize the cost, agility, and scalability of your IT ecosystem while enhancing operational efficiency through end-to-end automation with our DevOps services.', icon: ICON.infinity },
                { title: 'Support & Maintenance', desc: 'Keep your systems running smoothly, enhance performance, and ensure continuous updates. Proactive monitoring, bug fixes, and timely upgrades to optimize your software.', icon: ICON.headset },
                { title: 'Hire Dedicated Developers', desc: 'Hire a team of software developers skilled in both niche and mainstream technologies. Diverse expertise across programming languages, frameworks, and tools.', icon: ICON.users },
                { title: 'API Development & Integration', desc: 'Seamless integration among disparate software systems with our API integration services. We work with REST, SOAP, JSON-RPC, GraphQL and more to streamline workflows.', icon: ICON.code },
                { title: 'IT Outsourcing Services', desc: 'Adapt swiftly to market changes while reducing costs with our IT outsourcing services. Software solutions built with a strong foundation, reducing the need for constant fixes.', icon: ICON.home },
            ]}
            toolsTitleStart="Robust Tools &"
            toolsTitleHighlight="Technologies We Work"
            toolsSubtitle="A modern, battle-tested stack across frontend, backend, cloud, design, and AI — chosen per project for the best result."
            toolsLayout="vertical"
            tools={[
                { n: 'TypeScript',     s: 'typescript',   c: '3178C6', desc: 'Type-safe end-to-end code across our frontends, APIs, and shared schemas — the language that holds our codebases together.' },
                { n: 'React',          s: 'react',        c: '61DAFB', desc: 'Component library powering most of our SaaS dashboards and customer-facing UIs.' },
                { n: 'Next.js',        s: 'nextdotjs',    c: '000000', desc: 'Full-stack React framework — file-system routing, server actions, and edge runtime out of the box.' },
                { n: 'Vue.js',         s: 'vuedotjs',     c: '4FC08D', desc: 'Progressive frontend framework — picked when teams already invest in the Vue ecosystem.' },
                { n: 'Angular',        s: 'angular',      c: 'DD0031', desc: 'Enterprise-grade frontend with strong opinions — RxJS, dependency injection, and TypeScript-first.' },
                { n: 'Node.js',        s: 'nodedotjs',    c: '5FA04E', desc: 'High-throughput API servers, real-time websockets, and serverless functions across our builds.' },
                { n: 'Python',         s: 'python',       c: '3776AB', desc: 'Backend services, data pipelines, and AI features — batteries-included libraries make hard things easy.' },
                { n: 'Django',         s: 'django',       c: '092E20', desc: 'Battle-tested Python framework for content-heavy and admin-heavy products that need an opinionated stack.' },
                { n: 'FastAPI',        s: 'fastapi',      c: '009688', desc: 'Type-hinted Python APIs with auto OpenAPI docs — our default for ML-adjacent and data-API services.' },
                { n: 'Go',             s: 'go',           c: '00ADD8', desc: 'Compiled language for high-performance services, network proxies, and CLIs that need to be fast and small.' },
                { n: 'PHP',            s: 'php',          c: '777BB4', desc: 'WordPress, Laravel, and legacy stack support — still essential for many enterprise and CMS builds.' },
                { n: '.NET',           s: 'dotnet',       c: '512BD4', desc: 'Enterprise C# applications and Windows-stack integrations — used where the customer is invested in Microsoft.' },
                { n: 'PostgreSQL',     s: 'postgresql',   c: '4169E1', desc: 'Default relational DB — JSONB, RLS, partitioning, and bulletproof reliability for tenant-isolated SaaS.' },
                { n: 'MySQL',          s: 'mysql',        c: '4479A1', desc: 'Reliable relational DB for high-volume read workloads, e-commerce, and WordPress-adjacent apps.' },
                { n: 'MongoDB',        s: 'mongodb',      c: '47A248', desc: 'Document store for flexible-schema features — activity feeds, audit logs, and product event streams.' },
                { n: 'Tailwind CSS',   s: 'tailwindcss',  c: '06B6D4', desc: 'Utility-first CSS — design systems that ship in days, not weeks, with consistent tokens.' },
                { n: 'Bootstrap',      s: 'bootstrap',    c: '7952B3', desc: 'Battle-tested component library — picked when teams want speed and a familiar visual language.' },
                { n: 'Material UI',    s: 'mui',          c: '007FFF', desc: 'Google\'s Material Design system in React — comprehensive components, accessibility built in.' },
                { n: 'Docker',         s: 'docker',       c: '2496ED', desc: 'Containerized services for reproducible builds and deployable artifacts across every environment.' },
                { n: 'Kubernetes',     s: 'kubernetes',   c: '326CE5', desc: 'Production orchestration — autoscaling, multi-AZ, and zero-downtime rollouts.' },
                { n: 'Jenkins',        s: 'jenkins',      c: 'D24939', desc: 'CI workhorse — declarative pipelines, shared libraries, and battle-tested plugins.' },
                { n: 'Git',            s: 'git',          c: 'F05032', desc: 'Source control underneath everything — branching strategies, signed commits, and clean histories.' },
                { n: 'GitHub',         s: 'github',       c: '181717', desc: 'Code hosting + Actions CI/CD — every repo gates on automated tests and security scans before merge.' },
                { n: 'AWS',            url: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg', desc: 'Where most of our workloads live — RDS, S3, Lambda, CloudFront, and the rest of the AWS arsenal.' },
                { n: 'Microsoft Azure',url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg', desc: 'Enterprise-grade Azure builds across AKS, App Service, Functions, Cosmos DB, and Synapse.' },
                { n: 'Google Cloud',   s: 'googlecloud',  c: '4285F4', desc: 'Cloud-native and data-heavy workloads on GKE, Cloud Run, BigQuery, and Vertex AI.' },
                { n: 'DigitalOcean',   s: 'digitalocean', c: '0080FF', desc: 'Lean compute and managed databases for early-stage products that don\'t need hyperscaler complexity.' },
                { n: 'Vercel',         s: 'vercel',       c: '000000', desc: 'Edge-deployed Next.js frontends — preview deploys per PR and global low-latency delivery.' },
                { n: 'Stripe',         s: 'stripe',       c: '008CDD', desc: 'Subscription billing, dunning, taxes, and revenue recognition — every billing flow we ship runs on Stripe.' },
                { n: 'Razorpay',       s: 'razorpay',     c: '0C2451', desc: 'Indian-market payment gateway — UPI, cards, netbanking, and subscriptions for local SaaS and DTC.' },
                { n: 'Figma',          s: 'figma',        c: 'F24E1E', desc: 'Where our designers and engineers meet — multiplayer canvases, design tokens, and Dev Mode handoff.' },
                { n: 'OpenAI',         url: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg', desc: 'GPT-4 and o-series models powering AI features — copilots, summarizers, classifiers, and chat.' },
                { n: 'Gemini',         s: 'googlegemini', c: '8E75B2', desc: 'Google\'s multimodal model — used for image-aware AI features and long-context document processing.' },
            ]}
            hideProjects={true}
            hideTestimonial={true}
            showClients={true}
            clientsPill="Trusted By Engineering Teams"
            clientsHeading="From Solo Founders to Enterprise IT,"
            clientsHeadingHighlight="We Engineer Software That Lasts"
            extraSections={
                <>
                    <CodeEditorMockup />
                    <SprintBoard />
                    <CustomSoftwareVideo />
                </>
            }
            googleReviews={[
                {
                    name: 'Henrik Lindqvist',
                    role: 'CTO, Trailpoint Logistics',
                    rating: 5,
                    date: '2 months ago',
                    text: 'Dawki rebuilt our shipment management platform on a clean React + Node + Postgres stack. Codebase is the cleanest I have inherited from any vendor — our internal team picked it up in two weeks.',
                },
                {
                    name: 'Aarav Kapoor',
                    role: 'Founder, BrightLedger',
                    rating: 5,
                    date: '4 months ago',
                    text: 'They built our entire fintech platform from scratch — KYC, ledgers, reconciliation, and an admin console. RBI compliance review passed first time without findings.',
                },
                {
                    name: 'Eleanor Whitfield',
                    role: 'VP Engineering, Coastal HR',
                    rating: 5,
                    date: '6 months ago',
                    text: 'Replatformed our 12-year-old PHP monolith to a TypeScript + Node + Postgres stack across three quarters. Zero downtime, zero data loss, and a 60% drop in P1 incidents post-migration.',
                },
                {
                    name: 'Felipe Aguirre',
                    role: 'Head of Product, MeshCart',
                    rating: 5,
                    date: '3 months ago',
                    text: 'Their two-week sprint cadence with Friday demos kept the entire stakeholder group aligned. We shipped what was promised, on the date promised, every cycle.',
                },
                {
                    name: 'Lin Wei',
                    role: 'Engineering Manager, Pulsemark',
                    rating: 5,
                    date: '5 months ago',
                    text: 'Custom internal tooling that replaced four separate vendor dashboards. We saved $180K/year on SaaS subscriptions and our ops team finally enjoys their tools.',
                },
                {
                    name: 'Sasha Romanov',
                    role: 'CEO, Northwind Realty',
                    rating: 5,
                    date: '7 months ago',
                    text: 'They built our property management portal end-to-end including mobile apps. Onboarding flow alone lifted activation 38%. Easy to recommend.',
                },
            ]}
            googleReviewsHeading="What Engineering Leaders Say About Us"
            googleReviewsSubtitle="Verified reviews from CTOs, VPs of Engineering, and product leads we've shipped custom software with."
            faqs={[
                { q: 'What is Custom Software Development and why is it important?', a: 'Custom software development involves building applications specifically tailored to your business needs. It helps improve efficiency, streamline operations, and gives your company a competitive advantage with technology designed just for you.' },
                { q: 'How can Dawki Infotech\'s Custom Software Solutions benefit my business?', a: 'Our custom solutions help automate workflows, reduce manual tasks, enhance customer experiences, and support scalable growth. We build software that fits your goals and improves overall performance.' },
                { q: 'How do you ensure the software matches our exact requirements?', a: 'We follow a detailed discovery and planning process, gathering your requirements, understanding workflows, and involving you throughout the development cycle. This ensures the final product aligns perfectly with your needs.' },
                { q: 'What technologies and tools do you use to develop custom software?', a: 'Dawki Infotech uses the latest frameworks, programming languages, cloud services, and development tools — including React, Node.js, .NET, PHP, Python, Flutter, AWS, and more — to deliver secure and high-performance solutions.' },
                { q: 'How long does it take to develop custom software?', a: 'The timeline depends on the project\'s complexity, features, and integrations. Small projects may take weeks, while larger enterprise systems may require several months. We provide clear timelines after requirement analysis.' },
                { q: 'Do you offer support and maintenance after the software is delivered?', a: 'Yes. We offer ongoing maintenance, updates, bug fixes, performance monitoring, and support to ensure your software stays secure, optimized, and reliable.' },
                { q: 'Can you integrate the software with our existing systems?', a: 'Absolutely. We specialize in seamless integrations with CRMs, ERPs, payment gateways, APIs, databases, and third-party platforms to ensure a smooth and efficient workflow.' },
            ]}
        />
    );
}
