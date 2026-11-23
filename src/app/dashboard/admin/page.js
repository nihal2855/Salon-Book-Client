"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
    Users,
    Sparkles,
    Calendar,
    Clock,
    CheckCircle2,
    CreditCard,
    PlusCircle,
} from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function AdminOverviewPage() {
    const [stats, setStats] = useState({
        totalCustomers: 0,
        totalActiveServices: 0,
        totalAppointments: 0,
        pendingAppointments: 0,
        confirmedAppointments: 0,
        totalSuccessfulPayments: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAdminStats() {
            try {
                const data = await apiRequest("/appointments/stats/admin", {
                    authRequired: true,
                });
                setStats(data.stats);
            } catch (err) {
                toast.error(err.message || "Failed to load admin overview.");
            } finally {
                setLoading(false);
            }
        }
        fetchAdminStats();
    }, []);

    const statCards = [
        {
            label: "Total Registered Customers",
            value: stats.totalCustomers,
            icon: Users,
            color: "bg-blue-50 text-blue-700",
        },
        {
            label: "Total Active Services",
            value: stats.totalActiveServices,
            icon: Sparkles,
            color: "bg-amber-50 text-amber-700",
        },
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
            color: "bg-orange-50 text-orange-700",
        },
        {
            label: "Confirmed Appointments",
            value: stats.confirmedAppointments,
            icon: CheckCircle2,
            color: "bg-emerald-50 text-emerald-700",
        },
        {
            label: "Total Successful Payments",
            value: stats.totalSuccessfulPayments,
            icon: CreditCard,
            color: "bg-purple-50 text-purple-700",
        },
    ];

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-stone-900">Admin Overview</h2>
                    <p className="text-sm text-stone-500 mt-1">
                        Monitor salon performance, appointments, customers, and payments.
                    </p>
                </div>

                <Link
                    href="/dashboard/admin/services/new"
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 transition self-start"
                >
                    <PlusCircle className="w-4 h-4" />
                    Add New Service
                </Link>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[...Array(6)].map((_, idx) => (
                        <div
                            key={idx}
                            className="h-32 rounded-2xl bg-stone-200/70 animate-pulse"
                        />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {statCards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <div
                                key={card.label}
                                className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm"
                            >
                                <span className={`inline-flex p-3 rounded-xl ${card.color}`}>
                                    <Icon className="w-5 h-5" />
                                </span>
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
        </div>
    );
}