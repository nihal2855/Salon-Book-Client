"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Eye, EyeOff, Upload, Link as LinkIcon, Scissors } from "lucide-react";
import { signUp, signIn } from "@/lib/auth-client";
import { uploadImageToImgBB } from "@/lib/imgbb";

export default function SignUpPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [imageMode, setImageMode] = useState("upload"); // "upload" | "url"
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const validatePassword = (pwd) => {
        if (pwd.length < 6) {
            return "Password must be at least 6 characters long.";
        }
        if (!/[A-Z]/.test(pwd)) {
            return "Password must contain at least one uppercase letter.";
        }
        if (!/[a-z]/.test(pwd)) {
            return "Password must contain at least one lowercase letter.";
        }
        return null;
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        const passwordError = validatePassword(password);
        if (passwordError) {
            toast.error(passwordError);
            return;
        }

        setLoading(true);
        try {
            let finalImageUrl = "";

            if (imageMode === "upload" && imageFile) {
                finalImageUrl = await uploadImageToImgBB(imageFile);
            } else if (imageMode === "url" && imageUrl.trim()) {
                finalImageUrl = imageUrl.trim();
            }

            const { error } = await signUp.email({
                name: name.trim(),
                email: email.trim(),
                password,
                image: finalImageUrl,
            });

            if (error) {
                throw new Error(error.message || "Registration failed.");
            }

            toast.success("Account created successfully! Welcome to SalonBook.");
            router.push("/dashboard/customer");
            router.refresh();
        } catch (err) {
            toast.error(err.message || "Something went wrong during sign up.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        try {
            await signIn.social({
                provider: "google",
                callbackURL: "/dashboard/customer",
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
                    <h1 className="mt-4 text-xl font-semibold text-stone-900">Create your account</h1>
                    <p className="text-sm text-stone-500 mt-1">
                        Book appointments and manage your salon visits easily
                    </p>
                </div>

                <form onSubmit={handleSignUp} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Sarah Jenkins"
                            className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm focus:border-amber-600 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="sarah@example.com"
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
                                placeholder="Min 6 chars, 1 uppercase, 1 lowercase"
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
                        <p className="text-xs text-stone-500 mt-1">
                            Must be at least 6 characters with 1 uppercase and 1 lowercase letter.
                        </p>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-sm font-medium text-stone-700">
                                Profile Image (Optional)
                            </label>
                            <div className="flex gap-2 text-xs">
                                <button
                                    type="button"
                                    onClick={() => setImageMode("upload")}
                                    className={`flex items-center gap-1 px-2 py-0.5 rounded ${imageMode === "upload"
                                            ? "bg-amber-100 text-amber-800 font-medium"
                                            : "text-stone-500 hover:text-stone-700"
                                        }`}
                                >
                                    <Upload className="w-3 h-3" /> Upload
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setImageMode("url")}
                                    className={`flex items-center gap-1 px-2 py-0.5 rounded ${imageMode === "url"
                                            ? "bg-amber-100 text-amber-800 font-medium"
                                            : "text-stone-500 hover:text-stone-700"
                                        }`}
                                >
                                    <LinkIcon className="w-3 h-3" /> URL
                                </button>
                            </div>
                        </div>

                        {imageMode === "upload" ? (
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                className="w-full text-sm text-stone-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200 border border-stone-300 rounded-lg p-1"
                            />
                        ) : (
                            <input
                                type="url"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://example.com/avatar.jpg"
                                className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm focus:border-amber-600 focus:outline-none"
                            />
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-amber-600 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 transition disabled:opacity-60"
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                <div className="my-5 flex items-center gap-3">
                    <div className="h-px flex-1 bg-stone-200" />
                    <span className="text-xs uppercase text-stone-400">Or continue with</span>
                    <div className="h-px flex-1 bg-stone-200" />
                </div>

                <button
                    type="button"
                    onClick={handleGoogleSignUp}
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
                    Already have an account?{" "}
                    <Link href="/sign-in" className="font-semibold text-amber-600 hover:text-amber-700">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}