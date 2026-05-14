<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        // Seed default keys so the admin form always has rows to update.
        \Illuminate\Support\Facades\DB::table('settings')->insert([
            ['key' => 'gtm_container_id', 'value' => '', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'gtm_enabled',      'value' => '1', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
