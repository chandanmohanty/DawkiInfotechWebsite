import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import ServicePageTemplate, { ICON } from '@/components/ServicePageTemplate';

/* === Section 1: Enterprise Integration Hub ====================================== */
const HUB_LOGOS = [
    { name: 'SAP',           url: 'https://cdn.simpleicons.org/sap/0FAAFF' },
    { name: 'Oracle',        url: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg' },
    { name: 'Salesforce',    url: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg' },
    { name: 'Snowflake',     url: 'https://cdn.simpleicons.org/snowflake/29B5E8' },
    { name: 'AWS',           url: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg' },
    { name: 'Azure',         url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg' },
    { name: 'Google Cloud',  url: 'https://cdn.simpleicons.org/googlecloud/4285F4' },
    { name: 'Microsoft 365', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Microsoft_Office_logo_%282019%E2%80%93present%29.svg' },
];

const IntegrationHub: React.FC = () => {
    const radius = 38; // % of stage size
    const positions = HUB_LOGOS.map((_, i) => {
        const angle = (i / HUB_LOGOS.length) * Math.PI * 2 - Math.PI / 2;
        return {
            x: 50 + radius * Math.cos(angle),
            y: 50 + radius * Math.sin(angle),
        };
    });

    return (
        <section className="dawki-ent-hub">
            <div className="container">
                <div className="dawki-ent-hub-heading">
                    <span className="dawki-ent-hub-pill">
                        <span></span>
                        Integrations
                    </span>
                    <h2 className="dawki-ent-hub-title">
                        Built to Plug Into Your <span>Enterprise Stack</span>
                    </h2>
                    <p className="dawki-ent-hub-subtitle">
                        Battle-tested connectors, APIs, and event pipelines for the systems your business already runs on — ERP, CRM, cloud, identity, and data.
                    </p>
                </div>

                <div className="dawki-ent-hub-stage">
                    <svg className="dawki-ent-hub-grid" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                        <defs>
                            <linearGradient id="dawkiHubLineGrad" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="rgba(79,124,255,0.95)" />
                                <stop offset="100%" stopColor="rgba(168,85,247,0.25)" />
                            </linearGradient>
                        </defs>
                        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(79,124,255,0.2)" strokeWidth="0.18" strokeDasharray="0.6 0.8" />
                        <circle cx="50" cy="50" r={radius - 11} fill="none" stroke="rgba(168,85,247,0.14)" strokeWidth="0.14" strokeDasharray="0.4 1.2" />
                        {positions.map((p, i) => (
                            <line
                                key={i}
                                x1="50" y1="50" x2={p.x} y2={p.y}
                                stroke="url(#dawkiHubLineGrad)"
                                strokeWidth="0.25"
                                strokeDasharray="1.5 1.5"
                                className="dawki-ent-hub-line"
                                style={{ animationDelay: `${i * 0.32}s` }}
                            />
                        ))}
                    </svg>

                    <span className="dawki-ent-hub-ripple"></span>
                    <span className="dawki-ent-hub-ripple"></span>
                    <span className="dawki-ent-hub-ripple"></span>

                    <motion.div
                        className="dawki-ent-hub-core"
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
                    >
                        <span className="dawki-ent-hub-core-inner">
                            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                <path d="M9 12l2 2 4-4" />
                            </svg>
                        </span>
                        <div className="dawki-ent-hub-core-label">Your Enterprise Core</div>
                    </motion.div>

                    {HUB_LOGOS.map((logo, i) => (
                        <motion.div
                            key={logo.name}
                            className="dawki-ent-hub-orbit"
                            style={{ left: `${positions[i].x}%`, top: `${positions[i].y}%` }}
                            initial={{ scale: 0, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ delay: 0.25 + i * 0.08, duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
                            whileHover={{ scale: 1.12, transition: { duration: 0.3 } }}
                        >
                            <div className="dawki-ent-hub-orbit-glow"></div>
                            <img
                                src={logo.url}
                                alt={logo.name}
                                loading="lazy"
                                decoding="async"
                                onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
                            />
                            <span className="dawki-ent-hub-orbit-label">{logo.name}</span>
                        </motion.div>
                    ))}
                </div>

                <div className="dawki-ent-hub-tags">
                    <div className="dawki-ent-hub-tag"><span></span>ERP — SAP, Oracle, Dynamics</div>
                    <div className="dawki-ent-hub-tag"><span></span>CRM — Salesforce, HubSpot, Zoho</div>
                    <div className="dawki-ent-hub-tag"><span></span>Cloud — AWS, Azure, GCP</div>
                    <div className="dawki-ent-hub-tag"><span></span>Identity — Okta, Auth0, SAML SSO</div>
                    <div className="dawki-ent-hub-tag"><span></span>Data — Snowflake, Databricks, Kafka</div>
                </div>
            </div>
        </section>
    );
};

/* === Section 2: Enterprise Outcomes Dashboard ==================================== */
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

const CountValue: React.FC<{ target: number; decimals?: number }> = ({ target, decimals = 0 }) => {
    const { ref, value } = useCountUp(target, 1800, decimals);
    return <span ref={ref} className="dawki-ent-out-num">{value}</span>;
};

const GaugeMetric: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-40px' });
    const r = 56;
    const circ = Math.PI * r;
    const fill = (99.99 / 100) * circ;

    return (
        <div ref={ref} className="dawki-ent-out-card">
            <svg className="dawki-ent-out-gauge" viewBox="0 0 140 80">
                <defs>
                    <linearGradient id="dawkiGaugeGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="50%" stopColor="#4f7cff" />
                        <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                </defs>
                <path d={`M 14 70 A ${r} ${r} 0 0 1 126 70`} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" strokeLinecap="round" />
                <motion.path
                    d={`M 14 70 A ${r} ${r} 0 0 1 126 70`}
                    fill="none"
                    stroke="url(#dawkiGaugeGrad)"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={circ}
                    initial={{ strokeDashoffset: circ }}
                    animate={{ strokeDashoffset: inView ? circ - fill : circ }}
                    transition={{ duration: 1.6, ease: [0.2, 0.8, 0.2, 1] }}
                />
            </svg>
            <div className="dawki-ent-out-value">
                <CountValue target={99.99} decimals={2} />
                <span className="dawki-ent-out-suffix">%</span>
            </div>
            <div className="dawki-ent-out-label">System Uptime SLA</div>
            <p className="dawki-ent-out-desc">Multi-region failover and blue-green deploys keep enterprise apps online around the clock.</p>
        </div>
    );
};

const OrbitMetric: React.FC = () => (
    <div className="dawki-ent-out-card">
        <div className="dawki-ent-out-orbit" aria-hidden="true">
            <span></span><span></span><span></span>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
            </svg>
        </div>
        <div className="dawki-ent-out-value">
            <CountValue target={1} />
            <span className="dawki-ent-out-suffix">k+</span>
        </div>
        <div className="dawki-ent-out-label">Daily Transactions</div>
        <p className="dawki-ent-out-desc">Built to handle peak loads with horizontal scaling, message queues, and event streams.</p>
    </div>
);

const BarsMetric: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-40px' });
    const heights = [38, 56, 48, 70, 88];

    return (
        <div ref={ref} className="dawki-ent-out-card">
            <div className="dawki-ent-out-bars" aria-hidden="true">
                {heights.map((h, i) => (
                    <motion.span
                        key={i}
                        className="dawki-ent-out-bar"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: inView ? h / 100 : 0 }}
                        transition={{ duration: 0.95, delay: 0.15 + i * 0.12, ease: [0.2, 0.8, 0.2, 1] }}
                    />
                ))}
            </div>
            <div className="dawki-ent-out-value">
                <CountValue target={3} />
                <span className="dawki-ent-out-suffix">×</span>
            </div>
            <div className="dawki-ent-out-label">Faster Time-to-Market</div>
            <p className="dawki-ent-out-desc">CI/CD, infra-as-code, and reusable enterprise modules cut shipping cycles by months.</p>
        </div>
    );
};

const LineMetric: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-40px' });
    const path = 'M 5 60 L 25 50 L 45 55 L 65 35 L 85 28 L 105 18 L 125 10';

    return (
        <div ref={ref} className="dawki-ent-out-card">
            <svg className="dawki-ent-out-line" viewBox="0 0 130 70">
                <defs>
                    <linearGradient id="dawkiLineMetric" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                </defs>
                <motion.path
                    d={path}
                    fill="none"
                    stroke="url(#dawkiLineMetric)"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: inView ? 1 : 0 }}
                    transition={{ duration: 1.8, ease: [0.2, 0.8, 0.2, 1] }}
                />
                <motion.circle
                    cx="125" cy="10" r="3.5"
                    fill="#a855f7"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0 }}
                    transition={{ delay: 1.6, duration: 0.5 }}
                />
            </svg>
            <div className="dawki-ent-out-value">
                <CountValue target={60} />
                <span className="dawki-ent-out-suffix">%</span>
            </div>
            <div className="dawki-ent-out-label">Manual Work Reduced</div>
            <p className="dawki-ent-out-desc">Workflow automation and RPA replace repetitive approvals, routing, and reporting.</p>
        </div>
    );
};

