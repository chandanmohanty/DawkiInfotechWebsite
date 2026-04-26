import ServicePageTemplate, { ICON } from '@/components/ServicePageTemplate';

export default function OffshoreDevelopmentCenter() {
    return (
        <ServicePageTemplate
            pageTitle="Offshore Development Center"
            breadcrumbCategory="Other Services"
            heroPill="Other Services"
            heroTitleStart="Offshore"
            heroTitleHighlight="Development Center"
            heroSubtitle="Build your own offshore engineering hub — with hand-picked talent, dedicated infrastructure, and full operational support."
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
                { n: '01', t: 'Plan', d: 'Define team composition, location, infrastructure, and governance model.' },
                { n: '02', t: 'Staff', d: 'Recruit and onboard engineers, designers, QA, PMs, and managers.' },
                { n: '03', t: 'Stand Up', d: 'Set up office, security, tooling, processes, and IT infrastructure.' },
                { n: '04', t: 'Operate & Grow', d: 'Run-day-to-day operations, scale, and continuously optimize the center.' },
            ]}
            servicesPill="Our Capabilities"
            servicesTitleStart="Offshore Development Center"
            servicesTitleHighlight="Services We Offer"
            servicesSubtitle="End-to-end ODC setup and operations — including talent, infrastructure, and management."
            serviceCards={[
                { title: 'ODC Strategy & Planning', desc: 'Right-size team, location, and operating model to your business goals.', icon: ICON.target },
                { title: 'Talent Acquisition', desc: 'Recruit senior engineers, PMs, designers, QA, and managers with rigorous screening.', icon: ICON.users },
                { title: 'Infrastructure Setup', desc: 'Office, network, security, devices, and licenses — production-ready from day one.', icon: ICON.cog },
                { title: 'Engineering Center', desc: 'Frontend, backend, mobile, DevOps, AI/ML engineering capabilities under one roof.', icon: ICON.code },
                { title: 'QA & Testing Center', desc: 'Manual + automation QA hub with device labs and load-testing infra.', icon: ICON.check },
                { title: 'Design & Research Hub', desc: 'Senior product designers, researchers, and content designers.', icon: ICON.palette },
                { title: 'Data & AI Center', desc: 'Data engineering, BI, and AI/ML talent in a dedicated capability hub.', icon: ICON.database },
                { title: 'Project Management & Delivery', desc: 'PMs, engineering managers, and delivery leads who own outcomes.', icon: ICON.headset },
                { title: 'IT & DevOps Support', desc: 'Internal IT, identity, and DevOps to keep the center running 24/7.', icon: ICON.cloud },
                { title: 'Compliance & Security', desc: 'ISO 27001, SOC 2, GDPR, HIPAA-ready operations and policies.', icon: ICON.shield },
                { title: 'HR & Operations', desc: 'Recruiting, onboarding, payroll, benefits, and engagement programs.', icon: ICON.box },
                { title: 'Continuous Optimization', desc: 'Quarterly reviews on cost, velocity, quality, and team satisfaction.', icon: ICON.refresh },
            ]}
            faqs={[
                { q: 'What is an offshore development center (ODC)?', a: 'An ODC is a dedicated, long-term offshore team that operates as your own remote office — branded, staffed, and supported but located in a lower-cost geography.' },
                { q: 'How is an ODC different from outsourcing?', a: 'Outsourcing is project-based and usually shared. An ODC is dedicated, long-term, and works exclusively for you with full alignment to your processes and culture.' },
                { q: 'How much can we save with an ODC?', a: 'Most clients see 40–60% cost reduction vs onshore hiring, with comparable or better engineering quality.' },
                { q: 'Where can the ODC be located?', a: 'Our delivery hubs include India and other strategic geographies. We help choose based on cost, talent depth, and time-zone fit.' },
                { q: 'Do we own the IP?', a: 'Yes. All code, data, and IP belong to you, with strict NDAs and security controls protecting it.' },
                { q: 'How long does ODC setup take?', a: 'A small team can be up and running in 6–10 weeks. Larger centers (50+ engineers) typically scale over 4–9 months.' },
                { q: 'Can we visit the ODC?', a: 'Absolutely. We encourage executive visits and even on-site rotations to build trust and team cohesion.' },
            ]}
        />
    );
}
