import { type FC, type ReactNode, useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import FrontendLayout from '@/layouts/FrontendLayout';

/* ============================================================================
 * Estimate Project Cost — interactive pricing calculator.
 * Pricing is internal: card UI never shows individual prices, only the
 * estimated total at the bottom updates as the user picks a build, extra
 * pages (only shown when Landing Page or Multi-page Website is the build),
 * and add-ons. WhatsApp CTA pre-fills the chosen scope.
 * ============================================================================ */

type BuildKey = 'landing' | 'multi' | 'ecom' | 'saas' | 'mobile' | 'crm';
type Build = {
    id: BuildKey;
    name: string;
    desc: string;
    price: number;
    icon: ReactNode;
    /* Builds that allow extra-page add-ons (multi-page sites). Other builds
     * (apps, CRMs, e-commerce) don't sell by the page so the section hides. */
    pageBased?: boolean;
};

const BUILDS: Build[] = [
    {
        id: 'landing',
        name: 'Landing Page',
        desc: 'Single page · conversion-focused',
        price: 10000,
        pageBased: true,
        // Browser frame with a hero block — instantly reads as "single landing page"
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <line x1="3" y1="8" x2="21" y2="8" />
                <circle cx="6" cy="6" r="0.6" fill="currentColor" />
                <circle cx="8" cy="6" r="0.6" fill="currentColor" />
                <circle cx="10" cy="6" r="0.6" fill="currentColor" />
                <rect x="6" y="11" width="12" height="3" rx="0.5" />
                <line x1="6" y1="16.5" x2="14" y2="16.5" />
            </svg>
        ),
    },
    {
        id: 'multi',
        name: 'Multi-page Website',
        desc: '5 pages included · CMS-ready',
        price: 20000,
        pageBased: true,
        // Stack of overlapping pages — represents multiple linked pages
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="6" width="14" height="14" rx="2" />
                <path d="M7 6V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2" />
                <line x1="6" y1="11" x2="14" y2="11" />
                <line x1="6" y1="15" x2="11" y2="15" />
            </svg>
        ),
    },
    {
        id: 'ecom',
        name: 'E-commerce Store',
        desc: 'Cart, checkout, payments',
        price: 40000,
        // Shopping bag with a small price tag — clearer than a cart for "store"
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
        ),
    },
    {
        id: 'saas',
        name: 'SaaS / Web App',
        desc: 'Auth, dashboard, billing',
        price: 80000,
        // Layered dashboard panel — communicates "app" and "data" together
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="7" height="9" rx="1.5" />
                <rect x="14" y="3" width="7" height="5" rx="1.5" />
                <rect x="14" y="12" width="7" height="9" rx="1.5" />
                <rect x="3" y="16" width="7" height="5" rx="1.5" />
            </svg>
        ),
    },
    {
        id: 'mobile',
        name: 'Mobile App',
        desc: 'iOS & Android · cross-platform',
        price: 80000,
        // Phone with content lines + home indicator — looks like an actual app screen
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="6" y="2" width="12" height="20" rx="2.5" />
                <line x1="9" y1="5" x2="15" y2="5" />
                <line x1="10" y1="19" x2="14" y2="19" />
                <rect x="8.5" y="8" width="7" height="7" rx="1" />
            </svg>
        ),
    },
    {
        id: 'crm',
        name: 'Custom CRM',
        desc: 'Leads, deals, dashboards',
        price: 35000,
        // Network of people / contacts — instantly reads as CRM
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="7" r="3" />
                <circle cx="5" cy="18" r="2.5" />
                <circle cx="19" cy="18" r="2.5" />
                <path d="M12 10v3" />
                <path d="M12 13l-5 3" />
                <path d="M12 13l5 3" />
            </svg>
        ),
    },
];

type AddonKey =
    | 'backend'
    | 'ai'
    | 'seo'
    | 'animations'
    | 'cms'
    | 'maintenance';

type Addon = {
    id: AddonKey;
    name: string;
    desc: string;
    price: number;
    badge?: string;
    icon: ReactNode;
};

