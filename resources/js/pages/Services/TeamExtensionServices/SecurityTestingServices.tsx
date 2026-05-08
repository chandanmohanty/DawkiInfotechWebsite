import React from 'react';
import { motion } from 'framer-motion';
import ServicePageTemplate, { ICON } from '@/components/ServicePageTemplate';

/* ===========================================================================
 * Section 1: Pentest Kill-Chain — 5-phase horizontal stepper with connecting
 * arrows. Visually different from the vertical "sprint timeline" used on the
 * other Other-Services pages so this page reads with its own identity.
 * =========================================================================== */
type KillChainPhase = {
    n: string;
    name: string;
    desc: string;
    icon: React.ReactNode;
    a: string; b: string; glow: string;
};

const KILL_CHAIN: KillChainPhase[] = [
    {
        n: '01',
        name: 'Recon',
        desc: 'Passive intel — DNS, OSINT, leaked creds, GitHub, cloud footprint mapped without touching the target.',
        a: '#06b6d4', b: '#4f7cff', glow: 'rgba(6, 182, 212, 0.40)',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
        ),
    },
    {
        n: '02',
        name: 'Mapping',
        desc: 'Active enumeration — services, ports, app routes, auth flows, and the full attack surface catalogued.',
        a: '#4f7cff', b: '#a855f7', glow: 'rgba(91, 158, 255, 0.40)',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="1 6 8 3 16 6 23 3 23 18 16 21 8 18 1 21 1 6" />
                <line x1="8" y1="3" x2="8" y2="18" />
                <line x1="16" y1="6" x2="16" y2="21" />
            </svg>
        ),
    },
    {
        n: '03',
        name: 'Exploitation',
        desc: 'Controlled attacks — OWASP Top 10, business-logic bugs, auth bypass, and chained exploits actually run.',
        a: '#a855f7', b: '#ec4899', glow: 'rgba(168, 85, 247, 0.40)',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
        ),
    },
    {
        n: '04',
        name: 'Post-Exploit',
        desc: 'Lateral movement, privilege escalation, data exfil paths, and pivot routes — measured to show real impact.',
        a: '#ec4899', b: '#f97316', glow: 'rgba(236, 72, 153, 0.40)',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 12h4l3-9 4 18 3-9h4" />
            </svg>
        ),
    },
    {
        n: '05',
        name: 'Reporting',
        desc: 'CVSS-scored findings, video PoCs, reproduction steps, and exec summary — plus a free retest after fixes.',
        a: '#22c55e', b: '#06b6d4', glow: 'rgba(34, 197, 94, 0.40)',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <polyline points="9 15 11 17 15 13" />
            </svg>
        ),
    },
];

const KillChainStepper: React.FC = () => (
    <section className="dawki-sec-chain">
        <div className="container">
            <div className="dawki-sec-chain-heading">
                <span className="dawki-sec-chain-pill">
                    <span></span>
                    Pentest Kill-Chain
                </span>
                <h2 className="dawki-sec-chain-title">
                    How a Real Engagement <span>Actually Runs</span>
                </h2>
                <p className="dawki-sec-chain-subtitle">
                    Five phases — adversary-emulated, fully scoped, and walked through with you in weekly checkpoint calls. No black-box mystique, no surprise findings on report day.
                </p>
            </div>

            <motion.div
                className="dawki-sec-chain-track"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
                }}
            >
                {KILL_CHAIN.map((p, i) => (
                    <React.Fragment key={p.n}>
                        <motion.article
                            className="dawki-sec-chain-card"
                            style={{
                                ['--kc-a' as string]: p.a,
                                ['--kc-b' as string]: p.b,
                                ['--kc-glow' as string]: p.glow,
                            }}
                            variants={{
                                hidden: { opacity: 0, y: 30, scale: 0.95 },
                                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] } },
                            }}
                        >
                            <span className="dawki-sec-chain-num">{p.n}</span>
                            <span className="dawki-sec-chain-icon">{p.icon}</span>
                            <h3 className="dawki-sec-chain-name">{p.name}</h3>
                            <p className="dawki-sec-chain-desc">{p.desc}</p>
                        </motion.article>
                        {i < KILL_CHAIN.length - 1 && (
                            <span className="dawki-sec-chain-arrow" aria-hidden="true">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </span>
                        )}
                    </React.Fragment>
                ))}
            </motion.div>
        </div>
    </section>
);

