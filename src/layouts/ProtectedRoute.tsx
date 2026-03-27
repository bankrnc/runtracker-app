import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import Header from "./Header";

export default function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    // ดีดไปเลย ไม่ต้องมี Header ที่นี่ เพราะเดี๋ยวหน้าปลายทาง (Feature) จะโชว์ Header ของมันเอง
    return <Navigate to="/feature" replace />;
  }

  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}
