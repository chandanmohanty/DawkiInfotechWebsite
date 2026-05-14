<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * Default fallback used until an admin saves a value (and during the
     * initial migrate-first-time run when the settings table doesn't yet exist).
     */
    private const PHONE_DEFAULT = '+91 807 609 6255';
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     */
    public function rootView(Request $request): string
    {
        // Use panel.blade.php for admin panel routes
        if ($request->is('panel/*')) {
            return 'panel';
        }

        return 'app';
    }

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $sitePhone = $this->sitePhone();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error'   => $request->session()->get('error'),
            ],
            // Site-wide config readable from every Inertia React page.
            // Components use `site.phone` for the visible label and
            // `site.phoneDigits` (digits only) for `tel:` and `wa.me/` URLs.
            'site' => [
                'phone'        => $sitePhone,
                'phoneDigits'  => preg_replace('/\D+/', '', (string) $sitePhone),
            ],
        ];
    }

    /**
     * Pull the current phone from the settings table — fail-soft so the
     * very first migrate or any DB hiccup returns the default rather than
     * crashing the layout.
     */
    private function sitePhone(): string
    {
        try {
            if (Schema::hasTable('settings')) {
                $value = Setting::get('site_phone', self::PHONE_DEFAULT);
                return $value !== '' ? (string) $value : self::PHONE_DEFAULT;
            }
        } catch (\Throwable $e) {
            // fall through to default
        }

        return self::PHONE_DEFAULT;
    }
}
