import ServicePageTemplate, { ICON } from '@/components/ServicePageTemplate';

export default function PerformanceTestingServices() {
    return (
        <ServicePageTemplate
            pageTitle="Performance Testing Services"
            breadcrumbCategory="Team Extension Services"
            heroPill="Team Extension Services"
            heroTitleStart="Performance"
            heroTitleHighlight="Testing Services"
            heroSubtitle="Load, stress, soak, and spike testing — find performance bottlenecks before your users do."
            featuresPill="Performance Engineered"
            featuresTitleStart="Know Your System"
            featuresTitleHighlight="Holds Up Under Load"
            featuresSubtitle="From peak-traffic launches to API SLAs — we engineer performance test programs that find issues early and validate scalability."
            features={[
                { title: 'Load Testing', desc: 'Simulate realistic peak traffic to validate capacity and SLAs.', icon: '⚡' },
                { title: 'Stress & Soak Testing', desc: 'Push beyond capacity to find breaking points; long-running tests to catch leaks.', icon: '💪' },
                { title: 'Spike Testing', desc: 'Validate behavior under sudden traffic spikes from launches, marketing, or virality.', icon: '📈' },
                { title: 'API & Backend Profiling', desc: 'Find slow queries, N+1 patterns, and bottleneck services with APM tools.', icon: '🔬' },
                { title: 'Frontend Performance', desc: 'Lighthouse, WebPageTest, Core Web Vitals tuning for real-user performance.', icon: '🌐' },
                { title: 'Capacity Planning', desc: 'Right-size infrastructure based on real load test data and growth forecasts.', icon: '📊' },
            ]}
            processSteps={[
                { n: '01', t: 'Plan', d: 'Define SLAs, user journeys, traffic models, and success criteria.' },
                { n: '02', t: 'Build', d: 'Test scripts, data, environments, and observability instrumented.' },
                { n: '03', t: 'Execute', d: 'Run load, stress, soak, and spike scenarios with real-time observation.' },
                { n: '04', t: 'Analyze & Tune', d: 'Identify bottlenecks, recommend fixes, and re-test until SLAs are met.' },
            ]}
            servicesPill="Our Capabilities"
            servicesTitleStart="Performance Testing"
            servicesTitleHighlight="Services We Offer"
            servicesSubtitle="A full performance engineering practice — testing, profiling, tuning, and ongoing capacity management."
            serviceCards={[
                { title: 'Performance Test Strategy', desc: 'SLA definition, traffic modeling, tool selection, and success criteria.', icon: ICON.target },
                { title: 'Load Testing', desc: 'Realistic peak-traffic load tests with k6, JMeter, Gatling, or Locust.', icon: ICON.chart },
                { title: 'Stress Testing', desc: 'Push systems past capacity to find breakpoints and graceful-failure modes.', icon: ICON.rocket },
                { title: 'Soak / Endurance Testing', desc: 'Long-running tests that surface memory leaks and slow degradation.', icon: ICON.infinity },
                { title: 'Spike Testing', desc: 'Validate response to sudden traffic spikes from launches or promotions.', icon: ICON.refresh },
                { title: 'API Performance Testing', desc: 'P50/P95/P99 latency under load, with assertions tied to SLAs.', icon: ICON.code },
                { title: 'Database Performance Tuning', desc: 'Index review, query optimization, and connection-pool tuning.', icon: ICON.database },
                { title: 'Frontend Performance Audits', desc: 'Lighthouse, WebPageTest, Core Web Vitals analysis and remediation.', icon: ICON.eye },
                { title: 'Mobile App Performance', desc: 'Battery, network, and memory profiling on real devices.', icon: ICON.cog },
                { title: 'Capacity Planning', desc: 'Sizing recommendations based on test data, growth, and seasonality.', icon: ICON.box },
                { title: 'CI Performance Gates', desc: 'Automated performance tests run in CI with regression budgets.', icon: ICON.shield },
                { title: 'Observability & APM Setup', desc: 'New Relic, Datadog, Dynatrace, OpenTelemetry instrumentation.', icon: ICON.headset },
            ]}
            faqs={[
                { q: 'What is performance testing?', a: 'Performance testing measures how your system behaves under various loads — speed, scalability, and stability — using tools that simulate users and traffic.' },
                { q: 'When should we run performance tests?', a: 'Before major launches, after architecture changes, on a periodic schedule, and as part of CI for performance-sensitive paths.' },
                { q: 'Which tools do you use?', a: 'k6, JMeter, Gatling, Locust, Lighthouse, WebPageTest — and APMs like Datadog, New Relic, and Dynatrace.' },
                { q: 'How realistic are the tests?', a: 'We model real user behavior using analytics data, run from multiple geographies, and use realistic data and pacing.' },
                { q: 'How do you find bottlenecks?', a: 'We combine load testing with APM, profiling, and database telemetry to pinpoint slow services, queries, and code paths.' },
                { q: 'Can you also fix the issues you find?', a: 'Yes. Our performance engineers can recommend and implement fixes — from query tuning to caching to infrastructure changes.' },
                { q: 'Do you integrate performance tests into CI?', a: 'Yes. We add performance regression gates to CI for critical APIs and user journeys, with budgets and alerting.' },
            ]}
        />
    );
}
