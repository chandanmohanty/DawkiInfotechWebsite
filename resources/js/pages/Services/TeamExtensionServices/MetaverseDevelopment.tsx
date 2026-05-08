import React from 'react';
import { motion } from 'framer-motion';
import ServicePageTemplate, { ICON } from '@/components/ServicePageTemplate';

/* ===========================================================================
 * Section 1: Supported Headsets & Platforms — visual gallery of every
 * device our metaverse practice ships to, with key specs that matter to
 * engineering decisions (per-eye resolution, tracking, ecosystem).
 * =========================================================================== */
type Headset = {
    name: string;
    maker: string;
    type: 'VR' | 'AR' | 'Spatial' | 'Web';
    specs: { label: string; value: string }[];
    a: string; b: string; glow: string; bg: string; border: string;
    icon: React.ReactNode;
};

const HEADSETS: Headset[] = [
    {
        name: 'Meta Quest 3',
        maker: 'Meta · standalone VR',
        type: 'VR',
        specs: [
            { label: 'Per-eye', value: '2064×2208' },
            { label: 'Refresh', value: '120Hz' },
            { label: 'SDK', value: 'OpenXR · Unity · Unreal' },
        ],
        a: '#5b9eff', b: '#a855f7', glow: 'rgba(91, 158, 255, 0.40)',
        bg: 'rgba(91, 158, 255, 0.10)', border: 'rgba(91, 158, 255, 0.30)',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 7h18a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-3l-3-3h-6l-3 3H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" />
                <circle cx="8" cy="12" r="2" />
                <circle cx="16" cy="12" r="2" />
            </svg>
        ),
    },
    {
        name: 'Apple Vision Pro',
        maker: 'Apple · spatial computer',
        type: 'Spatial',
        specs: [
            { label: 'Per-eye', value: 'Micro-OLED 4K' },
            { label: 'Tracking', value: 'Eye + hand + voice' },
            { label: 'SDK', value: 'visionOS · RealityKit' },
        ],
        a: '#06b6d4', b: '#5b9eff', glow: 'rgba(6, 182, 212, 0.40)',
        bg: 'rgba(6, 182, 212, 0.10)', border: 'rgba(6, 182, 212, 0.30)',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 9.5C2 7.5 3.6 6 5.6 6H18.4C20.4 6 22 7.5 22 9.5V13c0 2.2-1.8 4-4 4-1.5 0-2.7-.8-3.5-2H9.5C8.7 16.2 7.5 17 6 17c-2.2 0-4-1.8-4-4V9.5z" />
            </svg>
        ),
    },
    {
        name: 'HTC Vive XR Elite',
        maker: 'HTC · enterprise VR',
        type: 'VR',
        specs: [
            { label: 'Per-eye', value: '1920×1920' },
            { label: 'Refresh', value: '90Hz' },
            { label: 'Use case', value: 'Training · simulation' },
        ],
        a: '#22c55e', b: '#06b6d4', glow: 'rgba(34, 197, 94, 0.40)',
        bg: 'rgba(34, 197, 94, 0.10)', border: 'rgba(34, 197, 94, 0.30)',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="6" width="20" height="12" rx="3" />
                <line x1="12" y1="6" x2="12" y2="18" />
            </svg>
        ),
    },
    {
        name: 'PlayStation VR2',
        maker: 'Sony · console VR',
        type: 'VR',
        specs: [
            { label: 'Per-eye', value: 'OLED 2000×2040' },
            { label: 'Tracking', value: 'Eye + foveated' },
            { label: 'SDK', value: 'PSVR2 SDK · Unity' },
        ],
        a: '#a855f7', b: '#ec4899', glow: 'rgba(168, 85, 247, 0.40)',
        bg: 'rgba(168, 85, 247, 0.10)', border: 'rgba(168, 85, 247, 0.30)',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 11h12a3 3 0 0 1 0 6H6a3 3 0 0 1 0-6z" />
                <circle cx="9" cy="14" r="1" fill="currentColor" />
                <circle cx="15" cy="14" r="1" fill="currentColor" />
            </svg>
        ),
    },
    {
        name: 'iOS ARKit · Android ARCore',
        maker: 'Apple · Google · mobile AR',
        type: 'AR',
        specs: [
            { label: 'Reach', value: 'Billions of phones' },
            { label: 'Features', value: 'Plane · face · world tracking' },
            { label: 'SDK', value: 'ARKit 6 · ARCore 1.40' },
        ],
        a: '#ec4899', b: '#f97316', glow: 'rgba(236, 72, 153, 0.40)',
        bg: 'rgba(236, 72, 153, 0.10)', border: 'rgba(236, 72, 153, 0.30)',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="6" y="2" width="12" height="20" rx="2" />
                <path d="M9 6l3 3 3-3" />
                <line x1="9" y1="18" x2="15" y2="18" />
            </svg>
        ),
    },
    {
        name: 'WebXR (Browser)',
        maker: 'Three.js · Babylon.js · PlayCanvas',
        type: 'Web',
        specs: [
            { label: 'Install', value: 'None — share a URL' },
            { label: 'Devices', value: 'Quest · Vision · phones' },
            { label: 'Stack', value: 'WebXR · WebGPU · GLTF' },
        ],
        a: '#f97316', b: '#fbbf24', glow: 'rgba(249, 115, 22, 0.40)',
        bg: 'rgba(249, 115, 22, 0.10)', border: 'rgba(249, 115, 22, 0.30)',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
        ),
    },
];

