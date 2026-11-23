"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Eye, Ban, ShieldCheck, X } from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function AdminManageUsersPage() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [togglingId, setTogglingId] = useState(null);
    const [userDetails, setUserDetails] = useState(null);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const data = await apiRequest("/users/admin/customers", {
                authRequired: true,
            });
            setCustomers(data.customers || []);
        } catch (err) {
            toast.error(err.message || "Failed to load customers.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleViewDetails = async (userId) => {
        try {
            const data = await apiRequest(`/users/admin/${userId}`, {
                authRequired: true,
            });
            setUserDetails(data.user);
        } catch (err) {
            toast.error(err.message || "Failed to fetch user details.");
        }
    };

    const handleToggleBlock = async (customer) => {
        const nextBlocked = !customer.isBlocked;
        setTogglingId(customer._id);
        try {
            const data = await apiRequest(`/users/admin/${customer._id}/block`, {
                method: "PATCH",
                authRequired: true,
                body: JSON.stringify({ isBlocked: nextBlocked }),
            });
            toast.success(data.message);
            fetchCustomers();
        } catch (err) {
            toast.error(err.message || "Failed to update user status.");
        } finally {
            setTogglingId(null);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-stone-900">Manage Users</h2>
                <p className="text-sm text-stone-500 mt-1">
                    View registered customers, inspect account details, and block or
                    unblock platform access.
                </p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="h-9 w-9 animate-spin rounded-full border-4 border-amber-600 border-t-transparent" />
                </div>
            ) : customers.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
                    <p className="text-stone-600">No registered customers found.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-stone-200 bg-stone-50 text-xs font-semibold uppercase tracking-wider text-stone-500">
                                    <th className="py-3.5 px-4">Customer</th>
                                    <th className="py-3.5 px-4">Email</th>
                                    <th className="py-3.5 px-4">Account Status</th>
                                    <th className="py-3.5 px-4">Joined</th>
                                    <th className="py-3.5 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 text-sm">
                                {customers.map((cust) => (
                                    <tr key={cust._id} className="hover:bg-stone-50/70">
                                        <td className="py-3.5 px-4">
                                            <div className="flex items-center gap-3">
                                                {cust.image ? (
                                                    <img
                                                        src={cust.image}
                                                        alt={cust.name}
                                                        className="h-9 w-9 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-800">
                                                        {cust.name?.charAt(0)?.toUpperCase() || "C"}
                                                    </span>
                                                )}
                                                <span className="font-semibold text-stone-900">
                                                    {cust.name}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="py-3.5 px-4 text-stone-600">{cust.email}</td>

                                        <td className="py-3.5 px-4">
                                            <span
                                                className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${cust.isBlocked
                                                        ? "bg-red-50 text-red-700"
                                                        : "bg-emerald-50 text-emerald-700"
                                                    }`}
                                            >
                                                {cust.isBlocked ? "Blocked" : "Active"}
                                            </span>
                                        </td>

                                        <td className="py-3.5 px-4 text-xs text-stone-500">
                                            {cust.createdAt
                                                ? new Date(cust.createdAt).toLocaleDateString()
                                                : "N/A"}
                                        </td>

                                        <td className="py-3.5 px-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleViewDetails(cust._id)}
                                                    className="rounded-lg border border-stone-200 p-2 text-stone-600 hover:bg-stone-100"
                                                    title="View User Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>

                                                <button
                                                    type="button"
                                                    disabled={togglingId === cust._id}
                                                    onClick={() => handleToggleBlock(cust)}
                                                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition disabled:opacity-60 ${cust.isBlocked
                                                            ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                                            : "bg-red-50 border border-red-200 text-red-700 hover:bg-red-100"
                                                        }`}
                                                >
                                                    {cust.isBlocked ? (
                                                        <>
                                                            <ShieldCheck className="w-3.5 h-3.5" />
                                                            Unblock User
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Ban className="w-3.5 h-3.5" />
                                                            Block User
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* User Details Modal */}
            {userDetails && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <h3 className="text-lg font-bold text-stone-900">
                                Customer Details
                            </h3>
                            <button
                                type="button"
                                onClick={() => setUserDetails(null)}
                                className="text-stone-400 hover:text-stone-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mt-4 space-y-3 text-sm">
                            <div className="flex items-center gap-3">
                                {userDetails.image ? (
                                    <img
                                        src={userDetails.image}
                                        alt={userDetails.name}
                                        className="h-14 w-14 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-600 text-lg font-bold text-white">
                                        {userDetails.name?.charAt(0)?.toUpperCase() || "C"}
                                    </div>
                                )}
                                <div>
                                    <p className="font-bold text-stone-900">{userDetails.name}</p>
                                    <p className="text-xs text-stone-500">{userDetails.email}</p>
                                </div>
                            </div>

                            <div className="rounded-xl bg-stone-50 p-4 space-y-2">
                                <p>
                                    <span className="text-stone-500">Phone:</span>{" "}
                                    <span className="font-medium text-stone-800">
                                        {userDetails.phone || "Not provided"}
                                    </span>
                                </p>
                                <p>
                                    <span className="text-stone-500">Role:</span>{" "}
                                    <span className="font-medium capitalize text-stone-800">
                                        {userDetails.role}
                                    </span>
                                </p>
                                <p>
                                    <span className="text-stone-500">Status:</span>{" "}
                                    <span
                                        className={`font-semibold ${userDetails.isBlocked ? "text-red-600" : "text-emerald-600"
                                            }`}
                                    >
                                        {userDetails.isBlocked ? "Blocked" : "Active"}
                                    </span>
                                </p>
                                <p>
                                    <span className="text-stone-500">Total Appointments:</span>{" "}
                                    <span className="font-bold text-stone-900">
                                        {userDetails.appointmentCount ?? 0}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setUserDetails(null)}
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