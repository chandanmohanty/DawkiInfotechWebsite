import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ServicePageTemplate, { ICON } from '@/components/ServicePageTemplate';

/* ===========================================================================
 * Section 1: Design Process Journey — horizontal flow with traveling orb
 * =========================================================================== */
const JOURNEY_STAGES = [
    {
        num: '01',
        name: 'Discover',
        output: 'Stakeholder interviews, surveys, competitive teardown',
        tag: 'Research',
        a: '#ec4899', b: '#f97316', glow: 'rgba(236, 72, 153, 0.55)',
        tagBg: 'rgba(236, 72, 153, 0.10)', tagBorder: 'rgba(236, 72, 153, 0.30)', tagColor: '#fbcfe8',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
        ),
    },
    {
        num: '02',
        name: 'Define',
        output: 'Personas, journey maps, problem statement, IA',
        tag: 'Strategy',
        a: '#a855f7', b: '#ec4899', glow: 'rgba(168, 85, 247, 0.55)',
        tagBg: 'rgba(168, 85, 247, 0.10)', tagBorder: 'rgba(168, 85, 247, 0.30)', tagColor: '#d8b4fe',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
            </svg>
        ),
    },
    {
        num: '03',
        name: 'Design',
        output: 'Wireframes, high-fidelity mockups, prototypes',
        tag: 'Creation',
        a: '#6366f1', b: '#a855f7', glow: 'rgba(99, 102, 241, 0.55)',
        tagBg: 'rgba(99, 102, 241, 0.12)', tagBorder: 'rgba(99, 102, 241, 0.32)', tagColor: '#c7d2fe',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="13.5" cy="6.5" r="2.5" />
                <circle cx="19" cy="13" r="2.5" />
                <circle cx="6" cy="12" r="2.5" />
                <circle cx="10" cy="20" r="2.5" />
                <path d="M12 22a10 10 0 1 1 10-10 4 4 0 0 1-4 4h-2.5a2.5 2.5 0 0 0 0 5 .5.5 0 0 1 .5.5V22" />
            </svg>
        ),
    },
    {
        num: '04',
        name: 'Validate',
        output: 'Usability tests, A/B trials, accessibility audit',
        tag: 'Testing',
        a: '#06b6d4', b: '#4f7cff', glow: 'rgba(6, 182, 212, 0.55)',
        tagBg: 'rgba(6, 182, 212, 0.12)', tagBorder: 'rgba(6, 182, 212, 0.32)', tagColor: '#67e8f9',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
        ),
    },
    {
        num: '05',
        name: 'Handoff',
        output: 'Specs, design tokens, Figma + Storybook libraries',
        tag: 'Delivery',
        a: '#22c55e', b: '#06b6d4', glow: 'rgba(34, 197, 94, 0.55)',
        tagBg: 'rgba(34, 197, 94, 0.12)', tagBorder: 'rgba(34, 197, 94, 0.32)', tagColor: '#86efac',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
            </svg>
        ),
    },
];

