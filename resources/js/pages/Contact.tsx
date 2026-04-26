import { Head, Link, useForm, usePage } from '@inertiajs/react';
import FrontendLayout from '@/layouts/FrontendLayout';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'framer-motion';

/* ============================================================================
 * ContactClientFlipGrid — auto-flipping client logo grid (smaller version)
 * ============================================================================ */
const CONTACT_LOGOS = [3, 6, 7, 10, 11, 12, 13, 15, 17, 19, 20, 21, 22, 25, 27, 28];

const ContactClientFlipGrid: React.FC = () => {
    const [cellLogos, setCellLogos] = useState<number[]>(() => CONTACT_LOGOS.slice(0, 8));
    const reduced = useReducedMotion();

    useEffect(() => {
        if (reduced) return;
        const interval = setInterval(() => {
            setCellLogos((prev) => {
                const next = [...prev];
                const cellIdx = Math.floor(Math.random() * next.length);
                let candidate = CONTACT_LOGOS[Math.floor(Math.random() * CONTACT_LOGOS.length)];
                let attempts = 0;
                while (candidate === next[cellIdx] && attempts < 5) {
                    candidate = CONTACT_LOGOS[Math.floor(Math.random() * CONTACT_LOGOS.length)];
                    attempts++;
                }
                next[cellIdx] = candidate;
                return next;
            });
        }, 1500);
        return () => clearInterval(interval);
    }, [reduced]);

    return (
        <div className="dawki-contact-flipgrid">
            {cellLogos.map((logoNum, cellIdx) => (
                <div className="dawki-contact-flipcell" key={cellIdx}>
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
                            transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                        />
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
};

/* Animation primitives */
const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] } },
};

const Reveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className, delay = 0 }) => {
    const reduced = useReducedMotion();
    if (reduced) return <div className={className}>{children}</div>;
    return (
        <motion.div className={className} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={fadeUp} transition={{ delay }}>
            {children}
        </motion.div>
    );
};

/* ============================================================================
 * Contact Page — modern split layout (hero+logos LEFT, form RIGHT)
 * ============================================================================ */
