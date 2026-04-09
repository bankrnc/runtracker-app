import { useState } from "react";
import { Link, NavLink } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { apiClient } from "../lib/apiClient";

export default function AdminHeader() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const user = useAuthStore((state) => state.user);

  const handleLogout = async () => {
    await apiClient.post("/auth/logout");
    clearAuth();
    setSidebarOpen(false);
  };

  const navStyle = ({ isActive }: { isActive: boolean }) => `
    px-4 py-2 rounded-lg text-[14px] font-bold transition-all duration-200
    ${isActive ? "text-lime-400 bg-lime-400/10" : "text-zinc-300 hover:text-white hover:bg-zinc-800/50"}
  `;

  const sidebarNavStyle = ({ isActive }: { isActive: boolean }) => `
    flex items-center px-4 py-3 rounded-lg text-[15px] font-bold transition-all duration-200
    ${isActive ? "text-lime-400 bg-lime-400/10" : "text-zinc-300 hover:text-white hover:bg-zinc-800/50"}
  `;

  return (
    <>
      <header className="w-full bg-[#0a0a0a] border-b border-zinc-800 text-white">
        <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 xl:px-12 h-20 flex items-center justify-between">
          {/* Mobile Menu Icon */}
          <button
            className="xl:hidden p-2 text-zinc-400 hover:text-white transition-colors hover:cursor-pointer"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>

          {/* Logo */}
          <div className="shrink-0 flex items-center gap-2">
            <svg className="w-6 h-5 text-lime-400" viewBox="0 0 24 18" fill="none" stroke="currentColor" strokeLinecap="round">
              <path d="M2 4 Q9 1 22 4" strokeWidth={2.2} />
              <path d="M2 9 Q11 6 24 9" strokeWidth={2.2} />
              <path d="M2 14 Q8 11 18 14" strokeWidth={2.2} />
            </svg>
            <span className="text-2xl font-black italic tracking-tighter text-white">
              Stride<span className="text-lime-400">Pilot</span>
            </span>
            <span className="ml-1 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-400">
              Admin
            </span>
          </div>

          {/* Nav */}
          <nav className="hidden xl:flex items-center gap-1">
            <NavLink to="/admin/users" className={navStyle}>Users</NavLink>
            <NavLink to="/blog" className={navStyle}>Blog</NavLink>
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            <div className="hidden 2xl:flex flex-col items-end leading-none">
              <span className="text-[10px] text-violet-400 font-bold tracking-widest mb-1">Admin</span>
              <span className="text-sm font-bold text-zinc-100">
                {user?.profile?.firstName} {user?.profile?.lastName}
              </span>
            </div>

            <Link to="/profile">
              <div className="h-12 w-12 p-0.5 rounded-full bg-linear-to-tr from-violet-400 to-violet-600 border-2 border-zinc-900 shadow-lg transition-transform duration-300 ease-out hover:scale-125">
                <div className="w-full h-full bg-zinc-900 rounded-full overflow-hidden flex items-center justify-center">
                  {user?.profile?.imageUrl ? (
                    <img src={user.profile.imageUrl} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-md">👤</span>
                  )}
                </div>
              </div>
            </Link>

            <div className="h-6 w-px bg-zinc-800 hidden md:block" />

            <button
              className="bg-violet-500 text-white px-5 py-2 rounded-full text-[14px] font-black hover:bg-violet-400 transition-all hover:cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 xl:hidden ${
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar Drawer */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-72 bg-[#0a0a0a] border-r border-zinc-800 flex flex-col transition-transform duration-300 ease-in-out xl:hidden ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-5 h-20 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-4 text-lime-400" viewBox="0 0 24 18" fill="none" stroke="currentColor" strokeLinecap="round">
              <path d="M2 4 Q9 1 22 4" strokeWidth={2.2} />
              <path d="M2 9 Q11 6 24 9" strokeWidth={2.2} />
              <path d="M2 14 Q8 11 18 14" strokeWidth={2.2} />
            </svg>
            <span className="text-xl font-black italic tracking-tighter text-white">
              Stride<span className="text-lime-400">Pilot</span>
            </span>
            <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-400">
              Admin
            </span>
          </div>
          <button className="p-2 text-zinc-400 hover:text-white transition-colors" onClick={() => setSidebarOpen(false)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-800/50">
          <Link to="/profile" onClick={() => setSidebarOpen(false)}>
            <div className="h-10 w-10 p-0.5 rounded-full bg-linear-to-tr from-violet-400 to-violet-600 border-2 border-zinc-900 shrink-0">
              <div className="w-full h-full bg-zinc-900 rounded-full overflow-hidden flex items-center justify-center">
                {user?.profile?.imageUrl ? (
                  <img src={user.profile.imageUrl} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm">👤</span>
                )}
              </div>
            </div>
          </Link>
          <div className="flex flex-col leading-none">
            <span className="text-[10px] text-violet-400 font-bold tracking-widest mb-1">Admin</span>
            <span className="text-sm font-bold text-zinc-100">
              {user?.profile?.firstName} {user?.profile?.lastName}
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          <p className="text-[10px] font-bold tracking-widest text-zinc-600 px-4 mb-1">MANAGE</p>
          <NavLink to="/admin/users" className={sidebarNavStyle} onClick={() => setSidebarOpen(false)}>
            Users
          </NavLink>
          <NavLink to="/blog" className={sidebarNavStyle} onClick={() => setSidebarOpen(false)}>
            Blog
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="px-4 py-5 border-t border-zinc-800 shrink-0">
          <button
            className="w-full bg-violet-500 text-white px-5 py-2.5 rounded-full text-[14px] font-black hover:bg-violet-400 transition-all hover:cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
