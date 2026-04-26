import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ServicePageTemplate, { ICON } from '@/components/ServicePageTemplate';

/* ===========================================================================
 * Section 1: Engineer Talent Wall — 6 profile cards
 * =========================================================================== */
type Engineer = {
    name: string;
    handle: string;
    initials: string;
    role: string;
    years: string;
    location: string;
    skills: string[];
    rate: string;
    a: string; b: string; glow: string; color: string; bg: string; border: string;
};

const ENGINEERS: Engineer[] = [
    {
        name: 'Priya M.',
        handle: '@priya · Senior Frontend',
        initials: 'PM',
        role: 'Senior Frontend',
        years: '8 yrs',
        location: 'Bengaluru · IST',
        skills: ['React', 'Next.js', 'TypeScript', 'Tailwind', 'Storybook'],
        rate: '$48 / hr',
        a: '#06b6d4', b: '#4f7cff', glow: 'rgba(6, 182, 212, 0.32)', color: '#67e8f9',
        bg: 'rgba(6, 182, 212, 0.10)', border: 'rgba(6, 182, 212, 0.30)',
    },
    {
        name: 'Daniel A.',
        handle: '@daniel · Lead Backend',
        initials: 'DA',
        role: 'Lead Backend',
        years: '11 yrs',
        location: 'Berlin · CET',
        skills: ['Node', 'Go', 'PostgreSQL', 'Kafka', 'gRPC'],
        rate: '$72 / hr',
        a: '#22c55e', b: '#06b6d4', glow: 'rgba(34, 197, 94, 0.32)', color: '#86efac',
        bg: 'rgba(34, 197, 94, 0.10)', border: 'rgba(34, 197, 94, 0.30)',
    },
    {
        name: 'Aiyana B.',
        handle: '@aiyana · Full-Stack',
        initials: 'AB',
        role: 'Senior Full-Stack',
        years: '7 yrs',
        location: 'Toronto · EST',
        skills: ['React', 'Node', 'Postgres', 'AWS', 'Stripe'],
        rate: '$58 / hr',
        a: '#a855f7', b: '#ec4899', glow: 'rgba(168, 85, 247, 0.32)', color: '#d8b4fe',
        bg: 'rgba(168, 85, 247, 0.10)', border: 'rgba(168, 85, 247, 0.30)',
    },
    {
        name: 'Karim S.',
        handle: '@karim · DevOps & SRE',
        initials: 'KS',
        role: 'Senior DevOps',
        years: '9 yrs',
        location: 'Cairo · EET',
        skills: ['Kubernetes', 'Terraform', 'AWS', 'Datadog', 'ArgoCD'],
        rate: '$62 / hr',
        a: '#ec4899', b: '#f97316', glow: 'rgba(236, 72, 153, 0.32)', color: '#fbcfe8',
        bg: 'rgba(236, 72, 153, 0.10)', border: 'rgba(236, 72, 153, 0.30)',
    },
    {
        name: 'Rohan K.',
        handle: '@rohan · Mobile Engineer',
        initials: 'RK',
        role: 'Senior Mobile',
        years: '6 yrs',
        location: 'Pune · IST',
        skills: ['React Native', 'Swift', 'Kotlin', 'Detox'],
        rate: '$52 / hr',
        a: '#f97316', b: '#fbbf24', glow: 'rgba(249, 115, 22, 0.32)', color: '#fed7aa',
        bg: 'rgba(249, 115, 22, 0.10)', border: 'rgba(249, 115, 22, 0.30)',
    },
    {
        name: 'Lina C.',
        handle: '@lina · Product Designer',
        initials: 'LC',
        role: 'Senior Product Designer',
        years: '7 yrs',
        location: 'Lisbon · WET',
        skills: ['Figma', 'Tokens', 'A/B Testing', 'Storybook', 'Tailwind'],
        rate: '$54 / hr',
        a: '#4f7cff', b: '#a855f7', glow: 'rgba(79, 124, 255, 0.32)', color: '#93c5fd',
        bg: 'rgba(79, 124, 255, 0.10)', border: 'rgba(79, 124, 255, 0.30)',
    },
];