/* ===========================================================================
 * Section 2: Threat Coverage Matrix — compact grid of vulnerability classes
 * we test for, each with its severity stripe + reference standard. Shows
 * breadth at a glance — visually distinct from the kill-chain stepper above.
 * =========================================================================== */
type ThreatCategory = {
    code: string;
    title: string;
    desc: string;
    severity: 'Critical' | 'High' | 'Medium';
    family: 'Web' | 'API' | 'Mobile' | 'Cloud';
};

const THREATS: ThreatCategory[] = [
    { code: 'A01', title: 'Broken Access Control',          desc: 'IDOR, BOLA, missing authorization checks, privilege escalation via parameter tampering.',         severity: 'Critical', family: 'Web' },
    { code: 'A02', title: 'Cryptographic Failures',         desc: 'Weak ciphers, exposed keys, missing TLS, predictable tokens, plaintext data at rest.',           severity: 'High',     family: 'Web' },
    { code: 'A03', title: 'Injection',                      desc: 'SQLi, NoSQLi, command injection, XSS (reflected, stored, DOM), template, and LDAP injection.',  severity: 'Critical', family: 'Web' },
    { code: 'A04', title: 'Insecure Design',                desc: 'Missing rate limits, race conditions, business-logic flaws, anti-automation gaps.',              severity: 'High',     family: 'Web' },
    { code: 'A05', title: 'Security Misconfiguration',      desc: 'Default creds, verbose errors, open admin paths, missing security headers, S3 buckets.',         severity: 'High',     family: 'Cloud' },
    { code: 'A06', title: 'Vulnerable Components',          desc: 'Outdated libraries with known CVEs in dependency tree — front-end + back-end + container.',     severity: 'High',     family: 'Web' },
    { code: 'A07', title: 'Auth & Session Failures',        desc: 'Weak password policy, MFA bypass, session fixation, predictable tokens, JWT misuse.',           severity: 'Critical', family: 'Web' },
    { code: 'A08', title: 'Data Integrity Failures',        desc: 'Insecure deserialization, unsigned updates, supply-chain risks in CI/CD pipelines.',            severity: 'High',     family: 'Web' },
    { code: 'A09', title: 'Logging & Monitoring Gaps',      desc: 'Missing audit logs, alerting blind-spots, undetectable lateral movement.',                       severity: 'Medium',   family: 'Cloud' },
    { code: 'A10', title: 'SSRF',                           desc: 'Server-side request forgery — exfiltrating cloud metadata, internal services, secrets.',         severity: 'High',     family: 'Web' },
    { code: 'API', title: 'API Top 10 Coverage',            desc: 'BOLA, BFLA, mass assignment, security misconfig, unsafe consumption — REST + GraphQL + gRPC.',  severity: 'Critical', family: 'API' },
    { code: 'MOB', title: 'Mobile (MASVS)',                 desc: 'Reverse engineering, insecure data storage, IPC abuse, weak biometric flows on iOS + Android.', severity: 'High',     family: 'Mobile' },
];

const SEVERITY_COLORS: Record<ThreatCategory['severity'], { a: string; b: string }> = {
    Critical: { a: '#ef4444', b: '#f97316' },
    High:     { a: '#f97316', b: '#fbbf24' },
    Medium:   { a: '#eab308', b: '#22c55e' },
};

const FAMILY_LABEL: Record<ThreatCategory['family'], string> = {
    Web: 'Web',
    API: 'API',
    Mobile: 'Mobile',
    Cloud: 'Cloud',
};

