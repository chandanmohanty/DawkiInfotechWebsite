import { Head, Link } from '@inertiajs/react';
import React from 'react';
import FrontendLayout from '@/layouts/FrontendLayout';

interface IndustryPageProps {
    title: string;
}

const IndustryTemplate: React.FC<IndustryPageProps> = ({ title }) => {
    return (
        <FrontendLayout>
            <Head title={`${title} | Dawki Infotech`} />
            <main id="primary" className="site-main">
                <div className="space-for-header"></div>
                {/* start: Breadcrumb Section */}
                <section className="tj-page-header section-gap-x" style={{ backgroundImage: 'url(/assets/images/bg/3.jpg)' }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="tj-page-header-content text-center">
                                    <h1 className="tj-page-title">{title}</h1>
                                    <div className="tj-page-link">
                                        <span><i className="tji-home"></i></span>
                                        <span>
                                            <Link href="/">Home</Link>
                                        </span>
                                        <span><i className="tji-arrow-right"></i></span>
                                        <span>
                                            <span>Industries</span>
                                        </span>
                                        <span><i className="tji-arrow-right"></i></span>
                                        <span>
                                            <span>{title}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="page-header-overlay" style={{ backgroundImage: 'url(/assets/images/shape/pheader-overlay.webp)' }}></div>
                </section>
                {/* end: Breadcrumb Section */}

                {/* Main Content Placeholder */}
                <section className="tj-service-details section-gap">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="tj-service-details-content">
                                    <p>Content for {title} Industry is coming soon.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* start: Cta Section */}
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
                {/* end: Cta Section */}
            </main>
        </FrontendLayout>
    );
};

export default IndustryTemplate;
