import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import AdminHeader from "./AdminHeader";

export default function AdminRoute() {
  const user = useAuthStore((s) => s.user);

  if (!user) return <Navigate to="/feature" replace />;
  if (user.role !== "admin") return <Navigate to="/program" replace />;

  return (
    <div>
      <AdminHeader />
      <Outlet />
    </div>
  );
}
