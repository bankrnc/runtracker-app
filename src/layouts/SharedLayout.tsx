import { Outlet } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import Header from "./Header";
import AdminHeader from "./AdminHeader";
import HeaderNotAuth from "./HeaderNotAuth";

export default function SharedLayout() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <div>
      {!isAuthenticated ? <HeaderNotAuth /> : user?.role === "admin" ? <AdminHeader /> : <Header />}
      <main>
        <Outlet />
      </main>
    </div>
  );
}
