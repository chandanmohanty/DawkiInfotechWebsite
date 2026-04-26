import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import ServicePageTemplate, { ICON } from '@/components/ServicePageTemplate';

/* ===========================================================================
 * Section 1: Live Patient Vitals Monitor
 * =========================================================================== */
const VitalsMonitor: React.FC = () => {
    const [bpm, setBpm] = useState(72);
    const [time, setTime] = useState(new Date());
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });

    // Animate BPM value gently between 68-78 + clock tick
    useEffect(() => {
        const id = setInterval(() => {
            setBpm((prev) => {
                const drift = (Math.random() - 0.5) * 4;
                const next = Math.max(66, Math.min(80, prev + drift));
                return Math.round(next);
            });
            setTime(new Date());
        }, 1400);
        return () => clearInterval(id);
    }, []);

    // ECG path: classic PQRST complex repeated across the viewBox
    // viewBox 0..600, baseline ~80
    const beat = 'l 18 0 l 4 -3 l 6 6 l 4 -28 l 4 50 l 5 -25 l 6 -2 l 18 0';
    const ecgPath = 'M 0 80 ' + Array.from({ length: 8 }).map(() => beat).join(' ');

    const formatTime = (d: Date) =>
        d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const Spark: React.FC<{ color: string; data: number[] }> = ({ color, data }) => {
        const W = 110, H = 30;
        const max = Math.max(...data), min = Math.min(...data);
        const range = max - min || 1;
        const stepX = W / (data.length - 1);
        const path = data.map((p, i) => {
            const x = i * stepX;
            const y = H - 3 - ((p - min) / range) * (H - 6);
            return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
        }).join(' ');
        return (
            <svg className="dawki-hc-vitals-card-spark" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
                <motion.path
                    d={path}
                    fill="none"
                    stroke={color}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: inView ? 1 : 0 }}
                    transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1], delay: 0.5 }}
                />
            </svg>
        );
    };

    return (
        <section className="dawki-hc-vitals">
            <div className="container">
                <div className="dawki-hc-vitals-heading">
                    <span className="dawki-hc-vitals-pill">
                        <span></span>
                        Real-Time Monitoring
                    </span>
                    <h2 className="dawki-hc-vitals-title">
                        Live Vitals, Streamed From <span>Every Connected Device</span>
                    </h2>
                    <p className="dawki-hc-vitals-subtitle">
                        We build the platforms hospitals run on — wearables, ICU monitors, and home devices feeding a single, audit-ready view of patient health, in real time.
                    </p>
                </div>

                <motion.div
                    ref={ref}
                    className="dawki-hc-vitals-window"
                    initial={{ opacity: 0, y: 30, scale: 0.97 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                >
                    <div className="dawki-hc-vitals-titlebar">
                        <span className="dawki-hc-vitals-titlebar-name">
                            ROOM 304 · BED A · <strong>JANE D.</strong> · F · 47Y · MRN 0042819
                        </span>
                        <span className="dawki-hc-vitals-titlebar-status">Stable</span>
                    </div>

                    <div className="dawki-hc-vitals-body">
                        <div className="dawki-hc-vitals-ecg">
                            <div className="dawki-hc-vitals-ecg-head">
                                <span className="dawki-hc-vitals-ecg-label">ECG · Lead II</span>
                                <span className="dawki-hc-vitals-ecg-bpm">
                                    <span className="dawki-hc-vitals-ecg-bpm-value">{bpm}</span>
                                    <span className="dawki-hc-vitals-ecg-bpm-unit">BPM</span>
                                </span>
                            </div>

                            <svg className="dawki-hc-vitals-ecg-svg" viewBox="0 0 600 160" preserveAspectRatio="none" aria-hidden="true">
                                <motion.path
                                    d={ecgPath}
                                    className="dawki-hc-vitals-ecg-line"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: inView ? 1 : 0 }}
                                    transition={{ duration: 2.4, ease: 'linear', delay: 0.3 }}
                                />
                                <motion.circle
                                    cx="0"
                                    cy="80"
                                    r="5"
                                    className="dawki-hc-vitals-ecg-cursor"
                                    animate={inView ? { cx: [0, 600, 0] } : { cx: 0 }}
                                    transition={{ duration: 4.5, ease: 'linear', repeat: Infinity, delay: 0.3 }}
                                />
                            </svg>

                            <div className="dawki-hc-vitals-ecg-stripe">
                                <span>Sweep <strong>25 mm/s</strong></span>
                                <span>Gain <strong>10 mm/mV</strong></span>
                                <span>Filter <strong>0.05–40 Hz</strong></span>
                                <span>Time <strong>{formatTime(time)}</strong></span>
                            </div>
                        </div>

                        <div className="dawki-hc-vitals-cards">
                            <div className="dawki-hc-vitals-card" style={{ ['--vc-color' as string]: '#22c55e' }}>
                                <span className="dawki-hc-vitals-card-name">Heart Rate</span>
                                <span className="dawki-hc-vitals-card-value">
                                    <span className="dawki-hc-vitals-card-num">{bpm}</span>
                                    <span className="dawki-hc-vitals-card-unit">bpm</span>
                                </span>
                                <Spark color="#22c55e" data={[71, 72, 70, 73, 74, 72, 73, 71, 72, 73]} />
                                <span className="dawki-hc-vitals-card-status dawki-hc-vitals-card-status--ok">Within range</span>
                            </div>
                            <div className="dawki-hc-vitals-card" style={{ ['--vc-color' as string]: '#06b6d4' }}>
                                <span className="dawki-hc-vitals-card-name">SpO₂</span>
                                <span className="dawki-hc-vitals-card-value">
                                    <span className="dawki-hc-vitals-card-num">98</span>
                                    <span className="dawki-hc-vitals-card-unit">%</span>
                                </span>
                                <Spark color="#06b6d4" data={[97, 98, 98, 97, 99, 98, 98, 97, 98, 98]} />
                                <span className="dawki-hc-vitals-card-status dawki-hc-vitals-card-status--ok">Within range</span>
                            </div>
                            <div className="dawki-hc-vitals-card" style={{ ['--vc-color' as string]: '#a855f7' }}>
                                <span className="dawki-hc-vitals-card-name">Blood Pressure</span>
                                <span className="dawki-hc-vitals-card-value">
                                    <span className="dawki-hc-vitals-card-num">122</span>
                                    <span className="dawki-hc-vitals-card-unit">/ 78 mmHg</span>
                                </span>
                                <Spark color="#a855f7" data={[118, 120, 122, 121, 120, 122, 124, 122, 121, 122]} />
                                <span className="dawki-hc-vitals-card-status dawki-hc-vitals-card-status--ok">Within range</span>
                            </div>
                            <div className="dawki-hc-vitals-card" style={{ ['--vc-color' as string]: '#f97316' }}>
                                <span className="dawki-hc-vitals-card-name">Temperature</span>
                                <span className="dawki-hc-vitals-card-value">
                                    <span className="dawki-hc-vitals-card-num">98.4</span>
                                    <span className="dawki-hc-vitals-card-unit">°F</span>
                                </span>
                                <Spark color="#f97316" data={[98.2, 98.3, 98.4, 98.4, 98.3, 98.4, 98.5, 98.4, 98.3, 98.4]} />
                                <span className="dawki-hc-vitals-card-status dawki-hc-vitals-card-status--ok">Within range</span>
                            </div>

                            <div className="dawki-hc-vitals-alert">
                                All vitals within prescribed thresholds · last sync 4s ago
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

/* ===========================================================================
 * Section 2: Compliance Trust Wall
 * =========================================================================== */
type Compliance = {
    name: string;
    meta: string;
    desc: string;
    a: string; b: string; glow: string; color: string;
    progress: number;
};

const COMPLIANCES: Compliance[] = [
    {
        name: 'HIPAA',
        meta: 'US · Healthcare PHI',
        desc: 'PHI encrypted in transit + at rest, BAAs in place, full audit logging across every touchpoint.',
        a: '#06b6d4', b: '#4f7cff', glow: 'rgba(6, 182, 212, 0.32)', color: '#67e8f9',
        progress: 100,
    },
    {
        name: 'HL7 FHIR R4',
        meta: 'Interoperability',
        desc: 'Standards-compliant patient, observation, and encounter resources for clean EMR / EHR interop.',
        a: '#22c55e', b: '#06b6d4', glow: 'rgba(34, 197, 94, 0.32)', color: '#86efac',
        progress: 96,
    },
    {
        name: 'GDPR',
        meta: 'EU · Patient Privacy',
        desc: 'Lawful basis tracking, right-to-erasure flows, and data residency controls baked into every product.',
        a: '#4f7cff', b: '#a855f7', glow: 'rgba(79, 124, 255, 0.32)', color: '#93c5fd',
        progress: 100,
    },
    {
        name: 'SOC 2 Type II',
        meta: 'Trust Service Criteria',
        desc: 'Security, availability, and confidentiality controls audited annually by independent assessors.',
        a: '#a855f7', b: '#ec4899', glow: 'rgba(168, 85, 247, 0.32)', color: '#d8b4fe',
        progress: 100,
    },
    {
        name: 'ISO 27001',
        meta: 'ISMS',
        desc: 'Information Security Management System certification — risk-based controls, regularly reviewed.',
        a: '#ec4899', b: '#f97316', glow: 'rgba(236, 72, 153, 0.32)', color: '#fbcfe8',
        progress: 92,
    },
    {
        name: 'NIST CSF',
        meta: 'Cybersecurity',
        desc: 'Identify, Protect, Detect, Respond, Recover — every function exercised in our incident playbook.',
        a: '#f97316', b: '#fbbf24', glow: 'rgba(249, 115, 22, 0.32)', color: '#fed7aa',
        progress: 88,
    },
];

const ComplianceTrustWall: React.FC = () => (
    <section className="dawki-hc-trust">
        <div className="container">
            <div className="dawki-hc-trust-heading">
                <span className="dawki-hc-trust-pill">
                    <span></span>
                    Compliance & Trust
                </span>
                <h2 className="dawki-hc-trust-title">
                    Built to Pass <span>Every Audit</span>
                </h2>
                <p className="dawki-hc-trust-subtitle">
                    Healthcare ships under regulation. We design every product with HIPAA, FHIR, GDPR, and SOC 2 baked in — never bolted on.
                </p>
            </div>

            <motion.div
                className="dawki-hc-trust-grid"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-80px' }}
                variants={{
                    hidden: {},
                    show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
                }}
            >
                {COMPLIANCES.map((c) => (
                    <motion.div
                        key={c.name}
                        className="dawki-hc-trust-card"
                        style={{
                            ['--tc-a' as string]: c.a,
                            ['--tc-b' as string]: c.b,
                            ['--tc-glow' as string]: c.glow,
                            ['--tc-color' as string]: c.color,
                        }}
                        variants={{
                            hidden: { opacity: 0, y: 24 },
                            show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] } },
                        }}
                    >
                        <div className="dawki-hc-trust-card-head">
                            <span className="dawki-hc-trust-card-shield">
                                <span className="dawki-hc-trust-card-shield-check" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                        <path d="M9 12l2 2 4-4" />
                                    </svg>
                                </span>
                            </span>
                            <span className="dawki-hc-trust-card-status">Verified</span>
                        </div>
                        <h3 className="dawki-hc-trust-card-name">{c.name}</h3>
                        <p className="dawki-hc-trust-card-meta">{c.meta}</p>
                        <p className="dawki-hc-trust-card-desc">{c.desc}</p>

                        <div className="dawki-hc-trust-card-progress" aria-hidden="true">
                            <motion.div
                                className="dawki-hc-trust-card-progress-fill"
                                initial={{ width: '0%' }}
                                whileInView={{ width: `${c.progress}%` }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1], delay: 0.5 }}
                            />
                        </div>
                        <div className="dawki-hc-trust-card-progress-row">
                            <span>Coverage</span>
                            <span>{c.progress}%</span>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    </section>
);