const ThreatMatrix: React.FC = () => (
    <section className="dawki-sec-matrix">
        <div className="container">
            <div className="dawki-sec-matrix-heading">
                <span className="dawki-sec-matrix-pill">
                    <span></span>
                    Threat Coverage
                </span>
                <h2 className="dawki-sec-matrix-title">
                    Every Class of Bug We <span>Hunt For You</span>
                </h2>
                <p className="dawki-sec-matrix-subtitle">
                    OWASP Top 10 (Web), API Top 10, MASVS (Mobile), and CIS Cloud Controls — every category checked manually + with industry-leading scanners.
                </p>
            </div>

            <motion.div
                className="dawki-sec-matrix-grid"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
                }}
            >
                {THREATS.map((t) => {
                    const sev = SEVERITY_COLORS[t.severity];
                    return (
                        <motion.article
                            key={t.code + t.title}
                            className={`dawki-sec-matrix-card dawki-sec-matrix-card--${t.severity.toLowerCase()}`}
                            style={{
                                ['--sev-a' as string]: sev.a,
                                ['--sev-b' as string]: sev.b,
                            }}
                            variants={{
                                hidden: { opacity: 0, y: 16 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] } },
                            }}
                        >
                            <div className="dawki-sec-matrix-card-head">
                                <span className="dawki-sec-matrix-code">{t.code}</span>
                                <span className="dawki-sec-matrix-family">{FAMILY_LABEL[t.family]}</span>
                                <span className="dawki-sec-matrix-sev">{t.severity}</span>
                            </div>
                            <h4 className="dawki-sec-matrix-title-text">{t.title}</h4>
                            <p className="dawki-sec-matrix-desc">{t.desc}</p>
                        </motion.article>
                    );
                })}
            </motion.div>
        </div>
    </section>
);

/* ===========================================================================
 * Page
 * =========================================================================== */
