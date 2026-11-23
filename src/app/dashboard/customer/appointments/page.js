"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    Eye,
    XCircle,
    CreditCard,
    Calendar,
    Clock,
    X,
    AlertTriangle,
} from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function CustomerAppointmentsPage() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [payingId, setPayingId] = useState(null);
    const [cancellingId, setCancellingId] = useState(null);

    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [confirmCancelTarget, setConfirmCancelTarget] = useState(null);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const data = await apiRequest("/appointments/my", { authRequired: true });
            setAppointments(data.appointments || []);
        } catch (err) {
            toast.error(err.message || "Failed to load appointments.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleCancelAppointment = async () => {
        if (!confirmCancelTarget) return;
        const id = confirmCancelTarget._id;

        setCancellingId(id);
        try {
            await apiRequest(`/appointments/${id}/cancel`, {
                method: "PATCH",
                authRequired: true,
            });
            toast.success("Appointment cancelled successfully.");
            setConfirmCancelTarget(null);
            fetchAppointments();
        } catch (err) {
            toast.error(err.message || "Failed to cancel appointment.");
        } finally {
            setCancellingId(null);
        }
    };

    const handlePayNow = async (appointmentId) => {
        setPayingId(appointmentId);
        try {
            const data = await apiRequest("/payments/create-checkout-session", {
                method: "POST",
                authRequired: true,
                body: JSON.stringify({ appointmentId }),
            });

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error("Stripe Checkout URL was not returned.");
            }
        } catch (err) {
            toast.error(err.message || "Unable to start Stripe Checkout.");
            setPayingId(null);
        }
    };

    const getStatusBadge = (status) => {
        if (status === "confirmed") {
            return "bg-emerald-50 text-emerald-700 border-emerald-200";
        }
        if (status === "cancelled") {
            return "bg-red-50 text-red-700 border-red-200";
        }
        return "bg-amber-50 text-amber-700 border-amber-200";
    };

    const getPaymentBadge = (paymentStatus) => {
        return paymentStatus === "paid"
            ? "bg-emerald-100 text-emerald-800"
            : "bg-stone-100 text-stone-700";
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-stone-900">My Appointments</h2>
                <p className="text-sm text-stone-500 mt-1">
                    View your booking requests, cancel pending slots, or pay for
                    confirmed appointments.
                </p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="h-9 w-9 animate-spin rounded-full border-4 border-amber-600 border-t-transparent" />
                </div>
            ) : appointments.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
                    <p className="text-stone-600 font-medium">
                        You have not requested any salon appointments yet.
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-stone-200 bg-stone-50 text-xs font-semibold uppercase tracking-wider text-stone-500">
                                    <th className="py-3.5 px-4">Service</th>
                                    <th className="py-3.5 px-4">Date & Time</th>
                                    <th className="py-3.5 px-4">Price</th>
                                    <th className="py-3.5 px-4">Status</th>
                                    <th className="py-3.5 px-4">Payment</th>
                                    <th className="py-3.5 px-4">Requested On</th>
                                    <th className="py-3.5 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 text-sm">
                                {appointments.map((apt) => {
                                    const canCancel = apt.status === "pending";
                                    const canPay =
                                        apt.status === "confirmed" && apt.paymentStatus === "unpaid";

                                    return (
                                        <tr key={apt._id} className="hover:bg-stone-50/70">
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={
                                                            apt.service?.image ||
                                                            "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=200&q=80"
                                                        }
                                                        alt={apt.service?.serviceName || "Service"}
                                                        className="h-11 w-11 rounded-lg object-cover shrink-0 bg-stone-100"
                                                    />
                                                    <div>
                                                        <p className="font-semibold text-stone-900">
                                                            {apt.service?.serviceName || "Salon Service"}
                                                        </p>
                                                        <p className="text-xs text-stone-500">
                                                            {apt.service?.category || "General"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-4 px-4">
                                                <p className="font-medium text-stone-800 flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                                                    {apt.appointmentDate}
                                                </p>
                                                <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5">
                                                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                                                    {apt.timeSlot}
                                                </p>
                                            </td>

                                            <td className="py-4 px-4 font-bold text-stone-900">
                                                ${Number(apt.servicePrice).toFixed(2)}
                                            </td>

                                            <td className="py-4 px-4">
                                                <span
                                                    className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${getStatusBadge(
                                                        apt.status
                                                    )}`}
                                                >
                                                    {apt.status}
                                                </span>
                                            </td>

                                            <td className="py-4 px-4">
                                                <span
                                                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${getPaymentBadge(
                                                        apt.paymentStatus
                                                    )}`}
                                                >
                                                    {apt.paymentStatus}
                                                </span>
                                            </td>

                                            <td className="py-4 px-4 text-xs text-stone-500">
                                                {new Date(apt.createdAt).toLocaleDateString()}
                                            </td>

                                            <td className="py-4 px-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedAppointment(apt)}
                                                        title="View Details"
                                                        className="rounded-lg border border-stone-200 p-2 text-stone-600 hover:bg-stone-100 transition"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>

                                                    {canCancel && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setConfirmCancelTarget(apt)}
                                                            className="inline-flex items-center gap-1 rounded-lg bg-red-50 border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition"
                                                        >
                                                            <XCircle className="w-3.5 h-3.5" />
                                                            Cancel
                                                        </button>
                                                    )}

                                                    {canPay && (
                                                        <button
                                                            type="button"
                                                            disabled={payingId === apt._id}
                                                            onClick={() => handlePayNow(apt._id)}
                                                            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 transition disabled:opacity-60"
                                                        >
                                                            <CreditCard className="w-3.5 h-3.5" />
                                                            {payingId === apt._id ? "Redirecting..." : "Pay Now"}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Appointment Details Modal */}
            {selectedAppointment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <h3 className="text-lg font-bold text-stone-900">
                                Appointment Details
                            </h3>
                            <button
                                type="button"
                                onClick={() => setSelectedAppointment(null)}
                                className="text-stone-400 hover:text-stone-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mt-4 space-y-3 text-sm">
                            <div className="flex items-center gap-3">
                                <img
                                    src={selectedAppointment.service?.image}
                                    alt={selectedAppointment.service?.serviceName}
                                    className="h-14 w-14 rounded-xl object-cover"
                                />
                                <div>
                                    <p className="font-bold text-stone-900">
                                        {selectedAppointment.service?.serviceName}
                                    </p>
                                    <p className="text-xs text-stone-500">
                                        {selectedAppointment.service?.category}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 rounded-xl bg-stone-50 p-3.5">
                                <div>
                                    <p className="text-xs text-stone-500">Date</p>
                                    <p className="font-semibold text-stone-800">
                                        {selectedAppointment.appointmentDate}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-stone-500">Time Slot</p>
                                    <p className="font-semibold text-stone-800">
                                        {selectedAppointment.timeSlot}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-stone-500">Price</p>
                                    <p className="font-semibold text-amber-600">
                                        ${Number(selectedAppointment.servicePrice).toFixed(2)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-stone-500">Request Date</p>
                                    <p className="font-semibold text-stone-800">
                                        {new Date(selectedAppointment.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-stone-500">Appointment Status</p>
                                    <p className="font-semibold capitalize text-stone-800">
                                        {selectedAppointment.status}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-stone-500">Payment Status</p>
                                    <p className="font-semibold capitalize text-stone-800">
                                        {selectedAppointment.paymentStatus}
                                    </p>
                                </div>
                            </div>

                            {selectedAppointment.message && (
                                <div>
                                    <p className="text-xs font-semibold text-stone-500">
                                        Your Note
                                    </p>
                                    <p className="mt-1 rounded-xl border border-stone-200 p-3 text-stone-700">
                                        {selectedAppointment.message}
                                    </p>
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => setSelectedAppointment(null)}
                            className="mt-6 w-full rounded-xl bg-stone-900 py-2.5 text-sm font-semibold text-white hover:bg-stone-800 transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Cancel Confirmation Dialog */}
            {confirmCancelTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <h3 className="mt-4 text-lg font-bold text-stone-900">
                            Cancel Appointment?
                        </h3>
                        <p className="mt-2 text-sm text-stone-600">
                            Are you sure you want to cancel your request for{" "}
                            <span className="font-semibold">
                                {confirmCancelTarget.service?.serviceName}
                            </span>{" "}
                            on {confirmCancelTarget.appointmentDate}?
                        </p>
                        <div className="mt-6 flex gap-3">
                            <button
                                type="button"
                                onClick={() => setConfirmCancelTarget(null)}
                                className="flex-1 rounded-xl border border-stone-300 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50"
                            >
                                Keep It
                            </button>
                            <button
                                type="button"
                                disabled={cancellingId === confirmCancelTarget._id}
                                onClick={handleCancelAppointment}
                                className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                            >
                                {cancellingId ? "Cancelling..." : "Yes, Cancel"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}