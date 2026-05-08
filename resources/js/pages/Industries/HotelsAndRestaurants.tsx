import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import ServicePageTemplate, { ICON } from '@/components/ServicePageTemplate';

/* ===========================================================================
 * Section 1: Hotel Property Dashboard — animated occupancy grid + revenue
 * KPIs (occupancy %, ADR, RevPAR), today's check-ins / check-outs.
 * Visual style: hotel ops console — completely unique to this page.
 * =========================================================================== */

/** ease-out count-up. Triggers on scroll-into-view. */
const useCount = (target: number, dur = 1800, active = true) => {
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

/* Pre-computed 12-row × 14-col room grid. Each cell flips between
 * states (occupied / available / dirty / arriving) on a delayed timer
 * after the section enters view, so it feels alive. */
type RoomState = 'occupied' | 'available' | 'dirty' | 'arriving';
const baseGrid: RoomState[][] = Array.from({ length: 8 }, (_, r) =>
    Array.from({ length: 14 }, (_, c) => {
        const seed = (r * 14 + c) % 11;
        if (seed < 6) return 'occupied';
        if (seed < 9) return 'available';
        if (seed === 9) return 'arriving';
        return 'dirty';
    })
);

const HotelDashboard: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });

    const occ = useCount(82, 2200, inView);
    const adr = useCount(189, 2000, inView);
    const revpar = useCount(155, 2400, inView);
    const arrivals = useCount(28, 1800, inView);
    const departures = useCount(34, 2000, inView);

    /* Cycle a few cells through state changes to feel "live" */
    const [grid, setGrid] = useState<RoomState[][]>(baseGrid);
    useEffect(() => {
        if (!inView) return;
        const id = setInterval(() => {
            setGrid((prev) => {
                const next = prev.map((row) => row.slice()) as RoomState[][];
                const r = Math.floor(Math.random() * next.length);
                const c = Math.floor(Math.random() * next[0].length);
                const cycle: RoomState[] = ['available', 'arriving', 'occupied', 'dirty', 'available'];
                const idx = cycle.indexOf(next[r][c]);
                next[r][c] = cycle[(idx + 1) % cycle.length];
                return next;
            });
        }, 700);
        return () => clearInterval(id);
    }, [inView]);

    return (
        <section className="dawki-hr-dash">
            <div className="container">
                <div className="dawki-hr-dash-heading">
                    <span className="dawki-hr-dash-pill">
                        <span></span>
                        Property Operations
                    </span>
                    <h2 className="dawki-hr-dash-title">
                        One Console for <span>Every Room, Every Rate, Every Guest</span>
                    </h2>
                    <p className="dawki-hr-dash-subtitle">
                        Hotel software we build runs the entire property from a single screen — live housekeeping status, occupancy, ADR, RevPAR, and today's arrivals + departures.
                    </p>
                </div>

                <motion.div
                    ref={ref}
                    className="dawki-hr-dash-frame"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                >
                    {/* Top bar */}
                    <div className="dawki-hr-dash-bar">
                        <span className="dawki-hr-dash-bar-name">PROPERTY · The Lakeside Hotel · 142 keys</span>
                        <span className="dawki-hr-dash-bar-status">
                            <i className="dawki-hr-dash-bar-pulse"></i>LIVE · 14:32
                        </span>
                    </div>

                    {/* KPI tiles */}
                    <div className="dawki-hr-dash-kpis">
                        <div className="dawki-hr-dash-kpi">
                            <span>Occupancy</span>
                            <strong>{occ}<i>%</i></strong>
                            <em>↑ 6.2 vs last week</em>
                        </div>
                        <div className="dawki-hr-dash-kpi">
                            <span>ADR</span>
                            <strong>$<span>{adr}</span></strong>
                            <em>↑ $14 vs forecast</em>
                        </div>
                        <div className="dawki-hr-dash-kpi">
                            <span>RevPAR</span>
                            <strong>$<span>{revpar}</span></strong>
                            <em>↑ 12.8% YoY</em>
                        </div>
                        <div className="dawki-hr-dash-kpi">
                            <span>Today</span>
                            <strong>{arrivals}<i>↓</i> {departures}<i>↑</i></strong>
                            <em>arrivals · departures</em>
                        </div>
                    </div>

                    {/* Room grid + legend */}
                    <div className="dawki-hr-dash-rooms">
                        <div className="dawki-hr-dash-rooms-head">
                            <span>Floor map · today</span>
                            <div className="dawki-hr-dash-rooms-legend">
                                <span><i className="is-occupied"></i>Occupied</span>
                                <span><i className="is-available"></i>Available</span>
                                <span><i className="is-arriving"></i>Arriving</span>
                                <span><i className="is-dirty"></i>Full</span>
                            </div>
                        </div>
                        <div className="dawki-hr-dash-rooms-grid">
                            {grid.flatMap((row, r) =>
                                row.map((state, c) => (
                                    <span
                                        key={`${r}-${c}`}
                                        className={`dawki-hr-dash-room is-${state}`}
                                        title={`Room ${100 + r * 14 + c + 1}`}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

/* ===========================================================================
 * Section 2: From QR Scan to Plate — restaurant order journey, 6 sequential
 * stages with animated active-step indicator that auto-advances. Visually
 * a horizontal flow (not a stepper / not a dashboard) — distinct.
 * =========================================================================== */
type FlowStage = {
    step: string;
    title: string;
    desc: string;
    time: string;
    a: string; b: string; glow: string;
    icon: React.ReactNode;
};

const ORDER_FLOW: FlowStage[] = [
    {
        step: '01',
        title: 'QR Table Scan',
        desc: 'Guest scans the table QR — opens menu in browser, no app install.',
        time: '00:00',
        a: '#06b6d4', b: '#4f7cff', glow: 'rgba(6, 182, 212, 0.40)',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="16" y="16" width="3" height="3" />
            </svg>
        ),
    },
    {
        step: '02',
        title: 'AI Menu & Upsell',
        desc: 'Personalised recommendations + visual menu, dietary filters, AI pairings.',
        time: '00:30',
        a: '#a855f7', b: '#ec4899', glow: 'rgba(168, 85, 247, 0.40)',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
        ),
    },
    {
        step: '03',
        title: 'Cart & Pay',
        desc: 'Cart syncs across guests, split-bill, Stripe / UPI / Apple Pay one-tap.',
        time: '02:10',
        a: '#ec4899', b: '#f97316', glow: 'rgba(236, 72, 153, 0.40)',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
        ),
    },
    {
        step: '04',
        title: 'Kitchen Ticket',
        desc: 'Order routes to KDS by station — grill, fry, salad — auto-prioritised.',
        time: '02:18',
        a: '#f97316', b: '#fbbf24', glow: 'rgba(249, 115, 22, 0.40)',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 3h18v4H3z" />
                <path d="M3 7v14h18V7" />
                <line x1="8" y1="11" x2="16" y2="11" />
                <line x1="8" y1="15" x2="16" y2="15" />
            </svg>
        ),
    },
    {
        step: '05',
        title: 'Ready & Notify',
        desc: 'Server gets push when each course is up; guest gets a push if takeaway.',
        time: '14:42',
        a: '#22c55e', b: '#06b6d4', glow: 'rgba(34, 197, 94, 0.40)',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
        ),
    },
    {
        step: '06',
        title: 'Feedback & Loyalty',
        desc: 'Star rating, AI sentiment summary, loyalty points credited automatically.',
        time: '32:00',
        a: '#5b9eff', b: '#a855f7', glow: 'rgba(91, 158, 255, 0.40)',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
        ),
    },
];

