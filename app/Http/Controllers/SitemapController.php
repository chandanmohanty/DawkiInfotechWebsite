<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Response;

/**
 * Generates the public sitemap.xml on demand.
 *
 * Why a controller and not a static file?
 *   - Blog posts are user-generated; a static sitemap would go stale.
 *   - Service / industry / static-route URLs live in routes/web.php; this
 *     keeps a single source of truth.
 *   - Response is cached for 1 hour (Cache-Control: public, max-age=3600)
 *     so the work runs ~ once per hour per edge node, not per crawler hit.
 *
 * Submit this URL in Google Search Console + reference it from robots.txt.
 */
class SitemapController extends Controller
{
    public function index(): Response
    {
        $base = rtrim(config('app.url', 'https://dawkiinfotech.com'), '/');
        $now  = now()->toAtomString();

        // Static routes grouped by priority. Order here doesn't matter for SEO
        // but priority/changefreq hints help crawlers spend their budget on
        // the pages that move most often.
        $static = [
            // [path, changefreq, priority]
            ['/',                    'weekly',  '1.0'],
            ['/about',               'monthly', '0.9'],
            ['/contact',             'monthly', '0.8'],
            ['/portfolio',           'monthly', '0.8'],
            ['/estimate',            'monthly', '0.7'],
            ['/faq',                 'monthly', '0.6'],
            ['/blog',                'daily',   '0.9'],

            // Software Engineering services
            ['/services/software-engineering/custom-software-development', 'monthly', '0.8'],
            ['/services/software-engineering/web-application-development', 'monthly', '0.8'],
            ['/services/software-engineering/mobile-app-development',      'monthly', '0.8'],
            ['/services/software-engineering/enterprise-app-development',  'monthly', '0.7'],
            ['/services/software-engineering/blockchain-development',      'monthly', '0.7'],
            ['/services/software-engineering/cloud-services',              'monthly', '0.7'],
            ['/services/software-engineering/devops-services',             'monthly', '0.7'],
            ['/services/software-engineering/saas-application',            'monthly', '0.7'],
            ['/services/software-engineering/product-ui-ux-design',        'monthly', '0.7'],

            // Digital Marketing services
            ['/services/digital-marketing/marketing-strategy',     'monthly', '0.7'],
            ['/services/digital-marketing/search-engine-optimization', 'monthly', '0.8'],
            ['/services/digital-marketing/paid-ad-campaigns',      'monthly', '0.7'],
            ['/services/digital-marketing/social-media-management','monthly', '0.7'],

            // AI & Data Engineering
            ['/services/ai-data/ai-strategy-consulting',     'monthly', '0.8'],
            ['/services/ai-data/ai-agent-development',       'monthly', '0.8'],
            ['/services/ai-data/salesforce-development',     'monthly', '0.7'],
            ['/services/ai-data/business-intelligence-services', 'monthly', '0.7'],

            // Team Extension
            ['/services/team-extension/it-consulting-services',         'monthly', '0.6'],
            ['/services/team-extension/automated-testing-services',     'monthly', '0.6'],
            ['/services/team-extension/performance-testing-services',   'monthly', '0.6'],
            ['/services/team-extension/security-testing-services',      'monthly', '0.6'],
            ['/services/team-extension/metaverse-development',          'monthly', '0.6'],

            // Other services
            ['/services/other/dedicated-development-teams',  'monthly', '0.6'],
            ['/services/other/offshore-development-center',  'monthly', '0.6'],
            ['/services/other/staff-augmentation-services',  'monthly', '0.6'],

            // Industries
            ['/services/industries/healthcare-apps',         'monthly', '0.7'],
            ['/services/industries/elearning-solutions',     'monthly', '0.7'],
            ['/services/industries/hotels-restaurants',      'monthly', '0.7'],
            ['/services/industries/real-estate',             'monthly', '0.7'],
            ['/services/industries/performance-management',  'monthly', '0.7'],
            ['/services/industries/financial-apps',          'monthly', '0.7'],

            // Standalone marketing landing page
            ['/seo-services-delhi.html', 'weekly', '0.8'],
        ];

        $urls = '';
        foreach ($static as [$path, $freq, $pri]) {
            $urls .= sprintf(
                "  <url><loc>%s%s</loc><lastmod>%s</lastmod><changefreq>%s</changefreq><priority>%s</priority></url>\n",
                $base, htmlspecialchars($path, ENT_XML1), $now, $freq, $pri
            );
        }

        // Blog posts — each gets its own URL using updated_at as lastmod so
        // crawlers re-fetch when content changes.
        try {
            Post::query()
                ->select(['slug', 'updated_at'])
                ->where('status', 'published')
                ->orderByDesc('updated_at')
                ->chunk(500, function ($posts) use (&$urls, $base) {
                    foreach ($posts as $post) {
                        $urls .= sprintf(
                            "  <url><loc>%s/blog/%s</loc><lastmod>%s</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>\n",
                            $base,
                            htmlspecialchars($post->slug, ENT_XML1),
                            optional($post->updated_at)->toAtomString() ?? now()->toAtomString()
                        );
                    }
                });
        } catch (\Throwable $e) {
            // posts table missing on a fresh install → skip silently
        }

        $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n"
            .'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'."\n"
            .$urls
            .'</urlset>';

        return response($xml, 200)
            ->header('Content-Type', 'application/xml; charset=utf-8')
            ->header('Cache-Control', 'public, max-age=3600');
    }
}
