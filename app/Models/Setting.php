<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    protected $fillable = ['key', 'value'];

    /**
     * Read a setting value with an in-process cache so we don't hit the DB
     * on every request. The cache is invalidated automatically by ::set().
     */
    public static function get(string $key, $default = null)
    {
        $cacheKey = "setting:{$key}";

        $value = Cache::rememberForever($cacheKey, function () use ($key) {
            return static::where('key', $key)->value('value');
        });

        return $value !== null ? $value : $default;
    }

    /**
     * Upsert a setting and invalidate its cache.
     */
    public static function set(string $key, $value): self
    {
        $row = static::updateOrCreate(['key' => $key], ['value' => (string) $value]);
        Cache::forget("setting:{$key}");

        return $row;
    }

    protected static function booted(): void
    {
        // Bust the cache if a row is changed/deleted via the model directly.
        static::saved(fn (self $s) => Cache::forget("setting:{$s->key}"));
        static::deleted(fn (self $s) => Cache::forget("setting:{$s->key}"));
    }
}