const HeadsetGallery: React.FC = () => (
    <section className="dawki-meta-gallery">
        <div className="container">
            <div className="dawki-meta-gallery-heading">
                <span className="dawki-meta-gallery-pill">
                    <span></span>
                    Devices & Platforms
                </span>
                <h2 className="dawki-meta-gallery-title">
                    Every Headset, Phone &amp; Browser <span>We Ship Worlds To</span>
                </h2>
                <p className="dawki-meta-gallery-subtitle">
                    A single Unity or Unreal codebase built once, exported to every leading XR device — plus mobile AR and the open browser via WebXR.
                </p>
            </div>

            <motion.div
                className="dawki-meta-gallery-grid"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
                }}
            >
                {HEADSETS.map((h) => (
                    <motion.article
                        key={h.name}
                        className="dawki-meta-gallery-card"
                        style={{
                            ['--mh-a' as string]: h.a,
                            ['--mh-b' as string]: h.b,
                            ['--mh-glow' as string]: h.glow,
                            ['--mh-bg' as string]: h.bg,
                            ['--mh-border' as string]: h.border,
                        }}
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] } },
                        }}
                    >
                        <div className="dawki-meta-gallery-head">
                            <span className="dawki-meta-gallery-icon">{h.icon}</span>
                            <span className="dawki-meta-gallery-type">{h.type}</span>
                        </div>
                        <div className="dawki-meta-gallery-name">{h.name}</div>
                        <div className="dawki-meta-gallery-maker">{h.maker}</div>
                        <ul className="dawki-meta-gallery-specs">
                            {h.specs.map((s) => (
                                <li key={s.label}>
                                    <span>{s.label}</span>
                                    <strong>{s.value}</strong>
                                </li>
                            ))}
                        </ul>
                    </motion.article>
                ))}
            </motion.div>
        </div>
    </section>
);

/* ===========================================================================
 * Section 2: Asset & Build Pipeline — phase-by-phase production timeline
 * for shipping a metaverse experience from concept frame to live launch.
 * =========================================================================== */
type Phase = {
    label: string;
    sub: string;
    title: string;
    titleSub: string;
    a: string; b: string; glow: string; dotColor: string;
    days: { num: string; title: string; desc: string }[];
};

