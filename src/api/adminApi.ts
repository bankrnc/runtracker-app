import { apiClient } from "../lib/apiClient";

export type AdminUser = {
  id: number;
  email: string;
  role: "admin" | "user";
  tier: "free" | "pro";
  status: boolean;
  profile: { firstName: string | null; lastName: string | null } | null;
};

export const adminApi = {
  listUsers: async (): Promise<AdminUser[]> => {
    const res = await apiClient.get<{ users: AdminUser[] }>("/admin/users");
    return res.data.users;
  },

  updateTier: async (userId: number, tier: "free" | "pro"): Promise<void> => {
    await apiClient.patch(`/admin/users/${userId}/tier`, { tier });
  },
};
