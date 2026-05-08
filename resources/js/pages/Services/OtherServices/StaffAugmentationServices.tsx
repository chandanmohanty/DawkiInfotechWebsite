import React from 'react';
import { motion } from 'framer-motion';
import ServicePageTemplate, { ICON } from '@/components/ServicePageTemplate';

/* ===========================================================================
 * Section 1: Talent Vetting Funnel — animated funnel showing how candidates
 * narrow from a 12,000-engineer pool down to the senior 4–5% we shortlist
 * for your team. Topic-relevant (talent quality), visual, no pricing.
 * =========================================================================== */
type FunnelStep = {
    label: string;
    count: string;
    desc: string;
    width: string;
    a: string; b: string; glow: string;
};

const FUNNEL_STEPS: FunnelStep[] = [
    {
        label: 'Sourced from network',
        count: '12,000+',
        desc: 'Engineers, designers, and PMs in our active talent network — sourced from referrals, conferences, and open-source.',
        width: '100%',
        a: '#06b6d4', b: '#4f7cff', glow: 'rgba(6, 182, 212, 0.40)',
    },
    {
        label: 'AI resume + skills screen',
        count: '~3,000',
        desc: 'NLP-based resume parsing + skill graph matching — surfaces candidates whose stack actually overlaps with yours.',
        width: '78%',
        a: '#22c55e', b: '#06b6d4', glow: 'rgba(34, 197, 94, 0.40)',
    },
    {
        label: 'Live coding + system design',
        count: '~1,200',
        desc: 'Pair-programming, architecture rounds, and a live debugging exercise — graded by senior Dawki engineers.',
        width: '60%',
        a: '#a855f7', b: '#ec4899', glow: 'rgba(168, 85, 247, 0.40)',
    },
    {
        label: 'Behavioural & culture fit',
        count: '~700',
        desc: 'Communication, ownership, and async-collaboration signal — checked against the working norms of senior teams.',
        width: '42%',
        a: '#ec4899', b: '#f97316', glow: 'rgba(236, 72, 153, 0.40)',
    },
    {
        label: 'Reference + background check',
        count: '~520',
        desc: 'Two prior managers contacted, IP / non-compete cleared, and identity + work-eligibility verified.',
        width: '28%',
        a: '#f97316', b: '#fbbf24', glow: 'rgba(249, 115, 22, 0.40)',
    },
    {
        label: 'Shortlisted to your team',
        count: '~520 (4.3%)',
        desc: '2–3 candidates per role hand-matched to your stack, time-zone, and product domain — yours to interview.',
        width: '15%',
        a: '#5b9eff', b: '#a855f7', glow: 'rgba(91, 158, 255, 0.45)',
    },
];

const VettingFunnel: React.FC = () => (
    <section className="dawki-saug-funnel">
        <div className="container">
            <div className="dawki-saug-funnel-heading">
                <span className="dawki-saug-funnel-pill">
                    <span></span>
                    Talent Vetting
                </span>
                <h2 className="dawki-saug-funnel-title">
                    From 12,000 Engineers <span>To Your Top 3</span>
                </h2>
                <p className="dawki-saug-funnel-subtitle">
                    Every candidate we put in front of you has cleared six layers of screening — automated, manual, technical, and behavioural. Less than 5% of our network ever reaches a client interview.
                </p>
            </div>

            <motion.div
                className="dawki-saug-funnel-frame"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
                }}
            >
                {FUNNEL_STEPS.map((step, i) => (
                    <motion.div
                        key={step.label}
                        className="dawki-saug-funnel-row"
                        variants={{
                            hidden: { opacity: 0, x: -24 },
                            visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] } },
                        }}
                    >
                        <div className="dawki-saug-funnel-rank">{String(i + 1).padStart(2, '0')}</div>
                        <div className="dawki-saug-funnel-content">
                            <div className="dawki-saug-funnel-content-head">
                                <span className="dawki-saug-funnel-content-label">{step.label}</span>
                                <strong
                                    className="dawki-saug-funnel-content-count"
                                    style={{
                                        background: `linear-gradient(90deg, ${step.a}, ${step.b})`,
                                        WebkitBackgroundClip: 'text',
                                        backgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        color: 'transparent',
                                    }}
                                >
                                    {step.count}
                                </strong>
                            </div>
                            <p className="dawki-saug-funnel-content-desc">{step.desc}</p>
                            <div className="dawki-saug-funnel-bar">
                                <motion.span
                                    className="dawki-saug-funnel-bar-fill"
                                    style={{
                                        background: `linear-gradient(90deg, ${step.a}, ${step.b})`,
                                        boxShadow: `0 0 24px ${step.glow}`,
                                    }}
                                    initial={{ width: 0 }}
                                    whileInView={{ width: step.width }}
                                    viewport={{ once: true, margin: '-80px' }}
                                    transition={{ duration: 1.0, ease: [0.2, 0.8, 0.2, 1], delay: 0.3 + i * 0.1 }}
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    </section>
);

