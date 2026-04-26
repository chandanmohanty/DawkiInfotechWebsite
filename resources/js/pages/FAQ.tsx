import { Head, Link } from '@inertiajs/react';
import FrontendLayout from '@/layouts/FrontendLayout';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

/* ===========================================================================
 * Shared count-up
 * =========================================================================== */
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

/* ===========================================================================
 * FAQ data — categorized
 * =========================================================================== */
type FaqItem = { q: string; a: string; cat: 'general' | 'marketing' | 'development' | 'support' };

const FAQS: FaqItem[] = [
    // General
    {
        cat: 'general',
        q: 'What services does Dawki Infotech provide?',
        a: 'Dawki Infotech offers IT solutions such as software development, web and mobile app development, cloud solutions, and IT support. Additionally, we specialize in digital marketing services including SEO, social media marketing, Google Ads, and website design.',
    },
    {
        cat: 'general',
        q: 'Why should I choose Dawki Infotech for my business?',
        a: 'At Dawki Infotech, we combine technology with marketing expertise to deliver customized solutions that help businesses grow online and offline. Our team focuses on ROI-driven strategies and client satisfaction.',
    },
    {
        cat: 'general',
        q: 'Does Dawki Infotech work with startups and small businesses?',
        a: 'Yes, we provide cost-effective IT and digital marketing solutions designed to meet the specific needs of startups, SMEs, and established enterprises.',
    },
    {
        cat: 'general',
        q: 'What industries do you work with?',
        a: 'We serve a wide range of industries including healthcare, eLearning, real estate, financial services, hospitality, e-commerce, and SaaS — tailoring solutions to the regulatory and operational realities of each.',
    },
    {
        cat: 'general',
        q: 'How do I get started with Dawki Infotech?',
        a: 'Reach out via our contact form or call +91 807 609 6255. We\'ll set up a free 30-minute discovery call to understand your goals, scope your project, and share next steps within 48 hours.',
    },

    // Marketing
    {
        cat: 'marketing',
        q: 'What digital marketing services do you offer?',
        a: 'Dawki Infotech offers SEO (Search Engine Optimization), Google Ads (PPC), Facebook & Instagram Ads, social media management, YouTube marketing, email marketing, and content marketing.',
    },
    {
        cat: 'marketing',
        q: 'Can you help increase my website traffic and leads?',
        a: 'Absolutely. Our digital marketing experts create customized campaigns to drive quality traffic, improve online visibility, and generate business leads for your company.',
    },
    {
        cat: 'marketing',
        q: 'Do you provide monthly reports for marketing campaigns?',
        a: 'Yes, we share detailed monthly performance reports for SEO, ads, and social media campaigns so clients can track ROI and growth — including a live Looker Studio dashboard for the metrics that matter most.',
    },
    {
        cat: 'marketing',
        q: 'How long before I see results from SEO?',
        a: 'Quick wins from technical SEO and on-page improvements show up in 6–12 weeks. Compounding growth from content and authority links typically appears in 4–9 months — and keeps building from there.',
    },

    // Development
    {
        cat: 'development',
        q: 'Can Dawki Infotech build custom websites and mobile apps?',
        a: 'Yes, our development team creates responsive websites and Android & iOS apps tailored to your business requirements — across React, Next.js, React Native, Flutter, and native Swift/Kotlin where it makes sense.',
    },
    {
        cat: 'development',
        q: 'Do you provide post-development support?',
        a: 'Yes, Dawki Infotech offers ongoing support, maintenance, and updates to ensure your software or website runs smoothly. SLA-backed support is available with 24/7 monitoring for production-critical systems.',
    },
    {
        cat: 'development',
        q: 'What technologies and frameworks do you use?',
        a: 'We work across React, Next.js, Vue, Node.js, Python, Django, FastAPI, Go, .NET, PHP, AWS, Azure, GCP, Docker, and Kubernetes — chosen per project for the best fit, not because of a partnership.',
    },
    {
        cat: 'development',
        q: 'Will I own the source code we build together?',
        a: 'Yes. You own 100% of the code, design assets, and IP. We hand over a clean Git repository, documentation, and any cloud accounts — no lock-in, no surprises.',
    },

    // Support / Process / Security
    {
        cat: 'support',
        q: 'How secure are your IT solutions?',
        a: 'We prioritize data security by implementing advanced encryption, secure coding practices, and regular vulnerability checks. We follow OWASP best practices, automated security scanning in CI, and SOC 2 / ISO 27001 / GDPR-aligned controls where required.',
    },
    {
        cat: 'support',
        q: 'How is project pricing structured?',
        a: 'We offer flexible pricing — fixed-price projects for tightly-scoped builds, time-and-materials for evolving scope, and dedicated team rates for ongoing engagements. Every quote includes a clear scope, milestones, and acceptance criteria.',
    },
    {
        cat: 'support',
        q: 'Can your team work in our timezone?',
        a: 'Yes. Our delivery team has overlapping working hours with US, UK, EU, GCC, and APAC clients, with daily stand-ups and weekly demos in your preferred timezone.',
    },
    {
        cat: 'support',
        q: 'What happens if I need to scale up or pause a project?',
        a: 'Our engagements are flexible — you can scale team size up or down with two-week notice, or pause active work and resume later. Long-term retainers come with priority access and predictable monthly invoicing.',
    },
];