const PIPELINE_PHASES: Phase[] = [
    {
        label: 'Phase 1',
        sub: 'Weeks 1–2',
        title: 'Concept & Prototype',
        titleSub: 'Vision · style frames · playable prototype',
        a: '#06b6d4', b: '#4f7cff', glow: 'rgba(6, 182, 212, 0.45)', dotColor: '#06b6d4',
        days: [
            { num: 'Step 1', title: 'Discovery & vision doc',         desc: 'Audience, success metrics, target devices, and the core experience locked in a vision deck.' },
            { num: 'Step 2', title: 'Style frames & moodboards',      desc: 'AI-assisted concept art (Midjourney + Stable Diffusion) plus director-approved style frames.' },
            { num: 'Step 3', title: 'Greybox playable prototype',     desc: 'Untextured engine build that proves the core loop on the target headset within two weeks.' },
        ],
    },
    {
        label: 'Phase 2',
        sub: 'Weeks 3–6',
        title: 'Modelling & Animation',
        titleSub: '3D meshes · rigs · PBR textures · animations',
        a: '#a855f7', b: '#ec4899', glow: 'rgba(168, 85, 247, 0.45)', dotColor: '#a855f7',
        days: [
            { num: 'Step 4', title: '3D modelling & UV unwrapping',   desc: 'Hard-surface and organic modelling in Blender / Maya, optimized for real-time topology.' },
            { num: 'Step 5', title: 'PBR texturing & materials',      desc: 'Substance Painter + AI-assisted texture generation. Material LODs baked for VR perf.' },
            { num: 'Step 6', title: 'Rigging & animation library',    desc: 'Rigs, locomotion, IK, and a reusable animation library — Houdini for procedural FX.' },
        ],
    },
    {
        label: 'Phase 3',
        sub: 'Weeks 7–10',
        title: 'Engine Integration',
        titleSub: 'Unity / Unreal build · multiplayer · Web3',
        a: '#22c55e', b: '#06b6d4', glow: 'rgba(34, 197, 94, 0.45)', dotColor: '#22c55e',
        days: [
            { num: 'Step 7', title: 'Engine integration & systems',   desc: 'Imports, scene assembly, gameplay systems, audio, and platform-specific input handling.' },
            { num: 'Step 8', title: 'Multiplayer & networking',       desc: 'Photon, Mirror, or Colyseus for real-time presence + voice + physics sync.' },
            { num: 'Step 9', title: 'Web3 / NFT integration',         desc: 'Wallet connect, NFT-gated access, on-chain wearables — only when the experience needs it.' },
        ],
    },
    {
        label: 'Phase 4',
        sub: 'Weeks 11–14',
        title: 'Polish, QA & Launch',
        titleSub: 'Perf budgets · platform cert · live ops',
        a: '#f97316', b: '#fbbf24', glow: 'rgba(249, 115, 22, 0.45)', dotColor: '#f97316',
        days: [
            { num: 'Step 10', title: 'Performance budget & profiling', desc: 'Hit 90 FPS on target headset. GPU profiling, draw-call reduction, foveated rendering.' },
            { num: 'Step 11', title: 'Store submission & cert',         desc: 'Meta Store, App Store, Google Play, Steam — assets, descriptions, and cert pass coordinated.' },
            { num: 'Step 12', title: 'Launch + live ops handover',      desc: 'Day-1 monitoring, crash dashboards, and the live-ops runbook for the next 6 months.' },
        ],
    },
];