/* ===========================================================================
 * Section 2: 7-Day Hiring Sprint — day-by-day timeline from brief to a
 * vetted engineer merging their first PR into your repo.
 * =========================================================================== */
type Phase = {
    label: string;
    sub: string;
    title: string;
    titleSub: string;
    a: string; b: string; glow: string; dotColor: string;
    days: { num: string; title: string; desc: string }[];
};

const SPRINT_PHASES: Phase[] = [
    {
        label: 'Day 1–2',
        sub: 'Brief',
        title: 'Role brief & calibration',
        titleSub: 'Stack · level · time-zone · start date locked',
        a: '#06b6d4', b: '#4f7cff', glow: 'rgba(6, 182, 212, 0.45)', dotColor: '#06b6d4',
        days: [
            { num: 'Day 1', title: '60-min brief call',                desc: 'You walk us through the role, codebase, ideal hire profile, and any do-or-die requirements.' },
            { num: 'Day 1', title: 'Skill graph generated',            desc: 'AI-assisted intake turns your brief into a precise skill, level, and time-zone signature for matching.' },
            { num: 'Day 2', title: 'Calibration profile shown',        desc: 'You confirm or adjust the target profile so we shortlist exactly the kind of senior we both expect.' },
        ],
    },
    {
        label: 'Day 3–5',
        sub: 'Shortlist',
        title: 'Vetted candidates delivered',
        titleSub: 'Resumes · Loom intros · live coding scores',
        a: '#a855f7', b: '#ec4899', glow: 'rgba(168, 85, 247, 0.45)', dotColor: '#a855f7',
        days: [
            { num: 'Day 3', title: '2–3 shortlisted candidates sent',  desc: 'Each profile includes a Loom intro, technical scorecard, time-zone fit, and prior project breakdown.' },
            { num: 'Day 4', title: 'You interview on your own loop',   desc: 'Up to 3 client interview rounds — coding, system design, behavioural — scheduled by us.' },
            { num: 'Day 5', title: 'Selected · contract signed',       desc: 'You pick. We send the contract, NDA, and IP transfer the same day. Engineer is officially yours.' },
        ],
    },
    {
        label: 'Day 6–7',
        sub: 'Onboard',
        title: 'Embedded & shipping',
        titleSub: 'Tools · access · first PR merged',
        a: '#22c55e', b: '#06b6d4', glow: 'rgba(34, 197, 94, 0.45)', dotColor: '#22c55e',
        days: [
            { num: 'Day 6', title: 'Tools provisioned · first standup',desc: 'Slack, GitHub, Linear, Figma, VPN, 1Password — all set up before they log in on Day 6.' },
            { num: 'Day 7', title: 'First PR opened',                  desc: 'A real ticket from your backlog merged into your main branch on day seven of the engagement.' },
            { num: 'Day 7+', title: 'Steady-state delivery',            desc: 'Two-week sprints, weekly check-ins, monthly review — the ramp is over, the shipping has begun.' },
        ],
    },
];