const ADDONS: Addon[] = [
    {
        id: 'backend',
        name: 'Backend & API',
        desc: 'Auth, database, REST/GraphQL',
        price: 15000,
        // Server stack — clearly reads as backend infrastructure
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="6" rx="1.5" />
                <rect x="3" y="13" width="18" height="6" rx="1.5" />
                <line x1="6.5" y1="6" x2="6.5" y2="6" />
                <circle cx="6.5" cy="6" r="0.6" fill="currentColor" />
                <circle cx="6.5" cy="16" r="0.6" fill="currentColor" />
                <line x1="10" y1="6" x2="14" y2="6" />
                <line x1="10" y1="16" x2="14" y2="16" />
            </svg>
        ),
    },
    {
        id: 'ai',
        name: 'AI Integration',
        desc: 'ChatGPT, Claude, RAG, agents',
        price: 50000,
        badge: 'POPULAR',
        // Sparkle / AI star — modern AI signifier (used by OpenAI, Gemini, Claude UIs)
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3z" />
                <path d="M19 14l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7L19 14z" />
                <path d="M5 14l.5 1.3 1.3.5-1.3.5L5 17.6l-.5-1.3-1.3-.5 1.3-.5L5 14z" />
            </svg>
        ),
    },
    {
        id: 'seo',
        name: 'SEO Optimization',
        desc: 'Schema, sitemaps, Core Web Vitals',
        price: 10000,
        // Search + upward trend — reads as "SEO ranking" not just plain search
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="10" cy="10" r="6" />
                <line x1="20.5" y1="20.5" x2="14.5" y2="14.5" />
                <polyline points="7 11 9 9 11 11 13 7" />
            </svg>
        ),
    },
    {
        id: 'animations',
        name: 'Custom Animations',
        desc: 'Scroll, hover, page transitions',
        price: 3000,
        // Curved motion path with arrow — reads as "movement / transition"
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="5" cy="19" r="2" />
                <path d="M5 17C5 11 11 5 17 5" />
                <polyline points="13 5 17 5 17 9" />
                <circle cx="17" cy="5" r="0.6" fill="currentColor" />
            </svg>
        ),
    },
    {
        id: 'cms',
        name: 'CMS Integration',
        desc: 'WordPress, Sanity, Strapi',
        price: 8000,
        // Document with editable content blocks — clearly a content management icon
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="3" y1="8" x2="21" y2="8" />
                <line x1="7" y1="13" x2="17" y2="13" />
                <line x1="7" y1="17" x2="13" y2="17" />
            </svg>
        ),
    },
    {
        id: 'maintenance',
        name: '12-month Maintenance',
        desc: 'Updates, fixes, priority support',
        price: 12000,
        // Wrench inside a shield — combines "fix" + "protect" for ongoing maintenance
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M14.5 9.5l-4 4" />
                <path d="M9.5 9.5a2 2 0 0 0 2.8 2.8l2-2-2.8-2.8z" />
            </svg>
        ),
    },
];

const PER_EXTRA_PAGE = 1000;

const formatINR = (n: number) =>
    new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n);