const DesignJourney: React.FC = () => (
    <section className="dawki-uxd-journey">
        <div className="container">
            <div className="dawki-uxd-journey-heading">
                <span className="dawki-uxd-journey-pill">
                    <span></span>
                    Our Design Process
                </span>
                <h2 className="dawki-uxd-journey-title">
                    From Insight to Pixel-Perfect <span>Handoff</span>
                </h2>
                <p className="dawki-uxd-journey-subtitle">
                    A repeatable five-stage process that turns research into shippable design — every output reviewed, every deliverable named, every handoff ready for engineering.
                </p>
            </div>

            <div className="dawki-uxd-journey-path">
                <div className="dawki-uxd-journey-track" aria-hidden="true"></div>
                <span className="dawki-uxd-journey-orb" aria-hidden="true"></span>

                {JOURNEY_STAGES.map((s, i) => (
                    <motion.div
                        key={s.num}
                        className="dawki-uxd-journey-stage"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ delay: i * 0.12, duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
                    >
                        <div
                            className="dawki-uxd-journey-node"
                            style={{
                                ['--node-a' as string]: s.a,
                                ['--node-b' as string]: s.b,
                                ['--node-glow' as string]: s.glow,
                            }}
                        >
                            {s.icon}
                            <span className="dawki-uxd-journey-node-num">{s.num}</span>
                        </div>
                        <h3 className="dawki-uxd-journey-stage-name">{s.name}</h3>
                        <p className="dawki-uxd-journey-stage-output">{s.output}</p>
                        <span
                            className="dawki-uxd-journey-stage-tag"
                            style={{
                                ['--tag-bg' as string]: s.tagBg,
                                ['--tag-border' as string]: s.tagBorder,
                                ['--tag-color' as string]: s.tagColor,
                            }}
                        >
                            {s.tag}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

/* ===========================================================================
 * Section 2: Design System Showcase — color tokens, typography, components
 * =========================================================================== */
const TOKEN_COLORS = [
    { hex: '#4F7CFF', label: 'primary' },
    { hex: '#A855F7', label: 'secondary' },
    { hex: '#EC4899', label: 'accent' },
    { hex: '#06B6D4', label: 'info' },
    { hex: '#22C55E', label: 'success' },
    { hex: '#F97316', label: 'warning' },
    { hex: '#0F172A', label: 'slate-900' },
    { hex: '#F8FAFC', label: 'slate-50' },
];

const DesignTokens: React.FC = () => (
    <section className="dawki-uxd-tokens">
        <div className="container">
            <div className="dawki-uxd-tokens-heading">
                <span className="dawki-uxd-tokens-pill">
                    <span></span>
                    Design System
                </span>
                <h2 className="dawki-uxd-tokens-title">
                    Tokens, Typography, <span>And Components</span>
                </h2>
                <p className="dawki-uxd-tokens-subtitle">
                    Every product we ship comes with a versioned design system — the same tokens in Figma and code, no drift between design and engineering.
                </p>
            </div>

            <div className="dawki-uxd-tokens-frame">
                {/* Row 1: Color tokens */}
                <motion.div
                    className="dawki-uxd-tokens-row"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                >
                    <div className="dawki-uxd-tokens-row-label">
                        <span className="dawki-uxd-tokens-row-label-dot"></span>
                        <span className="dawki-uxd-tokens-row-label-text">Color Tokens</span>
                    </div>
                    <motion.div
                        className="dawki-uxd-tokens-colors"
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={{
                            hidden: {},
                            show: { transition: { staggerChildren: 0.05 } },
                        }}
                    >
                        {TOKEN_COLORS.map((c) => (
                            <motion.div
                                key={c.hex}
                                className="dawki-uxd-tokens-color"
                                style={{ ['--swatch' as string]: c.hex }}
                                data-hex={c.hex}
                                variants={{
                                    hidden: { opacity: 0, scale: 0.6 },
                                    show: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: [0.34, 1.56, 0.64, 1] } },
                                }}
                            />
                        ))}
                    </motion.div>
                </motion.div>

                {/* Row 2: Typography */}
                <motion.div
                    className="dawki-uxd-tokens-row"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
                >
                    <div className="dawki-uxd-tokens-row-label">
                        <span className="dawki-uxd-tokens-row-label-dot"></span>
                        <span className="dawki-uxd-tokens-row-label-text">Typography Scale</span>
                    </div>
                    <div className="dawki-uxd-tokens-typo">
                        <div className="dawki-uxd-tokens-typo-row">
                            <span className="dawki-uxd-tokens-typo-text" style={{ fontSize: '40px', lineHeight: 1.1 }}>
                                Display
                            </span>
                            <div className="dawki-uxd-tokens-typo-meta">
                                <span className="dawki-uxd-tokens-typo-meta-item"><strong>40 / 48</strong></span>
                                <span className="dawki-uxd-tokens-typo-meta-item"><strong>700</strong></span>
                            </div>
                        </div>
                        <div className="dawki-uxd-tokens-typo-row">
                            <span className="dawki-uxd-tokens-typo-text" style={{ fontSize: '28px', lineHeight: 1.2 }}>
                                Heading
                            </span>
                            <div className="dawki-uxd-tokens-typo-meta">
                                <span className="dawki-uxd-tokens-typo-meta-item"><strong>28 / 36</strong></span>
                                <span className="dawki-uxd-tokens-typo-meta-item"><strong>700</strong></span>
                            </div>
                        </div>
                        <div className="dawki-uxd-tokens-typo-row">
                            <span className="dawki-uxd-tokens-typo-text" style={{ fontSize: '18px', fontWeight: 600, lineHeight: 1.4 }}>
                                Subheading
                            </span>
                            <div className="dawki-uxd-tokens-typo-meta">
                                <span className="dawki-uxd-tokens-typo-meta-item"><strong>18 / 26</strong></span>
                                <span className="dawki-uxd-tokens-typo-meta-item"><strong>600</strong></span>
                            </div>
                        </div>
                        <div className="dawki-uxd-tokens-typo-row">
                            <span className="dawki-uxd-tokens-typo-text" style={{ fontSize: '14px', fontWeight: 500, lineHeight: 1.6, color: 'rgba(226, 232, 240, 0.8)' }}>
                                Body — keeps reading effortless on screens of every size.
                            </span>
                            <div className="dawki-uxd-tokens-typo-meta">
                                <span className="dawki-uxd-tokens-typo-meta-item"><strong>14 / 22</strong></span>
                                <span className="dawki-uxd-tokens-typo-meta-item"><strong>500</strong></span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Row 3: Components */}
                <motion.div
                    className="dawki-uxd-tokens-row"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                >
                    <div className="dawki-uxd-tokens-row-label">
                        <span className="dawki-uxd-tokens-row-label-dot"></span>
                        <span className="dawki-uxd-tokens-row-label-text">Component Library</span>
                    </div>
                    <div className="dawki-uxd-tokens-components">
                        <div className="dawki-uxd-tokens-comp">
                            <button className="dawki-uxd-tokens-comp-btn" type="button">
                                Primary Button
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                            </button>
                            <span className="dawki-uxd-tokens-comp-label">&lt;Button /&gt;</span>
                        </div>
                        <div className="dawki-uxd-tokens-comp">
                            <span className="dawki-uxd-tokens-comp-badge">Active</span>
                            <span className="dawki-uxd-tokens-comp-label">&lt;Badge /&gt;</span>
                        </div>
                        <div className="dawki-uxd-tokens-comp">
                            <div className="dawki-uxd-tokens-comp-input">name@dawki.com</div>
                            <span className="dawki-uxd-tokens-comp-label">&lt;Input /&gt;</span>
                        </div>
                        <div className="dawki-uxd-tokens-comp">
                            <div className="dawki-uxd-tokens-comp-card">
                                <div className="dawki-uxd-tokens-comp-card-avatar"></div>
                                <div className="dawki-uxd-tokens-comp-card-meta">
                                    <span className="dawki-uxd-tokens-comp-card-line"></span>
                                    <span className="dawki-uxd-tokens-comp-card-line dawki-uxd-tokens-comp-card-line--short"></span>
                                </div>
                            </div>
                            <span className="dawki-uxd-tokens-comp-label">&lt;Card /&gt;</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    </section>
);

/* ===========================================================================
 * Section 3: UI/UX Video Showcase
 * =========================================================================== */
const UiUxVideo: React.FC = () => {
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
                        Inside The Studio
                    </span>
                    <h2 className="dawki-ent-video-title">
                        See How We <span>Design Products That Convert</span>
                    </h2>
                    <p className="dawki-ent-video-subtitle">
                        A behind-the-scenes look at our research, prototyping, and engineering-handoff workflow — from blank Figma canvas to shipped product.
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
export default function ProductUiUxDesign() {
    return (
        <ServicePageTemplate
            pageTitle="Product UI/UX Design"
            breadcrumbCategory="Software Engineering"
            heroPill="Software Engineering"
            heroTitleStart="Product UI/UX"
            heroTitleHighlight="Design"
            heroSubtitle="User-first product design — research-driven, conversion-focused, and ready to hand off to engineers without friction."
            heroVideoSrc="/assets/images/header/demo/uiuxx.mp4"
            featuresPill="Design that Performs"
            featuresTitleStart="Beautiful Products"
            featuresTitleHighlight="That Actually Convert"
            featuresSubtitle="From discovery to high-fidelity prototypes — we craft interfaces that people enjoy and businesses measure."
            features={[
                { title: 'User Research', desc: 'Interviews, surveys, and usability tests that ground design decisions in real evidence.', icon: '🔬' },
                { title: 'Information Architecture', desc: 'Clear structure, intuitive navigation, and content models that scale with the product.', icon: '🗺️' },
                { title: 'Design Systems', desc: 'Reusable tokens, components, and patterns documented for engineering velocity.', icon: '🧩' },
                { title: 'Interaction Prototypes', desc: 'Click-through Figma prototypes that look and feel like the real thing.', icon: '🎬' },
                { title: 'Accessibility (WCAG 2.2 AA)', desc: 'Color, contrast, focus, and semantics audited for inclusive product experiences.', icon: '♿' },
                { title: 'Engineering Handoff', desc: 'Specs, tokens, and component docs ready to drop straight into code.', icon: '🤝' },
            ]}
            processSteps={[
                { n: '01', t: 'Discover', d: 'Stakeholder workshops, user interviews, and competitive analysis.' },
                { n: '02', t: 'Define', d: 'Personas, journeys, IA, and a sharp problem statement.' },
                { n: '03', t: 'Design', d: 'Wireframes → high-fidelity UI → interactive prototypes.' },
                { n: '04', t: 'Validate & Handoff', d: 'Usability tests, iteration, and pixel-perfect dev handoff.' },
            ]}
            servicesPill="Our Capabilities"
            servicesTitleStart="UI/UX Design"
            servicesTitleHighlight="Services We Offer"
            servicesSubtitle="A complete product design practice — research, design, prototyping, systems, and handoff."
            servicesLayout="timeline"
            serviceCards={[
                { title: 'UX Research', desc: 'User interviews, surveys, diary studies, and usability testing — qualitative and quantitative.', icon: ICON.eye },
                { title: 'Product Strategy', desc: 'Vision, principles, north-star metrics, and roadmap alignment with business goals.', icon: ICON.target },
                { title: 'Information Architecture', desc: 'Sitemaps, navigation, content models, and taxonomies designed for findability.', icon: ICON.globe },
                { title: 'Wireframing & Prototyping', desc: 'Low-fidelity wireframes and interactive prototypes for fast feedback loops.', icon: ICON.palette },
                { title: 'UI Design', desc: 'Polished, on-brand visual design across web, mobile, and marketing surfaces.', icon: ICON.box },
                { title: 'Mobile App Design', desc: 'Native iOS and Android UI patterns with motion and micro-interactions.', icon: ICON.rocket },
                { title: 'Web App Design', desc: 'Dashboards, data visualization, and responsive layouts that scale across breakpoints.', icon: ICON.chart },
                { title: 'Design System Development', desc: 'Tokens, components, patterns, and docs in Figma and Storybook for engineering reuse.', icon: ICON.cog },
                { title: 'Usability Testing', desc: 'Moderated and unmoderated tests, heatmaps, and conversion-rate optimization.', icon: ICON.check },
                { title: 'Accessibility Audits', desc: 'WCAG 2.2 AA reviews, remediation roadmaps, and inclusive design coaching.', icon: ICON.shield },
                { title: 'Branding & Visual Identity', desc: 'Logos, color, typography, and brand guidelines that translate to product surfaces.', icon: ICON.palette },
                { title: 'Design Handoff & QA', desc: 'Specs, tokens, prototypes, and engineering QA support through to launch.', icon: ICON.headset },
            ]}
            toolsTitleStart="Languages & Tools"
            toolsTitleHighlight="We Design With"
            toolsSubtitle="A modern design stack — research-grade tools, collaborative canvases, and the front-end frameworks our designs ship into."
            toolsLayout="vertical"
            tools={[
                { n: 'Figma',          s: 'figma',          c: 'F24E1E', desc: 'Our primary design surface — multiplayer wireframes, prototypes, design systems, and Dev Mode handoff.' },
                { n: 'Adobe XD',       s: 'adobexd',        c: 'FF61F6', desc: 'Used for legacy clients and brands that already maintain XD libraries — full export to Figma when needed.' },
                { n: 'Sketch',         s: 'sketch',         c: 'F7B500', desc: 'Lightweight vector editor for icon work and quick visual exploration when teams prefer macOS-native tooling.' },
                { n: 'Adobe Illustrator', s: 'adobeillustrator', c: 'FF9A00', desc: 'Brand identity, logo design, and complex illustrations that need precise vector control.' },
                { n: 'Adobe Photoshop',s: 'adobephotoshop', c: '31A8FF', desc: 'High-fidelity image work, photo retouching, and asset prep for marketing surfaces.' },
                { n: 'Framer',         s: 'framer',         c: '0055FF', desc: 'High-fidelity motion prototypes and interactive design demos that feel like the real product.' },
                { n: 'Protopie',       s: 'protopie',       c: '6F2DBD', desc: 'Sensor-driven and conditional logic prototypes — perfect for native mobile interaction design.' },
                { n: 'InVision',       s: 'invision',       c: 'FF3366', desc: 'Click-through prototypes and design feedback boards — still excellent for stakeholder reviews.' },
                { n: 'Storybook',      s: 'storybook',      c: 'FF4785', desc: 'Component documentation that lives next to the code — every variant, state, and prop demonstrated.' },
                { n: 'Miro',           s: 'miro',           c: 'FFD02F', desc: 'Workshops, journey maps, affinity diagrams, and remote co-design sessions — our default whiteboard.' },
                { n: 'Notion',         s: 'notion',         c: '000000', desc: 'Research repositories, design specs, and decision logs — searchable across every project.' },
                { n: 'Tailwind CSS',   s: 'tailwindcss',    c: '06B6D4', desc: 'Utility-first CSS framework our design tokens map straight into — what you see in Figma is what ships.' },
                { n: 'React',          s: 'react',          c: '61DAFB', desc: 'Component library powering our SaaS dashboards — design system tokens flow directly into JSX components.' },
                { n: 'TypeScript',     s: 'typescript',     c: '3178C6', desc: 'Typed component props mirror our design system — every variant, every state, statically guaranteed.' },
                { n: 'CSS3',           s: 'css3',           c: '1572B6', desc: 'Modern CSS features — container queries, layers, OKLCH, view transitions — used across every build.' },
                { n: 'HTML5',          s: 'html5',          c: 'E34F26', desc: 'Semantic markup foundation — the base for every accessible, well-structured product we ship.' },
            ]}
            hideProjects={true}
            hideTestimonial={true}
            showClients={true}
            clientsPill="Trusted By Product Teams"
            clientsHeading="From Brand-New Apps to Mature Platforms,"
            clientsHeadingHighlight="We Design Products People Love"
            extraSections={
                <>
                    <DesignJourney />
                    <DesignTokens />
                    <UiUxVideo />
                </>
            }
            googleReviews={[
                {
                    name: 'Olivia Reyes',
                    role: 'Head of Product, Stackline',
                    rating: 5,
                    date: '2 months ago',
                    text: 'The redesign lifted our trial activation by 41% in the first six weeks. Their research synthesis caught two onboarding blockers we had been arguing about internally for a year.',
                },
                {
                    name: 'Mateo Garcia',
                    role: 'Founder, Brightleaf',
                    rating: 5,
                    date: '4 months ago',
                    text: 'A complete design system delivered in Figma and Storybook. Engineering velocity doubled in the first quarter — same team, same scope, half the rework.',
                },
                {
                    name: 'Hana Yamamoto',
                    role: 'VP Design, KettleApp',
                    rating: 5,
                    date: '6 months ago',
                    text: 'Mobile redesign with motion that felt thoughtful, not gimmicky. App Store rating climbed from 3.8 to 4.7 in two months post-launch.',
                },
                {
                    name: 'Felix Bauer',
                    role: 'CEO, Northsail Travel',
                    rating: 5,
                    date: '3 months ago',
                    text: 'They ran the entire research → design → handoff loop and made our internal designers stronger along the way. Easy to recommend.',
                },
                {
                    name: 'Priya Iyer',
                    role: 'Head of UX, FinFold',
                    rating: 5,
                    date: '5 months ago',
                    text: 'WCAG 2.2 AA audit + remediation across our entire product. Cleared the procurement hurdle on a Fortune 100 deal we had been chasing for a year.',
                },
                {
                    name: 'Lucas Bennett',
                    role: 'CTO, FlowLayer',
                    rating: 5,
                    date: '7 months ago',
                    text: 'Their Figma-to-Tailwind handoff is the cleanest I have seen — design tokens become CSS variables become Tailwind classes, with zero manual translation.',
                },
            ]}
            googleReviewsHeading="What Product Teams Say About Us"
            googleReviewsSubtitle="Verified reviews from product leaders, founders, and design directors we've shipped products with."
            faqs={[
                { q: 'What does product UI/UX design include?', a: 'It covers user research, information architecture, wireframing, visual UI, interactive prototypes, design systems, accessibility, and engineering handoff.' },
                { q: 'Do you do user research?', a: 'Yes. We run user interviews, usability tests, surveys, and analytics reviews to ground design in evidence — not opinion.' },
                { q: 'How do you collaborate with engineering?', a: 'We design in Figma with token-based design systems, document handoff, and partner with engineers throughout build and QA.' },
                { q: 'Will my product be accessible?', a: 'Yes. We design to WCAG 2.2 AA — covering color, contrast, focus order, semantics, and assistive-tech compatibility.' },
                { q: 'Can you build a design system from scratch?', a: 'Yes. We create design tokens, component libraries, documentation, and Storybook integrations tailored to your stack.' },
                { q: 'How long does a typical design project take?', a: 'A focused MVP design usually takes 4–8 weeks. Larger products with multiple platforms run 3–6 months.' },
                { q: 'Do you measure design success?', a: 'Yes. We instrument and review activation, conversion, retention, task success, and SUS scores after launch.' },
            ]}
        />
    );
}
