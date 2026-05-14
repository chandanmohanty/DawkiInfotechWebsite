<!doctype html>
<html class="no-js" lang="{{ str_replace('_', '-', app()->getLocale()) }}">

@php
    // SEO defaults — overridable per-page via Inertia Head (page-level
    // title, meta, and canonical emitted by inertiaHead will override
    // these blade defaults when present).
    $appName       = config('app.name', 'Dawki Infotech');
    $defaultDesc   = $defaultDesc ?? 'Dawki Infotech is a full-service software, AI automation, and digital marketing partner building products and growth engines for businesses across India, the US, the UK, and the UAE.';
    $defaultImage  = $defaultImage ?? url('/assets/images/header/demo/dawki_logo_transparent.png');
    $canonicalUrl  = url()->current();

    // Built in PHP and echoed as JSON so the JSON-LD's "@" keys never get
    // mistaken for blade directives (causing a syntax error during compile).
    $structuredData = [
        '@context' => 'https://schema.org',
        '@graph'   => [
            [
                '@type' => 'Organization',
                '@id'   => url('/').'#organization',
                'name'  => 'Dawki Infotech',
                'url'   => url('/'),
                'logo'  => url('/assets/images/header/demo/dawki_logo_transparent.png'),
                'sameAs' => [
                    'https://www.facebook.com/dawkiinfotech/',
                    'https://www.instagram.com/dawki_infotech/',
                    'https://x.com/DawkiInfotech',
                    'https://www.linkedin.com/company/dawki-infotech-private-limited/',
                ],
                'address' => [
                    '@type' => 'PostalAddress',
                    'streetAddress'   => 'Badarpur Village, Main Market Road',
                    'addressLocality' => 'New Delhi',
                    'addressRegion'   => 'Delhi',
                    'postalCode'      => '110044',
                    'addressCountry'  => 'IN',
                ],
            ],
            [
                '@type'     => 'WebSite',
                '@id'       => url('/').'#website',
                'url'       => url('/'),
                'name'      => 'Dawki Infotech',
                'publisher' => ['@id' => url('/').'#organization'],
                'inLanguage' => 'en',
                'potentialAction' => [
                    '@type'       => 'SearchAction',
                    'target'      => url('/blog').'?q={search_term_string}',
                    'query-input' => 'required name=search_term_string',
                ],
            ],
        ],
    ];
@endphp

<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- Default description / robots / canonical. Pages can override via
         <Head> in their TSX (Inertia merges by name where keys match). --}}
    <meta name="description" content="{{ $defaultDesc }}" inertia>
    <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" inertia>
    <link rel="canonical" href="{{ $canonicalUrl }}" inertia="canonical">

    {{-- Open Graph — used by Facebook, LinkedIn, Slack, Discord, iMessage --}}
    <meta property="og:type"        content="website" inertia="og:type">
    <meta property="og:site_name"   content="{{ $appName }}" inertia="og:site_name">
    <meta property="og:title"       content="{{ $appName }}" inertia="og:title">
    <meta property="og:description" content="{{ $defaultDesc }}" inertia="og:description">
    <meta property="og:url"         content="{{ $canonicalUrl }}" inertia="og:url">
    <meta property="og:image"       content="{{ $defaultImage }}" inertia="og:image">
    <meta property="og:locale"      content="en_IN" inertia="og:locale">

    {{-- Twitter / X cards --}}
    <meta name="twitter:card"        content="summary_large_image" inertia="twitter:card">
    <meta name="twitter:title"       content="{{ $appName }}" inertia="twitter:title">
    <meta name="twitter:description" content="{{ $defaultDesc }}" inertia="twitter:description">
    <meta name="twitter:image"       content="{{ $defaultImage }}" inertia="twitter:image">

    {{-- Theme + format hints --}}
    <meta name="theme-color" content="#050d1c">
    <meta name="format-detection" content="telephone=no">

    {{-- Google Tag Manager — must be as high in <head> as possible.
         Container ID is admin-controlled via /panel/settings and shared as
         $gtmContainerId by AppServiceProvider. Empty / disabled = no output. --}}
    @if(!empty($gtmContainerId))
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','{{ $gtmContainerId }}');</script>
    <!-- End Google Tag Manager -->
    @endif

    <!-- Site Title -->
    <title inertia>{{ $appName }}</title>

    <!-- Favicon -->
    <link rel="shortcut icon" type="image/x-icon" href="/assets/images/icons/favicon.png">

    <!-- Performance: pre-resolve DNS + open early TCP/TLS to critical origins -->
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="dns-prefetch" href="https://www.googletagmanager.com">
    <link rel="dns-prefetch" href="https://flagcdn.com">

    <!-- CSS here -->
    <link rel="stylesheet" href="/assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="/assets/css/font-awesome-pro.min.css">
    <link rel="stylesheet" href="/assets/css/animate.min.css">
    <link rel="stylesheet" href="/assets/css/bexon-icons.css">
    <link rel="stylesheet" href="/assets/css/nice-select.css">
    <link rel="stylesheet" href="/assets/css/swiper.min.css">
    <link rel="stylesheet" href="/assets/css/venobox.min.css">
    <link rel="stylesheet" href="/assets/css/odometer-theme-default.css">
    <link rel="stylesheet" href="/assets/css/meanmenu.css">
    <link rel="stylesheet" href="/assets/css/main.css?v={{ filemtime(public_path('assets/css/main.css')) }}">

    {{-- Organization + WebSite structured data. Helps Google build the
         knowledge panel and the sitelinks search box. JSON is generated
         in the @php block above so blade never tries to parse the "@" keys. --}}
    <script type="application/ld+json">{!! json_encode($structuredData, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}</script>

    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

<body>
    {{-- Google Tag Manager (noscript) — fallback iframe for users without JS,
         must be the first child of <body>. --}}
    @if(!empty($gtmContainerId))
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id={{ $gtmContainerId }}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    @endif

    @inertia

    <!-- JS here -->
    <script src="/assets/js/jquery.min.js"></script>
    <script src="/assets/js/bootstrap.bundle.min.js"></script>
    <script src="/assets/js/gsap.min.js"></script>
    <script src="/assets/js/ScrollSmoother.js"></script>
    <script src="/assets/js/gsap-scroll-to-plugin.min.js"></script>
    <script src="/assets/js/gsap-scroll-trigger.min.js"></script>
    <script src="/assets/js/gsap-split-text.min.js"></script>
    <script src="/assets/js/jquery.nice-select.min.js"></script>
    <script src="/assets/js/swiper.min.js"></script>
    <script src="/assets/js/odometer.min.js"></script>
    <script src="/assets/js/venobox.min.js"></script>
    <script src="/assets/js/appear.min.js"></script>
    <script src="/assets/js/wow.min.js"></script>
    <script src="/assets/js/meanmenu.js"></script>
    <script src="/assets/js/main.js"></script>
</body>

</html>