const ProductionPipeline: React.FC = () => (
    <section className="dawki-ddt-sprint">
        <div className="container">
            <div className="dawki-ddt-sprint-heading">
                <span className="dawki-ddt-sprint-pill">
                    <span></span>
                    Production Pipeline
                </span>
                <h2 className="dawki-ddt-sprint-title">
                    From Concept Frame to Launch <span>In 14 Working Weeks</span>
                </h2>
                <p className="dawki-ddt-sprint-subtitle">
                    The four-phase pipeline every Dawki metaverse build runs through — concept, asset production, engine integration, and platform launch.
                </p>
            </div>

            <motion.div
                className="dawki-ddt-sprint-frame"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
            >
                {PIPELINE_PHASES.map((phase, pi) => (
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
export default function MetaverseDevelopment() {
    return (
        <ServicePageTemplate
            pageTitle="Metaverse Development"
            breadcrumbCategory="Team Extension Services"
            heroPill="Team Extension Services"
            heroTitleStart="Metaverse"
            heroTitleHighlight="Development"
            heroSubtitle="Immersive 3D worlds, AR/VR experiences, and Web3-enabled metaverse platforms — built with Unity, Unreal, and WebXR."
            heroVideoSrc="/assets/images/header/demo/meta_verse.mp4"
            featuresPill="Immersive Engineering"
            featuresTitleStart="Bringing Worlds"
            featuresTitleHighlight="To Life"
            featuresSubtitle="From training simulations to virtual storefronts — we build immersive 3D, AR, and VR experiences with production-grade quality."
            features={[
                { title: 'Cross-Platform Headsets', desc: 'Meta Quest, Apple Vision Pro, HTC Vive, PSVR — one codebase, multiple devices.', icon: '🥽' },
                { title: 'Unity & Unreal Engine',   desc: 'Production-grade engineering on the world\'s leading 3D engines.', icon: '🎮' },
                { title: 'WebXR & Browser-Based',   desc: 'Frictionless 3D and VR experiences delivered straight to a browser.', icon: '🌐' },
                { title: '3D Asset Pipeline',       desc: 'Modeling, texturing, rigging, and optimization for real-time rendering.', icon: '🧊' },
                { title: 'AI-Assisted Production',  desc: 'GenAI for concept art, textures, voice acting, and procedural content.', icon: '🤖' },
                { title: 'Multi-User Real-Time',    desc: 'Photon, Mirror, Colyseus — real-time multiplayer with voice and physics.', icon: '👥' },
            ]}
            processSteps={[
                { n: '01', t: 'Concept',            d: 'Define experience, audience, success metrics, and platform mix.' },
                { n: '02', t: 'Prototype',          d: 'Playable prototype in 3–5 weeks for fast iteration.' },
                { n: '03', t: 'Production',         d: 'Full asset pipeline, engineering, QA, and platform optimization.' },
                { n: '04', t: 'Launch & Operate',   d: 'Store submissions, live ops, content updates, and analytics.' },
            ]}
            servicesPill="Our Capabilities"
            servicesTitleStart="Metaverse"
            servicesTitleHighlight="Services We Offer"
            servicesSubtitle="A full-stack metaverse practice — from 3D asset production to multiplayer infrastructure."
            servicesLayout="timeline"
            serviceCards={[
                { title: 'Metaverse Strategy & Consulting', desc: 'Use-case discovery, platform selection, and go-to-market roadmaps.', icon: ICON.target },
                { title: 'VR App Development',              desc: 'Meta Quest, Apple Vision Pro, HTC Vive, PSVR experiences in Unity and Unreal.', icon: ICON.rocket },
                { title: 'AR App Development',              desc: 'iOS ARKit, Android ARCore, WebAR, and Apple Vision Pro spatial AR.', icon: ICON.eye },
                { title: 'WebXR & 3D Web',                  desc: 'Three.js, Babylon.js, and PlayCanvas browser-based 3D and VR experiences.', icon: ICON.globe },
                { title: '3D Asset Production',             desc: 'Modeling, texturing, rigging, animation, and game-ready optimization.', icon: ICON.palette },
                { title: 'Multi-User Metaverse Platforms',  desc: 'Real-time multiplayer worlds with voice, presence, and physics.', icon: ICON.users },
                { title: 'Virtual Showrooms & Stores',      desc: 'Immersive 3D commerce experiences with try-on and product configurators.', icon: ICON.box },
                { title: 'Training Simulations',            desc: 'VR and AR simulations for training, safety, and skills acquisition.', icon: ICON.shield },
                { title: 'Digital Twins',                   desc: 'Real-time digital replicas of factories, buildings, and equipment.', icon: ICON.cog },
                { title: 'NFT-Enabled Experiences',         desc: 'Wearables, items, and lands tied to on-chain ownership.', icon: ICON.link },
                { title: 'Game Mechanics & Economy',        desc: 'Loops, progression systems, and in-world economies that retain users.', icon: ICON.chart },
                { title: 'Live Ops & Maintenance',          desc: 'Content updates, performance tuning, and platform-version compatibility.', icon: ICON.headset },
            ]}
            toolsTitleStart="Engines, AI Tools &"
            toolsTitleHighlight="Production Stack"
            toolsSubtitle="The engines, generative AI tools, and production software our metaverse practice ships with — every project built on the same battle-tested stack."
            toolsLayout="vertical"
            tools={[
                { n: 'Unity',          s: 'unity',          c: '000000', desc: 'Default real-time engine for VR/AR/multiplayer — cross-platform export to every headset and mobile.' },
                { n: 'Unreal Engine',  s: 'unrealengine',   c: '0E1128', desc: 'Photoreal interiors, lumen lighting, and massive open environments for high-end VR.' },
                { n: 'Three.js',       s: 'threedotjs',    c: 'F97316', desc: 'WebXR + 3D web experiences delivered straight to a browser — no install, no app store.' },
                { n: 'Babylon.js',     s: 'babylondotjs',   c: 'BB464B', desc: 'Microsoft-backed WebGL engine — strong PBR, physics, and WebXR support.' },
                { n: 'Blender',        s: 'blender',       c: 'F5792A', desc: 'Open-source 3D modelling, sculpting, animation, and rendering — every asset starts here.' },
                { n: 'OpenAI / GPT-4', s: 'openai',         c: '412991', desc: 'NPC dialogue scripting, lore generation, and dynamic narrative systems for in-world conversations.' },
                { n: 'Midjourney',     s: 'midjourney',     c: '000000', desc: 'AI concept art for moodboards, style frames, and visual direction — director-curated.' },
                { n: 'Stable Diffusion', s: 'stablediffusion', c: 'AB68FF', desc: 'Open-source diffusion for texture generation, environment art, and sprite sheets.' },
                { n: 'Luma AI',        s: 'lumalabs',       c: '4F4F4F', desc: 'NeRF + Gaussian Splatting captures — real-world scenes turned into photoreal 3D assets.' },
                { n: 'NVIDIA Omniverse', s: 'nvidia',       c: '76B900', desc: 'OpenUSD-based collaboration for digital-twin and large-scale simulation projects.' },
                { n: 'ElevenLabs',     s: 'elevenlabs',     c: '000000', desc: 'AI voice cloning + TTS for character voiceover, NPCs, and narration in any language.' },
                { n: 'Substance 3D',   s: 'adobe',          c: 'FF0000', desc: 'Industry-standard PBR texture authoring — materials that look right under VR lighting.' },
                { n: 'Houdini',        s: 'sidefx',         c: 'FF4713', desc: 'Procedural environments, FX, and destruction — used wherever scale is too big to hand-model.' },
                { n: 'Photon Engine',  s: 'unity',          c: '00BFFF', desc: 'Real-time multiplayer networking — voice, presence, physics sync at 20Hz+.' },
                { n: 'Mixamo',         s: 'adobe',          c: 'FA0F00', desc: 'Auto-rigging + animation library for humanoid characters — fast prototyping of locomotion.' },
                { n: 'Cursor / Copilot', s: 'cursor',       c: '000000', desc: 'AI-assisted gameplay scripting — accelerates C# / C++ engineering inside Unity and Unreal.' },
            ]}
            hideProjects={true}
            hideTestimonial={true}
            showClients={true}
            clientsPill="Trusted By Brands & Studios"
            clientsHeading="From Fortune 500 Training Programs to Indie Studios,"
            clientsHeadingHighlight="Our Worlds Run Live"
            extraSections={
                <>
                    <HeadsetGallery />
                    <ProductionPipeline />
                </>
            }
            googleReviews={[
                {
                    name: 'Tomás Reyes',
                    role: 'CTO, Aurora Realms (Game Studio)',
                    rating: 5,
                    date: '2 months ago',
                    text: 'Their Unity team shipped our multiplayer VR title to Quest, PSVR2, and Steam from one codebase. Clean 90 FPS on Quest, no compromises on the high-end builds. Best engineering partnership we have had on a VR project.',
                },
                {
                    name: 'Mireille Dubois',
                    role: 'L&D Director, Atlas Manufacturing',
                    rating: 5,
                    date: '4 months ago',
                    text: 'We needed a VR safety training simulator for shop-floor operators. The Dawki team delivered a fully-rigged Quest 3 experience in 14 weeks — incident reports dropped 38% in the first quarter after rollout.',
                },
                {
                    name: 'Anand Krishnamurthy',
                    role: 'Founder, Spectra Spaces (proptech)',
                    rating: 5,
                    date: '6 months ago',
                    text: 'WebXR virtual showroom for our luxury real-estate listings. Buyers walk a $4M apartment from a browser link — no app, no headset required. Conversion-to-tour ratio up 2.6x.',
                },
                {
                    name: 'Frida Eklund',
                    role: 'Brand Director, Polaris Streetwear',
                    rating: 5,
                    date: '3 months ago',
                    text: 'NFT-gated wearables for our digital storefront, AR try-on for sneakers, and a multi-user lounge — all shipped together for a coordinated drop. Sold-out in 11 minutes. The infra held without a hiccup.',
                },
                {
                    name: 'Marcus Devlin',
                    role: 'VP Operations, Northwind Aerospace',
                    rating: 5,
                    date: '5 months ago',
                    text: 'Digital twin of our assembly line on Vision Pro. Engineers walk the floor remotely, diagnose issues, and brief field teams in real-time. Genuinely changed how we operate large facilities.',
                },
                {
                    name: 'Yuki Tanaka',
                    role: 'Producer, Lantern Studios',
                    rating: 5,
                    date: '7 months ago',
                    text: 'They handled the full asset pipeline — 200+ rigged characters, 40+ environments, AI-generated foliage — and got us to App Lab in five months. The team genuinely understands real-time art constraints.',
                },
            ]}
            googleReviewsHeading="What Studio Leads Say About Our Metaverse Work"
            googleReviewsSubtitle="Verified reviews from CTOs, producers, and VPs we've shipped immersive experiences with."
            faqs={[
                { q: 'What is metaverse development?',
                  a: 'Metaverse development covers building immersive 3D, VR, and AR experiences — often multi-user and sometimes Web3-enabled — for entertainment, training, commerce, or productivity.' },
                { q: 'Which platforms do you support?',
                  a: 'Meta Quest, Apple Vision Pro, HTC Vive XR Elite, PSVR2, iOS/Android AR, and WebXR for browser-based experiences.' },
                { q: 'Do you handle 3D asset production?',
                  a: 'Yes. We model, texture, rig, animate, and optimize 3D assets for real-time engines — and use AI-assisted tools (Midjourney, Stable Diffusion, Luma AI) to accelerate concept and texture work.' },
                { q: 'Which engines do you use?',
                  a: 'Unity and Unreal Engine for native VR/AR; Three.js, Babylon.js, and PlayCanvas for WebXR.' },
                { q: 'Can you integrate Web3 and NFTs?',
                  a: 'Yes. We build NFT-gated experiences, on-chain wearables, and tokenized in-world assets — only when the experience genuinely needs it.' },
                { q: 'Do you use AI in production?',
                  a: 'Across the board — concept art (Midjourney), textures (Stable Diffusion), 3D capture (Luma AI), voice (ElevenLabs), NPC dialogue (GPT-4), and gameplay code (Cursor).' },
                { q: 'How long does a metaverse project take?',
                  a: 'A focused VR or AR experience typically ships in 12–20 weeks. Multi-user platforms run 4–9 months.' },
                { q: 'Do you offer post-launch live ops?',
                  a: 'Yes. We maintain experiences, ship content updates, and keep up with platform version changes — including Quest, visionOS, and Steam runtime updates.' },
            ]}
        />
    );
}
