import { useState, useEffect } from "react";
import { toast } from "sonner";
import { adminApi, type AdminUser } from "../../api/adminApi";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    adminApi
      .listUsers()
      .then(setUsers)
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  const toggleTier = async (user: AdminUser) => {
    const newTier = user.tier === "free" ? "pro" : "free";
    setUpdating(user.id);
    try {
      await adminApi.updateTier(user.id, newTier);
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, tier: newTier } : u));
      toast.success(`${user.email} → ${newTier}`);
    } catch {
      toast.error("Failed to update tier");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-black text-white font-sans pb-20">
      <main className="max-w-4xl mx-auto px-6 pt-10">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter">User Management</h2>
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Admin</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="border border-zinc-800 rounded-2xl overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 bg-zinc-900 border-b border-zinc-800">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">User</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Role</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Tier</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Action</span>
            </div>

            {users.map((user, i) => (
              <div
                key={user.id}
                className={`grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-5 py-4 ${
                  i !== users.length - 1 ? "border-b border-zinc-800/60" : ""
                }`}
              >
                {/* User info */}
                <div>
                  <p className="text-sm font-bold text-white">
                    {user.profile?.firstName || user.profile?.lastName
                      ? `${user.profile.firstName ?? ""} ${user.profile.lastName ?? ""}`.trim()
                      : "—"}
                  </p>
                  <p className="text-[11px] text-zinc-500">{user.email}</p>
                </div>

                {/* Role badge */}
                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                  user.role === "admin"
                    ? "text-violet-400 bg-violet-400/10 border-violet-400/30"
                    : "text-zinc-500 bg-zinc-800 border-zinc-700"
                }`}>
                  {user.role}
                </span>

                {/* Tier badge */}
                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                  user.tier === "pro"
                    ? "text-amber-400 bg-amber-400/10 border-amber-400/30"
                    : "text-zinc-600 bg-zinc-800/50 border-zinc-700"
                }`}>
                  {user.tier}
                </span>

                {/* Toggle button */}
                <button
                  onClick={() => toggleTier(user)}
                  disabled={updating === user.id || user.role === "admin"}
                  title={user.role === "admin" ? "Admin always has Pro access" : `Switch to ${user.tier === "free" ? "pro" : "free"}`}
                  className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed hover:cursor-pointer ${
                    user.tier === "pro"
                      ? "bg-red-400/10 border border-red-400/30 text-red-400 hover:bg-red-400 hover:text-black"
                      : "bg-lime-400/10 border border-lime-400/30 text-lime-400 hover:bg-lime-400 hover:text-black"
                  }`}
                >
                  {updating === user.id ? (
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 border border-current border-t-transparent rounded-full animate-spin inline-block" />
                      ...
                    </span>
                  ) : user.tier === "pro" ? "Revoke" : "Upgrade"}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
