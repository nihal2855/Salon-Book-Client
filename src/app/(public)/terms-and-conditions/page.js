import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

export const metadata = {
    title: "Terms & Conditions | SalonBook",
    description: "Read the terms and conditions for booking salon services on SalonBook.",
};

export default function TermsAndConditionsPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900 mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
            </Link>

            <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 shadow-sm">
                <div className="flex items-center gap-3">
                    <span className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                        <FileText className="w-6 h-6" />
                    </span>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">
                            Terms and Conditions
                        </h1>
                        <p className="text-xs text-stone-500 mt-0.5">
                            Last Updated: November 2026
                        </p>
                    </div>
                </div>

                <div className="mt-8 space-y-6 text-sm text-stone-600 leading-relaxed">
                    <section>
                        <h2 className="text-base font-bold text-stone-900 mb-2">
                            1. Acceptance of Terms
                        </h2>
                        <p>
                            By accessing or using the SalonBook platform, you agree to be bound by
                            these Terms and Conditions. If you do not agree with any part of these
                            terms, please discontinue using the platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-stone-900 mb-2">
                            2. User Accounts & Responsibilities
                        </h2>
                        <p>
                            Customers must provide accurate registration details and maintain the
                            confidentiality of their login credentials. You are responsible for all
                            booking and payment activity conducted under your account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-stone-900 mb-2">
                            3. Appointment Booking & Cancellation Policy
                        </h2>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li>
                                All new appointment requests start with a <strong>Pending</strong>{" "}
                                status until reviewed and confirmed by a salon administrator.
                            </li>
                            <li>
                                Duplicate bookings for the exact same date and time slot are
                                automatically prevented to ensure fair scheduling.
                            </li>
                            <li>
                                Customers may cancel their own <strong>Pending</strong> appointment
                                requests directly from their dashboard. Once an appointment is{" "}
                                <strong>Confirmed</strong>, it can no longer be cancelled by the
                                customer online.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-stone-900 mb-2">
                            4. Payments & Pricing
                        </h2>
                        <p>
                            Service prices and estimated durations are listed in USD on each
                            service page. Online payment becomes available once an administrator
                            confirms your appointment request and must be completed through our
                            integrated Stripe Checkout flow.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-stone-900 mb-2">
                            5. Account Suspension
                        </h2>
                        <p>
                            SalonBook administrators reserve the right to block or restrict user
                            accounts that misuse the booking system, submit fraudulent requests, or
                            violate platform policies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-stone-900 mb-2">
                            6. Contact Information
                        </h2>
                        <p>
                            For scheduling assistance or inquiries regarding these terms, reach out
                            to <span className="font-semibold text-stone-800">hello@salonbook.com</span>{" "}
                            or call <span className="font-semibold text-stone-800">+1 (212) 555-0194</span>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}