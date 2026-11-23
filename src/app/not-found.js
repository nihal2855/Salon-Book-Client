import Link from "next/link";
import { AlertCircle, Home } from "lucide-react";

export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
            <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200 p-10 text-center shadow-sm">
                <AlertCircle className="w-12 h-12 text-amber-600 mx-auto" />
                <h1 className="mt-4 text-3xl font-extrabold text-stone-900">404</h1>
                <p className="mt-2 text-base font-semibold text-stone-800">
                    Page Not Found
                </p>
                <p className="mt-1 text-sm text-stone-500">
                    The page you are looking for does not exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 transition"
                >
                    <Home className="w-4 h-4" />
                    Back to Home
                </Link>
            </div>
        </div>
    );
}