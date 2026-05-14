<?php

namespace App\Providers;

use App\Models\Setting;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->shareSiteSettings();
    }

    /**
     * Make GTM settings available in every blade view as
     * $gtmContainerId / $gtmEnabled. Wrapped in a try-catch so the very
     * first migrate run (when the settings table doesn't yet exist) and
     * artisan commands like config:cache don't fail.
     */
    protected function shareSiteSettings(): void
    {
        try {
            if (Schema::hasTable('settings')) {
                $gtmId   = (string) Setting::get('gtm_container_id', '');
                $enabled = Setting::get('gtm_enabled', '1') === '1';
            } else {
                $gtmId   = '';
                $enabled = false;
            }
        } catch (\Throwable $e) {
            $gtmId   = '';
            $enabled = false;
        }

        View::share('gtmContainerId', $enabled ? $gtmId : '');
        View::share('gtmEnabled',     $enabled);
    }

    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null
        );
    }
}
