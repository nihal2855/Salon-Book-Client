"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Check, X, Eye, Calendar, Clock } from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function AdminManageAppointmentsPage() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [selectedApt, setSelectedApt] = useState(null);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const data = await apiRequest("/appointments/admin/all", {
                authRequired: true,
            });
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

    const handleStatusChange = async (id, status) => {
        setUpdatingId(id);
        try {
            await apiRequest(`/appointments/${id}/status`, {
                method: "PATCH",
                authRequired: true,
                body: JSON.stringify({ status }),
            });
            toast.success(`Appointment ${status}.`);
            fetchAppointments();
        } catch (err) {
            toast.error(err.message || "Failed to update appointment status.");
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusBadge = (status) => {
        if (status === "confirmed")
            return "bg-emerald-50 text-emerald-700 border-emerald-200";
        if (status === "cancelled") return "bg-red-50 text-red-700 border-red-200";
        return "bg-amber-50 text-amber-700 border-amber-200";
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-stone-900">
                    Manage Appointments
                </h2>
                <p className="text-sm text-stone-500 mt-1">
                    Review customer appointment requests, confirm pending slots, or cancel
                    bookings.
                </p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="h-9 w-9 animate-spin rounded-full border-4 border-amber-600 border-t-transparent" />
                </div>
            ) : appointments.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
                    <p className="text-stone-600">No appointment requests yet.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-stone-200 bg-stone-50 text-xs font-semibold uppercase tracking-wider text-stone-500">
                                    <th className="py-3.5 px-4">Customer</th>
                                    <th className="py-3.5 px-4">Service</th>
                                    <th className="py-3.5 px-4">Date & Time</th>
                                    <th className="py-3.5 px-4">Price</th>
                                    <th className="py-3.5 px-4">Status</th>
                                    <th className="py-3.5 px-4">Payment</th>
                                    <th className="py-3.5 px-4">Requested</th>
                                    <th className="py-3.5 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 text-sm">
                                {appointments.map((apt) => {
                                    const canConfirm = apt.status === "pending";
                                    const canCancel =
                                        apt.status === "pending" || apt.status === "confirmed";

                                    return (
                                        <tr key={apt._id} className="hover:bg-stone-50/70">
                                            <td className="py-3.5 px-4">
                                                <p className="font-semibold text-stone-900">
                                                    {apt.customer?.name || "Unknown Customer"}
                                                </p>
                                                <p className="text-xs text-stone-500">
                                                    {apt.customer?.email}
                                                </p>
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <p className="font-medium text-stone-800">
                                                    {apt.service?.serviceName || "Deleted Service"}
                                                </p>
                                                <p className="text-xs text-stone-500">
                                                    {apt.service?.category}
                                                </p>
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <p className="font-medium text-stone-800 flex items-center gap-1">
                                                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                                                    {apt.appointmentDate}
                                                </p>
                                                <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                                                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                                                    {apt.timeSlot}
                                                </p>
                                            </td>

                                            <td className="py-3.5 px-4 font-bold text-stone-900">
                                                ${Number(apt.servicePrice).toFixed(2)}
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <span
                                                    className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${getStatusBadge(
                                                        apt.status
                                                    )}`}
                                                >
                                                    {apt.status}
                                                </span>
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <span
                                                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${apt.paymentStatus === "paid"
                                                            ? "bg-emerald-100 text-emerald-800"
                                                            : "bg-stone-100 text-stone-700"
                                                        }`}
                                                >
                                                    {apt.paymentStatus}
                                                </span>
                                            </td>

                                            <td className="py-3.5 px-4 text-xs text-stone-500">
                                                {new Date(apt.createdAt).toLocaleDateString()}
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedApt(apt)}
                                                        className="rounded-lg border border-stone-200 p-2 text-stone-600 hover:bg-stone-100"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>

                                                    {canConfirm && (
                                                        <button
                                                            type="button"
                                                            disabled={updatingId === apt._id}
                                                            onClick={() =>
                                                                handleStatusChange(apt._id, "confirmed")
                                                            }
                                                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                                                        >
                                                            <Check className="w-3.5 h-3.5" />
                                                            Confirm
                                                        </button>
                                                    )}

                                                    {canCancel && (
                                                        <button
                                                            type="button"
                                                            disabled={updatingId === apt._id}
                                                            onClick={() =>
                                                                handleStatusChange(apt._id, "cancelled")
                                                            }
                                                            className="inline-flex items-center gap-1 rounded-lg bg-red-50 border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                            Cancel
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

            {/* Details Modal */}
            {selectedApt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <h3 className="text-lg font-bold text-stone-900">
                                Booking Request Details
                            </h3>
                            <button
                                type="button"
                                onClick={() => setSelectedApt(null)}
                                className="text-stone-400 hover:text-stone-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mt-4 space-y-3 text-sm">
                            <div className="rounded-xl bg-stone-50 p-3.5 space-y-1.5">
                                <p>
                                    <span className="text-stone-500">Customer:</span>{" "}
                                    <span className="font-semibold text-stone-900">
                                        {selectedApt.customer?.name}
                                    </span>
                                </p>
                                <p>
                                    <span className="text-stone-500">Email:</span>{" "}
                                    <span className="font-medium text-stone-800">
                                        {selectedApt.customer?.email}
                                    </span>
                                </p>
                                {selectedApt.customer?.phone && (
                                    <p>
                                        <span className="text-stone-500">Phone:</span>{" "}
                                        <span className="font-medium text-stone-800">
                                            {selectedApt.customer.phone}
                                        </span>
                                    </p>
                                )}
                            </div>

                            <div className="rounded-xl bg-stone-50 p-3.5 space-y-1.5">
                                <p>
                                    <span className="text-stone-500">Service:</span>{" "}
                                    <span className="font-semibold text-stone-900">
                                        {selectedApt.service?.serviceName}
                                    </span>
                                </p>
                                <p>
                                    <span className="text-stone-500">Date & Slot:</span>{" "}
                                    <span className="font-medium text-stone-800">
                                        {selectedApt.appointmentDate} | {selectedApt.timeSlot}
                                    </span>
                                </p>
                                <p>
                                    <span className="text-stone-500">Amount:</span>{" "}
                                    <span className="font-bold text-amber-600">
                                        ${Number(selectedApt.servicePrice).toFixed(2)}
                                    </span>
                                </p>
                                <p>
                                    <span className="text-stone-500">Booking Request Date:</span>{" "}
                                    <span className="font-medium text-stone-800">
                                        {new Date(selectedApt.createdAt).toLocaleString()}
                                    </span>
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-semibold text-stone-500">
                                    Customer Message
                                </p>
                                <p className="mt-1 rounded-xl border border-stone-200 p-3 text-stone-700">
                                    {selectedApt.message || "No special notes provided."}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setSelectedApt(null)}
                            className="mt-6 w-full rounded-xl bg-stone-900 py-2.5 text-sm font-semibold text-white hover:bg-stone-800"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}