/* ===========================================================================
 * Section 3: Healthcare Video Showcase
 * =========================================================================== */
const HealthcareVideo: React.FC = () => {
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
                        Inside The Care Lab
                    </span>
                    <h2 className="dawki-ent-video-title">
                        See How We Build <span>Healthcare That Heals</span>
                    </h2>
                    <p className="dawki-ent-video-subtitle">
                        A behind-the-scenes look at how we design clinical workflows, pass HIPAA audits, and ship patient-facing apps that doctors actually want to use.
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
export default function HealthcareApps() {
    return (
        <ServicePageTemplate
            pageTitle="Healthcare Apps"
            breadcrumbCategory="Industries"
            heroPill="Industries"
            heroTitleStart="Healthcare"
            heroTitleHighlight="Apps & Platforms"
            heroSubtitle="HIPAA-grade patient apps, clinical workflows, telemedicine, EMR integrations, and connected-device platforms — engineered for safety, scale, and audit."
            heroVideoSrc="/assets/images/about/health_care.mp4"
            featuresPill="Healthcare Engineering"
            featuresTitleStart="Software That Helps"
            featuresTitleHighlight="People Get Better"
            featuresSubtitle="From patient onboarding to remote monitoring — we ship healthcare software that's safe, compliant, and a pleasure for clinicians and patients to use."
            features={[
                { title: 'HIPAA / HL7 / FHIR', desc: 'PHI encrypted, BAAs in place, FHIR R4 resources for clean EMR interop.', icon: '🛡️' },
                { title: 'Telemedicine Ready', desc: 'Twilio Video, OpenTok, and WebRTC pipelines for clinical-grade video consults.', icon: '📹' },
                { title: 'Connected Devices', desc: 'Apple HealthKit, Google Fit, BLE, and ECG/SpO₂ device pipelines.', icon: '⌚' },
                { title: 'Clinical Workflows', desc: 'Triage, charting, e-prescriptions, and lab integration — designed with clinicians.', icon: '🩺' },
                { title: 'Patient Experience', desc: 'Onboarding, intake forms, appointment booking, and engagement that drives adherence.', icon: '💖' },
                { title: 'Audit-Ready Logs', desc: 'Immutable activity logs, role-based access, and granular consent tracking.', icon: '📋' },
            ]}
            processSteps={[
                { n: '01', t: 'Discovery', d: 'Workflow mapping with clinicians, regulatory scoping, and risk assessment.' },
                { n: '02', t: 'Architecture', d: 'HIPAA-aligned cloud architecture, FHIR data model, integration plan.' },
                { n: '03', t: 'Build', d: 'Iterative sprints with clinical-team review and continuous compliance checks.' },
                { n: '04', t: 'Validate & Launch', d: 'Penetration testing, audit prep, pilot rollout, and post-launch monitoring.' },
            ]}
            servicesPill="Our Capabilities"
            servicesTitleStart="Explore Our Range of"
            servicesTitleHighlight="Healthcare-Focused Services"
            servicesSubtitle="Patient-facing, clinical, and operational healthcare software — across web, mobile, and connected devices."
            servicesLayout="timeline"
            serviceCards={[
                { title: 'Telemedicine Platforms', desc: 'Video consults, e-prescriptions, secure messaging, and clinic queueing — built on Twilio, OpenTok, or self-hosted WebRTC for clinical-grade reliability.', icon: ICON.headset },
                { title: 'EMR / EHR Integrations', desc: 'Clean FHIR R4 interfaces to Epic, Cerner, Allscripts, athenahealth — including patient sync, observations, and encounter records.', icon: ICON.database },
                { title: 'Patient Portals & Mobile Apps', desc: 'Records, lab results, appointments, refills, secure messaging — designed with patient and family-caregiver flows in mind.', icon: ICON.users },
                { title: 'Wellness & Fitness Apps', desc: 'Workouts, nutrition, sleep, mood, and habit tracking with HealthKit + Google Fit integration and goal coaching.', icon: ICON.rocket },
                { title: 'Remote Patient Monitoring', desc: 'Connected wearables and home devices streaming vitals to clinicians, with thresholds, alerts, and escalation rules.', icon: ICON.eye },
                { title: 'Mental Health Platforms', desc: 'Therapy booking, journaling, mood tracking, and crisis-aware in-app flows — built for HIPAA + state-level compliance.', icon: ICON.shield },
                { title: 'Pharmacy & Medication Apps', desc: 'Prescription management, adherence reminders, refill flows, and last-mile delivery integrations.', icon: ICON.box },
                { title: 'Hospital Operations Software', desc: 'Bed management, staff scheduling, OT planning, and revenue-cycle workflows for mid-size hospitals.', icon: ICON.cog },
                { title: 'Clinical Decision Support', desc: 'Drug interaction checks, dosing calculators, and AI-assisted triage — always with the clinician in the loop.', icon: ICON.target },
                { title: 'Healthcare AI & ML', desc: 'Imaging triage models, risk scoring, and predictive analytics on de-identified data — with clinical validation built in.', icon: ICON.bot },
                { title: 'Wearable & IoT Health', desc: 'Apple Watch, Fitbit, BLE devices, and custom hardware — secure pipelines from device to dashboard.', icon: ICON.link },
                { title: 'Compliance & Security Hardening', desc: 'HIPAA gap audits, SOC 2 readiness, penetration testing, and incident response playbooks tailored to healthcare.', icon: ICON.lock },
            ]}
            toolsTitleStart="Healthcare Stack &"
            toolsTitleHighlight="Tools We Build With"
            toolsSubtitle="A purpose-built healthcare stack — interop standards, EHR adapters, telehealth, IoT, and audit-grade infrastructure — operated end-to-end."
            toolsLayout="vertical"
            tools={[
                { n: 'HL7 FHIR',           s: 'hl7',             c: '00ABA1', desc: 'Modern interop standard — FHIR R4 resources for Patient, Observation, Encounter, and Practitioner data.' },
                { n: 'Epic Systems',       s: 'epicgames',       c: '7C1D1D', desc: 'Largest EHR vendor — App Orchard SMART-on-FHIR integrations and Care Everywhere connectivity.' },
                { n: 'Cerner / Oracle Health', url: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg', desc: 'Now Oracle Health — millennium platform integrations via SMART-on-FHIR and HL7 v2 interfaces.' },
                { n: 'Apple HealthKit',    s: 'apple',           c: '000000', desc: 'iOS health data integration — vitals, workouts, sleep, and clinical record import for patient apps.' },
                { n: 'Google Fit',         s: 'googlefit',       c: '4285F4', desc: 'Android wellness data API — activity, body composition, and continuous heart-rate streams.' },
                { n: 'Twilio Video',       s: 'twilio',          c: 'F22F46', desc: 'HIPAA-eligible video infrastructure — telehealth visits with recording, screen share, and SDK control.' },
                { n: 'AWS HealthLake',     url: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg', desc: 'Managed FHIR data store on AWS — scales to petabytes with built-in NLP and analytics.' },
                { n: 'Stripe',             s: 'stripe',          c: '008CDD', desc: 'Patient billing, subscriptions, copay collection, and FSA/HSA-friendly checkout flows.' },
                { n: 'Auth0',              s: 'auth0',           c: 'EB5424', desc: 'HIPAA-eligible SSO + MFA — patient and provider identity with social, OIDC, and SAML.' },
                { n: 'React Native',       s: 'react',           c: '61DAFB', desc: 'Cross-platform iOS + Android apps — one codebase for patient-facing health products.' },
                { n: 'Flutter',            s: 'flutter',         c: '02569B', desc: 'Alternative cross-platform framework — used when teams already invest in Dart and material design.' },
                { n: 'PostgreSQL',         s: 'postgresql',      c: '4169E1', desc: 'Encrypted PHI storage with row-level security, audit triggers, and pgcrypto field-level encryption.' },
                { n: 'AWS KMS',            url: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg', desc: 'Customer-managed encryption keys for PHI at rest — required for many HIPAA architectures.' },
                { n: 'Datadog',            s: 'datadog',         c: '632CA6', desc: 'HIPAA-eligible observability — APM, logs, and synthetic monitoring for clinical-uptime SLAs.' },
                { n: 'Mirth Connect',      s: 'mirth',           c: '00A0E1', desc: 'HL7 v2 integration engine — message routing between legacy hospital systems and modern apps.' },
                { n: 'Salesforce Health Cloud', s: 'salesforce', c: '00A1E0', desc: 'Care plans, patient timelines, and provider-facing CRM built on Salesforce.' },
            ]}
            hideProjects={true}
            hideTestimonial={true}
            showClients={true}
            clientsPill="Trusted By Healthcare Teams"
            clientsHeading="From Telehealth Startups to Hospital Networks,"
            clientsHeadingHighlight="We Engineer Care That Scales"
            extraSections={
                <>
                    <VitalsMonitor />
                    <ComplianceTrustWall />
                    <HealthcareVideo />
                </>
            }
            googleReviews={[
                {
                    name: 'Dr. Imani Brooks',
                    role: 'Chief Medical Officer, Brightline Health',
                    rating: 5,
                    date: '2 months ago',
                    text: 'They built our patient portal across 38 clinics with FHIR-clean EMR sync. Sign-in friction dropped 60% and our HIPAA audit passed first time without findings.',
                },
                {
                    name: 'Aiyana Patel',
                    role: 'CTO, MeridianHealth',
                    rating: 5,
                    date: '4 months ago',
                    text: 'Telemedicine platform with Twilio Video + e-prescriptions + Stripe billing. Our clinicians actually thank us when we tell them to use the new system. That has never happened before.',
                },
                {
                    name: 'Dr. Felipe Aguirre',
                    role: 'Founder, Limbic Mental Health',
                    rating: 5,
                    date: '6 months ago',
                    text: 'HIPAA-aligned mental-health app with crisis-aware in-app flows. Their security review caught two weaknesses our previous vendor had missed for two years.',
                },
                {
                    name: 'Hanna Lindgren',
                    role: 'VP Engineering, Vekta Wellness',
                    rating: 5,
                    date: '3 months ago',
                    text: 'Apple HealthKit + Google Fit integration with daily mood + workout tracking. Active retention climbed from 22% to 51% in three months post-launch.',
                },
                {
                    name: 'Dr. Karim Saleh',
                    role: 'Director of Informatics, Northwind Hospital Group',
                    rating: 5,
                    date: '5 months ago',
                    text: 'Bed-management and OT-scheduling rebuild across four hospitals. Throughput up 18%, ER wait times down 32 minutes — and the vendor lock-in is finally gone.',
                },
                {
                    name: 'Marina Petrova',
                    role: 'Head of Product, RxBridge Pharmacy',
                    rating: 5,
                    date: '7 months ago',
                    text: 'Prescription refill app with last-mile delivery integration. Adherence rates among our chronic-disease patients improved 28% in the first year.',
                },
            ]}
            googleReviewsHeading="What Healthcare Leaders Say About Us"
            googleReviewsSubtitle="Verified reviews from CMOs, CTOs, and informatics directors we've shipped clinical software with."
            faqs={[
                { q: 'Are your healthcare apps HIPAA compliant?', a: 'Yes. We design HIPAA-aligned architectures from day one — PHI encryption, BAAs with infrastructure providers, audit logs, role-based access, and breach-notification playbooks.' },
                { q: 'Do you integrate with Epic / Cerner / other EHR systems?', a: 'Yes. We build SMART-on-FHIR integrations with Epic (App Orchard), Cerner / Oracle Health, athenahealth, Allscripts, and HL7 v2 interfaces with legacy systems.' },
                { q: 'Can you build telemedicine features?', a: 'Yes. We use Twilio Video, OpenTok / Vonage, and self-hosted WebRTC for clinical-grade video consults — including waiting rooms, recording, and e-prescription flows.' },
                { q: 'Do you support wearable and IoT health devices?', a: 'Yes. We integrate with Apple HealthKit, Google Fit, Fitbit, BLE devices, and custom hardware — including secure device pairing and continuous data streaming.' },
                { q: 'What about regulatory approvals like FDA Class II?', a: 'We design with regulatory readiness in mind. For FDA Class I/II software-as-medical-device, we partner with regulatory consultants and follow IEC 62304 lifecycle processes.' },
                { q: 'How long does a healthcare app project take?', a: 'A focused MVP (e.g., a telehealth pilot) typically launches in 12–18 weeks. Full hospital-grade platforms with EHR integrations usually take 6–12 months.' },
                { q: 'Do you provide ongoing support and compliance updates?', a: 'Yes. We provide SLA-backed support, regular security patching, annual SOC 2 audits, and proactive monitoring tailored to clinical-uptime expectations.' },
            ]}
        />
    );
}