const Estimate: FC = () => {
    const [build, setBuild] = useState<BuildKey>('landing');
    const [extraPages, setExtraPages] = useState(0);
    const [addons, setAddons] = useState<Set<AddonKey>>(new Set());

    const buildObj = useMemo(() => BUILDS.find((b) => b.id === build)!, [build]);
    const showExtraPages = !!buildObj.pageBased;

    const toggleAddon = (id: AddonKey) => {
        setAddons((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const total = useMemo(() => {
        let sum = buildObj.price;
        if (showExtraPages) sum += extraPages * PER_EXTRA_PAGE;
        ADDONS.forEach((a) => {
            if (addons.has(a.id)) sum += a.price;
        });
        return sum;
    }, [buildObj, extraPages, addons, showExtraPages]);

    const summaryLines = useMemo(() => {
        const lines: { label: string; value: number }[] = [
            { label: buildObj.name, value: buildObj.price },
        ];
        if (showExtraPages && extraPages > 0) {
            lines.push({ label: `+ ${extraPages} extra page${extraPages === 1 ? '' : 's'}`, value: extraPages * PER_EXTRA_PAGE });
        }
        ADDONS.forEach((a) => {
            if (addons.has(a.id)) lines.push({ label: a.name, value: a.price });
        });
        return lines;
    }, [buildObj, extraPages, addons, showExtraPages]);

    /* WhatsApp deep-link with the chosen scope pre-typed in the message */
    const whatsappHref = useMemo(() => {
        const summary = summaryLines.map((l) => `• ${l.label}`).join('%0A');
        const msg = `Hi Dawki Infotech,%0A%0AI'd like a quote for:%0A${summary}%0A%0AEstimated total: ₹ ${formatINR(total)}`;
        return `https://wa.me/918076096255?text=${msg}`;
    }, [summaryLines, total]);

    return (
        <FrontendLayout>
            <Head title="Estimate Project Cost | Dawki Infotech" />
            <main id="primary" className="site-main">
                <div className="space-for-header"></div>

                <section className="dawki-est">
                    <div className="dawki-est-bg-orb dawki-est-bg-orb--a" aria-hidden="true"></div>
                    <div className="dawki-est-bg-orb dawki-est-bg-orb--b" aria-hidden="true"></div>

                    <div className="container">
                        {/* Hero heading */}
                        <div className="dawki-est-heading">
                            <span className="dawki-est-pill">
                                <span className="dawki-est-pill-dot"></span>
                                Pricing Calculator
                            </span>
                            <h1 className="dawki-est-title">
                                Estimate your <span>project cost.</span>
                            </h1>
                            <p className="dawki-est-subtitle">
                                Pick your scope, add what you need, and get a live quote — instantly.
                                <br />
                                WhatsApp us when you're ready to start.
                            </p>
                        </div>

                        {/* Calculator card */}
                        <div className="dawki-est-card">
                            {/* Step 1 — choose build */}
                            <div className="dawki-est-step">
                                <div className="dawki-est-step-head">
                                    <span className="dawki-est-step-num">01</span>
                                    <h2>Choose your build</h2>
                                </div>
                                <div className="dawki-est-builds">
                                    {BUILDS.map((b) => {
                                        const active = build === b.id;
                                        return (
                                            <button
                                                key={b.id}
                                                type="button"
                                                onClick={() => setBuild(b.id)}
                                                className={`dawki-est-build ${active ? 'is-active' : ''}`}
                                                aria-pressed={active}
                                            >
                                                <span className="dawki-est-build-icon">{b.icon}</span>
                                                <strong>{b.name}</strong>
                                                <span>{b.desc}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Step 2 — extra pages (page-based builds only) */}
                            {showExtraPages && (
                                <div className="dawki-est-step">
                                    <div className="dawki-est-step-head">
                                        <span className="dawki-est-step-num">02</span>
                                        <h2>Add extra pages</h2>
                                        <span className="dawki-est-step-hint">₹{formatINR(PER_EXTRA_PAGE)} per additional page</span>
                                    </div>
                                    <div className="dawki-est-pages">
                                        <button
                                            type="button"
                                            className="dawki-est-pages-btn"
                                            onClick={() => setExtraPages((p) => Math.max(0, p - 1))}
                                            aria-label="Remove a page"
                                            disabled={extraPages === 0}
                                        >
                                            −
                                        </button>
                                        <div className="dawki-est-pages-display">
                                            <strong>{extraPages}</strong>
                                            <span>EXTRA PAGES</span>
                                        </div>
                                        <button
                                            type="button"
                                            className="dawki-est-pages-btn"
                                            onClick={() => setExtraPages((p) => p + 1)}
                                            aria-label="Add a page"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3 — add-ons */}
                            <div className="dawki-est-step">
                                <div className="dawki-est-step-head">
                                    <span className="dawki-est-step-num">{showExtraPages ? '03' : '02'}</span>
                                    <h2>Power-up with add-ons</h2>
                                </div>
                                <div className="dawki-est-addons">
                                    {ADDONS.map((a) => {
                                        const active = addons.has(a.id);
                                        return (
                                            <button
                                                key={a.id}
                                                type="button"
                                                onClick={() => toggleAddon(a.id)}
                                                className={`dawki-est-addon ${active ? 'is-active' : ''}`}
                                                aria-pressed={active}
                                            >
                                                <span className="dawki-est-addon-icon">{a.icon}</span>
                                                <span className="dawki-est-addon-text">
                                                    <strong>
                                                        {a.name}
                                                        {a.badge && <em className="dawki-est-addon-badge">{a.badge}</em>}
                                                    </strong>
                                                    <span>{a.desc}</span>
                                                </span>
                                                <span className="dawki-est-addon-toggle" aria-hidden="true">
                                                    {active ? (
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                    ) : (
                                                        <span className="dawki-est-addon-plus">+</span>
                                                    )}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Total summary — only the estimated total, no per-item breakdown */}
                            <div className="dawki-est-summary dawki-est-summary--centered">
                                <div className="dawki-est-summary-right">
                                    <span className="dawki-est-summary-label">ESTIMATED TOTAL</span>
                                    <div className="dawki-est-summary-total">
                                        ₹ <strong>{formatINR(total)}</strong>
                                    </div>
                                    <span className="dawki-est-summary-meta">One-time · all-inclusive · GST extra</span>
                                </div>
                            </div>

                            {/* WhatsApp CTA */}
                            <div className="dawki-est-actions">
                                <a
                                    href={whatsappHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="dawki-est-whatsapp"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                                    </svg>
                                    <span>Chat on WhatsApp</span>
                                </a>
                                <a href="/contact" className="dawki-est-secondary">
                                    <span>Get detailed proposal</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </FrontendLayout>
    );
};

export default Estimate;
