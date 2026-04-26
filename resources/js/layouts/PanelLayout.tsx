import { Head, Link, router, usePage } from '@inertiajs/react';
import { PropsWithChildren, useState } from 'react';
import { cn } from '@/lib/utils';

interface AuthUser {
    name: string;
    email: string;
}

interface SharedProps {
    auth: {
        user: AuthUser | null;
    };
}

interface PanelLayoutProps extends PropsWithChildren {}

export default function PanelLayout({ children }: PanelLayoutProps) {
    const page = usePage();
    const props = page.props as unknown as SharedProps;
    const { auth } = props;
    // Get URL from Inertia page or fallback to window.location
    const url: string = (page.url ?? (typeof window !== 'undefined' ? window.location.pathname : '')) || '';
    const user = auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/panel/logout');
    };

    const isActive = (path: string) => {
        return url && url === path;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Admin Panel" />

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-screen transition-transform duration-300 ease-in-out ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } w-64 bg-white border-r border-gray-200 shadow-xl lg:translate-x-0`}
            >
                <div className="flex h-full flex-col">
                    {/* Logo Section */}
                    <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6 bg-gradient-to-r from-indigo-600 to-blue-600">
                        <Link href="/panel/dashboard" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                                <svg
                                    className="h-5 w-5 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-white">Dawki Panel</span>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-white/80 hover:text-white transition-colors"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                        <Link
                            href="/panel/dashboard"
                            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                                isActive('/panel/dashboard')
                                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600'
                            }`}
                        >
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                            <span>Dashboard</span>
                        </Link>

                        {/* Blog Section */}
                        <div className="pt-4">
                            <p className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Blog
                            </p>
                            <div className="mt-2 space-y-1">
                                <Link
                                    href="/panel/blog/posts"
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-indigo-50 hover:text-indigo-700",
                                        url && url.startsWith('/panel/blog/posts') && 'bg-indigo-50 text-indigo-700 font-semibold'
                                    )}
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span>Posts</span>
                                </Link>
                                <Link
                                    href="/panel/blog/categories"
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-indigo-50 hover:text-indigo-700",
                                        url && url.startsWith('/panel/blog/categories') && 'bg-indigo-50 text-indigo-700 font-semibold'
                                    )}
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    <span>Categories</span>
                                </Link>
                                <Link
                                    href="/panel/blog/tags"
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-indigo-50 hover:text-indigo-700",
                                        url && url.startsWith('/panel/blog/tags') && 'bg-indigo-50 text-indigo-700 font-semibold'
                                    )}
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    <span>Tags</span>
                                </Link>
                            </div>
                        </div>
                    </nav>

                    {/* User Section */}
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow-md">
                                {user?.name?.charAt(0).toUpperCase() || 'A'}
                            </div>
                            <div className="flex-1 overflow-hidden min-w-0">
                                <p className="truncate text-sm font-semibold text-gray-900">
                                    {user?.name || 'Admin'}
                                </p>
                                <p className="truncate text-xs text-gray-500">{user?.email || ''}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="lg:pl-64">
                {/* Header */}
                <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 bg-white shadow-sm">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden ml-4 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>

                    <div className="flex flex-1 items-center justify-between px-4 lg:px-6">
                        <div>
                            <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
                            <p className="text-xs text-gray-500 hidden sm:block">
                                Welcome back, {user?.name || 'Admin'}
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Notifications */}
                            <button className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                    />
                                </svg>
                                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                            </button>

                            {/* User Menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs font-semibold">
                                        {user?.name?.charAt(0).toUpperCase() || 'A'}
                                    </div>
                                    <span className="hidden md:block font-medium text-gray-700">
                                        {user?.name || 'Admin'}
                                    </span>
                                    <svg
                                        className={`h-4 w-4 text-gray-500 transition-transform ${
                                            userMenuOpen ? 'rotate-180' : ''
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>

                                {/* Dropdown Menu */}
                                {userMenuOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setUserMenuOpen(false)}
                                        />
                                        <div className="absolute right-0 z-20 mt-2 w-48 rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                                            <div className="px-4 py-3 border-b border-gray-200">
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {user?.name || 'Admin'}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {user?.email || ''}
                                                </p>
                                            </div>
                                            <form onSubmit={handleLogout}>
                                                <button
                                                    type="submit"
                                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 transition-colors flex items-center gap-2"
                                                >
                                                    <svg
                                                        className="h-4 w-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                                        />
                                                    </svg>
                                                    Sign out
                                                </button>
                                            </form>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 lg:p-6">{children}</main>
            </div>
        </div>
    );
}