const OutcomesDashboard: React.FC = () => (
    <section className="dawki-ent-out">
        <div className="container">
            <div className="dawki-ent-out-heading">
                <span className="dawki-ent-out-pill">
                    <span></span>
                    Outcomes
                </span>
                <h2 className="dawki-ent-out-title">
                    Numbers That Hold Up at <span>Enterprise Scale</span>
                </h2>
                <p className="dawki-ent-out-subtitle">
                    Real outcomes our enterprise builds deliver in production — measured, monitored, and continuously improved.
                </p>
            </div>

            <div className="dawki-ent-out-grid">
                <GaugeMetric />
                <OrbitMetric />
                <BarsMetric />
                <LineMetric />
            </div>
        </div>
    </section>
);

/* === Section 3: Enterprise Video Showcase ======================================= */
const EnterpriseVideo: React.FC = () => {
    const ref = useRef<HTMLVideoElement>(null);
    const [started, setStarted] = useState(false);

    const handleStart = () => {
        setStarted(true);
        setTimeout(() => {
            ref.current?.play().catch(() => {});
        }, 30);
    };

    return (
        <section className="dawki-ent-video">
            <div className="container">
                <div className="dawki-ent-video-heading">
                    <span className="dawki-ent-video-pill">
                        <span></span>
                        Behind the Build
                    </span>
                    <h2 className="dawki-ent-video-title">
                        See Our Enterprise Software <span>in Action</span>
                    </h2>
                    <p className="dawki-ent-video-subtitle">
                        A behind-the-scenes look at how we plan, ship, and operate mission-critical systems for global teams — end to end.
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

/* === Page ======================================================================== */
export default function EnterpriseAppDevelopment() {
    return (
        <ServicePageTemplate
            pageTitle="Enterprise App Development"
            breadcrumbCategory="Software Engineering"
            heroPill="Software Engineering"
            heroTitleStart="Enterprise App"
            heroTitleHighlight="Development"
            heroSubtitle="Mission-critical enterprise applications — secure, scalable, and built to integrate with your existing ERP, CRM, and data ecosystem."
            featuresPill="Built for Scale"
            featuresTitleStart="Software That Powers"
            featuresTitleHighlight="Large Organizations"
            featuresSubtitle="From multi-region rollouts to compliance-heavy workflows — we engineer enterprise systems that hold up under real-world load."
            features={[
                { title: 'Enterprise-Grade Security', desc: 'SSO, RBAC, audit trails, encryption at rest and in transit — compliant from day one.', icon: '🛡️' },
                { title: 'Scalable Architecture', desc: 'Microservices, message queues, and horizontal scaling that handle millions of users.', icon: '🏗️' },
                { title: 'System Integrations', desc: 'Native connectors for SAP, Oracle, Salesforce, Microsoft 365, and custom APIs.', icon: '🔗' },
                { title: 'Compliance Ready', desc: 'GDPR, HIPAA, SOC 2, ISO 27001 — designed to pass enterprise audits.', icon: '📋' },
                { title: 'High Availability', desc: '99.99% uptime SLAs with multi-region failover, blue-green deploys, and disaster recovery.', icon: '⚡' },
                { title: 'Workflow Automation', desc: 'Automate approvals, routing, and reporting across departments and business units.', icon: '⚙️' },
            ]}
            processSteps={[
                { n: '01', t: 'Discovery & Audit', d: 'Map existing systems, stakeholders, compliance needs, and integration points.' },
                { n: '02', t: 'Architecture', d: 'Design scalable, secure architecture aligned to enterprise IT standards.' },
                { n: '03', t: 'Build & Integrate', d: 'Iterative development with continuous integration into your enterprise stack.' },
                { n: '04', t: 'Rollout & Govern', d: 'Phased deployment, training, monitoring, and long-term governance support.' },
            ]}
            servicesPill="Our Capabilities"
            servicesTitleStart="Enterprise Application"
            servicesTitleHighlight="Services We Offer"
            servicesSubtitle="Strategic enterprise solutions across the full software lifecycle — design, build, integrate, and modernize."
            servicesLayout="timeline"
            serviceCards={[
                { title: 'Enterprise Software Consulting', desc: 'Roadmaps and architecture audits to align technology investments with business strategy.', icon: ICON.target },
                { title: 'Custom ERP Development', desc: 'Tailored ERP modules for finance, HR, inventory, and operations — built around how you actually work.', icon: ICON.cog },
                { title: 'Custom CRM Development', desc: 'Sales, service, and marketing CRMs designed for your pipeline, your data, and your team.', icon: ICON.users },
                { title: 'Enterprise Mobility Solutions', desc: 'Field, sales, and workforce mobile apps with offline support and enterprise SSO.', icon: ICON.rocket },
                { title: 'Workflow Automation', desc: 'BPM and RPA to automate approvals, routing, and back-office processes at scale.', icon: ICON.refresh },
                { title: 'Enterprise Portals', desc: 'Customer, partner, employee, and vendor portals with rich personalization.', icon: ICON.globe },
                { title: 'Legacy App Modernization', desc: 'Re-platform monoliths to microservices and cloud — incremental, low-risk, well-tested.', icon: ICON.refresh },
                { title: 'Cloud Migration', desc: 'Lift-and-shift and refactor migrations to AWS, Azure, or Google Cloud.', icon: ICON.cloud },
                { title: 'System Integration Services', desc: 'Connect ERP, CRM, HRMS, and data platforms via APIs, ESB, and event-driven patterns.', icon: ICON.link },
                { title: 'Data & BI Platforms', desc: 'Data warehouses, ETL pipelines, and dashboards that turn enterprise data into decisions.', icon: ICON.chart },
                { title: 'DevOps & SRE', desc: 'CI/CD, infrastructure-as-code, observability, and 24/7 site reliability engineering.', icon: ICON.infinity },
                { title: 'Enterprise Support & Maintenance', desc: 'SLA-backed support, proactive monitoring, and continuous optimization for production systems.', icon: ICON.headset },
            ]}
            hideProjects={true}
            hideTestimonial={true}
            showClients={true}
            clientsPill="Trusted By Global Enterprises"
            clientsHeading="From Mid-Market to Fortune 500,"
            clientsHeadingHighlight="We Power Enterprise Innovation"
            extraSections={
                <>
                    <IntegrationHub />
                    <OutcomesDashboard />
                    <EnterpriseVideo />
                </>
            }
            googleReviews={[
                {
                    name: 'Daniel Mitchell',
                    role: 'CIO, Vertex Manufacturing',
                    rating: 5,
                    date: '2 months ago',
                    text: 'Dawki replaced our 15-year-old ERP with a phased microservices rollout — zero unplanned downtime, and our finance team is finally off Excel for closing books.',
                },
                {
                    name: 'Priya Sharma',
                    role: 'VP Engineering, NorthBridge Capital',
                    rating: 5,
                    date: '4 months ago',
                    text: 'They handled our SOC 2 + GDPR requirements without us having to micro-manage a thing. The SSO and audit logging integration was flawless.',
                },
                {
                    name: 'Tom Reyes',
                    role: 'Head of IT, Allied Logistics',
                    rating: 5,
                    date: '6 months ago',
                    text: 'Connected our SAP, Salesforce, and warehouse systems through a single event bus. Order-to-cash latency dropped by 70% in the first quarter.',
                },
                {
                    name: 'Rachel Donovan',
                    role: 'Chief of Staff, MeridianHealth',
                    rating: 5,
                    date: '3 months ago',
                    text: 'HIPAA-grade portal delivered on a tight 6-month deadline. Their architecture review caught issues our internal team had missed for years.',
                },
                {
                    name: 'Hiroshi Tanaka',
                    role: 'Director, Globex Tokyo',
                    rating: 5,
                    date: '5 months ago',
                    text: 'Multi-region failover that actually works. We tested it during a planned region cutover and our customers in three continents never noticed.',
                },
                {
                    name: 'Marcus Webb',
                    role: 'CTO, Helios Energy',
                    rating: 5,
                    date: '7 months ago',
                    text: 'Their team built our partner portal and integrated it with Dynamics, NetSuite, and Snowflake. Clean architecture, well-documented, easy to extend.',
                },
            ]}
            googleReviewsHeading="What Enterprise Clients Say About Us"
            googleReviewsSubtitle="Verified reviews from CIOs, CTOs, and IT leaders we've shipped enterprise software with."
            faqs={[
                { q: 'What is enterprise application development?', a: 'Enterprise application development is the process of building large-scale software systems that support business-critical operations across departments — often integrating ERP, CRM, HR, finance, and analytics.' },
                { q: 'How is enterprise development different from regular software development?', a: 'Enterprise software is built for scale, security, compliance, and integration with many existing systems. It typically requires more rigorous architecture, governance, and SLA-backed support.' },
                { q: 'Which technologies do you use for enterprise apps?', a: 'We work with .NET, Java/Spring, Node.js, Python, microservices, Kubernetes, Kafka, and major cloud platforms (AWS, Azure, GCP) — chosen to align with your existing stack.' },
                { q: 'Can you integrate with our existing ERP/CRM?', a: 'Yes. We have deep experience integrating with SAP, Oracle, Microsoft Dynamics, Salesforce, NetSuite, and custom legacy systems.' },
                { q: 'How do you handle security and compliance?', a: 'We follow OWASP, ISO 27001, SOC 2, GDPR, and HIPAA practices — including encryption, RBAC, SSO, audit logging, and pen testing.' },
                { q: 'How long does enterprise development take?', a: 'Phase one (MVP module or pilot) usually ships in 3–4 months. Full enterprise rollouts typically run 9–18 months in phases.' },
                { q: 'Do you provide ongoing support after go-live?', a: 'Yes. We offer SLA-backed support, monitoring, performance tuning, security patching, and continuous feature delivery.' },
            ]}
        />
    );
}
