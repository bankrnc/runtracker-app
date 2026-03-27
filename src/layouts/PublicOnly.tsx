import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import HeaderNotAuth from "./HeaderNotAuth";

export default function PublicOnly() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  // เช็กว่าตอนนี้อยู่ที่หน้า login หรือ register หรือไม่
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      {/* ถ้าเป็นหน้า login/register ไม่ต้องโชว์ Header */}
      {!isAuthPage && <HeaderNotAuth />}
      <Outlet />
    </div>
  );
}
