<!doctype html>
<html class="no-js" lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Admin Panel">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- Site Title -->
    <title inertia>{{ config('app.name', 'Laravel') }} - Admin Panel</title>

    <!-- Place favicon.ico in the root directory -->
    <link rel="shortcut icon" type="image/x-icon" href="/assets/images/icons/favicon.png">

    @viteReactRefresh
    @vite(['resources/css/panel.css', 'resources/js/panel.tsx'])
    @inertiaHead
</head>

<body class="bg-gray-50">
    @inertia
</body>

</html>
