import { Link, useLocation } from "react-router";

export default function HeaderNotAuth() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const linkStyle =
    "text-[15px] font-semibold  hover:text-lime-400 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 active:translate-y-0";

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
        <div className="shrink-0">
          <div className="text-3xl font-black italic tracking-tighter text-lime-400">
            Velo<span className="text-white">Step</span>
          </div>
        </div>

        {/* 2. Navigation Section - Center & Bright */}
        <nav className="hidden xl:flex items-center gap-6 2xl:gap-10">
          <Link
            to="/feature"
            className={`${linkStyle} ${isActive("/feature") ? "text-lime-400" : "text-zinc-100"}`}
          >
            Features
          </Link>

          <Link
            to="/blog"
            className={`${linkStyle} ${isActive("/blog") ? "text-lime-400" : "text-zinc-100"}`}
          >
            Blog
          </Link>
          <Link
            to="/about"
            className={`${linkStyle} ${isActive("/about") ? "text-lime-400" : "text-zinc-100"}`}
          >
            About Us
          </Link>
        </nav>

        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
          <div className="h-6 w-px bg-zinc-800 hidden md:block mr-6" />

          {/* Auth Buttons */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/login"
              className="text-[14px] font-bold text-zinc-100 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 px-6 py-2 rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:-translate-y-0.5 active:scale-95"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-lime-400 text-black px-6 py-2 rounded-full text-[14px] font-black transition-all duration-300 hover:bg-white hover:translate-x-1.5 hover:shadow-[0_0_25px_rgba(163,230,53,0.4)] active:scale-95 cursor-pointer"
            >
              Join Step
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