const TalentWall: React.FC = () => (
    <section className="dawki-ddt-wall">
        <div className="container">
            <div className="dawki-ddt-wall-heading">
                <span className="dawki-ddt-wall-pill">
                    <span></span>
                    Vetted Talent
                </span>
                <h2 className="dawki-ddt-wall-title">
                    The Top 5% of Engineers, <span>Ready to Embed With You</span>
                </h2>
                <p className="dawki-ddt-wall-subtitle">
                    A composite preview of the kind of talent we shortlist for clients — skill-matched, time-zone aligned, available now. Every engineer goes through a four-stage screen before reaching this list.
                </p>
            </div>

            <motion.div
                className="dawki-ddt-wall-grid"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-80px' }}
                variants={{
                    hidden: {},
                    show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
                }}
            >
                {ENGINEERS.map((eng) => (
                    <motion.div
                        key={eng.name}
                        className="dawki-ddt-card"
                        style={{
                            ['--ec-a' as string]: eng.a,
                            ['--ec-b' as string]: eng.b,
                            ['--ec-glow' as string]: eng.glow,
                            ['--ec-color' as string]: eng.color,
                            ['--ec-bg' as string]: eng.bg,
                            ['--ec-border' as string]: eng.border,
                        }}
                        variants={{
                            hidden: { opacity: 0, y: 24 },
                            show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] } },
                        }}
                    >
                        <div className="dawki-ddt-card-head">
                            <span className="dawki-ddt-card-avatar">{eng.initials}</span>
                            <div className="dawki-ddt-card-meta">
                                <h3 className="dawki-ddt-card-name">{eng.name}</h3>
                                <span className="dawki-ddt-card-handle">{eng.handle}</span>
                            </div>
                        </div>

                        <span className="dawki-ddt-card-role">{eng.role}</span>

                        <div className="dawki-ddt-card-stats">
                            <div>
                                <div className="dawki-ddt-card-stat-key">Experience</div>
                                <div className="dawki-ddt-card-stat-val">{eng.years}</div>
                            </div>
                            <div>
                                <div className="dawki-ddt-card-stat-key">Location</div>
                                <div className="dawki-ddt-card-stat-val">{eng.location}</div>
                            </div>
                        </div>

                        <div className="dawki-ddt-card-skills-h">Top Skills</div>
                        <div className="dawki-ddt-card-skills">
                            {eng.skills.map((s) => (
                                <span key={s} className="dawki-ddt-card-skill">{s}</span>
                            ))}
                        </div>

                        <div className="dawki-ddt-card-foot">
                            <span className="dawki-ddt-card-foot-status">Available now</span>
                            <span className="dawki-ddt-card-foot-rate">{eng.rate}</span>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    </section>
);

/* ===========================================================================
 * Section 2: 3-Week Hiring Sprint — vertical day-by-day timeline
 * =========================================================================== */
type Week = {
    label: string;
    sub: string;
    title: string;
    titleSub: string;
    a: string; b: string; glow: string; dotColor: string;
    days: { num: string; title: string; desc: string }[];
};

