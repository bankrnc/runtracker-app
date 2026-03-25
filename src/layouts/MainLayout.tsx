import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <div>
      <div>MainLayout</div>
      <Outlet />
    </div>
  );
}
