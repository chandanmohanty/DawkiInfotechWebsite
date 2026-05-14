<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Forwards a captured lead to the configured CRM endpoint.
 *
 * Design goals
 * ------------
 *   - Non-blocking from the user's perspective: if the CRM is slow or down,
 *     we time out fast (8s), log the failure, and let the local save win
 *     so the visitor still sees a success page.
 *   - Stateless: callers pass a plain associative array; the service decides
 *     whether forwarding is enabled and where to send.
 *   - Returns a structured result so the admin "Send test lead" button can
 *     show exactly what the CRM responded with.
 */
class LeadForwarder
{
    /**
     * @param  array<string,mixed>  $lead    Plain key/value payload.
     * @param  array<string,mixed>  $context Extra metadata merged in (page, referer, ...).
     * @return array{forwarded:bool,reason:?string,status:?int,response:?string}
     */
    public function send(array $lead, array $context = []): array
    {
        $url      = trim((string) Setting::get('crm_endpoint_url', ''));
        $enabled  = Setting::get('crm_enabled', '1') === '1';

        if ($url === '' || ! $enabled) {
            return [
                'forwarded' => false,
                'reason'    => $url === '' ? 'CRM endpoint not configured.' : 'CRM forwarding disabled.',
                'status'    => null,
                'response'  => null,
            ];
        }

        $payload = $this->normalisePayload($lead, $context);

        try {
            $response = Http::timeout(8)
                ->withHeaders([
                    'Accept'       => 'application/json',
                    'Content-Type' => 'application/json',
                    'User-Agent'   => 'DawkiSiteLeadForwarder/1.0',
                ])
                ->post($url, $payload);

            $ok = $response->successful();

            if (! $ok) {
                Log::warning('CRM forwarding returned non-2xx', [
                    'url'    => $url,
                    'status' => $response->status(),
                    'body'   => substr($response->body(), 0, 1000),
                ]);
            }

            return [
                'forwarded' => $ok,
                'reason'    => $ok ? null : 'CRM returned HTTP '.$response->status(),
                'status'    => $response->status(),
                'response'  => substr($response->body(), 0, 4000),
            ];
        } catch (\Throwable $e) {
            // Never let a CRM outage break the visitor experience.
            Log::error('CRM forwarding threw exception', [
                'url'   => $url,
                'error' => $e->getMessage(),
            ]);

            return [
                'forwarded' => false,
                'reason'    => 'Network error: '.$e->getMessage(),
                'status'    => null,
                'response'  => null,
            ];
        }
    }

    /**
     * Merge in standard metadata and drop empties so the CRM payload stays clean.
     * Field names follow what the CRM's "Field Mappings" UI expects (snake_case).
     */
    private function normalisePayload(array $lead, array $context): array
    {
        $merged = array_merge([
            'source'        => 'dawkiinfotech.com',
            'submitted_at'  => now()->toIso8601String(),
        ], $context, $lead);

        // Strip null / empty strings — keep the JSON tight.
        return array_filter($merged, fn ($v) => $v !== null && $v !== '');
    }
}
