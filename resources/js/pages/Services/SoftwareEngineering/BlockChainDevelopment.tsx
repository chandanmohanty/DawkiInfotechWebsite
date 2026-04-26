import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import ServicePageTemplate, { ICON } from '@/components/ServicePageTemplate';

/* === Section 1: Multi-Chain Hub (orbital animation with chain logos) ============ */
const CHAIN_LOGOS = [
    { name: 'Ethereum',  url: 'https://cdn.simpleicons.org/ethereum/627EEA' },
    { name: 'Solana',    url: 'https://cdn.simpleicons.org/solana/9945FF' },
    { name: 'Polygon',   url: 'https://cdn.simpleicons.org/polygon/8247E5' },
    { name: 'BNB Chain', url: 'https://cdn.simpleicons.org/bnbchain/F0B90B' },
    { name: 'Avalanche', url: 'https://cdn.simpleicons.org/avalanche/E84142' },
    { name: 'Bitcoin',   url: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Bitcoin.svg' },
    { name: 'Cardano',   url: 'https://cdn.simpleicons.org/cardano/0033AD' },
    { name: 'Polkadot',  url: 'https://cdn.simpleicons.org/polkadot/E6007A' },
];

const MultiChainHub: React.FC = () => {
    const radius = 38;
    const positions = CHAIN_LOGOS.map((_, i) => {
        const angle = (i / CHAIN_LOGOS.length) * Math.PI * 2 - Math.PI / 2;
        return {
            x: 50 + radius * Math.cos(angle),
            y: 50 + radius * Math.sin(angle),
        };
    });

    return (
        <section className="dawki-ent-hub">
            <div className="container">
                <div className="dawki-ent-hub-heading">
                    <span className="dawki-ent-hub-pill">
                        <span></span>
                        Multi-Chain
                    </span>
                    <h2 className="dawki-ent-hub-title">
                        Built for Every Major <span>Blockchain Network</span>
                    </h2>
                    <p className="dawki-ent-hub-subtitle">
                        We ship audited smart contracts and dApps across the leading L1s and L2s — pick the chain that fits your tokenomics, audience, and gas profile.
                    </p>
                </div>

                <div className="dawki-ent-hub-stage">
                    <svg className="dawki-ent-hub-grid" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                        <defs>
                            <linearGradient id="dawkiChainLineGrad" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="rgba(99, 126, 234, 0.95)" />
                                <stop offset="100%" stopColor="rgba(153, 69, 255, 0.25)" />
                            </linearGradient>
                        </defs>
                        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(99, 126, 234, 0.22)" strokeWidth="0.18" strokeDasharray="0.6 0.8" />
                        <circle cx="50" cy="50" r={radius - 11} fill="none" stroke="rgba(153, 69, 255, 0.16)" strokeWidth="0.14" strokeDasharray="0.4 1.2" />
                        {positions.map((p, i) => (
                            <line
                                key={i}
                                x1="50" y1="50" x2={p.x} y2={p.y}
                                stroke="url(#dawkiChainLineGrad)"
                                strokeWidth="0.25"
                                strokeDasharray="1.5 1.5"
                                className="dawki-ent-hub-line"
                                style={{ animationDelay: `${i * 0.32}s` }}
                            />
                        ))}
                    </svg>

                    <span className="dawki-ent-hub-ripple"></span>
                    <span className="dawki-ent-hub-ripple"></span>
                    <span className="dawki-ent-hub-ripple"></span>

                    <motion.div
                        className="dawki-ent-hub-core"
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
                    >
                        <span className="dawki-ent-hub-core-inner">
                            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                            </svg>
                        </span>
                        <div className="dawki-ent-hub-core-label">Your DApp</div>
                    </motion.div>

                    {CHAIN_LOGOS.map((logo, i) => (
                        <motion.div
                            key={logo.name}
                            className="dawki-ent-hub-orbit"
                            style={{ left: `${positions[i].x}%`, top: `${positions[i].y}%` }}
                            initial={{ scale: 0, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ delay: 0.25 + i * 0.08, duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
                            whileHover={{ scale: 1.12, transition: { duration: 0.3 } }}
                        >
                            <div className="dawki-ent-hub-orbit-glow"></div>
                            <img
                                src={logo.url}
                                alt={logo.name}
                                loading="lazy"
                                decoding="async"
                                onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
                            />
                            <span className="dawki-ent-hub-orbit-label">{logo.name}</span>
                        </motion.div>
                    ))}
                </div>

                <div className="dawki-ent-hub-tags">
                    <div className="dawki-ent-hub-tag"><span></span>L1 — Ethereum, Solana, Avalanche</div>
                    <div className="dawki-ent-hub-tag"><span></span>L2 — Arbitrum, Optimism, Polygon zkEVM</div>
                    <div className="dawki-ent-hub-tag"><span></span>EVM — Base, BNB Chain, Linea</div>
                    <div className="dawki-ent-hub-tag"><span></span>Non-EVM — Solana, Aptos, Sui</div>
                    <div className="dawki-ent-hub-tag"><span></span>Bridges — LayerZero, Wormhole, Axelar</div>
                </div>
            </div>
        </section>
    );
};

/* === Section 2: On-Chain Outcomes Dashboard ===================================== */
const useCountUp = (target: number, duration = 1800, decimals = 0) => {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: '-50px' });
    const [val, setVal] = useState(0);

    useEffect(() => {
        if (!inView) return;
        let raf = 0;
        const start = performance.now();
        const tick = (t: number) => {
            const p = Math.min((t - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(eased * target);
            if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [inView, target, duration]);

    return { ref, value: val.toFixed(decimals) };
};

const CountValue: React.FC<{ target: number; decimals?: number }> = ({ target, decimals = 0 }) => {
    const { ref, value } = useCountUp(target, 1800, decimals);
    return <span ref={ref} className="dawki-ent-out-num">{value}</span>;
};

const GaugeMetric: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-40px' });
    const r = 56;
    const circ = Math.PI * r;
    const fill = (100 / 100) * circ;

    return (
        <div ref={ref} className="dawki-ent-out-card">
            <svg className="dawki-ent-out-gauge" viewBox="0 0 140 80">
                <defs>
                    <linearGradient id="dawkiBcGaugeGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="50%" stopColor="#4f7cff" />
                        <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                </defs>
                <path d={`M 14 70 A ${r} ${r} 0 0 1 126 70`} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" strokeLinecap="round" />
                <motion.path
                    d={`M 14 70 A ${r} ${r} 0 0 1 126 70`}
                    fill="none"
                    stroke="url(#dawkiBcGaugeGrad)"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={circ}
                    initial={{ strokeDashoffset: circ }}
                    animate={{ strokeDashoffset: inView ? circ - fill : circ }}
                    transition={{ duration: 1.6, ease: [0.2, 0.8, 0.2, 1] }}
                />
            </svg>
            <div className="dawki-ent-out-value">
                <CountValue target={100} />
                <span className="dawki-ent-out-suffix">%</span>
            </div>
            <div className="dawki-ent-out-label">Audit Pass Rate</div>
            <p className="dawki-ent-out-desc">Every contract we deploy passes formal verification and third-party audit before mainnet release.</p>
        </div>
    );
};

const OrbitMetric: React.FC = () => (
    <div className="dawki-ent-out-card">
        <div className="dawki-ent-out-orbit" aria-hidden="true">
            <span></span><span></span><span></span>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
        </div>
        <div className="dawki-ent-out-value">
            <CountValue target={12} />
            <span className="dawki-ent-out-suffix">+</span>
        </div>
        <div className="dawki-ent-out-label">Chains Supported</div>
        <p className="dawki-ent-out-desc">Cross-chain expertise across EVM and non-EVM ecosystems — L1s, L2s, and bridges.</p>
    </div>
);

const BarsMetric: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-40px' });
    const heights = [42, 60, 52, 76, 92];

    return (
        <div ref={ref} className="dawki-ent-out-card">
            <div className="dawki-ent-out-bars" aria-hidden="true">
                {heights.map((h, i) => (
                    <motion.span
                        key={i}
                        className="dawki-ent-out-bar"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: inView ? h / 100 : 0 }}
                        transition={{ duration: 0.95, delay: 0.15 + i * 0.12, ease: [0.2, 0.8, 0.2, 1] }}
                    />
                ))}
            </div>
            <div className="dawki-ent-out-value">
                <CountValue target={200} />
                <span className="dawki-ent-out-suffix">+</span>
            </div>
            <div className="dawki-ent-out-label">Smart Contracts Deployed</div>
            <p className="dawki-ent-out-desc">Production-grade Solidity, Rust, and Move contracts shipped across DeFi, NFTs, and DAOs.</p>
        </div>
    );
};

const LineMetric: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-40px' });
    const path = 'M 5 60 L 25 50 L 45 55 L 65 35 L 85 28 L 105 18 L 125 10';

    return (
        <div ref={ref} className="dawki-ent-out-card">
            <svg className="dawki-ent-out-line" viewBox="0 0 130 70">
                <defs>
                    <linearGradient id="dawkiBcLineGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                </defs>
                <motion.path
                    d={path}
                    fill="none"
                    stroke="url(#dawkiBcLineGrad)"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: inView ? 1 : 0 }}
                    transition={{ duration: 1.8, ease: [0.2, 0.8, 0.2, 1] }}
                />
                <motion.circle
                    cx="125" cy="10" r="3.5"
                    fill="#a855f7"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0 }}
                    transition={{ delay: 1.6, duration: 0.5 }}
                />
            </svg>
            <div className="dawki-ent-out-value">
                <span className="dawki-ent-out-suffix" style={{ color: '#06b6d4' }}>$</span>
                <CountValue target={50} />
                <span className="dawki-ent-out-suffix">M+</span>
            </div>
            <div className="dawki-ent-out-label">Total Value Locked</div>
            <p className="dawki-ent-out-desc">Across DeFi protocols, NFT marketplaces, and tokenized platforms we've engineered for clients.</p>
        </div>
    );
};

