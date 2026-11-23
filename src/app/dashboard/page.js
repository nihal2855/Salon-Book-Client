"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSession, signOut } from "@/lib/auth-client";

export default function DashboardRedirectPage() {
    const router = useRouter();
    const { data: session, isPending } = useSession();

    useEffect(() => {
        if (isPending) return;

        if (!session?.user) {
            router.replace("/sign-in");
            return;
        }

        if (session.user.isBlocked) {
            toast.error("Your account has been blocked by an administrator.");
            signOut().then(() => router.replace("/sign-in"));
            return;
        }

        const role = session.user.role || "customer";
        router.replace(role === "admin" ? "/dashboard/admin" : "/dashboard/customer");
    }, [session, isPending, router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-600 border-t-transparent" />
            <p className="text-sm font-medium text-stone-600">Redirecting to your dashboard...</p>
        </div>
    );
}