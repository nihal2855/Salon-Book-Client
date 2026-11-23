import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default function CustomerDashboardLayout({ children }) {
    return (
        <ProtectedRoute allowedRoles={["customer"]}>
            <DashboardShell role="customer">{children}</DashboardShell>
        </ProtectedRoute>
    );
}