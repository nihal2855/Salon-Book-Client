"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Eye, EyeOff, Scissors } from "lucide-react";
import { signIn, signOut, authClient } from "@/lib/auth-client";

export default function SignInPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSignIn = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await signIn.email({
                email: email.trim(),
                password,
            });

            if (error) {
                throw new Error(error.message || "Invalid email or password.");
            }

            const sessionRes = await authClient.getSession();
            const user = sessionRes?.data?.user;

            if (user?.isBlocked) {
                await signOut();
                toast.error("Your account has been blocked by an administrator.");
                setLoading(false);
                return;
            }

            toast.success(`Welcome back, ${user?.name || "User"}!`);
            const role = user?.role || "customer";
            router.push(role === "admin" ? "/dashboard/admin" : "/dashboard/customer");
            router.refresh();
        } catch (err) {
            toast.error(err.message || "Failed to sign in.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signIn.social({
                provider: "google",
                callbackURL: "/dashboard",
            });
        } catch (err) {
            toast.error("Google sign-in failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-100 px-4 py-12">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
                <div className="flex flex-col items-center text-center mb-6">
                    <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-stone-900">
                        <span className="p-2 rounded-xl bg-amber-600 text-white">
                            <Scissors className="w-5 h-5" />
                        </span>
                        SalonBook
                    </Link>
                    <h1 className="mt-4 text-xl font-semibold text-stone-900">Welcome back</h1>
                    <p className="text-sm text-stone-500 mt-1">
                        Sign in to access your SalonBook dashboard
                    </p>
                </div>

                <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm focus:border-amber-600 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 pr-10 text-sm focus:border-amber-600 focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-amber-600 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 transition disabled:opacity-60"
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>

                <div className="my-5 flex items-center gap-3">
                    <div className="h-px flex-1 bg-stone-200" />
                    <span className="text-xs uppercase text-stone-400">Or continue with</span>
                    <div className="h-px flex-1 bg-stone-200" />
                </div>

                <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full flex items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 transition"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                            fill="#EA4335"
                            d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.2 8.9 5 12 5z"
                        />
                        <path
                            fill="#4285F4"
                            d="M23.5 12.3c0-.8-.1-1.7-.2-2.5H12v4.8h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.3 14.8c-.2-.8-.4-1.6-.4-2.5s.2-1.7.4-2.5L1.6 7C.6 9 0 11.2 0 13.5s.6 4.5 1.6 6.5l3.7-2.8z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5l-3.7 2.8C3.5 21.4 7.4 24 12 24z"
                        />
                    </svg>
                    Continue with Google
                </button>

                <p className="mt-6 text-center text-sm text-stone-600">
                    Don&apos;t have an account?{" "}
                    <Link href="/sign-up" className="font-semibold text-amber-600 hover:text-amber-700">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}