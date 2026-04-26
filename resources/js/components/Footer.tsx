import { Link } from '@inertiajs/react';
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

/* Our Offices — 4 cards row above main footer */
const OFFICES = [
    { flag: '🇺🇸', city: 'New York, USA', address: '5900 Balcones Drive, STE 100, Austin, TX 78731' },
    { flag: '🇬🇧', city: 'London, UK', address: '167-169 Great Portland Street, 5th Floor, London W1W 5PF' },
    { flag: '🇦🇪', city: 'Dubai, UAE', address: 'Dubai Silicon Oasis (DSO), JLT Jumeirah Lakes Towers' },
    { flag: '🇮🇳', city: 'Delhi, India', address: 'Badarpur, New Delhi, Delhi 110044' },
];

const FooterOffices: React.FC = () => {
    const reduced = useReducedMotion();
    const Wrapper: React.ElementType = reduced ? 'div' : motion.div;
    const Item: React.ElementType = reduced ? 'div' : motion.div;
    const wrapperProps = reduced
        ? {}
        : { initial: 'hidden', whileInView: 'visible', viewport: { once: true, margin: '-60px' }, variants: officeContainer };

    return (
        <div className="dawki-footer-offices">
            <Wrapper className="dawki-footer-offices-grid" {...wrapperProps}>
                {OFFICES.map((o, i) => (
                    <Item key={i} className="dawki-footer-office-card" variants={reduced ? undefined : officeItem}>
                        <div className="dawki-footer-office-head">
                            <span className="dawki-footer-office-flag">{o.flag}</span>
                            <h4 className="dawki-footer-office-city">{o.city}</h4>
                        </div>
                        <p className="dawki-footer-office-address">{o.address}</p>
                    </Item>
                ))}
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
                            <div className="footer-widget footer-col-1 wow fadeInUp" data-wow-delay=".1s">
                                <div className="footer-logo">
                                    <Link href="/">
                                        <img src="/assets/images/logos/DawkiInfotech_footer.jpg" alt="Logos" />
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
                            <div className="footer-widget widget-contact footer-col-2 widget-nav-menu wow fadeInUp" data-wow-delay=".3s">
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
                            <div className="footer-widget widget-contact footer-col-3 widget-nav-menu wow fadeInUp" data-wow-delay=".5s">
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
                            <div className="footer-widget widget-contact footer-col-4 widget-nav-menu wow fadeInUp" data-wow-delay=".5s">
                                <h5 className="title">Resources</h5>
                                <ul>
                                    <li><Link href="/blog">Blog</Link></li>
                                    <li><Link href="/faq">FAQs</Link></li>
                                    <li><Link href="/about">About Us</Link></li>
                                    <li><Link href="/contact">Contact</Link></li>
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
                                    <p>&copy; 2025&nbsp;<a href="https://dawkiinfotech.com/" target="_blank" rel="noreferrer">Dawki Infotech Pvt. Ltd.</a> All right reserved</p>
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
            <div className="bg-shape-1">
                <img src="/assets/images/shape/pattern-2.svg" alt="" />
            </div>
            <div className="bg-shape-2">
                <img src="/assets/images/shape/pattern-3.svg" alt="" />
            </div>
        </footer>
        /* end: Footer Section */
    );
};

export default Footer;
