import { Head, Link } from '@inertiajs/react';
import FrontendLayout from '@/layouts/FrontendLayout';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ===========================================================================
 * Client portfolio data
 * =========================================================================== */
type Client = {
    slug: string;
    brand: string;
    industry: string;
    services: string[];
    business: string;
    about: string;
    image: string;
    impact: { value: string; label: string }[];
    deliverables: string[];
    a: string; b: string; glow: string; color: string; bg: string; border: string;
};

const CLIENTS: Client[] = [
    {
        slug: 'sankhya-tatvyaa',
        brand: 'Sankhya Tatvyaa',
        industry: 'Numerology Services',
        services: ['Website', 'SMM'],
        business: 'Growing Enterprise',
        about: 'Numerology reveals life path, personality traits, career guidance, relationship compatibility, strengths, challenges, and future opportunities through the power of numbers.',
        image: '/assets/images/header/demo/sankhhya tatvyaa.jpeg',
        impact: [{ value: '3.2×', label: 'Booking Lift' }, { value: '+184%', label: 'Instagram Reach' }],
        deliverables: ['Brand-aligned multi-page website with consultation booking flow', 'Daily Instagram + Facebook content calendar with reels production', 'Lead-capture forms wired to a CRM for follow-up automation'],
        a: '#a855f7', b: '#ec4899', glow: 'rgba(168, 85, 247, 0.32)', color: '#d8b4fe',
        bg: 'rgba(168, 85, 247, 0.10)', border: 'rgba(168, 85, 247, 0.30)',
    },
    {
        slug: 'tarot-arpiita',
        brand: 'Tarot Arpiita',
        industry: 'Tarot Reading',
        services: ['SMM', 'Website'],
        business: 'Growing Enterprise',
        about: 'Professional tarot reading services offering deep insights, clarity, and guidance for love, career, and life decisions.',
        image: '/assets/images/header/demo/Tarot arpiita.jpeg',
        impact: [{ value: '5.1×', label: 'Engagement' }, { value: '+92%', label: 'New Followers' }],
        deliverables: ['Mystical-themed website with tarot card visuals and online booking', 'Reels-led Instagram strategy with weekly card-of-the-day series', 'WhatsApp + email lead nurture for repeat consultations'],
        a: '#ec4899', b: '#a855f7', glow: 'rgba(236, 72, 153, 0.32)', color: '#fbcfe8',
        bg: 'rgba(236, 72, 153, 0.10)', border: 'rgba(236, 72, 153, 0.30)',
    },
    {
        slug: 'studio83',
        brand: 'Studio 83',
        industry: 'Salon Services',
        services: ['Social Media Marketing'],
        business: 'Growing Enterprise',
        about: 'Premium salon services focused on beauty, style, and confidence with expert care and modern trends.',
        image: '/assets/images/header/demo/studio83.jpeg',
        impact: [{ value: '4.8×', label: 'Walk-ins' }, { value: '+220%', label: 'Reach' }],
        deliverables: ['Editorial-grade Instagram content with monthly look-book reels', 'Influencer + creator collaborations across hair and grooming niches', 'Performance ads tied to a salon booking number for measurable ROI'],
        a: '#f97316', b: '#ec4899', glow: 'rgba(249, 115, 22, 0.32)', color: '#fed7aa',
        bg: 'rgba(249, 115, 22, 0.10)', border: 'rgba(249, 115, 22, 0.30)',
    },
    {
        slug: 'black-cats-protections',
        brand: 'Black Cats Protections',
        industry: 'Security Services',
        services: ['Website', 'SMM'],
        business: 'Growing Enterprise',
        about: 'Professional security guard services ensuring safety and protection at all times. Trained and reliable staff dedicated to your security needs. Your safety is our top priority — delivering trust and peace of mind.',
        image: '/assets/images/header/demo/black_cats_protections.jpeg',
        impact: [{ value: '6.3×', label: 'Inbound Leads' }, { value: '+47', label: 'New Contracts' }],
        deliverables: ['Trust-led corporate website with service catalogue and quote request', 'B2B-focused LinkedIn + Facebook content calendar with case studies', 'Inbound enquiry pipeline with WhatsApp + email automation'],
        a: '#06b6d4', b: '#4f7cff', glow: 'rgba(6, 182, 212, 0.32)', color: '#67e8f9',
        bg: 'rgba(6, 182, 212, 0.10)', border: 'rgba(6, 182, 212, 0.30)',
    },
    {
        slug: 'bahu-rupi',
        brand: 'Bahu Rupi',
        industry: 'SFX Makeup',
        services: ['SMM', 'Website'],
        business: 'Growing Enterprise',
        about: 'Professional SFX makeup artist creating realistic, creative, and high-quality special effects looks with expert techniques and attention to detail.',
        image: '/assets/images/header/demo/Bahu_rupi.jpeg',
        impact: [{ value: '2.7M', label: 'Reels Views' }, { value: '+310%', label: 'Followers' }],
        deliverables: ['Portfolio-led website showcasing SFX work with high-impact galleries', 'Daily Reels + behind-the-scenes content with viral hook structures', 'Brand collaborations and creator marketplace listings'],
        a: '#fbbf24', b: '#f97316', glow: 'rgba(251, 191, 36, 0.32)', color: '#fde68a',
        bg: 'rgba(251, 191, 36, 0.10)', border: 'rgba(251, 191, 36, 0.30)',
    },
    {
        slug: 'oral-international-hospital',
        brand: 'Oral International Hospital',
        industry: 'International Hospital',
        services: ['SMM', 'SEO', 'Leads'],
        business: 'Growing Enterprise',
        about: 'Advanced international hospital providing quality healthcare, expert treatment, and trusted medical services with modern technology and patient-focused care.',
        image: '/assets/images/header/demo/oral_international_hospital.jpeg',
        impact: [{ value: '7.4×', label: 'Patient Enquiries' }, { value: '+162%', label: 'Organic Traffic' }],
        deliverables: ['SEO program with 80+ medical-services landing pages and Schema.org markup', 'Educational health-content engine driving steady organic traffic', 'Lead capture + WhatsApp doctor-routing for instant patient follow-up'],
        a: '#22c55e', b: '#06b6d4', glow: 'rgba(34, 197, 94, 0.32)', color: '#86efac',
        bg: 'rgba(34, 197, 94, 0.10)', border: 'rgba(34, 197, 94, 0.30)',
    },
    {
        slug: 'page3',
        brand: 'Page3',
        industry: 'Unisex Salon',
        services: ['Social Media Marketing'],
        business: 'Growing Enterprise',
        about: 'Premium unisex salon offering modern styling, grooming, and beauty services for both men and women with expert care and latest trends.',
        image: '/assets/images/header/demo/page3.jpeg',
        impact: [{ value: '4.1×', label: 'Bookings' }, { value: '+178%', label: 'Engagement' }],
        deliverables: ['Aesthetic-driven Instagram + Facebook calendar with stylist features', 'Geo-targeted ad campaigns to drive in-salon bookings', 'WhatsApp catalogue + reply automation for service enquiries'],
        a: '#ec4899', b: '#f97316', glow: 'rgba(236, 72, 153, 0.32)', color: '#fbcfe8',
        bg: 'rgba(236, 72, 153, 0.10)', border: 'rgba(236, 72, 153, 0.30)',
    },
    {
        slug: 'wandervedaa',
        brand: 'Wandervedaa',
        industry: 'Travel & Tourism',
        services: ['SMM', 'SEO', 'Leads'],
        business: 'Growing Enterprise',
        about: 'Professional travel and tourism services offering easy planning, best deals, and memorable journeys with expert support.',
        image: '/assets/images/header/demo/wandervedaa.jpeg',
        impact: [{ value: '5.8×', label: 'Booking Enquiries' }, { value: '+240%', label: 'SEO Traffic' }],
        deliverables: ['Destination-led SEO with 60+ city + itinerary landing pages', 'Visual-first Instagram strategy with creator + influencer collaborations', 'Itinerary builder + lead-capture flow tied to a sales-rep CRM'],
        a: '#06b6d4', b: '#22c55e', glow: 'rgba(6, 182, 212, 0.32)', color: '#67e8f9',
        bg: 'rgba(6, 182, 212, 0.10)', border: 'rgba(6, 182, 212, 0.30)',
    },
    {
        slug: 'malang-lounge',
        brand: 'Malang Lounge',
        industry: 'Lounge Bar',
        services: ['SMM'],
        business: 'Growing Enterprise',
        about: 'Premium lounge bar offering vibrant nightlife, great music, and a stylish ambience for unforgettable experiences.',
        image: '/assets/images/header/demo/malang_lounge.jpeg',
        impact: [{ value: '3.9×', label: 'Weekend Footfall' }, { value: '+128%', label: 'Reach' }],
        deliverables: ['Atmosphere-driven Reels with weekly DJ + live-music spotlights', 'Influencer + creator nights for organic buzz amplification', 'Geo-fenced ad campaigns targeting weekend nightlife audiences'],
        a: '#a855f7', b: '#4f7cff', glow: 'rgba(168, 85, 247, 0.32)', color: '#d8b4fe',
        bg: 'rgba(168, 85, 247, 0.10)', border: 'rgba(168, 85, 247, 0.30)',
    },
];

