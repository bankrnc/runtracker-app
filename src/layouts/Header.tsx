import { useState } from "react";
import { Link, NavLink } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { apiClient } from "../config/apiClient";

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  //For Logout
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const handleClickLogout = async () => {
    await apiClient.post("/auth/logout");
    clearAuth();
    setSidebarOpen(false);
  };

  const navItemStyle = ({ isActive }: { isActive: boolean }) => `
  px-4 py-2 rounded-lg text-[14px] font-bold transition-all duration-200
  ${
    isActive
      ? "text-lime-400 bg-lime-400/10"
      : "text-zinc-300 hover:text-white hover:bg-zinc-800/50"
  }
`;

  const secondaryLinkStyle = ({ isActive }: { isActive: boolean }) => `
  px-4 py-2 text-[13px] font-medium transition-all duration-200
  ${isActive ? "text-lime-400" : "text-zinc-500 hover:text-zinc-300"}
`;

  const sidebarNavItemStyle = ({ isActive }: { isActive: boolean }) => `
  flex items-center px-4 py-3 rounded-lg text-[15px] font-bold transition-all duration-200
  ${
    isActive
      ? "text-lime-400 bg-lime-400/10"
      : "text-zinc-300 hover:text-white hover:bg-zinc-800/50"
  }
`;

  const sidebarSecondaryStyle = ({ isActive }: { isActive: boolean }) => `
  flex items-center px-4 py-3 rounded-lg text-[14px] font-medium transition-all duration-200
  ${isActive ? "text-lime-400 bg-lime-400/10" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30"}
`;

  //สำหรับเอา user name ไปโชว์
  const user = useAuthStore((state) => state.user);

  return (
    <>
      <header className="w-full bg-[#0a0a0a] border-b border-zinc-800 text-white">
        <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 xl:px-12 h-20 flex items-center justify-between">
          {/* Mobile Menu Icon */}
          <button
            className="xl:hidden p-2 text-zinc-400 hover:text-white transition-colors hover:cursor-pointer"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>

          {/* 1. Logo Section */}
          <Link to="/">
            <div className="shrink-0">
              <div
                className="text-3xl font-black italic tracking-tighter text-lime-400 transition-transform duration-300 ease-out
  hover:scale-125 hover:cursor-pointer"
              >
                Velo<span className="text-white">Step</span>
              </div>
            </div>
          </Link>

          {/* 2. Navigation Section */}
          <nav className="hidden xl:flex items-center gap-1 2xl:gap-4">
            {/* กลุ่มเมนูหลัก (เครื่องมือ) */}
            <div className="flex items-center gap-1 border-r border-zinc-800 pr-4 mr-4">
              <NavLink to="/dashboard" className={navItemStyle}>
                Dashboard
              </NavLink>
              <NavLink to="/program" className={navItemStyle}>
                Programs
              </NavLink>
              <NavLink to="/actual" className={navItemStyle}>
                Tracking
              </NavLink>
              <NavLink to="/health" className={navItemStyle}>
                Health
              </NavLink>
            </div>

            {/* กลุ่มเมนูรอง (เนื้อหา) - ใช้สีที่ดรอปลงมานิดนึง */}
            <div className="flex items-center gap-1">
              <NavLink to="/blog" className={secondaryLinkStyle}>
                Blog
              </NavLink>
              <NavLink to="/about" className={secondaryLinkStyle}>
                About
              </NavLink>
            </div>
          </nav>

          {/* 3. Right Section: User & Auth */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            {/* User Text - Hidden on mid-screens to prevent overlapping */}
            <div className="hidden 2xl:flex flex-col items-end leading-none">
              <span className="text-[10px] text-zinc-500  font-bold tracking-widest mb-1 whitespace-nowrap">
                Hi Athlete !
              </span>
              <span className="text-sm font-bold text-zinc-100 whitespace-nowrap">
                {user?.profile?.firstName} {user?.profile?.lastName}
              </span>
            </div>

            {/* Avatar Circle */}
            <Link to="/profile">
              <div
                className="h-12 w-12 p-0.5 rounded-full bg-linear-to-tr from-lime-400 to-green-500 border-2 border-zinc-900 shadow-lg transition-transform duration-300 ease-out
  hover:scale-125"
              >
                <div className="w-full h-full bg-zinc-900 rounded-full overflow-hidden flex items-center justify-center">
                  {user?.profile?.imageUrl ? (
                    <img src={user?.profile?.imageUrl} />
                  ) : (
                    <span className="text-md grayscale  transition-all duration-500 group-hover:grayscale-0">
                      👤
                    </span>
                  )}
                </div>
              </div>
            </Link>

            <div className="h-6 w-px bg-zinc-800 hidden md:block" />

            {/* Auth Buttons */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                className="bg-lime-400 text-black px-5 py-2 rounded-full text-[14px] font-black hover:bg-white transition-all shadow-[0_0_15px_rgba(163,230,53,0.2)] hover:cursor-pointer"
                onClick={handleClickLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 xl:hidden ${
          sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-[#0a0a0a] border-r border-zinc-800 flex flex-col transition-transform duration-300 ease-in-out xl:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-5 h-20 border-b border-zinc-800 shrink-0">
          <Link to="/" onClick={() => setSidebarOpen(false)}>
            <div className="text-2xl font-black italic tracking-tighter text-lime-400">
              Velo<span className="text-white">Step</span>
            </div>
          </Link>
          <button
            className="p-2 text-zinc-400 hover:text-white transition-colors"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-800/50">
          <Link to="/profile" onClick={() => setSidebarOpen(false)}>
            <div className="h-10 w-10 p-0.5 rounded-full bg-linear-to-tr from-lime-400 to-green-500 border-2 border-zinc-900 shrink-0">
              <div className="w-full h-full bg-zinc-900 rounded-full overflow-hidden flex items-center justify-center">
                {user?.profile?.imageUrl ? (
                  <img
                    src={user?.profile?.imageUrl}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm">👤</span>
                )}
              </div>
            </div>
          </Link>
          <div className="flex flex-col leading-none">
            <span className="text-[10px] text-zinc-500 font-bold tracking-widest mb-1">
              Hi Athlete !
            </span>
            <span className="text-sm font-bold text-zinc-100">
              {user?.profile?.firstName} {user?.profile?.lastName}
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
          <p className="text-[10px] font-bold tracking-widest text-zinc-600 px-4 mb-1">
            MAIN
          </p>
          <NavLink
            to="/dashboard"
            className={sidebarNavItemStyle}
            onClick={() => setSidebarOpen(false)}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/program"
            className={sidebarNavItemStyle}
            onClick={() => setSidebarOpen(false)}
          >
            Programs
          </NavLink>
          <NavLink
            to="/actual"
            className={sidebarNavItemStyle}
            onClick={() => setSidebarOpen(false)}
          >
            Tracking
          </NavLink>
          <NavLink
            to="/health"
            className={sidebarNavItemStyle}
            onClick={() => setSidebarOpen(false)}
          >
            Health
          </NavLink>

          <div className="my-3 border-t border-zinc-800" />

          <p className="text-[10px] font-bold tracking-widest text-zinc-600 px-4 mb-1">
            MORE
          </p>
          <NavLink
            to="/blog"
            className={sidebarSecondaryStyle}
            onClick={() => setSidebarOpen(false)}
          >
            Blog
          </NavLink>
          <NavLink
            to="/about"
            className={sidebarSecondaryStyle}
            onClick={() => setSidebarOpen(false)}
          >
            About
          </NavLink>
        </nav>

        {/* Sidebar Footer */}
        <div className="px-4 py-5 border-t border-zinc-800 shrink-0">
          <button
            className="w-full bg-lime-400 text-black px-5 py-2.5 rounded-full text-[14px] font-black hover:bg-white transition-all shadow-[0_0_15px_rgba(163,230,53,0.2)] hover:cursor-pointer"
            onClick={handleClickLogout}
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
