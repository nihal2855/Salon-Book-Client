"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
    Scissors,
    Menu,
    X,
    ChevronDown,
    LayoutDashboard,
    LogOut,
    User,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, isPending } = useSession();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const user = session?.user;
    const dashboardHref =
        user?.role === "admin" ? "/dashboard/admin" : "/dashboard/customer";

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await signOut();
            setDropdownOpen(false);
            setMobileMenuOpen(false);
            toast.success("Logged out successfully.");
            router.push("/");
            router.refresh();
        } catch (error) {
            toast.error("Failed to log out.");
        }
    };

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Browse Services", href: "/services" },
    ];

    return (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-stone-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2.5 text-xl font-bold text-stone-900"
                    >
                        <span className="p-2 rounded-xl bg-amber-600 text-white">
                            <Scissors className="w-5 h-5" />
                        </span>
                        <span>SalonBook</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-7">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`text-sm font-medium transition ${isActive
                                            ? "text-amber-600 font-semibold"
                                            : "text-stone-600 hover:text-stone-900"
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}

                        {user && (
                            <Link
                                href={dashboardHref}
                                className={`text-sm font-medium transition ${pathname.startsWith("/dashboard")
                                        ? "text-amber-600 font-semibold"
                                        : "text-stone-600 hover:text-stone-900"
                                    }`}
                            >
                                Dashboard
                            </Link>
                        )}
                    </nav>

                    {/* Desktop Auth / Profile Section */}
                    <div className="hidden md:flex items-center gap-3">
                        {isPending ? (
                            <div className="h-9 w-28 rounded-lg bg-stone-100 animate-pulse" />
                        ) : user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2.5 rounded-full border border-stone-200 bg-stone-50 pl-2 pr-3 py-1.5 text-sm font-medium text-stone-800 hover:bg-stone-100 transition"
                                >
                                    {user.image ? (
                                        <img
                                            src={user.image}
                                            alt={user.name || "User"}
                                            className="h-7 w-7 rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-600 text-xs font-bold text-white">
                                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                                        </span>
                                    )}
                                    <span className="max-w-[130px] truncate">{user.name}</span>
                                    <ChevronDown className="w-4 h-4 text-stone-500" />
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 rounded-xl border border-stone-200 bg-white py-2 shadow-lg">
                                        <div className="px-4 py-2 border-b border-stone-100">
                                            <p className="text-sm font-semibold text-stone-900 truncate">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-stone-500 capitalize">
                                                Role: {user.role || "customer"}
                                            </p>
                                        </div>

                                        <Link
                                            href={dashboardHref}
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50"
                                        >
                                            <LayoutDashboard className="w-4 h-4 text-amber-600" />
                                            Dashboard
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/sign-in"
                                    className="rounded-lg px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 transition"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/sign-up"
                                    className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 transition"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Hamburger Button */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden rounded-lg p-2 text-stone-600 hover:bg-stone-100"
                        aria-label="Toggle Menu"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-stone-200 bg-white px-4 py-4 space-y-3">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`block rounded-lg px-3 py-2 text-sm font-medium ${pathname === link.href
                                    ? "bg-amber-50 text-amber-700 font-semibold"
                                    : "text-stone-700 hover:bg-stone-50"
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}

                    {user ? (
                        <>
                            <div className="border-t border-stone-100 pt-3">
                                <div className="flex items-center gap-2.5 px-3 py-1.5">
                                    <User className="w-4 h-4 text-amber-600" />
                                    <span className="text-sm font-semibold text-stone-900">
                                        {user.name}
                                    </span>
                                </div>
                                <Link
                                    href={dashboardHref}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="w-full text-left rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                                >
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="border-t border-stone-100 pt-3 flex flex-col gap-2">
                            <Link
                                href="/sign-in"
                                onClick={() => setMobileMenuOpen(false)}
                                className="w-full text-center rounded-lg border border-stone-300 py-2 text-sm font-medium text-stone-700"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/sign-up"
                                onClick={() => setMobileMenuOpen(false)}
                                className="w-full text-center rounded-lg bg-amber-600 py-2 text-sm font-semibold text-white"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}