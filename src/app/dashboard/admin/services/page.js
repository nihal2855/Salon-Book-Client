"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
    PlusCircle,
    Pencil,
    Trash2,
    Power,
    AlertTriangle,
} from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function AdminManageServicesPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchAllServices = async () => {
        setLoading(true);
        try {
            const data = await apiRequest("/services/admin/all", {
                authRequired: true,
            });
            setServices(data.services || []);
        } catch (err) {
            toast.error(err.message || "Failed to load services.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllServices();
    }, []);

    const handleToggleStatus = async (service) => {
        const nextStatus = service.status === "active" ? "inactive" : "active";
        try {
            await apiRequest(`/services/${service._id}`, {
                method: "PATCH",
                authRequired: true,
                body: JSON.stringify({ status: nextStatus }),
            });
            toast.success(`Service marked as ${nextStatus}.`);
            fetchAllServices();
        } catch (err) {
            toast.error(err.message || "Failed to update service status.");
        }
    };

    const handleDeleteService = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await apiRequest(`/services/${deleteTarget._id}`, {
                method: "DELETE",
                authRequired: true,
            });
            toast.success("Service deleted successfully.");
            setDeleteTarget(null);
            fetchAllServices();
        } catch (err) {
            toast.error(err.message || "Failed to delete service.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-stone-900">Manage Services</h2>
                    <p className="text-sm text-stone-500 mt-1">
                        Add, update, activate/deactivate, or delete salon services.
                    </p>
                </div>

                <Link
                    href="/dashboard/admin/services/new"
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 transition self-start"
                >
                    <PlusCircle className="w-4 h-4" />
                    Add Service
                </Link>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="h-9 w-9 animate-spin rounded-full border-4 border-amber-600 border-t-transparent" />
                </div>
            ) : services.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
                    <p className="text-stone-600">No services found. Add your first service.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-stone-200 bg-stone-50 text-xs font-semibold uppercase tracking-wider text-stone-500">
                                    <th className="py-3.5 px-4">Service</th>
                                    <th className="py-3.5 px-4">Category</th>
                                    <th className="py-3.5 px-4">Price</th>
                                    <th className="py-3.5 px-4">Duration</th>
                                    <th className="py-3.5 px-4">Status</th>
                                    <th className="py-3.5 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 text-sm">
                                {services.map((srv) => (
                                    <tr key={srv._id} className="hover:bg-stone-50/70">
                                        <td className="py-3.5 px-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={srv.image}
                                                    alt={srv.serviceName}
                                                    className="h-11 w-11 rounded-lg object-cover shrink-0 bg-stone-100"
                                                />
                                                <span className="font-semibold text-stone-900">
                                                    {srv.serviceName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 text-stone-600">{srv.category}</td>
                                        <td className="py-3.5 px-4 font-bold text-stone-900">
                                            ${Number(srv.price).toFixed(2)}
                                        </td>
                                        <td className="py-3.5 px-4 text-stone-600">
                                            {srv.duration} mins
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span
                                                className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${srv.status === "active"
                                                        ? "bg-emerald-50 text-emerald-700"
                                                        : "bg-stone-200 text-stone-700"
                                                    }`}
                                            >
                                                {srv.status}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleStatus(srv)}
                                                    title={
                                                        srv.status === "active" ? "Deactivate" : "Activate"
                                                    }
                                                    className="inline-flex items-center gap-1 rounded-lg border border-stone-200 px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-100"
                                                >
                                                    <Power className="w-3.5 h-3.5 text-amber-600" />
                                                    {srv.status === "active" ? "Deactivate" : "Activate"}
                                                </button>

                                                <Link
                                                    href={`/dashboard/admin/services/edit/${srv._id}`}
                                                    className="rounded-lg border border-stone-200 p-2 text-stone-700 hover:bg-stone-100"
                                                    title="Edit Service"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() => setDeleteTarget(srv)}
                                                    className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 hover:bg-red-100"
                                                    title="Delete Service"
                                                >
                                                    <Trash2 className="w-4 h-4" />
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

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <h3 className="mt-4 text-lg font-bold text-stone-900">
                            Delete Service?
                        </h3>
                        <p className="mt-2 text-sm text-stone-600">
                            Are you sure you want to permanently delete{" "}
                            <span className="font-semibold">{deleteTarget.serviceName}</span>?
                        </p>
                        <div className="mt-6 flex gap-3">
                            <button
                                type="button"
                                onClick={() => setDeleteTarget(null)}
                                className="flex-1 rounded-xl border border-stone-300 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={deleting}
                                onClick={handleDeleteService}
                                className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}