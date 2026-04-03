import { RouterProvider } from "react-router";
import { router } from "./routes";
import { toast, Toaster } from "sonner";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect, useState } from "react";
import { apiClient } from "./config/apiClient";
import { userSchema } from "./schemas/user.schema";
import { AxiosError } from "axios";
import SplashScreen from "./layouts/SplashScreen";

export default function App() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await apiClient.get("/auth/me");
        const user = userSchema.parse(res.data.user);
        setAuth(user);
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.status === 401) {
          return;
        }

        if (err instanceof AxiosError) {
          toast.error(
            typeof err.response?.data === "string"
              ? err.response.data
              : err.response?.data?.message || "something went wrong",
          );
          return;
        }

        toast.error("something went wrong. try again later");
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 400);
      }
    };
    initAuth();
  }, [setAuth]);

  if (isLoading) return <SplashScreen />;

  return (
    <div>
      <RouterProvider router={router} />
      <Toaster richColors />
    </div>
  );
}
