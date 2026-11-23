"use client";

import Link from "next/link";
import { XCircle, Calendar, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PaymentCancelPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 flex items-center justify-center">
                <div className="max-w-lg mx-auto px-4 py-20">
                    <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-10 text-center shadow-sm">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
                            <XCircle className="w-9 h-9" />
                        </div>

                        <h1 className="mt-5 text-2xl sm:text-3xl font-bold text-stone-900">
                            Payment Cancelled
                        </h1>

                        <p className="mt-3 text-sm text-stone-600 leading-relaxed">
                            Your payment was not completed and no charges were made. Your
                            appointment remains confirmed, and you can complete payment
                            anytime from your dashboard.
                        </p>

                        <div className="mt-8 flex flex-col sm:flex-row gap-3">
                            <Link
                                href="/dashboard/customer/appointments"
                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-600 transition"
                            >
                                <Calendar className="w-4 h-4" />
                                Return to My Appointments
                            </Link>
                            <Link
                                href="/services"
                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-50 transition"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Browse Services
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}