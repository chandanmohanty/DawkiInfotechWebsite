import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import ServicePageTemplate, { ICON } from '@/components/ServicePageTemplate';

/* ============================================================================
 * MobileShowcaseSection — animated floating phone mockups with feature pills
 * ============================================================================ */
const MobileShowcaseSection: React.FC = () => {
    const reduced = useReducedMotion();

    const phones = [
        {
            label: 'iOS',
            color: '#0a84ff',
            screen: (
                <div className="mob-phone-screen mob-phone-screen--ios">
                    <div className="mob-phone-status">
                        <span>9:41</span>
                        <div className="mob-phone-status-icons">
                            <span className="mob-status-dot"></span>
                            <span className="mob-status-dot"></span>
                            <span className="mob-status-bar"></span>
                        </div>
                    </div>
                    <div className="mob-phone-app-header">
                        <h4>Discover</h4>
                        <div className="mob-phone-search"></div>
                    </div>
                    <div className="mob-phone-cards">
                        <div className="mob-phone-card mob-phone-card--lg" />
                        <div className="mob-phone-card-row">
                            <div className="mob-phone-card mob-phone-card--sm" />
                            <div className="mob-phone-card mob-phone-card--sm" />
                        </div>
                    </div>
                    <div className="mob-phone-tabbar">
                        <span className="mob-tab mob-tab--active"></span>
                        <span className="mob-tab"></span>
                        <span className="mob-tab"></span>
                        <span className="mob-tab"></span>
                    </div>
                </div>
            ),
        },
        {
            label: 'Android',
            color: '#3ddc84',
            screen: (
                <div className="mob-phone-screen mob-phone-screen--android">
                    <div className="mob-phone-status mob-phone-status--android">
                        <span>10:24</span>
                        <span className="mob-status-bar"></span>
                    </div>
                    <div className="mob-phone-hero">
                        <div className="mob-phone-avatar"></div>
                        <div className="mob-phone-hero-text">
                            <span className="mob-phone-hero-line"></span>
                            <span className="mob-phone-hero-line mob-phone-hero-line--short"></span>
                        </div>
                    </div>
                    <div className="mob-phone-chart">
                        <div style={{ height: '38%' }}></div>
                        <div style={{ height: '62%' }}></div>
                        <div style={{ height: '48%' }}></div>
                        <div style={{ height: '85%' }}></div>
                        <div style={{ height: '70%' }}></div>
                        <div style={{ height: '92%' }}></div>
                    </div>
                    <div className="mob-phone-cta"></div>
                    <div className="mob-phone-tabbar">
                        <span className="mob-tab"></span>
                        <span className="mob-tab mob-tab--active"></span>
                        <span className="mob-tab"></span>
                    </div>
                </div>
            ),
        },
        {
            label: 'Tablet',
            color: '#a855f7',
            screen: (
                <div className="mob-phone-screen mob-phone-screen--tablet">
                    <div className="mob-phone-status">
                        <span>11:08</span>
                        <span className="mob-status-bar"></span>
                    </div>
                    <div className="mob-phone-app-header">
                        <h4>Workspace</h4>
                    </div>
                    <div className="mob-phone-grid">
                        <div className="mob-phone-grid-cell"></div>
                        <div className="mob-phone-grid-cell"></div>
                        <div className="mob-phone-grid-cell"></div>
                        <div className="mob-phone-grid-cell"></div>
                    </div>
                    <div className="mob-phone-card mob-phone-card--lg" />
                </div>
            ),
        },
    ];

    const featurePills = [
        { label: 'Push Notifications', icon: '🔔', top: '8%', left: '4%' },
        { label: 'Biometric Auth', icon: '🔐', top: '20%', right: '6%' },
        { label: 'Offline-First', icon: '📶', top: '60%', left: '2%' },
        { label: 'In-App Payments', icon: '💳', top: '72%', right: '4%' },
        { label: 'Real-time Chat', icon: '💬', top: '40%', left: '6%' },
        { label: 'Geo-Location', icon: '📍', top: '50%', right: '8%' },
    ];

    const float = (delay: number) =>
        reduced
            ? {}
            : {
                  animate: {
                      y: [0, -14, 0],
                      transition: {
                          duration: 5 + delay,
                          repeat: Infinity,
                          ease: 'easeInOut' as const,
                          delay,
                      },
                  },
              };

    return (
        <section className="mob-showcase">
            <div className="mob-showcase-orb mob-showcase-orb--a"></div>
            <div className="mob-showcase-orb mob-showcase-orb--b"></div>

            <div className="container">
                <motion.div
                    className="mob-showcase-heading"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true, margin: '-80px' }}
                >
                    <span className="mob-showcase-pill">
                        <span className="mob-showcase-dot"></span>
                        Native + Cross-Platform
                    </span>
                    <h2 className="mob-showcase-title">
                        Apps That Shine on <span>Every Screen</span>
                    </h2>
                    <p className="mob-showcase-subtitle">
                        From iPhone and iPad to every flavor of Android — we craft mobile experiences that feel native, look stunning, and perform flawlessly.
                    </p>
                </motion.div>

                <div className="mob-showcase-stage">
                    {/* Floating feature pills */}
                    {featurePills.map((p, i) => (
                        <motion.div
                            key={i}
                            className="mob-feature-pill"
                            style={{ top: p.top, left: p.left, right: p.right }}
                            initial={{ opacity: 0, scale: 0.7 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                            viewport={{ once: true }}
                            {...float(i * 0.3)}
                        >
                            <span className="mob-feature-pill-icon">{p.icon}</span>
                            <span>{p.label}</span>
                        </motion.div>
                    ))}

                    {/* Phones row */}
                    <div className="mob-phones-row">
                        {phones.map((phone, idx) => (
                            <motion.div
                                key={idx}
                                className={`mob-phone mob-phone--${idx === 1 ? 'center' : 'side'}`}
                                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.7, delay: idx * 0.18, ease: [0.2, 0.8, 0.2, 1] }}
                                viewport={{ once: true, margin: '-60px' }}
                                {...float(0.4 + idx * 0.5)}
                            >
                                <div
                                    className="mob-phone-frame"
                                    style={{
                                        boxShadow: `0 30px 80px ${phone.color}33, 0 12px 30px rgba(15,23,42,0.18)`,
                                    }}
                                >
                                    <div className="mob-phone-notch"></div>
                                    {phone.screen}
                                </div>
                                <span className="mob-phone-label" style={{ color: phone.color }}>{phone.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

/* ============================================================================
 * MobileJourneySection — animated lifecycle timeline (Idea -> Launch -> Grow)
 * ============================================================================ */
const MobileJourneySection: React.FC = () => {
    const steps = [
        { n: '01', icon: '💡', title: 'Discovery & Strategy', desc: 'Validate the idea, choose the platform mix, and lock the MVP scope.' },
        { n: '02', icon: '🎨', title: 'UX & UI Design', desc: 'Native interaction patterns, prototypes, and pixel-perfect screens in Figma.' },
        { n: '03', icon: '🛠️', title: 'Engineering Build', desc: 'Iterative sprints with TestFlight & Play Console builds shipped weekly.' },
        { n: '04', icon: '🧪', title: 'QA & Device Testing', desc: 'Real-device farms, automated tests, and crash analytics for rock-solid quality.' },
        { n: '05', icon: '🚀', title: 'App Store Launch', desc: 'Provisioning, ASO, store assets, and submission to App Store & Google Play.' },
        { n: '06', icon: '📈', title: 'Grow & Iterate', desc: 'Live analytics, A/B tests, push campaigns, and continuous feature delivery.' },
    ];

    return (
        <section className="mob-journey">
            <div className="container">
                <motion.div
                    className="mob-journey-heading"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true, margin: '-80px' }}
                >
                    <span className="mob-journey-pill">
                        <span className="mob-journey-dot"></span>
                        End-to-End Lifecycle
                    </span>
                    <h2 className="mob-journey-title">
                        From Idea to <span>App Store</span>
                    </h2>
                    <p className="mob-journey-subtitle">
                        A proven 6-stage journey that turns a mobile concept into a polished, top-rated app — and keeps it growing after launch.
                    </p>
                </motion.div>

                <div className="mob-journey-track">
                    <motion.span
                        className="mob-journey-line"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 1.2, ease: 'easeInOut' }}
                        viewport={{ once: true, margin: '-100px' }}
                    />
                    <div className="mob-journey-steps">
                        {steps.map((s, i) => (
                            <motion.div
                                key={i}
                                className="mob-journey-step"
                                initial={{ opacity: 0, y: 36 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.55, delay: 0.15 + i * 0.12, ease: [0.2, 0.8, 0.2, 1] }}
                                viewport={{ once: true, margin: '-80px' }}
                            >
                                <motion.div
                                    className="mob-journey-bubble"
                                    whileHover={{ y: -6, scale: 1.04 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                >
                                    <span className="mob-journey-icon">{s.icon}</span>
                                    <span className="mob-journey-num">{s.n}</span>
                                </motion.div>
                                <h3 className="mob-journey-step-title">{s.title}</h3>
                                <p className="mob-journey-step-desc">{s.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default function MobileAppDevelopment() {
    return (
        <ServicePageTemplate
            pageTitle="Mobile App Development"
            breadcrumbCategory="Software Engineering"
            heroPill="Software Engineering"
            heroTitleStart="Mobile App"
            heroTitleHighlight="Development"
            heroSubtitle="Native and cross-platform mobile apps for iOS and Android — beautifully designed, blazing fast, and built to scale."
            featuresPill="What We Build"
            featuresTitleStart="Mobile Experiences That"
            featuresTitleHighlight="Users Love"
            featuresSubtitle="From MVPs to App Store hits — we engineer mobile applications with stunning UI, native performance, and secure backends."
            features={[
                { title: 'Native iOS & Android', desc: 'Swift, Kotlin, and SwiftUI builds that feel right at home on every device.', icon: '📱' },
                { title: 'Cross-Platform with Flutter & React Native', desc: 'One codebase, two stores — faster delivery without sacrificing native feel.', icon: '🔁' },
                { title: 'Offline-First Architecture', desc: 'Apps that work seamlessly without connectivity, syncing intelligently when online.', icon: '📶' },
                { title: 'Push Notifications & Real-Time', desc: 'Deep linking, in-app messaging, and live updates that keep users engaged.', icon: '🔔' },
                { title: 'Secure by Design', desc: 'Biometric auth, encrypted storage, certificate pinning, and OWASP MASVS compliance.', icon: '🔐' },
                { title: 'App Store Ready', desc: 'We handle store submission, ASO, screenshots, and post-launch updates.', icon: '🏪' },
            ]}
            processSteps={[
                { n: '01', t: 'Strategy', d: 'Validate the idea, define the MVP, and choose the right platform mix.' },
                { n: '02', t: 'Design', d: 'Native UI patterns, micro-interactions, and prototypes tested with real users.' },
                { n: '03', t: 'Build', d: 'Agile sprints with TestFlight/Play Console builds shipped weekly.' },
                { n: '04', t: 'Launch & Grow', d: 'Store submission, analytics, crash reporting, and continuous iteration.' },
            ]}
            servicesPill="Our Capabilities"
            servicesTitleStart="Mobile App Development"
            servicesTitleHighlight="Services We Offer"
            servicesSubtitle="End-to-end mobile engineering — strategy, design, development, and growth."
            serviceCards={[
                {
                    title: 'Product Discovery',
                    desc: 'Turn your mobile vision into a market-fit product with our discovery services. We help you define your MVP, the most suitable mobile tech stack, must-have features, and the right architecture so you can validate ideas with real users before fully committing.',
                    icon: ICON.search,
                },
                {
                    title: 'UI/UX Design',
                    desc: 'Design engaging, accessible, and intuitive mobile apps built to boost engagement, increase retention, drive higher conversions, and enhance overall satisfaction. Our experts apply design thinking, atomic design, data-driven and lean UX practices.',
                    icon: ICON.palette,
                },
                {
                    title: 'Product Development',
                    desc: 'Ensure unmatched quality from identifying USPs to delivering user-friendly mobile products. Our state-of-the-art coding practices combined with agile methodologies ensure flexibility and swift delivery, with thorough documentation for testing and handover.',
                    icon: ICON.wrench,
                },
                {
                    title: 'Software Re-engineering',
                    desc: 'Re-engineer legacy apps by migrating them to the latest mobile stacks (Swift, Kotlin, Flutter, React Native) and modern cloud infrastructure. We modernize outdated UIs to improve usability, performance, and align with current platform standards.',
                    icon: ICON.refresh,
                },
                {
                    title: 'Cloud Application Development',
                    desc: 'Leverage our strategic partnerships with AWS, GCP, and Microsoft Azure to build mobile backends that are robust, scalable, secure, and cost-efficient — ready to adapt to future business needs and platform changes.',
                    icon: ICON.cloud,
                },
                {
                    title: 'Web Development Services',
                    desc: 'We help you develop intuitive and scalable web companions to your mobile apps — admin portals, dashboards, marketing sites, and PWAs — all tailored to fit your mobile product ecosystem.',
                    icon: ICON.globe,
                },
                {
                    title: 'Software Testing Services',
                    desc: 'Rigorous mobile testing services that protect apps against errors and performance issues. Manual and automated techniques across real device farms cover functionality, security, and UX for a seamless end-user experience.',
                    icon: ICON.check,
                },
                {
                    title: 'DevOps Services',
                    desc: 'Optimize the cost, agility, and scalability of your mobile delivery pipeline with end-to-end automation. CI/CD with Fastlane, Bitrise, and GitHub Actions reduces manual work and ensures consistent releases to App Store and Google Play.',
                    icon: ICON.infinity,
                },
                {
                    title: 'Support & Maintenance',
                    desc: 'Keep your mobile apps running smoothly across OS upgrades. We provide proactive monitoring, regular bug fixes, performance tuning, and timely updates so you stay ahead of platform changes and focus on your core business.',
                    icon: ICON.headset,
                },
                {
                    title: 'Hire Dedicated Developers',
                    desc: 'Hire vetted mobile developers skilled across iOS, Android, React Native, and Flutter to accelerate your product development while reducing costs. Diverse expertise across mobile languages, frameworks, and tooling.',
                    icon: ICON.users,
                },
                {
                    title: 'API Development & Integration',
                    desc: 'Seamless integration between your mobile app and disparate systems with our API services. We work with REST, GraphQL, gRPC, JSON-RPC, SOAP, and webhooks to streamline mobile workflows and third-party connectivity.',
                    icon: ICON.code,
                },
                {
                    title: 'IT Outsourcing Services',
                    desc: 'Adapt swiftly to market changes while reducing costs with our mobile IT outsourcing services. Solutions are built on a strong foundation, reducing the need for constant fixes and enabling long-term maintainability.',
                    icon: ICON.home,
                },
            ]}
            toolsTitleStart="Robust Tools &"
            toolsTitleHighlight="Technologies We Work"
            toolsSubtitle="A complete mobile stack across native iOS/Android, cross-platform frameworks, backend, design, and store optimization — chosen per project for the best fit."
            tools={[
                /* Native iOS */
                { n: 'Swift', s: 'swift', c: 'F05138' },
                { n: 'Xcode', s: 'xcode', c: '147EFB' },
                { n: 'iOS', s: 'ios', c: '000000' },
                /* Native Android */
                { n: 'Kotlin', s: 'kotlin', c: '7F52FF' },
                { n: 'Java', s: 'openjdk', c: '437291' },
                { n: 'Android Studio', s: 'androidstudio', c: '3DDC84' },
                { n: 'Android', s: 'android', c: '34A853' },
                { n: 'Gradle', s: 'gradle', c: '02303A' },
                /* Cross-Platform */
                { n: 'React Native', s: 'react', c: '61DAFB' },
                { n: 'Flutter', s: 'flutter', c: '02569B' },
                { n: 'Dart', s: 'dart', c: '0175C2' },
                { n: 'Expo', s: 'expo', c: '000020' },
                { n: 'Ionic', s: 'ionic', c: '3880FF' },
                { n: 'Capacitor', s: 'capacitor', c: '119EFF' },
                { n: 'Cordova', s: 'apachecordova', c: 'E8E8E8' },
                { n: '.NET MAUI', s: 'dotnet', c: '512BD4' },
                { n: 'Unity', s: 'unity', c: '000000' },
                /* Mobile-friendly Web */
                { n: 'TypeScript', s: 'typescript', c: '3178C6' },
                { n: 'JavaScript', s: 'javascript', c: 'F7DF1E' },
                /* Mobile Backend / BaaS */
                { n: 'Firebase', s: 'firebase', c: 'FFCA28' },
                { n: 'Supabase', s: 'supabase', c: '3FCF8E' },
                { n: 'GraphQL', s: 'graphql', c: 'E10098' },
                { n: 'Node JS', s: 'nodedotjs', c: '5FA04E' },
                { n: 'Python', s: 'python', c: '3776AB' },
                /* Local Databases */
                { n: 'SQLite', s: 'sqlite', c: '003B57' },
                { n: 'MongoDB', s: 'mongodb', c: '47A248' },
                { n: 'Stripe (Payments)', s: 'stripe', c: '008CDD' },
                /* Cloud & DevOps */
                { n: 'AWS', url: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg' },
                { n: 'Google Cloud', s: 'googlecloud', c: '4285F4' },
                { n: 'Microsoft Azure', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg' },
                { n: 'Fastlane', s: 'fastlane', c: '00F200' },
                { n: 'GitHub Actions', s: 'githubactions', c: '2088FF' },
                { n: 'Docker', s: 'docker', c: '2496ED' },
                /* Testing & Analytics */
                { n: 'Appium', s: 'appium', c: '662D91' },
                { n: 'Sentry', s: 'sentry', c: '362D59' },
                { n: 'Mixpanel', s: 'mixpanel', c: '7856FF' },
                /* Design & VCS */
                { n: 'Figma', s: 'figma', c: 'F24E1E' },
                { n: 'Sketch', s: 'sketch', c: 'F7B500' },
                { n: 'Git', s: 'git', c: 'F05032' },
                { n: 'Github', s: 'github', c: '181717' },
            ]}
            extraSections={
                <>
                    <MobileShowcaseSection />
                    <MobileJourneySection />
                </>
            }
            showClients
            clientsHeading="From App Store Hits to Enterprise Apps,"
            clientsHeadingHighlight="We Build Mobile That Users Love"
            googleReviewsHeading="What Our Mobile App Clients Say on Google"
            googleReviewsSubtitle="Honest reviews from clients we've shipped iOS and Android apps for — verified on Google."
            googleReviews={[
                {
                    name: 'Karan Malhotra',
                    role: 'Founder, FitPulse iOS App',
                    rating: 5,
                    date: '2 weeks ago',
                    text: 'Dawki built our fitness tracking iOS app in Swift and it feels rock solid. Smooth animations, blazing fast launch time, and Apple Watch integration works perfectly. The team really gets native iOS.',
                },
                {
                    name: 'Neha Verma',
                    role: 'Product Lead, ShopEase Android',
                    rating: 5,
                    date: '1 month ago',
                    text: 'Our Kotlin Android app went live ahead of schedule. Conversions jumped 32% in the first month thanks to thoughtful UX and offline-first checkout. Excellent communication from start to finish.',
                },
                {
                    name: 'Robert Chen',
                    role: 'CTO, MediCare Mobile',
                    rating: 5,
                    date: '3 weeks ago',
                    text: 'Built our HIPAA-compliant patient portal app in React Native. Performance is identical to native and the team handled biometric auth, secure storage, and sync flawlessly.',
                },
                {
                    name: 'Pooja Reddy',
                    role: 'COO, GoEats Delivery',
                    rating: 5,
                    date: '2 months ago',
                    text: 'Cross-platform Flutter app for our food delivery business — drivers, customers, and admin in one codebase. Real-time tracking and dispatch are flawless. Highly recommended.',
                },
                {
                    name: 'James Whitaker',
                    role: 'Head of Product, FinSnap',
                    rating: 5,
                    date: '6 weeks ago',
                    text: 'Native iOS + Android app for our consumer fintech. Compliance-aware, super polished UI, and the App Store review passed first try. Ongoing maintenance has been excellent too.',
                },
                {
                    name: 'Aarav Singh',
                    role: 'Founder, LearnHub EdTech',
                    rating: 5,
                    date: '1 month ago',
                    text: 'They built an offline-first React Native learning app for us. Video, quizzes, and progress sync all work beautifully even on patchy networks. Genuinely senior mobile engineers.',
                },
                {
                    name: 'Sara Mitchell',
                    role: 'CEO, BookNest Hotels',
                    rating: 5,
                    date: '3 weeks ago',
                    text: 'Migrated our legacy hybrid app to Flutter. Performance, animations, and battery usage all dramatically improved. Bookings via app are up 40%. Five-star team.',
                },
                {
                    name: 'Vikram Patel',
                    role: 'CTO, LogiMove',
                    rating: 5,
                    date: '5 weeks ago',
                    text: 'Built our driver dispatch Android app from scratch. Background location, offline sync, and BLE scanner integration all work reliably at scale. Excellent technical depth.',
                },
            ]}
            faqs={[
                { q: 'Should I build a native or cross-platform app?', a: 'Native is best when you need maximum performance and platform-specific features. Cross-platform (Flutter/React Native) is faster and cheaper if both platforms share the same UX. We help you decide based on your goals.' },
                { q: 'How long does it take to build a mobile app?', a: 'A focused MVP usually takes 8–14 weeks. Full-featured apps with complex backends typically run 4–8 months.' },
                { q: 'Do you publish the app to the App Store and Play Store?', a: 'Yes. We handle the entire submission process — provisioning, screenshots, store copy, ASO, and review responses.' },
                { q: 'Can you take over an existing mobile app?', a: 'Yes. We audit the codebase, fix critical issues, and create a roadmap to modernize and add new features.' },
                { q: 'How do you ensure mobile app security?', a: 'We follow OWASP MASVS — encrypted storage, secure networking, biometric auth, and code obfuscation are standard.' },
                { q: 'Will the app work offline?', a: 'Yes, when needed. We architect offline-first apps with local databases and smart sync once connectivity returns.' },
                { q: 'Do you provide post-launch updates and support?', a: 'Yes. We offer monthly maintenance, OS upgrade compatibility, performance tuning, and feature delivery.' },
            ]}
        />
    );
}
