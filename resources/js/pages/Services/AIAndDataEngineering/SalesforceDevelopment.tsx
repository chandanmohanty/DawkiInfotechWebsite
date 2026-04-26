import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ServicePageTemplate, { ICON } from '@/components/ServicePageTemplate';

/* ===========================================================================
 * Section 1: Salesforce Lightning Opportunity Mockup
 * =========================================================================== */
const STAGES = [
    { name: 'Prospecting',     state: 'done' as const },
    { name: 'Qualification',   state: 'done' as const },
    { name: 'Needs Analysis',  state: 'done' as const },
    { name: 'Proposal',        state: 'current' as const },
    { name: 'Negotiation',     state: 'next' as const },
    { name: 'Closed Won',      state: 'next' as const },
];

const SalesforceLightningMockup: React.FC = () => (
    <section className="dawki-sfd-light">
        <div className="container">
            <div className="dawki-sfd-light-heading">
                <span className="dawki-sfd-light-pill">
                    <span></span>
                    Lightning Experience
                </span>
                <h2 className="dawki-sfd-light-title">
                    Salesforce Built <span>The Way Your Sales Team Sells</span>
                </h2>
                <p className="dawki-sfd-light-subtitle">
                    Custom record pages, Path stages tuned to your funnel, and Lightning Web Components that make reps love opening Salesforce — not avoid it.
                </p>
            </div>

            <motion.div
                className="dawki-sfd-light-window"
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.85, ease: [0.2, 0.8, 0.2, 1] }}
            >
                {/* Top app bar */}
                <div className="dawki-sfd-light-topbar">
                    <span className="dawki-sfd-light-topbar-launcher">
                        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <circle cx="6"  cy="6"  r="2.2" />
                            <circle cx="12" cy="6"  r="2.2" />
                            <circle cx="18" cy="6"  r="2.2" />
                            <circle cx="6"  cy="12" r="2.2" />
                            <circle cx="12" cy="12" r="2.2" />
                            <circle cx="18" cy="12" r="2.2" />
                            <circle cx="6"  cy="18" r="2.2" />
                            <circle cx="12" cy="18" r="2.2" />
                            <circle cx="18" cy="18" r="2.2" />
                        </svg>
                    </span>
                    <span className="dawki-sfd-light-topbar-app">Sales</span>
                    <div className="dawki-sfd-light-topbar-tabs">
                        <span className="dawki-sfd-light-topbar-tab">Home</span>
                        <span className="dawki-sfd-light-topbar-tab">Accounts</span>
                        <span className="dawki-sfd-light-topbar-tab">Contacts</span>
                        <span className="dawki-sfd-light-topbar-tab dawki-sfd-light-topbar-tab--active">Opportunities</span>
                        <span className="dawki-sfd-light-topbar-tab">Leads</span>
                        <span className="dawki-sfd-light-topbar-tab">Reports</span>
                        <span className="dawki-sfd-light-topbar-tab">Dashboards</span>
                    </div>
                    <div className="dawki-sfd-light-topbar-search">Search Salesforce…</div>
                </div>

                {/* Sub-nav with breadcrumb */}
                <div className="dawki-sfd-light-subnav">
                    <span className="dawki-sfd-light-subnav-icon">$</span>
                    <span className="dawki-sfd-light-subnav-bread">Opportunities</span>
                    <span className="dawki-sfd-light-subnav-chev">›</span>
                    <span className="dawki-sfd-light-subnav-current">Acme Corp – Q4 Renewal &amp; Expansion</span>
                </div>

                {/* Record header */}
                <div className="dawki-sfd-light-record">
                    <div className="dawki-sfd-light-record-eyebrow">Opportunity</div>
                    <div className="dawki-sfd-light-record-title-row">
                        <span className="dawki-sfd-light-record-title-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <text x="12" y="17" textAnchor="middle" fontSize="14" fontWeight="900">$</text>
                            </svg>
                        </span>
                        <span className="dawki-sfd-light-record-title">Acme Corp – Q4 Renewal &amp; Expansion</span>
                        <div className="dawki-sfd-light-record-actions">
                            <span className="dawki-sfd-light-record-btn">Edit</span>
                            <span className="dawki-sfd-light-record-btn dawki-sfd-light-record-btn--primary">Mark Stage as Complete</span>
                        </div>
                    </div>
                    <div className="dawki-sfd-light-record-meta">
                        <div>
                            <div className="dawki-sfd-light-record-meta-key">Account</div>
                            <div className="dawki-sfd-light-record-meta-val" style={{ color: '#0070d2' }}>Acme Corporation</div>
                        </div>
                        <div>
                            <div className="dawki-sfd-light-record-meta-key">Amount</div>
                            <div className="dawki-sfd-light-record-meta-val">$248,500</div>
                        </div>
                        <div>
                            <div className="dawki-sfd-light-record-meta-key">Close Date</div>
                            <div className="dawki-sfd-light-record-meta-val">12/15/2026</div>
                        </div>
                        <div>
                            <div className="dawki-sfd-light-record-meta-key">Owner</div>
                            <div className="dawki-sfd-light-record-meta-val" style={{ color: '#0070d2' }}>Priya Mahajan</div>
                        </div>
                    </div>
                </div>

                {/* Path / Stage strip */}
                <div className="dawki-sfd-light-path">
                    {STAGES.map((s, i) => (
                        <motion.div
                            key={s.name}
                            className={`dawki-sfd-light-path-step${s.state === 'done' ? ' dawki-sfd-light-path-step--done' : ''}${s.state === 'current' ? ' dawki-sfd-light-path-step--current' : ''}`}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
                        >
                            {s.state === 'done' && (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                            )}
                            <span className="dawki-sfd-light-path-step-label">{s.name}</span>
                        </motion.div>
                    ))}
                </div>

                {/* Body */}
                <div className="dawki-sfd-light-body">
                    {/* Left col — details + activity */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <motion.div
                            className="dawki-sfd-light-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                        >
                            <div className="dawki-sfd-light-card-header">
                                Opportunity Details
                                <span className="dawki-sfd-light-card-header-actions">View All</span>
                            </div>
                            <div className="dawki-sfd-light-card-body">
                                <div className="dawki-sfd-light-fields">
                                    <div>
                                        <div className="dawki-sfd-light-field-key">Probability</div>
                                        <div className="dawki-sfd-light-field-val">75%</div>
                                    </div>
                                    <div>
                                        <div className="dawki-sfd-light-field-key">Type</div>
                                        <div className="dawki-sfd-light-field-val">Existing Customer · Upgrade</div>
                                    </div>
                                    <div>
                                        <div className="dawki-sfd-light-field-key">Lead Source</div>
                                        <div className="dawki-sfd-light-field-val">Account Manager Referral</div>
                                    </div>
                                    <div>
                                        <div className="dawki-sfd-light-field-key">Forecast Category</div>
                                        <div className="dawki-sfd-light-field-val">Best Case</div>
                                    </div>
                                    <div>
                                        <div className="dawki-sfd-light-field-key">Next Step</div>
                                        <div className="dawki-sfd-light-field-val">Send revised pricing — due Thu</div>
                                    </div>
                                    <div>
                                        <div className="dawki-sfd-light-field-key">Created By</div>
                                        <div className="dawki-sfd-light-field-val"><a>Priya Mahajan</a> — 14d ago</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="dawki-sfd-light-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ delay: 0.62, duration: 0.5 }}
                        >
                            <div className="dawki-sfd-light-card-header">
                                Activity
                                <span className="dawki-sfd-light-card-header-actions">+ New Task</span>
                            </div>
                            <div className="dawki-sfd-light-card-body" style={{ paddingTop: 0 }}>
                                <div className="dawki-sfd-light-activity">
                                    <div className="dawki-sfd-light-activity-item">
                                        <span className="dawki-sfd-light-activity-icon" style={{ ['--act-bg' as string]: 'linear-gradient(135deg, #4f7cff, #06b6d4)' }}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                        </span>
                                        <div className="dawki-sfd-light-activity-content">
                                            <div className="dawki-sfd-light-activity-title">Discovery call with CFO &amp; Procurement</div>
                                            <div className="dawki-sfd-light-activity-meta">Logged by Priya · Yesterday at 10:30 AM · 47 min</div>
                                        </div>
                                    </div>
                                    <div className="dawki-sfd-light-activity-item">
                                        <span className="dawki-sfd-light-activity-icon" style={{ ['--act-bg' as string]: 'linear-gradient(135deg, #ec4899, #f97316)' }}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                        </span>
                                        <div className="dawki-sfd-light-activity-content">
                                            <div className="dawki-sfd-light-activity-title">Sent revised proposal v3</div>
                                            <div className="dawki-sfd-light-activity-meta">Email · 2 days ago · Opened 4 times by 3 contacts</div>
                                        </div>
                                    </div>
                                    <div className="dawki-sfd-light-activity-item">
                                        <span className="dawki-sfd-light-activity-icon" style={{ ['--act-bg' as string]: 'linear-gradient(135deg, #a855f7, #4f7cff)' }}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                        </span>
                                        <div className="dawki-sfd-light-activity-content">
                                            <div className="dawki-sfd-light-activity-title">Einstein Score updated: 78 → 84</div>
                                            <div className="dawki-sfd-light-activity-meta">Predicted to close · 3 days ago</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right col — related lists */}
                    <motion.div
                        className="dawki-sfd-light-card"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ delay: 0.55, duration: 0.5 }}
                    >
                        <div className="dawki-sfd-light-card-header">
                            Related
                            <span className="dawki-sfd-light-card-header-actions">View All</span>
                        </div>
                        <div className="dawki-sfd-light-related">
                            <div className="dawki-sfd-light-related-row">
                                <span className="dawki-sfd-light-related-row-icon" style={{ ['--rel-bg' as string]: 'linear-gradient(135deg, #4f7cff, #06b6d4)' }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg>
                                </span>
                                <div className="dawki-sfd-light-related-row-content">
                                    <div className="dawki-sfd-light-related-row-name">Daniel Cho — VP Operations</div>
                                    <div className="dawki-sfd-light-related-row-sub">Decision Maker · Last contact 1d ago</div>
                                </div>
                            </div>
                            <div className="dawki-sfd-light-related-row">
                                <span className="dawki-sfd-light-related-row-icon" style={{ ['--rel-bg' as string]: 'linear-gradient(135deg, #4f7cff, #06b6d4)' }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg>
                                </span>
                                <div className="dawki-sfd-light-related-row-content">
                                    <div className="dawki-sfd-light-related-row-name">Mia Lindgren — CFO</div>
                                    <div className="dawki-sfd-light-related-row-sub">Economic Buyer · Joined yesterday's call</div>
                                </div>
                            </div>
                            <div className="dawki-sfd-light-related-row">
                                <span className="dawki-sfd-light-related-row-icon" style={{ ['--rel-bg' as string]: 'linear-gradient(135deg, #ec4899, #f97316)' }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                </span>
                                <div className="dawki-sfd-light-related-row-content">
                                    <div className="dawki-sfd-light-related-row-name">Acme_Proposal_v3.pdf</div>
                                    <div className="dawki-sfd-light-related-row-sub">Files · 4.2 MB · 2 days ago</div>
                                </div>
                            </div>
                            <div className="dawki-sfd-light-related-row">
                                <span className="dawki-sfd-light-related-row-icon" style={{ ['--rel-bg' as string]: 'linear-gradient(135deg, #22c55e, #06b6d4)' }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>
                                </span>
                                <div className="dawki-sfd-light-related-row-content">
                                    <div className="dawki-sfd-light-related-row-name">Account Health: 92 / Strong</div>
                                    <div className="dawki-sfd-light-related-row-sub">Last NPS: 9 · CSAT: 4.6 · 0 open cases</div>
                                </div>
                            </div>
                            <div className="dawki-sfd-light-related-row">
                                <span className="dawki-sfd-light-related-row-icon" style={{ ['--rel-bg' as string]: 'linear-gradient(135deg, #a855f7, #4f7cff)' }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                </span>
                                <div className="dawki-sfd-light-related-row-content">
                                    <div className="dawki-sfd-light-related-row-name">Einstein Insights</div>
                                    <div className="dawki-sfd-light-related-row-sub">"Add a Procurement contact to lift win rate by 14%"</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    </section>
);

/* ===========================================================================
 * Section 2: Salesforce Object Schema ERD
 * =========================================================================== */
type SfObj = {
    id: string;
    name: string;
    a: string; b: string;
    x: number; y: number;
    fields: { name: string; type: string; key?: 'pk' | 'fk' }[];
};

const OBJECTS: SfObj[] = [
    {
        id: 'account',
        name: 'Account',
        a: '#06b6d4', b: '#4f7cff',
        x: 18, y: 30,
        fields: [
            { name: 'Id',         type: 'Id',       key: 'pk' },
            { name: 'Name',       type: 'Text(255)' },
            { name: 'Industry',   type: 'Picklist'  },
            { name: 'AnnualRev',  type: 'Currency'  },
            { name: 'OwnerId',    type: 'Lookup(User)', key: 'fk' },
        ],
    },
    {
        id: 'contact',
        name: 'Contact',
        a: '#a855f7', b: '#4f7cff',
        x: 50, y: 18,
        fields: [
            { name: 'Id',         type: 'Id',       key: 'pk' },
            { name: 'AccountId',  type: 'Lookup',   key: 'fk' },
            { name: 'Name',       type: 'Text(255)' },
            { name: 'Email',      type: 'Email'     },
            { name: 'Title',      type: 'Text(80)'  },
        ],
    },
    {
        id: 'opportunity',
        name: 'Opportunity',
        a: '#ec4899', b: '#a855f7',
        x: 50, y: 56,
        fields: [
            { name: 'Id',         type: 'Id',       key: 'pk' },
            { name: 'AccountId',  type: 'Lookup',   key: 'fk' },
            { name: 'Name',       type: 'Text(120)' },
            { name: 'Amount',     type: 'Currency'  },
            { name: 'StageName',  type: 'Picklist'  },
            { name: 'CloseDate',  type: 'Date'      },
        ],
    },
    {
        id: 'lead',
        name: 'Lead',
        a: '#fbbf24', b: '#f97316',
        x: 82, y: 22,
        fields: [
            { name: 'Id',          type: 'Id',       key: 'pk' },
            { name: 'Name',        type: 'Text(255)' },
            { name: 'Company',     type: 'Text(255)' },
            { name: 'Status',      type: 'Picklist'  },
            { name: 'ConvertedAccountId', type: 'Lookup', key: 'fk' },
        ],
    },
    {
        id: 'case',
        name: 'Case',
        a: '#22c55e', b: '#06b6d4',
        x: 18, y: 72,
        fields: [
            { name: 'Id',          type: 'Id',       key: 'pk' },
            { name: 'AccountId',   type: 'Lookup',   key: 'fk' },
            { name: 'ContactId',   type: 'Lookup',   key: 'fk' },
            { name: 'Subject',     type: 'Text(255)' },
            { name: 'Priority',    type: 'Picklist'  },
        ],
    },
    {
        id: 'activity',
        name: 'Activity / Task',
        a: '#f97316', b: '#ec4899',
        x: 82, y: 76,
        fields: [
            { name: 'Id',          type: 'Id',       key: 'pk' },
            { name: 'WhatId',      type: 'Polymorphic FK', key: 'fk' },
            { name: 'WhoId',       type: 'Polymorphic FK', key: 'fk' },
            { name: 'Subject',     type: 'Text(255)' },
            { name: 'Status',      type: 'Picklist'  },
        ],
    },
];

const findObj = (id: string) => OBJECTS.find((o) => o.id === id)!;

const REL_EDGES = [
    { from: 'account', to: 'contact',     label: '1 : N' },
    { from: 'account', to: 'opportunity', label: '1 : N' },
    { from: 'contact', to: 'opportunity', label: 'N : N' },
    { from: 'lead',    to: 'account',     label: '→ converts' },
    { from: 'account', to: 'case',        label: '1 : N' },
    { from: 'contact', to: 'case',        label: '1 : N' },
    { from: 'opportunity', to: 'activity', label: '1 : N' },
    { from: 'case',    to: 'activity',    label: '1 : N' },
];

const buildPathSf = (fromId: string, toId: string) => {
    const a = findObj(fromId);
    const b = findObj(toId);
    const x1 = a.x;
    const y1 = a.y;
    const x2 = b.x;
    const y2 = b.y;
    const cx = (x1 + x2) / 2 + (y1 - y2) * 0.15;
    const cy = (y1 + y2) / 2 + (x2 - x1) * 0.15;
    return { d: `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`, midX: cx, midY: cy };
};

const SalesforceERD: React.FC = () => (
    <section className="dawki-sfd-erd">
        <div className="container">
            <div className="dawki-sfd-erd-heading">
                <span className="dawki-sfd-erd-pill">
                    <span></span>
                    Object Schema
                </span>
                <h2 className="dawki-sfd-erd-title">
                    Standard Objects, <span>Custom Relationships</span>
                </h2>
                <p className="dawki-sfd-erd-subtitle">
                    Every Salesforce build starts with a clean data model. Here's the standard object backbone we extend with custom objects, lookups, and master-detail relationships per project.
                </p>
            </div>

            <motion.div
                className="dawki-sfd-erd-frame"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
            >
                {/* SVG edges (desktop only) */}
                <svg className="dawki-sfd-erd-edges" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                    {REL_EDGES.map((e, i) => {
                        const { d, midX, midY } = buildPathSf(e.from, e.to);
                        return (
                            <g key={`${e.from}-${e.to}`}>
                                <motion.path
                                    d={d}
                                    className="dawki-sfd-erd-edge"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    whileInView={{ pathLength: 1, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.95, delay: 0.5 + i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
                                />
                                <motion.text
                                    x={midX}
                                    y={midY - 1.2}
                                    className="dawki-sfd-erd-edge-label"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 1.4 + i * 0.06, duration: 0.4 }}
                                >
                                    {e.label}
                                </motion.text>
                            </g>
                        );
                    })}
                </svg>

                {/* Object cards (positioned for desktop, stacked on mobile) */}
                {OBJECTS.map((obj, i) => (
                    <motion.div
                        key={obj.id}
                        className="dawki-sfd-erd-obj"
                        style={{
                            left: `${obj.x}%`,
                            top: `${obj.y}%`,
                            ['--obj-a' as string]: obj.a,
                            ['--obj-b' as string]: obj.b,
                        }}
                        initial={{ opacity: 0, scale: 0.85 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                    >
                        <div className="dawki-sfd-erd-obj-head">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <ellipse cx="12" cy="5" rx="9" ry="3" />
                                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                            </svg>
                            {obj.name}
                            <span className="dawki-sfd-erd-obj-head-pk">SObject</span>
                        </div>
                        <div className="dawki-sfd-erd-obj-fields">
                            {obj.fields.map((f) => (
                                <div key={f.name} className="dawki-sfd-erd-obj-field">
                                    <span className="dawki-sfd-erd-obj-field-key">
                                        <span className={`dawki-sfd-erd-obj-field-key-icon${f.key === 'pk' ? ' dawki-sfd-erd-obj-field-key-icon--pk' : ''}${f.key === 'fk' ? ' dawki-sfd-erd-obj-field-key-icon--fk' : ''}`}>
                                            {f.key === 'pk' ? 'PK' : f.key === 'fk' ? 'FK' : '·'}
                                        </span>
                                        {f.name}
                                    </span>
                                    <span className="dawki-sfd-erd-obj-field-type">{f.type}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <div className="dawki-sfd-erd-legend">
                <span className="dawki-sfd-erd-legend-item">
                    <span className="dawki-sfd-erd-legend-marker" style={{ ['--leg-color' as string]: '#fbbf24' }}>PK</span>
                    Primary Key
                </span>
                <span className="dawki-sfd-erd-legend-item">
                    <span className="dawki-sfd-erd-legend-marker" style={{ ['--leg-color' as string]: '#93c5fd' }}>FK</span>
                    Foreign Key (Lookup)
                </span>
                <span className="dawki-sfd-erd-legend-item">
                    <span className="dawki-sfd-erd-legend-marker">1 : N</span>
                    One to Many
                </span>
                <span className="dawki-sfd-erd-legend-item">
                    <span className="dawki-sfd-erd-legend-marker">N : N</span>
                    Many to Many (Junction)
                </span>
            </div>
        </div>
    </section>
);

/* ===========================================================================
 * Section 3: Salesforce Video Showcase
 * =========================================================================== */
const SalesforceVideo: React.FC = () => {
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
                        Inside The Org
                    </span>
                    <h2 className="dawki-ent-video-title">
                        See How We Build <span>Salesforce That Sales Teams Love</span>
                    </h2>
                    <p className="dawki-ent-video-subtitle">
                        A behind-the-scenes look at how we configure, code, and roll out Salesforce — from data model design to Lightning UI to Einstein and Agentforce.
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

/* ===========================================================================
 * Page
 * =========================================================================== */
export default function SalesforceDevelopment() {
    return (
        <ServicePageTemplate
            pageTitle="Salesforce Development"
            breadcrumbCategory="AI & Data Engineering"
            heroPill="AI & Data Engineering"
            heroTitleStart="Salesforce"
            heroTitleHighlight="Development"
            heroSubtitle="Salesforce implementation, customization, integration, and AI — Sales, Service, Marketing, Commerce, Data, and Einstein, done right."
            heroVideoSrc="/assets/images/header/demo/salesforce-development.mp4"
            featuresPill="Salesforce Excellence"
            featuresTitleStart="Salesforce That Works"
            featuresTitleHighlight="The Way You Do"
            featuresSubtitle="Implementation, customization, integration, and AI — across Sales Cloud, Service Cloud, Marketing Cloud, and the wider Salesforce ecosystem."
            features={[
                { title: 'Certified Salesforce Experts', desc: 'Admins, developers, architects, and consultants — Salesforce certified across clouds.', icon: '🎓' },
                { title: 'Sales, Service & Marketing Cloud', desc: 'Implementation and customization across the core Salesforce platform.', icon: '☁️' },
                { title: 'Apex, LWC & Flows', desc: 'Custom code, Lightning Web Components, and declarative automation done right.', icon: '⚡' },
                { title: 'Einstein AI & Agentforce', desc: 'Predictive AI, generative AI, and Agentforce agents inside Salesforce.', icon: '🤖' },
                { title: 'Integrations', desc: 'MuleSoft, REST/SOAP APIs, ETL, and middleware integrations to ERP and beyond.', icon: '🔗' },
                { title: 'Data Cloud & Tableau', desc: 'Customer 360 unification with Data Cloud and analytics in Tableau.', icon: '📊' },
            ]}
            processSteps={[
                { n: '01', t: 'Discovery', d: 'Process mapping, stakeholder workshops, and Salesforce architecture review.' },
                { n: '02', t: 'Design', d: 'Solution design, data model, security, and integration blueprint.' },
                { n: '03', t: 'Build & Configure', d: 'Declarative + Apex/LWC build with sandbox-first development.' },
                { n: '04', t: 'Deploy & Adopt', d: 'UAT, training, go-live, and post-launch hyper-care.' },
            ]}
            servicesPill="Our Capabilities"
            servicesTitleStart="Salesforce"
            servicesTitleHighlight="Services We Offer"
            servicesSubtitle="Full-lifecycle Salesforce services across all major clouds and integrations."
            servicesLayout="timeline"
            serviceCards={[
                { title: 'Salesforce Consulting', desc: 'Strategy, roadmaps, license optimization, and architecture reviews.', icon: ICON.target },
                { title: 'Sales Cloud Implementation', desc: 'Lead-to-cash automation, pipeline management, and forecasting.', icon: ICON.chart },
                { title: 'Service Cloud Implementation', desc: 'Omnichannel cases, knowledge, Service Console, and field service.', icon: ICON.headset },
                { title: 'Marketing Cloud & Pardot', desc: 'Journeys, segmentation, email, and account-based marketing automation.', icon: ICON.megaphone },
                { title: 'Commerce Cloud (B2B & B2C)', desc: 'Storefronts, catalog, checkout, and order management on Salesforce Commerce.', icon: ICON.box },
                { title: 'Custom App Development', desc: 'Custom Salesforce apps using Apex, Lightning Web Components, and platform events.', icon: ICON.code },
                { title: 'Salesforce Integrations', desc: 'MuleSoft, ERP, finance, marketing, and custom system integrations.', icon: ICON.link },
                { title: 'Data Cloud & Customer 360', desc: 'Unify customer data, identity resolution, and activate audiences.', icon: ICON.database },
                { title: 'Einstein AI & Agentforce', desc: 'Predictive scoring, generative AI, and Agentforce autonomous agents.', icon: ICON.bot },
                { title: 'Salesforce Migration', desc: 'Migrate from Classic to Lightning, or from other CRMs to Salesforce.', icon: ICON.refresh },
                { title: 'Salesforce Managed Services', desc: 'Admin, dev, and architect support on a flexible monthly retainer.', icon: ICON.cog },
                { title: 'AppExchange Product Development', desc: 'Build, package, and list managed and unmanaged AppExchange products.', icon: ICON.rocket },
            ]}
            toolsTitleStart="Salesforce Stack &"
            toolsTitleHighlight="Tools We Build With"
            toolsSubtitle="A purpose-built Salesforce stack — clouds, languages, AI, integrations, and DevOps — operated end-to-end across implementations."
            toolsLayout="vertical"
            tools={[
                { n: 'Sales Cloud',          s: 'salesforce',  c: '00A1E0', desc: 'Lead-to-cash automation, pipeline forecasting, and rep productivity — the core Salesforce CRM platform.' },
                { n: 'Service Cloud',        s: 'salesforce',  c: '00A1E0', desc: 'Omnichannel case management, knowledge bases, Service Console, and field service operations.' },
                { n: 'Marketing Cloud',      s: 'salesforce',  c: '00A1E0', desc: 'Journey Builder, Email Studio, Mobile Studio, and Account Engagement (Pardot) for B2B & B2C.' },
                { n: 'Commerce Cloud',       s: 'salesforce',  c: '00A1E0', desc: 'B2B and B2C storefronts, catalog, checkout, and order management on Salesforce Commerce.' },
                { n: 'Experience Cloud',     s: 'salesforce',  c: '00A1E0', desc: 'Customer, partner, and employee portals built on Lightning — branded and self-service-first.' },
                { n: 'Data Cloud',           s: 'salesforce',  c: '00A1E0', desc: 'Customer 360 data unification, identity resolution, and activation across every Salesforce cloud.' },
                { n: 'Apex',                 s: 'salesforce',  c: '00A1E0', desc: 'Salesforce\'s server-side language — triggers, batch jobs, and custom REST/SOAP services.' },
                { n: 'Lightning Web Components', s: 'salesforce', c: '00A1E0', desc: 'Modern web standards inside Salesforce — composable UI built with HTML, CSS, and JavaScript.' },
                { n: 'Salesforce Flow',      s: 'salesforce',  c: '00A1E0', desc: 'Declarative automation builder — record-triggered, screen flows, and orchestrations without code.' },
                { n: 'Einstein AI',          s: 'salesforce',  c: '00A1E0', desc: 'Predictive scoring, recommendations, and generative AI native to the Salesforce platform.' },
                { n: 'Agentforce',           s: 'salesforce',  c: '00A1E0', desc: 'Autonomous AI agents inside Salesforce — service, sales, and operations agents with built-in guardrails.' },
                { n: 'MuleSoft',             s: 'mulesoft',    c: '00A0DF', desc: 'Anypoint Platform for API-led integration — Salesforce ↔ ERP, finance, marketing, and custom systems.' },
                { n: 'Tableau',              s: 'tableau',     c: 'E97627', desc: 'Embedded analytics and BI on Salesforce data — dashboards, AI-driven insights, and Slack alerts.' },
                { n: 'Slack',                s: 'slack',       c: '4A154B', desc: 'Salesforce-owned collaboration — connect Sales Cloud records, Service alerts, and Slack workflows.' },
                { n: 'Heroku',               s: 'heroku',      c: '430098', desc: 'Salesforce-owned PaaS — custom apps in Node, Ruby, Python, Java that integrate with Salesforce.' },
                { n: 'DevOps Center',        s: 'salesforce',  c: '00A1E0', desc: 'Salesforce-native source control + change management — sandbox to prod with full audit trail.' },
            ]}
            hideProjects={true}
            hideTestimonial={true}
            showClients={true}
            clientsPill="Trusted By Salesforce Teams"
            clientsHeading="From New Implementations to 10-Year Orgs,"
            clientsHeadingHighlight="We Make Salesforce Work Harder"
            extraSections={
                <>
                    <SalesforceLightningMockup />
                    <SalesforceERD />
                    <SalesforceVideo />
                </>
            }
            googleReviews={[
                {
                    name: 'Daniel Cho',
                    role: 'VP Sales Ops, Vertex Manufacturing',
                    rating: 5,
                    date: '2 months ago',
                    text: 'Their Sales Cloud + Einstein build replaced four spreadsheets and a homegrown forecasting tool. Pipeline forecast accuracy climbed from ~58% to 86% in two quarters.',
                },
                {
                    name: 'Imani Brooks',
                    role: 'Head of CX, Brightline Health',
                    rating: 5,
                    date: '4 months ago',
                    text: 'Service Cloud rollout across 38 clinics — omnichannel cases, knowledge, and Einstein article recommendations. Average case resolution dropped from 18h to 4h.',
                },
                {
                    name: 'Mateo Rivera',
                    role: 'CTO, MeshCart',
                    rating: 5,
                    date: '6 months ago',
                    text: 'They built our B2B Commerce Cloud storefront with custom LWC and a MuleSoft integration to NetSuite. Order-to-cash latency dropped 70% and our ops team finally stopped dual-keying.',
                },
                {
                    name: 'Sofia Müller',
                    role: 'Director of Marketing, Northsail Travel',
                    rating: 5,
                    date: '3 months ago',
                    text: 'Marketing Cloud journeys + Data Cloud unification brought our email engagement up 38% and let us actually segment by lifetime value for the first time.',
                },
                {
                    name: 'Jonas Lindqvist',
                    role: 'Salesforce Architect, FinFleet',
                    rating: 5,
                    date: '5 months ago',
                    text: 'Migration from Classic to Lightning + a re-architected data model with proper master-detail relationships. Page-load times halved and our admin team stopped firefighting.',
                },
                {
                    name: 'Anika Kowalski',
                    role: 'Head of Operations, Pulsemark Labs',
                    rating: 5,
                    date: '7 months ago',
                    text: 'AppExchange managed package built and listed in 14 weeks — passed security review on first attempt. Our partner channel was selling it within the first quarter.',
                },
            ]}
            googleReviewsHeading="What Salesforce Leaders Say About Us"
            googleReviewsSubtitle="Verified reviews from VPs of Sales Ops, CTOs, Salesforce architects, and admins we've shipped Salesforce builds with."
            faqs={[
                { q: 'What does Salesforce development include?', a: 'Configuration, declarative automation (Flows), Apex code, Lightning Web Components, integrations, data modeling, and AI — across Sales, Service, Marketing, Commerce, and Platform.' },
                { q: 'Are your developers Salesforce certified?', a: 'Yes. Our team holds Admin, Platform Developer I/II, App Builder, Sales Cloud, Service Cloud, Marketing Cloud, and Architect certifications.' },
                { q: 'Can you migrate us from another CRM to Salesforce?', a: 'Yes. We migrate from HubSpot, Dynamics, Zoho, Pipedrive, and legacy systems — with data mapping, dedup, and validation.' },
                { q: 'Do you build on the AppExchange?', a: 'Yes. We design, build, package, and list both managed and unmanaged AppExchange products.' },
                { q: 'Can you integrate Salesforce with our ERP?', a: 'Yes. We integrate Salesforce with SAP, Oracle, NetSuite, Microsoft Dynamics, and custom ERPs via MuleSoft or direct APIs.' },
                { q: 'How does Einstein AI / Agentforce fit in?', a: 'We implement Einstein scoring, predictions, generative AI, and Agentforce autonomous agents across Sales and Service flows.' },
                { q: 'Do you offer ongoing Salesforce support?', a: 'Yes. We provide managed services covering admin, development, and architecture on flexible monthly contracts.' },
            ]}
        />
    );
}
