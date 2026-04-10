import { createBrowserRouter, Navigate } from "react-router";
import RegisterPage from "../features/auth/RegisterPage";
import LoginPage from "../features/auth/LoginPage";
import ProfilePage from "../features/profile/ProfilePage";
import MainLayout from "../layouts/MainLayout";
import ProgramPage from "../features/program/ProgramPage";
import ProgramDetailPage from "../features/program/ProgramDetailPage";
import HealthPage from "../features/health/HealthPage";
import DashboardPage from "../features/dashboard/DashboardPage";
import PublicOnly from "../layouts/PublicOnly";
import FeaturePage from "../pages/FeaturePage";
import BlogPage from "../features/blog/BlogPage";
import BlogDetailPage from "../features/blog/BlogDetailPage";
import BlogEditorPage from "../features/blog/BlogEditorPage";
import AboutUsPage from "../pages/AboutUsPage";
import ProtectedRoute from "../layouts/ProtectedRoute";
import AdminRoute from "../layouts/AdminRoute";
import SharedLayout from "../layouts/SharedLayout";
import AdminUsersPage from "../features/admin/AdminUsersPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: () => <Navigate to="/feature" replace /> },
      // --- 1. หน้าที่เข้าได้ทุกคน (Shared Routes) ---
      {
        Component: SharedLayout,
        children: [
          { path: "/blog", Component: BlogPage },
          { path: "/blog/:slug", Component: BlogDetailPage },
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
          { path: "/profile", Component: ProfilePage },
          { path: "/program", Component: ProgramPage },
          { path: "/program/:id", Component: ProgramDetailPage },
          { path: "/health", Component: HealthPage },
          { path: "/dashboard", Component: DashboardPage },
        ],
      },
      // --- 4. หน้าสำหรับ Admin เท่านั้น ---
      {
        Component: AdminRoute,
        children: [
          { path: "/admin/users", Component: AdminUsersPage },
          { path: "/blog/new", Component: BlogEditorPage },
          { path: "/blog/edit/:id", Component: BlogEditorPage },
        ],
      },
    ],
  },
]);
