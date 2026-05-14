import { Link, usePage } from '@inertiajs/react';
import React from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

/* ============================================================================
 * Animation primitives for footer offices row
 * ============================================================================ */
const officeContainer: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.10, delayChildren: 0.05 } },
};
const officeItem: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] } },
};

/* Our Offices — 4 cards row above main footer.
 * Flag images come from flagcdn.com (free, fast, served as PNG/WebP) so they
 * render reliably on Windows browsers where flag emojis fall back to plain
 * country codes (US, GB, AE, IN).
 *
 * Phone numbers use ranges reserved for documentation / fiction so they
 * don't accidentally dial a real person:
 *  - US: +1 (512) 555-XXXX  (NANP "555" is reserved for fictional use)
 *  - UK: +44 20 7946 XXXX   (Ofcom drama range, see Ofcom guidance note 19)
 *  - UAE: +971 4 555 XXXX   (no official fiction prefix; "555" mirrors US convention)
 * Delhi uses the admin-managed site_phone shared via Inertia, since it's
 * the live HQ number. Update the static three by editing this array. */
const OFFICES = [
    { flag: 'https://flagcdn.com/w80/us.png', code: 'US', city: 'New York, USA', address: 'Balcones Drive, STE 100, Austin, TX 78731', phone: '+1 (512) 555-0192' },
    { flag: 'https://flagcdn.com/w80/gb.png', code: 'GB', city: 'London, UK', address: 'Great Portland Street, 5th Floor, London W1W 5PF', phone: '+44 20 7946 0182' },
    { flag: 'https://flagcdn.com/w80/ae.png', code: 'AE', city: 'Dubai, UAE', address: 'Dubai Silicon Oasis (DSO), JLT Jumeirah Lakes Towers', phone: '+971 4 555 8240' },
    { flag: 'https://flagcdn.com/w80/in.png', code: 'IN', city: 'Delhi, India', address: 'Badarpur, New Delhi, Delhi 110044', phone: '' /* filled from admin settings */ },
];

const FooterOffices: React.FC = () => {
    const reduced = useReducedMotion();
    const Wrapper: React.ElementType = reduced ? 'div' : motion.div;
    const Item: React.ElementType = reduced ? 'div' : motion.div;
    const wrapperProps = reduced
        ? {}
        : { initial: 'hidden', whileInView: 'visible', viewport: { once: true, margin: '-60px' }, variants: officeContainer };

    // Pull the admin-managed HQ phone for the Delhi card; the international
    // offices use the static placeholders in OFFICES above.
    const { props } = usePage<{ site?: { phone?: string; phoneDigits?: string } }>();
    const sitePhone = props.site?.phone ?? '+91 807 609 6255';

    return (
        <div className="dawki-footer-offices">
            <Wrapper className="dawki-footer-offices-grid" {...wrapperProps}>
                {OFFICES.map((o, i) => {
                    const displayPhone = o.phone || sitePhone;
                    return (
                        <Item key={i} className="dawki-footer-office-card" variants={reduced ? undefined : officeItem}>
                            <div className="dawki-footer-office-head">
                                <span className="dawki-footer-office-flag">
                                    <img
                                        src={o.flag}
                                        alt={`${o.code} flag`}
                                        loading="lazy"
                                        decoding="async"
                                        width={28}
                                        height={20}
                                    />
                                </span>
                                <h4 className="dawki-footer-office-city">{o.city}</h4>
                            </div>
                            <p className="dawki-footer-office-address">{o.address}</p>
                            <div className="dawki-footer-office-phone">
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                                <span>{displayPhone}</span>
                            </div>
                        </Item>
                    );
                })}
            </Wrapper>
        </div>
    );
};

