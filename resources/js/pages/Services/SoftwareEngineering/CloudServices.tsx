import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import ServicePageTemplate, { ICON } from '@/components/ServicePageTemplate';

/* === Section 1: Multi-Cloud Hub (orbital animation with cloud provider logos) === */
const CLOUD_LOGOS = [
    { name: 'AWS',          url: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg' },
    { name: 'Microsoft Azure', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg' },
    { name: 'Google Cloud', url: 'https://cdn.simpleicons.org/googlecloud/4285F4' },
    { name: 'Oracle Cloud', url: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg' },
    { name: 'IBM Cloud',    url: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg' },
    { name: 'Alibaba Cloud',url: 'https://cdn.simpleicons.org/alibabacloud/FF6A00' },
    { name: 'Cloudflare',   url: 'https://cdn.simpleicons.org/cloudflare/F38020' },
    { name: 'DigitalOcean', url: 'https://cdn.simpleicons.org/digitalocean/0080FF' },
];

const MultiCloudHub: React.FC = () => {
    const radius = 38;
    const positions = CLOUD_LOGOS.map((_, i) => {
        const angle = (i / CLOUD_LOGOS.length) * Math.PI * 2 - Math.PI / 2;
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
                        Multi-Cloud
                    </span>
                    <h2 className="dawki-ent-hub-title">
                        Native Fluency Across Every <span>Major Cloud</span>
                    </h2>
                    <p className="dawki-ent-hub-subtitle">
                        Hyperscaler-grade engineering across the public clouds your business runs on — with the in-between for hybrid, edge, and sovereign deployments.
                    </p>
                </div>

                <div className="dawki-ent-hub-stage">
                    <svg className="dawki-ent-hub-grid" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                        <defs>
                            <linearGradient id="dawkiCloudLineGrad" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="rgba(6, 182, 212, 0.95)" />
                                <stop offset="100%" stopColor="rgba(79, 124, 255, 0.25)" />
                            </linearGradient>
                        </defs>
                        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(6, 182, 212, 0.22)" strokeWidth="0.18" strokeDasharray="0.6 0.8" />
                        <circle cx="50" cy="50" r={radius - 11} fill="none" stroke="rgba(79, 124, 255, 0.16)" strokeWidth="0.14" strokeDasharray="0.4 1.2" />
                        {positions.map((p, i) => (
                            <line
                                key={i}
                                x1="50" y1="50" x2={p.x} y2={p.y}
                                stroke="url(#dawkiCloudLineGrad)"
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
                            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
                            </svg>
                        </span>
                        <div className="dawki-ent-hub-core-label">Your Cloud Core</div>
                    </motion.div>

                    {CLOUD_LOGOS.map((logo, i) => (
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
                    <div className="dawki-ent-hub-tag"><span></span>Hyperscalers — AWS, Azure, GCP</div>
                    <div className="dawki-ent-hub-tag"><span></span>Specialty — Oracle, IBM, Alibaba</div>
                    <div className="dawki-ent-hub-tag"><span></span>Edge & CDN — Cloudflare, Fastly, Akamai</div>
                    <div className="dawki-ent-hub-tag"><span></span>Hybrid — VMware, OpenStack, Anthos</div>
                    <div className="dawki-ent-hub-tag"><span></span>Cloud-native — Kubernetes, Serverless</div>
                </div>
            </div>
        </section>
    );
};

/* === Section 2: Cloud Outcomes Dashboard ======================================== */
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

const UptimeGauge: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-40px' });
    const r = 56;
    const circ = Math.PI * r;
    const fill = (99.99 / 100) * circ;

    return (
        <div ref={ref} className="dawki-ent-out-card">
            <svg className="dawki-ent-out-gauge" viewBox="0 0 140 80">
                <defs>
                    <linearGradient id="dawkiCloudGaugeGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="50%" stopColor="#4f7cff" />
                        <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                </defs>
                <path d={`M 14 70 A ${r} ${r} 0 0 1 126 70`} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" strokeLinecap="round" />
                <motion.path
                    d={`M 14 70 A ${r} ${r} 0 0 1 126 70`}
                    fill="none"
                    stroke="url(#dawkiCloudGaugeGrad)"
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
            <div className="dawki-ent-out-label">Uptime SLA Achieved</div>
            <p className="dawki-ent-out-desc">Multi-AZ, multi-region, self-healing infrastructure that stays online — even when individual zones don't.</p>
        </div>
    );
};

const RegionsOrbit: React.FC = () => (
    <div className="dawki-ent-out-card">
        <div className="dawki-ent-out-orbit" aria-hidden="true">
            <span></span><span></span><span></span>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
        </div>
        <div className="dawki-ent-out-value">
            <CountValue target={28} />
            <span className="dawki-ent-out-suffix">+</span>
        </div>
        <div className="dawki-ent-out-label">Global Regions Live</div>
        <p className="dawki-ent-out-desc">Active deployments across AWS, Azure, and GCP regions worldwide — low-latency for every user.</p>
    </div>
);

const SavingsBars: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-40px' });
    const heights = [88, 70, 56, 44, 32];

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
                <CountValue target={42} />
                <span className="dawki-ent-out-suffix">%</span>
            </div>
            <div className="dawki-ent-out-label">Average Cost Reduction</div>
            <p className="dawki-ent-out-desc">FinOps practices — right-sizing, reservations, and spot — typically cut cloud bills by 40%+ within two quarters.</p>
        </div>
    );
};

const MigrationsLine: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-40px' });
    const path = 'M 5 60 L 25 50 L 45 55 L 65 35 L 85 28 L 105 18 L 125 10';

    return (
        <div ref={ref} className="dawki-ent-out-card">
            <svg className="dawki-ent-out-line" viewBox="0 0 130 70">
                <defs>
                    <linearGradient id="dawkiCloudLineGrad2" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                </defs>
                <motion.path
                    d={path}
                    fill="none"
                    stroke="url(#dawkiCloudLineGrad2)"
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
                <CountValue target={150} />
                <span className="dawki-ent-out-suffix">+</span>
            </div>
            <div className="dawki-ent-out-label">Workloads Migrated</div>
            <p className="dawki-ent-out-desc">From legacy on-prem to cloud-native — lifted, refactored, and optimized without unplanned downtime.</p>
        </div>
    );
};

const CloudOutcomes: React.FC = () => (
    <section className="dawki-ent-out">
        <div className="container">
            <div className="dawki-ent-out-heading">
                <span className="dawki-ent-out-pill">
                    <span></span>
                    Cloud Outcomes
                </span>
                <h2 className="dawki-ent-out-title">
                    Cloud That Actually <span>Pays Off</span>
                </h2>
                <p className="dawki-ent-out-subtitle">
                    Real outcomes from production cloud builds — uptime that holds, costs that drop, regions that scale.
                </p>
            </div>

            <div className="dawki-ent-out-grid">
                <UptimeGauge />
                <RegionsOrbit />
                <SavingsBars />
                <MigrationsLine />
            </div>
        </div>
    </section>
);

/* === Section 3: Cloud Video Showcase ============================================ */
const CloudVideo: React.FC = () => {
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
                        Inside The Cloud
                    </span>
                    <h2 className="dawki-ent-video-title">
                        Watch How We <span>Architect The Cloud</span>
                    </h2>
                    <p className="dawki-ent-video-subtitle">
                        A behind-the-scenes look at how we plan migrations, build cloud-native platforms, and run them with SLA-grade reliability.
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
export default function CloudServices() {
    return (
        <ServicePageTemplate
            pageTitle="Cloud Services"
            breadcrumbCategory="Software Engineering"
            heroPill="Software Engineering"
            heroTitleStart="Cloud"
            heroTitleHighlight="Services"
            heroSubtitle="Cloud strategy, migration, and managed services across AWS, Azure, and Google Cloud — secure, scalable, cost-optimized."
            heroVideoSrc="https://amazedveku.de/images/cloud.mp4"
            featuresPill="Cloud Done Right"
            featuresTitleStart="Cloud Foundations"
            featuresTitleHighlight="That Scale With You"
            featuresSubtitle="From greenfield builds to enterprise migrations — we engineer cloud infrastructure that's resilient, efficient, and ready for tomorrow."
            features={[
                { title: 'Multi-Cloud Expertise', desc: 'Native fluency in AWS, Azure, and GCP — and the in-between for hybrid setups.', icon: '☁️' },
                { title: 'Infrastructure as Code', desc: 'Terraform, Pulumi, and CloudFormation — every resource versioned and reviewable.', icon: '📜' },
                { title: 'Cost Optimization', desc: 'Right-sizing, reserved instances, savings plans, and FinOps practices that cut spend.', icon: '💰' },
                { title: 'Security by Default', desc: 'IAM, network segmentation, KMS, and continuous compliance monitoring.', icon: '🛡️' },
                { title: 'Auto-Scaling & HA', desc: 'Multi-AZ, multi-region architectures with self-healing infrastructure.', icon: '⚡' },
                { title: 'Observability', desc: 'Logs, metrics, traces, and dashboards via CloudWatch, Datadog, or Grafana stacks.', icon: '👁️' },
            ]}
            processSteps={[
                { n: '01', t: 'Cloud Assessment', d: 'Audit current infrastructure, workloads, costs, and readiness.' },
                { n: '02', t: 'Architecture & Plan', d: 'Design target state, migration strategy, and security baseline.' },
                { n: '03', t: 'Migrate & Build', d: 'Execute lift-and-shift or refactor with zero-downtime cutovers.' },
                { n: '04', t: 'Optimize & Operate', d: 'Continuous cost, performance, and security tuning post-migration.' },
            ]}
            servicesPill="Our Capabilities"
            servicesTitleStart="Cloud"
            servicesTitleHighlight="Services We Offer"
            servicesSubtitle="Strategy, engineering, and managed cloud services for every stage of your cloud journey."
            servicesLayout="timeline"
            serviceCards={[
                { title: 'Cloud Consulting & Strategy', desc: 'Cloud roadmap, vendor selection, total-cost-of-ownership modeling, and reference architecture.', icon: ICON.target },
                { title: 'Cloud Migration Services', desc: 'Lift-and-shift, replatforming, and refactoring of workloads to AWS, Azure, or GCP.', icon: ICON.refresh },
                { title: 'Cloud-Native Development', desc: 'Greenfield apps built on serverless, containers, and managed services for elasticity.', icon: ICON.cloud },
                { title: 'AWS Services', desc: 'EC2, ECS/EKS, Lambda, RDS, DynamoDB, S3, CloudFront, and the full AWS stack.', icon: ICON.cog },
                { title: 'Microsoft Azure Services', desc: 'AKS, App Service, Functions, Cosmos DB, Synapse, and enterprise-grade Azure builds.', icon: ICON.cog },
                { title: 'Google Cloud Services', desc: 'GKE, Cloud Run, Cloud Functions, BigQuery, and AI/ML on Vertex AI.', icon: ICON.cog },
                { title: 'Hybrid & Multi-Cloud', desc: 'Hybrid architectures with on-prem connectivity and cross-cloud workload portability.', icon: ICON.link },
                { title: 'Cloud Security & Compliance', desc: 'IAM hardening, encryption, KMS, WAF, and compliance for SOC 2, HIPAA, GDPR, ISO 27001.', icon: ICON.lock },
                { title: 'DevOps & CI/CD on Cloud', desc: 'GitHub Actions, GitLab CI, CodePipeline, and ArgoCD pipelines for fast safe releases.', icon: ICON.infinity },
                { title: 'Cloud Cost Optimization (FinOps)', desc: 'Right-sizing, reservations, savings plans, anomaly detection, and chargeback dashboards.', icon: ICON.chart },
                { title: 'Disaster Recovery & Backup', desc: 'Cross-region failover, immutable backups, and tested DR runbooks.', icon: ICON.shield },
                { title: 'Managed Cloud Services', desc: '24/7 monitoring, patching, incident response, and continuous optimization.', icon: ICON.headset },
            ]}
            toolsTitleStart="Robust Tools &"
            toolsTitleHighlight="Technologies We Work"
            toolsSubtitle="A modern cloud-native stack — provisioning, orchestration, observability, and delivery — chosen for the right job, every time."
            toolsLayout="vertical"
            tools={[
                { n: 'Terraform',     s: 'terraform',     c: '7B42BC', desc: 'Our primary IaC tool — every cloud resource declared, versioned in Git, and reviewed before it ships.' },
                { n: 'Kubernetes',    s: 'kubernetes',    c: '326CE5', desc: 'Production-grade container orchestration on EKS, AKS, and GKE — for stateless, stateful, and serverless workloads.' },
                { n: 'Docker',        s: 'docker',        c: '2496ED', desc: 'Containerization for every service — small, reproducible, and ready to deploy anywhere.' },
                { n: 'AWS',           url: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg', desc: 'Deep, certified expertise across compute, storage, networking, data, and serverless on Amazon Web Services.' },
                { n: 'Microsoft Azure', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg', desc: 'Enterprise-grade Azure builds across AKS, App Service, Functions, Cosmos DB, and Synapse.' },
                { n: 'Google Cloud',  s: 'googlecloud',   c: '4285F4', desc: 'Cloud-native and data-heavy workloads on GKE, Cloud Run, BigQuery, and Vertex AI.' },
                { n: 'Helm',          s: 'helm',          c: '0F1689', desc: 'Kubernetes package manager — every service deployed via versioned, parameterized charts.' },
                { n: 'ArgoCD',        s: 'argo',          c: 'EF7B4D', desc: 'GitOps continuous delivery for Kubernetes — Git is the source of truth, drift never happens.' },
                { n: 'Pulumi',        s: 'pulumi',        c: 'F7BF2A', desc: 'IaC in TypeScript or Python when teams want their infra to live alongside their app code.' },
                { n: 'Ansible',       s: 'ansible',       c: 'EE0000', desc: 'Configuration management and runbook automation for hybrid and on-prem fleets.' },
                { n: 'Prometheus',    s: 'prometheus',    c: 'E6522C', desc: 'Cloud-native metrics collection — every cluster, service, and SLO instrumented and alerting.' },
                { n: 'Grafana',       s: 'grafana',       c: 'F46800', desc: 'Dashboards and alerts on top of Prometheus, CloudWatch, Datadog — single pane of glass for ops.' },
                { n: 'GitHub Actions',s: 'githubactions', c: '2088FF', desc: 'CI/CD pipelines that test, build, scan, and deploy across multiple clouds and environments.' },
                { n: 'Cloudflare',    s: 'cloudflare',    c: 'F38020', desc: 'Edge, CDN, WAF, and Workers — fastest path to your users with built-in DDoS protection.' },
                { n: 'Datadog',       s: 'datadog',       c: '632CA6', desc: 'APM, logs, infrastructure metrics, and synthetic monitoring — unified across all your clouds.' },
                { n: 'Nginx',         s: 'nginx',         c: '009639', desc: 'High-performance reverse proxy, load balancer, and ingress controller for cloud and on-prem.' },
            ]}
            hideProjects={true}
            hideTestimonial={true}
            showClients={true}
            clientsPill="Trusted By Cloud-First Teams"
            clientsHeading="From SaaS Startups to Fortune 500 IT,"
            clientsHeadingHighlight="We Engineer Cloud That Performs"
            extraSections={
                <>
                    <MultiCloudHub />
                    <CloudOutcomes />
                    <CloudVideo />
                </>
            }
            googleReviews={[
                {
                    name: 'Ethan Park',
                    role: 'VP Infrastructure, Lumora SaaS',
                    rating: 5,
                    date: '2 months ago',
                    text: 'Dawki migrated our entire monolith to EKS in three months without a single customer-visible outage. Bills dropped 38% by the second quarter — the FinOps work paid for the project twice over.',
                },
                {
                    name: 'Lina Costa',
                    role: 'Head of Platform, FinFleet',
                    rating: 5,
                    date: '4 months ago',
                    text: 'Multi-region active-active on Azure with cross-region failover that we actually rehearse. They built it, documented it, and now our on-call rotation barely gets paged.',
                },
                {
                    name: 'Hassan Yousef',
                    role: 'CTO, MeshCart',
                    rating: 5,
                    date: '6 months ago',
                    text: 'GKE-based platform with autoscaling that handles our 10x weekend traffic without intervention. Their Terraform modules are the cleanest IaC I\'ve worked with.',
                },
                {
                    name: 'Olivia Brennan',
                    role: 'Director of Engineering, Northwind Retail',
                    rating: 5,
                    date: '3 months ago',
                    text: 'Hybrid cloud build connecting our on-prem warehouse systems to AWS. Zero data inconsistencies in 18 months — a result our previous integrator never came close to.',
                },
                {
                    name: 'Ravi Sundaram',
                    role: 'Cloud Architect, Helix Bio',
                    rating: 5,
                    date: '5 months ago',
                    text: 'HIPAA-compliant data platform on GCP — KMS, audit logs, segregated networks, the whole stack. Audit passed first time without findings.',
                },
                {
                    name: 'Marie Laurent',
                    role: 'Head of DevOps, AeroPay',
                    rating: 5,
                    date: '7 months ago',
                    text: 'GitOps platform with ArgoCD across three environments. Deploys went from a 90-minute manual ritual to a 3-minute pull request. Worth every cent.',
                },
            ]}
            googleReviewsHeading="What Cloud Leaders Say About Us"
            googleReviewsSubtitle="Verified reviews from CTOs, platform leads, and cloud architects we've engineered with."
            faqs={[
                { q: 'Which cloud provider should I choose — AWS, Azure, or GCP?', a: 'It depends on your existing tooling, workload type, and team skills. AWS leads in breadth, Azure integrates deeply with Microsoft stacks, GCP excels at data and AI. We help you decide based on your goals.' },
                { q: 'How long does cloud migration take?', a: 'A small workload migration takes 4–8 weeks. Enterprise migrations with hundreds of apps typically run 6–18 months in waves.' },
                { q: 'Will cloud actually save us money?', a: 'When done right, yes — usually 20–40% lower TCO over 3 years. Cost optimization (FinOps) is essential to realize the savings.' },
                { q: 'How do you ensure cloud security?', a: 'IAM least-privilege, encryption at rest and in transit, network segmentation, WAF, continuous compliance scanning, and regular audits.' },
                { q: 'Can you support hybrid or multi-cloud?', a: 'Yes. We design and operate hybrid (on-prem + cloud) and multi-cloud architectures that avoid vendor lock-in.' },
                { q: 'Do you offer 24/7 cloud managed services?', a: 'Yes. We provide SLA-backed monitoring, patching, incident response, and continuous optimization.' },
                { q: 'What about disaster recovery?', a: 'We design and test DR strategies — backups, replication, multi-region failover — tailored to your RPO/RTO requirements.' },
            ]}
        />
    );
}
