import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import ServicePageTemplate, { ICON } from '@/components/ServicePageTemplate';

/* === Section 1: DevOps Pipeline Hub (orbital with toolchain logos) ============== */
const DEVOPS_LOGOS = [
    { name: 'Jenkins',        url: 'https://cdn.simpleicons.org/jenkins/D24939' },
    { name: 'GitHub Actions', url: 'https://cdn.simpleicons.org/githubactions/2088FF' },
    { name: 'GitLab CI',      url: 'https://cdn.simpleicons.org/gitlab/FC6D26' },
    { name: 'CircleCI',       url: 'https://cdn.simpleicons.org/circleci/343434' },
    { name: 'Terraform',      url: 'https://cdn.simpleicons.org/terraform/7B42BC' },
    { name: 'Kubernetes',     url: 'https://cdn.simpleicons.org/kubernetes/326CE5' },
    { name: 'Docker',         url: 'https://cdn.simpleicons.org/docker/2496ED' },
    { name: 'Ansible',        url: 'https://cdn.simpleicons.org/ansible/EE0000' },
];

const DevOpsHub: React.FC = () => {
    const radius = 38;
    const positions = DEVOPS_LOGOS.map((_, i) => {
        const angle = (i / DEVOPS_LOGOS.length) * Math.PI * 2 - Math.PI / 2;
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
                        Toolchain
                    </span>
                    <h2 className="dawki-ent-hub-title">
                        One Pipeline, Every <span>DevOps Tool</span>
                    </h2>
                    <p className="dawki-ent-hub-subtitle">
                        We unify build, deploy, observe, and secure stages into a single source-to-production pipeline — picking the right tool at every gate.
                    </p>
                </div>

                <div className="dawki-ent-hub-stage">
                    <svg className="dawki-ent-hub-grid" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                        <defs>
                            <linearGradient id="dawkiDevOpsLineGrad" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="rgba(34, 197, 94, 0.95)" />
                                <stop offset="100%" stopColor="rgba(79, 124, 255, 0.25)" />
                            </linearGradient>
                        </defs>
                        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(34, 197, 94, 0.22)" strokeWidth="0.18" strokeDasharray="0.6 0.8" />
                        <circle cx="50" cy="50" r={radius - 11} fill="none" stroke="rgba(79, 124, 255, 0.16)" strokeWidth="0.14" strokeDasharray="0.4 1.2" />
                        {positions.map((p, i) => (
                            <line
                                key={i}
                                x1="50" y1="50" x2={p.x} y2={p.y}
                                stroke="url(#dawkiDevOpsLineGrad)"
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
                                <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z" />
                            </svg>
                        </span>
                        <div className="dawki-ent-hub-core-label">Your Pipeline</div>
                    </motion.div>

                    {DEVOPS_LOGOS.map((logo, i) => (
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
                    <div className="dawki-ent-hub-tag"><span></span>CI/CD — Jenkins, GitHub Actions, GitLab</div>
                    <div className="dawki-ent-hub-tag"><span></span>IaC — Terraform, Pulumi, Ansible</div>
                    <div className="dawki-ent-hub-tag"><span></span>Containers — Docker, Kubernetes, Helm</div>
                    <div className="dawki-ent-hub-tag"><span></span>GitOps — ArgoCD, Flux</div>
                    <div className="dawki-ent-hub-tag"><span></span>Observability — Prometheus, Grafana, Datadog</div>
                </div>
            </div>
        </section>
    );
};

/* === Section 2: DevOps Outcomes Dashboard ======================================= */
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

const DeploySuccessGauge: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-40px' });
    const r = 56;
    const circ = Math.PI * r;
    const fill = (99.95 / 100) * circ;

    return (
        <div ref={ref} className="dawki-ent-out-card">
            <svg className="dawki-ent-out-gauge" viewBox="0 0 140 80">
                <defs>
                    <linearGradient id="dawkiDoGaugeGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="50%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#4f7cff" />
                    </linearGradient>
                </defs>
                <path d={`M 14 70 A ${r} ${r} 0 0 1 126 70`} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" strokeLinecap="round" />
                <motion.path
                    d={`M 14 70 A ${r} ${r} 0 0 1 126 70`}
                    fill="none"
                    stroke="url(#dawkiDoGaugeGrad)"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={circ}
                    initial={{ strokeDashoffset: circ }}
                    animate={{ strokeDashoffset: inView ? circ - fill : circ }}
                    transition={{ duration: 1.6, ease: [0.2, 0.8, 0.2, 1] }}
                />
            </svg>
            <div className="dawki-ent-out-value">
                <CountValue target={99.95} decimals={2} />
                <span className="dawki-ent-out-suffix">%</span>
            </div>
            <div className="dawki-ent-out-label">Successful Deployments</div>
            <p className="dawki-ent-out-desc">Automated tests, security gates, and progressive rollouts catch issues before they reach production.</p>
        </div>
    );
};

const ToolchainOrbit: React.FC = () => (
    <div className="dawki-ent-out-card">
        <div className="dawki-ent-out-orbit" aria-hidden="true">
            <span></span><span></span><span></span>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
        </div>
        <div className="dawki-ent-out-value">
            <CountValue target={20} />
            <span className="dawki-ent-out-suffix">+</span>
        </div>
        <div className="dawki-ent-out-label">Tools In Our Toolchain</div>
        <p className="dawki-ent-out-desc">From CI/CD to GitOps, IaC to observability — chosen, integrated, and operated as a single platform.</p>
    </div>
);

const VelocityBars: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-40px' });
    const heights = [22, 38, 52, 70, 92];

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
                <CountValue target={50} />
                <span className="dawki-ent-out-suffix">×</span>
            </div>
            <div className="dawki-ent-out-label">Faster Deployment Velocity</div>
            <p className="dawki-ent-out-desc">Teams typically go from weekly releases to dozens of safe deployments per day after our pipeline rollout.</p>
        </div>
    );
};

const MttrLine: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-40px' });
    const path = 'M 5 60 L 25 50 L 45 55 L 65 35 L 85 28 L 105 18 L 125 10';

    return (
        <div ref={ref} className="dawki-ent-out-card">
            <svg className="dawki-ent-out-line" viewBox="0 0 130 70">
                <defs>
                    <linearGradient id="dawkiDoLineGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="100%" stopColor="#4f7cff" />
                    </linearGradient>
                </defs>
                <motion.path
                    d={path}
                    fill="none"
                    stroke="url(#dawkiDoLineGrad)"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: inView ? 1 : 0 }}
                    transition={{ duration: 1.8, ease: [0.2, 0.8, 0.2, 1] }}
                />
                <motion.circle
                    cx="125" cy="10" r="3.5"
                    fill="#4f7cff"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0 }}
                    transition={{ delay: 1.6, duration: 0.5 }}
                />
            </svg>
            <div className="dawki-ent-out-value">
                <CountValue target={80} />
                <span className="dawki-ent-out-suffix">%</span>
            </div>
            <div className="dawki-ent-out-label">Faster Incident Recovery</div>
            <p className="dawki-ent-out-desc">SLO-driven on-call, runbooks, and chaos drills cut mean-time-to-recovery from hours to minutes.</p>
        </div>
    );
};