export default function SecurityTestingServices() {
    return (
        <ServicePageTemplate
            pageTitle="Security Testing Services"
            breadcrumbCategory="Team Extension Services"
            heroPill="Team Extension Services"
            heroTitleStart="Security"
            heroTitleHighlight="Testing Services"
            heroSubtitle="Penetration testing, vulnerability assessments, and continuous security testing — find issues before attackers do."
            heroVideoSrc="/assets/images/header/demo/automated-testing-services.mp4"
            featuresPill="Defensive Security"
            featuresTitleStart="Find Vulnerabilities"
            featuresTitleHighlight="Before Attackers Do"
            featuresSubtitle="From web apps to cloud infrastructure — we run rigorous security tests aligned to OWASP, NIST, and CIS standards."
            features={[
                { title: 'OWASP-Aligned Testing',   desc: 'Web, mobile, and API testing against OWASP Top 10 and ASVS.', icon: '🛡️' },
                { title: 'Penetration Testing',     desc: 'Manual and automated black-, gray-, and white-box pentests by certified testers.', icon: '🎯' },
                { title: 'Cloud & Infra Security',  desc: 'AWS, Azure, GCP misconfiguration scans and architecture reviews.', icon: '☁️' },
                { title: 'AI-Augmented Testing',    desc: 'Copilot + LLM agents triage, deduplicate, and prioritize findings — humans verify every critical.', icon: '🤖' },
                { title: 'Compliance Testing',      desc: 'SOC 2, ISO 27001, HIPAA, PCI DSS, and GDPR readiness tests.', icon: '📋' },
                { title: 'Detailed Remediation',    desc: 'Findings with severity, reproduction steps, and clear fix guidance.', icon: '📝' },
            ]}
            processSteps={[
                { n: '01', t: 'Scope',           d: 'Define targets, methodology, rules of engagement, and success criteria.' },
                { n: '02', t: 'Test',            d: 'Manual and automated testing with continuous communication on critical findings.' },
                { n: '03', t: 'Report',          d: 'Detailed report with severity, evidence, and remediation guidance.' },
                { n: '04', t: 'Retest & Certify',d: 'Validate fixes and issue clean retest reports.' },
            ]}
            servicesPill="Our Capabilities"
            servicesTitleStart="Security Testing"
            servicesTitleHighlight="Services We Offer"
            servicesSubtitle="A full security testing practice — across applications, APIs, mobile, cloud, and infrastructure."
            servicesLayout="timeline"
            serviceCards={[
                { title: 'Web Application Penetration Testing',     desc: 'Black-, gray-, and white-box pentests aligned to OWASP Top 10 and ASVS.', icon: ICON.globe },
                { title: 'Mobile App Penetration Testing',          desc: 'iOS and Android pentesting per OWASP MASVS — including reverse engineering.', icon: ICON.rocket },
                { title: 'API Security Testing',                    desc: 'REST/GraphQL/gRPC security testing aligned to OWASP API Top 10.', icon: ICON.code },
                { title: 'Cloud Security Assessments',              desc: 'AWS, Azure, GCP configuration reviews against CIS benchmarks.', icon: ICON.cloud },
                { title: 'Network Penetration Testing',             desc: 'Internal and external network pentests for on-prem and hybrid environments.', icon: ICON.link },
                { title: 'Infrastructure Vulnerability Assessment', desc: 'Continuous vulnerability scanning of servers, containers, and dependencies.', icon: ICON.search },
                { title: 'DevSecOps Implementation',                desc: 'SAST, DAST, SCA, secret scanning, and IaC scanning embedded in CI/CD.', icon: ICON.refresh },
                { title: 'Threat Modeling',                         desc: 'STRIDE / PASTA threat modeling sessions for new and existing systems.', icon: ICON.target },
                { title: 'Compliance & Audit Support',              desc: 'SOC 2, ISO 27001, HIPAA, PCI DSS, GDPR readiness tests and audit support.', icon: ICON.shield },
                { title: 'Source Code Review',                      desc: 'Manual and automated security review of source code with prioritized findings.', icon: ICON.eye },
                { title: 'Red Team Engagements',                    desc: 'Goal-based adversarial simulations against people, process, and technology.', icon: ICON.bot },
                { title: 'Continuous Security Monitoring',          desc: 'Ongoing scanning, retesting, and managed vulnerability management.', icon: ICON.headset },
            ]}
            toolsTitleStart="Pentest, AI &"
            toolsTitleHighlight="Defensive Security Stack"
            toolsSubtitle="Industry-standard scanners + AI-powered triage tools that our certified testers run on every engagement."
            toolsLayout="vertical"
            tools={[
                { n: 'Burp Suite Pro',   s: 'portswigger',          c: 'FF6633', desc: 'Industry-leading web app pentesting platform — request manipulation, intruder, and Bambdas.' },
                { n: 'Metasploit',       s: 'metasploit',           c: '2596CD', desc: 'Exploitation framework for validated proof-of-concept and post-exploitation pivoting.' },
                { n: 'Nessus / Tenable', s: 'tenable',              c: '00A89E', desc: 'Authenticated and unauthenticated vulnerability scanning across networks and cloud.' },
                { n: 'OWASP ZAP',        s: 'owasp',                c: '000000', desc: 'Open-source DAST integrated into CI/CD for continuous web app security feedback.' },
                { n: 'GitHub Adv. Security', s: 'github',           c: '181717', desc: 'CodeQL semantic code analysis + secret scanning + Dependabot — pull-request-level signal.' },
                { n: 'Snyk',             s: 'snyk',                 c: '4C4A73', desc: 'AI-powered SAST + SCA + container + IaC scanning — fix-first developer-friendly findings.' },
                { n: 'Semgrep',          s: 'semgrep',              c: '1B65F1', desc: 'Pattern-based static analysis — custom rules for our common bug classes and frameworks.' },
                { n: 'SonarQube',        s: 'sonarqube',            c: '4E9BCD', desc: 'Code quality + security scanning across 30+ languages with PR decoration.' },
                { n: 'Checkmarx',        s: 'checkmarx',            c: '5FBA47', desc: 'Enterprise SAST + SCA with high-precision rules — used on regulated client engagements.' },
                { n: 'Wiz',              s: 'wiz',                  c: '6651F1', desc: 'Agentless cloud-native security — AWS, Azure, GCP misconfig + workload risk in minutes.' },
                { n: 'CrowdStrike Falcon', s: 'crowdstrike',        c: 'FA0F00', desc: 'AI-driven EDR + threat hunting — used in our continuous monitoring engagements.' },
                { n: 'Microsoft Security Copilot', s: 'microsoft',  c: '0078D4', desc: 'GenAI assistant for triage, alert summarization, and incident response acceleration.' },
                { n: 'Darktrace',        s: 'darktrace',            c: '781CFF', desc: 'Self-learning AI for network behaviour anomalies — early detection of novel attacks.' },
                { n: 'OpenAI / GPT-4',   s: 'openai',               c: '412991', desc: 'Custom finding triage, exploit chaining hypotheses, and exec-summary report generation.' },
                { n: 'Splunk',           s: 'splunk',               c: '000000', desc: 'SIEM + SOAR for log analysis, alerting, and our managed-detection engagements.' },
             ]}
            hideProjects={true}
            hideTestimonial={true}
            showClients={true}
            clientsPill="Trusted By Security & Compliance Leaders"
            clientsHeading="From Series-A SaaS to Regulated Enterprises,"
            clientsHeadingHighlight="We Find Bugs Before Attackers Do"
            extraSections={
                <>
                    <KillChainStepper />
                    <ThreatMatrix />
                </>
            }
            googleReviews={[
                {
                    name: 'Liam Castellanos',
                    role: 'CISO, Vaultpath FinTech',
                    rating: 5,
                    date: '2 months ago',
                    text: 'Our SOC 2 Type II engagement passed on the first audit because Dawki found and walked us through 17 findings — including two critical IDORs — with reproduction steps and clean retest within four weeks.',
                },
                {
                    name: 'Aïsha N\'Diaye',
                    role: 'Head of Security, Riverline Health',
                    rating: 5,
                    date: '4 months ago',
                    text: 'HIPAA-grade pentest of our patient portal and provider APIs. They surfaced two PHI-leak paths and a session-fixation issue our internal team had missed for two years. Genuinely the best report we have ever received.',
                },
                {
                    name: 'Kenji Park',
                    role: 'VP Engineering, Stratoflow Cloud',
                    rating: 5,
                    date: '6 months ago',
                    text: 'Cloud security review of our entire AWS estate — 200+ accounts, dozens of misconfigurations, plus an SSRF chain that exposed metadata service. The remediation guide alone was worth the engagement.',
                },
                {
                    name: 'Marina Volkov',
                    role: 'Engineering Manager, Polestar Logistics',
                    rating: 5,
                    date: '3 months ago',
                    text: 'They embedded SAST + DAST into our GitHub Actions in two sprints and still ran a full external pentest on top. Build-time feedback dropped our prod vuln rate by 70% in a quarter.',
                },
                {
                    name: 'Owen Hartwell',
                    role: 'Founder, Ledgerstrike',
                    rating: 5,
                    date: '5 months ago',
                    text: 'Pre-launch pentest for our trading platform. They found an authentication bypass we would have shipped to production. We owe the entire company\'s reputation to that one finding.',
                },
                {
                    name: 'Lucia Ferraro',
                    role: 'CTO, Northbeam Mobility',
                    rating: 5,
                    date: '7 months ago',
                    text: 'Mobile MASVS-level testing of our iOS + Android apps including reverse engineering. They also pre-screened our App Store submission for App Privacy Report. Zero rejections, zero post-launch CVEs.',
                },
            ]}
            googleReviewsHeading="What Security Leaders Say About Working With Us"
            googleReviewsSubtitle="Verified reviews from CISOs, Heads of Security, and engineering managers we've delivered pentests + assessments for."
            faqs={[
                { q: 'What is security testing?',
                  a: 'Security testing identifies vulnerabilities in applications, APIs, infrastructure, and processes through manual and automated techniques aligned to industry standards.' },
                { q: 'Are your testers certified?',
                  a: 'Yes. Our team holds OSCP, OSWE, OSEP, CEH, CISSP, CRTP, and AWS / Azure / GCP security certifications.' },
                { q: 'What standards do you align to?',
                  a: 'OWASP Top 10, OWASP ASVS, OWASP MASVS, OWASP API Top 10, NIST SP 800, CIS Benchmarks, and PTES — chosen per engagement.' },
                { q: 'Do you provide a retest after fixes?',
                  a: 'Yes. Retesting and clean-bill-of-health reports are included for the duration of the engagement.' },
                { q: 'How long does a pentest take?',
                  a: 'A typical web app pentest takes 1–3 weeks. Larger enterprise scopes can run 4–8 weeks.' },
                { q: 'Can you support compliance audits?',
                  a: 'Yes. We provide test reports and remediation evidence aligned to SOC 2, ISO 27001, HIPAA, PCI DSS, and GDPR audits.' },
                { q: 'Do you offer continuous testing?',
                  a: 'Yes. We provide managed vulnerability management — continuous scanning, periodic pentests, and remediation tracking.' },
                { q: 'How do you use AI in pentesting?',
                  a: 'AI helps with triage, deduplication, exploit-chain hypothesis, and report drafting. Every critical finding is still verified by a human OSCP-level tester before it reaches your inbox.' },
                { q: 'Will the testing impact our production systems?',
                  a: 'Rules of engagement are signed before any test. We can run against staging mirrors, throttle requests, and exclude destructive payloads. Production testing only happens with explicit written sign-off.' },
            ]}
        />
    );
}
