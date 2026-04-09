import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  registerSchema,
  type RegisterInput,
} from "../../schemas/register.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useLocation } from "react-router";
import { apiClient } from "../../lib/apiClient";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function RegisterPage() {
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
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterInput>({
    defaultValues: { email: "", password: "", firstName: "", lastName: "" },
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<RegisterInput> = async (data) => {
    try {
      await apiClient.post("/auth/register", data);
      toast.success("Your account has been created. Please login to continue");
      navigate("/login");
    } catch (err) {
      if (err instanceof AxiosError) {
        // 1. ถ้ามีคำตอบจาก Server (เช่น 409)
        if (err.response) {
          if (err.response.status === 409) {
            setError("email", { message: "email already in use" });
            return;
          }
          // โชว์ข้อความที่ส่งมาจาก Backend
          toast.error(err.response.data.message || "An error occurred");
        }
        // 2. ถ้าไม่มีคำตอบจาก Server (เช่น Server ปิด)
        else if (err.request) {
          toast.error(
            "Cannot connect to server. Please check if your backend is running.",
          );
        }
        return;
      }

      // 3. Error อื่นๆ ที่ไม่ใช่ Axios (เช่น โค้ดฝั่ง Client พังเอง)
      toast.error("something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 gap-10 relative">
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
      <div className="flex flex-col justify-center items-center gap-1">
        <div className="flex items-center gap-2.5 mb-5">
          <svg
            className="w-6 h-5 text-lime-400"
            viewBox="0 0 24 18"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
          >
            <path d="M2 4 Q9 1 22 4" strokeWidth={2.2} />
            <path d="M2 9 Q11 6 24 9" strokeWidth={2.2} />
            <path d="M2 14 Q8 11 18 14" strokeWidth={2.2} />
          </svg>
          <h1 className="text-6xl font-black tracking-tighter text-white italic">
            Stride<span className="text-lime-400">Pilot</span>
          </h1>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-lime-400">
          Create your account
        </h2>
        <p className="text-zinc-500 mt-2 text-sm">
          Join the community of elite runners today
        </p>
      </div>
      <div>
        <form
          className="grid grid-cols-2 gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 gap-2">
            <label>First Name</label>
            <input
              placeholder="Enter your first name"
              className=" bg-zinc-900 border border-zinc-800 h-10 rounded-md text-md p-5  focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition-all placeholder:text-zinc-600 text-sm"
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className="text-red-400 text-xs">{errors.firstName.message}</p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-2">
            <label>Last Name</label>
            <input
              placeholder="Enter your last name"
              className=" bg-zinc-900 border border-zinc-800 h-10 rounded-md text-md p-5 focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition-all placeholder:text-zinc-600 text-sm"
              {...register("lastName")}
            />
            {errors.lastName && (
              <p className="text-red-400 text-xs">{errors.lastName.message}</p>
            )}
          </div>
          <div className="grid grid-cols-1 col-span-2 gap-2">
            <label>Email Address</label>
            <input
              placeholder="your_email@example.com"
              className=" bg-zinc-900 border border-zinc-800 h-10 rounded-md text-md p-5 focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition-all placeholder:text-zinc-600 text-sm"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-400 text-xs">{errors.email.message}</p>
            )}
          </div>
          <div className="grid grid-cols-1 col-span-2 gap-2">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create your password"
              className=" bg-zinc-900 border border-zinc-800 h-10 rounded-md text-md p-5 focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition-all placeholder:text-zinc-600 text-sm"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-400 text-xs">{errors.password.message}</p>
            )}
          </div>
          <div className="col-span-2 flex justify-center mt-4">
            <button
              type="submit"
              className="bg-lime-400 text-black px-10 py-3 font-bold rounded-xl hover:cursor-pointer hover:bg-lime-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating your account..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
