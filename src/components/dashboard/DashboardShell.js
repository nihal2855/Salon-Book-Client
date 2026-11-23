"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
    Scissors,
    Menu,
    X,
    LogOut,
    Home,
    LayoutDashboard,
    Calendar,
    User,
    Sparkles,
    PlusCircle,
    Users,
    Receipt,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";

const CUSTOMER_LINKS = [
    { name: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
    {
        name: "My Appointments",
        href: "/dashboard/customer/appointments",
        icon: Calendar,
    },
    { name: "My Profile", href: "/dashboard/customer/profile", icon: User },
];

const ADMIN_LINKS = [
    { name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    {
        name: "Manage Services",
        href: "/dashboard/admin/services",
        icon: Sparkles,
    },
    {
        name: "Add Service",
        href: "/dashboard/admin/services/new",
        icon: PlusCircle,
    },
    {
        name: "Manage Appointments",
        href: "/dashboard/admin/appointments",
        icon: Calendar,
    },
    { name: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    {
        name: "Transactions",
        href: "/dashboard/admin/transactions",
        icon: Receipt,
    },
    { name: "My Profile", href: "/dashboard/admin/profile", icon: User },
];

export default function DashboardShell({ children, role = "customer" }) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = useSession();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const user = session?.user;
    const links = role === "admin" ? ADMIN_LINKS : CUSTOMER_LINKS;

    const handleLogout = async () => {
        try {
            await signOut();
            toast.success("Logged out successfully.");
            router.push("/");
            router.refresh();
        } catch (error) {
            toast.error("Failed to log out.");
        }
    };

    const SidebarContent = () => (
        <div className="flex h-full flex-col bg-stone-900 text-stone-200">
            {/* Brand Header */}
            <div className="flex h-16 items-center justify-between px-6 border-b border-stone-800">
                <Link
                    href="/"
                    className="flex items-center gap-2.5 text-lg font-bold text-white"
                >
                    <span className="p-1.5 rounded-lg bg-amber-600 text-white">
                        <Scissors className="w-4 h-4" />
                    </span>
                    <span>SalonBook</span>
                </Link>
                <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden text-stone-400 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Role Badge */}
            <div className="px-6 py-4 border-b border-stone-800">
                <p className="text-xs uppercase tracking-wider text-stone-400">
                    {role === "admin" ? "Administrator Portal" : "Customer Portal"}
                </p>
                <p className="mt-1 text-sm font-semibold text-white truncate">
                    {user?.name || "Member"}
                </p>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                {links.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${isActive
                                    ? "bg-amber-600 text-white shadow-sm"
                                    : "text-stone-300 hover:bg-stone-800 hover:text-white"
                                }`}
                        >
                            <Icon className="w-4 h-4 shrink-0" />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="border-t border-stone-800 p-3 space-y-1">
                <Link
                    href="/"
                    className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-stone-300 hover:bg-stone-800 hover:text-white transition"
                >
                    <Home className="w-4 h-4 shrink-0" />
                    <span>Back to Website</span>
                </Link>
                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-red-400 hover:bg-red-950/50 hover:text-red-300 transition"
                >
                    <LogOut className="w-4 h-4 shrink-0" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex bg-stone-50">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block lg:w-64 lg:shrink-0">
                <div className="sticky top-0 h-screen">
                    <SidebarContent />
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden flex">
                    <div
                        className="fixed inset-0 bg-black/50"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <div className="relative w-64 max-w-xs h-full z-10">
                        <SidebarContent />
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Header */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-stone-200 bg-white px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden rounded-lg p-2 text-stone-600 hover:bg-stone-100"
                            aria-label="Open Sidebar"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <h1 className="text-base sm:text-lg font-bold text-stone-900 capitalize">
                            {role} Dashboard
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        {user?.image ? (
                            <img
                                src={user.image}
                                alt={user.name || "Avatar"}
                                className="h-8 w-8 rounded-full object-cover border border-stone-200"
                            />
                        ) : (
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-600 text-xs font-bold text-white">
                                {user?.name?.charAt(0)?.toUpperCase() || "U"}
                            </span>
                        )}
                        <div className="hidden sm:block text-right">
                            <p className="text-xs font-semibold text-stone-900">
                                {user?.name}
                            </p>
                            <p className="text-[11px] text-stone-500">{user?.email}</p>
                        </div>
                    </div>
                </header>

                {/* Page Body */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}