const CATEGORIES = [
    { key: 'all',         label: 'All',          color: '#a855f7' },
    { key: 'general',     label: 'General',      color: '#06b6d4' },
    { key: 'marketing',   label: 'Marketing',    color: '#f97316' },
    { key: 'development', label: 'Development',  color: '#4f7cff' },
    { key: 'support',     label: 'Support',      color: '#22c55e' },
] as const;

const CATEGORY_STYLE: Record<FaqItem['cat'], { bg: string; border: string; color: string; label: string }> = {
    general: {
        bg: 'rgba(6, 182, 212, 0.12)',
        border: 'rgba(6, 182, 212, 0.32)',
        color: '#67e8f9',
        label: 'General',
    },
    marketing: {
        bg: 'rgba(249, 115, 22, 0.12)',
        border: 'rgba(249, 115, 22, 0.32)',
        color: '#fed7aa',
        label: 'Marketing',
    },
    development: {
        bg: 'rgba(79, 124, 255, 0.12)',
        border: 'rgba(79, 124, 255, 0.32)',
        color: '#93c5fd',
        label: 'Development',
    },
    support: {
        bg: 'rgba(34, 197, 94, 0.12)',
        border: 'rgba(34, 197, 94, 0.32)',
        color: '#86efac',
        label: 'Support',
    },
};

/* ===========================================================================
 * Categorized FAQ section with search + tabs + accordion
 * =========================================================================== */
