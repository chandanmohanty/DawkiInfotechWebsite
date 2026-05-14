<!doctype html>
<html class="no-js" lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Admin Panel">
    {{-- Admin panel must never be indexed. Belt-and-braces: robots meta here +
         Disallow: /panel/ in /robots.txt + no public links into /panel/*. --}}
    <meta name="robots" content="noindex,nofollow,noarchive,nosnippet">
    <meta name="referrer" content="no-referrer">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    {{-- Google Tag Manager — shared via AppServiceProvider, admin-controlled. --}}
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
    <title inertia>{{ config('app.name', 'Dawki Infotech') }} - Admin Panel</title>

    <!-- Place favicon.ico in the root directory -->
    <link rel="shortcut icon" type="image/x-icon" href="/assets/images/icons/favicon.png">

    @viteReactRefresh
    @vite(['resources/css/panel.css', 'resources/js/panel.tsx'])
    @inertiaHead
</head>

<body class="bg-gray-50">
    @if(!empty($gtmContainerId))
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id={{ $gtmContainerId }}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    @endif

    @inertia
</body>

</html>
