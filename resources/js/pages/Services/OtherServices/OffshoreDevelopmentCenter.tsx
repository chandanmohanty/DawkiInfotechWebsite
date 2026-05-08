import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ServicePageTemplate, { ICON } from '@/components/ServicePageTemplate';

/* ===========================================================================
 * Section 1: Roles Inside Your ODC — what an offshore development center
 * looks like staffed up. Each card = a role you'd embed in your center,
 * with their primary stack and what they own end-to-end. No pricing —
 * just the development capabilities you get under one roof.
 * =========================================================================== */
type RoleCard = {
    role: string;
    seniority: string;
    owns: string;
    stack: string[];
    a: string; b: string; glow: string; bg: string; border: string;
    icon: React.ReactNode;
};

const ROLE_CARDS: RoleCard[] = [
    {
        role: 'Frontend Engineers',
        seniority: 'Mid · Senior · Lead',
        owns: 'UI shell, design-system implementation, performance, and accessibility for every customer-facing surface.',
        stack: ['React', 'Next.js', 'TypeScript', 'Tailwind', 'Storybook'],
        a: '#06b6d4', b: '#4f7cff', glow: 'rgba(6, 182, 212, 0.32)',
        bg: 'rgba(6, 182, 212, 0.10)', border: 'rgba(6, 182, 212, 0.30)',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
            </svg>
        ),
    },
    {
        role: 'Backend Engineers',
        seniority: 'Senior · Lead · Staff',
        owns: 'APIs, services, data models, integrations, and the business logic that powers your product.',
        stack: ['Node', 'Python', 'Go', 'PostgreSQL', 'gRPC'],
        a: '#22c55e', b: '#06b6d4', glow: 'rgba(34, 197, 94, 0.32)',
        bg: 'rgba(34, 197, 94, 0.10)', border: 'rgba(34, 197, 94, 0.30)',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M3 5v14a9 3 0 0 0 18 0V5" />
                <path d="M3 12a9 3 0 0 0 18 0" />
            </svg>
        ),
    },
    {
        role: 'DevOps & SRE',
        seniority: 'Senior · Staff',
        owns: 'CI/CD pipelines, Kubernetes, observability, on-call, and the platform every other engineer ships into.',
        stack: ['Kubernetes', 'Terraform', 'AWS', 'ArgoCD', 'Datadog'],
        a: '#a855f7', b: '#ec4899', glow: 'rgba(168, 85, 247, 0.32)',
        bg: 'rgba(168, 85, 247, 0.10)', border: 'rgba(168, 85, 247, 0.30)',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
        ),
    },
    {
        role: 'QA & SDETs',
        seniority: 'Mid · Senior',
        owns: 'Manual test plans, end-to-end automation, performance testing, and the regression net that protects releases.',
        stack: ['Playwright', 'Cypress', 'Appium', 'k6', 'TestRail'],
        a: '#ec4899', b: '#f97316', glow: 'rgba(236, 72, 153, 0.32)',
        bg: 'rgba(236, 72, 153, 0.10)', border: 'rgba(236, 72, 153, 0.30)',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
        ),
    },
    {
        role: 'Engineering Managers',
        seniority: 'Senior · Lead',
        owns: 'Team health, delivery cadence, hiring, performance reviews, and the runway between roadmap and production.',
        stack: ['Agile', 'OKRs', 'Linear', 'Notion', '1:1 coaching'],
        a: '#f97316', b: '#fbbf24', glow: 'rgba(249, 115, 22, 0.32)',
        bg: 'rgba(249, 115, 22, 0.10)', border: 'rgba(249, 115, 22, 0.30)',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
    },
    {
        role: 'Product Designers',
        seniority: 'Senior · Lead',
        owns: 'Discovery research, wireframes, design-system tokens, and the polished surfaces engineers turn into product.',
        stack: ['Figma', 'Tokens', 'A/B Testing', 'User Research', 'Storybook'],
        a: '#4f7cff', b: '#a855f7', glow: 'rgba(79, 124, 255, 0.32)',
        bg: 'rgba(79, 124, 255, 0.10)', border: 'rgba(79, 124, 255, 0.30)',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
                <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
                <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
                <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125 0-.93.776-1.687 1.687-1.687h1.875A5.5 5.5 0 0 0 22 10.5C22 5.81 17.52 2 12 2z" />
            </svg>
        ),
    },
];