const FaqAccordion: React.FC = () => {
    const [activeCat, setActiveCat] = useState<typeof CATEGORIES[number]['key']>('all');
    const [search, setSearch] = useState('');
    const [openIdx, setOpenIdx] = useState<number | null>(0);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return FAQS.filter((f) => {
            if (activeCat !== 'all' && f.cat !== activeCat) return false;
            if (!q) return true;
            return f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q);
        });
    }, [activeCat, search]);

    const counts = useMemo(() => {
        const out: Record<string, number> = { all: FAQS.length };
        FAQS.forEach((f) => {
            out[f.cat] = (out[f.cat] ?? 0) + 1;
        });
        return out;
    }, []);

    return (
        <section className="dawki-faq-main">
            <div className="container">
                <div className="dawki-faq-heading">
                    <h2 className="dawki-faq-heading-title">
                        Frequently Asked <span>Questions</span>
                    </h2>
                    <p className="dawki-faq-heading-subtitle">
                        Everything you need to know — about our work, our process, our pricing, and what it's like to ship with us. Can't find what you're looking for? We're a quick message away.
                    </p>
                </div>

                <div className="dawki-faq-search">
                    <span className="dawki-faq-search-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                    </span>
                    <input
                        type="text"
                        className="dawki-faq-search-input"
                        placeholder="Search questions — try &quot;SEO&quot;, &quot;pricing&quot;, &quot;mobile apps&quot;…"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setOpenIdx(0);
                        }}
                    />
                </div>

                <div className="dawki-faq-tabs" role="tablist">
                    {CATEGORIES.map((c) => (
                        <button
                            key={c.key}
                            role="tab"
                            aria-selected={activeCat === c.key}
                            className={`dawki-faq-tab${activeCat === c.key ? ' dawki-faq-tab--active' : ''}`}
                            onClick={() => {
                                setActiveCat(c.key);
                                setOpenIdx(0);
                            }}
                        >
                            {c.label}
                            <span className="dawki-faq-tab-count">{counts[c.key] ?? 0}</span>
                        </button>
                    ))}
                </div>

                <div className="dawki-faq-list" role="list">
                    {filtered.length === 0 && (
                        <div className="dawki-faq-empty">
                            No questions matched your search. Try a different keyword, or send us your question directly.
                        </div>
                    )}
                    {filtered.map((item, i) => {
                        const open = openIdx === i;
                        const cat = CATEGORY_STYLE[item.cat];
                        return (
                            <motion.div
                                key={`${item.cat}-${item.q}`}
                                role="listitem"
                                className={`dawki-faq-item${open ? ' dawki-faq-item--open' : ''}`}
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{ delay: 0.05 + i * 0.04, duration: 0.4 }}
                            >
                                <button
                                    type="button"
                                    className="dawki-faq-item-trigger"
                                    onClick={() => setOpenIdx(open ? null : i)}
                                    aria-expanded={open}
                                >
                                    <span
                                        className="dawki-faq-item-cat"
                                        style={{
                                            ['--cat-bg' as string]: cat.bg,
                                            ['--cat-border' as string]: cat.border,
                                            ['--cat-color' as string]: cat.color,
                                        }}
                                    >
                                        {cat.label}
                                    </span>
                                    <span className="dawki-faq-item-q">{item.q}</span>
                                    <span className="dawki-faq-item-toggle" aria-hidden="true">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="12" y1="5"  x2="12" y2="19" />
                                            <line x1="5"  y1="12" x2="19" y2="12" />
                                        </svg>
                                    </span>
                                </button>

                                <AnimatePresence initial={false}>
                                    {open && (
                                        <motion.div
                                            className="dawki-faq-item-body"
                                            key="body"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                                        >
                                            <div className="dawki-faq-item-body-inner">{item.a}</div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

/* ===========================================================================
 * Quick Help Stats strip
 * =========================================================================== */
const FaqStats: React.FC = () => {
    const response = useCountUp(2, 1500, 0);
    const rating = useCountUp(4.9, 1500, 1);
    const resolved = useCountUp(98, 1500, 0);
    const support = useCountUp(24, 1500, 0);

    return (
        <section className="dawki-faq-stats">
            <motion.div
                className="dawki-faq-stats-grid"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-60px' }}
                variants={{
                    hidden: {},
                    show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
                }}
            >
                <motion.div
                    className="dawki-faq-stat"
                    style={{ ['--st-a' as string]: '#06b6d4', ['--st-b' as string]: '#4f7cff', ['--st-glow' as string]: 'rgba(6, 182, 212, 0.5)' }}
                    variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                >
                    <span className="dawki-faq-stat-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    </span>
                    <div className="dawki-faq-stat-value">
                        &lt;<span ref={response.ref}>{response.value}</span>
                        <span className="dawki-faq-stat-suffix">hr</span>
                    </div>
                    <div className="dawki-faq-stat-label">Avg first response</div>
                </motion.div>

                <motion.div
                    className="dawki-faq-stat"
                    style={{ ['--st-a' as string]: '#22c55e', ['--st-b' as string]: '#06b6d4', ['--st-glow' as string]: 'rgba(34, 197, 94, 0.5)' }}
                    variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                >
                    <span className="dawki-faq-stat-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    </span>
                    <div className="dawki-faq-stat-value">
                        <span ref={rating.ref}>{rating.value}</span>
                        <span className="dawki-faq-stat-suffix">/5</span>
                    </div>
                    <div className="dawki-faq-stat-label">Client satisfaction</div>
                </motion.div>

                <motion.div
                    className="dawki-faq-stat"
                    style={{ ['--st-a' as string]: '#a855f7', ['--st-b' as string]: '#ec4899', ['--st-glow' as string]: 'rgba(168, 85, 247, 0.5)' }}
                    variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                >
                    <span className="dawki-faq-stat-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                    </span>
                    <div className="dawki-faq-stat-value">
                        <span ref={resolved.ref}>{resolved.value}</span>
                        <span className="dawki-faq-stat-suffix">%</span>
                    </div>
                    <div className="dawki-faq-stat-label">First-call resolution</div>
                </motion.div>

                <motion.div
                    className="dawki-faq-stat"
                    style={{ ['--st-a' as string]: '#f97316', ['--st-b' as string]: '#ec4899', ['--st-glow' as string]: 'rgba(249, 115, 22, 0.5)' }}
                    variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                >
                    <span className="dawki-faq-stat-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12.22C21 6.73 16.74 3 12 3c-4.69 0-9 3.65-9 9.28-.6.34-1 .98-1 1.72v2c0 1.1.9 2 2 2h1v-6.1c0-3.87 3.13-7 7-7s7 3.13 7 7V19h-8v2h8c1.1 0 2-.9 2-2v-1.22c.59-.31 1-.92 1-1.64v-2.3c0-.7-.41-1.31-1-1.62z"/></svg>
                    </span>
                    <div className="dawki-faq-stat-value">
                        <span ref={support.ref}>{support.value}</span>
                        <span className="dawki-faq-stat-suffix">/7</span>
                    </div>
                    <div className="dawki-faq-stat-label">Support coverage</div>
                </motion.div>
            </motion.div>
        </section>
    );
};

/* ===========================================================================
 * Help Center Cards section
 * =========================================================================== */
const HELP_CARDS = [
    {
        title: 'Schedule a Call',
        desc: 'Book a free 30-minute discovery call. We\'ll talk through your goals, scope, and the right way to start.',
        cta: 'Book a call',
        href: '/contact',
        a: '#06b6d4', b: '#4f7cff', glow: 'rgba(6, 182, 212, 0.5)', color: '#67e8f9',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
        ),
    },
    {
        title: 'Send an Email',
        desc: 'Drop us a line at hello@dawkiinfotech.com. We respond within 2 business hours, every time.',
        cta: 'Email us',
        href: 'mailto:hello@dawkiinfotech.com',
        a: '#a855f7', b: '#ec4899', glow: 'rgba(168, 85, 247, 0.5)', color: '#d8b4fe',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22 6 12 13 2 6" />
            </svg>
        ),
    },
    {
        title: 'Phone Support',
        desc: 'Talk to a human. Our team is available 9 AM – 9 PM IST on weekdays, with 24/7 on-call for active clients.',
        cta: '+91 807 609 6255',
        href: 'tel:+918076096255',
        a: '#22c55e', b: '#06b6d4', glow: 'rgba(34, 197, 94, 0.5)', color: '#86efac',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
        ),
    },
    {
        title: 'Browse Services',
        desc: 'Explore our full service catalogue — software, marketing, AI, cloud, and more — with case studies and capabilities.',
        cta: 'Explore services',
        href: '/about',
        a: '#f97316', b: '#ec4899', glow: 'rgba(249, 115, 22, 0.5)', color: '#fed7aa',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
        ),
    },
];

const FaqHelp: React.FC = () => (
    <section className="dawki-faq-help">
        <div className="container">
            <div className="dawki-faq-help-heading">
                <span className="dawki-faq-help-pill">
                    <span></span>
                    Still Have Questions
                </span>
                <h2 className="dawki-faq-help-title">
                    We're a Quick <span>Message Away</span>
                </h2>
                <p className="dawki-faq-help-subtitle">
                    Pick the channel that suits you — call, email, schedule a free discovery, or browse our full service catalogue. A real person responds within hours.
                </p>
            </div>

            <motion.div
                className="dawki-faq-help-grid"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-60px' }}
                variants={{
                    hidden: {},
                    show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
                }}
            >
                {HELP_CARDS.map((card) => {
                    const isExternal = card.href.startsWith('mailto:') || card.href.startsWith('tel:');
                    const inner = (
                        <>
                            <span
                                className="dawki-faq-help-card-icon"
                                style={{
                                    ['--ch-a' as string]: card.a,
                                    ['--ch-b' as string]: card.b,
                                    ['--ch-glow' as string]: card.glow,
                                }}
                            >
                                {card.icon}
                            </span>
                            <h3 className="dawki-faq-help-card-title">{card.title}</h3>
                            <p className="dawki-faq-help-card-desc">{card.desc}</p>
                            <span
                                className="dawki-faq-help-card-cta"
                                style={{ ['--ch-color' as string]: card.color }}
                            >
                                {card.cta}
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </span>
                        </>
                    );

                    return (
                        <motion.div
                            key={card.title}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] } },
                            }}
                            style={{ display: 'contents' }}
                        >
                            {isExternal ? (
                                <a
                                    href={card.href}
                                    className="dawki-faq-help-card"
                                    style={{ ['--ch-color' as string]: card.color }}
                                >
                                    {inner}
                                </a>
                            ) : (
                                <Link
                                    href={card.href}
                                    className="dawki-faq-help-card"
                                    style={{ ['--ch-color' as string]: card.color }}
                                >
                                    {inner}
                                </Link>
                            )}
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    </section>
);

