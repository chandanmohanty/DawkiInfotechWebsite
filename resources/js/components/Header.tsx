import { Link, usePage } from '@inertiajs/react';
import React, { useEffect } from 'react';

const Header: React.FC = () => {
    // Current URL from Inertia (kept in sync on every navigation)
    const { url } = usePage();
    // Strip query/hash and normalize trailing slash
    const path = (url.split('?')[0].split('#')[0] || '/').replace(/\/$/, '') || '/';

    const isExact = (target: string) => path === target;
    const isUnder = (prefix: string) => path === prefix || path.startsWith(prefix + '/');

    // Treat the global "/services/industries/*" routes as part of the Industries menu, NOT the Services menu
    const inServicesParent = isUnder('/services') && !isUnder('/services/industries');
    const inIndustriesParent = isUnder('/services/industries');
    const inResourcesParent = isExact('/blog') || isExact('/faq') || isExact('/contact');

    const navCls = (active: boolean, baseExtra = '') =>
        [baseExtra, active ? 'current-menu-ancestor' : ''].filter(Boolean).join(' ');

    useEffect(() => {
        // Initialize jQuery-based features
        const $ = (window as any).jQuery;
        if (!$) return;

        // Mobile Menu Js (MeanMenu)
        const initMeanMenu = () => {
            const mobileMenu = $("#mobile-menu");
            if (mobileMenu.length > 0 && typeof mobileMenu.meanmenu === "function") {
                mobileMenu.meanmenu({
                    meanMenuContainer: ".mobile_menu",
                    meanScreenWidth: "991",
                    meanExpand: ['<i class="tji-arrow-down"></i>'],
                });
            }
        };

        // Mobile Menu toggle
        const handleMobileMenuToggle = function (this: HTMLElement) {
            $(this).toggleClass("on");
            $(".hamburger-area").addClass("opened");
            $(".body-overlay").addClass("opened");
            $("body").addClass("overflow-hidden");
        };

        // Offcanvas toggle
        const handleOffcanvasToggle = () => {
            $(".tj-offcanvas-area").toggleClass("opened");
            $(".body-overlay").addClass("opened");
            $("body").addClass("overflow-hidden");
        };

        // Close menu/offcanvas
        const handleClose = () => {
            $(".tj-offcanvas-area").removeClass("opened");
            $(".hamburger-area").removeClass("opened");
            $(".body-overlay").removeClass("opened");
            $("body").removeClass("overflow-hidden");
        };

        // Sticky Menu logic
        let lastScrollTop = 0;
        const handleScroll = () => {
            const st = $(window).scrollTop();
            const targetMenu = $(".header-sticky");
            const toggleClass = "sticky";

            if (st > 500) {
                if (st > lastScrollTop) {
                    targetMenu.removeClass(toggleClass);
                } else {
                    targetMenu.addClass(toggleClass);
                }
            } else {
                targetMenu.removeClass(toggleClass);
            }
            lastScrollTop = st;
        };

        // Search popup toggle
        const handleSearchOpen = function (this: HTMLElement) {
            $(this).addClass("search-hide");
            $(".search_close_btn").addClass("close-show");
            $(".search_popup").addClass("search-opened");
            $(".search-popup-overlay").addClass("search-popup-overlay-open");
        };

        const handleSearchClose = () => {
            $(".header-search .search").removeClass("search-hide");
            $(".search_close_btn").removeClass("close-show");
            $(".search_popup").removeClass("search-opened");
            $(".search-popup-overlay").removeClass("search-popup-overlay-open");
        };

        // Bind events
        $(".mobile_menu_bar").on("click", handleMobileMenuToggle);
        $(".menu_offcanvas").on("click", handleOffcanvasToggle);
        $(".hamburger_close_btn, .body-overlay").on("click", handleClose);
        $(".header-search .search").on("click", handleSearchOpen);
        $(".search_close_btn, .search-popup-overlay").on("click", handleSearchClose);
        $(window).on("scroll", handleScroll);

        // Initial meanmenu call
        initMeanMenu();

        return () => {
            $(".mobile_menu_bar").off("click", handleMobileMenuToggle);
            $(".menu_offcanvas").off("click", handleOffcanvasToggle);
            $(".hamburger_close_btn, .body-overlay").off("click", handleClose);
            $(".header-search .search").off("click", handleSearchOpen);
            $(".search_close_btn, .search-popup-overlay").off("click", handleSearchClose);
            $(window).off("scroll", handleScroll);
        };
    }, []);

    const Logo = () => (
        <div className="site_logo">
            {/* Plain anchor does a hard navigation to "/" — guarantees the
             * welcome page mounts fresh every time, sidestepping any Inertia
             * client-side state that was rendering it blank on click. */}
            <a className="logo" href="/">
                <img src="/assets/images/header/demo/dawki_logo_transparent.png" alt="Dawki Infotech" />
            </a>
        </div>
    );

    const Navigation = () => (
        <nav id="mobile-menu" className="mainmenu">
            <ul>
                {/* Plain anchors — Inertia client-side nav was rendering some pages
                 * blank intermittently. Hard nav guarantees a fresh mount. */}
                <li className={navCls(isExact('/'))}>
                    <a href="/">Home</a>
                </li>
                <li className={navCls(isExact('/about'))}>
                    <a href="/about">About</a>
                </li>
                <li className={navCls(inServicesParent, 'has-dropdown')} data-mega-trigger="services">
                    <a href="/about">Services</a>
                    <ul className="sub-menu header__mega-menu mega-menu mega-menu-pages">
                        <li>
                            <div className="mega-menu-wrapper">
                                <div className="mega-menu-pages-single">
                                    <div className="mega-menu-pages-single-inner">
                                        <h6 className="mega-menu-title gradient-text-blue">Software Engineering</h6>
                                        <div className="mega-menu-list">
                                            <Link href="/services/software-engineering/custom-software-development">Custom Software Development</Link>
                                            <Link href="/services/software-engineering/web-application-development">Web Application Development</Link>
                                            <Link href="/services/software-engineering/mobile-app-development">Mobile App Development</Link>
                                            <Link href="/services/software-engineering/enterprise-app-development">Enterprise App Development</Link>
                                            <Link href="/services/software-engineering/blockchain-development">Block Chain Development</Link>
                                            <Link href="/services/software-engineering/cloud-services">Cloud Services</Link>
                                            <Link href="/services/software-engineering/devops-services">DevOps Services</Link>
                                            <Link href="/services/software-engineering/saas-application">SaaS Application</Link>
                                            <Link href="/services/software-engineering/product-ui-ux-design">Product UI/UX Design</Link>
                                        </div>
                                    </div>
                                </div>

                                <div className="mega-menu-pages-single">
                                    <div className="mega-menu-pages-single-inner">
                                        <h6 className="mega-menu-title gradient-text-blue">Digital Marketing</h6>
                                        <div className="mega-menu-list">
                                            <Link href="/services/digital-marketing/marketing-strategy">Marketing Strategy</Link>
                                            <Link href="/services/digital-marketing/search-engine-optimization">Search Engine Optimization</Link>
                                            <Link href="/services/digital-marketing/paid-ad-campaigns">Paid Ad Campaigns(PPC)</Link>
                                            <Link href="/services/digital-marketing/social-media-management">Social Media Management</Link>
                                            <br />
                                            <h6 className="mega-menu-title gradient-text-blue">AI & Data Engineering</h6>
                                            <Link href="/services/ai-data/ai-strategy-consulting">AI Strategy Consulting</Link>
                                            <Link href="/services/ai-data/ai-agent-development">AI Agent Development</Link>
                                            <Link href="/services/ai-data/salesforce-development">Salesforce Development</Link>
                                            <Link href="/services/ai-data/business-intelligence-services">Business Intelligence Services</Link>
                                        </div>
                                    </div>
                                </div>

                                <div className="mega-menu-pages-single">
                                    <div className="mega-menu-pages-single-inner">
                                        <h6 className="mega-menu-title gradient-text-blue">Team Extension Services</h6>
                                        <div className="mega-menu-list">
                                            <Link href="/services/team-extension/it-consulting-services">IT Consulting Services</Link>
                                            <Link href="/services/team-extension/automated-testing-services">Automated Testing Services</Link>
                                            <Link href="/services/team-extension/performance-testing-services">Performance Testing Services</Link>
                                            <Link href="/services/team-extension/security-testing-services">Security Testing Services</Link>
                                            <Link href="/services/team-extension/metaverse-development">Metaverse Development</Link>
                                            <br />
                                            <h6 className="mega-menu-title gradient-text-blue">Other Services</h6>
                                            <Link href="/services/other/dedicated-development-teams">Dedicated Development Teams</Link>
                                            <Link href="/services/other/offshore-development-center">Offshore Development Center</Link>
                                            <Link href="/services/other/staff-augmentation-services">Staff Augmentation Services</Link>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 col-lg-3 mega-menu-pages-single">
                                    <div className="mega-menu-pages-single-inner">
                                        <div className="feature-box">
                                            <div className="feature-content">
                                                <h3 className="title" style={{ fontSize: '40px !important' }}>Innovative</h3>
                                                <span>Driving Digital Transformation with Smart, Scalable Solutions</span>
                                                <a className="read-more feature-contact" href="tel:8076096255">
                                                    <i className="tji-phone-3"></i>
                                                    <span>+91 807 609 6255</span>
                                                </a>
                                            </div>
                                            <div className="feature-images">
                                                <img src="/assets/images/service/ai_development.jpg" alt="" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>

                <li className={navCls(inIndustriesParent, 'has-dropdown')}>
                    <a href="#">Industries</a>
                    <ul className="sub-menu mega-menu-service">
                        <li>
                            <Link className="mega-menu-service-single" href="/services/industries/healthcare-apps">
                                <span className="mega-menu-service-icon"><i className="tji-service-1"></i></span>
                                <span className="mega-menu-service-title">Healthcare Apps</span>
                                <span className="mega-menu-service-nav">
                                    <i className="tji-arrow-right-long"></i>
                                    <i className="tji-arrow-right-long"></i>
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link className="mega-menu-service-single" href="/services/industries/elearning-solutions">
                                <span className="mega-menu-service-icon"><i className="tji-service-2"></i></span>
                                <span className="mega-menu-service-title">eLearning Solutions</span>
                                <span className="mega-menu-service-nav">
                                    <i className="tji-arrow-right-long"></i>
                                    <i className="tji-arrow-right-long"></i>
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link className="mega-menu-service-single" href="/services/industries/hotels-restaurants">
                                <span className="mega-menu-service-icon"><i className="tji-service-3"></i></span>
                                <span className="mega-menu-service-title">Hotels and Resturants Management</span>
                                <span className="mega-menu-service-nav">
                                    <i className="tji-arrow-right-long"></i>
                                    <i className="tji-arrow-right-long"></i>
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link className="mega-menu-service-single" href="/services/industries/real-estate">
                                <span className="mega-menu-service-icon"><i className="tji-service-4"></i></span>
                                <span className="mega-menu-service-title">Real Estate Management</span>
                                <span className="mega-menu-service-nav">
                                    <i className="tji-arrow-right-long"></i>
                                    <i className="tji-arrow-right-long"></i>
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link className="mega-menu-service-single" href="/services/industries/performance-management">
                                <span className="mega-menu-service-icon"><i className="tji-service-5"></i></span>
                                <span className="mega-menu-service-title">Performance Management</span>
                                <span className="mega-menu-service-nav">
                                    <i className="tji-arrow-right-long"></i>
                                    <i className="tji-arrow-right-long"></i>
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link className="mega-menu-service-single" href="/services/industries/financial-apps">
                                <span className="mega-menu-service-icon"><i className="tji-service-6"></i></span>
                                <span className="mega-menu-service-title">Financial apps</span>
                                <span className="mega-menu-service-nav">
                                    <i className="tji-arrow-right-long"></i>
                                    <i className="tji-arrow-right-long"></i>
                                </span>
                            </Link>
                        </li>
                    </ul>
                </li>
                <li className={navCls(isExact('/portfolio'))}>
                    <a href="/portfolio">Portfolio</a>
                </li>
                <li className={navCls(isExact('/estimate'))}>
                    <a href="/estimate">Estimate Calculator</a>
                </li>
                <li className={navCls(inResourcesParent, 'has-dropdown')}>
                    <a href="#">Resources</a>
                    <ul className="sub-menu">
                        {/* All top-level pages use plain anchors — Inertia client-side nav
                         * was rendering some pages blank intermittently. Hard nav = fresh mount. */}
                        <li><a href="/blog">Blog</a></li>
                        <li><a href="/faq">FAQs</a></li>
                        <li><a href="/contact">Contact</a></li>
                    </ul>
                </li>
            </ul>
        </nav>
    );

    const HeaderActions = () => (
        <div className="header-right-item d-none d-lg-inline-flex">
            <div className="header-button">
                {/* Plain anchor — Inertia client-side nav was rendering Contact blank intermittently. Hard nav guarantees a fresh mount. */}
                <a className="tj-primary-btn" href="/contact">
                    <span className="btn-text"><span>Contact Us</span></span>
                    <span className="btn-icon"><i className="tji-arrow-right-long"></i></span>
                </a>
            </div>
            <div className="menu_bar menu_offcanvas d-none d-lg-inline-flex">
                <span></span><span></span><span></span>
            </div>
        </div>
    );

    const MobileBar = () => (
        <div className="menu_bar mobile_menu_bar d-lg-none">
            <span></span><span></span><span></span>
        </div>
    );

    const SearchPopup = () => (
        <div className="search_popup">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-8">
                        <div className="tj_search_wrapper">
                            <div className="search_form">
                                <form action="#">
                                    <div className="search_input">
                                        <div className="search-box">
                                            <input className="search-form-input" type="text" placeholder="Type Words and Hit Enter" required />
                                            <button type="submit"><i className="tji-search"></i></button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Offcanvas Menu */}
            <div className="tj-offcanvas-area d-none d-lg-block">
                <div className="hamburger_bg"></div>
                <div className="hamburger_wrapper">
                    <div className="hamburger_inner">
                        <div className="hamburger_top d-flex align-items-center justify-content-between">
                            <div className="hamburger_logo">
                                <a href="/" className="mobile_logo">
                                    <img src="/assets/images/header/demo/dawki_logo_transparent.png" alt="Logo" />
                                </a>
                            </div>
                            <div className="hamburger_close">
                                <button className="hamburger_close_btn"><i className="fa-thin fa-times"></i></button>
                            </div>
                        </div>
                        <div className="offcanvas-text">
                            <p>Empowering businesses with personalized digital solutions to enhance customer satisfaction, boost loyalty, and drive growth—trusted by industry leaders.</p>
                        </div>
                        <div className="hamburger-infos">
                            <h5 className="hamburger-title">Contact Info</h5>
                            <div className="contact-info">
                                <div className="contact-item">
                                    <span className="subtitle">Phone</span>
                                    <a className="contact-link" href="tel:+918076096255">+91 807 609 6255</a>
                                </div>
                                <div className="contact-item">
                                    <span className="subtitle">Email</span>
                                    <a className="contact-link" href="mailto:info@dawkiinfotech.com">info@dawkiinfotech.com</a>
                                </div>
                                <div className="contact-item">
                                    <span className="subtitle">Location</span>
                                    <span className="contact-link">Layak ram Complex, B-222, Main Market Rd, Badarpur Village, Badarpur, New Delhi, Delhi 110044</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="hamburger-socials">
                        <h5 className="hamburger-title">Follow Us</h5>
                        <div className="social-links style-3">
                            <ul>
                                <li><a href="https://www.facebook.com/dawkiinfotech/" target="_blank" rel="noreferrer"><i className="fa-brands fa-facebook-f"></i></a></li>
                                <li><a href="https://www.instagram.com/dawki_infotech/" target="_blank" rel="noreferrer"><i className="fa-brands fa-instagram"></i></a></li>
                                <li><a href="https://x.com/DawkiInfotech" target="_blank" rel="noreferrer"><i className="fa-brands fa-x-twitter"></i></a></li>
                                <li><a href="https://www.linkedin.com/company/dawki-infotech-private-limited/posts/?feedView=all" target="_blank" rel="noreferrer"><i className="fa-brands fa-linkedin-in"></i></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hamburger Menu (Mobile) */}
            <div className="hamburger-area d-lg-none">
                <div className="hamburger_bg"></div>
                <div className="hamburger_wrapper">
                    <div className="hamburger_inner">
                        <div className="hamburger_top d-flex align-items-center justify-content-between">
                            <div className="hamburger_logo">
                                <a href="/" className="mobile_logo">
                                    <img src="/assets/images/header/demo/dawki_logo_transparent.png" alt="Logo" />
                                </a>
                            </div>
                            <div className="hamburger_close">
                                <button className="hamburger_close_btn"><i className="fa-thin fa-times"></i></button>
                            </div>
                        </div>
                        <div className="hamburger_menu">
                            <div className="mobile_menu"></div>
                        </div>
                        <div className="hamburger-infos">
                            <h5 className="hamburger-title">Contact Info</h5>
                            <div className="contact-info">
                                <div className="contact-item">
                                    <span className="subtitle">Phone</span>
                                    <a className="contact-link" href="tel:8076096255">+91 807 609 6255</a>
                                </div>
                                <div className="contact-item">
                                    <span className="subtitle">Email</span>
                                    <a className="contact-link" href="mailto:info@dawkiinfotech.com">info@dawkiinfotech.com</a>
                                </div>
                                <div className="contact-item">
                                    <span className="subtitle">Location</span>
                                    <span className="contact-link">Layak ram Complex, B-222, Main Market Rd, Badarpur Village, Badarpur, New Delhi, Delhi 110044</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="hamburger-socials">
                        <h5 className="hamburger-title">Follow Us</h5>
                        <div className="social-links style-3">
                            <ul>
                                <li><a href="https://www.facebook.com/" target="_blank" rel="noreferrer"><i className="fa-brands fa-facebook-f"></i></a></li>
                                <li><a href="https://www.instagram.com/" target="_blank" rel="noreferrer"><i className="fa-brands fa-instagram"></i></a></li>
                                <li><a href="https://x.com/DawkiInfotech" target="_blank" rel="noreferrer"><i className="fa-brands fa-x-twitter"></i></a></li>
                                <li><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer"><i className="fa-brands fa-linkedin-in"></i></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <header className="header-area header-1 header-absolute section-gap-x">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="header-wrapper">
                                <Logo />
                                <div className="menu-area d-none d-lg-inline-flex align-items-center">
                                    <Navigation />
                                </div>
                                <HeaderActions />
                                <MobileBar />
                            </div>
                        </div>
                    </div>
                </div>
                <SearchPopup />
            </header>

            <header className="header-area header-1 header-duplicate header-sticky section-gap-x">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="header-wrapper">
                                <Logo />
                                <div className="menu-area d-none d-lg-inline-flex align-items-center">
                                    <Navigation />
                                </div>
                                <HeaderActions />
                                <MobileBar />
                            </div>
                        </div>
                    </div>
                </div>
                <SearchPopup />
            </header>
        </>
    );
};

export default Header;
