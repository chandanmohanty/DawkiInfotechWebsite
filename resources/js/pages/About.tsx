import { Head, Link } from '@inertiajs/react';
import React from 'react';
import FrontendLayout from '@/layouts/FrontendLayout';
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'framer-motion';

/* ============================================================================
 * ClientLogoGrid — static grid where each cell auto-flips to a new logo
 * No marquee scrolling. Subtle, organic flip effect on random cells.
 * ============================================================================ */
const ALL_CLIENT_LOGOS = [3, 6, 7, 10, 11, 12, 13, 15, 17, 19, 20, 21, 22, 25, 27, 28, 30, 31];

const ClientLogoGrid: React.FC = () => {
    // Initial state — each cell shows logo at its own index
    const [cellLogos, setCellLogos] = React.useState<number[]>(() => ALL_CLIENT_LOGOS.map((logo) => logo));
    const reduced = useReducedMotion();

    React.useEffect(() => {
        if (reduced) return;
        // Every 1.6s, pick a random cell and flip it to a different random logo
        const interval = setInterval(() => {
            setCellLogos((prev) => {
                const next = [...prev];
                const cellIdx = Math.floor(Math.random() * next.length);
                let candidate = ALL_CLIENT_LOGOS[Math.floor(Math.random() * ALL_CLIENT_LOGOS.length)];
                // Avoid picking the same logo currently shown
                let attempts = 0;
                while (candidate === next[cellIdx] && attempts < 5) {
                    candidate = ALL_CLIENT_LOGOS[Math.floor(Math.random() * ALL_CLIENT_LOGOS.length)];
                    attempts++;
                }
                next[cellIdx] = candidate;
                return next;
            });
        }, 1600);
        return () => clearInterval(interval);
    }, [reduced]);

    return (
        <div className="dawki-logo-grid">
            {cellLogos.map((logoNum, cellIdx) => (
                <div className="dawki-logo-cell" key={cellIdx}>
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={logoNum}
                            src={`/assets/images/clients_logo/${logoNum}.jpg`}
                            alt={`Client ${logoNum}`}
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

/* ============================================================================
 * Local animation primitives — fade-up reveal + staggered list entrance
 * ============================================================================ */
const fadeUpVar: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] } },
};
const staggerContainerVar: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const staggerItemVar: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] } },
};

const RevealUp: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
    const reduced = useReducedMotion();
    if (reduced) return <div className={className}>{children}</div>;
    return (
        <motion.div className={className} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeUpVar}>
            {children}
        </motion.div>
    );
};

const StaggerWrap: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
    const reduced = useReducedMotion();
    if (reduced) return <div className={className}>{children}</div>;
    return (
        <motion.div className={className} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={staggerContainerVar}>
            {children}
        </motion.div>
    );
};

const StaggerCh: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
    const reduced = useReducedMotion();
    if (reduced) return <div className={className}>{children}</div>;
    return (
        <motion.div className={className} variants={staggerItemVar}>
            {children}
        </motion.div>
    );
};

/* ============================================================================
 * ProvenResultsSection — masonry grid of testimonial cards (videos + text)
 *   - Videos play on hover, pause + reset on leave
 *   - Cards rise/tilt into view on hover
 * ============================================================================ */
type Review = {
    type: 'video' | 'text';
    src?: string;        // for video
    poster?: string;     // for video
    name: string;
    quote?: string;      // for text
    location: string;
    color: string;
    initials: string;
};

