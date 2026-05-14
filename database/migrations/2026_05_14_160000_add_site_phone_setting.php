<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('settings')->insertOrIgnore([
            // Seed with the number that's currently hardcoded in Header / Contact /
            // FAQ / Estimate so behaviour doesn't change until an admin updates it.
            ['key' => 'site_phone', 'value' => '+91 807 609 6255', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        DB::table('settings')->where('key', 'site_phone')->delete();
    }
};
