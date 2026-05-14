import { Head, useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import PanelLayout from '@/layouts/PanelLayout';

interface PageProps {
    settings: {
        gtm_container_id: string;
        gtm_enabled: boolean;
        crm_endpoint_url: string;
        crm_enabled: boolean;
        site_phone: string;
    };
    site_url: string;
    flash?: { success?: string; error?: string };
    errors: Record<string, string>;
    [key: string]: unknown;
}

interface VerifyResponse {
    ok: boolean;
    reason: string;
    gtm_id?: string;
    fetched_url?: string;
    http_status?: number;
    checks?: {
        head_script: boolean;
        noscript_iframe: boolean;
        data_layer: boolean;
    };
}

interface CrmTestResponse {
    ok: boolean;
    reason: string;
    status?: number | null;
    response?: string | null;
    endpoint: string;
}

const GTM_REGEX = /^GTM-[A-Z0-9]{6,9}$/;

export default function Settings() {
    const { props } = usePage<PageProps>();
    const { settings, site_url, flash, errors: serverErrors } = props;

    const { data, setData, put, processing, recentlySuccessful } = useForm({
        gtm_container_id: settings.gtm_container_id || '',
        gtm_enabled: !!settings.gtm_enabled,
        crm_endpoint_url: settings.crm_endpoint_url || '',
        crm_enabled: !!settings.crm_enabled,
        site_phone: settings.site_phone || '',
    });

    const phoneDigits = useMemo(
        () => (data.site_phone || '').replace(/\D+/g, ''),
        [data.site_phone],
    );
    const isValidPhone = phoneDigits.length >= 8 && /^[\d\s+\-().]{8,32}$/.test(data.site_phone || '');

    const [verifyUrl, setVerifyUrl] = useState(site_url || '');
    const [verifying, setVerifying] = useState(false);
    const [verifyResult, setVerifyResult] = useState<VerifyResponse | null>(null);

    const [testingCrm, setTestingCrm] = useState(false);
    const [crmTestResult, setCrmTestResult] = useState<CrmTestResponse | null>(null);

    const trimmedCrmUrl = (data.crm_endpoint_url || '').trim();
    const isValidCrmUrl =
        trimmedCrmUrl === '' || /^https?:\/\/[^\s]+$/i.test(trimmedCrmUrl);
    const crmWillForward = data.crm_enabled && isValidCrmUrl && trimmedCrmUrl !== '';

    const trimmedId = (data.gtm_container_id || '').trim().toUpperCase();
    const isValidId = useMemo(() => trimmedId === '' || GTM_REGEX.test(trimmedId), [trimmedId]);
    const willEmitTags = data.gtm_enabled && GTM_REGEX.test(trimmedId);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/panel/settings', {
            preserveScroll: true,
            onSuccess: () => setVerifyResult(null),
        });
    };

    const csrfToken = () =>
        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null)?.content || '';

    const handleVerify = async () => {
        if (!verifyUrl) return;
        setVerifying(true);
        setVerifyResult(null);
        try {
            const res = await fetch('/panel/settings/verify-gtm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken(),
                    Accept: 'application/json',
                },
                body: JSON.stringify({ url: verifyUrl }),
            });
            const json = (await res.json()) as VerifyResponse;
            setVerifyResult(json);
        } catch (err) {
            setVerifyResult({
                ok: false,
                reason: 'Network error reaching the verifier. Check the dev tools console for details.',
            });
        } finally {
            setVerifying(false);
        }
    };

    const openTagAssistant = () => {
        const target = `https://tagassistant.google.com/#/?url=${encodeURIComponent(verifyUrl)}&source=admin`;
        window.open(target, '_blank', 'noopener');
    };

    const handleTestCrm = async () => {
        setTestingCrm(true);
        setCrmTestResult(null);
        try {
            const res = await fetch('/panel/settings/test-crm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken(),
                    Accept: 'application/json',
                },
                body: JSON.stringify({}),
            });
            const json = (await res.json()) as CrmTestResponse;
            setCrmTestResult(json);
        } catch (err) {
            setCrmTestResult({
                ok: false,
                reason: 'Network error reaching the verifier. Check the dev tools console.',
                endpoint: trimmedCrmUrl,
            });
        } finally {
            setTestingCrm(false);
        }
    };

    const previewHead = useMemo(() => {
        if (!willEmitTags) return '<!-- GTM disabled or no valid container ID -->';
        return `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${trimmedId}');</script>
<!-- End Google Tag Manager -->`;
    }, [trimmedId, willEmitTags]);

    const previewBody = useMemo(() => {
        if (!willEmitTags) return '';
        return `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${trimmedId}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`;
    }, [trimmedId, willEmitTags]);

    const statusBadge = willEmitTags ? (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            Live on the site
        </span>
    ) : (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
            Not emitting tags
        </span>
    );

    return (
        <PanelLayout>
            <Head title="Site Settings" />

            <div className="mx-auto max-w-5xl space-y-6">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Tracking tags and integrations that run on every page of the public site.
                        </p>
                    </div>
                    {statusBadge}
                </div>

                {/* Flash messages */}
                {flash?.success && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                        {flash.success}
                    </div>
                )}

                {/* === SETTINGS FORM === */}
                <form onSubmit={handleSubmit} className="space-y-6">

                {/* === CONTACT INFO CARD === */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-200 bg-gradient-to-br from-emerald-50/60 to-white p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm">
                                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    The phone number shown across the public site — header, footer, contact page, FAQ CTA, WhatsApp button on the Estimate page. One change here updates them all.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 p-6 md:grid-cols-3">
                        <div className="md:col-span-2">
                            <label htmlFor="site_phone" className="block text-sm font-medium text-gray-700">
                                Phone number
                            </label>
                            <div className="mt-1.5">
                                <input
                                    id="site_phone"
                                    type="tel"
                                    autoComplete="off"
                                    value={data.site_phone}
                                    onChange={(e) => setData('site_phone', e.target.value)}
                                    placeholder="+91 807 609 6255"
                                    className={`block w-full rounded-lg border bg-white px-3.5 py-2.5 font-mono text-sm tracking-wide shadow-sm transition focus:outline-none focus:ring-2 ${
                                        !isValidPhone && data.site_phone
                                            ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-200'
                                            : 'border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-emerald-200'
                                    }`}
                                />
                            </div>
                            {!isValidPhone && data.site_phone && (
                                <p className="mt-1.5 text-xs text-red-600">
                                    Phone must be 8–32 chars and contain at least 8 digits. Allowed: digits, +, spaces, dashes, parens, dots.
                                </p>
                            )}
                            {serverErrors.site_phone && (
                                <p className="mt-1.5 text-xs text-red-600">{serverErrors.site_phone}</p>
                            )}
                            <p className="mt-2 text-xs text-gray-500">
                                Type it the way visitors should see it. We derive the digits-only version (<code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs">{phoneDigits || '—'}</code>) automatically for <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs">tel:</code> and <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs">wa.me/</code> URLs.
                            </p>
                        </div>

                        {/* Live preview */}
                        <div>
                            <span className="block text-sm font-medium text-gray-700">How it appears</span>
                            <div className="mt-1.5 rounded-lg border border-emerald-200 bg-emerald-50/50 px-4 py-3">
                                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                                    <svg className="h-4 w-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                    {data.site_phone || '—'}
                                </div>
                                <p className="mt-2 text-xs text-emerald-700/80 break-all">
                                    Click target: <code className="font-mono">tel:+{phoneDigits || '—'}</code>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* === END CONTACT INFO CARD === */}

                {/* === GTM CARD === */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-200 bg-gradient-to-br from-indigo-50/60 to-white p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 shadow-sm">
                                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                    <path d="M2 17l10 5 10-5" />
                                    <path d="M2 12l10 5 10-5" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Google Tag Manager</h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Paste your container ID from{' '}
                                    <a className="text-indigo-600 hover:text-indigo-700 underline-offset-2 hover:underline" href="https://tagmanager.google.com/" target="_blank" rel="noopener noreferrer">
                                        tagmanager.google.com
                                    </a>
                                    . We&apos;ll inject both required snippets into every page of the public site.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 p-6 md:grid-cols-3">
                        {/* GTM ID Input */}
                        <div className="md:col-span-2">
                            <label htmlFor="gtm_container_id" className="block text-sm font-medium text-gray-700">
                                Container ID
                            </label>
                            <div className="mt-1.5 relative">
                                <input
                                    id="gtm_container_id"
                                    type="text"
                                    autoComplete="off"
                                    spellCheck={false}
                                    value={data.gtm_container_id}
                                    onChange={(e) => setData('gtm_container_id', e.target.value.toUpperCase())}
                                    placeholder="GTM-XXXXXXX"
                                    className={`block w-full rounded-lg border bg-white px-3.5 py-2.5 font-mono text-sm tracking-wide shadow-sm transition focus:outline-none focus:ring-2 ${
                                        !isValidId
                                            ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-200'
                                            : 'border-gray-300 text-gray-900 focus:border-indigo-500 focus:ring-indigo-200'
                                    }`}
                                />
                            </div>
                            {!isValidId && (
                                <p className="mt-1.5 text-xs text-red-600">
                                    Format should be <code className="rounded bg-red-50 px-1.5 py-0.5 font-mono">GTM-</code> followed by 6–9 uppercase letters or digits.
                                </p>
                            )}
                            {serverErrors.gtm_container_id && (
                                <p className="mt-1.5 text-xs text-red-600">{serverErrors.gtm_container_id}</p>
                            )}
                            <p className="mt-2 text-xs text-gray-500">
                                Leave blank to remove the snippet from the site entirely.
                            </p>
                        </div>

                        {/* Enabled Toggle */}
                        <div>
                            <span className="block text-sm font-medium text-gray-700">Status</span>
                            <button
                                type="button"
                                role="switch"
                                aria-checked={data.gtm_enabled}
                                onClick={() => setData('gtm_enabled', !data.gtm_enabled)}
                                className={`mt-1.5 flex w-full items-center justify-between gap-3 rounded-lg border px-3.5 py-2.5 transition ${
                                    data.gtm_enabled
                                        ? 'border-emerald-200 bg-emerald-50'
                                        : 'border-gray-200 bg-gray-50'
                                }`}
                            >
                                <span className={`text-sm font-medium ${data.gtm_enabled ? 'text-emerald-700' : 'text-gray-600'}`}>
                                    {data.gtm_enabled ? 'Enabled' : 'Disabled'}
                                </span>
                                <span
                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition ${
                                        data.gtm_enabled ? 'bg-emerald-500' : 'bg-gray-300'
                                    }`}
                                >
                                    <span
                                        className={`absolute top-0.5 left-0.5 h-5 w-5 transform rounded-full bg-white shadow transition ${
                                            data.gtm_enabled ? 'translate-x-5' : 'translate-x-0'
                                        }`}
                                    />
                                </span>
                            </button>
                            <p className="mt-2 text-xs text-gray-500">
                                Temporarily disable without losing the ID.
                            </p>
                        </div>
                    </div>

                </div>
                {/* === END GTM CARD === */}

                {/* === CRM CARD === */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-200 bg-gradient-to-br from-purple-50/60 to-white p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-fuchsia-600 shadow-sm">
                                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Lead Capture (CRM)</h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Every form on the public site (contact, hero contact, SEO Delhi landing) forwards its submission to this URL as JSON, on top of saving to the local <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">contactus</code> table. Use the <strong>Capture Endpoint</strong> URL from your SmartCRM campaign&apos;s Form Integration tab.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 p-6 md:grid-cols-3">
                        <div className="md:col-span-2">
                            <label htmlFor="crm_endpoint_url" className="block text-sm font-medium text-gray-700">
                                CRM Endpoint URL
                            </label>
                            <div className="mt-1.5 relative">
                                <input
                                    id="crm_endpoint_url"
                                    type="url"
                                    autoComplete="off"
                                    spellCheck={false}
                                    value={data.crm_endpoint_url}
                                    onChange={(e) => setData('crm_endpoint_url', e.target.value)}
                                    placeholder="https://dawki.smartcrm.co.in/api/lead-capture/your-campaign-slug"
                                    className={`block w-full rounded-lg border bg-white px-3.5 py-2.5 font-mono text-xs tracking-wide shadow-sm transition focus:outline-none focus:ring-2 ${
                                        !isValidCrmUrl
                                            ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-200'
                                            : 'border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-purple-200'
                                    }`}
                                />
                            </div>
                            {!isValidCrmUrl && (
                                <p className="mt-1.5 text-xs text-red-600">
                                    Must start with <code className="rounded bg-red-50 px-1.5 py-0.5 font-mono">https://</code> (or <code className="rounded bg-red-50 px-1.5 py-0.5 font-mono">http://</code>).
                                </p>
                            )}
                            {serverErrors.crm_endpoint_url && (
                                <p className="mt-1.5 text-xs text-red-600">{serverErrors.crm_endpoint_url}</p>
                            )}
                            <p className="mt-2 text-xs text-gray-500">
                                Leave blank to disable forwarding entirely (leads still save locally).
                            </p>
                        </div>

                        <div>
                            <span className="block text-sm font-medium text-gray-700">Status</span>
                            <button
                                type="button"
                                role="switch"
                                aria-checked={data.crm_enabled}
                                onClick={() => setData('crm_enabled', !data.crm_enabled)}
                                className={`mt-1.5 flex w-full items-center justify-between gap-3 rounded-lg border px-3.5 py-2.5 transition ${
                                    data.crm_enabled
                                        ? 'border-emerald-200 bg-emerald-50'
                                        : 'border-gray-200 bg-gray-50'
                                }`}
                            >
                                <span className={`text-sm font-medium ${data.crm_enabled ? 'text-emerald-700' : 'text-gray-600'}`}>
                                    {data.crm_enabled ? 'Forwarding' : 'Disabled'}
                                </span>
                                <span
                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition ${
                                        data.crm_enabled ? 'bg-emerald-500' : 'bg-gray-300'
                                    }`}
                                >
                                    <span
                                        className={`absolute top-0.5 left-0.5 h-5 w-5 transform rounded-full bg-white shadow transition ${
                                            data.crm_enabled ? 'translate-x-5' : 'translate-x-0'
                                        }`}
                                    />
                                </span>
                            </button>
                            <p className="mt-2 text-xs text-gray-500">
                                Pause forwarding without losing the URL.
                            </p>
                        </div>
                    </div>

                    {/* Test CRM */}
                    <div className="border-t border-gray-200 bg-gray-50 px-6 py-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <p className="text-sm font-medium text-gray-900">Send a synthetic test lead</p>
                                <p className="mt-0.5 text-xs text-gray-500">
                                    POSTs a fake lead to the saved URL. Confirms the CRM is reachable and accepts your payload before real visitors hit it.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleTestCrm}
                                disabled={testingCrm || !crmWillForward}
                                className="inline-flex items-center gap-2 rounded-lg border border-purple-200 bg-white px-4 py-2.5 text-sm font-semibold text-purple-700 shadow-sm transition hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {testingCrm ? 'Sending…' : 'Send test lead'}
                            </button>
                        </div>

                        {crmTestResult && (
                            <div className={`mt-4 rounded-lg border p-4 text-sm ${
                                crmTestResult.ok
                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                                    : 'border-amber-200 bg-amber-50 text-amber-800'
                            }`}>
                                <div className="flex items-start gap-3">
                                    {crmTestResult.ok ? (
                                        <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    ) : (
                                        <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="12" y1="8" x2="12" y2="12" />
                                            <line x1="12" y1="16" x2="12.01" y2="16" />
                                        </svg>
                                    )}
                                    <div className="flex-1 space-y-2">
                                        <p className="font-semibold">{crmTestResult.reason}</p>
                                        {typeof crmTestResult.status === 'number' && (
                                            <p className="text-xs opacity-80">CRM responded with HTTP {crmTestResult.status}.</p>
                                        )}
                                        {crmTestResult.response && (
                                            <details className="text-xs opacity-80">
                                                <summary className="cursor-pointer">Raw response body</summary>
                                                <pre className="mt-2 overflow-x-auto rounded bg-white/60 p-3 font-mono">{crmTestResult.response.slice(0, 800)}</pre>
                                            </details>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {/* === END CRM CARD === */}

                {/* === CRM REFERENCE CARD === */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-200 bg-gradient-to-br from-slate-50 to-white p-6">
                        <h2 className="text-lg font-semibold text-gray-900">CRM integration reference</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            What each form sends to your CRM, and the four steps to wire it up end-to-end.
                        </p>
                    </div>

                    {/* How to use */}
                    <div className="border-b border-gray-200 p-6">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">How to use</h3>
                        <ol className="mt-4 space-y-3 text-sm text-gray-700">
                            <li className="flex gap-3">
                                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-semibold text-purple-700">1</span>
                                <p>
                                    In SmartCRM (<a href="https://dawki.smartcrm.co.in" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 underline-offset-2 hover:underline">dawki.smartcrm.co.in</a>), open your campaign&apos;s <strong>Form Integration</strong> tab → copy the <strong>Capture Endpoint</strong> URL (e.g.{' '}
                                    <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs break-all">https://dawki.smartcrm.co.in/api/lead-capture/whatsapps-api-osdm</code>)
                                </p>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-semibold text-purple-700">2</span>
                                <p>
                                    In the Dawki admin → <strong>Site Settings</strong>, paste it into <strong>CRM Endpoint URL</strong> above, leave <strong>Forwarding</strong> enabled, click <strong>Save all settings</strong>.
                                </p>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-semibold text-purple-700">3</span>
                                <p>
                                    Click <strong>Send test lead</strong> — you should see HTTP 200 from your CRM and a fresh lead appear in the campaign&apos;s leads list.
                                </p>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-semibold text-purple-700">4</span>
                                <p>
                                    In SmartCRM&apos;s <strong>Field Mappings</strong>, map our fields (<code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs">name</code>, <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs">email</code>, <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs">phone</code>, <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs">company</code>, <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs">message</code>, <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs">website</code>, <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs">stage</code>, <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs">form</code>, <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs">source</code>) to your CRM fields. No mapping for <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs">submitted_at</code> — that&apos;s an ISO 8601 timestamp metadata field, optional.
                                </p>
                            </li>
                        </ol>
                    </div>

                    {/* Field reference table */}
                    <div className="p-6">
                        <div className="flex items-baseline justify-between gap-3">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Fields each form sends</h3>
                            <span className="text-xs text-gray-400">JSON keys POSTed to the CRM endpoint</span>
                        </div>

                        <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200">
                            <table className="w-full min-w-[480px] text-sm">
                                <thead className="bg-gray-900 text-left text-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold">Field</th>
                                        <th className="px-4 py-3 font-semibold">Contact form</th>
                                        <th className="px-4 py-3 font-semibold">Hero form</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {[
                                        { f: 'name',         c: 'check', h: 'check' },
                                        { f: 'email',        c: 'check', h: 'check' },
                                        { f: 'phone',        c: 'check', h: 'check' },
                                        { f: 'company',      c: 'dash',  h: 'dash'  },
                                        { f: 'website (url)',c: 'dash',  h: 'dash'  },
                                        { f: 'stage',        c: 'dash',  h: 'dash'  },
                                        { f: 'help_type',    c: 'check', h: 'check' },
                                        { f: 'message',      c: 'check', h: 'check' },
                                        { f: 'form',         c: 'text',  h: 'text', text: 'contact' },
                                        { f: 'source',       c: 'text',  h: 'text', text: 'dawkiinfotech.com' },
                                        { f: 'page (referer)', c: 'check', h: 'check' },
                                        { f: 'submitted_at', c: 'check', h: 'check' },
                                    ].map((row, idx) => {
                                        const renderCell = (kind: string) => {
                                            if (kind === 'check') {
                                                return (
                                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="20 6 9 17 4 12" />
                                                        </svg>
                                                    </span>
                                                );
                                            }
                                            if (kind === 'dash') {
                                                return <span className="text-gray-300">—</span>;
                                            }
                                            return <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-700">{row.text}</code>;
                                        };
                                        return (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="px-4 py-2.5">
                                                    <code className="font-mono text-xs text-gray-800">{row.f}</code>
                                                </td>
                                                <td className="px-4 py-2.5">{renderCell(row.c)}</td>
                                                <td className="px-4 py-2.5">{renderCell(row.h)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <p className="mt-3 text-xs text-gray-500">
                            <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono">page</code> is whatever URL the visitor was on when they submitted (referer header), and{' '}
                            <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono">submitted_at</code> is an ISO&nbsp;8601 timestamp the forwarder adds automatically.
                        </p>
                    </div>
                </div>
                {/* === END CRM REFERENCE CARD === */}

                {/* === SHARED ACTION BAR === */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
                        <p className="text-xs text-gray-500">
                            Changes apply immediately to every page rendered through Laravel.
                        </p>
                        <div className="flex items-center gap-3">
                            {recentlySuccessful && (
                                <span className="text-xs font-medium text-emerald-600">Saved ✓</span>
                            )}
                            <button
                                type="submit"
                                disabled={processing || !isValidId || !isValidCrmUrl || !isValidPhone}
                                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-indigo-700 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? 'Saving…' : 'Save all settings'}
                            </button>
                        </div>
                    </div>
                </div>
                </form>

                {/* === VERIFY CARD === */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-200 bg-gradient-to-br from-emerald-50/60 to-white p-6">
                        <h2 className="text-lg font-semibold text-gray-900">Validate the install</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Two ways to confirm the snippet is live before Google&apos;s Tag Assistant runs its own check.
                        </p>
                    </div>

                    <div className="space-y-6 p-6">
                        {/* URL row */}
                        <div>
                            <label htmlFor="verify_url" className="block text-sm font-medium text-gray-700">
                                Site URL to test
                            </label>
                            <div className="mt-1.5 flex flex-wrap gap-2">
                                <input
                                    id="verify_url"
                                    type="url"
                                    value={verifyUrl}
                                    onChange={(e) => setVerifyUrl(e.target.value)}
                                    placeholder="https://dawkiinfotech.com"
                                    className="block flex-1 min-w-[260px] rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                />
                                <button
                                    type="button"
                                    onClick={handleVerify}
                                    disabled={verifying || !verifyUrl}
                                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {verifying ? 'Checking…' : 'Verify on this server'}
                                </button>
                                <button
                                    type="button"
                                    onClick={openTagAssistant}
                                    disabled={!verifyUrl}
                                    className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Open in Tag Assistant
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                                        <polyline points="15 3 21 3 21 9" />
                                        <line x1="10" y1="14" x2="21" y2="3" />
                                    </svg>
                                </button>
                            </div>
                            <p className="mt-2 text-xs text-gray-500">
                                <strong>Verify on this server</strong> does a quick fetch and confirms the snippet is in the HTML.
                                <strong> Open in Tag Assistant</strong> hands off to Google&apos;s official validator — same one the GTM install dialog uses.
                            </p>
                        </div>

                        {/* Verify result */}
                        {verifyResult && (
                            <div className={`rounded-lg border p-4 text-sm ${
                                verifyResult.ok
                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                                    : 'border-amber-200 bg-amber-50 text-amber-800'
                            }`}>
                                <div className="flex items-start gap-3">
                                    {verifyResult.ok ? (
                                        <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    ) : (
                                        <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="12" y1="8" x2="12" y2="12" />
                                            <line x1="12" y1="16" x2="12.01" y2="16" />
                                        </svg>
                                    )}
                                    <div className="flex-1 space-y-2">
                                        <p className="font-semibold">{verifyResult.reason}</p>
                                        {verifyResult.checks && (
                                            <ul className="space-y-1 text-xs">
                                                <li className="flex items-center gap-2">
                                                    <span className={verifyResult.checks.head_script ? 'text-emerald-600' : 'text-gray-400'}>
                                                        {verifyResult.checks.head_script ? '✓' : '✗'}
                                                    </span>
                                                    GTM script tag in &lt;head&gt;
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className={verifyResult.checks.noscript_iframe ? 'text-emerald-600' : 'text-gray-400'}>
                                                        {verifyResult.checks.noscript_iframe ? '✓' : '✗'}
                                                    </span>
                                                    &lt;noscript&gt; iframe fallback present
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className={verifyResult.checks.data_layer ? 'text-emerald-600' : 'text-gray-400'}>
                                                        {verifyResult.checks.data_layer ? '✓' : '✗'}
                                                    </span>
                                                    dataLayer global initialised
                                                </li>
                                            </ul>
                                        )}
                                        {verifyResult.fetched_url && (
                                            <p className="text-xs opacity-75">
                                                Fetched <code className="rounded bg-white/60 px-1 py-0.5 font-mono">{verifyResult.fetched_url}</code> · HTTP {verifyResult.http_status}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* === SNIPPET PREVIEW === */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-200 bg-gradient-to-br from-slate-50 to-white p-6">
                        <h2 className="text-lg font-semibold text-gray-900">What will be injected</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Live preview of the snippets that will appear in every page&apos;s HTML once you save.
                        </p>
                    </div>

                    <div className="grid gap-0 lg:grid-cols-2">
                        <div className="border-b border-gray-200 lg:border-b-0 lg:border-r">
                            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">High in &lt;head&gt;</span>
                            </div>
                            <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-gray-800 bg-slate-900/[0.03] font-mono">
{previewHead}
                            </pre>
                        </div>
                        <div>
                            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">After opening &lt;body&gt;</span>
                            </div>
                            <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-gray-800 bg-slate-900/[0.03] font-mono">
{previewBody || '<!-- not emitted while disabled or invalid -->'}
                            </pre>
                        </div>
                    </div>
                </div>

                {/* === NOTE: STATIC HTML === */}
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-5">
                    <div className="flex items-start gap-3">
                        <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="16" x2="12" y2="12" />
                            <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                        <div className="text-sm text-indigo-900">
                            <p className="font-semibold">Note about standalone landing pages</p>
                            <p className="mt-1 text-indigo-800/90">
                                Static HTML pages in <code className="rounded bg-white/60 px-1 py-0.5 font-mono text-xs">public/</code> (like <code className="rounded bg-white/60 px-1 py-0.5 font-mono text-xs">seo-services-delhi.html</code>)
                                bypass Laravel entirely. They have <code className="rounded bg-white/60 px-1 py-0.5 font-mono text-xs">&lt;!-- GTM_HEAD --&gt;</code> /
                                <code className="rounded bg-white/60 px-1 py-0.5 font-mono text-xs">&lt;!-- GTM_BODY --&gt;</code> placeholders — the system replaces them
                                with the current container ID whenever you save these settings.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PanelLayout>
    );
}
