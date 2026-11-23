"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSession, signOut, authClient } from "@/lib/auth-client";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [verifiedUser, setVerifiedUser] = useState(null);
  const [checking, setChecking] = useState(true);

  const rolesKey = allowedRoles.join(",");

  useEffect(() => {
    let isMounted = true;

    async function verifyAccess() {
      if (isPending) return;

      let currentUser = session?.user || null;

      if (!currentUser) {
        try {
          const fresh = await authClient.getSession({
            fetchOptions: { cache: "no-store" },
          });
          currentUser = fresh?.data?.user || null;
        } catch (err) {
          currentUser = null;
        }
      }

      if (!isMounted) return;

      if (!currentUser) {
        toast.error("Please sign in to access this page.");
        router.replace("/sign-in");
        return;
      }

      if (currentUser.isBlocked) {
        toast.error("Your account has been blocked by an administrator.");
        await signOut();
        router.replace("/sign-in");
        return;
      }

      const permitted = rolesKey ? rolesKey.split(",") : [];
      const userRole = currentUser.role || "customer";
      if (permitted.length > 0 && !permitted.includes(userRole)) {
        toast.error("You do not have permission to access this area.");
        router.replace(
          userRole === "admin" ? "/dashboard/admin" : "/dashboard/customer"
        );
        return;
      }

      setVerifiedUser(currentUser);
      setChecking(false);
    }

    verifyAccess();

    return () => {
      isMounted = false;
    };
  }, [session, isPending, rolesKey, router]);

  if (isPending || checking) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-600 border-t-transparent" />
        <p className="text-sm font-medium text-stone-600">
          Verifying session...
        </p>
      </div>
    );
  }

  if (!verifiedUser) {
    return null;
  }

  return children;
}
