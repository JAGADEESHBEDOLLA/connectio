import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AdminRoutes } from "@/features/admin-dashboard/routes";
import { SuperAdminRoutes } from "@/features/super-admin-dashboard/routes";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/super-admin/dashboard" replace />} />
        {AdminRoutes}
        {SuperAdminRoutes}
      </Routes>
    </BrowserRouter>
  );
}