const RolesInsideOdc: React.FC = () => (
    <section className="dawki-odc-cost">
        <div className="container">
            <div className="dawki-odc-cost-heading">
                <span className="dawki-odc-cost-pill">
                    <span></span>
                    Roles Inside Your ODC
                </span>
                <h2 className="dawki-odc-cost-title">
                    Every Role Your Roadmap Needs, <span>Under One Roof</span>
                </h2>
                <p className="dawki-odc-cost-subtitle">
                    A typical Dawki offshore development center isn't just engineers — it's a full delivery org. Here's the talent we staff into your branded center.
                </p>
            </div>

            <motion.div
                className="dawki-odc-cost-grid"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
                }}
            >
                {ROLE_CARDS.map((r) => (
                    <motion.article
                        key={r.role}
                        className="dawki-odc-cost-card"
                        style={{
                            ['--cc-a' as string]: r.a,
                            ['--cc-b' as string]: r.b,
                            ['--cc-glow' as string]: r.glow,
                            ['--cc-bg' as string]: r.bg,
                            ['--cc-border' as string]: r.border,
                        }}
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] } },
                        }}
                    >
                        <div className="dawki-odc-role-head">
                            <span className="dawki-odc-role-icon">{r.icon}</span>
                            <div>
                                <div className="dawki-odc-cost-card-role">{r.role}</div>
                                <span className="dawki-odc-role-seniority">{r.seniority}</span>
                            </div>
                        </div>
                        <p className="dawki-odc-role-owns">{r.owns}</p>
                        <div className="dawki-odc-role-stack">
                            {r.stack.map((s) => (
                                <span key={s} className="dawki-odc-role-tag">{s}</span>
                            ))}
                        </div>
                    </motion.article>
                ))}
            </motion.div>
        </div>
    </section>
);

/* ===========================================================================
 * Section 2: Setup Sprint — week-by-week timeline from kickoff to operations
 * =========================================================================== */
type Phase = {
    label: string;
    sub: string;
    title: string;
    titleSub: string;
    a: string; b: string; glow: string; dotColor: string;
    days: { num: string; title: string; desc: string }[];
};

const PHASES: Phase[] = [
    {
        label: 'Week 1–2',
        sub: 'Plan',
        title: 'Strategy & Location',
        titleSub: 'Operating model · location · roadmap signed off',
        a: '#06b6d4', b: '#4f7cff', glow: 'rgba(6, 182, 212, 0.45)', dotColor: '#06b6d4',
        days: [
            { num: 'Day 1',  title: 'Kickoff & business goals',         desc: 'Founders + execs walk us through the 12-month roadmap, team size, and ODC objectives.' },
            { num: 'Day 4',  title: 'Location & legal entity recommended', desc: 'India, Eastern Europe, or LATAM — chosen on talent depth, time-zone fit, and cost.' },
            { num: 'Day 7',  title: 'Org chart & hiring plan',           desc: 'Roles, seniority mix, ratios (eng / QA / design / PM), and quarterly ramp curve agreed.' },
            { num: 'Day 12', title: 'Master services agreement signed',  desc: 'MSA, NDA, IP transfer, and SLA all signed. Engagement officially live.' },
        ],
    },
    {
        label: 'Week 3–6',
        sub: 'Stand Up',
        title: 'Hire & Build the Office',
        titleSub: 'Talent acquisition · workspace · IT · security baseline',
        a: '#a855f7', b: '#ec4899', glow: 'rgba(168, 85, 247, 0.45)', dotColor: '#a855f7',
        days: [
            { num: 'Wk 3', title: 'First 6 hires shortlisted',        desc: 'Hand-picked seniors from our 8,000-engineer talent network — not job-board sourced.' },
            { num: 'Wk 4', title: 'Branded office leased & wired',    desc: 'Dedicated floor, your logo on the door, gigabit fiber, security cameras, biometric access.' },
            { num: 'Wk 5', title: 'Devices, identity & VPN provisioned', desc: 'MacBooks, Okta SSO, your VPN, 1Password vaults — engineers walk in to a fully-set-up desk.' },
            { num: 'Wk 6', title: 'Day-one onboarding & access audit', desc: 'New hires get codebase walkthrough, runbooks, and least-privilege access to prod systems.' },
        ],
    },
    {
        label: 'Month 2–3',
        sub: 'Operate',
        title: 'Steady-State Delivery',
        titleSub: 'Sprints shipping · KPIs in green · scaling on demand',
        a: '#22c55e', b: '#06b6d4', glow: 'rgba(34, 197, 94, 0.45)', dotColor: '#22c55e',
        days: [
            { num: 'Mo 2', title: 'First production releases shipped',   desc: 'Two-week sprints. Friday demos. Real customer-visible features merged from the ODC.' },
            { num: 'Mo 2', title: 'Engagement & retention rituals live', desc: '1:1s, learning budgets, hackathons, quarterly bonuses — built so attrition stays under 8%.' },
            { num: 'Mo 3', title: 'Quarterly business review with you',  desc: 'Velocity, bug rates, team NPS, attrition, and cost-per-output reviewed openly with execs.' },
            { num: 'Mo 3', title: 'Scale plan for next quarter signed',  desc: 'Add roles, rotate skills, or scale down — flex pricing baked into the contract.' },
        ],
    },
];

