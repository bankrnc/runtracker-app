import { Link, NavLink } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { apiClient } from "../config/apiClient";

export default function Header() {
  //For Logout
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const handleClickLogout = async () => {
    await apiClient.post("/auth/logout");
    clearAuth();
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

  //สำหรับเอา user name ไปโชว์
  const user = useAuthStore((state) => state.user);

  return (
    <header className="w-full bg-[#0a0a0a] border-b border-zinc-800 text-white">
      <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 xl:px-12 h-20 flex items-center justify-between">
        {/* Mobile Menu Icon (Placeholder for Draft) */}
        <div className="xl:hidden p-2 text-zinc-400">
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
        </div>
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

        {/* 2. Navigation Section - ปรับให้สะอาดขึ้น */}
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
            {/* <Link
              to="/login"
              className="text-[14px] font-bold text-zinc-300 hover:text-white transition-colors"
            >
              Login
            </Link> */}
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
  );
}