const OrderFlow: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });
    const [active, setActive] = useState(0);

    /* Auto-advance the active step every 1.6s once visible — gives the
     * journey a "live conveyor" feel without user interaction. */
    useEffect(() => {
        if (!inView) return;
        const id = setInterval(() => {
            setActive((a) => (a + 1) % ORDER_FLOW.length);
        }, 1800);
        return () => clearInterval(id);
    }, [inView]);

    return (
        <section className="dawki-hr-flow">
            <div className="container">
                <div className="dawki-hr-flow-heading">
                    <span className="dawki-hr-flow-pill">
                        <span></span>
                        Restaurant Order Journey
                    </span>
                    <h2 className="dawki-hr-flow-title">
                        From QR Scan to Plate, <span>In One Connected Flow</span>
                    </h2>
                    <p className="dawki-hr-flow-subtitle">
                        Six steps from a guest's first scan to a feedback-and-loyalty close — orchestrated by software we engineer for restaurants worldwide.
                    </p>
                </div>

                <motion.div
                    ref={ref}
                    className="dawki-hr-flow-track"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
                    }}
                >
                    {ORDER_FLOW.map((s, i) => (
                        <React.Fragment key={s.step}>
                            <motion.article
                                className={`dawki-hr-flow-card ${i === active ? 'is-active' : ''}`}
                                style={{
                                    ['--fc-a' as string]: s.a,
                                    ['--fc-b' as string]: s.b,
                                    ['--fc-glow' as string]: s.glow,
                                }}
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] } },
                                }}
                            >
                                <span className="dawki-hr-flow-card-step">STEP {s.step}</span>
                                <span className="dawki-hr-flow-card-icon">{s.icon}</span>
                                <h3 className="dawki-hr-flow-card-title">{s.title}</h3>
                                <p className="dawki-hr-flow-card-desc">{s.desc}</p>
                                <span className="dawki-hr-flow-card-time">{s.time} elapsed</span>
                            </motion.article>
                            {i < ORDER_FLOW.length - 1 && (
                                <span className="dawki-hr-flow-arrow" aria-hidden="true">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                        <polyline points="12 5 19 12 12 19" />
                                    </svg>
                                </span>
                            )}
                        </React.Fragment>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

