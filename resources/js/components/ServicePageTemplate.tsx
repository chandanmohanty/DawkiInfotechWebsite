import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import FrontendLayout from '@/layouts/FrontendLayout';

import { CLIENT_LOGOS } from '@/lib/clientLogos';

/* Auto-flipping client logo grid. The pool of logos lives in a shared
 * module (resources/js/lib/clientLogos.ts) so we can grow it once and
 * every page picks up the new entries. Cells start at the first N
 * entries, then every 1.6s a random cell flips to a different random
 * logo from the pool — guaranteed to differ from what's already shown
 * in that cell so no cell loops back to the same image. */
const ClientLogoGrid: React.FC<{ logos?: string[] }> = ({ logos = CLIENT_LOGOS }) => {
    /* Render up to 18 cells initially (matches the legacy layout). If the
     * pool has fewer entries we just render whatever's available. */
    const initialCount = Math.min(18, logos.length);
    const [cellLogos, setCellLogos] = useState<string[]>(() => logos.slice(0, initialCount));
    const reduced = useReducedMotion();

    useEffect(() => {
        if (reduced) return;
        const interval = setInterval(() => {
            setCellLogos((prev) => {
                const next = [...prev];
                const cellIdx = Math.floor(Math.random() * next.length);

                /* Build the candidate pool = full logo list MINUS every logo
                 * currently shown in the OTHER cells. This guarantees no two
                 * cells display the same logo at the same time, even
                 * mid-animation. The cell being flipped is excluded from the
                 * "in-use" set so it can be re-used elsewhere if needed. */
                const inUse = new Set(next.filter((_, i) => i !== cellIdx));
                const available = logos.filter((l) => !inUse.has(l));
                if (available.length === 0) return prev; // pool too small

                let candidate = available[Math.floor(Math.random() * available.length)];
                /* Also avoid no-op flips on the same cell. */
                let attempts = 0;
                while (candidate === next[cellIdx] && attempts < 5 && available.length > 1) {
                    candidate = available[Math.floor(Math.random() * available.length)];
                    attempts++;
                }
                next[cellIdx] = candidate;
                return next;
            });
        }, 1600);
        return () => clearInterval(interval);
    }, [reduced, logos]);

    return (
        <div className="dawki-logo-grid">
            {cellLogos.map((logoUrl, cellIdx) => (
                <div className="dawki-logo-cell" key={cellIdx}>
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={logoUrl}
                            src={logoUrl}
                            alt={`Client ${cellIdx + 1}`}
                            loading="lazy"
                            decoding="async"
                            initial={{ opacity: 0, rotateY: 90, scale: 0.8 }}
                            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                            exit={{ opacity: 0, rotateY: -90, scale: 0.8 }}
                            transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
                        />
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
};

export type SvcFeature = { title: string; desc: string; icon: string };
export type SvcStep = { n: string; t: string; d: string };
export type SvcCard = { title: string; desc: string; icon: React.ReactNode };
export type SvcTool = { n: string; s?: string; c?: string; url?: string; desc?: string };
export type SvcFAQ = { q: string; a: string };
export type SvcProject = { category: string; title: string; img: string };
export type SvcStat = { value: string; suffix?: string; label: string };
export type SvcIndustry = { title: string; desc: string; icon: string };
export type SvcWhy = { title: string; desc: string; icon: string };
export type GoogleReview = { name: string; role?: string; avatar?: string; rating: number; date?: string; text: string };
export type SvcProduct = {
    badge: string;
    badgeAlt?: boolean;
    titleStart: string;
    titleHighlight: string;
    desc: string;
    image: string;
    features: { icon: string; text: string }[];
    ctaLabel: string;
    ctaHref?: string;
    glowAlt?: boolean;
    reverse?: boolean;
};

export interface ServicePageProps {
    pageTitle: string;
    breadcrumbCategory: string;
    breadcrumbCategoryHref?: string;
    heroPill: string;
    heroTitleStart: string;
    heroTitleHighlight: string;
    heroSubtitle: string;
    heroVideoSrc?: string;
    heroPoster?: string;
    heroBgImage?: string;

    featuresPill: string;
    featuresTitleStart: string;
    featuresTitleHighlight: string;
    featuresSubtitle: string;
    features: SvcFeature[];

    processTitle?: string;
    processSteps: SvcStep[];

    servicesPill: string;
    servicesTitleStart: string;
    servicesTitleHighlight: string;
    servicesSubtitle: string;
    serviceCards: SvcCard[];
    servicesLayout?: 'grid' | 'timeline';

    toolsTitleStart?: string;
    toolsTitleHighlight?: string;
    toolsSubtitle?: string;
    tools?: SvcTool[];
    toolsLayout?: 'grid' | 'vertical';

    projectsHeading?: string;
    projects?: SvcProject[];
    hideProjects?: boolean;

    products?: SvcProduct[];
    productsPill?: string;
    productsTitleStart?: string;
    productsTitleHighlight?: string;
    productsSubtitle?: string;

    /* Optional extra sections */
    stats?: SvcStat[];
    statsHeading?: string;
    statsSubtitle?: string;

    industries?: SvcIndustry[];
    industriesHeading?: string;
    industriesSubtitle?: string;

    whyChooseUs?: SvcWhy[];
    whyChooseHeading?: string;
    whyChooseSubtitle?: string;

    hideTestimonial?: boolean;

    showClients?: boolean;
    clientLogos?: string[];
    clientsPill?: string;
    clientsHeading?: string;
    clientsHeadingHighlight?: string;

    googleReviews?: GoogleReview[];
    googleReviewsHeading?: string;
    googleReviewsSubtitle?: string;

    /* Free-form custom sections rendered between Tools and Stats sections */
    extraSections?: React.ReactNode;

    faqs: SvcFAQ[];
}

const DEFAULT_TOOLS: SvcTool[] = [
    { n: 'React JS', s: 'react', c: '61DAFB' },
    { n: 'Next JS', s: 'nextdotjs', c: '000000' },
    { n: 'Node JS', s: 'nodedotjs', c: '5FA04E' },
    { n: 'TypeScript', s: 'typescript', c: '3178C6' },
    { n: 'JavaScript', s: 'javascript', c: 'F7DF1E' },
    { n: 'Python', s: 'python', c: '3776AB' },
    { n: 'PHP', s: 'php', c: '777BB4' },
    { n: 'Tailwind CSS', s: 'tailwindcss', c: '06B6D4' },
    { n: 'AWS', url: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg' },
    { n: 'Google Cloud', s: 'googlecloud', c: '4285F4' },
    { n: 'Microsoft Azure', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg' },
    { n: 'Docker', s: 'docker', c: '2496ED' },
    { n: 'Kubernetes', s: 'kubernetes', c: '326CE5' },
    { n: 'MongoDB', s: 'mongodb', c: '47A248' },
    { n: 'PostgreSQL', s: 'postgresql', c: '4169E1' },
    { n: 'MySQL', s: 'mysql', c: '4479A1' },
    { n: 'Git', s: 'git', c: 'F05032' },
    { n: 'Github', s: 'github', c: '181717' },
    { n: 'Figma', s: 'figma', c: 'F24E1E' },
    { n: 'Vercel', s: 'vercel', c: '000000' },
];

const DEFAULT_PROJECTS: SvcProject[] = [
    { category: 'Business', title: 'E-Commerce Store — Custom Platform', img: '/assets/images/project/e_commerce.png' },
    { category: 'Business', title: 'Service Management — Workflow Automation', img: '/assets/images/project/cleaning_service.png' },
    { category: 'Business', title: 'CRM Software — Enterprise Solution', img: '/assets/images/project/crm_saas.png' },
];

const VerticalToolIcon: React.FC<{ tool: SvcTool }> = ({ tool }) => {
    const [failed, setFailed] = useState(false);
    const src = tool.url ?? (tool.s ? `https://cdn.simpleicons.org/${tool.s}/${tool.c ?? '4f7cff'}` : '');

    if (failed || !src) {
        return (
            <span className="dawki-tools-vertical-icon-letter" aria-hidden="true">
                {tool.n.charAt(0).toUpperCase()}
            </span>
        );
    }

    return (
        <img
            src={src}
            alt={tool.n}
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
        />
    );
};

const ServicesTimeline: React.FC<{ items: SvcCard[] }> = ({ items }) => {
    const ref = useRef<HTMLDivElement>(null);
    const reduced = useReducedMotion();
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start 80%', 'end 30%'],
    });
    const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

    return (
        <div ref={ref} className="dawki-csd-svc-timeline">
            <div className="dawki-csd-svc-timeline-track" aria-hidden="true" />
            <motion.div
                className="dawki-csd-svc-timeline-track-fill"
                style={reduced ? { height: '100%' } : { height: lineHeight }}
                aria-hidden="true"
            />
            <div className="dawki-csd-svc-timeline-rows">
                {items.map((s, i) => {
                    const isLeft = i % 2 === 0;
                    return (
                        <motion.div
                            key={i}
                            className={`dawki-csd-svc-timeline-row ${isLeft ? 'is-left' : 'is-right'}`}
                            initial={{ opacity: 0, x: isLeft ? -70 : 70, y: 20 }}
                            whileInView={{ opacity: 1, x: 0, y: 0 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                        >
                            <div className="dawki-csd-svc-timeline-node" aria-hidden="true">
                                <span className="dawki-csd-svc-timeline-node-pulse"></span>
                            </div>
                            <motion.article
                                className="dawki-csd-svc-card"
                                whileHover={{ y: -8, transition: { type: 'spring', stiffness: 320, damping: 22 } }}
                            >
                                <span className="dawki-csd-svc-card-sweep"></span>
                                <div className="dawki-csd-svc-card-glow"></div>
                                <div className="dawki-csd-svc-card-icon">{s.icon}</div>
                                <h3 className="dawki-csd-svc-card-title">{s.title}</h3>
                                <p className="dawki-csd-svc-card-desc">{s.desc}</p>
                                <span className="dawki-csd-svc-card-arrow">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
                                </span>
                            </motion.article>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default function ServicePageTemplate(props: ServicePageProps) {
    const {
        pageTitle,
        breadcrumbCategory,
        breadcrumbCategoryHref = '/about',
        heroPill,
        heroTitleStart,
        heroTitleHighlight,
        heroSubtitle,
        heroVideoSrc = 'https://amazedveku.de/images/coding.mp4',
        heroPoster = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1920&q=80',
        featuresPill,
        featuresTitleStart,
        featuresTitleHighlight,
        featuresSubtitle,
        features,
        processTitle = 'Our Engineering Process',
        processSteps,
        servicesPill,
        servicesTitleStart,
        servicesTitleHighlight,
        servicesSubtitle,
        serviceCards,
        servicesLayout = 'grid',
        toolsTitleStart = 'Robust Tools &',
        toolsTitleHighlight = 'Technologies We Work',
        toolsSubtitle = 'A modern, battle-tested stack across frontend, backend, cloud, design, and AI — chosen per project for the best result.',
        tools = DEFAULT_TOOLS,
        toolsLayout = 'grid',
        projectsHeading = 'Transforming Businesses Through Excellence',
        projects = DEFAULT_PROJECTS,
        hideProjects = false,
        products,
        productsPill = 'Our Products',
        productsTitleStart = 'Built In-House.',
        productsTitleHighlight = 'Trusted by Teams.',
        productsSubtitle = 'Our own SaaS products that power businesses every day — designed, engineered, and scaled by Dawki Infotech.',
        heroBgImage,
        stats,
        statsHeading = 'Numbers That Speak for Themselves',
        statsSubtitle = 'A track record built on shipped products, happy clients, and measurable outcomes.',
        industries,
        industriesHeading = 'Industries We Serve',
        industriesSubtitle = 'Deep domain experience across the industries we work with most.',
        whyChooseUs,
        whyChooseHeading = 'Why Choose Us',
        whyChooseSubtitle = 'A few of the reasons teams pick us — and stay with us.',
        hideTestimonial = false,
        showClients = false,
        clientLogos,
        clientsPill = 'Trusted By 500+ Businesses',
        clientsHeading = 'From Emerging Startups to Industry Leaders,',
        clientsHeadingHighlight = 'We Drive Digital Innovation',
        googleReviews,
        googleReviewsHeading = 'What Our Clients Say on Google',
        googleReviewsSubtitle = 'Real reviews from real clients — verified on Google.',
        extraSections,
        faqs,
    } = props;

    /* ========================================================================
     * Contact form ("Drop us a Line Here") — wired to the same /contact
     * endpoint and persisted into the same `contact_us` table as the main
     * Contact page. The dropdown values are mapped to the `help_type` enum
     * accepted by the controller (team / software / design / marketing / others).
     * ======================================================================== */
    const { props: pageProps } = usePage<{ flash?: { success?: string } }>();
    const flashSuccess = pageProps.flash?.success;

    const contactForm = useForm({
        name: '',
        email: '',
        phone: '',
        help_type: 'software',
        message: '',
    });

    /* Map a friendly subject string to the controller's allowed help_type enum. */
    const mapSubjectToHelpType = (subject: string): string => {
        const s = subject.toLowerCase();
        if (s.includes('it support') || s.includes('maintenance') || s.includes('strategy')) return 'software';
        if (s.includes('customer experience') || s.includes('design')) return 'design';
        if (s.includes('marketing'))                                    return 'marketing';
        if (s.includes('training') || s.includes('development'))        return 'team';
        return 'others';
    };

    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        contactForm.post('/contact', {
            preserveScroll: true,
            onSuccess: () => contactForm.reset('name', 'email', 'phone', 'message'),
        });
    };

    useEffect(() => {
        const bgSelector = document.querySelectorAll('[data-bg-image]');
        bgSelector.forEach((element) => {
            const el = element as HTMLElement;
            const bgImage = el.getAttribute('data-bg-image');
            if (bgImage) {
                el.style.backgroundImage = `url(${bgImage})`;
            }
        });

        const odometers = document.querySelectorAll('.odometer.countup-number');
        odometers.forEach((element) => {
            const el = element as HTMLElement;
            const count = el.getAttribute('data-count');
            if (count) {
                el.textContent = count;
            }
        });

        import('swiper/bundle').then(({ default: Swiper }) => {
            document.querySelectorAll('.project-slider-3').forEach((element) => {
                const slider = element as HTMLElement;
                if ((slider as any).__swiper_initialized) return;
                const paginationEl = slider.querySelector('.swiper-pagination-area') as HTMLElement | null;
                new Swiper(slider, {
                    slidesPerView: 3,
                    spaceBetween: 30,
                    loop: true,
                    autoplay: { delay: 3000, disableOnInteraction: false },
                    breakpoints: {
                        0: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1200: { slidesPerView: 3 },
                    },
                    pagination: paginationEl ? { el: paginationEl, clickable: true } : undefined,
                });
                (slider as any).__swiper_initialized = true;
            });

            document.querySelectorAll('.dawki-greviews-slider').forEach((element) => {
                const slider = element as HTMLElement;
                if ((slider as any).__swiper_initialized) return;
                const paginationEl = slider.querySelector('.dawki-greviews-pagination') as HTMLElement | null;
                new Swiper(slider, {
                    slidesPerView: 3,
                    spaceBetween: 24,
                    loop: true,
                    autoplay: { delay: 4000, disableOnInteraction: false },
                    breakpoints: {
                        0: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1200: { slidesPerView: 3 },
                    },
                    pagination: paginationEl ? { el: paginationEl, clickable: true } : undefined,
                });
                (slider as any).__swiper_initialized = true;
            });
        }).catch(() => {});
    }, []);

    return (
        <FrontendLayout>
            <Head title={pageTitle} />
            <main id="primary" className="site-main">
                <div className="space-for-header"></div>

                {/* Hero */}
                <section className="dawki-svc-hero" style={heroBgImage ? { backgroundImage: `url(${heroBgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>
                    {!heroBgImage && (
                        <video
                            className="dawki-svc-hero-video"
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            poster={heroPoster}
                        >
                            <source src={heroVideoSrc} type="video/mp4" />
                        </video>
                    )}
                    <div className="dawki-svc-hero-overlay"></div>
                    <div className="container">
                        <div className="dawki-svc-hero-content">
                            <nav className="dawki-svc-breadcrumb" aria-label="Breadcrumb">
                                <Link href="/"><i className="tji-home"></i> Home</Link>
                                <span>›</span>
                                <Link href={breadcrumbCategoryHref}>Services</Link>
                                <span>›</span>
                                <span className="dawki-svc-breadcrumb-current">{pageTitle}</span>
                            </nav>
                            <span className="dawki-svc-hero-pill">
                                <span className="dawki-contact-dot"></span>
                                {heroPill}
                            </span>
                            <h1 className="dawki-svc-hero-title">
                                {heroTitleStart} <span>{heroTitleHighlight}</span>
                            </h1>
                            <p className="dawki-svc-hero-subtitle">{heroSubtitle}</p>
                            <div className="dawki-svc-hero-actions">
                                <Link href="/contact" className="dawki-svc-hero-cta">
                                    <span>Start Your Project</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                                </Link>
                                <a href="#csd-features" className="dawki-svc-hero-cta dawki-svc-hero-cta--ghost">
                                    <span>Explore Capabilities</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features + Process */}
                <section id="csd-features" className="dawki-csd-section">
                    <div className="container">
                        <div className="dawki-csd-heading">
                            <span className="dawki-csd-pill">
                                <span className="dawki-contact-dot"></span>
                                {featuresPill}
                            </span>
                            <h2 className="dawki-csd-title">
                                {featuresTitleStart} <span>{featuresTitleHighlight}</span>
                            </h2>
                            <p className="dawki-csd-subtitle">{featuresSubtitle}</p>
                        </div>

                        <div className="dawki-csd-features">
                            {features.map((f, i) => (
                                <div className="dawki-csd-feature" key={i}>
                                    <div className="dawki-csd-feature-icon">{f.icon}</div>
                                    <h3 className="dawki-csd-feature-title">{f.title}</h3>
                                    <p className="dawki-csd-feature-desc">{f.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="dawki-csd-process">
                            <h3 className="dawki-csd-process-title">{processTitle}</h3>
                            <div className="dawki-csd-process-steps">
                                {processSteps.map((s, i) => (
                                    <div className="dawki-csd-step" key={i}>
                                        <div className="dawki-csd-step-num">{s.n}</div>
                                        <h4 className="dawki-csd-step-title">{s.t}</h4>
                                        <p className="dawki-csd-step-desc">{s.d}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services Cards */}
                <section className="dawki-csd-services">
                    <div className="container">
                        <div className="dawki-csd-services-heading">
                            <span className="dawki-csd-pill">
                                <span className="dawki-contact-dot"></span>
                                {servicesPill}
                            </span>
                            <h2 className="dawki-csd-services-title">
                                {servicesTitleStart} <span>{servicesTitleHighlight}</span>
                            </h2>
                            <p className="dawki-csd-services-subtitle">{servicesSubtitle}</p>
                        </div>

                        {servicesLayout === 'timeline' ? (
                            <ServicesTimeline items={serviceCards} />
                        ) : (
                            <motion.div
                                className="dawki-csd-services-grid"
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, margin: '-80px' }}
                                variants={{
                                    hidden: {},
                                    show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
                                }}
                            >
                                {serviceCards.map((s, i) => (
                                    <motion.article
                                        className="dawki-csd-svc-card"
                                        key={i}
                                        variants={{
                                            hidden: { opacity: 0, y: 40, scale: 0.94 },
                                            show: {
                                                opacity: 1,
                                                y: 0,
                                                scale: 1,
                                                transition: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] },
                                            },
                                        }}
                                        whileHover={{ y: -10, transition: { type: 'spring', stiffness: 320, damping: 22 } }}
                                    >
                                        <span className="dawki-csd-svc-card-sweep"></span>
                                        <div className="dawki-csd-svc-card-glow"></div>
                                        <div className="dawki-csd-svc-card-icon">{s.icon}</div>
                                        <h3 className="dawki-csd-svc-card-title">{s.title}</h3>
                                        <p className="dawki-csd-svc-card-desc">{s.desc}</p>
                                        <span className="dawki-csd-svc-card-arrow">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
                                        </span>
                                    </motion.article>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </section>

                {/* Tools */}
                <section className="dawki-tools-section">
                    <div className="container">
                        <div className="dawki-tools-heading">
                            <h2 className="dawki-tools-title">
                                {toolsTitleStart} <span>{toolsTitleHighlight}</span>
                            </h2>
                            <p className="dawki-tools-subtitle">{toolsSubtitle}</p>
                        </div>

                        {toolsLayout === 'vertical' ? (
                            <motion.div
                                className="dawki-tools-vertical"
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, margin: '-80px' }}
                                variants={{
                                    hidden: {},
                                    show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
                                }}
                            >
                                {tools.map((t, i) => (
                                    <motion.div
                                        className="dawki-tools-vertical-card"
                                        key={i}
                                        variants={{
                                            hidden: { opacity: 0, x: -40 },
                                            show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] } },
                                        }}
                                        whileHover={{ x: 6, transition: { type: 'spring', stiffness: 320, damping: 22 } }}
                                    >
                                        <div className="dawki-tools-vertical-icon">
                                            <VerticalToolIcon tool={t} />
                                        </div>
                                        <div className="dawki-tools-vertical-content">
                                            <h3 className="dawki-tools-vertical-name">{t.n}</h3>
                                            {t.desc && <p className="dawki-tools-vertical-desc">{t.desc}</p>}
                                        </div>
                                        <span className="dawki-tools-vertical-arrow" aria-hidden="true">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                                        </span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <div className="dawki-tools-grid">
                                {tools.map((t, i) => (
                                    <div className="dawki-tool-card" key={i}>
                                        <div className="dawki-tool-icon">
                                            <img
                                                loading="lazy"
                                                decoding="async"
                                                src={t.url ?? `https://cdn.simpleicons.org/${t.s}/${t.c}`}
                                                alt={t.n}
                                                onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
                                            />
                                        </div>
                                        <span className="dawki-tool-name">{t.n}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Free-form custom sections (optional) */}
                {extraSections}

                {/* Stats (optional) */}
                {stats && stats.length > 0 && (
                    <section className="dawki-stats-section">
                        <div className="container">
                            <div className="dawki-stats-heading">
                                <h2 className="dawki-stats-title">{statsHeading}</h2>
                                <p className="dawki-stats-subtitle">{statsSubtitle}</p>
                            </div>
                            <div className="dawki-stats-grid">
                                {stats.map((s, i) => (
                                    <div className="dawki-stat-card" key={i}>
                                        <div className="dawki-stat-value">
                                            <span>{s.value}</span>
                                            {s.suffix && <span className="dawki-stat-suffix">{s.suffix}</span>}
                                        </div>
                                        <div className="dawki-stat-label">{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Why Choose Us (optional) */}
                {whyChooseUs && whyChooseUs.length > 0 && (
                    <section className="dawki-why-section">
                        <div className="container">
                            <div className="dawki-why-heading">
                                <span className="dawki-csd-pill">
                                    <span className="dawki-contact-dot"></span>
                                    Why Us
                                </span>
                                <h2 className="dawki-why-title">{whyChooseHeading}</h2>
                                <p className="dawki-why-subtitle">{whyChooseSubtitle}</p>
                            </div>
                            <div className="dawki-why-grid">
                                {whyChooseUs.map((w, i) => (
                                    <div className="dawki-why-card" key={i}>
                                        <div className="dawki-why-icon">{w.icon}</div>
                                        <h3 className="dawki-why-card-title">{w.title}</h3>
                                        <p className="dawki-why-card-desc">{w.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Industries (optional) */}
                {industries && industries.length > 0 && (
                    <section className="dawki-industries-section">
                        <div className="container">
                            <div className="dawki-industries-heading">
                                <span className="dawki-csd-pill">
                                    <span className="dawki-contact-dot"></span>
                                    Industries
                                </span>
                                <h2 className="dawki-industries-title">{industriesHeading}</h2>
                                <p className="dawki-industries-subtitle">{industriesSubtitle}</p>
                            </div>
                            <div className="dawki-industries-grid">
                                {industries.map((ind, i) => (
                                    <div className="dawki-industry-card" key={i}>
                                        <div className="dawki-industry-icon">{ind.icon}</div>
                                        <h3 className="dawki-industry-title">{ind.title}</h3>
                                        <p className="dawki-industry-desc">{ind.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Projects */}
                {!hideProjects && (
                    <section className="tj-project-section-4 section-gap">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12">
                                    <div className="sec-heading style-4 text-center">
                                        <span className="sub-title wow fadeInUp" data-wow-delay=".3s"><i className="tji-box"></i>Proud Projects</span>
                                        <h2 className="sec-title title-anim">{projectsHeading}</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <div className="project-wrapper wow fadeInUp" data-wow-delay=".5s">
                                        <div className="swiper project-slider-3">
                                            <div className="swiper-wrapper">
                                                {projects.map((p, i) => (
                                                    <div className="swiper-slide" key={i}>
                                                        <div className="project-item h4-project-item">
                                                            <div className="project-content">
                                                                <span className="categories"><Link href="/portfolio-details">{p.category}</Link></span>
                                                                <div className="project-text">
                                                                    <h4 className="title"><Link href="/portfolio-details">{p.title}</Link></h4>
                                                                    <Link className="tji-icon-btn" href="/portfolio-details">
                                                                        <i className="tji-arrow-right-long"></i>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                            <div className="project-img">
                                                                <img src={p.img} alt={p.title} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="swiper-pagination-area"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Our Products (optional) */}
                {products && products.length > 0 && (
                    <section className="dawki-products">
                        <div className="dawki-products-orb dawki-products-orb--a"></div>
                        <div className="dawki-products-orb dawki-products-orb--b"></div>
                        <div className="container">
                            <div className="dawki-products-heading">
                                <span className="dawki-products-pill">
                                    <span className="dawki-products-dot"></span>
                                    {productsPill}
                                </span>
                                <h2 className="dawki-products-title">
                                    {productsTitleStart} <span>{productsTitleHighlight}</span>
                                </h2>
                                <p className="dawki-products-subtitle">{productsSubtitle}</p>
                            </div>

                            <div className="dawki-products-list">
                                {products.map((p, i) => (
                                    <article
                                        key={i}
                                        className={`dawki-product-card${p.reverse ? ' dawki-product-card--reverse' : ''}`}
                                    >
                                        <div className="dawki-product-visual">
                                            <div className="dawki-product-frame">
                                                <div className="dawki-product-frame-bar">
                                                    <span></span><span></span><span></span>
                                                </div>
                                                <img loading="lazy" decoding="async" src={p.image} alt={`${p.titleStart} ${p.titleHighlight}`} />
                                            </div>
                                            <div className={`dawki-product-frame-glow${p.glowAlt ? ' dawki-product-frame-glow--alt' : ''}`}></div>
                                        </div>
                                        <div className="dawki-product-content">
                                            <span className={`dawki-product-badge${p.badgeAlt ? ' dawki-product-badge--alt' : ''}`}>{p.badge}</span>
                                            <h3 className="dawki-product-title">
                                                {p.titleStart} <span>{p.titleHighlight}</span>
                                            </h3>
                                            <p className="dawki-product-desc">{p.desc}</p>
                                            <ul className="dawki-product-features">
                                                {p.features.map((f, fi) => (
                                                    <li key={fi}><i>{f.icon}</i>{f.text}</li>
                                                ))}
                                            </ul>
                                            <div className="dawki-product-actions">
                                                <Link href={p.ctaHref ?? '/contact'} className="dawki-product-btn">
                                                    <span>{p.ctaLabel}</span>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Testimonial */}
                {!hideTestimonial && (
                <section className="h6-testimonial section-gap section-gap-x slidebar-stickiy-container">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="h6-testimonial-banner">
                                    <img src="/assets/images/testimonial/client_feedback.jpg" alt="Client feedback" />
                                    <a className="h6-testimonial-banner-video video-popup" href="https://youtu.be/gXFATcwrO-U"
                                        data-autoplay="true" data-vbtype="video">
                                        <i className="tji-play"></i>
                                    </a>
                                </div>
                                <div className="content-wrap slidebar-stickiy">
                                    <div className="sec-heading style-2 style-6">
                                        <span className="sub-title wow fadeInUp" data-wow-delay=".3s"><i className="tji-box"></i>CLIENT FEEDBACK</span>
                                        <h2 className="sec-title title-anim">Our Clients Share Their Success Stories</h2>
                                    </div>
                                    <p className="desc">Our approach to customer experience is comprehensive and data-driven. We begin by assessing your current.</p>
                                    <div className="d-none d-lg-inline-flex wow fadeInUp" data-wow-delay=".6s">
                                        <Link className="tj-primary-btn" href="/contact">
                                            <span className="btn-text"><span>Explore More</span></span>
                                            <span className="btn-icon"><i className="tji-arrow-right-long"></i></span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="testimonial-wrapper h6-testimonial-wrapper wow fadeInUp" data-wow-delay=".5s">
                                    <div className="swiper swiper-container h6-testimonial-slider">
                                        <div className="swiper-wrapper">
                                            <div className="swiper-slide">
                                                <div className="testimonial-item">
                                                    <div className="h6-testimonial-author-wrapper">
                                                        <div className="testimonial-author">
                                                            <div className="author-inner">
                                                                <div className="author-img">
                                                                    <img src="/assets/images/testimonial/6.png" alt="" />
                                                                </div>
                                                                <div className="author-header">
                                                                    <h4 className="title">Sophia Martinez</h4>
                                                                    <span className="designation">Director of Operations, BrightPath Consulting</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="star-ratings">
                                                            <div className="fill-ratings" style={{ width: '100%' }}>
                                                                <span>★★★★★</span>
                                                            </div>
                                                            <div className="empty-ratings">
                                                                <span>★★★★★</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="desc">
                                                        <p>The team at Dawki Infotech delivered quality work on time. Their ability to adapt was impressive — a reliable partner for ambitious software projects.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="swiper-slide">
                                                <div className="testimonial-item">
                                                    <div className="h6-testimonial-author-wrapper">
                                                        <div className="testimonial-author">
                                                            <div className="author-inner">
                                                                <div className="author-img">
                                                                    <img src="/assets/images/testimonial/7.png" alt="" />
                                                                </div>
                                                                <div className="author-header">
                                                                    <h4 className="title">Michael Anderson</h4>
                                                                    <span className="designation">CEO, Anderson Global Solutions</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="star-ratings">
                                                            <div className="fill-ratings" style={{ width: '100%' }}>
                                                                <span>★★★★★</span>
                                                            </div>
                                                            <div className="empty-ratings">
                                                                <span>★★★★★</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="desc">
                                                        <p>The team was responsive and professional throughout. Smooth collaboration and a polished result that met every expectation.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="swiper-slide">
                                                <div className="testimonial-item">
                                                    <div className="h6-testimonial-author-wrapper">
                                                        <div className="testimonial-author">
                                                            <div className="author-inner">
                                                                <div className="author-img">
                                                                    <img src="/assets/images/testimonial/8.png" alt="" />
                                                                </div>
                                                                <div className="author-header">
                                                                    <h4 className="title">David Thompson</h4>
                                                                    <span className="designation">CTO, InnovateX Technologies</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="star-ratings">
                                                            <div className="fill-ratings" style={{ width: '100%' }}>
                                                                <span>★★★★★</span>
                                                            </div>
                                                            <div className="empty-ratings">
                                                                <span>★★★★★</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="desc">
                                                        <p>Dawki Infotech handled our complex project with strong problem-solving skills. The final product met expectations on every dimension.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-shape-1"><img src="/assets/images/shape/pattern-2.svg" alt="" /></div>
                    <div className="bg-shape-2"><img src="/assets/images/shape/pattern-3.svg" alt="" /></div>
                </section>
                )}

                {/* Our Clients (optional) */}
                {showClients && (
                    <section className="dawki-clients section-gap">
                        <div className="container">
                            <div className="dawki-clients-heading">
                                <span className="dawki-clients-pill">
                                    <span className="dawki-values-dot"></span>
                                    {clientsPill}
                                </span>
                                <h2 className="dawki-clients-title">
                                    {clientsHeading} <span>{clientsHeadingHighlight}</span>
                                </h2>
                            </div>
                            <ClientLogoGrid logos={clientLogos} />
                        </div>
                    </section>
                )}

                {/* Pricing */}
                <section className="h10-pricing section-gap">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="sec-heading style-3 sec-heading-centered">
                                    <span className="sub-title wow fadeInUp" data-wow-delay=".3s"><i className="tji-box"></i>Our PRICING PLAN</span>
                                    <h2 className="sec-title text-anim"></h2>
                                </div>
                            </div>
                        </div>
                        <div className="row row-gap-4">
                            <div className="col-xl-4 col-md-6">
                                <div className="pricing-box h10-pricing-box wow fadeInUp" data-wow-delay=".5s">
                                    <div className="pricing-header">
                                        <h4 className="package-name">Basic Plan</h4>
                                        <div className="package-desc"><p>Essential {pageTitle} Services</p></div>
                                    </div>
                                    <div className="pricing-body">
                                        <div className="list-items h10-pricing-list">
                                            <div className="title-wrapper">
                                                <h5 className="title">Features</h5>
                                                <p className="desc">Includes:</p>
                                            </div>
                                            <ul>
                                                <li><i className="tji-list"></i>Access to core services</li>
                                                <li><i className="tji-list"></i>Limited customer support (email)</li>
                                                <li><i className="tji-list"></i>1 project per month</li>
                                                <li><i className="tji-list"></i>Basic reporting and analytics</li>
                                                <li><i className="tji-list"></i>Standard templates and tools</li>
                                                <li><i className="tji-list"></i>Basic performance tracking</li>
                                            </ul>
                                        </div>
                                        <div className="pricing-btn">
                                            <Link className="text-btn" href="/estimate">
                                                <span className="btn-text"><span>Chose Plan</span></span>
                                                <span className="btn-icon"><i className="tji-arrow-right-long"></i></span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-4 col-md-6">
                                <div className="pricing-box h10-pricing-box active wow fadeInUp" data-wow-delay=".7s">
                                    <div className="pricing-header">
                                        <div className="pricing-badge"><i className="tji-star-2"></i> <span>Popular</span></div>
                                        <h4 className="package-name">Standard Plan</h4>
                                        <div className="package-desc"><p>Complete Business Solutions</p></div>
                                    </div>
                                    <div className="pricing-body">
                                        <div className="list-items">
                                            <div className="title-wrapper">
                                                <h5 className="title">Features</h5>
                                                <p className="desc">Includes all Basic plan and Plus:</p>
                                            </div>
                                            <ul>
                                                <li><i className="tji-list"></i>All features in Basic Plan</li>
                                                <li><i className="tji-list"></i>Priority customer support</li>
                                                <li><i className="tji-list"></i>Up to 3 projects per month</li>
                                                <li><i className="tji-list"></i>Monthly performance reviews</li>
                                                <li><i className="tji-list"></i>Collaboration tools for team</li>
                                                <li><i className="tji-list"></i>Custom templates</li>
                                            </ul>
                                        </div>
                                        <div className="pricing-btn">
                                            <Link className="text-btn" href="/estimate">
                                                <span className="btn-text"><span>Chose Plan</span></span>
                                                <span className="btn-icon"><i className="tji-arrow-right-long"></i></span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-4 col-md-6">
                                <div className="pricing-box h10-pricing-box wow fadeInUp" data-wow-delay=".9s">
                                    <div className="pricing-header">
                                        <h4 className="package-name">Premium Plan</h4>
                                        <div className="package-desc"><p>Advanced Business Services</p></div>
                                    </div>
                                    <div className="pricing-body">
                                        <div className="list-items">
                                            <div className="title-wrapper">
                                                <h5 className="title">Features</h5>
                                                <p className="desc">Includes all Standard plan and Plus:</p>
                                            </div>
                                            <ul>
                                                <li><i className="tji-list"></i>All features in Standard Plan</li>
                                                <li><i className="tji-list"></i>Dedicated account manager</li>
                                                <li><i className="tji-list"></i>Tailored strategy sessions</li>
                                                <li><i className="tji-list"></i>Quarterly performance audits</li>
                                                <li><i className="tji-list"></i>Priority support</li>
                                                <li><i className="tji-list"></i>24/7 emergency service</li>
                                            </ul>
                                        </div>
                                        <div className="pricing-btn">
                                            <Link className="text-btn" href="/estimate">
                                                <span className="btn-text"><span>Chose Plan</span></span>
                                                <span className="btn-icon"><i className="tji-arrow-right-long"></i></span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Google Reviews (optional) */}
                {googleReviews && googleReviews.length > 0 && (
                    <section className="dawki-greviews-section">
                        <div className="container">
                            <div className="dawki-greviews-heading">
                                <div className="dawki-greviews-badge">
                                    <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true">
                                        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                                        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                                        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                                        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
                                    </svg>
                                    <span>Verified on Google</span>
                                </div>
                                <h2 className="dawki-greviews-title">{googleReviewsHeading}</h2>
                                <p className="dawki-greviews-subtitle">{googleReviewsSubtitle}</p>
                                <div className="dawki-greviews-rating">
                                    <div className="dawki-greviews-stars">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="#FFB400"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                                        ))}
                                    </div>
                                    <span className="dawki-greviews-rating-text">5.0 average from {googleReviews.length}+ reviews</span>
                                </div>
                            </div>

                            <div className="swiper dawki-greviews-slider">
                                <div className="swiper-wrapper">
                                    {googleReviews.map((r, i) => (
                                        <div className="swiper-slide" key={i}>
                                            <article className="dawki-greview-card">
                                                <div className="dawki-greview-top">
                                                    <div className="dawki-greview-author">
                                                        {r.avatar ? (
                                                            <img src={r.avatar} alt={r.name} loading="lazy" />
                                                        ) : (
                                                            <div className="dawki-greview-avatar-fallback">{r.name.charAt(0)}</div>
                                                        )}
                                                        <div className="dawki-greview-author-meta">
                                                            <h4 className="dawki-greview-name">{r.name}</h4>
                                                            {r.role && <span className="dawki-greview-role">{r.role}</span>}
                                                        </div>
                                                    </div>
                                                    <svg className="dawki-greview-google-mark" width="22" height="22" viewBox="0 0 48 48" aria-hidden="true">
                                                        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                                                        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                                                        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                                                        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
                                                    </svg>
                                                </div>
                                                <div className="dawki-greview-stars">
                                                    {Array.from({ length: 5 }).map((_, idx) => (
                                                        <svg key={idx} width="16" height="16" viewBox="0 0 24 24" fill={idx < r.rating ? '#FFB400' : '#E5E7EB'}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                                                    ))}
                                                    {r.date && <span className="dawki-greview-date">{r.date}</span>}
                                                </div>
                                                <p className="dawki-greview-text">{r.text}</p>
                                            </article>
                                        </div>
                                    ))}
                                </div>
                                <div className="dawki-greviews-pagination"></div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Contact */}
                <section className="tj-contact-section h4-contact-section section-gap section-gap-x">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="contact-form style-3 wow fadeInUp" data-wow-delay=".4s">
                                    <div className="sec-heading style-4">
                                        <span className="sub-title"><i className="tji-box"></i>Get in Touch</span>
                                        <h2 className="sec-title title-anim">Drop us a Line Here.</h2>
                                    </div>
                                    <form id="contact-form-3" onSubmit={handleContactSubmit} noValidate>
                                        <div className="row wow fadeInUp" data-wow-delay=".5s">
                                            {(flashSuccess || contactForm.recentlySuccessful) && (
                                                <div className="col-sm-12">
                                                    <div
                                                        className="dawki-form-success"
                                                        role="status"
                                                        style={{ marginBottom: '14px' }}
                                                    >
                                                        ✓ {flashSuccess || "Thanks — your message has been received. We'll get back to you within 24 hours."}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="col-sm-6">
                                                <div className="form-input">
                                                    <label className="cf-label" htmlFor="cf3-name">Full Name *</label>
                                                    <input
                                                        id="cf3-name"
                                                        type="text"
                                                        name="name"
                                                        required
                                                        value={contactForm.data.name}
                                                        onChange={(e) => contactForm.setData('name', e.target.value)}
                                                    />
                                                    {contactForm.errors.name && (
                                                        <span className="dawki-form-error" style={{ color: '#f87171', fontSize: '12px' }}>{contactForm.errors.name}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-input">
                                                    <label className="cf-label" htmlFor="cf3-email">Email Address *</label>
                                                    <input
                                                        id="cf3-email"
                                                        type="email"
                                                        name="email"
                                                        required
                                                        value={contactForm.data.email}
                                                        onChange={(e) => contactForm.setData('email', e.target.value)}
                                                    />
                                                    {contactForm.errors.email && (
                                                        <span className="dawki-form-error" style={{ color: '#f87171', fontSize: '12px' }}>{contactForm.errors.email}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-input">
                                                    <label className="cf-label" htmlFor="cf3-phone">Phone number</label>
                                                    <input
                                                        id="cf3-phone"
                                                        type="tel"
                                                        name="phone"
                                                        value={contactForm.data.phone}
                                                        onChange={(e) => contactForm.setData('phone', e.target.value)}
                                                    />
                                                    {contactForm.errors.phone && (
                                                        <span className="dawki-form-error" style={{ color: '#f87171', fontSize: '12px' }}>{contactForm.errors.phone}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-input">
                                                    <div className="tj-nice-select-box">
                                                        <div className="tj-select">
                                                            <label className="cf-label" htmlFor="cf3-subject">Chose a option</label>
                                                            <select
                                                                id="cf3-subject"
                                                                name="subject"
                                                                onChange={(e) => contactForm.setData('help_type', mapSubjectToHelpType(e.target.value))}
                                                                defaultValue="Business Strategy"
                                                            >
                                                                <option value="Business Strategy">Business Strategy</option>
                                                                <option value="Customer Experience">Customer Experience</option>
                                                                <option value="Sustainability and ESG">Sustainability and ESG</option>
                                                                <option value="Training and Development">Training and Development</option>
                                                                <option value="IT Support & Maintenance">IT Support &amp; Maintenance</option>
                                                                <option value="Marketing Strategy">Marketing Strategy</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-12">
                                                <div className="form-input message-input">
                                                    <label className="cf-label" htmlFor="cf3-message">Message here... *</label>
                                                    <textarea
                                                        id="cf3-message"
                                                        name="message"
                                                        required
                                                        value={contactForm.data.message}
                                                        onChange={(e) => contactForm.setData('message', e.target.value)}
                                                    ></textarea>
                                                    {contactForm.errors.message && (
                                                        <span className="dawki-form-error" style={{ color: '#f87171', fontSize: '12px' }}>{contactForm.errors.message}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="submit-btn">
                                                <button className="tj-primary-btn" type="submit" disabled={contactForm.processing}>
                                                    <span className="btn-text"><span>{contactForm.processing ? 'Sending…' : 'Send Message'}</span></span>
                                                    <span className="btn-icon"><i className="tji-arrow-right-long"></i></span>
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="testimonial-wrapper-3 wow fadeInUp" data-wow-delay=".5s">
                                    <div className="swiper testimonial-slider-2 h4-testimonial">
                                        <div className="about-content-area  h6-about-content  style-1 wow fadeInLeft" data-wow-delay=".2s">
                                            <div className="sec-heading style-2 style-6">
                                                <h2 className="sec-title title-anim">Driving Innovation for Smarter, Stronger, and Sustainable Growth</h2>
                                                <p className="desc  wow fadeInUp" data-wow-delay=".8s">We combine data-driven insights with cutting-edge strategies to help businesses optimize performance, enhance customer experiences, and achieve measurable success.</p>
                                            </div>
                                            <div className="h6-about-funfact-wrapper">
                                                <div className="h6-about-funfact">
                                                    <div className="countup-item">
                                                        <div className="inline-content">
                                                            <span className="odometer countup-number" data-count="500"></span>
                                                            <span className="count-plus">+</span>
                                                        </div>
                                                        <span className="count-text">Successful Projects Delivered Globally.</span>
                                                    </div>
                                                    <div className="countup-item">
                                                        <div className="inline-content">
                                                            <span className="odometer countup-number" data-count="3"></span>
                                                            <span className="count-plus">X</span>
                                                        </div>
                                                        <span className="count-text">Faster Business Growth with Our Solutions.</span>
                                                    </div>
                                                </div>
                                                <div className="h6-about-funfact-shape">
                                                    <img src="/assets/images/shape/about-counter-shape-blur.svg" alt="" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-shape-1"><img src="/assets/images/shape/pattern-2.svg" alt="" /></div>
                    <div className="bg-shape-2"><img src="/assets/images/shape/pattern-3.svg" alt="" /></div>
                </section>

                {/* FAQ */}
                <section className="tj-blog-section section-gap slidebar-stickiy-container">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <h3 className="wow fadeInUp" data-wow-delay=".3s">Frequently asked questions</h3>
                                <div className="accordion tj-faq style-2" id="faqOne">
                                    {faqs.map((f, i) => (
                                        <div className={`accordion-item ${i === 0 ? 'active' : ''} wow fadeInUp`} data-wow-delay=".3s" key={i}>
                                            <button
                                                className={`faq-title ${i === 0 ? '' : 'collapsed'}`}
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target={`#faq-${i + 1}`}
                                                aria-expanded={i === 0 ? 'true' : 'false'}
                                            >
                                                {f.q}
                                            </button>
                                            <div id={`faq-${i + 1}`} className={`collapse ${i === 0 ? 'show' : ''}`} data-bs-parent="#faqOne">
                                                <div className="accordion-body faq-text">
                                                    <p>{f.a}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="tj-cta-section">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="cta-area">
                                    <div className="cta-content">
                                        <h2 className="title title-anim">Let's Build Future Together.</h2>
                                        <div className="cta-btn wow fadeInUp" data-wow-delay=".6s">
                                            <Link className="tj-primary-btn btn-dark" href="/contact">
                                                <span className="btn-text"><span>Get Started Now</span></span>
                                                <span className="btn-icon"><i className="tji-arrow-right-long"></i></span>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="cta-img"><img src="/assets/images/cta/footer_cta.jpg" alt="" /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </FrontendLayout>
    );
}

/* Common reusable SVG icons for service cards */
export const ICON = {
    search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
    palette: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r="2.5" /><circle cx="19" cy="13" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="10" cy="20" r="2.5" /><path d="M12 22a10 10 0 1 1 10-10 4 4 0 0 1-4 4h-2.5a2.5 2.5 0 0 0 0 5 .5.5 0 0 1 .5.5V22" /></svg>,
    wrench: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>,
    refresh: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>,
    cloud: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" /></svg>,
    globe: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>,
    check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
    infinity: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z" /></svg>,
    shield: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    code: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
    home: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
    chart: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>,
    target: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>,
    rocket: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>,
    cog: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
    bot: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /><line x1="8" y1="16" x2="8" y2="16" /><line x1="16" y1="16" x2="16" y2="16" /></svg>,
    database: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>,
    megaphone: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></svg>,
    link: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>,
    box: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>,
    lock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
    eye: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
    headset: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.22C21 6.73 16.74 3 12 3c-4.69 0-9 3.65-9 9.28-.6.34-1 .98-1 1.72v2c0 1.1.9 2 2 2h1v-6.1c0-3.87 3.13-7 7-7s7 3.13 7 7V19h-8v2h8c1.1 0 2-.9 2-2v-1.22c.59-.31 1-.92 1-1.64v-2.3c0-.7-.41-1.31-1-1.62z" /></svg>,
};