const BlockchainOutcomes: React.FC = () => (
    <section className="dawki-ent-out">
        <div className="container">
            <div className="dawki-ent-out-heading">
                <span className="dawki-ent-out-pill">
                    <span></span>
                    On-Chain Outcomes
                </span>
                <h2 className="dawki-ent-out-title">
                    Numbers That Move <span>The Chain Forward</span>
                </h2>
                <p className="dawki-ent-out-subtitle">
                    Real outcomes our blockchain builds deliver in production — measured on-chain, audited end-to-end.
                </p>
            </div>

            <div className="dawki-ent-out-grid">
                <GaugeMetric />
                <OrbitMetric />
                <BarsMetric />
                <LineMetric />
            </div>
        </div>
    </section>
);

/* === Section 3: Blockchain Video Showcase ======================================= */
const BlockchainVideo: React.FC = () => {
    const ref = useRef<HTMLVideoElement>(null);
    const [started, setStarted] = useState(false);

    const handleStart = () => {
        setStarted(true);
        setTimeout(() => { ref.current?.play().catch(() => {}); }, 30);
    };

    return (
        <section className="dawki-ent-video">
            <div className="container">
                <div className="dawki-ent-video-heading">
                    <span className="dawki-ent-video-pill">
                        <span></span>
                        On-Chain in Action
                    </span>
                    <h2 className="dawki-ent-video-title">
                        See How We Ship <span>Production Web3</span>
                    </h2>
                    <p className="dawki-ent-video-subtitle">
                        A behind-the-scenes look at how we design tokenomics, write audited contracts, and operate on-chain products at scale.
                    </p>
                </div>

                <motion.div
                    className="dawki-ent-video-frame"
                    initial={{ opacity: 0, y: 30, scale: 0.97 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                >
                    <div className="dawki-ent-video-frame-glow"></div>
                    <video
                        ref={ref}
                        poster="/assets/images/testimonial/client_feedback.jpg"
                        controls={started}
                        preload="metadata"
                        playsInline
                    >
                        <source src="/assets/images/header/demo/dawki_video.mp4" type="video/mp4" />
                    </video>

                    {!started && (
                        <button
                            className="dawki-ent-video-play"
                            onClick={handleStart}
                            aria-label="Play video"
                            type="button"
                        >
                            <span className="dawki-ent-video-play-pulse"></span>
                            <span className="dawki-ent-video-play-pulse"></span>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </button>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

/* === Page ======================================================================== */
export default function BlockChainDevelopment() {
    return (
        <ServicePageTemplate
            pageTitle="Blockchain Development"
            breadcrumbCategory="Software Engineering"
            heroPill="Software Engineering"
            heroTitleStart="Blockchain"
            heroTitleHighlight="Development"
            heroSubtitle="Smart contracts, dApps, NFTs, and tokenization platforms — built on Ethereum, Solana, Polygon, and beyond."
            heroVideoSrc="https://amazedveku.de/images/crypto.mp4"
            featuresPill="Web3 Engineering"
            featuresTitleStart="Decentralized Solutions"
            featuresTitleHighlight="Built to Last"
            featuresSubtitle="From DeFi to enterprise blockchain — we ship audited smart contracts, fast dApps, and on-chain products users actually trust."
            features={[
                { title: 'Audited Smart Contracts', desc: 'Solidity and Rust contracts built test-first — formally verified and externally audited.', icon: '📜' },
                { title: 'Multi-Chain by Default', desc: 'Ethereum, Solana, Polygon, BNB Chain, Avalanche — pick the chain that fits your use case.', icon: '⛓️' },
                { title: 'NFT & Token Standards', desc: 'ERC-20, ERC-721, ERC-1155, SPL, and custom token mechanics for any model.', icon: '🪙' },
                { title: 'Decentralized Storage', desc: 'IPFS, Arweave, and Filecoin integration for truly decentralized assets.', icon: '🗄️' },
                { title: 'Wallet Integrations', desc: 'MetaMask, WalletConnect, Phantom, Coinbase Wallet, and account abstraction.', icon: '👛' },
                { title: 'Security First', desc: 'Re-entrancy, oracle, MEV, and access-control hardening built into every line.', icon: '🛡️' },
            ]}
            processSteps={[
                { n: '01', t: 'Tokenomics & Design', d: 'Model incentives, token flows, and on-chain mechanics that work long-term.' },
                { n: '02', t: 'Smart Contract Build', d: 'Test-driven development in Solidity/Rust with full coverage and gas optimization.' },
                { n: '03', t: 'Audit & Deploy', d: 'Third-party audits, testnet rehearsals, and mainnet launch.' },
                { n: '04', t: 'Operate & Evolve', d: 'Monitoring, governance, upgrades, and community/dev support.' },
            ]}
            servicesPill="Our Capabilities"
            servicesTitleStart="Blockchain"
            servicesTitleHighlight="Services We Offer"
            servicesSubtitle="End-to-end Web3 engineering — from tokenomics design to launch and beyond."
            servicesLayout="timeline"
            serviceCards={[
                { title: 'Smart Contract Development', desc: 'Solidity, Rust, and Move contracts — written, tested, and gas-optimized to production standard.', icon: ICON.code },
                { title: 'DApp Development', desc: 'Full-stack decentralized applications with React/Next.js front-ends and Web3 integrations.', icon: ICON.globe },
                { title: 'NFT Marketplace Development', desc: 'OpenSea-style marketplaces with minting, royalties, auctions, and bidding flows.', icon: ICON.box },
                { title: 'DeFi Platform Development', desc: 'Lending, staking, AMMs, yield farming, and derivatives — battle-tested and audited.', icon: ICON.chart },
                { title: 'Token Development & ICO/IDO', desc: 'ERC-20/SPL tokens, vesting contracts, launchpads, and KYC-compliant token sales.', icon: ICON.rocket },
                { title: 'Crypto Wallet Development', desc: 'Custodial and non-custodial wallets with multi-chain, multi-signature, and biometric support.', icon: ICON.lock },
                { title: 'Blockchain Consulting', desc: 'Tokenomics, chain selection, regulatory strategy, and architecture reviews.', icon: ICON.target },
                { title: 'Layer 2 & Rollup Development', desc: 'Optimistic and ZK rollup integrations — Arbitrum, Optimism, zkSync, Polygon zkEVM.', icon: ICON.cog },
                { title: 'DAO Development', desc: 'Governance contracts, voting modules, treasury management, and proposal flows.', icon: ICON.users },
                { title: 'Cross-Chain Bridges', desc: 'Secure bridge contracts and integrations with LayerZero, Wormhole, and Axelar.', icon: ICON.link },
                { title: 'Smart Contract Auditing', desc: 'Independent audits, formal verification, and post-deploy monitoring.', icon: ICON.check },
                { title: 'Web3 Maintenance', desc: 'Upgradeable contract patterns, monitoring, governance support, and incident response.', icon: ICON.headset },
            ]}
            toolsTitleStart="Robust Tools &"
            toolsTitleHighlight="Technologies We Work"
            toolsSubtitle="A curated Web3 stack — battle-tested across mainnet deployments, audits, and on-chain products."
            toolsLayout="vertical"
            tools={[
                { n: 'Solidity',     s: 'solidity',     c: '363636', desc: 'Smart contract language for Ethereum and EVM-compatible chains — our primary tool for on-chain logic.' },
                { n: 'Rust',         s: 'rust',         c: '000000', desc: 'High-performance language we use for Solana programs (Anchor) and Substrate-based chains.' },
                { n: 'Hardhat',      s: 'hardhat',      c: 'FFF100', desc: 'Local Ethereum dev environment for compiling, testing, debugging, and deploying contracts.' },
                { n: 'Foundry',      s: 'foundry',      c: 'FF6B35', desc: 'Fast Solidity testing framework — fuzz tests, invariants, and gas snapshots out of the box.' },
                { n: 'Ethers.js',    s: 'ethers',       c: '2535A0', desc: 'Robust JavaScript library for interacting with EVM chains, wallets, and contract ABIs.' },
                { n: 'Web3.js',      s: 'web3dotjs',    c: 'F16822', desc: 'Original Ethereum JS library — still essential for some legacy integrations and tooling.' },
                { n: 'OpenZeppelin', s: 'openzeppelin', c: '4E5EE4', desc: 'Audited, reusable contract building blocks — ERC-20, ERC-721, access control, upgradeability.' },
                { n: 'Chainlink',    s: 'chainlink',    c: '375BD2', desc: 'Decentralized oracle network we use for price feeds, VRF, and cross-chain CCIP messaging.' },
                { n: 'IPFS',         s: 'ipfs',         c: '65C2CB', desc: 'Decentralized storage protocol for NFT metadata, dApp assets, and immutable content.' },
                { n: 'The Graph',    s: 'thegraph',     c: '6747ED', desc: 'Subgraph indexing for fast on-chain queries — powers most of our dApp dashboards and analytics.' },
                { n: 'MetaMask',     s: 'metamask',     c: 'F6851B', desc: 'Browser wallet integration for EVM dApps — connect, sign, and switch chains.' },
                { n: 'WalletConnect',s: 'walletconnect',c: '3B99FC', desc: 'Open protocol for connecting mobile wallets to dApps via QR — used in every modern dApp we build.' },
                { n: 'Solana',       s: 'solana',       c: '9945FF', desc: 'High-throughput L1 we use for low-fee NFTs, payments, and consumer-grade dApps.' },
                { n: 'Polygon',      s: 'polygon',      c: '8247E5', desc: 'EVM-compatible L2 of choice for fast, low-cost dApp deployments and zkEVM rollups.' },
                { n: 'Slither',      s: 'slither',      c: '1B6EC2', desc: 'Static analysis framework for Solidity — runs in CI to catch vulnerabilities before they ship.' },
                { n: 'Remix IDE',    s: 'remix',        c: '2A4DA8', desc: 'Browser-based Solidity IDE — quick prototyping, debugging, and on-chain interaction.' },
            ]}
            hideProjects={true}
            hideTestimonial={true}
            showClients={true}
            clientsPill="Trusted By Web3 Teams"
            clientsHeading="From DeFi Protocols to NFT Drops,"
            clientsHeadingHighlight="We Power On-Chain Innovation"
            extraSections={
                <>
                    <MultiChainHub />
                    <BlockchainOutcomes />
                    <BlockchainVideo />
                </>
            }
            googleReviews={[
                {
                    name: 'Marcus Chen',
                    role: 'Founder, ChainForge Protocol',
                    rating: 5,
                    date: '2 months ago',
                    text: 'Dawki shipped our DeFi lending protocol with zero post-audit findings. Gas optimizations alone saved users $400K in the first quarter on Polygon.',
                },
                {
                    name: 'Aisha Patel',
                    role: 'CTO, Solstice NFT',
                    rating: 5,
                    date: '4 months ago',
                    text: 'Multi-chain NFT marketplace with lazy-mint, royalties, and IPFS pinning — delivered on schedule and battle-tested at our 50K mint launch on Solana.',
                },
                {
                    name: 'Daniel Rivers',
                    role: 'Head of Product, MetaVault DAO',
                    rating: 5,
                    date: '6 months ago',
                    text: 'Their tokenomics review caught two attack vectors our previous team missed. The DAO governance module they built has run flawlessly since launch.',
                },
                {
                    name: 'Yuki Tanaka',
                    role: 'CEO, Bridgewave',
                    rating: 5,
                    date: '3 months ago',
                    text: 'Cross-chain bridge integration across LayerZero and Wormhole — secure, well-documented, and has handled $20M+ in transfers without an incident.',
                },
                {
                    name: 'Lucas Almeida',
                    role: 'Lead Engineer, Zenith Finance',
                    rating: 5,
                    date: '5 months ago',
                    text: 'We needed Foundry-grade test coverage for our derivatives protocol. Dawki delivered fuzz tests and invariants that genuinely changed how we ship contracts.',
                },
                {
                    name: 'Sofia Müller',
                    role: 'Product Lead, ArcadiaPay',
                    rating: 5,
                    date: '7 months ago',
                    text: 'Built our crypto payment gateway on Base with account abstraction. UX feels Web2 — our merchants don\'t even realize they\'re sending on-chain transactions.',
                },
            ]}
            googleReviewsHeading="What Web3 Founders Say About Us"
            googleReviewsSubtitle="Verified reviews from founders, CTOs, and protocol leads we've shipped on-chain products with."
            faqs={[
                { q: 'What blockchains do you build on?', a: 'Ethereum, Polygon, Solana, BNB Chain, Avalanche, Arbitrum, Optimism, Base, and more. We help you pick the right chain for your use case.' },
                { q: 'Do you audit smart contracts before launch?', a: 'Yes. We run internal audits, write extensive test suites, and coordinate third-party audits with reputable firms before mainnet deployment.' },
                { q: 'Can you build NFT marketplaces and minting platforms?', a: 'Yes. We build full marketplaces with minting, royalties, auctions, lazy-mint, and integrations with IPFS/Arweave.' },
                { q: 'Do you help with tokenomics design?', a: 'Yes. We model token supply, distribution, incentives, vesting, and governance to create sustainable token economies.' },
                { q: 'Is enterprise/private blockchain supported?', a: 'Yes. We build on Hyperledger Fabric, Quorum, and Corda for permissioned enterprise deployments.' },
                { q: 'How long does a typical blockchain project take?', a: 'A focused dApp or NFT marketplace usually ships in 8–14 weeks. Larger DeFi or cross-chain platforms typically run 4–6 months including audit cycles.' },
                { q: 'Do you provide post-launch monitoring and support?', a: 'Yes. We monitor on-chain activity, gas usage, oracle health, and respond to incidents 24/7.' },
            ]}
        />
    );
}
