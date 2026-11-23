"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiRequest } from "@/lib/api";

export default function AdminTransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTransactions() {
            try {
                const data = await apiRequest("/payments/admin/all", {
                    authRequired: true,
                });
                setTransactions(data.transactions || []);
            } catch (err) {
                toast.error(err.message || "Failed to load transactions.");
            } finally {
                setLoading(false);
            }
        }
        fetchTransactions();
    }, []);

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-stone-900">
                    Payment Transactions
                </h2>
                <p className="text-sm text-stone-500 mt-1">
                    Verified Stripe payment records for salon appointments.
                </p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="h-9 w-9 animate-spin rounded-full border-4 border-amber-600 border-t-transparent" />
                </div>
            ) : transactions.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
                    <p className="text-stone-600">No payment transactions recorded yet.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-stone-200 bg-stone-50 text-xs font-semibold uppercase tracking-wider text-stone-500">
                                    <th className="py-3.5 px-4">Customer</th>
                                    <th className="py-3.5 px-4">Service</th>
                                    <th className="py-3.5 px-4">Appointment Date</th>
                                    <th className="py-3.5 px-4">Amount</th>
                                    <th className="py-3.5 px-4">Stripe Session</th>
                                    <th className="py-3.5 px-4">Status</th>
                                    <th className="py-3.5 px-4">Transaction Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 text-sm">
                                {transactions.map((tx) => (
                                    <tr key={tx._id} className="hover:bg-stone-50/70">
                                        <td className="py-3.5 px-4">
                                            <p className="font-semibold text-stone-900">
                                                {tx.customer?.name || "Customer"}
                                            </p>
                                            <p className="text-xs text-stone-500">
                                                {tx.customer?.email}
                                            </p>
                                        </td>

                                        <td className="py-3.5 px-4 font-medium text-stone-800">
                                            {tx.service?.serviceName || "Salon Service"}
                                        </td>

                                        <td className="py-3.5 px-4 text-stone-600">
                                            {tx.appointment?.appointmentDate || "N/A"}
                                        </td>

                                        <td className="py-3.5 px-4 font-bold text-stone-900">
                                            ${Number(tx.amount).toFixed(2)}{" "}
                                            <span className="text-xs font-normal text-stone-500">
                                                {tx.currency}
                                            </span>
                                        </td>

                                        <td
                                            className="py-3.5 px-4 font-mono text-xs text-stone-500"
                                            title={tx.stripeSessionId}
                                        >
                                            {tx.stripeSessionId
                                                ? `${tx.stripeSessionId.slice(0, 18)}...`
                                                : "N/A"}
                                        </td>

                                        <td className="py-3.5 px-4">
                                            <span
                                                className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${tx.status === "paid"
                                                        ? "bg-emerald-50 text-emerald-700"
                                                        : "bg-red-50 text-red-700"
                                                    }`}
                                            >
                                                {tx.status}
                                            </span>
                                        </td>

                                        <td className="py-3.5 px-4 text-xs text-stone-500">
                                            {new Date(tx.createdAt).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}