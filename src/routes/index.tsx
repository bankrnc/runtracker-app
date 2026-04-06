import { createBrowserRouter } from "react-router";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";
import MainLayout from "../layouts/MainLayout";
import ProgramPage from "../pages/ProgramPage";
import ActualRunPage from "../pages/ActualRunPage";
import HealthPage from "../pages/HealthPage";
import DashboardPage from "../pages/DashboardPage";
import PublicOnly from "../layouts/PublicOnly";
import FeaturePage from "../pages/FeaturePage";
import BlogPage from "../pages/BlogPage";
import AboutUsPage from "../pages/AboutUsPage";
import ProtectedRoute from "../layouts/ProtectedRoute";
import SharedLayout from "../layouts/SharedLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      // --- 1. หน้าที่เข้าได้ทุกคน (Shared Routes) ---
      {
        Component: SharedLayout,
        children: [
          { path: "/blog", Component: BlogPage },
          { path: "/about", Component: AboutUsPage },
        ],
      },
      // --- 2. หน้าสำหรับคนยังไม่ Login เท่านั้น (Guest Only) ---
      {
        Component: PublicOnly,
        children: [
          { path: "/register", Component: RegisterPage },
          { path: "/login", Component: LoginPage },
          { path: "/feature", Component: FeaturePage },
        ],
      },
      // --- 3. หน้าสำหรับคน Login แล้วเท่านั้น (Auth Required) ---
      {
        Component: ProtectedRoute,
        children: [
          { index: true, Component: HomePage },
          { path: "/profile", Component: ProfilePage },
          { path: "/program", Component: ProgramPage },
          { path: "/actual", Component: ActualRunPage },
          { path: "/health", Component: HealthPage },
          { path: "/dashboard", Component: DashboardPage },
        ],
      },
    ],
  },
]);
