<?php

namespace App\Http\Controllers\Panel;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\LeadForwarder;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    /**
     * GTM container IDs always follow the shape "GTM-" then 6-9 chars
     * of uppercase letters / digits. Google publishes this format on
     * support.google.com/tagmanager/answer/6103696.
     */
    private const GTM_REGEX = '/^GTM-[A-Z0-9]{6,9}$/';

    public function index(): Response
    {
        return Inertia::render('Panel/Settings', [
            'settings' => [
                'gtm_container_id' => (string) Setting::get('gtm_container_id', ''),
                'gtm_enabled'      => Setting::get('gtm_enabled', '1') === '1',
                'crm_endpoint_url' => (string) Setting::get('crm_endpoint_url', ''),
                'crm_enabled'      => Setting::get('crm_enabled', '1') === '1',
            ],
            'site_url' => rtrim(config('app.url', 'http://localhost'), '/'),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'gtm_container_id' => ['nullable', 'string', 'regex:'.self::GTM_REGEX],
            'gtm_enabled'      => ['required', 'boolean'],
            'crm_endpoint_url' => ['nullable', 'url', 'max:500'],
            'crm_enabled'      => ['required', 'boolean'],
        ], [
            'gtm_container_id.regex' => 'GTM ID must look like "GTM-XXXXXXX" (uppercase letters/digits, 6–9 characters after GTM-).',
            'crm_endpoint_url.url'   => 'CRM endpoint must be a full URL starting with https:// (or http://).',
        ]);

        $gtmId = $validated['gtm_container_id'] ?? '';
        $gtmEnabled = (bool) $validated['gtm_enabled'];

        Setting::set('gtm_container_id', $gtmId);
        Setting::set('gtm_enabled', $gtmEnabled ? '1' : '0');
        Setting::set('crm_endpoint_url', $validated['crm_endpoint_url'] ?? '');
        Setting::set('crm_enabled', $validated['crm_enabled'] ? '1' : '0');

        // Keep standalone HTML landing pages in sync (they bypass Laravel).
        $this->syncStaticLandingPages($gtmEnabled ? $gtmId : '');

        return back()->with('success', 'Settings saved.');
    }

    /**
     * Send a synthetic lead through the LeadForwarder to validate end-to-end
     * that the CRM endpoint is reachable, accepts our payload, and returns 2xx.
     * Lets admins prove the integration works without having to fill a real form.
     */
    public function testCrm(Request $request, LeadForwarder $forwarder): JsonResponse
    {
        $result = $forwarder->send([
            'name'    => 'Dawki Admin Test',
            'email'   => 'admin-test@dawkiinfotech.com',
            'phone'   => '+91 00000 00000',
            'company' => 'Dawki Infotech',
            'website' => rtrim(config('app.url', 'http://localhost'), '/'),
            'stage'   => 'Just curious about a benchmark',
            'message' => 'This is a synthetic test lead sent from the admin Site Settings page. Safe to ignore or delete.',
        ], [
            'form'   => 'admin_test',
            'source' => 'dawki-admin-panel',
        ]);

        return response()->json([
            'ok'        => $result['forwarded'],
            'reason'    => $result['reason'] ?? 'CRM accepted the test lead.',
            'status'    => $result['status'],
            'response'  => $result['response'],
            'endpoint'  => (string) Setting::get('crm_endpoint_url', ''),
        ]);
    }

    /**
     * Rewrite the GTM_HEAD_START/END and GTM_BODY_START/END sentinel blocks
     * inside every standalone HTML landing page under public/ so the static
     * pages always reflect the current admin setting. Pass an empty $gtmId
     * to clear the snippets.
     */
    private function syncStaticLandingPages(string $gtmId): void
    {
        $files = glob(public_path('*.html')) ?: [];

        $headBlock = $gtmId === '' ? '' : <<<HTML

<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','{$gtmId}');</script>
<!-- End Google Tag Manager -->

HTML;

        $bodyBlock = $gtmId === '' ? '' : <<<HTML

<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id={$gtmId}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->

HTML;

        foreach ($files as $file) {
            $contents = @file_get_contents($file);
            if ($contents === false) {
                continue;
            }

            // Skip files without our sentinel markers — don't touch unrelated HTML.
            if (! str_contains($contents, 'GTM_HEAD_START') || ! str_contains($contents, 'GTM_BODY_START')) {
                continue;
            }

            $rewritten = preg_replace(
                [
                    '/<!-- GTM_HEAD_START -->.*?<!-- GTM_HEAD_END -->/s',
                    '/<!-- GTM_BODY_START -->.*?<!-- GTM_BODY_END -->/s',
                ],
                [
                    '<!-- GTM_HEAD_START -->'.$headBlock.'<!-- GTM_HEAD_END -->',
                    '<!-- GTM_BODY_START -->'.$bodyBlock.'<!-- GTM_BODY_END -->',
                ],
                $contents
            );

            if ($rewritten !== null && $rewritten !== $contents) {
                @file_put_contents($file, $rewritten);
            }
        }
    }

    /**
     * Server-side verification — fetches the site's homepage and checks
     * that both GTM snippets are present and the dataLayer is initialised.
     * Surfaces a clear pass/fail to the admin so they don't have to guess
     * whether Google's Tag Assistant will accept the install.
     */
    public function verify(Request $request): JsonResponse
    {
        $request->validate(['url' => ['required', 'url']]);
        $url = $request->input('url');

        $gtmId = (string) Setting::get('gtm_container_id', '');
        $enabled = Setting::get('gtm_enabled', '1') === '1';

        if (! $enabled || $gtmId === '') {
            return response()->json([
                'ok' => false,
                'reason' => 'GTM is disabled or no container ID is set. Save a valid ID with "Enabled" on, then re-test.',
            ]);
        }

        try {
            $response = Http::timeout(8)
                ->withHeaders(['User-Agent' => 'DawkiAdminGtmVerifier/1.0'])
                ->get($url);
        } catch (ConnectionException $e) {
            return response()->json([
                'ok' => false,
                'reason' => 'Could not reach the URL: '.$e->getMessage(),
            ]);
        }

        if (! $response->ok()) {
            return response()->json([
                'ok' => false,
                'reason' => 'Site returned HTTP '.$response->status().' — fix the URL or hosting first.',
            ]);
        }

        $html = $response->body();
        $hasHeadScript  = str_contains($html, "id={$gtmId}") || str_contains($html, "'{$gtmId}'");
        $hasNoscript    = str_contains($html, "id={$gtmId}") && str_contains($html, '<noscript>');
        $hasDataLayer   = str_contains($html, "dataLayer");

        $passed = $hasHeadScript && $hasDataLayer;

        return response()->json([
            'ok'           => $passed,
            'gtm_id'       => $gtmId,
            'fetched_url'  => $url,
            'http_status'  => $response->status(),
            'checks' => [
                'head_script'     => $hasHeadScript,
                'noscript_iframe' => $hasNoscript,
                'data_layer'      => $hasDataLayer,
            ],
            'reason' => $passed
                ? 'Looks good. The Google Tag Assistant test should now pass for this URL.'
                : 'GTM snippet not detected in the page HTML. Hard-refresh the site (Ctrl+F5) — if you just saved, run `php artisan view:clear` on the server.',
        ]);
    }
}
