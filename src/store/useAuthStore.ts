import { create } from "zustand";
import type { User } from "../schemas/user.schema";

type AuthStore = {
  isAuthenticated: boolean;
  user: User | null;
  setAuth: (user: User) => void;
  clearAuth: () => void;
  //uploadProfileImage: (imageUrl: string) => void;
};

//(set) => คือคำสั่ง update state
export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: null,
  setAuth: (user) => set({ isAuthenticated: true, user }),
  clearAuth: () => set({ isAuthenticated: false, user: null }),
  //มีการ update state จาก state ก่อนหน้าเลยต้องใช้ callback
  //uploadProfileImage: (imageUrl) =>
  //set((state) => ({ user: state.user ? { ...state.user, imageUrl } : null })),
}));
