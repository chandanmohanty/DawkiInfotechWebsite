import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import ServicePageTemplate, { ICON } from '@/components/ServicePageTemplate';

/* ===========================================================================
 * Shared count-up hook
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

const Counter: React.FC<{ target: number; decimals?: number; format?: 'plain' | 'k' | 'short' }> = ({ target, decimals = 0, format = 'plain' }) => {
    const { ref, value } = useCountUp(target, 1800, decimals);
    let display = value;
    if (format === 'k' && Number(value) >= 1000) {
        display = (Number(value) / 1000).toFixed(1) + 'K';
    }
    return <span ref={ref}>{display}</span>;
};

/* ===========================================================================
 * Section 1: SaaS Growth Funnel — tier-shaped conversion funnel
 * =========================================================================== */
const FUNNEL_STAGES = [
    { label: 'Website Visitors',    sub: 'Top of funnel',                       count: 50000, suffix: '',  pct: '100%' },
    { label: 'Trial Signups',       sub: 'Self-serve activation',               count: 9000,  suffix: '',  pct: '18% conversion' },
    { label: 'Activated Users',     sub: 'Hit "aha" moment in onboarding',      count: 5400,  suffix: '',  pct: '60% of trials' },
    { label: 'Paid Subscribers',    sub: 'Monthly recurring revenue',           count: 1900,  suffix: '',  pct: '35% of activated' },
    { label: 'Annual & Expansion',  sub: 'Upgraded plans + add-ons',            count: 480,   suffix: '+', pct: '25% of paid' },
];

