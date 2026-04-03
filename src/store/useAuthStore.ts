import { create } from "zustand";
import type { User } from "../schemas/user.schema";

type AuthStore = {
  isAuthenticated: boolean;
  user: User | null;
  setAuth: (user: User) => void;
  clearAuth: () => void;
};

//(set) => คือคำสั่ง update state
export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: null,
  setAuth: (user) => set({ isAuthenticated: true, user }),
  clearAuth: () => set({ isAuthenticated: false, user: null }),
}));