/* ===========================================================================
 * Page
 * =========================================================================== */
export default function HotelsAndRestaurants() {
    return (
        <ServicePageTemplate
            pageTitle="Hotels & Restaurants Management"
            breadcrumbCategory="Industries"
            heroPill="Industries"
            heroTitleStart="Hotels & Restaurants"
            heroTitleHighlight="Management Platforms"
            heroSubtitle="Property management systems, restaurant POS, online ordering, loyalty, and AI revenue management — engineered for hotel groups, restaurant chains, and hospitality startups."
            heroVideoSrc="/assets/images/header/demo/hotel_management.mp4"
            featuresPill="Hospitality Engineering"
            featuresTitleStart="Software That Runs"
            featuresTitleHighlight="Every Room & Every Table"
            featuresSubtitle="From a 142-key resort to a 60-restaurant chain — we ship hospitality software that lifts occupancy, raises ADR, and shortens table turnaround."
            features={[
                { title: 'PMS / POS Integration',  desc: 'Native integrations with Opera, Cloudbeds, Toast, Square, Lightspeed, Petpooja.', icon: '🔗' },
                { title: 'AI Revenue Management',  desc: 'Dynamic pricing on rooms + tables based on demand, weather, events.',          icon: '🤖' },
                { title: 'Channel Manager',        desc: 'Single inventory across Booking.com, Expedia, Airbnb, MakeMyTrip, direct.',     icon: '📡' },
                { title: 'Contactless Ordering',   desc: 'QR menus, AI upsell, split-bill, multi-currency one-tap payments.',             icon: '📱' },
                { title: 'Loyalty & CRM',          desc: 'Member tiers, AI segmentation, birthday automations, Stripe-native points.',     icon: '⭐' },
                { title: 'Operations Dashboards',  desc: 'Live occupancy, ADR, RevPAR, food cost, table turnover — one screen.',           icon: '📊' },
            ]}
            processSteps={[
                { n: '01', t: 'Discovery', d: 'Walk the property + restaurant; map workflows from front-desk to housekeeping to kitchen.' },
                { n: '02', t: 'Architecture', d: 'PMS / POS adapter map, channel-manager design, payment + tax compliance plan.' },
                { n: '03', t: 'Build', d: 'Iterative sprints with on-property pilot users + live kitchen / front-desk testing.' },
                { n: '04', t: 'Roll Out & Train', d: 'Phased rollout per property + staff training + 24/7 hyper-care for the first 30 days.' },
            ]}
            servicesPill="Our Capabilities"
            servicesTitleStart="Explore Our Range of"
            servicesTitleHighlight="Hospitality Services"
            servicesSubtitle="Front-of-house, back-of-house, guest-facing apps, and revenue ops — across hotels, restaurants, cafés, cloud kitchens, and resorts."
            servicesLayout="timeline"
            serviceCards={[
                { title: 'Property Management Systems (PMS)', desc: 'Reservations, housekeeping, billing, night audit, group bookings — replace or extend Opera, Cloudbeds, RoomRaccoon.', icon: ICON.box },
                { title: 'Restaurant POS & KDS',              desc: 'Order entry, kitchen display, table layouts, split-bill, modifiers — for fine dining, QSR, and cloud kitchens.', icon: ICON.cog },
                { title: 'Channel Managers',                  desc: 'Inventory + rate sync across Booking.com, Expedia, Airbnb, MakeMyTrip, GDS, and your direct site.',               icon: ICON.refresh },
                { title: 'Booking Engines',                   desc: 'Direct-booking sites with mobile-first UX, upsell modules, and zero-fee payment flows that beat OTA conversion.', icon: ICON.rocket },
                { title: 'Online Ordering & Delivery',        desc: 'Branded ordering apps + delivery integrations (DoorDash, Uber Eats, Swiggy, Zomato) and own-fleet dispatch.',     icon: ICON.headset },
                { title: 'AI Revenue Management',             desc: 'Dynamic pricing engine for rooms + menu items based on demand, weather, events, and competitor signals.',          icon: ICON.bot },
                { title: 'QR Contactless Ordering',           desc: 'Branded QR menus with AI upsell, dietary filters, multi-language, and split-bill payments.',                      icon: ICON.eye },
                { title: 'Loyalty & CRM',                     desc: 'Member tiers, AI segmentation, birthday + occasion automations, Stripe-native point accrual + redemption.',       icon: ICON.users },
                { title: 'Hotel Mobile Apps',                 desc: 'Pre-arrival check-in, mobile keys, in-stay services (housekeeping, room-service, spa), express check-out.',        icon: ICON.palette },
                { title: 'Cloud Kitchen Software',            desc: 'Multi-brand routing, rider dispatch, kitchen capacity planning, and aggregator commission analytics.',             icon: ICON.cloud },
                { title: 'Operations Dashboards',             desc: 'Live occupancy, ADR, RevPAR, food cost, labour ratios, table turnover — for owners + GMs.',                       icon: ICON.chart },
                { title: 'Compliance & Reporting',            desc: 'GST + VAT + service-charge handling, tax filing exports, FSSAI / health-department reporting.',                  icon: ICON.shield },
            ]}
            toolsTitleStart="Hospitality Stack &"
            toolsTitleHighlight="AI Tools We Build With"
            toolsSubtitle="Battle-tested PMS, POS, channel managers, payment rails, and AI revenue tools — the stack we ship every hotel & restaurant engagement on."
            toolsLayout="vertical"
            tools={[
                { n: 'Oracle Opera',     s: 'oracle',         c: 'F80000', desc: 'Industry-standard hotel PMS — we integrate via Opera Cloud APIs and OXI for inventory + reservations.' },
                { n: 'Cloudbeds',        s: 'cloudbeds',      c: '00B6E0', desc: 'Independent + boutique hotel PMS — modern API for two-way reservation + rate sync.' },
                { n: 'Toast POS',        s: 'toast',          c: 'FF4C00', desc: 'Restaurant POS + KDS market leader in NA — direct API for menus, orders, modifiers, and reporting.' },
                { n: 'Square',           s: 'square',         c: '3E4348', desc: 'Modern POS for cafés, QSR, and small chains — quick payments + simple inventory + Stripe-grade APIs.' },
                { n: 'Lightspeed',       s: 'lightspeed',     c: 'F03F2D', desc: 'Restaurant POS popular in EU + APAC — strong inventory and multi-location support.' },
                { n: 'Petpooja',         s: 'petpooja',       c: '0066B3', desc: 'India\'s most-used restaurant POS — we integrate menus, orders, and aggregator routing.' },
                { n: 'OpenAI / GPT-4',   s: 'openai',         c: '412991', desc: 'AI menu personalisation, sentiment summary on reviews, dynamic upsell, multilingual concierge chat.' },
                { n: 'Claude',           s: 'anthropic',      c: 'D97757', desc: 'Long-context guest correspondence handling + revenue strategy memos drafted from operational data.' },
                { n: 'Hugging Face',     s: 'huggingface',    c: 'FFD21E', desc: 'Custom fine-tuned demand-forecasting models per property cluster + season.' },
                { n: 'Stripe',           s: 'stripe',         c: '008CDD', desc: 'Card-not-present, Apple Pay / Google Pay, split-bill, hold-and-capture for hotels.' },
                { n: 'Razorpay',         s: 'razorpay',       c: '0066FF', desc: 'India-first payment + UPI rails for restaurants and direct-booking hotel sites.' },
                { n: 'Booking.com',      s: 'bookingdotcom',  c: '003580', desc: 'Channel manager integration via XML + Connectivity APIs — two-way ARI + reservation sync.' },
                { n: 'Expedia',          s: 'expedia',        c: 'FFC72C', desc: 'EQC + EPS API integrations — inventory, rates, availability, and reservation deliveries.' },
                { n: 'Airbnb',           s: 'airbnb',         c: 'FF5A5F', desc: 'API + iCal integrations for boutique hotels and apartment-style properties.' },
                { n: 'Twilio',           s: 'twilio',         c: 'F22F46', desc: 'WhatsApp Business + SMS confirmations, mobile-key delivery, two-way guest messaging.' },
                { n: 'OpenAI Whisper',   s: 'openai',         c: '412991', desc: 'Voice-to-text for in-room ordering, drive-thru transcription, and call-centre QA.' },
            ]}
            hideProjects={true}
            hideTestimonial={true}
            showClients={true}
            clientsPill="Trusted By Hotels & Restaurant Groups"
            clientsHeading="From Boutique Hotels to Restaurant Chains,"
            clientsHeadingHighlight="We Engineer Hospitality That Scales"
            extraSections={
                <>
                    <HotelDashboard />
                    <OrderFlow />
                </>
            }
            googleReviews={[
                {
                    name: 'Karan Bhasin',
                    role: 'COO, Lakeside Hotel Group (8 properties)',
                    rating: 5,
                    date: '2 months ago',
                    text: 'Custom PMS replacing Opera across our boutique chain. Direct-booking conversion up 38%, OTA commission down by 22%, and our front-desk training time dropped from a fortnight to four days.',
                },
                {
                    name: 'Aisha Mehta',
                    role: 'Founder, Saanvi Cafés (24 outlets)',
                    rating: 5,
                    date: '4 months ago',
                    text: 'QR ordering + AI upsell + KDS rebuild. Average ticket size up 19%, kitchen ticket-time down 27 seconds. Best return on tech spend we have ever seen.',
                },
                {
                    name: 'Marcus Holloway',
                    role: 'CTO, Northbeam Hospitality',
                    rating: 5,
                    date: '6 months ago',
                    text: 'AI revenue management engine plugged into Opera. ADR up $14, RevPAR up 12.8% in the first quarter. Numbers our revenue manager said were impossible to hit without raising rates.',
                },
                {
                    name: 'Rohini Shankar',
                    role: 'Owner, BrightCloud Cloud Kitchens',
                    rating: 5,
                    date: '3 months ago',
                    text: 'Multi-brand cloud-kitchen software with rider dispatch + aggregator analytics. We finally see commission bleed per platform per item per hour. Operations visibility went from blind to surgical.',
                },
                {
                    name: 'Diego Salazar',
                    role: 'Head of Operations, Spectra Resorts',
                    rating: 5,
                    date: '5 months ago',
                    text: 'Mobile-key + pre-arrival check-in + AI concierge across our four resorts. Front-desk queues at peak season basically disappeared and our guest-NPS scores went up 18 points.',
                },
                {
                    name: 'Felix Aguirre',
                    role: 'Founder, Polestar Restaurants',
                    rating: 5,
                    date: '7 months ago',
                    text: 'Loyalty + CRM rebuild with Stripe-native points across 12 restaurants. Repeat-visit rate climbed from 23% to 41% in six months. The team is now obsessed with the dashboards.',
                },
            ]}
            googleReviewsHeading="What Hotel & Restaurant Operators Say About Us"
            googleReviewsSubtitle="Verified reviews from owners, COOs, and operations leaders we've shipped hospitality software with."
            faqs={[
                { q: 'Do you build for hotels and restaurants both?',
                  a: 'Yes. We have a dedicated hospitality practice covering hotels, resorts, restaurant chains, cafés, cloud kitchens, and bars. Many of our clients run both under one roof.' },
                { q: 'Can you replace or extend our existing PMS / POS?',
                  a: 'Both. We build full custom PMS / POS systems, and we also build modules + integrations on top of Opera, Cloudbeds, Toast, Square, Lightspeed, Petpooja and others.' },
                { q: 'Do you do channel manager integrations?',
                  a: 'Yes — Booking.com, Expedia, Airbnb, MakeMyTrip, Goibibo, GDS, and direct-booking engines. Two-way ARI + reservation delivery is our default.' },
                { q: 'Can you build AI features for revenue management?',
                  a: 'Yes — dynamic room and menu pricing engines that consider demand, seasonality, weather, events, and competitor signals. Often paired with a custom forecasting model.' },
                { q: 'Do you handle payments + tax compliance?',
                  a: 'Yes — Stripe, Razorpay, UPI, Apple Pay, Google Pay, GST, VAT, service charge, and country-specific receipt formatting (FSSAI / FBR / etc).' },
                { q: 'How long does a hospitality build take?',
                  a: 'A focused module (e.g. QR ordering + KDS) ships in 8–12 weeks. A full PMS or restaurant suite typically launches in 4–9 months.' },
                { q: 'Do you offer 24/7 support after launch?',
                  a: 'Yes. Hospitality is 24/7 — so are our SLAs. Phone, WhatsApp, and on-call engineering rotations included on enterprise contracts.' },
                { q: 'Can the system work offline (when wifi drops)?',
                  a: 'Yes. Our restaurant POS + KDS support local-first operation with deferred sync — an outage at the venue does not stop service.' },
            ]}
        />
    );
}