const SaasFunnel: React.FC = () => {
    return (
        <section className="dawki-saas-funnel">
            <div className="container">
                <div className="dawki-saas-funnel-heading">
                    <span className="dawki-saas-funnel-pill">
                        <span></span>
                        Growth Engine
                    </span>
                    <h2 className="dawki-saas-funnel-title">
                        We Engineer Funnels That <span>Actually Convert</span>
                    </h2>
                    <p className="dawki-saas-funnel-subtitle">
                        Every stage of your SaaS lifecycle — instrumented, optimized, and built into the product itself. From first visit to expansion ARR, we engineer for conversion.
                    </p>
                </div>

                <div className="dawki-saas-funnel-stages">
                    {FUNNEL_STAGES.map((s, i) => (
                        <motion.div
                            key={s.label}
                            className="dawki-saas-funnel-stage"
                            initial={{ opacity: 0, y: 30, scale: 0.96 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ delay: i * 0.12, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                        >
                            <div>
                                <div className="dawki-saas-funnel-stage-label">{s.label}</div>
                                <div className="dawki-saas-funnel-stage-sublabel">{s.sub}</div>
                            </div>
                            <div className="dawki-saas-funnel-stage-count">
                                <Counter target={s.count} format="k" />
                                {s.suffix && <span className="dawki-saas-funnel-stage-count-suffix">{s.suffix}</span>}
                            </div>
                            <span className="dawki-saas-funnel-stage-pct">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                                {s.pct}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

/* ===========================================================================
 * Section 2: SaaS Architecture Stack — vertical layers + flowing data packets
 * =========================================================================== */
const STACK_LAYERS = [
    {
        num: 'EDGE',
        name: 'Edge & CDN',
        desc: 'TLS termination, asset delivery, and DDoS protection at the user\'s nearest PoP.',
        tags: ['Cloudflare', 'Vercel', 'Fastly'],
        a: '#06b6d4', b: '#4f7cff', glow: 'rgba(6, 182, 212, 0.55)',
    },
    {
        num: 'AUTH',
        name: 'Auth & API Gateway',
        desc: 'SSO, SCIM, rate limiting, and tenant context resolved before any service is touched.',
        tags: ['Auth0', 'Clerk', 'Kong'],
        a: '#4f7cff', b: '#6366f1', glow: 'rgba(79, 124, 255, 0.55)',
    },
    {
        num: 'APP',
        name: 'Multi-Tenant Application',
        desc: 'Stateless services that scale horizontally — every request scoped to its tenant by design.',
        tags: ['Next.js', 'Node.js', 'Python'],
        a: '#6366f1', b: '#a855f7', glow: 'rgba(168, 85, 247, 0.55)',
    },
    {
        num: 'JOBS',
        name: 'Async & Background Jobs',
        desc: 'Webhooks, billing events, exports, and heavy compute moved off the request path.',
        tags: ['SQS', 'Redis', 'Celery'],
        a: '#a855f7', b: '#ec4899', glow: 'rgba(168, 85, 247, 0.55)',
    },
    {
        num: 'DATA',
        name: 'Data & Storage',
        desc: 'Tenant-isolated databases, encrypted backups, and S3-style object storage at any scale.',
        tags: ['PostgreSQL', 'Redis', 'S3'],
        a: '#ec4899', b: '#f97316', glow: 'rgba(236, 72, 153, 0.55)',
    },
];

const SaasArchitectureStack: React.FC = () => (
    <section className="dawki-saas-stack">
        <div className="container">
            <div className="dawki-saas-stack-heading">
                <span className="dawki-saas-stack-pill">
                    <span></span>
                    Architecture
                </span>
                <h2 className="dawki-saas-stack-title">
                    The Stack That <span>Scales With Your ARR</span>
                </h2>
                <p className="dawki-saas-stack-subtitle">
                    Multi-tenant from day one. Every layer designed for isolation, scale, and the auditors you'll one day face.
                </p>
            </div>

            <div className="dawki-saas-stack-frame">
                <div className="dawki-saas-stack-connector" aria-hidden="true"></div>
                <span className="dawki-saas-stack-packet" aria-hidden="true"></span>
                <span className="dawki-saas-stack-packet dawki-saas-stack-packet--b" aria-hidden="true"></span>
                <span className="dawki-saas-stack-packet dawki-saas-stack-packet--c" aria-hidden="true"></span>

                {STACK_LAYERS.map((l, i) => (
                    <motion.div
                        key={l.num}
                        className="dawki-saas-stack-layer"
                        style={{ ['--lyr-color-a' as string]: l.a, ['--lyr-color-b' as string]: l.b, ['--lyr-glow' as string]: l.glow }}
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ delay: i * 0.12, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                    >
                        <div className="dawki-saas-stack-layer-num">{l.num}</div>
                        <div className="dawki-saas-stack-layer-content">
                            <h3 className="dawki-saas-stack-layer-name">{l.name}</h3>
                            <p className="dawki-saas-stack-layer-desc">{l.desc}</p>
                        </div>
                        <div className="dawki-saas-stack-layer-tags">
                            {l.tags.map((tag) => (
                                <span key={tag} className="dawki-saas-stack-layer-tag">{tag}</span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

/* ===========================================================================
 * Section 3: SaaS Video Showcase
 * =========================================================================== */
const SaasVideo: React.FC = () => {
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
                        Inside The Product
                    </span>
                    <h2 className="dawki-ent-video-title">
                        Watch How We <span>Ship SaaS That Sticks</span>
                    </h2>
                    <p className="dawki-ent-video-subtitle">
                        A behind-the-scenes look at how we go from blank canvas to paying customers — onboarding, billing, dashboards, and the platform underneath.
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
export default function SaaSApplication() {
    return (
        <ServicePageTemplate
            pageTitle="SaaS Application"
            breadcrumbCategory="Software Engineering"
            heroPill="Software Engineering"
            heroTitleStart="SaaS Application"
            heroTitleHighlight="Development"
            heroSubtitle="Multi-tenant SaaS products from MVP to scale — built with billing, subscriptions, analytics, and admin tools out of the box."
            // heroVideoSrc="https://amazedveku.de/images/saas.mp4"
            heroVideoSrc="/assets/images/header/demo/saas_app.mp4"
            featuresPill="Built for SaaS"
            featuresTitleStart="Software-as-a-Service"
            featuresTitleHighlight="Done The Right Way"
            featuresSubtitle="From idea to ARR — we engineer SaaS platforms that ship fast, scale safely, and convert trials into paying customers."
            features={[
                { title: 'Multi-Tenant Architecture', desc: 'Isolated by design — secure tenant separation with shared, sharded, or per-tenant DBs.', icon: '🏢' },
                { title: 'Subscription & Billing', desc: 'Native Stripe, Paddle, and Chargebee integrations — trials, plans, upgrades, dunning.', icon: '💳' },
                { title: 'Self-Serve Onboarding', desc: 'Frictionless signup, guided tours, and in-app activation that drive trial-to-paid.', icon: '🚀' },
                { title: 'Admin & Analytics Dashboards', desc: 'Tenant management, usage metering, MRR/churn dashboards baked in.', icon: '📊' },
                { title: 'Role-Based Access Control', desc: 'Workspaces, teams, roles, SSO, SCIM — enterprise-ready from day one.', icon: '🔐' },
                { title: 'Scalable Cloud-Native Stack', desc: 'Containerized microservices, autoscaling, and global CDN delivery.', icon: '☁️' },
            ]}
            processSteps={[
                { n: '01', t: 'Discovery & MVP', d: 'Define the wedge, target persona, and scope of a launch-ready MVP.' },
                { n: '02', t: 'Design', d: 'Activation-focused UX, design system, and onboarding flows.' },
                { n: '03', t: 'Build', d: 'Iterative sprints with weekly demos, beta cohorts, and feedback loops.' },
                { n: '04', t: 'Launch & Scale', d: 'Production deploy, growth instrumentation, and continuous feature delivery.' },
            ]}
            servicesPill="Our Capabilities"
            servicesTitleStart="SaaS"
            servicesTitleHighlight="Services We Offer"
            servicesSubtitle="Everything you need to build, launch, and grow a successful SaaS product."
            servicesLayout="timeline"
            serviceCards={[
                { title: 'SaaS Product Strategy', desc: 'Market validation, MVP scoping, pricing strategy, and go-to-market planning.', icon: ICON.target },
                { title: 'SaaS MVP Development', desc: 'Ship a polished, production-grade MVP in 8–12 weeks — built on a stack that can scale.', icon: ICON.rocket },
                { title: 'Multi-Tenant Architecture', desc: 'Database, application, and infrastructure isolation patterns chosen for your scale.', icon: ICON.cog },
                { title: 'Subscription & Billing Integration', desc: 'Stripe, Paddle, Chargebee, and custom billing — plans, trials, proration, dunning, taxes.', icon: ICON.box },
                { title: 'SaaS UI/UX Design', desc: 'Activation-focused dashboards, onboarding flows, and design systems for product velocity.', icon: ICON.palette },
                { title: 'SaaS Backend Development', desc: 'Scalable APIs, queues, and event-driven services that grow with your usage.', icon: ICON.code },
                { title: 'Customer Onboarding Flows', desc: 'In-app guides, checklists, and empty states that move users to "aha" fast.', icon: ICON.eye },
                { title: 'SaaS Analytics & Metrics', desc: 'MRR, churn, LTV, cohort analysis, and product analytics dashboards built in.', icon: ICON.chart },
                { title: 'Enterprise SaaS Features', desc: 'SSO, SCIM, audit logs, SLAs, and compliance certifications for upmarket sales.', icon: ICON.lock },
                { title: 'API & Integrations Marketplace', desc: 'Public APIs, webhooks, OAuth, and Zapier-style integration ecosystems.', icon: ICON.link },
                { title: 'White-Label SaaS Development', desc: 'Themeable, branded, multi-region SaaS for resellers and enterprise customers.', icon: ICON.globe },
                { title: 'SaaS Maintenance & Growth', desc: 'Ongoing feature delivery, performance tuning, and growth experiments.', icon: ICON.headset },
            ]}
            toolsTitleStart="Languages &"
            toolsTitleHighlight="Frameworks We Use"
            toolsSubtitle="A modern SaaS stack — typed end-to-end, batteries included, picked for speed of iteration and longevity."
            toolsLayout="vertical"
            tools={[
                { n: 'TypeScript',   s: 'typescript',   c: '3178C6', desc: 'Type-safe end-to-end code — the language of our frontends, APIs, and shared schemas.' },
                { n: 'JavaScript',   s: 'javascript',   c: 'F7DF1E', desc: 'Native browser language we use for lightweight scripts, edge functions, and embeddable widgets.' },
                { n: 'Python',       s: 'python',       c: '3776AB', desc: 'Backend services, data pipelines, and AI features — chosen when batteries-included libraries matter most.' },
                { n: 'Node.js',      s: 'nodedotjs',    c: '5FA04E', desc: 'High-throughput API servers, real-time websockets, and serverless functions across our SaaS builds.' },
                { n: 'React',        s: 'react',        c: '61DAFB', desc: 'Component library powering our SaaS dashboards — composable, fast, and library-rich.' },
                { n: 'Next.js',      s: 'nextdotjs',    c: '000000', desc: 'Full-stack React framework — file-system routing, ISR, server actions, and edge runtime out of the box.' },
                { n: 'Tailwind CSS', s: 'tailwindcss',  c: '06B6D4', desc: 'Utility-first CSS — design systems that ship in days, not weeks, with consistent spacing and tokens.' },
                { n: 'PostgreSQL',   s: 'postgresql',   c: '4169E1', desc: 'Our default relational DB for tenant-isolated SaaS — JSONB, RLS, partitioning, and bulletproof reliability.' },
                { n: 'MongoDB',      s: 'mongodb',      c: '47A248', desc: 'Document store for flexible-schema features — activity feeds, audit logs, and product event streams.' },
                { n: 'Redis',        s: 'redis',        c: 'DC382D', desc: 'In-memory cache, rate limiter, and pub/sub backbone — keeps SaaS dashboards instant under load.' },
                { n: 'Stripe',       s: 'stripe',       c: '008CDD', desc: 'Subscription, billing, dunning, taxes, and revenue recognition — every SaaS we ship runs on Stripe.' },
                { n: 'GraphQL',      s: 'graphql',      c: 'E10098', desc: 'Typed, query-shaped API for SaaS dashboards that need to fetch deeply-related data in one round-trip.' },
                { n: 'Docker',       s: 'docker',       c: '2496ED', desc: 'Containerized services for reproducible builds and deployable artifacts across every environment.' },
                { n: 'Kubernetes',   s: 'kubernetes',   c: '326CE5', desc: 'Production orchestration for scaled SaaS — autoscaling, multi-AZ, and zero-downtime rollouts.' },
                { n: 'AWS',          url: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg', desc: 'Where most of our SaaS workloads live — RDS, S3, Lambda, CloudFront, and the rest of the AWS arsenal.' },
                { n: 'Vercel',       s: 'vercel',       c: '000000', desc: 'Edge-deployed Next.js frontends — preview deploys per PR and global low-latency delivery.' },
            ]}
            hideProjects={true}
            hideTestimonial={true}
            showClients={true}
            clientsPill="Trusted By SaaS Founders"
            clientsHeading="From Pre-Seed MVPs to Series-C Platforms,"
            clientsHeadingHighlight="We Engineer SaaS That Sticks"
            products={[
                {
                    badge: 'CRM · SaaS Platform',
                    titleStart: 'All-in-One',
                    titleHighlight: 'Dawki CRM',
                    desc: 'A unified workspace to manage clients, admins, and employees — built for teams that move fast. In-app dialer with auto-timer, real-time performance graphs, role-based access, and every customer touchpoint in one searchable timeline.',
                    image: '/assets/images/about/crm-dashboard.png',
                    features: [
                        { icon: '📞', text: 'Built-in call dialer with auto-timer & call logs' },
                        { icon: '👥', text: 'Role-based access for admin, employees & clients' },
                        { icon: '📊', text: 'Real-time dashboards, KPIs & performance graphs' },
                        { icon: '📅', text: 'Tasks, reminders & follow-up automation' },
                    ],
                    ctaLabel: 'Try Dawki CRM',
                    ctaHref: '/contact',
                    reverse: true,
                },
                {
                    badge: 'AI · Bulk Messaging',
                    badgeAlt: true,
                    titleStart: 'AI Grow',
                    titleHighlight: 'Smart Outreach Bot',
                    desc: 'Send thousands of personalized messages in minutes — without burning out reps or hitting spam filters. AI Grow handles bulk WhatsApp, SMS & email campaigns with smart scheduling, AI-personalized copy, delivery tracking, and intent-based reply detection.',
                    image: '/assets/images/about/ai-grow-dashboard.png',
                    features: [
                        { icon: '⚡', text: 'Bulk send across WhatsApp, SMS & email channels' },
                        { icon: '🤖', text: 'AI-personalized message variants per contact' },
                        { icon: '📈', text: 'Live delivery, open & reply analytics' },
                        { icon: '🛡️', text: 'Smart throttling to keep deliverability high' },
                    ],
                    ctaLabel: 'Try AI Grow',
                    ctaHref: '/contact',
                    glowAlt: true,
                },
            ]}
            productsPill="Our SaaS Products"
            productsTitleStart="Built In-House."
            productsTitleHighlight="Trusted by Teams."
            productsSubtitle="Production SaaS we run for our own customers — same playbook, same quality bar, same engineers we'd put on yours."
            extraSections={
                <>
                    <SaasFunnel />
                    <SaasArchitectureStack />
                    <SaasVideo />
                </>
            }
            googleReviews={[
                {
                    name: 'Connor Vasquez',
                     rating: 5,
                    date: '2 months ago',
                    text: 'We went from idea to first paying customers in 11 weeks. Dawki built our MVP, billing, onboarding, and admin dashboard — and the codebase is clean enough that our internal team picked it up without friction.',
                },
                {
                    name: 'Mira Saldana',
                     rating: 5,
                    date: '4 months ago',
                    text: 'Stripe billing with proration, trials, and dunning that actually handles edge cases. Their multi-tenant Postgres design saved us a re-architecture two years down the line.',
                },
                {
                    name: 'Mukesh Biswas',
                     rating: 5,
                    date: '6 months ago',
                    text: 'They added SSO, SCIM, and audit logs in time for our first enterprise deal — a 400K ARR contract that we would have lost without those features. The engagement paid for itself five times over.',
                },
                {
                    name: 'Niamh O\'Connell',
                     rating: 5,
                    date: '3 months ago',
                    text: 'Onboarding flows that lifted trial-to-paid by 31% in the first quarter. The activation checklist + empty states + tooltips combo is the cleanest implementation I\'ve seen.',
                },
                {
                    name: 'Rohan Pillai',
                     rating: 5,
                    date: '5 months ago',
                    text: 'Public API + webhooks + OAuth — shipped with such polished docs that our customers built integrations on day one. Zero support tickets about the API itself.',
                },
                {
                    name: 'Hina Lindgren',
                     rating: 5,
                    date: '7 months ago',
                    text: 'White-label SaaS with full theming and per-tenant subdomains. Our resellers ship branded versions in hours instead of weeks. Best product investment we\'ve made.',
                },
            ]}
            googleReviewsHeading="What SaaS Founders Say About Us"
            googleReviewsSubtitle="Verified reviews from founders, CTOs, and product leads we've shipped SaaS platforms with."
            faqs={[
                { q: 'What is SaaS application development?', a: 'SaaS development is the process of building cloud-hosted, subscription-based software that customers access via the web — typically multi-tenant, with self-serve signup and recurring billing.' },
                { q: 'How long does it take to build a SaaS MVP?', a: 'A focused MVP usually ships in 8–12 weeks. Larger SaaS platforms with multiple personas typically take 4–9 months.' },
                { q: 'Which payment providers do you integrate?', a: 'Stripe, Paddle, Chargebee, Recurly, Lemon Squeezy, and custom billing — including taxes, dunning, and proration.' },
                { q: 'How do you handle multi-tenant data isolation?', a: 'Depending on scale and compliance, we use shared schema with row-level security, schema-per-tenant, or DB-per-tenant — chosen for your needs.' },
                { q: 'Can you add SSO and enterprise features later?', a: 'Yes — SSO (SAML/OIDC), SCIM provisioning, audit logs, and SLAs are common upmarket additions we add as you grow.' },
                { q: 'Do you provide post-launch growth support?', a: 'Yes. We help with feature delivery, A/B testing, onboarding optimization, and conversion experiments.' },
                { q: 'Will my SaaS scale globally?', a: 'Yes. We architect for horizontal scale, multi-region deployment, and CDN-backed global delivery from day one.' },
            ]}
        />
    );
}
