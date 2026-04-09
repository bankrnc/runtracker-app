import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import Header from "./Header";

export default function ProtectedRoute() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) return <Navigate to="/feature" replace />;
  if (user?.role === "admin") return <Navigate to="/admin/users" replace />;

  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}