/* ===========================================================================
 * Page
 * =========================================================================== */
export default function Portfolio() {
    const [openSlug, setOpenSlug] = useState<string | null>(null);

    return (
        <FrontendLayout>
            <Head title="Portfolio — Dawki Infotech">
                <meta name="description" content="A selection of software, mobile, AI, and growth-marketing projects built by Dawki Infotech for clients across India, the US, the UK, and the UAE." head-key="description" />
                <meta property="og:title" content="Portfolio — Dawki Infotech" head-key="og:title" />
                <meta property="og:description" content="Software, mobile, AI, and growth projects we've shipped for clients worldwide." head-key="og:description" />
                <meta name="twitter:title" content="Portfolio — Dawki Infotech" head-key="twitter:title" />
                <meta name="twitter:description" content="Software, mobile, AI, and growth projects we've shipped for clients worldwide." head-key="twitter:description" />
            </Head>

            <main id="primary" className="site-main">
                <div className="space-for-header"></div>

                {/* Hero */}
                <section className="dawki-pf-hero">
                    <video
                        className="dawki-pf-hero-video"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                    >
                        <source src="/assets/images/header/demo/client_portfolio.mp4" type="video/mp4" />
                    </video>
                    <div className="dawki-pf-hero-overlay" aria-hidden="true"></div>

                    <motion.div
                        className="dawki-pf-hero-content"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                    >
                        <span className="dawki-pf-hero-pill">
                            <span></span>
                            Client Portfolio
                        </span>
                        <h1 className="dawki-pf-hero-title">
                            Brands We've <span>Helped Grow</span>
                        </h1>
                        <p className="dawki-pf-hero-subtitle">
                            Real businesses, real outcomes. From numerology and tarot studios to lounges, salons, hospitals, and travel brands — every engagement built around measurable growth.
                        </p>
                    </motion.div>
                </section>

                {/* Stats strip */}
                <section className="dawki-pf-stats">
                    <motion.div
                        className="dawki-pf-stats-grid"
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: '-60px' }}
                        variants={{
                            hidden: {},
                            show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
                        }}
                    >
                        <motion.div className="dawki-pf-stat" variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
                            <div className="dawki-pf-stat-value">{CLIENTS.length}+</div>
                            <div className="dawki-pf-stat-label">Brands Live</div>
                        </motion.div>
                        <motion.div className="dawki-pf-stat" variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
                            <div className="dawki-pf-stat-value">9</div>
                            <div className="dawki-pf-stat-label">Industries Served</div>
                        </motion.div>
                        <motion.div className="dawki-pf-stat" variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
                            <div className="dawki-pf-stat-value">4.7×</div>
                            <div className="dawki-pf-stat-label">Avg Reach Lift</div>
                        </motion.div>
                        <motion.div className="dawki-pf-stat" variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
                            <div className="dawki-pf-stat-value">100%</div>
                            <div className="dawki-pf-stat-label">Retention Rate</div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* Case studies */}
                <section className="dawki-pf-list">
                    <div className="container">
                        <div className="dawki-pf-list-heading">
                            <h2 className="dawki-pf-list-title">
                                Featured <span>Case Studies</span>
                            </h2>
                            <p className="dawki-pf-list-subtitle">
                                The work that's moved the needle — websites, social, SEO, and lead pipelines built to ship outcomes, not just deliverables.
                            </p>
                        </div>

                        {CLIENTS.map((c, i) => {
                            const reverse = i % 2 === 1;
                            const isOpen = openSlug === c.slug;

                            return (
                                <motion.div
                                    key={c.slug}
                                    id={c.slug}
                                    className={`dawki-pf-case${reverse ? ' dawki-pf-case--reverse' : ''}`}
                                    style={{
                                        ['--cs-a' as string]: c.a,
                                        ['--cs-b' as string]: c.b,
                                        ['--cs-glow' as string]: c.glow,
                                        ['--cs-color' as string]: c.color,
                                        ['--cs-bg' as string]: c.bg,
                                        ['--cs-border' as string]: c.border,
                                    }}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-100px' }}
                                    transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                                >
                                    <div className="dawki-pf-case-image">
                                        <span className="dawki-pf-case-tag">{c.industry}</span>
                                        <span className="dawki-pf-case-stage">{c.business}</span>
                                        <img
                                            src={c.image}
                                            alt={c.brand}
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </div>

                                    <div className="dawki-pf-case-content">
                                        <h3 className="dawki-pf-case-brand">{c.brand}</h3>
                                        <p className="dawki-pf-case-desc">{c.about}</p>

                                        <div className="dawki-pf-case-meta">
                                            <div className="dawki-pf-case-meta-block">
                                                <strong>{c.impact[0].value}</strong>
                                                <span>{c.impact[0].label}</span>
                                            </div>
                                            <div className="dawki-pf-case-meta-divider"></div>
                                            <div className="dawki-pf-case-meta-block">
                                                <strong>{c.impact[1].value}</strong>
                                                <span>{c.impact[1].label}</span>
                                            </div>
                                        </div>

                                        <div className="dawki-pf-case-services">
                                            {c.services.map((s) => (
                                                <span key={s} className="dawki-pf-case-service-chip">{s}</span>
                                            ))}
                                        </div>

                                        <button
                                            type="button"
                                            className="dawki-pf-case-cta"
                                            onClick={() => setOpenSlug(isOpen ? null : c.slug)}
                                            aria-expanded={isOpen}
                                        >
                                            <span>{isOpen ? 'Show less' : 'Read more'}</span>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                {isOpen ? (
                                                    <polyline points="18 15 12 9 6 15" />
                                                ) : (
                                                    <>
                                                        <line x1="5" y1="12" x2="19" y2="12" />
                                                        <polyline points="12 5 19 12 12 19" />
                                                    </>
                                                )}
                                            </svg>
                                        </button>
                                    </div>

                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                key="detail"
                                                className="dawki-pf-case-detail"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                                            >
                                                <div className="dawki-pf-case-detail-grid">
                                                    <div>
                                                        <h4 className="dawki-pf-case-detail-h">The Brief</h4>
                                                        <p className="dawki-pf-case-detail-text">
                                                            {c.brand} came to us as a {c.business.toLowerCase()} in the {c.industry.toLowerCase()} space, looking to build a stronger online presence and convert reach into revenue.
                                                        </p>
                                                        <h4 className="dawki-pf-case-detail-h">What We Shipped</h4>
                                                        <ul className="dawki-pf-case-detail-list">
                                                            {c.deliverables.map((d, idx) => (
                                                                <li key={idx}>{d}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <h4 className="dawki-pf-case-detail-h">Outcomes</h4>
                                                        <ul className="dawki-pf-case-detail-list">
                                                            <li><strong style={{ color: c.color }}>{c.impact[0].value}</strong> {c.impact[0].label.toLowerCase()}</li>
                                                            <li><strong style={{ color: c.color }}>{c.impact[1].value}</strong> {c.impact[1].label.toLowerCase()}</li>
                                                            <li>Repeatable monthly content + ad cadence</li>
                                                            <li>Reporting dashboard tracking ROI</li>
                                                        </ul>
                                                        <h4 className="dawki-pf-case-detail-h" style={{ marginTop: 18 }}>Engagement</h4>
                                                        <p className="dawki-pf-case-detail-text" style={{ margin: 0 }}>
                                                            Active retainer · Monthly reviews
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
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
                                                <span className="btn-text"><span>Start Your Project</span></span>
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
