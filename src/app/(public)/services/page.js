"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import ServiceCard from "@/components/services/ServiceCard";

function BrowseServicesContent() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get("category") || "All";

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState(initialCategory);
    const [sort, setSort] = useState("");

    useEffect(() => {
        const paramCat = searchParams.get("category");
        if (paramCat) {
            setCategory(paramCat);
        }
    }, [searchParams]);

    useEffect(() => {
        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (search.trim()) params.set("search", search.trim());
                if (category && category !== "All") params.set("category", category);
                if (sort) params.set("sort", sort);

                const queryString = params.toString();
                const data = await apiRequest(
                    `/services${queryString ? `?${queryString}` : ""}`
                );
                setServices(data.services || []);
            } catch (error) {
                console.error("Failed to fetch services:", error);
            } finally {
                setLoading(false);
            }
        }, 250);

        return () => clearTimeout(timer);
    }, [search, category, sort]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-stone-900">
                    Browse Salon Services
                </h1>
                <p className="mt-2 text-sm text-stone-600">
                    Explore our full menu of professional hair, skin, nail, and spa
                    treatments.
                </p>
            </div>

            {/* Search, Filter & Sort Controls */}
            <div className="bg-white rounded-2xl border border-stone-200 p-4 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 shadow-sm">
                {/* Search by Name */}
                <div className="relative">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search services by name..."
                        className="w-full rounded-xl border border-stone-300 pl-10 pr-4 py-2.5 text-sm focus:border-amber-600 focus:outline-none"
                    />
                </div>

                {/* Category Filter */}
                <div className="relative">
                    <SlidersHorizontal className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full rounded-xl border border-stone-300 pl-10 pr-4 py-2.5 text-sm bg-white focus:border-amber-600 focus:outline-none"
                    >
                        <option value="All">All Categories</option>
                        {SERVICE_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sort by Price */}
                <div className="relative">
                    <ArrowUpDown className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="w-full rounded-xl border border-stone-300 pl-10 pr-4 py-2.5 text-sm bg-white focus:border-amber-600 focus:outline-none"
                    >
                        <option value="">Sort by: Featured</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                    </select>
                </div>
            </div>

            {/* Results Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, idx) => (
                        <div
                            key={idx}
                            className="h-80 rounded-2xl bg-stone-200/70 animate-pulse"
                        />
                    ))}
                </div>
            ) : services.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <ServiceCard key={service._id} service={service} />
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl border border-stone-200 bg-white p-14 text-center">
                    <h3 className="text-lg font-semibold text-stone-900">
                        No matching services found
                    </h3>
                    <p className="mt-1 text-sm text-stone-500">
                        Try clearing your search term or selecting a different category.
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            setSearch("");
                            setCategory("All");
                            setSort("");
                        }}
                        className="mt-4 rounded-xl bg-amber-600 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-700 transition"
                    >
                        Reset Filters
                    </button>
                </div>
            )}
        </div>
    );
}

export default function BrowseServicesPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-[60vh] flex items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-600 border-t-transparent" />
                </div>
            }
        >
            <BrowseServicesContent />
        </Suspense>
    );
}