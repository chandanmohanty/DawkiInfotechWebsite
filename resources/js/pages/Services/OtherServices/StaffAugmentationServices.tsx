import ServicePageTemplate, { ICON } from '@/components/ServicePageTemplate';

export default function StaffAugmentationServices() {
    return (
        <ServicePageTemplate
            pageTitle="Staff Augmentation Services"
            breadcrumbCategory="Other Services"
            heroPill="Other Services"
            heroTitleStart="Staff Augmentation"
            heroTitleHighlight="Services"
            heroSubtitle="Vetted senior engineers, designers, and specialists added to your team — fast, flexible, and fully integrated with your workflow."
            featuresPill="On-Demand Talent"
            featuresTitleStart="Augment Your Team"
            featuresTitleHighlight="With Senior Talent"
            featuresSubtitle="From bridging skill gaps to scaling sprints — we plug vetted senior specialists into your team without recruiting overhead."
            features={[
                { title: 'Senior Vetted Specialists', desc: 'Less than 5% candidate pass rate — only proven senior talent reaches your shortlist.', icon: '🎓' },
                { title: 'Fast Time-to-Onboard', desc: 'Vetted candidates delivered in days; engineers shipping in week one.', icon: '⚡' },
                { title: 'Direct Integration', desc: 'Augmented staff join your standups, tooling, and workflow as part of your team.', icon: '🤝' },
                { title: 'Flexible Engagement', desc: 'Scale up, down, or rotate roles as priorities shift — no long lock-ins.', icon: '📈' },
                { title: 'Transparent Pricing', desc: 'Predictable monthly rates with no hidden fees or markups.', icon: '💰' },
                { title: 'Replacement Guarantee', desc: 'If a fit isn\'t right, we replace at no cost — we own the match.', icon: '🛡️' },
            ]}
            processSteps={[
                { n: '01', t: 'Brief', d: 'Tell us the role, stack, level, and ideal start date.' },
                { n: '02', t: 'Shortlist', d: '2–3 vetted candidates delivered within days of the brief.' },
                { n: '03', t: 'Interview & Select', d: 'You interview and choose; we manage contracts and logistics.' },
                { n: '04', t: 'Onboard & Ship', d: 'Engineers join your team, ramp fast, and ship production work.' },
            ]}
            servicesPill="Roles We Provide"
            servicesTitleStart="Staff Augmentation"
            servicesTitleHighlight="Roles We Offer"
            servicesSubtitle="Senior, vetted talent across every modern engineering, design, data, and product role."
            serviceCards={[
                { title: 'Frontend Engineers', desc: 'React, Next.js, Vue, Angular, TypeScript — production-grade frontend talent.', icon: ICON.code },
                { title: 'Backend Engineers', desc: 'Node, Python, Go, Java, .NET, Rails, PHP — APIs and high-throughput services.', icon: ICON.cog },
                { title: 'Full-Stack Engineers', desc: 'Senior generalists comfortable across modern frontend and backend stacks.', icon: ICON.refresh },
                { title: 'Mobile Engineers', desc: 'iOS (Swift), Android (Kotlin), React Native, Flutter mobile talent.', icon: ICON.rocket },
                { title: 'DevOps & Cloud Engineers', desc: 'AWS, Azure, GCP, Kubernetes, Terraform, CI/CD specialists.', icon: ICON.cloud },
                { title: 'AI / ML Engineers', desc: 'LLMs, RAG, agents, fine-tuning, MLOps, and classical ML engineering.', icon: ICON.bot },
                { title: 'Data Engineers', desc: 'dbt, Snowflake, BigQuery, Airflow, Spark — modern data stack engineers.', icon: ICON.database },
                { title: 'QA Engineers & SDETs', desc: 'Manual + automation QA — Playwright, Cypress, Appium, k6.', icon: ICON.check },
                { title: 'Product Designers (UX/UI)', desc: 'Senior designers with research, design systems, and prototyping fluency.', icon: ICON.palette },
                { title: 'Product Managers', desc: 'Discovery, roadmap, and delivery PMs embedded with your team.', icon: ICON.target },
                { title: 'Engineering Managers / Tech Leads', desc: 'Senior leaders to coach, raise the bar, and own outcomes.', icon: ICON.users },
                { title: 'Salesforce, SAP & Specialists', desc: 'Niche specialists for Salesforce, SAP, ServiceNow, and other enterprise platforms.', icon: ICON.headset },
            ]}
            faqs={[
                { q: 'What is staff augmentation?', a: 'Staff augmentation adds vetted senior specialists to your team on a flexible basis — they work under your direction, in your tools, alongside your team.' },
                { q: 'How is this different from a dedicated team?', a: 'Staff augmentation typically adds individuals to an existing team. Dedicated teams are larger, often cross-functional units that operate as a self-contained pod.' },
                { q: 'How fast can someone start?', a: 'Vetted candidates are typically presented in 3–7 days. Engineers usually start within 1–2 weeks of selection.' },
                { q: 'Can we interview the candidates?', a: 'Yes. Final hiring decisions are always yours — we shortlist, you choose.' },
                { q: 'What if the engineer isn\'t the right fit?', a: 'We offer a replacement guarantee. If the match doesn\'t work, we replace at no cost.' },
                { q: 'Do augmented staff work in our time zone?', a: 'Yes. We provide engineers in your time zone or with daily overlap windows that match your rituals.' },
                { q: 'Can we hire them full-time later?', a: 'Yes. We offer transparent conversion paths if you decide to hire someone full-time.' },
            ]}
        />
    );
}
