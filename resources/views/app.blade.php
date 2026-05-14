<!doctype html>
<html class="no-js" lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset=" utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">

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
    <title inertia>{{ config('app.name', 'Dawki Infotech') }}</title>

    <!-- Place favicon.ico in the root directory -->
    <link rel="shortcut icon" type="image/x-icon" href="/assets/images/icons/favicon.png">

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