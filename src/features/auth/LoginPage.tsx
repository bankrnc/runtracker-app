import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { loginSchema, type LoginInput } from "../../schemas/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiClient } from "../../lib/apiClient";
import { userSchema } from "../../schemas/user.schema";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useAuthStore } from "../../store/useAuthStore";
import { Link, useNavigate, useLocation } from "react-router";

export default function LoginPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const sidebarLinkStyle = (path: string) =>
    `flex items-center px-4 py-3 rounded-lg text-[15px] font-bold transition-all duration-200 ${
      isActive(path)
        ? "text-lime-400 bg-lime-400/10"
        : "text-zinc-300 hover:text-white hover:bg-zinc-800/50"
    }`;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const setAuth = useAuthStore((state) => state.setAuth);

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginInput> = async (data) => {
    try {
      const res = await apiClient.post("/auth/login", data);
      //backend sent res. userWithoutPassword มา
      //validate user
      const user = userSchema.parse(res.data.user);
      setAuth(user);
      toast.success("login successfully");
      navigate(user.role === "admin" ? "/admin/users" : "/dashboard");
    } catch (err) {
      console.error(err); // เพิ่มแค่บรรทัดนี้
      if (err instanceof AxiosError) {
        toast.error(
          typeof err.response?.data === "string"
            ? err.response.data
            : err.response?.data?.message || "something went wrong",
        );
        return;
      }
      toast.error("something went wrong. try again later");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 gap-10  bg-black text-white font-sans relative">
      {/* Hamburger Button */}
      <button
        className="fixed top-5 left-5 z-30 flex items-center gap-2 p-2 text-zinc-400 hover:text-white transition-colors hover:cursor-pointer"
        onClick={() => setSidebarOpen(true)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
        <span className="text-sm font-bold tracking-widest uppercase">Menu</span>
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar Drawer */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-72 bg-[#0a0a0a] border-r border-zinc-800 flex flex-col transition-transform duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
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
          </div>
          <button className="p-2 text-zinc-400 hover:text-white transition-colors hover:cursor-pointer" onClick={() => setSidebarOpen(false)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          <p className="text-[10px] font-bold tracking-widest text-zinc-600 px-4 mb-1">MENU</p>
          <Link to="/feature" className={sidebarLinkStyle("/feature")} onClick={() => setSidebarOpen(false)}>Features</Link>
          <Link to="/blog" className={sidebarLinkStyle("/blog")} onClick={() => setSidebarOpen(false)}>Blog</Link>
          <Link to="/about" className={sidebarLinkStyle("/about")} onClick={() => setSidebarOpen(false)}>About Us</Link>
        </nav>
        <div className="px-4 py-5 border-t border-zinc-800 flex flex-col gap-3 shrink-0">
          <Link
            to="/login"
            onClick={() => setSidebarOpen(false)}
            className="w-full text-center text-[14px] font-bold text-zinc-100 bg-white/5 border border-white/10 px-6 py-2.5 rounded-full transition-all hover:bg-white/10"
          >
            Login
          </Link>
          <Link
            to="/register"
            onClick={() => setSidebarOpen(false)}
            className="w-full text-center bg-lime-400 text-black px-6 py-2.5 rounded-full text-[14px] font-black hover:bg-white transition-all"
          >
            Get Started
          </Link>
        </div>
      </aside>
      <div className="flex flex-col justify-center items-center gap-5">
        <div className="flex items-center gap-2.5">
          <svg
            className="w-7 h-6 text-lime-400"
            viewBox="0 0 24 18"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
          >
            <path d="M2 4 Q9 1 22 4" strokeWidth={2.2} />
            <path d="M2 9 Q11 6 24 9" strokeWidth={2.2} />
            <path d="M2 14 Q8 11 18 14" strokeWidth={2.2} />
          </svg>
          <h1 className="text-5xl font-black tracking-tighter text-white italic">
            Stride<span className="text-lime-400">Pilot</span>
          </h1>
        </div>
        <p className="text-zinc-400 text-sm font-medium">
          Welcome back, athlete
        </p>
        <div className="inline-flex items-center justify-center bg-lime-400/10 border border-lime-400/20 rounded-4xl px-3 py-2">
          <span className="text-[10px] font-bold text-lime-400 tracking-[0.2em]">
            ELITE ACCESS
          </span>
        </div>
      </div>
      <form
        className="flex flex-col w-full max-w-md gap-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 gap-1">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
            Email Address
          </label>
          <input
            className=" bg-zinc-900/40 border border-zinc-800 h-12 rounded-xl text-md p-6 focus:outline-none focus:border-lime-400/50 focus:ring-1 focus:ring-lime-400/20 transition-all placeholder:text-zinc-700 text-sm"
            placeholder="runner@stridepilot.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-400 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div className="grid grid-cols-1 gap-1 mt-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
            Password
          </label>
          <input
            type="password"
            className=" bg-zinc-900/40 border border-zinc-800 h-12 rounded-xl text-md p-6 focus:outline-none focus:border-lime-400/50 focus:ring-1 focus:ring-lime-400/20 transition-all placeholder:text-zinc-700 text-sm"
            placeholder="••••••••"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-400 text-sm">{errors.password.message}</p>
          )}
        </div>
        <div className="flex items-center justify-center mt-6">
          <button
            type="submit"
            className="w-full bg-lime-400 text-black font-black py-3.5 rounded-2xl mt-4 hover:bg-lime-300 hover:cursor-pointer transition-all active:scale-[0.98] shadow-[0_20px_40px_-15px_rgba(163,230,53,0.2)] uppercase tracking-tight text-sm"
          >
            LOGIN
          </button>
        </div>
      </form>

      <div className="flex flex-col items-center gap-2 mt-4">
        <p className="text-zinc-500 text-sm tracking-wide">
          Don't have an account?
        </p>

        <Link
          to="/register"
          className="text-lime-400 font-bold text-md tracking-tight hover:text-lime-300 transition-all underline underline-offset-4 decoration-lime-400/30"
        >
          Create your account
        </Link>
      </div>
    </div>
  );
}
