"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSession, signOut } from "@/lib/auth-client";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
    const router = useRouter();
    const { data: session, isPending } = useSession();

    useEffect(() => {
        if (isPending) return;

        if (!session?.user) {
            toast.error("Please sign in to access this page.");
            router.replace("/sign-in");
            return;
        }

        if (session.user.isBlocked) {
            toast.error("Your account has been blocked by an administrator.");
            signOut().then(() => router.replace("/sign-in"));
            return;
        }

        const userRole = session.user.role || "customer";
        if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
            toast.error("You do not have permission to access this area.");
            router.replace(userRole === "admin" ? "/dashboard/admin" : "/dashboard/customer");
        }
    }, [session, isPending, allowedRoles, router]);

    if (isPending) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-600 border-t-transparent" />
                <p className="text-sm font-medium text-stone-600">Verifying session...</p>
            </div>
        );
    }

    if (!session?.user || session.user.isBlocked) {
        return null;
    }

    const userRole = session.user.role || "customer";
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        return null;
    }

    return children;
}