const DevOpsOutcomes: React.FC = () => (
    <section className="dawki-ent-out">
        <div className="container">
            <div className="dawki-ent-out-heading">
                <span className="dawki-ent-out-pill">
                    <span></span>
                    Engineering Outcomes
                </span>
                <h2 className="dawki-ent-out-title">
                    Ship More. <span>Break Less.</span>
                </h2>
                <p className="dawki-ent-out-subtitle">
                    Real DORA-grade metrics from teams running the platforms we built — measured every week, improved every sprint.
                </p>
            </div>

            <div className="dawki-ent-out-grid">
                <DeploySuccessGauge />
                <ToolchainOrbit />
                <VelocityBars />
                <MttrLine />
            </div>
        </div>
    </section>
);

/* === Section 3: DevOps Video Showcase =========================================== */
const DevOpsVideo: React.FC = () => {
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
                        Inside The Pipeline
                    </span>
                    <h2 className="dawki-ent-video-title">
                        Watch How We <span>Ship Without Breaking</span>
                    </h2>
                    <p className="dawki-ent-video-subtitle">
                        A behind-the-scenes look at how we design pipelines, automate infrastructure, and run platforms that engineers love and customers never notice.
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
export default function DevOpsServices() {
    return (
        <ServicePageTemplate
            pageTitle="DevOps Services"
            breadcrumbCategory="Software Engineering"
            heroPill="Software Engineering"
            heroTitleStart="DevOps"
            heroTitleHighlight="Services"
            heroSubtitle="Ship faster with safer releases — CI/CD, infrastructure as code, container orchestration, and 24/7 SRE for high-velocity teams."
            heroBgImage="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80"
            featuresPill="Velocity & Reliability"
            featuresTitleStart="Engineering That"
            featuresTitleHighlight="Ships Without Breaking"
            featuresSubtitle="From source to production in minutes. We modernize delivery pipelines so teams ship more often with less risk and fewer outages."
            features={[
                { title: 'Automated CI/CD Pipelines', desc: 'Source-to-production pipelines with automated tests, security scans, and approvals.', icon: '🔄' },
                { title: 'Infrastructure as Code', desc: 'Terraform, Pulumi, and Ansible — every resource versioned, reviewable, and reproducible.', icon: '📜' },
                { title: 'Container Orchestration', desc: 'Docker and Kubernetes done right — production-grade clusters with autoscaling and HA.', icon: '🐳' },
                { title: 'Observability Stack', desc: 'Logs, metrics, traces, and alerts via Prometheus, Grafana, Datadog, or New Relic.', icon: '👁️' },
                { title: 'Security & Compliance (DevSecOps)', desc: 'Secret management, SAST/DAST, container scanning, and policy as code from day one.', icon: '🛡️' },
                { title: 'GitOps Workflows', desc: 'ArgoCD and Flux for declarative, audited, self-healing deployments.', icon: '🌀' },
            ]}
            processSteps={[
                { n: '01', t: 'DevOps Audit', d: 'Assess current pipelines, infrastructure, bottlenecks, and risks.' },
                { n: '02', t: 'Roadmap & Tooling', d: 'Pick the right toolchain and design a phased adoption plan.' },
                { n: '03', t: 'Implement & Automate', d: 'Stand up CI/CD, IaC, observability, and security guardrails.' },
                { n: '04', t: 'Operate & Improve', d: 'Continuous improvement on lead time, MTTR, and deployment frequency.' },
            ]}
            servicesPill="Our Capabilities"
            servicesTitleStart="DevOps"
            servicesTitleHighlight="Services We Offer"
            servicesSubtitle="A full DevOps practice — automation, infrastructure, security, and reliability engineering for modern teams."
            servicesLayout="timeline"
            serviceCards={[
                { title: 'DevOps Consulting & Strategy', desc: 'Maturity assessments, toolchain selection, and adoption roadmaps for engineering organizations.', icon: ICON.target },
                { title: 'CI/CD Pipeline Engineering', desc: 'GitHub Actions, GitLab CI, Jenkins, CircleCI — automated builds, tests, and deployments.', icon: ICON.refresh },
                { title: 'Infrastructure as Code', desc: 'Terraform, Pulumi, CloudFormation, Ansible — reproducible infrastructure across environments.', icon: ICON.code },
                { title: 'Containerization Services', desc: 'Dockerize legacy and new apps with secure, slim images and multi-stage builds.', icon: ICON.box },
                { title: 'Kubernetes Services', desc: 'EKS, AKS, GKE, and self-managed clusters — networking, storage, and autoscaling done right.', icon: ICON.cog },
                { title: 'Cloud Automation', desc: 'Auto-scaling, scheduled scaling, and event-driven automation for cost and performance.', icon: ICON.cloud },
                { title: 'DevSecOps Services', desc: 'Shift-left security — SAST, DAST, secret scanning, container scanning, and policy as code.', icon: ICON.lock },
                { title: 'Monitoring & Observability', desc: 'Prometheus, Grafana, Datadog, ELK — full-stack visibility into metrics, logs, and traces.', icon: ICON.eye },
                { title: 'Site Reliability Engineering (SRE)', desc: 'SLOs, error budgets, on-call processes, and chaos engineering for production resilience.', icon: ICON.shield },
                { title: 'GitOps Implementation', desc: 'ArgoCD and Flux for declarative deployments backed by Git as the single source of truth.', icon: ICON.infinity },
                { title: 'Release Management', desc: 'Blue-green, canary, and feature-flag releases with automated rollbacks.', icon: ICON.rocket },
                { title: 'Managed DevOps Services', desc: '24/7 platform engineering and SRE for production environments.', icon: ICON.headset },
            ]}
            toolsTitleStart="Robust Tools &"
            toolsTitleHighlight="Technologies We Work"
            toolsSubtitle="A pragmatic DevOps stack — chosen for the right job, integrated cleanly, and operated as a single platform."
            toolsLayout="vertical"
            tools={[
                { n: 'Terraform',     s: 'terraform',     c: '7B42BC', desc: 'Our default IaC — every cloud resource declared, versioned in Git, and reviewed before it merges.' },
                { n: 'Kubernetes',    s: 'kubernetes',    c: '326CE5', desc: 'Production-grade orchestration on EKS, AKS, GKE, and bare-metal — the platform we operate on most.' },
                { n: 'Docker',        s: 'docker',        c: '2496ED', desc: 'Slim, multi-stage images with reproducible builds, signed and scanned at every stage.' },
                { n: 'Jenkins',       s: 'jenkins',       c: 'D24939', desc: 'Long-standing CI workhorse — declarative pipelines, shared libraries, and battle-tested plugins.' },
                { n: 'GitHub Actions',s: 'githubactions', c: '2088FF', desc: 'Modern Git-native CI/CD — reusable workflows, OIDC to clouds, native artifact handling.' },
                { n: 'GitLab CI',     s: 'gitlab',        c: 'FC6D26', desc: 'End-to-end DevOps platform — repo, CI, registry, and security scanning in one tool.' },
                { n: 'CircleCI',      s: 'circleci',      c: '343434', desc: 'Fast, parallel CI with smart caching — great fit for teams that prioritize feedback speed.' },
                { n: 'ArgoCD',        s: 'argo',          c: 'EF7B4D', desc: 'GitOps continuous delivery for Kubernetes — Git is the source of truth, drift never happens.' },
                { n: 'Helm',          s: 'helm',          c: '0F1689', desc: 'Kubernetes package manager — every service deployed via versioned, parameterized charts.' },
                { n: 'Ansible',       s: 'ansible',       c: 'EE0000', desc: 'Agentless config management for hybrid fleets, playbook-driven runbooks, and automation.' },
                { n: 'Prometheus',    s: 'prometheus',    c: 'E6522C', desc: 'Cloud-native metrics collection — every cluster, service, and SLO instrumented and alerting.' },
                { n: 'Grafana',       s: 'grafana',       c: 'F46800', desc: 'Dashboards and alerts on top of Prometheus, Loki, Datadog — single pane of glass for engineers.' },
                { n: 'Datadog',       s: 'datadog',       c: '632CA6', desc: 'APM, logs, infrastructure metrics, and synthetic monitoring — unified observability for production.' },
                { n: 'SonarQube',     s: 'sonarqube',     c: '4E9BCD', desc: 'Code quality, security hotspots, and tech-debt tracking — gates on every pull request.' },
                { n: 'HashiCorp Vault', s: 'vault',       c: '000000', desc: 'Secrets management for tokens, certs, and dynamic credentials — zero secrets in code or configs.' },
                { n: 'Nginx',         s: 'nginx',         c: '009639', desc: 'High-performance reverse proxy, load balancer, and ingress controller for cloud and on-prem.' },
            ]}
            hideProjects={true}
            hideTestimonial={true}
            showClients={true}
            clientsPill="Trusted By Platform Teams"
            clientsHeading="From Lean Startups to Enterprise IT,"
            clientsHeadingHighlight="We Engineer Pipelines That Hold Up"
            extraSections={
                <>
                    <DevOpsHub />
                    <DevOpsOutcomes />
                    <DevOpsVideo />
                </>
            }
            googleReviews={[
                {
                    name: 'Jonas Albrecht',
                    role: 'Head of Platform, Vekta SaaS',
                    rating: 5,
                    date: '2 months ago',
                    text: 'Dawki rebuilt our deploy pipeline on GitHub Actions and ArgoCD. We went from one deploy a week (with a maintenance window) to twenty deploys a day with zero downtime since.',
                },
                {
                    name: 'Karen Whitfield',
                    role: 'VP Engineering, Brightline Health',
                    rating: 5,
                    date: '4 months ago',
                    text: 'Their DevSecOps work caught two CVEs the day they were published — automated scanning blocked the vulnerable images from ever reaching production. That alone justified the engagement.',
                },
                {
                    name: 'Diego Fernández',
                    role: 'SRE Lead, MeshCart',
                    rating: 5,
                    date: '6 months ago',
                    text: 'Multi-cluster Kubernetes platform with Helm and Argo. Our deploy time dropped from 90 minutes to 4 minutes, and the runbooks they wrote are the cleanest I have ever seen.',
                },
                {
                    name: 'Anna Volkov',
                    role: 'Director of DevOps, FinFleet',
                    rating: 5,
                    date: '3 months ago',
                    text: 'Terraform modules so clean we adopted them as our internal standard. Their FinOps tagging strategy alone saved us six figures the first year.',
                },
                {
                    name: 'Rashid Khan',
                    role: 'Engineering Manager, Pulse Media',
                    rating: 5,
                    date: '5 months ago',
                    text: 'On-call used to be a 3 AM nightmare. With the SLO-driven alerting and runbooks they set up, our pages dropped 70% and the ones we get are actually actionable.',
                },
                {
                    name: 'Sarah Linwood',
                    role: 'CTO, AeroPay',
                    rating: 5,
                    date: '7 months ago',
                    text: 'GitOps from day one — every change is a pull request, every deploy is auditable. New engineers ship to production on day three. That used to take six weeks.',
                },
            ]}
            googleReviewsHeading="What Platform Leaders Say About Us"
            googleReviewsSubtitle="Verified reviews from CTOs, SRE leads, and platform engineers we've shipped pipelines with."
            faqs={[
                { q: 'What are DevOps services?', a: 'DevOps services bring development and operations together with automation, CI/CD, infrastructure as code, and observability — so teams ship software faster and more reliably.' },
                { q: 'How do DevOps practices help my business?', a: 'Faster releases, fewer outages, lower infrastructure costs, and happier engineers. Most teams see lead-time-to-production drop from days to hours.' },
                { q: 'Which CI/CD tools do you work with?', a: 'GitHub Actions, GitLab CI, Jenkins, CircleCI, Bitbucket Pipelines, and Azure DevOps — chosen based on your existing stack.' },
                { q: 'Do you set up Kubernetes from scratch?', a: 'Yes. We provision and harden EKS/AKS/GKE clusters and self-managed clusters, including networking, ingress, storage, and autoscaling.' },
                { q: 'How does DevSecOps fit in?', a: 'Security is built into the pipeline — SAST/DAST, secret scanning, container scanning, IaC scanning, and policy enforcement at every stage.' },
                { q: 'Can you offer 24/7 DevOps support?', a: 'Yes. We provide on-call, SRE coverage, monitoring, and incident response with SLAs.' },
                { q: 'How long does a typical DevOps engagement take?', a: 'Foundational pipelines and IaC usually take 4–8 weeks. Full DevOps transformations typically run 4–6 months.' },
            ]}
        />
    );
}
