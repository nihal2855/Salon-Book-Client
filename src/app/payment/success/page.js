"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Calendar, Home } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");

    return (
        <div className="max-w-lg mx-auto px-4 py-20">
            <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-10 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle2 className="w-9 h-9" />
                </div>

                <h1 className="mt-5 text-2xl sm:text-3xl font-bold text-stone-900">
                    Payment Successful!
                </h1>

                <p className="mt-3 text-sm text-stone-600 leading-relaxed">
                    Thank you for your payment. Your salon appointment is now confirmed
                    and marked as <span className="font-semibold text-emerald-700">Paid</span> once
                    verified by our payment processor.
                </p>

                {sessionId && (
                    <div className="mt-5 rounded-xl bg-stone-50 border border-stone-200 px-4 py-3 text-xs text-stone-500 break-all">
                        <span className="font-semibold text-stone-700">Reference ID: </span>
                        {sessionId}
                    </div>
                )}

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <Link
                        href="/dashboard/customer/appointments"
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-700 transition"
                    >
                        <Calendar className="w-4 h-4" />
                        My Appointments
                    </Link>
                    <Link
                        href="/"
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-50 transition"
                    >
                        <Home className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 flex items-center justify-center">
                <Suspense
                    fallback={
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-600 border-t-transparent" />
                    }
                >
                    <PaymentSuccessContent />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}