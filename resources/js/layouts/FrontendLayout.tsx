import Header from '@/components/Header';
import Footer from '@/components/Footer';
import React, { PropsWithChildren, useEffect } from 'react';

export default function FrontendLayout({ children }: PropsWithChildren) {
    useEffect(() => {
        const $ = (window as any).jQuery;
        if (!$) return;

        // Back to top logic
        const scrollElementWrap = $("#tj-back-to-top");
        const percentageText = $("#tj-back-to-top-percentage");

        // ScrollSmoother initialization
        const gsap = (window as any).gsap;
        const ScrollTrigger = (window as any).ScrollTrigger;
        const ScrollSmoother = (window as any).ScrollSmoother;

        if (gsap && ScrollTrigger && ScrollSmoother) {
            gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
            if ($("#smooth-wrapper").length && $("#smooth-content").length) {
                ScrollSmoother.create({
                    smooth: 1.5,
                    effects: true,
                    smoothTouch: 0.1,
                    ignoreMobileResize: true,
                });
            }
        }

        const handleScroll = () => {
            const scrollTopPos = document.documentElement.scrollTop || document.body.scrollTop;
            const calcHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollValue = Math.round((scrollTopPos / calcHeight) * 100);

            if (scrollElementWrap.length) {
                scrollElementWrap.css(
                    "background",
                    `conic-gradient(var(--tj-color-theme-primary) ${scrollValue}%, var(--tj-color-common-white) ${scrollValue}%)`
                );

                if (scrollTopPos > 100) {
                    scrollElementWrap.addClass("active");
                } else {
                    scrollElementWrap.removeClass("active");
                }

                if (scrollValue < 96) {
                    percentageText.text(`${scrollValue}%`);
                } else {
                    percentageText.html('<i class="tji-arrow-up-long"></i>');
                }
            }
        };

        const scrollToTop = () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        };

        window.addEventListener("scroll", handleScroll);
        scrollElementWrap.on("click", scrollToTop);

        // Initial call
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
            scrollElementWrap.off("click", scrollToTop);
        };
    }, []);

    return (
        <>
            <div className="body-overlay"></div>

            {/* back to top start */}
            <div id="tj-back-to-top">
                <span id="tj-back-to-top-percentage"></span>
            </div>
            {/* back to top end */}

            {/* start: Search Popup Overlay */}
            <div className="search-popup-overlay"></div>
            {/* end: Search Popup Overlay */}

            <Header />
            <div id="smooth-wrapper">
                <div id="smooth-content">
                    {children}
                    <Footer />
                </div>
            </div>

            {/* Floating Estimate Calculator FAB — appears on every page.
             * Plain anchor (hard nav) so the /estimate page mounts fresh. */}
            <a
                href="/estimate"
                className="dawki-est-fab"
                aria-label="Open the project cost estimate calculator"
            >
                <span className="dawki-est-fab-pulse" aria-hidden="true"></span>
                <span className="dawki-est-fab-pulse" aria-hidden="true"></span>
                <span className="dawki-est-fab-icon" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="4" y="2" width="16" height="20" rx="2" />
                        <line x1="8" y1="6" x2="16" y2="6" />
                        <line x1="8" y1="10" x2="10" y2="10" />
                        <line x1="13" y1="10" x2="16" y2="10" />
                        <line x1="8" y1="14" x2="10" y2="14" />
                        <line x1="13" y1="14" x2="16" y2="14" />
                        <line x1="8" y1="18" x2="16" y2="18" />
                    </svg>
                </span>
                <span className="dawki-est-fab-text">
                    <strong>Estimate Calculator</strong>
                    <span>Get a live quote</span>
                </span>
                <span className="dawki-est-fab-badge" aria-hidden="true">NEW</span>
            </a>
        </>
    );
}
