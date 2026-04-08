import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import Header from "./Header";

export default function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/feature" replace />;
  }

  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}
