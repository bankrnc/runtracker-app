import { createBrowserRouter } from "react-router";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import UserInformPage from "../pages/UserInformPage";
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";

export const router = createBrowserRouter([
  { path: "/", Component: HomePage },
  { path: "/register", Component: RegisterPage },
  { path: "/user-inform", Component: UserInformPage },
  { path: "/login", Component: LoginPage },
  { path: "/profile", Component: ProfilePage },
]);
