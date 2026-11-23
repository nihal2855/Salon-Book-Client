"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Sparkles,
    CalendarCheck,
    ShieldCheck,
    CreditCard,
    Scissors,
    ArrowRight,
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import ServiceCard from "@/components/services/ServiceCard";

export default function HomePage() {
    const [featuredServices, setFeaturedServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFeatured() {
            try {
                const data = await apiRequest("/services?limit=6");
                setFeaturedServices(data.services || []);
            } catch (error) {
                console.error("Failed to fetch featured services:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchFeatured();
    }, []);

    return (
        <div>
            {/* Banner Section */}
            <section className="relative bg-stone-900 text-white overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-35"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1800&q=80')",
                    }}
                />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                    <div className="max-w-2xl">
                        <span className="inline-flex items-center gap-2 rounded-full bg-amber-600/20 border border-amber-500/40 px-3.5 py-1 text-xs font-semibold text-amber-300">
                            <Sparkles className="w-3.5 h-3.5" />
                            Premium Salon & Spa Experience
                        </span>
                        <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                            Elevate Your Look, Book Effortlessly.
                        </h1>
                        <p className="mt-5 text-base sm:text-lg text-stone-200 leading-relaxed">
                            Discover tailored haircuts, revitalizing skincare, and soothing spa
                            treatments crafted by expert stylists. Reserve your preferred slot
                            in moments.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <Link
                                href="/services"
                                className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-6 py-3.5 text-sm font-semibold text-white hover:bg-amber-700 transition shadow-lg"
                            >
                                Explore Salon Services
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/sign-up"
                                className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 backdrop-blur px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/20 transition"
                            >
                                Create Free Account
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dynamic Section 1: Featured Salon Services */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-amber-600">
                            Curated Treatments
                        </p>
                        <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-stone-900">
                            Featured Salon Services
                        </h2>
                    </div>
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-700"
                    >
                        View All Services
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, idx) => (
                            <div
                                key={idx}
                                className="h-80 rounded-2xl bg-stone-200/70 animate-pulse"
                            />
                        ))}
                    </div>
                ) : featuredServices.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredServices.map((service) => (
                            <ServiceCard key={service._id} service={service} />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-stone-200 bg-white p-12 text-center">
                        <p className="text-stone-600">
                            No active salon services available yet. Sign in as Admin to add
                            services.
                        </p>
                    </div>
                )}
            </section>

            {/* Dynamic Section 2: Salon Service Categories */}
            <section className="bg-stone-100 border-y border-stone-200 py-16 md:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <p className="text-xs font-bold uppercase tracking-wider text-amber-600">
                            Browse By Specialty
                        </p>
                        <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-stone-900">
                            Salon Service Categories
                        </h2>
                        <p className="mt-2 text-sm text-stone-600">
                            Select a category below to filter services tailored to your beauty
                            and wellness needs.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {SERVICE_CATEGORIES.map((category) => (
                            <Link
                                key={category}
                                href={`/services?category=${encodeURIComponent(category)}`}
                                className="group flex items-center justify-between rounded-xl border border-stone-200 bg-white p-5 shadow-sm hover:border-amber-500 hover:shadow transition"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="p-2.5 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition">
                                        <Scissors className="w-4 h-4" />
                                    </span>
                                    <span className="font-semibold text-sm text-stone-800 group-hover:text-amber-700">
                                        {category}
                                    </span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 transition" />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Extra Section: How SalonBook Works */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <p className="text-xs font-bold uppercase tracking-wider text-amber-600">
                        Seamless Experience
                    </p>
                    <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-stone-900">
                        How Booking Works
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="rounded-2xl border border-stone-200 bg-white p-7">
                        <span className="inline-flex p-3 rounded-xl bg-amber-50 text-amber-600">
                            <CalendarCheck className="w-6 h-6" />
                        </span>
                        <h3 className="mt-4 text-lg font-bold text-stone-900">
                            1. Pick Service & Slot
                        </h3>
                        <p className="mt-2 text-sm text-stone-600 leading-relaxed">
                            Browse active treatments, choose a service, and pick a convenient
                            date and time slot from your account.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-stone-200 bg-white p-7">
                        <span className="inline-flex p-3 rounded-xl bg-amber-50 text-amber-600">
                            <ShieldCheck className="w-6 h-6" />
                        </span>
                        <h3 className="mt-4 text-lg font-bold text-stone-900">
                            2. Instant Salon Confirmation
                        </h3>
                        <p className="mt-2 text-sm text-stone-600 leading-relaxed">
                            Our salon coordinators review your request promptly and confirm
                            your chair reservation in real time.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-stone-200 bg-white p-7">
                        <span className="inline-flex p-3 rounded-xl bg-amber-50 text-amber-600">
                            <CreditCard className="w-6 h-6" />
                        </span>
                        <h3 className="mt-4 text-lg font-bold text-stone-900">
                            3. Secure Stripe Checkout
                        </h3>
                        <p className="mt-2 text-sm text-stone-600 leading-relaxed">
                            Once confirmed, complete your payment securely via Stripe from
                            your dashboard and arrive stress-free.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}