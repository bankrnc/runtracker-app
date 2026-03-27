import { Outlet } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import Header from "./Header";
import HeaderNotAuth from "./HeaderNotAuth";

export default function SharedLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <div>
      {isAuthenticated ? <Header /> : <HeaderNotAuth />}
      <main>
        <Outlet />
      </main>
    </div>
  );
}
