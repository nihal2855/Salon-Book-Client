import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export const metadata = {
    title: "Privacy Policy | SalonBook",
    description: "Learn how SalonBook collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
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
                        <ShieldCheck className="w-6 h-6" />
                    </span>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">
                            Privacy Policy
                        </h1>
                        <p className="text-xs text-stone-500 mt-0.5">
                            Last Updated: November 2026
                        </p>
                    </div>
                </div>

                <div className="mt-8 space-y-6 text-sm text-stone-600 leading-relaxed">
                    <section>
                        <h2 className="text-base font-bold text-stone-900 mb-2">
                            1. Information We Collect
                        </h2>
                        <p>
                            When you create an account, browse services, or book an appointment on
                            SalonBook, we collect personal details including your full name, email
                            address, profile photo, optional phone number, and appointment booking
                            history. If you sign in using Google OAuth, we receive your basic profile
                            information authorized by Google.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-stone-900 mb-2">
                            2. How We Use Your Information
                        </h2>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li>To create and manage your customer or administrator account.</li>
                            <li>To process, confirm, or cancel salon appointment requests.</li>
                            <li>To facilitate secure appointment payments via Stripe Checkout.</li>
                            <li>To maintain platform security and prevent unauthorized access.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-stone-900 mb-2">
                            3. Payment Security
                        </h2>
                        <p>
                            All online payments are processed securely through Stripe. SalonBook
                            does not store your credit or debit card numbers on our servers. We only
                            retain verified transaction references, payment amounts, currency, and
                            payment status for billing and record-keeping purposes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-stone-900 mb-2">
                            4. Image Hosting & Third-Party Services
                        </h2>
                        <p>
                            Uploaded profile images and salon service images are hosted securely via
                            ImgBB. Authentication sessions and database records are protected using
                            encrypted tokens and environment-isolated credentials.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-stone-900 mb-2">
                            5. Your Profile Rights & Contact
                        </h2>
                        <p>
                            You may review and update your name, profile image, and contact number
                            anytime from your dashboard profile settings. If you have questions
                            regarding this Privacy Policy, contact us at{" "}
                            <span className="font-semibold text-stone-800">
                                hello@salonbook.com
                            </span>{" "}
                            or visit us at 420 Madison Avenue, Suite 300, New York, NY 10017.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}