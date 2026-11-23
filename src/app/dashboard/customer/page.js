"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
    Calendar,
    Clock,
    CheckCircle2,
    XCircle,
    ArrowRight,
    Sparkles,
} from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function CustomerOverviewPage() {
    const [stats, setStats] = useState({
        totalAppointments: 0,
        pendingAppointments: 0,
        confirmedAppointments: 0,
        cancelledAppointments: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const data = await apiRequest("/appointments/stats/customer", {
                    authRequired: true,
                });
                setStats(data.stats);
            } catch (err) {
                toast.error(err.message || "Failed to load dashboard overview.");
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    const cards = [
        {
            label: "Total Appointment Requests",
            value: stats.totalAppointments,
            icon: Calendar,
            color: "bg-stone-100 text-stone-800",
        },
        {
            label: "Pending Appointments",
            value: stats.pendingAppointments,
            icon: Clock,
            color: "bg-amber-50 text-amber-700",
        },
        {
            label: "Confirmed Appointments",
            value: stats.confirmedAppointments,
            icon: CheckCircle2,
            color: "bg-emerald-50 text-emerald-700",
        },
        {
            label: "Cancelled Appointments",
            value: stats.cancelledAppointments,
            icon: XCircle,
            color: "bg-red-50 text-red-700",
        },
    ];

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-stone-900">
                        Dashboard Overview
                    </h2>
                    <p className="text-sm text-stone-500 mt-1">
                        Track your salon appointment requests and upcoming visits.
                    </p>
                </div>
                <Link
                    href="/services"
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 transition self-start"
                >
                    <Sparkles className="w-4 h-4" />
                    Book New Service
                </Link>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {[...Array(4)].map((_, idx) => (
                        <div
                            key={idx}
                            className="h-32 rounded-2xl bg-stone-200/70 animate-pulse"
                        />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {cards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <div
                                key={card.label}
                                className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm"
                            >
                                <div className="flex items-center justify-between">
                                    <span className={`p-3 rounded-xl ${card.color}`}>
                                        <Icon className="w-5 h-5" />
                                    </span>
                                </div>
                                <p className="mt-4 text-3xl font-extrabold text-stone-900">
                                    {card.value}
                                </p>
                                <p className="mt-1 text-xs font-medium text-stone-500">
                                    {card.label}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="mt-8 bg-white rounded-2xl border border-stone-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-base font-bold text-stone-900">
                        Ready to manage your bookings?
                    </h3>
                    <p className="text-sm text-stone-500 mt-0.5">
                        View appointment details, cancel pending requests, or pay for
                        confirmed appointments via Stripe.
                    </p>
                </div>
                <Link
                    href="/dashboard/customer/appointments"
                    className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 transition shrink-0"
                >
                    Go to My Appointments
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}