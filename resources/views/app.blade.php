<!doctype html>
<html class="no-js" lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset=" utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">

    <!-- Site Title -->
    <title inertia>{{ config('app.name', 'Laravel') }}</title>

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
    <link rel="stylesheet" href="/assets/css/main.css">
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

<body>
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