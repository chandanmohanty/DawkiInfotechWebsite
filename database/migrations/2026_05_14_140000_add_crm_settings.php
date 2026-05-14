<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Seed CRM-related settings. Uses insertOrIgnore so re-running is safe
        // and so it never trips on the unique `key` index if a row already exists.
        DB::table('settings')->insertOrIgnore([
            ['key' => 'crm_endpoint_url', 'value' => '', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'crm_enabled',      'value' => '1', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        DB::table('settings')->whereIn('key', ['crm_endpoint_url', 'crm_enabled'])->delete();
    }
};
