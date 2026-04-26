import ServicePageTemplate, { ICON } from '@/components/ServicePageTemplate';

export default function SecurityTestingServices() {
    return (
        <ServicePageTemplate
            pageTitle="Security Testing Services"
            breadcrumbCategory="Team Extension Services"
            heroPill="Team Extension Services"
            heroTitleStart="Security"
            heroTitleHighlight="Testing Services"
            heroSubtitle="Penetration testing, vulnerability assessments, and continuous security testing — find issues before attackers do."
            featuresPill="Defensive Security"
            featuresTitleStart="Find Vulnerabilities"
            featuresTitleHighlight="Before Attackers Do"
            featuresSubtitle="From web apps to cloud infrastructure — we run rigorous security tests aligned to OWASP, NIST, and CIS standards."
            features={[
                { title: 'OWASP-Aligned Testing', desc: 'Web, mobile, and API testing against OWASP Top 10 and ASVS.', icon: '🛡️' },
                { title: 'Penetration Testing', desc: 'Manual and automated black-, gray-, and white-box pentests by certified testers.', icon: '🎯' },
                { title: 'Cloud & Infra Security', desc: 'AWS, Azure, GCP misconfiguration scans and architecture reviews.', icon: '☁️' },
                { title: 'DevSecOps & Shift-Left', desc: 'SAST, DAST, SCA, and secret scanning embedded into CI/CD.', icon: '🔄' },
                { title: 'Compliance Testing', desc: 'SOC 2, ISO 27001, HIPAA, PCI DSS, and GDPR readiness tests.', icon: '📋' },
                { title: 'Detailed Remediation', desc: 'Findings with severity, reproduction steps, and clear fix guidance.', icon: '📝' },
            ]}
            processSteps={[
                { n: '01', t: 'Scope', d: 'Define targets, methodology, rules of engagement, and success criteria.' },
                { n: '02', t: 'Test', d: 'Manual and automated testing with continuous communication on critical findings.' },
                { n: '03', t: 'Report', d: 'Detailed report with severity, evidence, and remediation guidance.' },
                { n: '04', t: 'Retest & Certify', d: 'Validate fixes and issue clean retest reports.' },
            ]}
            servicesPill="Our Capabilities"
            servicesTitleStart="Security Testing"
            servicesTitleHighlight="Services We Offer"
            servicesSubtitle="A full security testing practice — across applications, APIs, mobile, cloud, and infrastructure."
            serviceCards={[
                { title: 'Web Application Penetration Testing', desc: 'Black-, gray-, and white-box pentests aligned to OWASP Top 10 and ASVS.', icon: ICON.globe },
                { title: 'Mobile App Penetration Testing', desc: 'iOS and Android pentesting per OWASP MASVS — including reverse engineering.', icon: ICON.rocket },
                { title: 'API Security Testing', desc: 'REST/GraphQL/gRPC security testing aligned to OWASP API Top 10.', icon: ICON.code },
                { title: 'Cloud Security Assessments', desc: 'AWS, Azure, GCP configuration reviews against CIS benchmarks.', icon: ICON.cloud },
                { title: 'Network Penetration Testing', desc: 'Internal and external network pentests for on-prem and hybrid environments.', icon: ICON.link },
                { title: 'Infrastructure Vulnerability Assessment', desc: 'Continuous vulnerability scanning of servers, containers, and dependencies.', icon: ICON.search },
                { title: 'DevSecOps Implementation', desc: 'SAST, DAST, SCA, secret scanning, and IaC scanning embedded in CI/CD.', icon: ICON.refresh },
                { title: 'Threat Modeling', desc: 'STRIDE / PASTA threat modeling sessions for new and existing systems.', icon: ICON.target },
                { title: 'Compliance & Audit Support', desc: 'SOC 2, ISO 27001, HIPAA, PCI DSS, GDPR readiness tests and audit support.', icon: ICON.shield },
                { title: 'Source Code Review', desc: 'Manual and automated security review of source code with prioritized findings.', icon: ICON.eye },
                { title: 'Red Team Engagements', desc: 'Goal-based adversarial simulations against people, process, and technology.', icon: ICON.bot },
                { title: 'Continuous Security Monitoring', desc: 'Ongoing scanning, retesting, and managed vulnerability management.', icon: ICON.headset },
            ]}
            faqs={[
                { q: 'What is security testing?', a: 'Security testing identifies vulnerabilities in applications, APIs, infrastructure, and processes through manual and automated techniques aligned to industry standards.' },
                { q: 'Are your testers certified?', a: 'Yes. Our team holds OSCP, OSWE, CEH, CISSP, CRTP, and AWS/Azure security certifications.' },
                { q: 'What standards do you align to?', a: 'OWASP Top 10, OWASP ASVS, OWASP MASVS, OWASP API Top 10, NIST SP 800, CIS Benchmarks, and PTES — chosen per engagement.' },
                { q: 'Do you provide a retest after fixes?', a: 'Yes. Retesting and clean-bill-of-health reports are included for the duration of the engagement.' },
                { q: 'How long does a pentest take?', a: 'A typical web app pentest takes 1–3 weeks. Larger enterprise scopes can run 4–8 weeks.' },
                { q: 'Can you support compliance audits?', a: 'Yes. We provide test reports and remediation evidence aligned to SOC 2, ISO 27001, HIPAA, PCI DSS, and GDPR audits.' },
                { q: 'Do you offer continuous testing?', a: 'Yes. We provide managed vulnerability management — continuous scanning, periodic pentests, and remediation tracking.' },
            ]}
        />
    );
}