const SetupSprint: React.FC = () => (
    <section className="dawki-ddt-sprint">
        <div className="container">
            <div className="dawki-ddt-sprint-heading">
                <span className="dawki-ddt-sprint-pill">
                    <span></span>
                    ODC Setup Timeline
                </span>
                <h2 className="dawki-ddt-sprint-title">
                    From Kickoff to a Running Center <span>In Under 90 Days</span>
                </h2>
                <p className="dawki-ddt-sprint-subtitle">
                    No three-quarter deliberation. Three months from contract signing to your branded ODC shipping production code with senior engineers behind biometric doors.
                </p>
            </div>

            <motion.div
                className="dawki-ddt-sprint-frame"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
            >
                {PHASES.map((phase, pi) => (
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
                                    key={day.num}
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
export default function OffshoreDevelopmentCenter() {
    return (
        <ServicePageTemplate
            pageTitle="Offshore Development Center"
            breadcrumbCategory="Other Services"
            heroPill="Other Services"
            heroTitleStart="Offshore"
            heroTitleHighlight="Development Center"
            heroSubtitle="Build your own offshore engineering hub — with hand-picked talent, dedicated infrastructure, and full operational support."
            heroVideoSrc="/assets/images/header/demo/dedicated-development-teams.mp4"
            featuresPill="Your Offshore Hub"
            featuresTitleStart="A Branded Engineering Center"
            featuresTitleHighlight="Without the Overhead"
            featuresSubtitle="From a single team to a 100+ engineer center — we set up, staff, and operate offshore development centers that feel like your own office."
            features={[
                { title: 'Cost-Effective Scale', desc: 'Up to 60% cost savings vs onshore hiring while keeping quality high.', icon: '💰' },
                { title: 'Dedicated Workspace', desc: 'Branded, secure, and fully outfitted offices reserved for your team.', icon: '🏢' },
                { title: 'Hand-Picked Talent', desc: 'Senior engineers, PMs, designers, and QA matched to your stack and culture.', icon: '🎓' },
                { title: 'IP & Data Security', desc: 'Enterprise-grade security, compliance, and IP protection by default.', icon: '🛡️' },
                { title: 'Full Operational Support', desc: 'Recruiting, HR, payroll, IT, and admin — all handled for you.', icon: '⚙️' },
                { title: 'Time-Zone Overlap', desc: 'Work hours arranged for daily overlap with your headquarters.', icon: '🌍' },
            ]}
            processSteps={[
                { n: '01', t: 'Plan',         d: 'Define team composition, location, infrastructure, and governance model.' },
                { n: '02', t: 'Staff',        d: 'Recruit and onboard engineers, designers, QA, PMs, and managers.' },
                { n: '03', t: 'Stand Up',     d: 'Set up office, security, tooling, processes, and IT infrastructure.' },
                { n: '04', t: 'Operate & Grow', d: 'Run day-to-day operations, scale, and continuously optimize the center.' },
            ]}
            servicesPill="Our Capabilities"
            servicesTitleStart="Offshore Development Center"
            servicesTitleHighlight="Services We Offer"
            servicesSubtitle="End-to-end ODC setup and operations — including talent, infrastructure, and management."
            servicesLayout="timeline"
            serviceCards={[
                { title: 'ODC Strategy & Planning',     desc: 'Right-size team, location, and operating model to your business goals.', icon: ICON.target },
                { title: 'Talent Acquisition',          desc: 'Recruit senior engineers, PMs, designers, QA, and managers with rigorous screening.', icon: ICON.users },
                { title: 'Infrastructure Setup',        desc: 'Office, network, security, devices, and licenses — production-ready from day one.', icon: ICON.cog },
                { title: 'Engineering Center',          desc: 'Frontend, backend, mobile, DevOps, AI/ML engineering capabilities under one roof.', icon: ICON.code },
                { title: 'QA & Testing Center',         desc: 'Manual + automation QA hub with device labs and load-testing infra.', icon: ICON.check },
                { title: 'Design & Research Hub',       desc: 'Senior product designers, researchers, and content designers.', icon: ICON.palette },
                { title: 'Data & AI Center',            desc: 'Data engineering, BI, and AI/ML talent in a dedicated capability hub.', icon: ICON.database },
                { title: 'Project Management & Delivery', desc: 'PMs, engineering managers, and delivery leads who own outcomes.', icon: ICON.headset },
                { title: 'IT & DevOps Support',         desc: 'Internal IT, identity, and DevOps to keep the center running 24/7.', icon: ICON.cloud },
                { title: 'Compliance & Security',       desc: 'ISO 27001, SOC 2, GDPR, HIPAA-ready operations and policies.', icon: ICON.shield },
                { title: 'HR & Operations',             desc: 'Recruiting, onboarding, payroll, benefits, and engagement programs.', icon: ICON.box },
                { title: 'Continuous Optimization',     desc: 'Quarterly reviews on cost, velocity, quality, and team satisfaction.', icon: ICON.refresh },
            ]}
            toolsTitleStart="Operations Stack &"
            toolsTitleHighlight="Tools That Run Your Center"
            toolsSubtitle="Modern, enterprise-grade tooling that runs every Dawki ODC — talent, finance, security, and delivery — all integrated and audit-ready."
            toolsLayout="vertical"
            tools={[
                { n: 'Workday',      s: 'workday',      c: 'F38B00', desc: 'Core HRIS for the offshore center — payroll, benefits, performance, and employee records.' },
                { n: 'BambooHR',     s: 'bamboohr',     c: '78BE20', desc: 'Lightweight HRIS option for sub-50 person centers — onboarding workflows and time-off tracking.' },
                { n: 'Greenhouse',   s: 'greenhouse',   c: '24A47F', desc: 'Recruiting + ATS — every candidate scorecard, interview kit, and offer tracked in one place.' },
                { n: 'Okta',         s: 'okta',         c: '007DC1', desc: 'Single sign-on + identity governance — every engineer gets least-privilege access from day one.' },
                { n: '1Password',    s: '1password',    c: '0572EC', desc: 'Shared vaults for credentials and secrets — secure access without compromising hygiene.' },
                { n: 'Slack',        s: 'slack',        c: '4A154B', desc: 'Daily comms, standups, and async work — every pod ships with shared channels and ChatOps.' },
                { n: 'Zoom',         s: 'zoom',         c: '0B5CFF', desc: 'Standups, demos, executive reviews, and pair-programming sessions across every time zone.' },
                { n: 'Notion',       s: 'notion',       c: '000000', desc: 'Center handbook, runbooks, retros, and team-knowledge — searchable across every engagement.' },
                { n: 'Jira / Linear',s: 'linear',       c: '5E6AD2', desc: 'Sprint planning, issue tracking, and roadmap views — pods adopt your existing tracker.' },
                { n: 'GitHub',       s: 'github',       c: '181717', desc: 'Source control + PR reviews + Actions CI — our default for code, with full branch hygiene.' },
                { n: 'Figma',        s: 'figma',        c: 'F24E1E', desc: 'Designer + engineer collaboration — multiplayer canvases, design tokens, Dev Mode handoff.' },
                { n: 'Datadog',      s: 'datadog',      c: '632CA6', desc: 'Unified observability — APM, logs, dashboards, and alerts running across the ODC.' },
                { n: 'Vanta',        s: 'vanta',        c: '6651F1', desc: 'Continuous compliance monitoring for SOC 2, ISO 27001, GDPR, and HIPAA evidence.' },
                { n: 'Deel',         s: 'deel',         c: '0033FF', desc: 'Global payroll + contractor compliance — every paycheque on time, in local currency.' },
                { n: 'Intercom',     s: 'intercom',     c: '0057FF', desc: 'Internal helpdesk for the ODC — IT tickets, HR requests, and employee FAQs.' },
                { n: 'Power BI',     s: 'powerbi',      c: 'F2C811', desc: 'Operations dashboards — capacity, utilization, billing, and cost-per-output reported monthly.' },
            ]}
            hideProjects={true}
            hideTestimonial={true}
            showClients={true}
            clientsPill="Trusted By Global Engineering Leaders"
            clientsHeading="From Series-B Startups to Fortune 500 Engineering,"
            clientsHeadingHighlight="Our ODCs Run Their Roadmaps"
            extraSections={
                <>
                    <RolesInsideOdc />
                    <SetupSprint />
                </>
            }
            googleReviews={[
                {
                    name: 'Marcus Holloway',
                    role: 'CTO, Northwind Logistics',
                    rating: 5,
                    date: '2 months ago',
                    text: 'We stood up a 22-person ODC in 11 weeks. Branded floor, biometric access, our identity provider, and engineers shipping into our main repo by week 7. Costs us 55% of what the same team would have run in Austin.',
                },
                {
                    name: 'Sofia Karlsson',
                    role: 'VP Engineering, Atlasframe',
                    rating: 5,
                    date: '4 months ago',
                    text: 'The recruiting bar at the ODC matches what we hold internally — and the time-to-hire is half. Three full pods, zero attrition in the first year, and KPIs reviewed openly every quarter with our exec team.',
                },
                {
                    name: 'Daniel Whitford',
                    role: 'COO, Riverline Health',
                    rating: 5,
                    date: '6 months ago',
                    text: 'HIPAA was the make-or-break for us. Their compliance team had the BAA, training, and access controls in place before the first engineer was hired. Audit went clean on the first pass.',
                },
                {
                    name: 'Aanya Bhattacharya',
                    role: 'Head of Platform, Verdant Mobility',
                    rating: 5,
                    date: '3 months ago',
                    text: 'Scaled the ODC from 8 to 31 engineers over two quarters. Quality stayed senior, demos kept shipping, and the cost-per-deploy graph went down month over month. Genuinely the best vendor relationship we have.',
                },
                {
                    name: 'Henrique Almeida',
                    role: 'Founder & CTO, BrightLayer',
                    rating: 5,
                    date: '5 months ago',
                    text: 'I visited the office last quarter — branded the way you would expect a Series-B startup HQ to look. Our engineers there know my roadmap better than half my US team. That is what I am paying for.',
                },
                {
                    name: 'Elise Townsend',
                    role: 'Director of Engineering, Strato Cloud',
                    rating: 5,
                    date: '7 months ago',
                    text: 'They handle payroll, benefits, attrition, recruiting, and IT — all I see is a running center with shipping code and a single monthly invoice. That is the entire pitch and they actually deliver it.',
                },
            ]}
            googleReviewsHeading="What ODC Owners Say About Working With Us"
            googleReviewsSubtitle="Verified reviews from CTOs, COOs, and VPs of Engineering whose offshore centers we set up and operate."
            faqs={[
                { q: 'What is an offshore development center (ODC)?',
                  a: 'An ODC is a dedicated, long-term offshore team that operates as your own remote office — branded, staffed, and supported but located in a lower-cost geography.' },
                { q: 'How is an ODC different from outsourcing?',
                  a: 'Outsourcing is project-based and usually shared. An ODC is dedicated, long-term, and works exclusively for you with full alignment to your processes and culture.' },
                { q: 'How much can we save with an ODC?',
                  a: 'Most clients see 40–60% cost reduction vs onshore hiring, with comparable or better engineering quality.' },
                { q: 'Where can the ODC be located?',
                  a: 'Our delivery hubs include India and other strategic geographies. We help choose based on cost, talent depth, and time-zone fit.' },
                { q: 'Do we own the IP?',
                  a: 'Yes. All code, data, and IP belong to you, with strict NDAs and security controls protecting it.' },
                { q: 'How long does ODC setup take?',
                  a: 'A small team can be up and running in 6–10 weeks. Larger centers (50+ engineers) typically scale over 4–9 months.' },
                { q: 'Can we visit the ODC?',
                  a: 'Absolutely. We encourage executive visits and even on-site rotations to build trust and team cohesion.' },
                { q: 'What about compliance — SOC 2, ISO 27001, HIPAA?',
                  a: 'Built in from day one. Vanta-monitored controls, annual audits, and pre-signed BAAs for healthcare engagements.' },
                { q: 'How do you keep attrition low?',
                  a: 'Senior pay bands, learning budgets, clear career ladders, equity-style retention bonuses, and engagement rituals — average ODC attrition stays under 8% annually.' },
            ]}
        />
    );
}
