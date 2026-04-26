import ServicePageTemplate, { ICON } from '@/components/ServicePageTemplate';

export default function WebApplicationDevelopment() {
    return (
        <ServicePageTemplate
            pageTitle="Web Application Development"
            breadcrumbCategory="Software Engineering"
            heroPill="Software Engineering"
            heroTitleStart="Web Application"
            heroTitleHighlight="Development"
            heroSubtitle="Fast, responsive, and scalable web applications — built with modern frameworks for SaaS, eCommerce, and enterprise platforms."
            heroBgImage="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1920&q=80"
            featuresPill="What We Build"
            featuresTitleStart="Web Apps That"
            featuresTitleHighlight="Drive Real Growth"
            featuresSubtitle="From SPAs to large-scale portals — we engineer high-performance web applications that load fast, scale wide, and convert better."
            features={[
                { title: 'Responsive by Default', desc: 'Pixel-perfect on every screen — phones, tablets, laptops, and ultrawide displays.', icon: '📱' },
                { title: 'Lightning Performance', desc: 'Sub-second loads, optimized bundles, smart caching, and edge delivery built in.', icon: '⚡' },
                { title: 'Progressive Web Apps', desc: 'Installable, offline-capable web experiences that feel native on every device.', icon: '🌐' },
                { title: 'SEO-Optimized', desc: 'Server-side rendering, semantic HTML, structured data — visible to search engines from day one.', icon: '🔍' },
                { title: 'Secure & Compliant', desc: 'OWASP best practices, encrypted data, GDPR-ready architecture out of the box.', icon: '🛡️' },
                { title: 'API-Driven', desc: 'Headless backend, REST/GraphQL APIs, ready to power web, mobile, and integrations.', icon: '🔌' },
            ]}
            processSteps={[
                { n: '01', t: 'Discovery', d: 'Workshops to map user journeys, business goals, and technical constraints.' },
                { n: '02', t: 'Design', d: 'Wireframes, prototypes, and design system tailored to your brand.' },
                { n: '03', t: 'Build', d: 'Iterative sprints with weekly demos and full source-code transparency.' },
                { n: '04', t: 'Launch & Scale', d: 'Cloud deployment, analytics, monitoring, and ongoing optimization.' },
            ]}
            servicesPill="Our Capabilities"
            servicesTitleStart="Web Application"
            servicesTitleHighlight="Services We Offer"
            servicesSubtitle="End-to-end web engineering — from concept to deployment to long-term scale."
            serviceCards={[
                { title: 'Custom Web App Development', desc: 'Tailored web applications built around your unique workflows, users, and business logic.', icon: ICON.code },
                { title: 'SaaS Platform Development', desc: 'Multi-tenant SaaS products with subscription management, billing, and admin dashboards.', icon: ICON.cloud },
                { title: 'Progressive Web Apps (PWA)', desc: 'Installable, offline-ready web apps that combine the reach of web with the feel of native.', icon: ICON.globe },
                { title: 'eCommerce Web Development', desc: 'Custom storefronts, checkouts, and integrations with Stripe, PayPal, and shipping providers.', icon: ICON.box },
                { title: 'Portal & Dashboard Development', desc: 'Customer portals, vendor dashboards, and internal tools with rich data visualizations.', icon: ICON.chart },
                { title: 'CMS Development', desc: 'Headless and traditional CMS builds — WordPress, Strapi, Sanity, or fully custom.', icon: ICON.palette },
                { title: 'Web App Modernization', desc: 'Re-platform legacy apps onto modern stacks — faster, safer, easier to evolve.', icon: ICON.refresh },
                { title: 'API Development & Integration', desc: 'REST and GraphQL APIs, third-party integrations, and webhook orchestration.', icon: ICON.link },
                { title: 'UI/UX Design', desc: 'Conversion-focused interfaces backed by user research and accessibility standards.', icon: ICON.eye },
                { title: 'Web App Testing & QA', desc: 'Automated and manual testing across browsers, devices, and load conditions.', icon: ICON.check },
                { title: 'Performance Optimization', desc: 'Core Web Vitals tuning, bundle splitting, CDN setup, image and font optimization.', icon: ICON.rocket },
                { title: 'Maintenance & Support', desc: '24/7 monitoring, bug fixes, security patches, and continuous feature delivery.', icon: ICON.headset },
            ]}
            toolsTitleStart="Robust Tools &"
            toolsTitleHighlight="Technologies We Work"
            toolsSubtitle="A modern web stack across frontend, backend, databases, cloud, and design — chosen per project for the best performance and developer experience."
            tools={[
                { n: 'React JS', s: 'react', c: '61DAFB' },
                { n: 'Next JS', s: 'nextdotjs', c: '000000' },
                { n: 'Vue.js', s: 'vuedotjs', c: '4FC08D' },
                { n: 'Angular', s: 'angular', c: 'DD0031' },
                { n: 'TypeScript', s: 'typescript', c: '3178C6' },
                { n: 'JavaScript', s: 'javascript', c: 'F7DF1E' },
                { n: 'Tailwind CSS', s: 'tailwindcss', c: '06B6D4' },
                { n: 'Bootstrap', s: 'bootstrap', c: '7952B3' },
                { n: 'HTML5', s: 'html5', c: 'E34F26' },
                { n: 'CSS3', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg' },
                { n: 'Node JS', s: 'nodedotjs', c: '5FA04E' },
                { n: 'Express', s: 'express', c: '000000' },
                { n: 'NestJS', s: 'nestjs', c: 'E0234E' },
                { n: 'Django', s: 'django', c: '092E20' },
                { n: 'FastAPI', s: 'fastapi', c: '009688' },
                { n: 'Laravel', s: 'laravel', c: 'FF2D20' },
                { n: 'PHP', s: 'php', c: '777BB4' },
                { n: 'Python', s: 'python', c: '3776AB' },
                { n: 'Ruby on Rails', s: 'rubyonrails', c: 'CC0000' },
                { n: '.NET', s: 'dotnet', c: '512BD4' },
                { n: 'GraphQL', s: 'graphql', c: 'E10098' },
                { n: 'PostgreSQL', s: 'postgresql', c: '4169E1' },
                { n: 'MySQL', s: 'mysql', c: '4479A1' },
                { n: 'MongoDB', s: 'mongodb', c: '47A248' },
                { n: 'Redis', s: 'redis', c: 'FF4438' },
                { n: 'Elasticsearch', s: 'elasticsearch', c: '005571' },
                { n: 'AWS', url: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg' },
                { n: 'Vercel', s: 'vercel', c: '000000' },
                { n: 'Cloudflare', s: 'cloudflare', c: 'F38020' },
                { n: 'Docker', s: 'docker', c: '2496ED' },
                { n: 'Figma', s: 'figma', c: 'F24E1E' },
                { n: 'Git', s: 'git', c: 'F05032' },
            ]}
            hideProjects
            productsPill="Our Products"
            productsTitleStart="Built In-House."
            productsTitleHighlight="Trusted by Teams."
            productsSubtitle="Web applications we built, ship, and scale ourselves — used by teams every single day."
            products={[
                {
                    badge: 'CRM · SaaS Platform',
                    titleStart: 'All-in-One',
                    titleHighlight: 'Dawki CRM',
                    desc: 'A unified workspace to manage clients, admins, and employees — built for teams that move fast. Dial calls in-app with built-in timer, track conversations, monitor live performance graphs, assign tasks, and keep every customer touchpoint in one searchable timeline.',
                    image: '/assets/images/about/crm-dashboard.png',
                    features: [
                        { icon: '📞', text: 'Built-in call dialer with auto-timer & call logs' },
                        { icon: '👥', text: 'Role-based access for admin, employees & clients' },
                        { icon: '📊', text: 'Real-time dashboards, KPIs & performance graphs' },
                        { icon: '📅', text: 'Tasks, reminders & follow-up automation' },
                    ],
                    ctaLabel: 'Request a Demo',
                    reverse: true,
                },
                {
                    badge: 'AI · Bulk Messaging',
                    badgeAlt: true,
                    titleStart: 'AI Grow',
                    titleHighlight: 'Smart Outreach Bot',
                    desc: 'Send thousands of personalized messages in minutes — without burning out reps or hitting spam filters. AI Grow handles bulk WhatsApp, SMS & email campaigns with smart scheduling, AI-personalized copy, delivery tracking, and intent-based reply detection.',
                    image: '/assets/images/about/ai-grow-dashboard.png',
                    features: [
                        { icon: '⚡', text: 'Bulk send across WhatsApp, SMS & email channels' },
                        { icon: '🤖', text: 'AI-personalized message variants per contact' },
                        { icon: '📈', text: 'Live delivery, open & reply analytics' },
                        { icon: '🛡️', text: 'Smart throttling to keep deliverability high' },
                    ],
                    ctaLabel: 'Try AI Grow',
                    glowAlt: true,
                },
            ]}
            stats={[
                { value: '300', suffix: '+', label: 'Web Apps Delivered Globally' },
                { value: '99.9', suffix: '%', label: 'Uptime Across Production Workloads' },
                { value: '<1s', label: 'Average First Contentful Paint' },
                { value: '24/7', label: 'Monitoring & Engineering Support' },
            ]}
            statsHeading="Numbers Behind Our Web Apps"
            statsSubtitle="Performance, reliability, and scale — measured across hundreds of production deployments."
            whyChooseUs={[
                { title: 'Senior Engineers Only', desc: 'Every developer is a senior with 5+ years building production-grade web apps.', icon: '👨‍💻' },
                { title: 'Performance-First Mindset', desc: 'Core Web Vitals, bundle budgets, and Lighthouse scores baked into every sprint.', icon: '⚡' },
                { title: 'Transparent Process', desc: 'Daily standups, weekly demos, and full source-code access from day one.', icon: '🔍' },
                { title: 'Future-Proof Architecture', desc: 'Modular, API-first, cloud-native foundations that scale with your roadmap.', icon: '🏗️' },
                { title: 'Security by Default', desc: 'OWASP Top 10, encrypted data, secure auth, and continuous dependency scanning.', icon: '🛡️' },
                { title: 'Beyond Launch', desc: 'Post-launch monitoring, optimization, and feature delivery as you grow.', icon: '🚀' },
            ]}
            whyChooseHeading="Why Teams Choose Us for Web Apps"
            whyChooseSubtitle="A mix of senior talent, modern process, and engineering rigor — built to ship web products that perform."
            industries={[
                { title: 'SaaS & Startups', desc: 'MVPs, product platforms, and growth-stage SaaS web apps.', icon: '🚀' },
                { title: 'eCommerce & Retail', desc: 'Headless storefronts, marketplaces, and customer portals.', icon: '🛒' },
                { title: 'Healthcare', desc: 'HIPAA-aware patient and provider portals and admin dashboards.', icon: '🏥' },
                { title: 'FinTech & Banking', desc: 'Secure customer dashboards, lending portals, and analytics platforms.', icon: '🏦' },
                { title: 'EdTech', desc: 'Learning platforms, LMSs, and student/teacher portals.', icon: '🎓' },
                { title: 'Logistics & Supply Chain', desc: 'Tracking dashboards, dispatch tools, and partner portals.', icon: '🚚' },
                { title: 'Real Estate', desc: 'Listing platforms, CRMs, and tenant/owner portals.', icon: '🏠' },
                { title: 'Media & Publishing', desc: 'High-traffic content sites with editorial workflows and SEO.', icon: '📰' },
            ]}
            industriesHeading="Industries We Build Web Apps For"
            industriesSubtitle="Deep experience across regulated, high-traffic, and product-led industries."
            showClients
            clientsHeading="From Emerging Startups to Industry Leaders,"
            clientsHeadingHighlight="We Build Web Apps That Scale"
            googleReviewsHeading="What Our Web App Clients Say on Google"
            googleReviewsSubtitle="Honest reviews from clients we've shipped web applications for — verified on Google."
            googleReviews={[
                {
                    name: 'Rohit Sharma',
                    role: 'Founder, BrightStack SaaS',
                    rating: 5,
                    date: '2 weeks ago',
                    text: 'Dawki Infotech rebuilt our SaaS platform on Next.js and the difference is night and day. Page loads dropped from 4s to under 1s, and the team shipped weekly without missing a beat. Highly recommended.',
                },
                {
                    name: 'Priya Mehta',
                    role: 'Product Manager, ShopWave',
                    rating: 5,
                    date: '1 month ago',
                    text: 'Our headless ecommerce storefront was delivered ahead of schedule. Conversion improved 28% in the first month. Communication was clear and the engineers really cared about quality.',
                },
                {
                    name: 'David Anderson',
                    role: 'CTO, FinTrust Capital',
                    rating: 5,
                    date: '3 weeks ago',
                    text: 'We needed a secure customer dashboard with strong compliance posture. Dawki delivered with great architecture, clean code, and proactive security reviews. Excellent partner.',
                },
                {
                    name: 'Ananya Iyer',
                    role: 'COO, MedCare Plus',
                    rating: 5,
                    date: '2 months ago',
                    text: 'Built a HIPAA-aware patient portal for us with React and Node. The team was thorough on security, accessibility, and performance. Smooth handoff and great post-launch support.',
                },
                {
                    name: 'Michael Brown',
                    role: 'Head of Engineering, EduForge',
                    rating: 5,
                    date: '6 weeks ago',
                    text: 'Migrated a legacy LMS to a modern web stack with zero downtime. The Dawki team is technically strong and very transparent — daily standups, weekly demos, full source access.',
                },
                {
                    name: 'Sneha Kapoor',
                    role: 'Founder, LogiTrack',
                    rating: 5,
                    date: '1 month ago',
                    text: 'Built our logistics dashboard from scratch. Real-time tracking, dispatch flows, and reporting all work beautifully. Performance is rock solid even at scale. Will hire again.',
                },
                {
                    name: 'James O\u2019Connor',
                    role: 'CEO, NorthStar Realty',
                    rating: 5,
                    date: '3 weeks ago',
                    text: 'A polished, blazing-fast property listing platform. SEO traffic doubled within 90 days of launch. The team understood our market and tailored the build accordingly.',
                },
                {
                    name: 'Aisha Khan',
                    role: 'Marketing Director, PulseMedia',
                    rating: 5,
                    date: '5 weeks ago',
                    text: 'Our high-traffic publishing site was rebuilt on Next.js with editorial workflows. Core Web Vitals are now all green and our editors love the new CMS. Five-star experience.',
                },
            ]}
            faqs={[
                { q: 'What is web application development?', a: 'Web application development is the process of designing, building, and deploying interactive software that runs in a browser — from simple dashboards to complex SaaS platforms.' },
                { q: 'How long does it take to build a web application?', a: 'A small MVP can take 6–10 weeks. Larger SaaS or enterprise platforms typically run 4–9 months depending on scope, integrations, and team size.' },
                { q: 'Which technologies do you use for web app development?', a: 'We use React, Next.js, Vue, Node.js, Python, .NET, PHP/Laravel, and PostgreSQL/MongoDB — chosen per project for the best fit.' },
                { q: 'Can you redesign or modernize an existing web app?', a: 'Yes. We re-architect legacy apps onto modern frameworks, improve performance, and migrate to the cloud — often without disrupting users.' },
                { q: 'Do you provide hosting and post-launch support?', a: 'Yes. We deploy to AWS, GCP, Azure, or Vercel, set up CI/CD, and offer monitoring, maintenance, and feature roadmaps after launch.' },
                { q: 'Will my web app be secure and scalable?', a: 'Absolutely. We follow OWASP guidelines, encrypt data in transit and at rest, and architect for horizontal scale from day one.' },
                { q: 'Can you integrate the web app with our existing tools?', a: 'Yes. CRMs, ERPs, payment gateways, analytics, marketing platforms — we build clean integrations via APIs and webhooks.' },
            ]}
        />
    );
}