/* ===========================================================================
 * Page
 * =========================================================================== */
export default function FAQ() {
    return (
        <FrontendLayout>
            <Head title="FAQ — Dawki Infotech" />

            <main id="primary" className="site-main">
                <div className="space-for-header"></div>

                {/* Hero */}
                <section className="dawki-faq-hero">
                    <video
                        className="dawki-faq-hero-video"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                    >
                        <source src="/assets/images/header/demo/faq.mp4" type="video/mp4" />
                    </video>
                    <div className="dawki-faq-hero-overlay" aria-hidden="true"></div>

                    <div className="dawki-faq-hero-marks" aria-hidden="true">
                        <span className="dawki-faq-hero-mark dawki-faq-hero-mark--a">?</span>
                        <span className="dawki-faq-hero-mark dawki-faq-hero-mark--b">!</span>
                        <span className="dawki-faq-hero-mark dawki-faq-hero-mark--c">?</span>
                        <span className="dawki-faq-hero-mark dawki-faq-hero-mark--d">!</span>
                    </div>

                    <motion.div
                        className="dawki-faq-hero-content"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                    >
                        <span className="dawki-faq-hero-pill">
                            <span></span>
                            Help Center
                        </span>
                        <h1 className="dawki-faq-hero-title">
                            Answers to Your <span>Questions</span>
                        </h1>
                        <p className="dawki-faq-hero-subtitle">
                            Everything we get asked the most — about services, pricing, timelines, support, and what it's like to work with Dawki Infotech.
                        </p>
                    </motion.div>
                </section>

                {/* Quick stats strip */}
                <FaqStats />

                {/* Categorized FAQ accordion with search */}
                <FaqAccordion />

                {/* Help center channel cards */}
                <FaqHelp />

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
