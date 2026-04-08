import { useForm, type SubmitHandler } from "react-hook-form";
import { loginSchema, type LoginInput } from "../../schemas/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiClient } from "../../lib/apiClient";
import { userSchema } from "../../schemas/user.schema";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useAuthStore } from "../../store/useAuthStore";
import { Link, useNavigate } from "react-router";

export default function LoginPage() {
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
      navigate("/dashboard");
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
    <div className="min-h-screen flex flex-col justify-center items-center p-6 gap-10  bg-black text-white font-sans ">
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
