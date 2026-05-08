import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import ServicePageTemplate, { ICON } from '@/components/ServicePageTemplate';

/* ===========================================================================
 * Section 1: Live Property Map + Listing Card
 * ----------------------------------------------------------------------------
 * Map-style canvas on the left with pulsing pins (each tagged with a price).
 * On the right, a "featured listing" card auto-cycles every ~2.4s — photo,
 * price counts up, beds / baths / sqft, status badge. Visually unique to
 * real estate and unlike anything on the other industry pages.
 * =========================================================================== */

/** ease-out count-up. Triggers on scroll-into-view. */
const useCountUp = (target: number, dur = 1600, active = true) => {
    const [v, setV] = useState(0);
    useEffect(() => {
        if (!active) return;
        let raf = 0;
        const start = performance.now();
        const tick = (now: number) => {
            const t = Math.min(1, (now - start) / dur);
            const eased = 1 - Math.pow(1 - t, 3);
            setV(Math.round(target * eased));
            if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [target, dur, active]);
    return v;
};

type Listing = {
    address: string;
    city: string;
    price: number;
    beds: number;
    baths: number;
    sqft: number;
    status: 'FOR SALE' | 'PENDING' | 'NEW' | 'OPEN HOUSE';
    image: string;
    a: string; b: string;
};

const LISTINGS: Listing[] = [
    {
        address: '244 Linden Ave',
        city: 'Brooklyn, NY',
        price: 1295000,
        beds: 4, baths: 3, sqft: 2480,
        status: 'NEW',
        image: 'linear-gradient(135deg, #5b9eff 0%, #4f7cff 50%, #2d4fa8 100%)',
        a: '#5b9eff', b: '#4f7cff',
    },
    {
        address: '88 Marina View',
        city: 'San Francisco, CA',
        price: 2185000,
        beds: 3, baths: 2, sqft: 1980,
        status: 'OPEN HOUSE',
        image: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #b91262 100%)',
        a: '#a855f7', b: '#ec4899',
    },
    {
        address: '1207 Park Crescent',
        city: 'London, UK',
        price: 4250000,
        beds: 5, baths: 4, sqft: 3640,
        status: 'FOR SALE',
        image: 'linear-gradient(135deg, #f97316 0%, #fbbf24 50%, #c98112 100%)',
        a: '#f97316', b: '#fbbf24',
    },
    {
        address: '52 Palm Tower 22F',
        city: 'Dubai, UAE',
        price: 3120000,
        beds: 3, baths: 4, sqft: 2740,
        status: 'PENDING',
        image: 'linear-gradient(135deg, #06b6d4 0%, #22c55e 50%, #1d8943 100%)',
        a: '#06b6d4', b: '#22c55e',
    },
    {
        address: 'DLF 5 Crest Tower',
        city: 'Gurugram, India',
        price: 950000,
        beds: 4, baths: 3, sqft: 2960,
        status: 'NEW',
        image: 'linear-gradient(135deg, #ef4444 0%, #f97316 50%, #c33321 100%)',
        a: '#ef4444', b: '#f97316',
    },
];

/* Pre-computed pulsing pins for the map — fixed coordinates so the
 * layout stays stable, plus a price label per pin. */
const MAP_PINS = [
    { x: 18, y: 32, label: '$1.29M', delay: 0.0 },
    { x: 36, y: 18, label: '$2.18M', delay: 0.5 },
    { x: 54, y: 44, label: '$4.25M', delay: 1.0 },
    { x: 72, y: 26, label: '$3.12M', delay: 1.5 },
    { x: 28, y: 64, label: '$0.95M', delay: 2.0 },
    { x: 64, y: 70, label: '$1.80M', delay: 2.5 },
    { x: 84, y: 56, label: '$2.40M', delay: 3.0 },
    { x: 14, y: 78, label: '$0.76M', delay: 3.5 },
];

const PropertyExplorer: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });
    const [idx, setIdx] = useState(0);

    /* Cycle through the listings every 2.4s once visible */
    useEffect(() => {
        if (!inView) return;
        const id = setInterval(() => {
            setIdx((i) => (i + 1) % LISTINGS.length);
        }, 2600);
        return () => clearInterval(id);
    }, [inView]);

    const listing = LISTINGS[idx];
    const price = useCountUp(Math.round(listing.price / 1000), 1600, inView);

    /* Top-line stats (count-up) for the side header */
    const totalListings = useCountUp(2840, 1800, inView);
    const newToday = useCountUp(46, 1500, inView);
    const avgDaysOnMkt = useCountUp(14, 1200, inView);

    return (
        <section className="dawki-re-explorer">
            <div className="container">
                <div className="dawki-re-explorer-heading">
                    <span className="dawki-re-explorer-pill">
                        <span></span>
                        Marketplace Engine
                    </span>
                    <h2 className="dawki-re-explorer-title">
                        Real-Estate Marketplaces, <span>Built for Buyers, Brokers &amp; Agents</span>
                    </h2>
                    <p className="dawki-re-explorer-subtitle">
                        We engineer property marketplaces and broker tools that unify MLS data, AI valuations, virtual tours, and lead routing — all in one console.
                    </p>
                </div>

                <motion.div
                    ref={ref}
                    className="dawki-re-explorer-frame"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                >
                    {/* Top status bar */}
                    <div className="dawki-re-explorer-bar">
                        <span className="dawki-re-explorer-bar-name">
                            <i></i>
                            MARKETPLACE · CityScope · powered by Dawki
                        </span>
                        <span className="dawki-re-explorer-bar-meta">
                            <span><strong>{totalListings.toLocaleString()}</strong> listings</span>
                            <span><strong>+{newToday}</strong> today</span>
                            <span>avg <strong>{avgDaysOnMkt} days</strong></span>
                        </span>
                    </div>

                    <div className="dawki-re-explorer-grid">
                        {/* Map canvas */}
                        <div className="dawki-re-explorer-map">
                            <div className="dawki-re-explorer-map-grid"></div>
                            {/* faux roads */}
                            <span className="dawki-re-explorer-road dawki-re-explorer-road-h" style={{ top: '28%' }}></span>
                            <span className="dawki-re-explorer-road dawki-re-explorer-road-h" style={{ top: '60%' }}></span>
                            <span className="dawki-re-explorer-road dawki-re-explorer-road-v" style={{ left: '24%' }}></span>
                            <span className="dawki-re-explorer-road dawki-re-explorer-road-v" style={{ left: '68%' }}></span>

                            {MAP_PINS.map((pin, i) => (
                                <span
                                    key={i}
                                    className={`dawki-re-explorer-pin ${i % LISTINGS.length === idx ? 'is-active' : ''}`}
                                    style={{
                                        left: `${pin.x}%`,
                                        top: `${pin.y}%`,
                                        animationDelay: `${pin.delay}s`,
                                    }}
                                >
                                    <i></i>
                                    <em>{pin.label}</em>
                                </span>
                            ))}

                            <span className="dawki-re-explorer-compass" aria-hidden="true">
                                <span>N</span>
                            </span>
                        </div>

                        {/* Featured listing card */}
                        <motion.div
                            key={idx}
                            className="dawki-re-explorer-card"
                            initial={{ opacity: 0, x: 18 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                        >
                            <div className="dawki-re-explorer-card-photo" style={{ background: listing.image }}>
                                <span className={`dawki-re-explorer-card-badge is-${listing.status.toLowerCase().replace(' ', '-')}`}>
                                    {listing.status}
                                </span>
                                <span className="dawki-re-explorer-card-photo-meta">
                                    <i></i>1 / 24
                                </span>
                            </div>
                            <div className="dawki-re-explorer-card-body">
                                <span className="dawki-re-explorer-card-price">
                                    ${price.toLocaleString()}<i>K</i>
                                </span>
                                <h3 className="dawki-re-explorer-card-addr">{listing.address}</h3>
                                <p className="dawki-re-explorer-card-city">{listing.city}</p>
                                <ul className="dawki-re-explorer-card-stats">
                                    <li><strong>{listing.beds}</strong>beds</li>
                                    <li><strong>{listing.baths}</strong>baths</li>
                                    <li><strong>{listing.sqft.toLocaleString()}</strong>sqft</li>
                                </ul>
                                <div className="dawki-re-explorer-card-actions">
                                    <span className="dawki-re-explorer-card-cta">Schedule Tour</span>
                                    <span className="dawki-re-explorer-card-fav" aria-hidden="true">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

/* ===========================================================================
 * Section 2: Deal Pipeline (Lead → Qualified → Tour → Offer → Closed)
 * ----------------------------------------------------------------------------
 * Kanban-style 5-column pipeline. Each column has 2 deal cards. A "hot deal"
 * indicator auto-advances column-by-column to demonstrate flow. Distinct
 * visual layout from any other section in the site.
 * =========================================================================== */
type Stage = {
    title: string;
    accent: string;
    glow: string;
    count: number;
    value: string;
    deals: { addr: string; agent: string; price: string }[];
};

const PIPELINE: Stage[] = [
    {
        title: 'New Lead',
        accent: '#5b9eff',
        glow: 'rgba(91, 158, 255, 0.40)',
        count: 184,
        value: '$48.2M',
        deals: [
            { addr: '244 Linden Ave', agent: 'A. Patel',     price: '$1.29M' },
            { addr: '17 Garden Lane', agent: 'M. Kapoor',    price: '$0.78M' },
        ],
    },
    {
        title: 'Qualified',
        accent: '#a855f7',
        glow: 'rgba(168, 85, 247, 0.40)',
        count: 92,
        value: '$31.6M',
        deals: [
            { addr: '88 Marina View',  agent: 'R. Holloway',  price: '$2.18M' },
            { addr: '12 Bay Heights',  agent: 'J. Wong',      price: '$1.45M' },
        ],
    },
    {
        title: 'Tour Booked',
        accent: '#ec4899',
        glow: 'rgba(236, 72, 153, 0.40)',
        count: 47,
        value: '$22.3M',
        deals: [
            { addr: '1207 Park Cresc.', agent: 'E. Mathur',    price: '$4.25M' },
            { addr: '52 Palm Tower',    agent: 'D. Salazar',   price: '$3.12M' },
        ],
    },
    {
        title: 'Offer Made',
        accent: '#f97316',
        glow: 'rgba(249, 115, 22, 0.40)',
        count: 18,
        value: '$14.7M',
        deals: [
            { addr: 'DLF 5 Crest',      agent: 'V. Nair',      price: '$0.95M' },
            { addr: '38 Lake Pavilion', agent: 'A. Khan',      price: '$1.80M' },
        ],
    },
    {
        title: 'Closed Won',
        accent: '#22c55e',
        glow: 'rgba(34, 197, 94, 0.40)',
        count: 12,
        value: '$11.4M',
        deals: [
            { addr: '6 Crescent Walk',  agent: 'F. Aguirre',   price: '$1.92M' },
            { addr: '14 Skyline Loft',  agent: 'K. Bhasin',    price: '$2.40M' },
        ],
    },
];

const DealPipeline: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });
    const [hot, setHot] = useState(0);

    /* Auto-advance the "hot deal" column every 1.6s once visible */
    useEffect(() => {
        if (!inView) return;
        const id = setInterval(() => {
            setHot((h) => (h + 1) % PIPELINE.length);
        }, 1700);
        return () => clearInterval(id);
    }, [inView]);

    return (
        <section className="dawki-re-pipe">
            <div className="container">
                <div className="dawki-re-pipe-heading">
                    <span className="dawki-re-pipe-pill">
                        <span></span>
                        CRM &amp; Deal Pipeline
                    </span>
                    <h2 className="dawki-re-pipe-title">
                        Every Lead, Every Tour, <span>Every Closed Deal — One Pipeline</span>
                    </h2>
                    <p className="dawki-re-pipe-subtitle">
                        Real-estate CRMs we build give brokerages full visibility from the first inbound enquiry to a signed contract — with AI lead scoring + deal-stage automation.
                    </p>
                </div>

                <motion.div
                    ref={ref}
                    className="dawki-re-pipe-board"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.10, delayChildren: 0.15 } },
                    }}
                >
                    {PIPELINE.map((stage, i) => (
                        <motion.div
                            key={stage.title}
                            className={`dawki-re-pipe-col ${i === hot ? 'is-hot' : ''}`}
                            style={{
                                ['--re-accent' as string]: stage.accent,
                                ['--re-glow' as string]: stage.glow,
                            }}
                            variants={{
                                hidden: { opacity: 0, y: 26 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] } },
                            }}
                        >
                            <div className="dawki-re-pipe-col-head">
                                <div>
                                    <span className="dawki-re-pipe-col-title">{stage.title}</span>
                                    <span className="dawki-re-pipe-col-count">{stage.count}</span>
                                </div>
                                <span className="dawki-re-pipe-col-value">{stage.value}</span>
                            </div>

                            {stage.deals.map((d, di) => (
                                <div key={di} className="dawki-re-pipe-card">
                                    <div className="dawki-re-pipe-card-top">
                                        <span className="dawki-re-pipe-card-avatar">{d.agent.split(' ').map((p) => p[0]).join('')}</span>
                                        <span className="dawki-re-pipe-card-price">{d.price}</span>
                                    </div>
                                    <span className="dawki-re-pipe-card-addr">{d.addr}</span>
                                    <span className="dawki-re-pipe-card-agent">Agent · {d.agent}</span>
                                    <div className="dawki-re-pipe-card-bar">
                                        <span style={{ width: `${30 + i * 17}%` }}></span>
                                    </div>
                                </div>
                            ))}

                            {i === hot && (
                                <span className="dawki-re-pipe-col-pulse" aria-hidden="true">
                                    <i></i>HOT
                                </span>
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

/* ===========================================================================
 * Page
 * =========================================================================== */
export default function RealEstateManagement() {
    return (
        <ServicePageTemplate
            pageTitle="Real Estate Management"
            breadcrumbCategory="Industries"
            heroPill="Industries"
            heroTitleStart="Real Estate"
            heroTitleHighlight="Management Platforms"
            heroSubtitle="Property marketplaces, broker CRMs, AI valuation, virtual tours, tenant portals, and rental management — built for brokerages, REITs, builders, and proptech startups."
            heroVideoSrc="/assets/images/header/demo/real-estate.mp4"
            featuresPill="PropTech Engineering"
            featuresTitleStart="Software That Sells,"
            featuresTitleHighlight="Manages & Scales Property"
            featuresSubtitle="From a single brokerage to a multi-city REIT — we ship real-estate tech that lifts agent productivity, cuts time-on-market, and unifies leads, listings & contracts."
            features={[
                { title: 'MLS / RESO Integration',  desc: 'Two-way sync with MLS, RESO Web API, IDX feeds — listings & status update in real time.', icon: '🔗' },
                { title: 'AI Property Valuation',   desc: 'AVM models trained on local comps, transaction history, and macro signals.',              icon: '🤖' },
                { title: 'Virtual Tours & 3D',      desc: 'Matterport, 360° photo, drone, and AR walk-throughs embedded in listing pages.',          icon: '🌐' },
                { title: 'Broker CRM & Pipeline',   desc: 'Lead routing, deal-stage automation, e-sign, commission tracking — one console.',         icon: '📊' },
                { title: 'Tenant & Owner Portals',  desc: 'Rent payments, maintenance tickets, lease renewals, tax + ledger statements.',            icon: '🏢' },
                { title: 'AI Lead Scoring',         desc: 'Score every inbound enquiry on intent + budget + urgency before agents are notified.',     icon: '⭐' },
            ]}
            processSteps={[
                { n: '01', t: 'Discovery',         d: 'Walk a brokerage office + a property tour with you; map agent + buyer + seller workflows.' },
                { n: '02', t: 'Architecture',     d: 'MLS / RETS / RESO adapter design, AVM data plan, payment + e-sign + KYC compliance map.' },
                { n: '03', t: 'Build',             d: 'Iterative sprints with live agent-pilot users + showings team + back-office accountants.' },
                { n: '04', t: 'Roll Out & Train', d: 'Phased rollout per market + agent enablement + 30-day hyper-care + ongoing AI retraining.' },
            ]}
            servicesPill="Our Capabilities"
            servicesTitleStart="Explore Our Range of"
            servicesTitleHighlight="Real Estate Services"
            servicesSubtitle="Buy-side, sell-side, leasing, property management, and back-office — across residential, commercial, vacation rental, and REIT portfolios."
            servicesLayout="timeline"
            serviceCards={[
                { title: 'Property Marketplaces',           desc: 'IDX-connected listing portals with map search, saved searches, alerts, and AI recommendations.', icon: ICON.box },
                { title: 'Broker / Agent CRM',              desc: 'Lead routing, deal pipeline, e-sign, commission split, contact intelligence, calendar sync.',       icon: ICON.users },
                { title: 'AI Property Valuation (AVM)',     desc: 'Custom AVMs trained on your transaction history + comps + macro data — bias-checked outputs.',       icon: ICON.bot },
                { title: 'Virtual Tours & 3D Walk-throughs', desc: 'Matterport + 360° + drone + AR layered into listing pages, with view analytics per agent.',        icon: ICON.eye },
                { title: 'Tenant / Resident Portals',       desc: 'Rent payment, maintenance tickets, document vault, community noticeboard, lease renewal flow.',     icon: ICON.headset },
                { title: 'Property Management Suite',       desc: 'Lease ledger, vendor + work-order management, owner statements, rent roll, tax reporting.',         icon: ICON.cog },
                { title: 'REIT / Portfolio Dashboards',     desc: 'Asset-level KPIs, NOI, cap-rate, occupancy, vacancy, CapEx vs OpEx — at portfolio + property scope.', icon: ICON.chart },
                { title: 'Mortgage & Loan Tech',            desc: 'Pre-qualification, KYC, document upload, OCR underwriting, e-sign — partner-bank API integrations.',  icon: ICON.shield },
                { title: 'Vacation Rental Platforms',       desc: 'Multi-channel sync (Airbnb / VRBO / Booking), dynamic pricing, smart-lock + housekeeping ops.',       icon: ICON.cloud },
                { title: 'Builder & Developer Apps',        desc: 'Project micro-sites, unit plan configurator, booking with token amount, construction-stage updates.', icon: ICON.rocket },
                { title: 'AI Lead Scoring & Chat',          desc: '24/7 multilingual chat that pre-qualifies on budget + intent + timeline before pinging an agent.',     icon: ICON.refresh },
                { title: 'Compliance & e-Sign',             desc: 'RERA, FHA, Fair Housing, GDPR, e-stamping, Aadhaar e-sign, DocuSign — with full audit trails.',         icon: ICON.palette },
            ]}
            toolsTitleStart="PropTech Stack &"
            toolsTitleHighlight="AI Tools We Build With"
            toolsSubtitle="Battle-tested MLS adapters, valuation engines, virtual-tour platforms, payment + KYC rails, and AI models — the stack we ship every real-estate engagement on."
            toolsLayout="vertical"
            tools={[
                { n: 'MLS / RESO Web API', s: 'mls',          c: '004B87', desc: 'Two-way sync with MLS via RETS + the modern RESO Web API — listings, status, photos, agents.' },
                { n: 'Zillow API',         s: 'zillow',       c: '006AFF', desc: 'Listing syndication + Zestimate ingestion + lead capture from Zillow Premier Agent.' },
                { n: 'Realtor.com',        s: 'realtor',      c: 'D72121', desc: 'IDX feed + Move Inc. partner APIs for syndication and lead routing.' },
                { n: 'Matterport',         s: 'matterport',   c: '00A6FF', desc: '3D virtual tours + dollhouse views + room measurements embedded into listing pages.' },
                { n: 'Mapbox',             s: 'mapbox',       c: '4264FB', desc: 'Vector maps, isochrones, geocoding, and custom map styles for marketplace search.' },
                { n: 'Google Maps',        s: 'googlemaps',   c: '4285F4', desc: 'Places autocomplete, school + transit overlays, Street View embeds, distance matrix.' },
                { n: 'OpenAI / GPT-4',     s: 'openai',       c: '412991', desc: 'Listing description generation, multilingual chat, lead pre-qualification, contract Q&A.' },
                { n: 'Claude',             s: 'anthropic',    c: 'D97757', desc: 'Long-context contract review, lease abstraction, due-diligence document summarisation.' },
                { n: 'Hugging Face',       s: 'huggingface',  c: 'FFD21E', desc: 'Custom AVM models — fine-tuned on local comps + transaction history per metro market.' },
                { n: 'Stable Diffusion',   s: 'stability',    c: 'F50057', desc: 'Virtual staging + lifestyle photo generation for vacant listings — fully automated.' },
                { n: 'Salesforce',         s: 'salesforce',   c: '00A1E0', desc: 'Salesforce Real Estate Cloud + custom objects for brokerage & REIT pipelines.' },
                { n: 'HubSpot',            s: 'hubspot',      c: 'FF7A59', desc: 'Marketing automation + lead nurturing for direct-to-buyer campaigns.' },
                { n: 'DocuSign',           s: 'docusign',     c: 'FFCC22', desc: 'E-sign + document tracking + envelope automation for offers, leases, and disclosures.' },
                { n: 'Stripe + Plaid',     s: 'stripe',       c: '008CDD', desc: 'Card + ACH rent collection, application fees, security deposits, KYC + bank verification.' },
                { n: 'Twilio',             s: 'twilio',       c: 'F22F46', desc: 'SMS + WhatsApp lead capture, tour reminders, two-way agent messaging, voice routing.' },
                { n: 'OpenAI Whisper',     s: 'openai',       c: '412991', desc: 'Voice-to-text for tour notes, call-centre QA, multilingual buyer interviews.' },
            ]}
            hideProjects={true}
            hideTestimonial={true}
            showClients={true}
            clientsPill="Trusted By Brokerages, Builders & REITs"
            clientsHeading="From Single-Office Brokerages to City-Wide REITs,"
            clientsHeadingHighlight="We Engineer Real-Estate Tech That Scales"
            extraSections={
                <>
                    <PropertyExplorer />
                    <DealPipeline />
                </>
            }
            googleReviews={[
                {
                    name: 'Aarav Malhotra',
                    role: 'Director, Skyline Realty (NCR)',
                    rating: 5,
                    date: '2 months ago',
                    text: 'Custom CRM + AI lead scoring built across 6 of our offices. Our agents now respond 11 minutes faster on average and our lead-to-tour conversion went from 8% to 19% in one quarter.',
                },
                {
                    name: 'Hannah Reed',
                    role: 'COO, Northbeam Properties (UK)',
                    rating: 5,
                    date: '4 months ago',
                    text: 'They rebuilt our IDX-connected marketplace from scratch on RESO Web API. Page-load dropped from 4.2s to 0.9s and organic-traffic listings actions went up 64%.',
                },
                {
                    name: 'Rajesh Iyer',
                    role: 'CTO, Greenview Builders',
                    rating: 5,
                    date: '6 months ago',
                    text: 'Builder app with unit configurator + token-amount booking + construction-stage updates. We sold 38 units in the first weekend launch — completely paperless.',
                },
                {
                    name: 'Sienna Walker',
                    role: 'Head of Tech, Cascade Vacation Homes',
                    rating: 5,
                    date: '3 months ago',
                    text: 'Vacation rental platform with Airbnb/VRBO sync + smart-lock + dynamic pricing. We manage 280 units now without growing the back-office team.',
                },
                {
                    name: 'Elena Castillo',
                    role: 'VP Asset Management, Spectra REIT',
                    rating: 5,
                    date: '5 months ago',
                    text: 'Portfolio dashboard with NOI, cap-rate, vacancy, CapEx vs OpEx — across 142 commercial assets. Board reporting that took 3 weeks now ships in 20 minutes.',
                },
                {
                    name: 'Vikram Joshi',
                    role: 'Founder, ProTenant (Property Management)',
                    rating: 5,
                    date: '7 months ago',
                    text: 'Tenant portal with rent payments, maintenance tickets, and document vault. Rent collection went from 78% on time to 96% on time in three months.',
                },
            ]}
            googleReviewsHeading="What Brokerages, Builders & REITs Say About Us"
            googleReviewsSubtitle="Verified reviews from agents, founders, and asset-management leaders we've shipped real-estate platforms with."
            faqs={[
                { q: 'Do you build for brokerages, builders, or REITs?',
                  a: 'All three. Our PropTech practice serves residential brokerages, commercial brokers, builders & developers, vacation-rental operators, REITs, and proptech startups.' },
                { q: 'Can you connect to MLS / RESO Web API / IDX?',
                  a: 'Yes — RETS, RESO Web API, IDX feeds, Zillow, Realtor.com, RESO Data Dictionary, plus most regional MLS endpoints. Two-way sync with status, photos, and agent fields.' },
                { q: 'Can you build a custom AI Property Valuation (AVM) model?',
                  a: 'Yes. We train Hugging Face / OpenAI fine-tuned models on your local comps, transaction history, and macro data — with bias-checking, confidence intervals, and explainability.' },
                { q: 'Do you handle virtual tours and 3D walk-throughs?',
                  a: 'Yes — Matterport, 360° photo, drone, and AR / WebXR. We also build view analytics that show which rooms got the most attention per agent.' },
                { q: 'Can you build tenant portals with rent collection?',
                  a: 'Yes — Stripe + Plaid + ACH + UPI for rent payment, maintenance tickets, document vault, lease renewal, and owner statements with full ledger.' },
                { q: 'Do you handle e-sign and compliance (RERA, FHA, GDPR)?',
                  a: 'Yes — DocuSign, Adobe Sign, Aadhaar e-sign, e-stamping, with RERA / FHA / Fair Housing / GDPR compliant flows and full audit trails.' },
                { q: 'How long does a real-estate build take?',
                  a: 'A focused module (e.g. broker CRM or marketplace) launches in 8–14 weeks. A full multi-product suite typically launches in 4–9 months.' },
                { q: 'Do you offer 24/7 support after launch?',
                  a: 'Yes. Real estate transactions are high-trust + 24/7. Phone, WhatsApp, and on-call engineering rotations included on enterprise contracts.' },
            ]}
        />
    );
}