const WEEKS: Week[] = [
    {
        label: 'Week 1',
        sub: 'Days 1–5',
        title: 'Match & Onboard',
        titleSub: 'Vetted shortlist · interviews · contract',
        a: '#06b6d4', b: '#4f7cff', glow: 'rgba(6, 182, 212, 0.45)', dotColor: '#06b6d4',
        days: [
            { num: 'Day 1', title: 'Discovery call & role brief',          desc: 'Stack, roadmap, working norms, and required roles agreed in a 60-minute kickoff.' },
            { num: 'Day 2', title: 'Pre-vetted shortlist delivered',       desc: '2–3 hand-picked candidates per role from our existing bench, matched to your stack.' },
            { num: 'Day 3', title: 'Client interviews start',              desc: 'You interview the shortlist on your own schedule. We coordinate, you decide.' },
            { num: 'Day 5', title: 'Contracts signed · access granted',    desc: 'NDAs, MSAs, and tool access (Slack, GitHub, Linear, Figma) provisioned.' },
        ],
    },
    {
        label: 'Week 2',
        sub: 'Days 6–10',
        title: 'Embed & Plan',
        titleSub: 'Codebase walkthrough · sprint zero · first PRs',
        a: '#a855f7', b: '#ec4899', glow: 'rgba(168, 85, 247, 0.45)', dotColor: '#a855f7',
        days: [
            { num: 'Day 6',  title: 'Codebase walkthrough · architecture brief', desc: 'Existing engineers walk the new team through the codebase, services, and conventions.' },
            { num: 'Day 7',  title: 'Local dev environment up & running',        desc: 'Repo cloned, services running, first hello-world PR opened to test the loop.' },
            { num: 'Day 8',  title: 'Sprint Zero kickoff',                       desc: 'First sprint planned with you. Story points sized, assignments made.' },
            { num: 'Day 10', title: 'First PRs reviewed & merged',               desc: 'Real tickets shipped. Code review cadence established.' },
        ],
    },
    {
        label: 'Week 3',
        sub: 'Days 11–15',
        title: 'Ship & Establish Cadence',
        titleSub: 'First production deploy · weekly demos',
        a: '#22c55e', b: '#06b6d4', glow: 'rgba(34, 197, 94, 0.45)', dotColor: '#22c55e',
        days: [
            { num: 'Day 11', title: 'First production deploy',           desc: 'A real customer-visible feature shipped to prod by the new team.' },
            { num: 'Day 13', title: 'Weekly demo with stakeholders',     desc: 'Demo cadence established. Friday demos become a routine.' },
            { num: 'Day 14', title: 'Retrospective + adjustment',        desc: 'First retro. Process tweaks made. Communication channels tightened.' },
            { num: 'Day 15', title: 'Steady-state delivery',             desc: 'The team is now operating as a self-driven pod. Continuous delivery from here on.' },
        ],
    },
];