const HiringSprint: React.FC = () => (
    <section className="dawki-ddt-sprint">
        <div className="container">
            <div className="dawki-ddt-sprint-heading">
                <span className="dawki-ddt-sprint-pill">
                    <span></span>
                    Hiring Sprint
                </span>
                <h2 className="dawki-ddt-sprint-title">
                    From Brief to First PR <span>In 7 Working Days</span>
                </h2>
                <p className="dawki-ddt-sprint-subtitle">
                    No three-month recruiter cycles. One week from your brief landing in our inbox to a senior engineer merging their first PR into your repo.
                </p>
            </div>

            <motion.div
                className="dawki-ddt-sprint-frame"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
            >
                {SPRINT_PHASES.map((phase, pi) => (
                    <motion.div
                        key={phase.label}
                        className="dawki-ddt-sprint-week"
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ delay: 0.2 + pi * 0.15, duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
                    >
                        <div className="dawki-ddt-sprint-week-head">
                            <span
                                className="dawki-ddt-sprint-week-badge"
                                style={{
                                    ['--wk-a' as string]: phase.a,
                                    ['--wk-b' as string]: phase.b,
                                    ['--wk-glow' as string]: phase.glow,
                                }}
                            >
                                <strong>{phase.label}</strong>
                                <span>{phase.sub}</span>
                            </span>
                            <div>
                                <h3 className="dawki-ddt-sprint-week-title">{phase.title}</h3>
                                <span className="dawki-ddt-sprint-week-title-sub">{phase.titleSub}</span>
                            </div>
                        </div>

                        <div className="dawki-ddt-sprint-days">
                            {phase.days.map((day, di) => (
                                <motion.div
                                    key={day.num + di}
                                    className="dawki-ddt-sprint-day"
                                    style={{ ['--day-color' as string]: phase.dotColor }}
                                    initial={{ opacity: 0, y: 12 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-40px' }}
                                    transition={{ delay: 0.3 + pi * 0.15 + di * 0.08, duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                                >
                                    <span className="dawki-ddt-sprint-day-num">{day.num}</span>
                                    <div className="dawki-ddt-sprint-day-content">
                                        <h4 className="dawki-ddt-sprint-day-title">{day.title}</h4>
                                        <p className="dawki-ddt-sprint-day-desc">{day.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    </section>
);

/* ===========================================================================
 * Page
 * =========================================================================== */
export default function StaffAugmentationServices() {
    return (
        <ServicePageTemplate
            pageTitle="Staff Augmentation Services"
            breadcrumbCategory="Other Services"
            heroPill="Other Services"
            heroTitleStart="Staff Augmentation"
            heroTitleHighlight="Services"
            heroSubtitle="Vetted senior engineers, designers, and specialists added to your team — fast, flexible, and fully integrated with your workflow."
            heroVideoSrc="/assets/images/header/demo/dedicated-development-teams.mp4"
            featuresPill="On-Demand Talent"
            featuresTitleStart="Augment Your Team"
            featuresTitleHighlight="With Senior Talent"
            featuresSubtitle="From bridging skill gaps to scaling sprints — we plug vetted senior specialists into your team without recruiting overhead."
            features={[
                { title: 'Senior Vetted Specialists', desc: 'Less than 5% candidate pass rate — only proven senior talent reaches your shortlist.', icon: '🎓' },
                { title: 'Fast Time-to-Onboard',      desc: 'Vetted candidates delivered in days; engineers shipping in week one.', icon: '⚡' },
                { title: 'Direct Integration',        desc: 'Augmented staff join your standups, tooling, and workflow as part of your team.', icon: '🤝' },
                { title: 'Flexible Engagement',       desc: 'Scale up, down, or rotate roles as priorities shift — no long lock-ins.', icon: '📈' },
                { title: 'AI-Assisted Matching',      desc: 'Skill graph + behaviour models surface candidates who actually fit your stack and culture.', icon: '🤖' },
                { title: 'Replacement Guarantee',     desc: 'If a fit isn\'t right, we replace at no cost — we own the match.', icon: '🛡️' },
            ]}
            processSteps={[
                { n: '01', t: 'Brief',              d: 'Tell us the role, stack, level, and ideal start date.' },
                { n: '02', t: 'Shortlist',          d: '2–3 vetted candidates delivered within days of the brief.' },
                { n: '03', t: 'Interview & Select', d: 'You interview and choose; we manage contracts and logistics.' },
                { n: '04', t: 'Onboard & Ship',     d: 'Engineers join your team, ramp fast, and ship production work.' },
            ]}
            servicesPill="Roles We Provide"
            servicesTitleStart="Staff Augmentation"
            servicesTitleHighlight="Roles We Offer"
            servicesSubtitle="Senior, vetted talent across every modern engineering, design, data, and product role."
            servicesLayout="timeline"
            serviceCards={[
                { title: 'Frontend Engineers',                 desc: 'React, Next.js, Vue, Angular, TypeScript — production-grade frontend talent.', icon: ICON.code },
                { title: 'Backend Engineers',                  desc: 'Node, Python, Go, Java, .NET, Rails, PHP — APIs and high-throughput services.', icon: ICON.cog },
                { title: 'Full-Stack Engineers',               desc: 'Senior generalists comfortable across modern frontend and backend stacks.', icon: ICON.refresh },
                { title: 'Mobile Engineers',                   desc: 'iOS (Swift), Android (Kotlin), React Native, Flutter mobile talent.', icon: ICON.rocket },
                { title: 'DevOps & Cloud Engineers',           desc: 'AWS, Azure, GCP, Kubernetes, Terraform, CI/CD specialists.', icon: ICON.cloud },
                { title: 'AI / ML Engineers',                  desc: 'LLMs, RAG, agents, fine-tuning, MLOps, and classical ML engineering.', icon: ICON.bot },
                { title: 'Data Engineers',                     desc: 'dbt, Snowflake, BigQuery, Airflow, Spark — modern data stack engineers.', icon: ICON.database },
                { title: 'QA Engineers & SDETs',               desc: 'Manual + automation QA — Playwright, Cypress, Appium, k6.', icon: ICON.check },
                { title: 'Product Designers (UX/UI)',          desc: 'Senior designers with research, design systems, and prototyping fluency.', icon: ICON.palette },
                { title: 'Product Managers',                   desc: 'Discovery, roadmap, and delivery PMs embedded with your team.', icon: ICON.target },
                { title: 'Engineering Managers / Tech Leads',  desc: 'Senior leaders to coach, raise the bar, and own outcomes.', icon: ICON.users },
                { title: 'Salesforce, SAP & Specialists',      desc: 'Niche specialists for Salesforce, SAP, ServiceNow, and other enterprise platforms.', icon: ICON.headset },
            ]}
            toolsTitleStart="Hiring, Vetting &"
            toolsTitleHighlight="Collaboration Stack"
            toolsSubtitle="The tooling we use to source, vet, onboard, and run augmented engineers inside your team — AI-assisted at every step."
            toolsLayout="vertical"
            tools={[
                { n: 'OpenAI / GPT-4', s: 'openai',     c: '412991', desc: 'Resume parsing, skill-graph extraction, and AI-assisted candidate–brief matching.' },
                { n: 'Claude',         s: 'anthropic',  c: 'D97757', desc: 'Long-context candidate scorecards and second-opinion screening on technical writing samples.' },
                { n: 'HackerRank',     s: 'hackerrank', c: '00EA64', desc: 'Asynchronous coding tests with anti-cheat — auto-graded and peer-reviewed.' },
                { n: 'CodeSignal',     s: 'codesignal', c: '1062FB', desc: 'Live coding interviews + system-design rounds with playback for hiring-manager review.' },
                { n: 'Greenhouse',     s: 'greenhouse', c: '24A47F', desc: 'Applicant tracking — every interview kit, scorecard, and offer recorded in one place.' },
                { n: 'LinkedIn',       s: 'linkedin',   c: '0A66C2', desc: 'Outbound sourcing for niche stacks not yet in our active talent network.' },
                { n: 'Loom',           s: 'loom',       c: '625DF5', desc: 'Async candidate intros — every shortlisted engineer records a 2-min Loom for you.' },
                { n: 'Calendly',       s: 'calendly',   c: '006BFF', desc: 'Async interview scheduling across time-zones — no email ping-pong.' },
                { n: 'Slack',          s: 'slack',      c: '4A154B', desc: 'Day-one comms — every augmented engineer joins your channels and standups.' },
                { n: 'GitHub',         s: 'github',     c: '181717', desc: 'Source control + PR reviews + Actions CI — they ship into your repo from week one.' },
                { n: 'Linear',         s: 'linear',     c: '5E6AD2', desc: 'Sprint planning + issue tracking — augmented staff adopt your existing board.' },
                { n: 'Notion',         s: 'notion',     c: '000000', desc: 'Onboarding handbooks, runbooks, and your team\'s working norms — searchable.' },
                { n: 'Figma',          s: 'figma',      c: 'F24E1E', desc: 'Designer + engineer collaboration on shared canvases with Dev Mode handoff.' },
                { n: 'Zoom',           s: 'zoom',       c: '0B5CFF', desc: 'Standups, demos, pair-programming sessions — and final-round candidate interviews.' },
                { n: 'Deel',           s: 'deel',       c: '0033FF', desc: 'Global contractor compliance and on-time payroll in 150+ countries.' },
                { n: '1Password',      s: '1password',  c: '0572EC', desc: 'Shared vaults for credentials and secrets — zero-trust by default for augmented staff.' },
            ]}
            hideProjects={true}
            hideTestimonial={true}
            showClients={true}
            clientsPill="Trusted By Engineering Leaders"
            clientsHeading="From Series-A Startups to Fortune 500 Engineering,"
            clientsHeadingHighlight="Our Augmented Talent Ships Production Code"
            extraSections={
                <>
                    <VettingFunnel />
                    <HiringSprint />
                </>
            }
            googleReviews={[
                {
                    name: 'Theo Marston',
                    role: 'CTO, Bluemark Ventures',
                    rating: 5,
                    date: '2 months ago',
                    text: 'A senior React engineer in our Slack within five working days of the brief. They had merged a PR by day seven and were leading the next sprint by week three. We have honestly stopped trying to recruit ourselves.',
                },
                {
                    name: 'Hana Watanabe',
                    role: 'VP Engineering, Skylift Robotics',
                    rating: 5,
                    date: '4 months ago',
                    text: 'We needed a Kotlin specialist for two months. They sourced, vetted, and onboarded one in eight days. The replacement guarantee never came up — the first match was the right one.',
                },
                {
                    name: 'Diego Salazar',
                    role: 'Head of Platform, GridForge',
                    rating: 5,
                    date: '6 months ago',
                    text: 'Three augmented DevOps engineers embedded for nine months. They knew Terraform and our AWS account better than half my full-time team by month two. On-call quality went up immediately.',
                },
                {
                    name: 'Yara Khalil',
                    role: 'Engineering Manager, Bristol Forge',
                    rating: 5,
                    date: '3 months ago',
                    text: 'The vetting funnel is real. Every candidate they sent had cleared their own coding rounds — interviewing felt like checking culture fit, not skills. Saved us probably 40 hours of recruiter time per hire.',
                },
                {
                    name: 'Anders Bergstrom',
                    role: 'Founder, Northwave Labs',
                    rating: 5,
                    date: '5 months ago',
                    text: 'Two senior full-stack engineers and an AI/ML lead, all from Dawki, all up-and-shipping in their first sprint. We will be augmenting through them as long as we are scaling — it is a massive unlock for a Series-A team.',
                },
                {
                    name: 'Catherine Lefevre',
                    role: 'Director of Engineering, Pulsemark Health',
                    rating: 5,
                    date: '7 months ago',
                    text: 'They moved a senior backend hire from brief to first deploy in nine days. Our internal recruiter took six months on the previous backfill. The math just works.',
                },
            ]}
            googleReviewsHeading="What Engineering Leaders Say About Our Augmented Talent"
            googleReviewsSubtitle="Verified reviews from CTOs, VPs of Engineering, and engineering managers we've embedded specialists with."
            faqs={[
                { q: 'What is staff augmentation?',
                  a: 'Staff augmentation adds vetted senior specialists to your team on a flexible basis — they work under your direction, in your tools, alongside your team.' },
                { q: 'How is this different from a dedicated team?',
                  a: 'Staff augmentation typically adds individuals to an existing team. Dedicated teams are larger, often cross-functional units that operate as a self-contained pod.' },
                { q: 'How fast can someone start?',
                  a: 'Vetted candidates are typically presented in 3–5 days. Engineers usually start within 1–2 weeks of selection — sometimes within 7 days end-to-end.' },
                { q: 'How do you vet candidates?',
                  a: 'Six layers — AI-assisted resume + skill graph screening, live coding, system design, behavioural, reference checks, and background verification. Less than 5% of our network passes all six.' },
                { q: 'Can we interview the candidates?',
                  a: 'Yes. Final hiring decisions are always yours — we shortlist, you choose. Up to 3 client rounds covered.' },
                { q: 'What if the engineer isn\'t the right fit?',
                  a: 'We offer a replacement guarantee. If the match doesn\'t work in the first 30 days, we replace at no cost — we own the match.' },
                { q: 'Do augmented staff work in our time zone?',
                  a: 'Yes. We provide engineers in your time zone or with daily overlap windows that match your standup, demo, and on-call rituals.' },
                { q: 'Can we hire them full-time later?',
                  a: 'Yes. We offer transparent conversion paths if you decide to hire someone full-time after a successful engagement.' },
                { q: 'How do you protect our IP and data?',
                  a: 'Pre-signed NDAs, IP-transfer language in every contract, least-privilege access via Okta + 1Password, and SOC 2 / ISO 27001-aligned controls.' },
            ]}
        />
    );
}