const VideoCard: React.FC<{ r: Review }> = ({ r }) => {
    const ref = React.useRef<HTMLVideoElement>(null);
    const handleEnter = () => {
        const v = ref.current;
        if (!v) return;
        try {
            v.currentTime = 0;
            v.muted = false;          // unmute on hover so audio plays
            v.volume = 1;
            v.play().catch(() => {
                // browser blocked unmuted autoplay — fall back to muted playback
                if (v) { v.muted = true; v.play().catch(() => {}); }
            });
        } catch {}
    };
    const handleLeave = () => {
        const v = ref.current;
        if (!v) return;
        try { v.pause(); v.currentTime = 0; v.muted = true; } catch {}
    };
    // When the video metadata is ready, seek slightly past the start so each
    // video paints its own first frame as the thumbnail (works even if no
    // explicit poster image is provided).
    React.useEffect(() => {
        const v = ref.current;
        if (!v) return;
        const onMeta = () => {
            try {
                if (v.currentTime < 0.1) v.currentTime = 0.5;
            } catch {}
        };
        v.addEventListener('loadedmetadata', onMeta);
        return () => v.removeEventListener('loadedmetadata', onMeta);
    }, []);

    return (
        <div className="dawki-pr-card dawki-pr-card--video" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
            <div className="dawki-pr-video-wrap">
                <video
                    ref={ref}
                    className="dawki-pr-video"
                    loop
                    playsInline
                    muted
                    preload="metadata"
                    {...(r.poster ? { poster: r.poster } : {})}
                >
                    {/* #t=0.5 hint asks the browser to render a frame at 0.5s if no poster is set */}
                    <source src={`${r.src}#t=0.5`} type="video/mp4" />
                </video>
                <div className="dawki-pr-play">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg>
                </div>
            </div>
            <div className="dawki-pr-card-body">
                <div className="dawki-pr-card-tags">
                    <span className="dawki-pr-tag"><i>📍</i>{r.location}</span>
                </div>
                <div className="dawki-pr-card-author">
                    <div className="dawki-pr-avatar" style={{ background: r.color }}>{r.initials}</div>
                    <div>
                        <div className="dawki-pr-author-name">{r.name}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TextCard: React.FC<{ r: Review }> = ({ r }) => (
    <div className="dawki-pr-card dawki-pr-card--text">
        <div className="dawki-pr-card-tags">
            <span className="dawki-pr-tag"><i>📍</i>{r.location}</span>
        </div>
        <p className="dawki-pr-quote">{r.quote}</p>
        <div className="dawki-pr-card-author">
            <div className="dawki-pr-avatar" style={{ background: r.color }}>{r.initials}</div>
            <div>
                <div className="dawki-pr-author-name">{r.name}</div>
            </div>
        </div>
    </div>
);

const ProvenResultsSection: React.FC = () => {
    const reviews: Review[] = [
        // VIDEO 1
        {
            type: 'video',
            src: '/assets/images/about/review-video.mp4',
            name: 'Aarav Sharma',
            location: 'Delhi',
            color: '#3b82f6',
            initials: 'AS',
        },
        // TEXT
        {
            type: 'text',
            quote: 'The team at Dawki Infotech was committed and delivered quality work on time. Their ability to adapt to changes was impressive. With better communication on critical milestones, they can become an exceptional service provider.',
            name: 'Sophia Verma',
            location: 'Mumbai',
            color: '#10b981',
            initials: 'SV',
        },
        // TEXT
        {
            type: 'text',
            quote: 'The team was responsive and professional throughout. However, we felt that initial requirement gathering could have been more detailed to avoid minor revisions later. Improving this process would make collaboration even smoother.',
            name: 'Vivaan Kapoor',
            location: 'Bengaluru',
            color: '#a855f7',
            initials: 'VK',
        },
        // VIDEO 2
        {
            type: 'video',
            src: '/assets/images/about/review-video-2.mp4',
            name: 'Aditya Mehra',
            location: 'Hyderabad',
            color: '#a855f7',
            initials: 'AM',
        },
        // TEXT
        {
            type: 'text',
            quote: 'Dawki Infotech handled our complex project well and demonstrated strong problem-solving skills. The final product met expectations, but the documentation could have been more comprehensive for easier handover.',
            name: 'Ananya Iyer',
            location: 'Chennai',
            color: '#f97316',
            initials: 'AI',
        },
        // TEXT
        {
            type: 'text',
            quote: 'We were pleased with Dawki Infotech\u2019s professionalism and timely delivery. Their technical expertise is commendable. Clearer timelines when unexpected challenges arise would strengthen trust even further.',
            name: 'Arjun Desai',
            location: 'Pune',
            color: '#06b6d4',
            initials: 'AD',
        },
        // TEXT
        {
            type: 'text',
            quote: 'After launching with Dawki Infotech, our app crossed nearly 2 million downloads. For companies still exploring their options, we highly recommend considering them as a long-term tech partner.',
            name: 'Diya Patel',
            location: 'Ahmedabad',
            color: '#ec4899',
            initials: 'DP',
        },
        // VIDEO 3
        {
            type: 'video',
            src: '/assets/images/about/review-video-3.mp4',
            name: 'Mouumita banejree',
            location: 'Bengaluru',
            color: '#14b8a6',
            initials: 'KI',
        },
        // TEXT
        {
            type: 'text',
            quote: 'The entire team has been amazing, and their expertise has made the application look fantastic. They were always one step ahead, anticipating issues before they became problems.',
            name: 'Riya Joshi',
            location: 'Noida',
            color: '#fbbf24',
            initials: 'RJ',
        },
        // TEXT
        {
            type: 'text',
            quote: 'It has been a pleasure working with Dawki Infotech. The team is not only extremely versatile and competent but also very professional, courteous, and responsive.',
            name: 'Kabir Bhatia',
            location: 'Jaipur',
            color: '#a855f7',
            initials: 'KB',
        },
        // TEXT
        {
            type: 'text',
            quote: 'Dawki Infotech showcased exceptional professionalism and expertise, overcoming unforeseen challenges with agility and resilience. Highly recommended for serious projects.',
            name: 'Saanvi Rao',
            location: 'Lucknow',
            color: '#ef4444',
            initials: 'SR',
        },
        // TEXT
        {
            type: 'text',
            quote: 'Dawki Infotech helped us build a platform that scales beautifully. The handoff was smooth and post-launch support has been outstanding.',
            name: 'Rohan Gupta',
            location: 'Indore',
            color: '#6366f1',
            initials: 'RG',
        },
    ];
    const reduced = useReducedMotion();
    const Wrap: React.ElementType = reduced ? 'div' : motion.div;
    const wrapProps = reduced ? {} : { initial: 'hidden', whileInView: 'visible', viewport: { once: true, margin: '-60px' }, variants: staggerContainerVar };

    return (
        <section className="dawki-pr-section">
            <div className="dawki-pr-bg-orb dawki-pr-bg-orb--a"></div>
            <div className="dawki-pr-bg-orb dawki-pr-bg-orb--b"></div>
            <div className="container">
                <RevealUp>
                    <div className="dawki-pr-heading">
                        <h2 className="dawki-pr-title">PROVEN RESULTS</h2>
                        <p className="dawki-pr-sub">through Our Clients' Words</p>
                        <p className="dawki-pr-desc">
                            From concept to completion, we deliver excellence. Our agile services have fostered ongoing collaborations with leading enterprises across industries — from FinTech to Education.
                        </p>
                        <a href="#" className="dawki-pr-cta">Let's Explore Partnership Opportunities</a>
                        <div className="dawki-pr-stats">
                            <div className="dawki-pr-stat">
                                <span className="dawki-pr-stat-icon">⚡</span>
                                <div>
                                    <div className="dawki-pr-stat-num">3000+</div>
                                    <div className="dawki-pr-stat-label">Solutions Designed & Delivered</div>
                                </div>
                            </div>
                            <div className="dawki-pr-stat">
                                <span className="dawki-pr-stat-icon">📈</span>
                                <div>
                                    <div className="dawki-pr-stat-num">35+</div>
                                    <div className="dawki-pr-stat-label">Industries Mastered</div>
                                </div>
                            </div>
                            <div className="dawki-pr-stat">
                                <span className="dawki-pr-stat-icon">⭐</span>
                                <div>
                                    <div className="dawki-pr-stat-num">4.7/5</div>
                                    <div className="dawki-pr-stat-label">Clutch Rating</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </RevealUp>

                <Wrap className="dawki-pr-grid" {...wrapProps}>
                    {reviews.map((r, i) => {
                        const inner = r.type === 'video' ? <VideoCard r={r} /> : <TextCard r={r} />;
                        if (reduced) return <div key={i}>{inner}</div>;
                        return <motion.div key={i} variants={staggerItemVar}>{inner}</motion.div>;
                    })}
                </Wrap>
            </div>
        </section>
    );
};

const About: React.FC = () => {
    const [activeIndex, setActiveIndex] = React.useState<number>(0);
    React.useEffect(() => {
        // Handle data-bg-image
        const bgSelector = document.querySelectorAll("[data-bg-image]");
        bgSelector.forEach((element) => {
            const el = element as HTMLElement;
            const bgImage = el.getAttribute("data-bg-image");
            if (bgImage) {
                el.style.backgroundImage = `url(${bgImage})`;
            }
        });

        const progressContainers = document.querySelectorAll(".tj-progress");

        if (progressContainers?.length) {
            progressContainers.forEach(progressContainer => {
                const targetedProgressBar =
                    progressContainer.querySelector(".tj-progress-bar") as HTMLElement;
                const completedPercent =
                    parseInt(targetedProgressBar?.getAttribute("data-percent") || "0", 10);

                // Trigger animation when the element comes into view
                const observer = new IntersectionObserver(
                    entries => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                // Animate the progress bar
                                if (targetedProgressBar) {
                                    targetedProgressBar.style.transition = "width 2s ease-out";
                                    targetedProgressBar.style.width = `${completedPercent}%`;
                                }

                                // Animate the percentage text
                                const percentageText = progressContainer.querySelector(
                                    ".tj-progress-percent"
                                );
                                if (percentageText) {
                                    let currentPercent = 0;
                                    const percentageTextEl = percentageText as HTMLElement;

                                    // Only animate if not already animated/showing
                                    if (percentageText.textContent === "0%" || percentageText.textContent !== `${completedPercent}%`) {
                                        const interval = setInterval(() => {
                                            currentPercent++;
                                            percentageTextEl.textContent = `${currentPercent}%`;

                                            if (currentPercent >= completedPercent) {
                                                clearInterval(interval); // Stop the animation
                                            }
                                        }, 15); // Adjust the interval for animation speed
                                    }
                                }
                            }
                        });
                    },
                    {
                        root: null, // Observing the viewport
                        threshold: [0.3, 0.9], // Progress triggers based on visibility
                    }
                );
                observer.observe(progressContainer);
            });
        }

        // Initialize Swiper for Client Slider (Marquee)
        const Swiper = (window as any).Swiper;
        if (Swiper && document.querySelector('.client-slider-1')) {
            const swiperInstance = new Swiper('.client-slider-1', {
                slidesPerView: 5,
                spaceBetween: 30,
                loop: true,
                speed: 6000,
                autoplay: {
                    delay: 0,
                    disableOnInteraction: false,
                },
                breakpoints: {
                    0: {
                        slidesPerView: 2,
                    },
                    576: {
                        slidesPerView: 3,
                    },
                    768: {
                        slidesPerView: 4,
                    },
                    992: {
                        slidesPerView: 5,
                    },
                    1200: {
                        slidesPerView: 6,
                    },
                },
            });

            // Force linear easing for continuous effect
            const wrapper = document.querySelector('.client-slider-1 .swiper-wrapper') as HTMLElement;
            if (wrapper) {
                wrapper.style.transitionTimingFunction = 'linear';
            }
        }

    }, []);

    return (
        <FrontendLayout>
            <Head title="About Us | Dawki Infotech" />
            <main id="primary" className="site-main">

                <div className="space-for-header"></div>
                {/* start: About Hero Section (bg image with About Company content) */}
                <section className="dawki-about-hero">
                    <div className="dawki-about-hero-bg"></div>
                    <div className="dawki-about-hero-overlay"></div>
                    <div className="container">
                        <div className="dawki-about-hero-content">
                            <span className="dawki-about-hero-badge">
                                <span className="dawki-about-hero-badge-dot"></span>
                                Who We Are
                            </span>
                            <h1 className="dawki-about-hero-title">
                                Empowering Businesses Through <span>Smart Technology.</span>
                            </h1>
                            <p className="dawki-about-hero-desc">
                                Founded with the vision to empower businesses through technology, Dawki Infotech has evolved as a trusted name in the IT industry. With years of experience, we bring strategic consulting and advanced IT solutions that align perfectly with business objectives.
                            </p>
                            <div className="dawki-about-hero-cards">
                                <div className="dawki-about-hero-card">
                                    <div className="dawki-about-hero-card-icon">
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="13.5" cy="6.5" r="2.5"/>
                                            <circle cx="19" cy="13" r="2.5"/>
                                            <circle cx="6" cy="12" r="2.5"/>
                                            <circle cx="10" cy="20" r="2.5"/>
                                            <path d="M2 22l5-3.5"/>
                                            <path d="M22 22L9 9"/>
                                            <path d="M16 4l-2.5 2.5"/>
                                        </svg>
                                    </div>
                                    <h3 className="dawki-about-hero-card-title">Great Design</h3>
                                    <p className="dawki-about-hero-card-desc">Our creative team delivers modern and user-friendly designs, ensuring every project reflects innovation and business growth.</p>
                                </div>
                                <div className="dawki-about-hero-card">
                                    <div className="dawki-about-hero-card-icon">
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                                        </svg>
                                    </div>
                                    <h3 className="dawki-about-hero-card-title">Best Support</h3>
                                    <p className="dawki-about-hero-card-desc">We provide reliable technical support and timely solutions, making sure our clients always have peace of mind.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* end: About Hero Section */}

                {/* start: Choose Section */}
                <section id="choose" className="tj-choose-section section-gap">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="sec-heading-wrap">
                                    <span className="sub-title wow fadeInUp" data-wow-delay=".3s"><i className="tji-box"></i>Choose the
                                        Best</span>
                                    <div className="heading-wrap-content">
                                        <div className="sec-heading">
                                            <h2 className="sec-title"><strong className="gradient-text-blue">Empowering Business</strong> <strong>with
                                                Expertise.</strong></h2>
                                        </div>
                                        <div className="btn-wrap wow fadeInUp" data-wow-delay=".6s">
                                            <a className="tj-primary-btn" href="contact.html">
                                                <span className="btn-text"><span>Request a Call</span></span>
                                                <span className="btn-icon"><i className="tji-arrow-right-long"></i></span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row row-gap-4 rightSwipeWrap">
                            <div className="col-lg-4">
                                <div className="choose-box right-swipe">
                                    <div className="choose-content">
                                        <div className="choose-icon">
                                            <i className="tji-innovative"></i>
                                        </div>
                                        <h4 className="title gradient-text">Innovative Solutions</h4>
                                        <p className="desc">We stay ahead of the curve, leveraging cutting-edge technologies and strategies to
                                            keep you competitive in a marketplace.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="choose-box right-swipe">
                                    <div className="choose-content">
                                        <div className="choose-icon">
                                            <i className="tji-award"></i>
                                        </div>
                                        <h4 className="title gradient-text">Award-Winning</h4>
                                        <p className="desc">Recognized by industry leaders, our award-winning team has a proven record of
                                            delivering
                                            excellence across projects.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="choose-box right-swipe">
                                    <div className="choose-content">
                                        <div className="choose-icon">
                                            <i className="tji-support"></i>
                                        </div>
                                        <h4 className="title gradient-text">Expert Team</h4>
                                        <p className="desc">Our team is always available to address your concerns, providing quick and effective
                                            solution to keep your business.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* end: Choose Section */}

                {/* start: About Section */}
                <section className="tj-about-section-2 section-gap section-gap-x">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-6 col-lg-6 order-lg-1 order-2">
                                <div className="about-img-area style-2 wow fadeInLeft" data-wow-delay=".3s">
                                    <div className="about-img overflow-hidden">
                                        <img data-speed=".8" src="assets/images/about/about-5.webp" alt="" />
                                    </div>
                                    <div className="box-area style-2">
                                        <div className="progress-box wow fadeInUp" data-wow-delay=".3s">
                                            <h4 className="title">Business Progress</h4>
                                            <ul className="tj-progress-list">
                                                <li>
                                                    <h6 className="tj-progress-title">Revenue</h6>
                                                    <div className="tj-progress">
                                                        <span className="tj-progress-percent">82%</span>
                                                        <div className="tj-progress-bar" data-percent="82">
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <h6 className="tj-progress-title">Satisfaction</h6>
                                                    <div className="tj-progress">
                                                        <span className="tj-progress-percent">90%</span>
                                                        <div className="tj-progress-bar" data-percent="90">
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-6 col-lg-6 order-lg-2 order-1">
                                <div className="about-content-area">
                                    <div className="sec-heading">
                                        <span className="sub-title wow fadeInUp" data-wow-delay=".3s"><i className="tji-box"></i>Get to Know
                                            Us</span>
                                        <h2 className="sec-title title-anim">Driving Innovation and Excellence for Sustainable Corporate Success
                                            <span>Worldwide.</span>
                                        </h2>
                                    </div>
                                </div>
                                <div className="about-bottom-area">
                                    <div className="mission-vision-box wow fadeInLeft" data-wow-delay=".5s">
                                        <h4 className="title">Our Mission</h4>
                                        <p className="desc">Our mission is empower businesses through innovate best solution, exceptional
                                            service.
                                        </p>
                                        <ul className="list-items">
                                            <li><i className="tji-list"></i>Innovation & Excellence</li>
                                            <li><i className="tji-list"></i>Exceptional Customer</li>
                                            <li><i className="tji-list"></i>Business Growth</li>
                                        </ul>
                                    </div>
                                    <div className="mission-vision-box wow fadeInRight" data-wow-delay=".5s">
                                        <h4 className="title">Our Vision</h4>
                                        <p className="desc">Our vision is to become a global leader in providing transformative business
                                            solutions.
                                        </p>
                                        <ul className="list-items">
                                            <li><i className="tji-list"></i>Global Leadership</li>
                                            <li><i className="tji-list"></i>Transformative Impact</li>
                                            <li><i className="tji-list"></i>Sustainable Success</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="about-btn-area wow fadeInUp" data-wow-delay=".6s">
                                    <a className="tj-primary-btn" href="about.html">
                                        <span className="btn-text"><span>Learn More About Us</span></span>
                                        <span className="btn-icon"><i className="tji-arrow-right-long"></i></span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-shape-1">
                        <img src="assets/images/shape/pattern-2.svg" alt="" />
                    </div>
                    <div className="bg-shape-2">
                        <img src="assets/images/shape/pattern-3.svg" alt="" />
                    </div>
                </section>
                {/* end: About Section */}

                {/* ========================================================
                 * NEW: Trusted by Clients — Top Ratings showcase
                 * ======================================================== */}
                <section className="dawki-ratings">
                    <div className="container">
                        <RevealUp>
                            <div className="dawki-ratings-heading">
                                <span className="dawki-ratings-pill">
                                    <span className="dawki-values-dot"></span>
                                    Reviews & Recognition
                                </span>
                                <h2 className="dawki-ratings-title">
                                    Trusted by Clients with <span>Top Ratings</span>
                                </h2>
                                <p className="dawki-ratings-subtitle">
                                    Independent platforms recognize our consistent quality, reliability, and client satisfaction.
                                </p>
                            </div>
                        </RevealUp>

                        {/* Single composite image with all trust ratings */}
                        <RevealUp>
                            <div className="dawki-ratings-image-wrap">
                                <img
                                    loading="lazy"
                                    decoding="async"
                                    src="/assets/images/logos/trusted-logoss.png"
                                    alt="Trusted by clients with top ratings"
                                    className="dawki-ratings-image"
                                />
                            </div>
                        </RevealUp>
                    </div>
                </section>

                {/* ========================================================
                 * NEW: Core Values Section — 4 cards with stagger reveal
                 * ======================================================== */}
                <section className="dawki-values">
                    <div className="container">
                        <RevealUp>
                            <div className="dawki-values-heading">
                                <span className="dawki-values-pill">
                                    <span className="dawki-values-dot"></span>
                                    Our Core Values
                                </span>
                                <h2 className="dawki-values-title">
                                    Principles That <span>Drive Everything</span> We Build
                                </h2>
                                <p className="dawki-values-subtitle">
                                    The foundation of our culture — these values shape every decision, every line of code, and every client relationship.
                                </p>
                            </div>
                        </RevealUp>

                        <StaggerWrap className="dawki-values-grid">
                            {[
                                {
                                    icon: (
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 1 4 12.7c-.6.5-1 1.3-1 2.1V18H9v-1.2c0-.8-.4-1.6-1-2.1A7 7 0 0 1 12 2z"/>
                                        </svg>
                                    ),
                                    title: 'Innovation First',
                                    desc: 'We challenge convention and explore what\u2019s next — turning emerging tech into real-world business advantages.',
                                },
                                {
                                    icon: (
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>
                                        </svg>
                                    ),
                                    title: 'Integrity Always',
                                    desc: 'Transparency, honesty, and accountability — we say what we mean and deliver what we promise.',
                                },
                                {
                                    icon: (
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
                                        </svg>
                                    ),
                                    title: 'Excellence in Craft',
                                    desc: 'Pride in every pixel and every line of code — we build for performance, scalability, and beauty.',
                                },
                                {
                                    icon: (
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                        </svg>
                                    ),
                                    title: 'True Partnership',
                                    desc: 'We don\u2019t just deliver projects — we become an extension of your team, invested in your long-term growth.',
                                },
                            ].map((v, i) => (
                                <StaggerCh key={i} className="dawki-values-card">
                                    <div className="dawki-values-card-icon">{v.icon}</div>
                                    <h3 className="dawki-values-card-title">{v.title}</h3>
                                    <p className="dawki-values-card-desc">{v.desc}</p>
                                </StaggerCh>
                            ))}
                        </StaggerWrap>
                    </div>
                </section>

                {/* ========================================================
                 * NEW: Our Journey — Timeline with milestones
                 * ======================================================== */}
                <section className="dawki-journey">
                    <div className="container">
                        <RevealUp>
                            <div className="dawki-journey-heading">
                                <span className="dawki-journey-pill">
                                    <span className="dawki-values-dot"></span>
                                    Our Journey
                                </span>
                                <h2 className="dawki-journey-title">
                                    A Decade of <span>Building & Scaling</span>
                                </h2>
                                <p className="dawki-journey-subtitle">
                                    From a small team with big ideas to a global IT partner — every milestone shaped who we are today.
                                </p>
                            </div>
                        </RevealUp>

                        <StaggerWrap className="dawki-timeline">
                            {[
                                { year: '2022', title: 'The Beginning', desc: 'Dawki Infotech founded with a vision to empower businesses through smart technology.', img: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80' },
                                { year: '2023', title: 'First 100 Clients', desc: 'Reached our first major milestone — 100+ businesses trusting us with their digital transformation.', img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80' },
                                { year: '2024', title: 'Going Global', desc: 'Expanded operations across 10+ countries, building solutions for international markets.', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80' },
                                { year: '2025', title: 'AI & Cloud Era', desc: 'Pioneered AI-driven solutions and cloud-native development for next-generation enterprise needs.', img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80' },
                                { year: 'Today', title: '500+ Projects Shipped', desc: 'Trusted by startups and enterprises worldwide — and we\u2019re just getting started.', img: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80' },
                            ].map((m, i) => (
                                <StaggerCh key={i} className={`dawki-timeline-item dawki-timeline-item--${i % 2 === 0 ? 'left' : 'right'}`}>
                                    <div className="dawki-timeline-content">
                                        <span className="dawki-timeline-year">{m.year}</span>
                                        <h3 className="dawki-timeline-title">{m.title}</h3>
                                        <p className="dawki-timeline-desc">{m.desc}</p>
                                    </div>
                                    <div className="dawki-timeline-marker">
                                        <span className="dawki-timeline-dot"></span>
                                    </div>
                                    <div className="dawki-timeline-image">
                                        <img loading="lazy" decoding="async" src={m.img} alt={m.title} />
                                        <div className="dawki-timeline-image-glow"></div>
                                    </div>
                                </StaggerCh>
                            ))}
                        </StaggerWrap>
                    </div>
                </section>

                {/* ========================================================
                 * NEW: Our Core Values — image left + 4 values grid right
                 * ======================================================== */}
                <section className="dawki-corevalues">
                    <div className="container">
                        <div className="dawki-corevalues-row">
                            {/* Left: image */}
                            <RevealUp className="dawki-corevalues-imgwrap">
                                <div className="dawki-corevalues-img">
                                    <img
                                        loading="lazy"
                                        decoding="async"
                                        src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=85"
                                        alt="Team working together — collaboration and shared values"
                                    />
                                    <div className="dawki-corevalues-img-overlay"></div>
                                </div>
                            </RevealUp>

                            {/* Right: heading + 4 values */}
                            <div className="dawki-corevalues-content">
                                <RevealUp>
                                    <span className="dawki-corevalues-pill">
                                        <span className="dawki-values-dot"></span>
                                        Our Foundation
                                    </span>
                                    <h2 className="dawki-corevalues-title">Our <span>Core Values</span></h2>
                                    <p className="dawki-corevalues-desc">
                                        At Dawki Infotech, we embrace a well-established set of cultural and professional values which represent our highest aspirations for how we engage as colleagues, fellows, alumni, partners, and board members.
                                    </p>
                                </RevealUp>

                                <StaggerWrap className="dawki-corevalues-grid">
                                    {[
                                        {
                                            title: 'Respect',
                                            desc: 'Set trends for your peers and the industry in general to follow.',
                                            icon: (
                                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M11 17l-5-5 5-5"/><path d="M18 17l-5-5 5-5"/>
                                                </svg>
                                            ),
                                        },
                                        {
                                            title: 'Exceptional Value',
                                            desc: 'Understand and exceed customer\u2019s expectations all the time.',
                                            icon: (
                                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                                </svg>
                                            ),
                                        },
                                        {
                                            title: 'Authenticity',
                                            desc: 'Be sincere, honest, and open in dealings to ensure trustworthiness.',
                                            icon: (
                                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>
                                                </svg>
                                            ),
                                        },
                                        {
                                            title: 'Leadership',
                                            desc: 'Lead by example, drive innovation, and create positive change across teams.',
                                            icon: (
                                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
                                                    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
                                                    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
                                                    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
                                                </svg>
                                            ),
                                        },
                                    ].map((v, i) => (
                                        <StaggerCh key={i} className="dawki-corevalue-item">
                                            <div className="dawki-corevalue-icon">{v.icon}</div>
                                            <div className="dawki-corevalue-text">
                                                <h4 className="dawki-corevalue-title">{v.title}</h4>
                                                <p className="dawki-corevalue-desc">{v.desc}</p>
                                            </div>
                                        </StaggerCh>
                                    ))}
                                </StaggerWrap>
                            </div>
                        </div>
                    </div>
                </section>

                {/* start: Client Section (Static grid with auto-flipping logos) */}
                <section className="dawki-clients section-gap">
                    <div className="container">
                        <RevealUp>
                            <div className="dawki-clients-heading">
                                <span className="dawki-clients-pill">
                                    <span className="dawki-values-dot"></span>
                                    Trusted By 500+ Businesses
                                </span>
                                <h2 className="dawki-clients-title">
                                    From Emerging Startups to Industry Leaders, <span>We Drive Digital Innovation</span>
                                </h2>
                            </div>
                        </RevealUp>
                        {/* Static logo grid — each cell auto-flips to a different logo every ~1.6s */}
                        <ClientLogoGrid />
                    </div>
                </section>
                {/* end: Client Section */}


                {/* start: Team Section */}
                <section className="tj-team-section-3 section-gap section-gap-x">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div>
                                    <h2 className="sec-title align-center">Acknowledged Worldwide for <br /><strong className="gradient-text-blue">Exceptional Performance</strong></h2>
                                    <br />
                                    <h5>
                                        We take pride in being consistently featured and officially certified by some of the most respected and recognized authorities across the globe, reflecting our unwavering commitment to quality, trust, and excellence in everything we do.
                                    </h5>
                                    <br />
                                </div>
                            </div>
                        </div>
                        <div className="row leftSwipeWrap">

                            <div className="col-lg-4 col-sm-6">
                                <div className="team-item left-swipe">
                                    <div className="team-img">
                                        <div className="team-img-inner">
                                            <img src="assets/images/award/g1.png" alt="" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 col-sm-6">
                                <div className="team-item left-swipe">
                                    <div className="team-img">
                                        <div className="team-img-inner">
                                            <img src="assets/images/award/g2.png" alt="" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-sm-6">
                                <div className="team-item left-swipe">
                                    <div className="team-img">
                                        <div className="team-img-inner">
                                            <img src="assets/images/award/g3.png" alt="" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-sm-6">
                                <div className="team-item left-swipe">
                                    <div className="team-img">
                                        <div className="team-img-inner">
                                            {/* <img src="assets/images/team/team-4.webp" alt="" /> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-shape-1">
                        <img src="assets/images/shape/pattern-2.svg" alt="" />
                    </div>
                    <div className="bg-shape-2">
                        <img src="assets/images/shape/pattern-3.svg" alt="" />
                    </div>
                </section>
                {/* end: Team Section */}

                {/* ========================================================
                 * NEW: Proven Results — masonry grid (videos + text reviews)
                 * ======================================================== */}
                <ProvenResultsSection />

                {/* ========================================================
                 * NEW: Testimonials — Google review cards (continuous marquee)
                 * ======================================================== */}
                <section className="dawki-about-testimonials">
                    <div className="container">
                        <RevealUp>
                            <div className="dawki-about-testimonials-heading">
                                <span className="dawki-about-testimonials-pill">
                                    <span className="dawki-values-dot"></span>
                                    Client Voices
                                </span>
                                <h2 className="dawki-about-testimonials-title">
                                    <span>Testimonials</span>
                                </h2>
                                <p className="dawki-about-testimonials-subtitle">
                                    Real feedback from real clients — straight from verified Google reviews.
                                </p>
                            </div>
                        </RevealUp>
                    </div>
                    {/* Google review cards marquee */}
                    {(() => {
                        const testimonials = [
                            { name: 'Sophia Martinez', des: 'Director of Operations, BrightPath Consulting', text: 'The team at Dawki Infotech was committed and delivered quality work on time. Their ability to adapt to changes was impressive. That said, we would appreciate more proactive updates during critical milestones to ensure complete alignment. With better communication, they can become an exceptional service provider.', color: '#3b82f6' },
                            { name: 'Michael Anderson', des: 'CEO, Anderson Global Solutions', text: 'The team was responsive and professional throughout. However, we felt that initial requirement gathering could have been more detailed to avoid minor revisions later. Improving this process would make collaboration even smoother.', color: '#10b981' },
                            { name: 'David Thompson', des: 'CTO, InnovateX Technologies', text: 'Dawki Infotech handled our complex project well and demonstrated strong problem-solving skills. The final product met expectations, but the documentation could have been more comprehensive for easier handover. Enhancing this aspect would add significant value. Overall, a reliable and skilled team worth working with.', color: '#a855f7' },
                            { name: 'Guy Hawkins', des: 'Managing Partner, Wilson & Co. Enterprises', text: 'We were pleased with Dawki Infotech\u2019s professionalism and timely delivery. Their technical expertise is commendable. One area for improvement is providing clearer timelines when unexpected challenges arise. Transparency in such cases would strengthen trust even further. A solid partner for IT solutions.', color: '#ec4899' },
                        ];
                        const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
                        return (
                            <div className="google-reviews-marquee">
                                <div className="google-reviews-track">
                                    {[...testimonials, ...testimonials].map((item, idx) => (
                                        <div className="google-review-card" key={`at-${idx}`}>
                                            <div className="google-review-header">
                                                <div className="google-review-avatar" style={{ background: item.color }}>{initials(item.name)}</div>
                                                <div className="google-review-meta">
                                                    <h4 className="google-review-name">{item.name}</h4>
                                                    <span className="google-review-time">{item.des}</span>
                                                </div>
                                                <span className="google-review-source" aria-label="Google" title="Google">
                                                    <svg width="22" height="22" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                                        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                                                        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                                                        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                                                        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
                                                    </svg>
                                                </span>
                                            </div>
                                            <div className="google-review-rating">
                                                <span className="google-stars" aria-label="5 stars">
                                                    <i className="gr-star"></i>
                                                    <i className="gr-star"></i>
                                                    <i className="gr-star"></i>
                                                    <i className="gr-star"></i>
                                                    <i className="gr-star"></i>
                                                </span>
                                                <span className="google-verified" title="Verified" aria-label="Verified">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#1a73e8" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L9.91 4.09 7 4l-.91 2.91L4 9l1.09 2.09L4 13l2.09 0.91L7 16l2.91-.09L12 18l2.09-2.09L17 16l.91-2.91L20 13l-1.09-2.09L20 9l-2.09-0.91L17 4l-2.91 0.09L12 2zm-1.5 13.5l-3-3 1.41-1.41L10.5 12.67l4.59-4.59 1.41 1.41L10.5 15.5z"/></svg>
                                                </span>
                                            </div>
                                            <p className="google-review-text">{item.text}</p>
                                            <Link href="/contact" className="google-review-readmore">Read more</Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })()}
                </section>

                {/* start: Faq Section */}
                <section className="tj-faq-section section-gap">
                    <div className="container">
                        <div className="row justify-content-between">
                            <div className="col-lg-4">
                                <div className="content-wrap">
                                    <div className="sec-heading">
                                        <span className="sub-title wow fadeInUp" data-wow-delay=".3s"><i className="tji-box"></i>Common
                                            Questions</span>
                                        <h2 className="sec-title">Need <span className="gradient-text-blue">Help?</span> Start Here...</h2>
                                    </div>
                                    <p className="desc wow fadeInUp" data-wow-delay=".6s">We’re here to guide you at every <br />
                                        step—leveraging modern technologies, <br />
                                        expert insights, and proven strategies <br />
                                        to deliver real business results. </p>
                                    <div className="wow fadeInUp" data-wow-delay=".8s">
                                        <a className="tj-primary-btn" href="contact.html">
                                            <span className="btn-text"><span>Request a Call</span></span>
                                            <span className="btn-icon"><i className="tji-arrow-right-long"></i></span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-8">
                                <div className="accordion tj-faq" id="faqOne">
                                    {[
                                        {
                                            id: "faq-1",
                                            question: "What is Dawki Infotech?",
                                            answer: "Dawki Infotech Pvt. Ltd. is a technology-driven IT solutions company specializing in custom software development, web and mobile app development, UI/UX design, cloud solutions, and digital transformation services for businesses of all sizes."
                                        },
                                        {
                                            id: "faq-2",
                                            question: "How do I get started with Corporate Business?",
                                            answer: "Getting started is easy! Simply reach out to us through our contact form or give us a call, and we’ll schedule a consultation to discuss your project and how we can best assist you. Our team keeps you informed throughout the process, ensuring quality control and timely delivery."
                                        },
                                        {
                                            id: "faq-3",
                                            question: "What industries does Dawki Infotech serve?",
                                            answer: "We work across multiple industries including healthcare, education, e-commerce, wellness, fintech, hospitality, logistics, manufacturing, and emerging startups."
                                        },
                                        {
                                            id: "faq-4",
                                            question: "What makes Dawki Infotech different from other IT companies?",
                                            answer: "Our approach blends cutting-edge technology, user-focused design, transparent communication, and long-term partnership. We ensure every project is handled with clarity, accountability, and measurable value."
                                        },
                                        {
                                            id: "faq-6",
                                            question: "Does Dawki Infotech work with startups as well as enterprises?",
                                            answer: "Yes. We support startups with MVP development, product strategy, and scaling plans—while also delivering robust enterprise-grade solutions for large organizations."
                                        },
                                        {
                                            id: "faq-7",
                                            question: "How does Dawki Infotech ensure project quality?",
                                            answer: "We follow strict development standards, agile methodologies, multi-stage testing, code reviews, and maintain continuous client communication to ensure top-quality delivery."
                                        },
                                        {
                                            id: "faq-8",
                                            question: "Does Dawki Infotech offer post-project support?",
                                            answer: "Yes. We provide dedicated maintenance, updates, technical support, and scalable enhancements to ensure long-term success."
                                        }
                                    ].map((item, index) => (
                                        <div key={item.id} className={`accordion-item wow fadeInUp ${activeIndex === index ? 'active' : ''}`} data-wow-delay={`.${index + 3}s`}>
                                            <button
                                                className={`faq-title ${activeIndex !== index ? 'collapsed' : ''}`}
                                                type="button"
                                                onClick={() => setActiveIndex(activeIndex === index ? -1 : index)}
                                                aria-expanded={activeIndex === index}
                                            >
                                                {item.question}
                                            </button>
                                            <div
                                                id={item.id}
                                                className={`collapse ${activeIndex === index ? 'show' : ''}`}
                                                style={{ display: activeIndex === index ? 'block' : 'none' }}
                                            >
                                                <div className="accordion-body faq-text">
                                                    <p>{item.answer}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* end: Faq Section */}

                {/* start: Cta Section */}
                <section className="tj-cta-section">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="cta-area">
                                    <div className="cta-content">
                                        <h2 className="title title-anim">Let’s Build Future Together.</h2>
                                        <div className="cta-btn wow fadeInUp" data-wow-delay=".6s">
                                            <a className="tj-primary-btn btn-dark" href="contact.html">
                                                <span className="btn-text"><span>Get Started Now</span></span>
                                                <span className="btn-icon"><i className="tji-arrow-right-long"></i></span>
                                            </a>
                                        </div>
                                    </div>
                                    <div className="cta-img">
                                        <img src="assets/images/cta/footer_cta.jpg" alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* end: Cta Section */}
            </main>
        </FrontendLayout>
    );
};

export default About;
