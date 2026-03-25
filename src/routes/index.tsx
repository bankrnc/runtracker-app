import { createBrowserRouter } from "react-router";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";

export const router = createBrowserRouter([
  { path: "/register", Component: RegisterPage },
  { path: "/login", Component: LoginPage },
]);
