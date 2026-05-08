import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import ServicePageTemplate, { ICON } from '@/components/ServicePageTemplate';

/* ===========================================================================
 * Section 1: Live Lesson Player — animated LMS lesson mockup with video
 * preview, chapter list with auto-progressing checks, and an AI tutor chat
 * bubble. Visually unique to this page.
 * =========================================================================== */
const LIVE_CHAPTERS = [
    { t: 'Welcome & syllabus',         dur: '04:12' },
    { t: 'Vector spaces — intuition',  dur: '12:48' },
    { t: 'Linear maps & matrices',     dur: '18:30' },
    { t: 'Eigenvalues & eigenvectors', dur: '22:14' },
    { t: 'Application: PCA in practice', dur: '15:06' },
    { t: 'Quiz — concepts checkpoint', dur: 'Quiz' },
];

const LessonPlayer: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });
    const [active, setActive] = useState(2);    // currently-playing chapter
    const [progress, setProgress] = useState(0); // 0-100 within active chapter

    /* Auto-progress the active chapter once visible — feels "live" without
     * being heavy. Advances ~1% every 80ms, hops to next chapter at 100. */
    useEffect(() => {
        if (!inView) return;
        const id = setInterval(() => {
            setProgress((p) => {
                if (p >= 100) {
                    setActive((a) => Math.min(LIVE_CHAPTERS.length - 1, a + 1));
                    return 0;
                }
                return p + 1;
            });
        }, 80);
        return () => clearInterval(id);
    }, [inView]);

    const overallPct = Math.round(((active + progress / 100) / LIVE_CHAPTERS.length) * 100);

    return (
        <section className="dawki-elearn-player">
            <div className="container">
                <div className="dawki-elearn-player-heading">
                    <span className="dawki-elearn-player-pill">
                        <span></span>
                        Live Lesson Player
                    </span>
                    <h2 className="dawki-elearn-player-title">
                        A Course Experience <span>Learners Actually Finish</span>
                    </h2>
                    <p className="dawki-elearn-player-subtitle">
                        Adaptive video lessons, in-line transcripts, AI tutoring, and quizzes — packaged into one player engineered for completion, not just enrollment.
                    </p>
                </div>

                <motion.div
                    ref={ref}
                    className="dawki-elearn-player-window"
                    initial={{ opacity: 0, y: 30, scale: 0.97 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                >
                    {/* Title bar */}
                    <div className="dawki-elearn-player-titlebar">
                        <span className="dawki-elearn-player-course">
                            COURSE · <strong>Linear Algebra for ML</strong> · Module 3 / 6
                        </span>
                        <span className="dawki-elearn-player-badge">LIVE · {overallPct}% complete</span>
                    </div>

                    <div className="dawki-elearn-player-body">
                        {/* Video stage */}
                        <div className="dawki-elearn-player-stage">
                            <div className="dawki-elearn-player-stage-thumb">
                                {/* Animated mock instructor avatar */}
                                <div className="dawki-elearn-player-avatar">
                                    <span>RS</span>
                                    <em className="dawki-elearn-player-avatar-pulse"></em>
                                </div>
                                <div className="dawki-elearn-player-stage-caption">
                                    <span className="dawki-elearn-player-stage-name">Dr. Riya Sharma</span>
                                    <span className="dawki-elearn-player-stage-title">{LIVE_CHAPTERS[active].t}</span>
                                </div>
                                <button type="button" className="dawki-elearn-player-play" aria-label="Play lesson">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg>
                                </button>
                            </div>
                            <div className="dawki-elearn-player-progress">
                                <div className="dawki-elearn-player-progress-fill" style={{ width: `${progress}%` }} />
                                <span className="dawki-elearn-player-time">
                                    {String(Math.floor((progress / 100) * 18)).padStart(2, '0')}:{String(Math.floor(((progress / 100) * 18 * 60) % 60)).padStart(2, '0')} / 18:30
                                </span>
                            </div>

                            {/* AI tutor bubble */}
                            <div className="dawki-elearn-player-tutor">
                                <span className="dawki-elearn-player-tutor-icon">✦</span>
                                <div>
                                    <strong>AI Tutor</strong>
                                    <p>"Quick check — given the matrix above, what would the determinant be? Tap to ask."</p>
                                </div>
                            </div>
                        </div>

                        {/* Chapter list */}
                        <aside className="dawki-elearn-player-chapters">
                            <div className="dawki-elearn-player-chapters-head">
                                <span>Module Chapters</span>
                                <span className="dawki-elearn-player-chapters-count">{LIVE_CHAPTERS.length} lessons</span>
                            </div>
                            <ul>
                                {LIVE_CHAPTERS.map((c, i) => {
                                    const done = i < active;
                                    const current = i === active;
                                    return (
                                        <li key={c.t} className={`${done ? 'is-done' : ''} ${current ? 'is-current' : ''}`}>
                                            <span className="dawki-elearn-player-chap-num">
                                                {done ? (
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                ) : current ? (
                                                    <span className="dawki-elearn-player-chap-pulse"></span>
                                                ) : (
                                                    String(i + 1).padStart(2, '0')
                                                )}
                                            </span>
                                            <div className="dawki-elearn-player-chap-text">
                                                <strong>{c.t}</strong>
                                                <span>{c.dur}</span>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </aside>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

/* ===========================================================================
 * Section 2: Cohort Engagement Dashboard — animated KPI dashboard with a
 * leaderboard and per-cohort completion bars. Visually distinct from the
 * lesson player above.
 * =========================================================================== */
type LearnerRow = { name: string; init: string; pct: number; track: string; a: string; b: string };

const LEARNERS: LearnerRow[] = [
    { name: 'Aarav Sharma',   init: 'AS', pct: 96, track: 'AI / ML',     a: '#5b9eff', b: '#a855f7' },
    { name: 'Priya Patel',    init: 'PP', pct: 91, track: 'Frontend',    a: '#06b6d4', b: '#5b9eff' },
    { name: 'Diego Salazar',  init: 'DS', pct: 88, track: 'Backend',     a: '#22c55e', b: '#06b6d4' },
    { name: 'Mira Saldana',   init: 'MS', pct: 82, track: 'Cloud',       a: '#a855f7', b: '#ec4899' },
    { name: 'Karim Saleh',    init: 'KS', pct: 78, track: 'DevOps',      a: '#f97316', b: '#fbbf24' },
];

const useCount = (target: number, dur = 1800, active = true, suffix = '') => {
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
    return v + suffix;
};

const CohortDashboard: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });
    const enrolled = useCount(12480, 2200, inView);
    const completion = useCount(74, 2000, inView);
    const avgScore = useCount(86, 2200, inView);

    return (
        <section className="dawki-elearn-cohort">
            <div className="container">
                <div className="dawki-elearn-cohort-heading">
                    <span className="dawki-elearn-cohort-pill">
                        <span></span>
                        Cohort Analytics
                    </span>
                    <h2 className="dawki-elearn-cohort-title">
                        Live Engagement <span>Across Every Cohort</span>
                    </h2>
                    <p className="dawki-elearn-cohort-subtitle">
                        The same dashboard our customers use to track learner progress, completion rates, and engagement — built into every Dawki LMS.
                    </p>
                </div>

                <motion.div
                    ref={ref}
                    className="dawki-elearn-cohort-frame"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                >
                    {/* KPI tiles */}
                    <div className="dawki-elearn-cohort-kpis">
                        <div className="dawki-elearn-cohort-kpi">
                            <span className="dawki-elearn-cohort-kpi-label">Active learners</span>
                            <strong>{enrolled.toLocaleString('en-US')}</strong>
                            <em>↑ 14% MoM</em>
                        </div>
                        <div className="dawki-elearn-cohort-kpi">
                            <span className="dawki-elearn-cohort-kpi-label">Completion rate</span>
                            <strong>{completion}<i>%</i></strong>
                            <em>↑ 9 pts vs benchmark</em>
                        </div>
                        <div className="dawki-elearn-cohort-kpi">
                            <span className="dawki-elearn-cohort-kpi-label">Avg quiz score</span>
                            <strong>{avgScore}<i>%</i></strong>
                            <em>SCORM + xAPI tracked</em>
                        </div>
                    </div>

                    <div className="dawki-elearn-cohort-grid">
                        {/* Per-cohort completion bar chart */}
                        <div className="dawki-elearn-cohort-chart">
                            <div className="dawki-elearn-cohort-chart-head">
                                <span>Completion by cohort</span>
                                <span className="dawki-elearn-cohort-chart-legend">
                                    <i style={{ background: 'linear-gradient(180deg, #5b9eff, #a855f7)' }}></i>
                                    enrolled → completed
                                </span>
                            </div>
                            <div className="dawki-elearn-cohort-bars">
                                {[
                                    { label: 'Q1 ’24', pct: 68 },
                                    { label: 'Q2 ’24', pct: 72 },
                                    { label: 'Q3 ’24', pct: 81 },
                                    { label: 'Q4 ’24', pct: 76 },
                                    { label: 'Q1 ’25', pct: 88 },
                                    { label: 'Q2 ’25', pct: 92 },
                                ].map((d, i) => (
                                    <div key={d.label} className="dawki-elearn-cohort-bar">
                                        <motion.span
                                            className="dawki-elearn-cohort-bar-fill"
                                            initial={{ height: 0 }}
                                            whileInView={{ height: `${d.pct}%` }}
                                            viewport={{ once: true, margin: '-80px' }}
                                            transition={{ duration: 1.0, ease: [0.2, 0.8, 0.2, 1], delay: 0.3 + i * 0.08 }}
                                        >
                                            <em>{d.pct}%</em>
                                        </motion.span>
                                        <span className="dawki-elearn-cohort-bar-label">{d.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Leaderboard */}
                        <div className="dawki-elearn-cohort-leader">
                            <div className="dawki-elearn-cohort-leader-head">
                                <span>Top learners — Module 3</span>
                                <span className="dawki-elearn-cohort-live"><i></i>LIVE</span>
                            </div>
                            <ul>
                                {LEARNERS.map((r, i) => (
                                    <motion.li
                                        key={r.name}
                                        initial={{ opacity: 0, x: 16 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, margin: '-60px' }}
                                        transition={{ duration: 0.45, delay: 0.4 + i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
                                    >
                                        <span className="dawki-elearn-cohort-rank">#{i + 1}</span>
                                        <span
                                            className="dawki-elearn-cohort-avatar"
                                            style={{ background: `linear-gradient(135deg, ${r.a}, ${r.b})` }}
                                        >
                                            {r.init}
                                        </span>
                                        <div className="dawki-elearn-cohort-leader-meta">
                                            <strong>{r.name}</strong>
                                            <span>{r.track}</span>
                                        </div>
                                        <div className="dawki-elearn-cohort-leader-pct">
                                            <motion.span
                                                style={{ background: `linear-gradient(90deg, ${r.a}, ${r.b})` }}
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${r.pct}%` }}
                                                viewport={{ once: true, margin: '-60px' }}
                                                transition={{ duration: 1.0, delay: 0.5 + i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
                                            />
                                            <em>{r.pct}%</em>
                                        </div>
                                    </motion.li>
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
 * Page
 * =========================================================================== */
export default function ELearningSolutions() {
    return (
        <ServicePageTemplate
            pageTitle="eLearning Solutions"
            breadcrumbCategory="Industries"
            heroPill="Industries"
            heroTitleStart="eLearning"
            heroTitleHighlight="Solutions & Platforms"
            heroSubtitle="Learning management systems, course platforms, AI-tutored experiences, and live-class infrastructure — engineered for K-12, EdTech, and corporate training."
            heroVideoSrc="/assets/images/header/demo/e_learning.mp4"
            featuresPill="Education Engineering"
            featuresTitleStart="Learning Software That"
            featuresTitleHighlight="Drives Real Outcomes"
            featuresSubtitle="From a coaching app for 200 students to a multi-tenant LMS serving millions — we ship eLearning platforms that learners actually finish."
            features={[
                { title: 'AI-Tutored Learning', desc: 'GPT-4 + Claude tutors, adaptive paths, and personalised practice for every learner.', icon: '🤖' },
                { title: 'SCORM & xAPI',         desc: 'Industry-standard course packaging — tracking compatible with every modern LMS.',           icon: '📦' },
                { title: 'Live Class Tooling',   desc: 'Zoom, BigBlueButton, and self-hosted WebRTC for live cohort and 1-1 sessions.',              icon: '🎥' },
                { title: 'Adaptive Assessments', desc: 'Item-response-theory (IRT) and AI-generated quizzes that recalibrate to each learner.',      icon: '📝' },
                { title: 'Multi-Tenant LMS',     desc: 'White-label tenancy for B2B sales — separate branding, content, and reporting per client.',  icon: '🏫' },
                { title: 'Outcomes Analytics',   desc: 'Cohort dashboards, completion funnels, and learning-effectiveness reports.',                 icon: '📊' },
            ]}
            processSteps={[
                { n: '01', t: 'Discovery',         d: 'Map learner personas, content model, devices, and success outcomes (completion, mastery, NPS).' },
                { n: '02', t: 'Architecture',      d: 'LMS choice, video pipeline, AI integration, SCORM/xAPI, and multi-tenant data model.' },
                { n: '03', t: 'Build',             d: 'Iterative sprints with subject-matter experts and learner usability tests every fortnight.' },
                { n: '04', t: 'Pilot & Scale',     d: 'Cohort pilot, completion tuning, content QA, and a phased rollout to your full audience.' },
            ]}
            servicesPill="Our Capabilities"
            servicesTitleStart="Explore Our Range of"
            servicesTitleHighlight="eLearning Services"
            servicesSubtitle="Learner-facing apps, instructor tools, content authoring, AI tutors, and operations dashboards — across web, mobile, and live classrooms."
            servicesLayout="timeline"
            serviceCards={[
                { title: 'Custom LMS Development',         desc: 'Multi-tenant LMS with courses, cohorts, certificates, payments, and instructor tools — built around your brand.', icon: ICON.box },
                { title: 'AI Tutor & Coach Apps',          desc: 'GPT-4 / Claude-powered tutors with subject-aware grounding, hint scaffolding, and IRT-driven practice.',           icon: ICON.bot },
                { title: 'Course Authoring Tools',         desc: 'Drag-and-drop authoring with H5P interactivity, branching scenarios, video chapters, and SCORM/xAPI export.',      icon: ICON.palette },
                { title: 'Live Class Platforms',           desc: 'Cohort-based live sessions on Zoom, BigBlueButton, or self-hosted WebRTC with breakouts + polls + recordings.',    icon: ICON.headset },
                { title: 'Adaptive Assessment Engine',     desc: 'Item-response-theory engine + AI-generated questions, automated grading, and proctoring integrations.',             icon: ICON.target },
                { title: 'Mobile Learning Apps',           desc: 'iOS + Android apps with offline downloads, push streaks, and habit-formation patterns that boost completion.',     icon: ICON.rocket },
                { title: 'Video Streaming Infrastructure', desc: 'Mux, Cloudflare Stream, or self-hosted HLS — chaptered video, auto-transcripts, and CDN-edge delivery.',           icon: ICON.cloud },
                { title: 'Certification & Badging',        desc: 'Verifiable certificates (PDF + Open Badges + Blockchain), LinkedIn auto-share, and credential APIs.',              icon: ICON.shield },
                { title: 'B2B White-Label LMS',            desc: 'Tenant-isolated content, custom branding, billing, and reporting — built for school districts and enterprises.',  icon: ICON.users },
                { title: 'Engagement & Retention',         desc: 'Streaks, gamification, push, email cadences, and AI nudges that lift active retention 2–3×.',                      icon: ICON.refresh },
                { title: 'Outcomes Analytics',             desc: 'Cohort dashboards, learning-objective coverage, and longitudinal effectiveness reports for principals + L&D.',     icon: ICON.chart },
                { title: 'Accessibility & WCAG',           desc: 'WCAG 2.2 AA compliant flows, screen-reader QA, captioning + audio-description pipelines.',                          icon: ICON.eye },
            ]}
            toolsTitleStart="EdTech, AI Tutors &"
            toolsTitleHighlight="Authoring Stack"
            toolsSubtitle="The LMS frameworks, AI tutoring stacks, video pipelines, and standards we ship every eLearning engagement on."
            toolsLayout="vertical"
            tools={[
                { n: 'OpenAI / GPT-4',  s: 'openai',         c: '412991', desc: 'AI tutoring + adaptive question generation + grounded curriculum responses for every learner path.' },
                { n: 'Claude',          s: 'anthropic',      c: 'D97757', desc: 'Long-context curriculum analysis, lesson plan drafting, and Socratic tutoring for advanced subjects.' },
                { n: 'ElevenLabs',      s: 'elevenlabs',     c: '000000', desc: 'AI voice cloning + multilingual TTS for instructor narration and accessibility audio.' },
                { n: 'Synthesia',       s: 'synthesia',      c: 'F62B22', desc: 'AI presenter-video generation — instructor avatars in 140+ languages, no studio needed.' },
                { n: 'HeyGen',          s: 'heygen',         c: '7C3AED', desc: 'AI video avatars + lip-synced translations for repurposing courses across markets.' },
                { n: 'OpenAI Whisper',  s: 'openai',         c: '412991', desc: 'Speech-to-text for auto-transcripts, searchable lesson indexes, and live caption pipelines.' },
                { n: 'Hugging Face',    s: 'huggingface',    c: 'FFD21E', desc: 'Custom fine-tuned subject-matter models — domain-specific tutors and content moderators.' },
                { n: 'Moodle',          s: 'moodle',         c: 'FF7A00', desc: 'Open-source LMS — proven foundation for K-12 districts, universities, and large training programs.' },
                { n: 'Canvas LMS',      s: 'instructure',    c: 'E72429', desc: 'Instructure Canvas LTI integrations + Canvas Studio video integrations for higher-ed clients.' },
                { n: 'LearnDash',       s: 'wordpress',      c: '21759B', desc: 'WordPress-based LMS for course-creator businesses — quick to launch, easy to monetise.' },
                { n: 'Articulate Storyline', s: 'articulate',c: '0070C0', desc: 'Industry-standard course authoring — branching scenarios, simulations, SCORM/xAPI export.' },
                { n: 'H5P',             s: 'h5p',            c: 'FFCB05', desc: 'Open interactive content — drag-the-words, hotspots, branching scenarios, embedded in any LMS.' },
                { n: 'SCORM & xAPI',    s: 'scorm',          c: '00609E', desc: 'Industry-standard tracking + interoperability across every modern LMS and analytics warehouse.' },
                { n: 'Mux',             s: 'mux',            c: 'FB2491', desc: 'Video infrastructure for chaptered lessons, auto-transcripts, and per-segment analytics.' },
                { n: 'Cloudflare Stream', s: 'cloudflare',   c: 'F38020', desc: 'Edge-delivered HLS video at scale — strong for global cohorts and live-class recordings.' },
                { n: 'Mixpanel',        s: 'mixpanel',       c: '7856FF', desc: 'Funnel + cohort analytics for completion, drop-off, and habit-formation behaviour modelling.' },
            ]}
            hideProjects={true}
            hideTestimonial={true}
            showClients={true}
            clientsPill="Trusted By EdTech & L&D Leaders"
            clientsHeading="From Coaching Startups to School Districts,"
            clientsHeadingHighlight="We Ship Learning That Lands"
            extraSections={
                <>
                    <LessonPlayer />
                    <CohortDashboard />
                </>
            }
            googleReviews={[
                {
                    name: 'Anika Iyer',
                    role: 'Founder, BrightPath Coaching',
                    rating: 5,
                    date: '2 months ago',
                    text: 'They built our cohort-based JEE-prep platform with AI tutoring + adaptive practice. Completion went from 38% to 71% in one cohort. The product genuinely changed how we coach.',
                },
                {
                    name: 'Marcus Whitford',
                    role: 'Head of L&D, Atlas Manufacturing',
                    rating: 5,
                    date: '4 months ago',
                    text: 'Multi-tenant safety-training LMS for our shop floors across four countries. SCORM + xAPI tracking, in 6 languages with Synthesia avatars. Our compliance audit passed first time.',
                },
                {
                    name: 'Dr. Felix Aguirre',
                    role: 'Director, Northbeam Online Academy',
                    rating: 5,
                    date: '6 months ago',
                    text: 'The AI tutor they built actually scaffolds learners through hard problems instead of just answering them. Our parents love it. So do our auditors when they see the WCAG report.',
                },
                {
                    name: 'Hanna Lindgren',
                    role: 'CTO, Lumen K-12 District',
                    rating: 5,
                    date: '3 months ago',
                    text: 'White-label LMS deployed to 28 schools in our district. Teachers onboarded in two days. Each school owns their content; the district sees the rollup. Vendor lock-in is gone.',
                },
                {
                    name: 'Ravi Bhattacharya',
                    role: 'Founder, CodeCanvas Bootcamp',
                    rating: 5,
                    date: '5 months ago',
                    text: 'Live-class platform with breakouts, code playgrounds, and AI code-review. Our instructors no longer need TAs for first-pass feedback — the AI handles 80% of it.',
                },
                {
                    name: 'Sarah Whitton',
                    role: 'VP Learning, Cipherline SaaS',
                    rating: 5,
                    date: '7 months ago',
                    text: 'Internal product training LMS with adaptive paths per role. Time-to-productivity for new hires dropped from six weeks to nineteen days. Best L&D investment we have made.',
                },
            ]}
            googleReviewsHeading="What EdTech & L&D Leaders Say About Us"
            googleReviewsSubtitle="Verified reviews from founders, L&D directors, and academy leads we've shipped learning platforms with."
            faqs={[
                { q: 'What kind of eLearning platforms do you build?',
                  a: 'Custom LMSs, course-creator marketplaces, AI tutoring apps, live-class platforms, multi-tenant B2B training systems, mobile-first microlearning apps, and corporate L&D portals.' },
                { q: 'Can you integrate AI tutors and adaptive learning?',
                  a: 'Yes. We build GPT-4 / Claude-powered tutors with subject-aware grounding (RAG), Socratic prompting, item-response-theory practice, and AI-generated quizzes — all classroom-safe.' },
                { q: 'Do you support SCORM and xAPI?',
                  a: 'Yes — we package content as SCORM 1.2, SCORM 2004, AICC, and xAPI (Tin Can) so it tracks cleanly in Moodle, Canvas, Blackboard, Workday Learning, Cornerstone, and any modern LMS.' },
                { q: 'Can you white-label the LMS for B2B sales?',
                  a: 'Yes. Multi-tenant architecture with per-tenant branding, content, billing, and reporting — perfect for school districts, training networks, and B2B SaaS sellers.' },
                { q: 'How do you handle live classes and video?',
                  a: 'Zoom, BigBlueButton, or self-hosted WebRTC for live classes; Mux or Cloudflare Stream for recorded video with chapters, auto-transcripts, and CDN delivery.' },
                { q: 'Do you build instructor + admin tooling?',
                  a: 'Yes — full author studios, gradebooks, attendance, communication tools, payment dashboards, and finance reports built alongside the learner experience.' },
                { q: 'How long does an eLearning platform take to build?',
                  a: 'A focused MVP (course player + payments + admin) typically ships in 12–16 weeks. A full multi-tenant LMS with AI tutoring + analytics runs 6–12 months.' },
                { q: 'Do you handle WCAG accessibility?',
                  a: 'Yes — WCAG 2.2 AA compliance built in, plus automated + manual screen-reader QA, captioning pipelines, and audio-description for video where required.' },
            ]}
        />
    );
}
