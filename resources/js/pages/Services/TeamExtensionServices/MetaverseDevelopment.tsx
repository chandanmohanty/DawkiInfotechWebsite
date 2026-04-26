import ServicePageTemplate, { ICON } from '@/components/ServicePageTemplate';

export default function MetaverseDevelopment() {
    return (
        <ServicePageTemplate
            pageTitle="Metaverse Development"
            breadcrumbCategory="Team Extension Services"
            heroPill="Team Extension Services"
            heroTitleStart="Metaverse"
            heroTitleHighlight="Development"
            heroSubtitle="Immersive 3D worlds, AR/VR experiences, and Web3-enabled metaverse platforms — built with Unity, Unreal, and WebXR."
            featuresPill="Immersive Engineering"
            featuresTitleStart="Bringing Worlds"
            featuresTitleHighlight="To Life"
            featuresSubtitle="From training simulations to virtual storefronts — we build immersive 3D, AR, and VR experiences with production-grade quality."
            features={[
                { title: 'Cross-Platform Headsets', desc: 'Meta Quest, Apple Vision Pro, HTC Vive, PSVR — one codebase, multiple devices.', icon: '🥽' },
                { title: 'Unity & Unreal Engine', desc: 'Production-grade engineering on the world\'s leading 3D engines.', icon: '🎮' },
                { title: 'WebXR & Browser-Based', desc: 'Frictionless 3D and VR experiences delivered straight to a browser.', icon: '🌐' },
                { title: '3D Asset Pipeline', desc: 'Modeling, texturing, rigging, and optimization for real-time rendering.', icon: '🧊' },
                { title: 'Web3 Integration', desc: 'NFT-gated experiences, on-chain assets, and crypto-native economies.', icon: '⛓️' },
                { title: 'Multi-User Real-Time', desc: 'Photon, Mirror, Colyseus — real-time multiplayer with voice and physics.', icon: '👥' },
            ]}
            processSteps={[
                { n: '01', t: 'Concept', d: 'Define experience, audience, success metrics, and platform mix.' },
                { n: '02', t: 'Prototype', d: 'Playable prototype in 3–5 weeks for fast iteration.' },
                { n: '03', t: 'Production', d: 'Full asset pipeline, engineering, QA, and platform optimization.' },
                { n: '04', t: 'Launch & Operate', d: 'Store submissions, live ops, content updates, and analytics.' },
            ]}
            servicesPill="Our Capabilities"
            servicesTitleStart="Metaverse"
            servicesTitleHighlight="Services We Offer"
            servicesSubtitle="A full-stack metaverse practice — from 3D asset production to multiplayer infrastructure."
            serviceCards={[
                { title: 'Metaverse Strategy & Consulting', desc: 'Use-case discovery, platform selection, and go-to-market roadmaps.', icon: ICON.target },
                { title: 'VR App Development', desc: 'Meta Quest, Apple Vision Pro, HTC Vive, PSVR experiences in Unity and Unreal.', icon: ICON.rocket },
                { title: 'AR App Development', desc: 'iOS ARKit, Android ARCore, WebAR, and Apple Vision Pro spatial AR.', icon: ICON.eye },
                { title: 'WebXR & 3D Web', desc: 'Three.js, Babylon.js, and PlayCanvas browser-based 3D and VR experiences.', icon: ICON.globe },
                { title: '3D Asset Production', desc: 'Modeling, texturing, rigging, animation, and game-ready optimization.', icon: ICON.palette },
                { title: 'Multi-User Metaverse Platforms', desc: 'Real-time multiplayer worlds with voice, presence, and physics.', icon: ICON.users },
                { title: 'Virtual Showrooms & Stores', desc: 'Immersive 3D commerce experiences with try-on and product configurators.', icon: ICON.box },
                { title: 'Training Simulations', desc: 'VR and AR simulations for training, safety, and skills acquisition.', icon: ICON.shield },
                { title: 'Digital Twins', desc: 'Real-time digital replicas of factories, buildings, and equipment.', icon: ICON.cog },
                { title: 'NFT-Enabled Experiences', desc: 'Wearables, items, and lands tied to on-chain ownership.', icon: ICON.link },
                { title: 'Game Mechanics & Economy', desc: 'Loops, progression systems, and in-world economies that retain users.', icon: ICON.chart },
                { title: 'Live Ops & Maintenance', desc: 'Content updates, performance tuning, and platform-version compatibility.', icon: ICON.headset },
            ]}
            faqs={[
                { q: 'What is metaverse development?', a: 'Metaverse development covers building immersive 3D, VR, and AR experiences — often multi-user and sometimes Web3-enabled — for entertainment, training, commerce, or productivity.' },
                { q: 'Which platforms do you support?', a: 'Meta Quest, Apple Vision Pro, HTC Vive, PSVR, iOS/Android AR, and WebXR for browser-based experiences.' },
                { q: 'Do you handle 3D asset production?', a: 'Yes. We model, texture, rig, animate, and optimize 3D assets for real-time engines.' },
                { q: 'Which engines do you use?', a: 'Unity and Unreal Engine for native VR/AR; Three.js, Babylon.js, and PlayCanvas for WebXR.' },
                { q: 'Can you integrate Web3 and NFTs?', a: 'Yes. We build NFT-gated experiences, on-chain wearables, and tokenized in-world assets.' },
                { q: 'How long does a metaverse project take?', a: 'A focused VR or AR experience typically ships in 12–20 weeks. Multi-user platforms run 4–9 months.' },
                { q: 'Do you offer post-launch live ops?', a: 'Yes. We maintain experiences, ship content updates, and keep up with platform version changes.' },
            ]}
        />
    );
}