const HiringSprint: React.FC = () => (
    <section className="dawki-ddt-sprint">
        <div className="container">
            <div className="dawki-ddt-sprint-heading">
                <span className="dawki-ddt-sprint-pill">
                    <span></span>
                    Onboarding Timeline
                </span>
                <h2 className="dawki-ddt-sprint-title">
                    From Kickoff to First Deploy <span>In 15 Working Days</span>
                </h2>
                <p className="dawki-ddt-sprint-subtitle">
                    No three-month hiring slogs. Three working weeks from the contract being signed to your new pod merging real production code.
                </p>
            </div>

            <motion.div
                className="dawki-ddt-sprint-frame"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
            >
                {WEEKS.map((week, wi) => (
                    <motion.div
                        key={week.label}
                        className="dawki-ddt-sprint-week"
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ delay: 0.2 + wi * 0.15, duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
                    >
                        <div className="dawki-ddt-sprint-week-head">
                            <span
                                className="dawki-ddt-sprint-week-badge"
                                style={{
                                    ['--wk-a' as string]: week.a,
                                    ['--wk-b' as string]: week.b,
                                    ['--wk-glow' as string]: week.glow,
                                }}
                            >
                                <strong>{week.label}</strong>
                                <span>{week.sub}</span>
                            </span>
                            <div>
                                <h3 className="dawki-ddt-sprint-week-title">{week.title}</h3>
                                <span className="dawki-ddt-sprint-week-title-sub">{week.titleSub}</span>
                            </div>
                        </div>

                        <div className="dawki-ddt-sprint-days">
                            {week.days.map((day, di) => (
                                <motion.div
                                    key={day.num}
                                    className="dawki-ddt-sprint-day"
                                    style={{ ['--day-color' as string]: week.dotColor }}
                                    initial={{ opacity: 0, y: 12 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-40px' }}
                                    transition={{ delay: 0.3 + wi * 0.15 + di * 0.08, duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                                >
                                    <span className="dawki-ddt-sprint-day-num">{day.num}</span>
                                    <div className="dawki-ddt-sprint-day-content">
                                        <h4 className="dawki-ddt-sprint-day-title">{day.title}</h4>
                                        <p className="dawki-ddt-sprint-day-desc">{day.desc}</p>
                                    </div>
                                    <span className="dawki-ddt-sprint-day-check" aria-hidden="true">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ))}

                <motion.div
                    className="dawki-ddt-sprint-flag"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    🚀  Steady-state delivery — your pod is now shipping production code
                </motion.div>
            </motion.div>
        </div>
    </section>
);

/* ===========================================================================
 * Section 3: Video Showcase
 * =========================================================================== */
const DdtVideo: React.FC = () => {
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
                        How Pods Ship
                    </span>
                    <h2 className="dawki-ent-video-title">
                        See How Our Dedicated Pods <span>Ship Real Production Work</span>
                    </h2>
                    <p className="dawki-ent-video-subtitle">
                        A behind-the-scenes look at how we vet engineers, embed pods inside client teams, and run weekly demos that turn dedicated talent into shipped product.
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
export default function DedicatedDevelopmentTeams() {
    return (
        <ServicePageTemplate
            pageTitle="Dedicated Development Teams"
            breadcrumbCategory="Other Services"
            heroPill="Other Services"
            heroTitleStart="Dedicated"
            heroTitleHighlight="Development Teams"
            heroSubtitle="Hand-picked, full-time engineering teams that work as an extension of yours — fast to scale, easy to manage, fully accountable."
            heroVideoSrc="/assets/images/header/demo/dedicated-development-teams.mp4"
            featuresPill="Your Team, Extended"
            featuresTitleStart="Engineering Teams"
            featuresTitleHighlight="Built Around You"
            featuresSubtitle="From a single senior engineer to a full cross-functional pod — we assemble, embed, and manage dedicated teams that ship production code."
            features={[
                { title: 'Senior Vetted Talent', desc: 'Less than 5% of candidates pass our screening for skill, communication, and ownership.', icon: '🎓' },
                { title: 'Full-Time Dedicated', desc: 'Engineers work exclusively with you — your priorities, your standup, your codebase.', icon: '🔒' },
                { title: 'Cross-Functional Pods', desc: 'Engineers, designers, QA, DevOps, PMs assembled around your roadmap.', icon: '👥' },
                { title: 'Fast Ramp-Up', desc: 'Teams up and shipping in 1–3 weeks — not months.', icon: '⚡' },
                { title: 'Time-Zone Aligned', desc: 'Teams in your time-zone or with overlapping hours for tight collaboration.', icon: '🌍' },
                { title: 'Flexible Scaling', desc: 'Add or rotate roles as priorities shift — no long-term lock-in.', icon: '📈' },
            ]}
            processSteps={[
                { n: '01', t: 'Discovery', d: 'Understand stack, roadmap, working norms, and required roles.' },
                { n: '02', t: 'Match', d: 'Shortlist 2–3 vetted candidates per role within days.' },
                { n: '03', t: 'Onboard', d: 'Embed in your tooling, codebase, and rituals within the first sprint.' },
                { n: '04', t: 'Ship & Scale', d: 'Continuous delivery with regular check-ins and team adjustments.' },
            ]}
            servicesPill="Roles We Provide"
            servicesTitleStart="Dedicated Team"
            servicesTitleHighlight="Roles We Offer"
            servicesSubtitle="Senior, vetted talent across every modern engineering, product, and design role."
            servicesLayout="timeline"
            serviceCards={[
                { title: 'Frontend Engineers', desc: 'React, Next.js, Vue, TypeScript, design-system fluent — production-grade frontend.', icon: ICON.code },
                { title: 'Backend Engineers', desc: 'Node, Python, Go, Java, .NET, PHP — APIs, services, and high-throughput systems.', icon: ICON.cog },
                { title: 'Full-Stack Engineers', desc: 'Comfortable across frontend and backend — perfect for product squads and startups.', icon: ICON.refresh },
                { title: 'Mobile Engineers', desc: 'Native iOS/Android, React Native, and Flutter mobile engineers.', icon: ICON.rocket },
                { title: 'DevOps & SRE', desc: 'AWS, Azure, GCP, Kubernetes, Terraform, CI/CD, and observability experts.', icon: ICON.cloud },
                { title: 'AI / ML Engineers', desc: 'LLMs, RAG, agents, fine-tuning, and classical ML engineers.', icon: ICON.bot },
                { title: 'Data Engineers', desc: 'dbt, Snowflake, BigQuery, Spark, Airflow — modern data stack delivery.', icon: ICON.database },
                { title: 'QA Engineers & SDETs', desc: 'Manual + automation engineers using Playwright, Cypress, Appium, k6.', icon: ICON.check },
                { title: 'Product Designers (UX/UI)', desc: 'Senior product designers with research, systems, and engineering-handoff skills.', icon: ICON.palette },
                { title: 'Product Managers', desc: 'Roadmap, discovery, and delivery PMs — embedded with engineering pods.', icon: ICON.target },
                { title: 'Engineering Managers / Tech Leads', desc: 'Senior leaders to run teams, raise the bar, and own outcomes.', icon: ICON.users },
                { title: 'Cross-Functional Pods', desc: 'Pre-formed squads (PM + design + engineering + QA) ready to ship a product.', icon: ICON.box },
            ]}
            toolsTitleStart="Collaboration Stack &"
            toolsTitleHighlight="Tools Our Pods Run On"
            toolsSubtitle="A modern collaboration toolkit — issue tracking, comms, code, design, and observability — that we plug into yours from day one."
            toolsLayout="vertical"
            tools={[
                { n: 'Slack',        s: 'slack',        c: '4A154B', desc: 'Daily comms, standups, and async work — every pod ships with shared channels and ChatOps.' },
                { n: 'GitHub',       s: 'github',       c: '181717', desc: 'Source control + PR reviews + Actions CI — our default for code, with full branch hygiene.' },
                { n: 'GitLab',       s: 'gitlab',       c: 'FC6D26', desc: 'When teams already invest in GitLab CI + Self-managed repos — we plug right in.' },
                { n: 'Jira / Linear',s: 'linear',       c: '5E6AD2', desc: 'Sprint planning, issue tracking, and roadmap views — pods adopt your existing tracker.' },
                { n: 'Notion',       s: 'notion',       c: '000000', desc: 'Specs, ADRs, retros, and team-knowledge — searchable across every engagement.' },
                { n: 'Confluence',   s: 'confluence',   c: '172B4D', desc: 'Enterprise documentation when teams already invest in the Atlassian suite.' },
                { n: 'Figma',        s: 'figma',        c: 'F24E1E', desc: 'Designer + engineer collaboration — multiplayer canvases, design tokens, Dev Mode handoff.' },
                { n: 'Storybook',    s: 'storybook',    c: 'FF4785', desc: 'Component documentation that lives next to the code — every variant exercised.' },
                { n: 'Postman',      s: 'postman',      c: 'FF6C37', desc: 'API contract collaboration — collections shared between backend and frontend pods.' },
                { n: 'Datadog',      s: 'datadog',      c: '632CA6', desc: 'Unified observability — pods get APM, logs, and dashboards from day one of production.' },
                { n: 'Sentry',       s: 'sentry',       c: '362D59', desc: 'Error tracking + release health — every pod owns the alerts for the code they ship.' },
                { n: 'Loom',         s: 'loom',         c: '625DF5', desc: 'Async video updates — when a 3-minute Loom beats a 30-minute meeting.' },
                { n: 'Zoom',         s: 'zoom',         c: '0B5CFF', desc: 'Standups, demos, and pair-programming sessions across every time zone.' },
                { n: 'Calendly',     s: 'calendly',     c: '006BFF', desc: 'Async scheduling — interviews, demos, and stakeholder syncs without ping-pong.' },
                { n: 'AWS / Azure / GCP', url: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg', desc: 'Cloud-fluent across all three hyperscalers — pods plug into your existing infrastructure.' },
                { n: '1Password',    s: '1password',    c: '0572EC', desc: 'Shared vaults for credentials and secrets — secure access without compromising hygiene.' },
            ]}
            hideProjects={true}
            hideTestimonial={true}
            showClients={true}
            clientsPill="Trusted By Engineering Leaders"
            clientsHeading="From Series-A Startups to Fortune 500 Engineering,"
            clientsHeadingHighlight="Our Pods Ship Production Code"
            extraSections={
                <>
                    <TalentWall />
                    <HiringSprint />
                    <DdtVideo />
                </>
            }
            googleReviews={[
                {
                    name: 'Connor Vasquez',
                    role: 'CTO, Trailpoint Analytics',
                    rating: 5,
                    date: '2 months ago',
                    text: 'They had a four-engineer pod up and shipping in twelve working days from contract. Every one of them was senior, opinionated, and easy to work with — the kind of hires we have spent six months trying to make ourselves.',
                },
                {
                    name: 'Mira Saldana',
                    role: 'Head of Engineering, FlowDesk SaaS',
                    rating: 5,
                    date: '4 months ago',
                    text: 'Two senior backend engineers and a DevOps lead embedded with our team for nine months. Velocity went up, on-call pages went down, and our internal hires had a clear bar to be measured against.',
                },
                {
                    name: 'Owen Bradshaw',
                    role: 'VP Product, Pulsemark Labs',
                    rating: 5,
                    date: '6 months ago',
                    text: 'Their cross-functional pod (PM + design + engineering + QA) shipped a new product line in five months — start to launch — that our internal team had been stuck on for over a year.',
                },
                {
                    name: 'Niamh O\'Connell',
                    role: 'Engineering Manager, Quillstack',
                    rating: 5,
                    date: '3 months ago',
                    text: 'Replaced a senior engineer who left mid-project in nine days. The replacement was up to speed in two weeks. That alone justified the engagement model for the next three years.',
                },
                {
                    name: 'Rohan Pillai',
                    role: 'Head of Platform, FleetForge',
                    rating: 5,
                    date: '5 months ago',
                    text: 'A two-person Kubernetes + Terraform pod that knew our stack better than some of our internal team did within a month. Deploy time dropped 70%, and we stopped firefighting.',
                },
                {
                    name: 'Hanna Lindgren',
                    role: 'Founder, Northstack',
                    rating: 5,
                    date: '7 months ago',
                    text: 'They scaled our engineering team from two to nine over three quarters with zero quality regressions. Every hire stuck. Every hire shipped. That has never happened to us with any other vendor.',
                },
            ]}
            googleReviewsHeading="What Engineering Leaders Say About Our Pods"
            googleReviewsSubtitle="Verified reviews from CTOs, VPs of Engineering, and engineering managers we've embedded teams with."
            faqs={[
                { q: 'What is a dedicated development team?', a: 'A dedicated team is a group of engineers (and often designers and PMs) who work exclusively for you under your direction — like full-time hires without the overhead.' },
                { q: 'How is this different from staff augmentation?', a: 'Dedicated teams are typically larger, more cross-functional, and operate as a unit. Staff augmentation is usually individual specialists added to your team.' },
                { q: 'How fast can a team be ready?', a: 'Most teams are vetted, matched, and onboarded within 1–3 weeks of contract signing.' },
                { q: 'Can we interview the engineers?', a: 'Absolutely. Final hiring decisions are always yours — we shortlist, you choose.' },
                { q: 'Do they work in our time zone?', a: 'Yes. We staff teams in your time zone or with daily overlap windows that match your rituals.' },
                { q: 'How do you ensure quality?', a: 'Less than 5% candidate pass rate, code reviews, ongoing performance reviews, and replacement guarantees if a fit is wrong.' },
                { q: 'Can we scale the team up or down?', a: 'Yes. Add roles, rotate skill sets, or scale down with reasonable notice — flexibility is the point.' },
            ]}
        />
    );
}
