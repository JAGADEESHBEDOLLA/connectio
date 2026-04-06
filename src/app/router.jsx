import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { SuperAdminAuthPage } from "@/features/super-admin-auth/pages/super-admin-auth-page";
import { SuperAdminDashboardPage } from "@/features/super-admin-dashboard/pages/super-admin-dashboard-page";
import { useAuthStore } from "@/store/auth-store";

function ProtectedSuperAdminRoute({ children }) {
  const session = useAuthStore((state) => state.session);

  if (!session?.accessToken) {
    return <Navigate to="/super-admin/auth" replace />;
  }

  return children;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/super-admin/dashboard" replace />} />
        <Route path="/super-admin/auth" element={<SuperAdminAuthPage />} />
        <Route
          path="/super-admin/dashboard"
          element={
            <ProtectedSuperAdminRoute>
              <SuperAdminDashboardPage />
            </ProtectedSuperAdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