export default function Contact() {
    const { props } = usePage<{ flash?: { success?: string } }>();
    const flashSuccess = props.flash?.success;

    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        name: '',
        email: '',
        phone: '',
        help_type: 'software',
        message: '',
    });

    // Local helper kept for the existing JSX that toggles option pills
    const helpType = data.help_type;
    const setHelpType = (id: string) => setData('help_type', id);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/contact', {
            preserveScroll: true,
            onSuccess: () => reset('name', 'email', 'phone', 'message'),
        });
    };

    useEffect(() => {
        // Handle data-bg-image (legacy)
        const bgSelector = document.querySelectorAll('[data-bg-image]');
        bgSelector.forEach((element) => {
            const el = element as HTMLElement;
            const bgImage = el.getAttribute('data-bg-image');
            if (bgImage) {
                el.style.backgroundImage = `url(${bgImage})`;
            }
        });
    }, []);

    return (
        <FrontendLayout>
            <Head title="Contact Us — Dawki Infotech" />

            <main id="primary" className="site-main">
                <div className="space-for-header"></div>

                {/* ========================================================
                 * Top Banner — bg image hero (like Home/About)
                 * ======================================================== */}
                <section className="dawki-contact-banner">
                    <div className="dawki-contact-banner-bg"></div>
                    <div className="dawki-contact-banner-overlay"></div>
                    <div className="container">
                        <Reveal>
                            <div className="dawki-contact-banner-content">
                                <span className="dawki-contact-banner-pill">
                                    <span className="dawki-contact-dot"></span>
                                    We'd Love To Hear From You
                                </span>
                                <h1 className="dawki-contact-banner-title">
                                    Talk to a Human, <span>Not a Form</span>
                                </h1>
                                <p className="dawki-contact-banner-subtitle">
                                    Reach out to our team for a free consultation. We respond within 24 hours with a tailored plan and honest pricing — no obligations, no spam.
                                </p>
                                <div className="dawki-contact-banner-meta">
                                    <span><strong>⚡</strong> 24-hour response</span>
                                    <span className="dawki-contact-banner-divider"></span>
                                    <span><strong>🔒</strong> 100% confidential</span>
                                    <span className="dawki-contact-banner-divider"></span>
                                    <span><strong>💬</strong> Free consultation</span>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </section>

                {/* ========================================================
                 * Contact Hero — Split layout (LEFT: image + logos, RIGHT: form)
                 * ======================================================== */}
                <section className="dawki-contact-hero">
                    <div className="container">
                        <div className="dawki-contact-hero-grid">

                            {/* LEFT — Image + trust + logo grid */}
                            <div className="dawki-contact-left">
                                <Reveal>
                                    <span className="dawki-contact-pill">
                                        <span className="dawki-contact-dot"></span>
                                        Get In Touch
                                    </span>
                                    <h1 className="dawki-contact-title">
                                        Let's Build Something <span>Great Together</span>
                                    </h1>
                                    <p className="dawki-contact-subtitle">
                                        Tell us about your project — we'll respond within 24 hours with a tailored plan and free quote.
                                    </p>
                                </Reveal>

                                <Reveal delay={0.15}>
                                    <div className="dawki-contact-image">
                                        <img
                                            loading="lazy"
                                            decoding="async"
                                            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=85"
                                            alt="Team collaboration"
                                        />
                                        <div className="dawki-contact-image-glow"></div>
                                    </div>
                                </Reveal>

                                <Reveal delay={0.25}>
                                    <div className="dawki-contact-trusted">
                                        <p className="dawki-contact-trusted-label">
                                            <span className="dawki-contact-dot dawki-contact-dot--small"></span>
                                            Trusted by 500+ companies worldwide
                                        </p>
                                        <ContactClientFlipGrid />
                                    </div>
                                </Reveal>
                            </div>

                            {/* RIGHT — Modern form */}
                            <div className="dawki-contact-right">
                                <Reveal delay={0.10}>
                                    <div className="dawki-contact-form-card">
                                        <form id="contact-form" className="dawki-contact-form" onSubmit={handleSubmit} noValidate>
                                            {(flashSuccess || recentlySuccessful) && (
                                                <div className="dawki-form-success" role="status">
                                                    ✓ {flashSuccess || "Thanks — your message has been received. We'll get back to you within 24 hours."}
                                                </div>
                                            )}

                                            {/* Name */}
                                            <div className="dawki-form-field">
                                                <label htmlFor="cf-name" className="dawki-form-label">
                                                    Name <span className="dawki-form-required">*</span>
                                                </label>
                                                <input
                                                    id="cf-name"
                                                    type="text"
                                                    placeholder="Jane Smith"
                                                    required
                                                    className="dawki-form-input"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                />
                                                {errors.name && <span className="dawki-form-error">{errors.name}</span>}
                                            </div>

                                            {/* Email + Phone */}
                                            <div className="dawki-form-row">
                                                <div className="dawki-form-field">
                                                    <label htmlFor="cf-email" className="dawki-form-label">
                                                        Email <span className="dawki-form-required">*</span>
                                                    </label>
                                                    <input
                                                        id="cf-email"
                                                        type="email"
                                                        placeholder="you@example.com"
                                                        required
                                                        className="dawki-form-input"
                                                        value={data.email}
                                                        onChange={(e) => setData('email', e.target.value)}
                                                    />
                                                    {errors.email && <span className="dawki-form-error">{errors.email}</span>}
                                                </div>
                                                <div className="dawki-form-field">
                                                    <label htmlFor="cf-phone" className="dawki-form-label">
                                                        Phone <span className="dawki-form-optional">optional</span>
                                                    </label>
                                                    <div className="dawki-form-phone">
                                                        <span className="dawki-form-phone-prefix">🇮🇳 +91</span>
                                                        <input
                                                            id="cf-phone"
                                                            type="tel"
                                                            placeholder="555 000 0000"
                                                            className="dawki-form-input"
                                                            value={data.phone}
                                                            onChange={(e) => setData('phone', e.target.value)}
                                                        />
                                                    </div>
                                                    {errors.phone && <span className="dawki-form-error">{errors.phone}</span>}
                                                </div>
                                            </div>

                                            {/* How can we help — split: visual left + vertical list right */}
                                            <div className="dawki-form-field">
                                                <label className="dawki-form-label">
                                                    How can we help? <span className="dawki-form-optional">choose one</span>
                                                </label>
                                                <div className="dawki-form-help-split">
                                                    {/* LEFT: animated visual */}
                                                    <div className="dawki-form-help-visual">
                                                        <div className="dawki-form-help-visual-inner">
                                                            <div className="dawki-form-help-visual-icon">
                                                                <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                                                </svg>
                                                            </div>
                                                            <div className="dawki-form-help-visual-orbit"></div>
                                                            <div className="dawki-form-help-visual-orbit dawki-form-help-visual-orbit--2"></div>
                                                        </div>
                                                        <p className="dawki-form-help-visual-text">Tell us what you need — we'll match the right team.</p>
                                                    </div>

                                                    {/* RIGHT: vertical option list */}
                                                    <div className="dawki-form-help-list">
                                                        {[
                                                            {
                                                                id: 'team',
                                                                title: 'Dedicated Team',
                                                                desc: 'Extend your engineering team',
                                                                icon: (
                                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                                                    </svg>
                                                                ),
                                                            },
                                                            {
                                                                id: 'software',
                                                                title: 'Software Development',
                                                                desc: 'End-to-end project build',
                                                                icon: (
                                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                                                                    </svg>
                                                                ),
                                                            },
                                                            {
                                                                id: 'design',
                                                                title: 'UI/UX Design',
                                                                desc: 'Pixel-perfect product design',
                                                                icon: (
                                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
                                                                    </svg>
                                                                ),
                                                            },
                                                            {
                                                                id: 'marketing',
                                                                title: 'Digital Marketing',
                                                                desc: 'SEO, ads & growth strategy',
                                                                icon: (
                                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                        <line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>
                                                                    </svg>
                                                                ),
                                                            },
                                                            {
                                                                id: 'others',
                                                                title: 'Something else',
                                                                desc: "Tell us in the message",
                                                                icon: (
                                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="0.5" fill="currentColor"/><circle cx="8" cy="12" r="0.5" fill="currentColor"/><circle cx="16" cy="12" r="0.5" fill="currentColor"/>
                                                                    </svg>
                                                                ),
                                                            },
                                                        ].map((opt) => (
                                                            <button
                                                                type="button"
                                                                key={opt.id}
                                                                className={`dawki-form-help-row ${helpType === opt.id ? 'is-active' : ''}`}
                                                                onClick={() => setHelpType(opt.id)}
                                                            >
                                                                <span className="dawki-form-help-row-icon">{opt.icon}</span>
                                                                <span className="dawki-form-help-row-text">
                                                                    <span className="dawki-form-help-row-title">{opt.title}</span>
                                                                    <span className="dawki-form-help-row-desc">{opt.desc}</span>
                                                                </span>
                                                                <span className="dawki-form-help-row-check">
                                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                                                </span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Project description */}
                                            <div className="dawki-form-field">
                                                <label htmlFor="cf-message" className="dawki-form-label">
                                                    What are you building? <span className="dawki-form-required">*</span>
                                                </label>
                                                <textarea
                                                    id="cf-message"
                                                    rows={6}
                                                    required
                                                    placeholder="Describe your project — what it does, where you are, what you need. Any deadlines or constraints?"
                                                    className="dawki-form-input dawki-form-textarea"
                                                    value={data.message}
                                                    onChange={(e) => setData('message', e.target.value)}
                                                ></textarea>
                                                {errors.message && <span className="dawki-form-error">{errors.message}</span>}
                                            </div>

                                            {/* Submit */}
                                            <button type="submit" className="dawki-form-submit" disabled={processing}>
                                                <span>{processing ? 'Sending…' : 'Send Message'}</span>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                                                </svg>
                                            </button>

                                            <p className="dawki-form-legal">
                                                By submitting you agree to our <Link href="#">Privacy Policy</Link> and <Link href="#">Terms of Service</Link>.
                                            </p>
                                        </form>
                                    </div>
                                </Reveal>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Info Cards (kept content from original) */}
                <section className="dawki-contact-info-grid section-gap">
                    <div className="container">
                        <Reveal>
                            <div className="dawki-contact-info-heading">
                                <span className="dawki-contact-pill">
                                    <span className="dawki-contact-dot"></span>
                                    Contact Info
                                </span>
                                <h2 className="dawki-contact-info-title">
                                    Reach Out <span>to Us</span>
                                </h2>
                            </div>
                        </Reveal>
                        <div className="dawki-contact-info-cards">
                            {[
                                { icon: '📍', title: 'Our Location', body: <p>LGF, L-30B, Block H 6, Block L, Malviya Nagar, New Delhi, Delhi 110017</p> },
                                { icon: '✉️', title: 'Email Us', body: (
                                    <ul>
                                        <li><a href="mailto:info@dawkiinfotech.com">info@dawkiinfotech.com</a></li>
                                        <li><a href="mailto:support@dawkiinfotech.com">support@dawkiinfotech.com</a></li>
                                    </ul>
                                ) },
                                { icon: '📞', title: 'Call Us', body: <a href="tel:+918076096255">+91 807 609 6255</a> },
                                { icon: '🕒', title: 'Business Hours', body: <p>Mon-Fri: 10am - 7pm</p> },
                            ].map((item, i) => (
                                <Reveal key={i} delay={i * 0.08} className="dawki-contact-info-card">
                                    <div className="dawki-contact-info-icon">{item.icon}</div>
                                    <h3 className="dawki-contact-info-cardtitle">{item.title}</h3>
                                    <div className="dawki-contact-info-body">{item.body}</div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </FrontendLayout>
    );
}
