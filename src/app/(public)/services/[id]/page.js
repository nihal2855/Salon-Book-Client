"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
    Clock,
    Tag,
    ArrowLeft,
    Calendar,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useSession } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";
import { TIME_SLOTS } from "@/lib/constants";

function ServiceDetailsContent() {
    const { id } = useParams();
    const router = useRouter();
    const { data: session } = useSession();

    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    // Booking Form State
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [appointmentDate, setAppointmentDate] = useState("");
    const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const isAdmin = session?.user?.role === "admin";
    const todayStr = new Date().toISOString().split("T")[0];

    useEffect(() => {
        async function fetchService() {
            setLoading(true);
            setErrorMsg("");
            try {
                const data = await apiRequest(`/services/${id}`);
                setService(data.service);
            } catch (err) {
                setErrorMsg(err.message || "Service not found.");
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchService();
        }
    }, [id]);

    const handleBookingSubmit = async (e) => {
        e.preventDefault();

        if (!appointmentDate) {
            toast.error("Please select an appointment date.");
            return;
        }

        setSubmitting(true);
        try {
            await apiRequest("/appointments", {
                method: "POST",
                authRequired: true,
                body: JSON.stringify({
                    serviceId: service._id,
                    appointmentDate,
                    timeSlot,
                    message,
                }),
            });

            toast.success("Appointment request submitted! Status is Pending.");
            router.push("/dashboard/customer/appointments");
        } catch (err) {
            toast.error(err.message || "Failed to book appointment.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-600 border-t-transparent" />
                <p className="text-sm text-stone-600">Loading service details...</p>
            </div>
        );
    }

    if (errorMsg || !service) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-20 text-center">
                <div className="rounded-2xl border border-red-200 bg-white p-10 shadow-sm">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                    <h1 className="mt-4 text-2xl font-bold text-stone-900">
                        Service Unavailable
                    </h1>
                    <p className="mt-2 text-sm text-stone-600">
                        {errorMsg || "The requested salon service could not be found."}
                    </p>
                    <Link
                        href="/services"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Browse Services
                    </Link>
                </div>
            </div>
        );
    }

    const isActive = service.status === "active";

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link
                href="/services"
                className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900 mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Services
            </Link>

            <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-2">
                {/* Image Column */}
                <div className="h-80 lg:h-full bg-stone-100">
                    <img
                        src={service.image}
                        alt={service.serviceName}
                        className="h-full w-full object-cover"
                    />
                </div>

                {/* Details & Booking Column */}
                <div className="p-8 lg:p-10 flex flex-col justify-between">
                    <div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3.5 py-1 text-xs font-semibold text-amber-800">
                                <Tag className="w-3.5 h-3.5" />
                                {service.category}
                            </span>

                            <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${isActive
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "bg-red-50 text-red-700"
                                    }`}
                            >
                                {service.status}
                            </span>
                        </div>

                        <h1 className="mt-4 text-3xl font-bold text-stone-900">
                            {service.serviceName}
                        </h1>

                        <div className="mt-4 flex items-center gap-6 border-y border-stone-100 py-4">
                            <div>
                                <p className="text-xs text-stone-500">Service Price</p>
                                <p className="text-2xl font-extrabold text-amber-600">
                                    ${Number(service.price).toFixed(2)}
                                </p>
                            </div>
                            <div className="h-8 w-px bg-stone-200" />
                            <div>
                                <p className="text-xs text-stone-500">Estimated Duration</p>
                                <p className="text-base font-semibold text-stone-800 flex items-center gap-1.5 mt-0.5">
                                    <Clock className="w-4 h-4 text-amber-600" />
                                    {service.duration} minutes
                                </p>
                            </div>
                        </div>

                        <div className="mt-5">
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500">
                                Service Description
                            </h2>
                            <p className="mt-2 text-sm text-stone-600 leading-relaxed">
                                {service.description}
                            </p>
                        </div>
                    </div>

                    {/* Booking Action Area */}
                    <div className="mt-8 pt-6 border-t border-stone-100">
                        {!isActive ? (
                            <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                                This service is currently inactive and unavailable for booking.
                            </div>
                        ) : isAdmin ? (
                            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
                                You are signed in as an Administrator. Only Customer accounts
                                can submit appointment requests.
                            </div>
                        ) : !showBookingForm ? (
                            <button
                                type="button"
                                onClick={() => setShowBookingForm(true)}
                                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 py-3.5 text-sm font-semibold text-white hover:bg-amber-700 transition shadow"
                            >
                                <Calendar className="w-4 h-4" />
                                Book Appointment Now
                            </button>
                        ) : (
                            <form
                                onSubmit={handleBookingSubmit}
                                className="space-y-4 rounded-2xl bg-stone-50 border border-stone-200 p-5"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-base font-bold text-stone-900">
                                        Schedule Your Visit
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={() => setShowBookingForm(false)}
                                        className="text-xs text-stone-500 hover:text-stone-800"
                                    >
                                        Cancel
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                                        Appointment Date *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        min={todayStr}
                                        value={appointmentDate}
                                        onChange={(e) => setAppointmentDate(e.target.value)}
                                        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-amber-600 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                                        Available Time Slot *
                                    </label>
                                    <select
                                        value={timeSlot}
                                        onChange={(e) => setTimeSlot(e.target.value)}
                                        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-amber-600 focus:outline-none"
                                    >
                                        {TIME_SLOTS.map((slot) => (
                                            <option key={slot} value={slot}>
                                                {slot}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                                        Additional Message (Optional)
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Any stylist preference or special notes..."
                                        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-amber-600 focus:outline-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 py-3 text-sm font-semibold text-white hover:bg-amber-600 transition disabled:opacity-60"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    {submitting
                                        ? "Submitting Request..."
                                        : "Confirm Appointment Request"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ServiceDetailsPage() {
    return (
        <ProtectedRoute>
            <ServiceDetailsContent />
        </ProtectedRoute>
    );
}