const Footer: React.FC = () => {
    return (
        /* start: Footer Section */
        <footer className="tj-footer-section footer-1 section-gap-x">
            {/* Offices row — sits at the top of footer, above main columns */}
            <div className="container">
                <FooterOffices />
            </div>

            <div className="footer-main-area">
                <div className="container">
                    <div className="row justify-content-between">
                        <div className="col-xl-3 col-md-6">
                            <div className="footer-widget footer-col-1">
                                <div className="footer-logo">
                                    <Link href="/">
                                        <img
                                            src="/assets/images/header/demo/dawki_logo_transparent.png"
                                            alt="Dawki Infotech"
                                            width="150"
                                            height="40"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </Link>
                                </div>
                                <div className="footer-text">
                                    <p>
                                        We delivers end-to-end tech solutions that simplify digital transformation for fast-growing
                                        enterprises.
                                    </p>
                                </div>
                                <div className="social-links style-3">
                                    <ul>
                                        <li>
                                            <a href="https://www.facebook.com/dawkiinfotech/" target="_blank" rel="noreferrer">
                                                <i className="fa-brands fa-facebook-f"></i>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="https://www.instagram.com/dawki_infotech/" target="_blank" rel="noreferrer">
                                                <i className="fa-brands fa-instagram"></i>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="https://x.com/DawkiInfotech" target="_blank" rel="noreferrer">
                                                <i className="fa-brands fa-x-twitter"></i>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="https://www.linkedin.com/company/dawki-infotech-private-limited/posts/?feedView=all" target="_blank" rel="noreferrer">
                                                <i className="fa-brands fa-linkedin-in"></i>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-2 col-md-6">
                            <div className="footer-widget widget-contact footer-col-2 widget-nav-menu">
                                <h5 className="title">Services</h5>
                                <ul>
                                    <li><Link href="/services/software-engineering/custom-software-development">Custom Software Development</Link></li>
                                    <li><Link href="/services/software-engineering/web-application-development">Web Application Development</Link></li>
                                    <li><Link href="/services/software-engineering/mobile-app-development">Mobile App Development</Link></li>
                                    <li><Link href="/services/software-engineering/cloud-services">Cloud Services</Link></li>
                                    <li><Link href="/services/ai-data/ai-strategy-consulting">AI Strategy Consulting</Link></li>
                                    <li><Link href="/services/digital-marketing/marketing-strategy">Digital Marketing</Link></li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-xl-2 col-md-6">
                            <div className="footer-widget widget-contact footer-col-3 widget-nav-menu">
                                <h5 className="title">Industries</h5>
                                <ul>
                                    <li><Link href="/services/industries/healthcare-apps">Healthcare Apps</Link></li>
                                    <li><Link href="/services/industries/elearning-solutions">eLearning Solutions</Link></li>
                                    <li><Link href="/services/industries/real-estate">Real Estate Management</Link></li>
                                    <li><Link href="/services/industries/performance-management">Performance Management</Link></li>
                                    <li><Link href="/services/industries/financial-apps">Financial apps</Link></li>
                                    <li><Link href="/services/industries/hotels-restaurants">Hotels & Restaurants</Link></li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-xl-2 col-md-6">
                            <div className="footer-widget widget-contact footer-col-4 widget-nav-menu">
                                <h5 className="title">Resources</h5>
                                <ul>
                                    {/* All top-level pages use plain anchors — Inertia client nav
                                     * was rendering some pages blank intermittently. Hard nav = fresh mount. */}
                                      <li><a href="/estimate">Estimate Calculator</a></li>
                                    <li><a href="/blog">Blog</a></li>
                                    <li><a href="/faq">FAQs</a></li>
                                    <li><a href="/about">About Us</a></li>
                                    <li><a href="/contact">Contact</a></li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div className="tj-copyright-area-2">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="copyright-content-area">
                                <div className="copyright-text">
                                    <p>&copy; 2026&nbsp;<a href="https://dawkiinfotech.com/" target="_blank" rel="noreferrer">Dawki Infotech Pvt. Ltd.</a> All right reserved</p>
                                </div>
                                <div className="social-links style-3">
                                    <img src="/assets/images/footer/jj-e1754746873354.webp" alt="Image" height="40" />
                                </div>
                                <div className="copyright-menu">
                                    <ul>
                                        <li><a href="#">Privacy Policy</a></li>
                                        <li><a href="#">Terms & Condition</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-shape-1" aria-hidden="true">
                <img src="/assets/images/shape/pattern-2.svg" alt="" loading="lazy" decoding="async" />
            </div>
            <div className="bg-shape-2" aria-hidden="true">
                <img src="/assets/images/shape/pattern-3.svg" alt="" loading="lazy" decoding="async" />
            </div>
        </footer>
        /* end: Footer Section */
    );
};

export default Footer;
