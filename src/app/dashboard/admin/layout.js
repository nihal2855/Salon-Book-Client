import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default function AdminDashboardLayout({ children }) {
    return (
        <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardShell role="admin">{children}</DashboardShell>
        </ProtectedRoute>
    );
}