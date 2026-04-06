import { useAuthStore } from "../store/useAuthStore";
import { useHealthMetrics } from "../hooks/useHealthMetrics";

interface ProfileViewProps {
  onEdit: () => void;
}

export default function ProfileViewPage({ onEdit }: ProfileViewProps) {
  const user = useAuthStore((state) => state.user);
  const profile = user?.profile;

  const { age, bmi, bmiInfo, tdee } = useHealthMetrics();

  return (
    <div className="min-h-[calc(100vh-80px)] bg-black text-white font-sans flex flex-col items-center px-4 py-6 gap-8">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[30%] w-[40%] h-[40%] bg-lime-500/5 blur-[120px] rounded-full" />
      </div>

      {/* PROFILE PICTURE */}
      <div className="flex flex-col items-center gap-3 mt-3">
        <div className="relative">
          <div className="w-34 h-34 rounded-full p-0.75 bg-linear-to-tr from-lime-400 to-emerald-500 shadow-[0_0_30px_rgba(163,230,53,0.2)]">
            <div className="w-full h-full bg-zinc-950 rounded-full flex items-center justify-center overflow-hidden">
              {profile?.imageUrl ? (
                <img
                  src={profile.imageUrl}
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg
                  className="w-12 h-12 text-zinc-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              )}
            </div>
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-black tracking-widest uppercase">
            {profile?.firstName} {profile?.lastName}
          </h1>
          <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] mt-1">
            Professional Athlete • ID: {user?.id}
          </p>
        </div>
      </div>

      {/* PHYSICAL PROFILE CARD */}
      <div className="w-full max-w-xl flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 mt-4">
            Physical Profile
          </span>
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-700 text-zinc-400 text-[10px] font-black uppercase tracking-widest rounded-lg hover:border-lime-400 hover:text-lime-400 transition-all active:scale-95 hover: cursor-pointer"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z"
              />
            </svg>
            Edit
          </button>
        </div>
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-4">
          <div className="grid grid-cols-3 divide-x divide-zinc-800">
            <StatBlock
              value={profile?.height ?? "—"}
              unit="cm"
              label="Height"
            />
            <StatBlock
              value={profile?.weight ?? "—"}
              unit="kg"
              label="Weight"
            />
            <StatBlock value={age ?? "—"} unit="years" label="Age" />
          </div>
        </div>
      </div>

      {/* METABOLIC ANALYSIS */}
      <div className="w-full max-w-xl flex flex-col gap-3">
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">
          Metabolic Analysis
        </span>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                Body Mass Index
              </span>
              {bmiInfo && (
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full text-black ${bmiInfo.bg}`}
                >
                  {bmiInfo.label}
                </span>
              )}
            </div>
            <p
              className={`text-4xl font-black ${bmiInfo?.color ?? "text-zinc-400"}`}
            >
              {bmi ? bmi.toFixed(1) : "—"}
            </p>
            <p className="text-[11px] text-zinc-600 italic">
              {bmiInfo?.description}
            </p>
          </div>
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-3">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
              Daily TDEE (Estimated)
            </span>
            <p className="text-4xl font-black text-lime-400">
              {tdee ? tdee.toLocaleString() : "—"}
            </p>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
              Kcal / Day
            </p>
          </div>
        </div>
      </div>

      {/* ACTIVITY LEVEL */}
      <div className="w-full max-w-xl bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 mb-1">
            Activity Level
          </p>
          <p className="text-sm font-black text-white capitalize">
            {profile?.activityLevel?.replace(/_/g, " ") ?? "—"}
          </p>
        </div>
        <div className="flex items-end gap-1">
          {[
            "sedentary",
            "lightly_active",
            "moderately_active",
            "very_active",
          ].map((level, i) => (
            <div
              key={level}
              className={`w-1.5 rounded-full ${isActiveLevel(profile?.activityLevel, level) ? "bg-lime-400" : "bg-zinc-700"}`}
              style={{ height: `${i * 6 + 12}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatBlock({
  value,
  unit,
  label,
}: {
  value: string | number;
  unit: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 px-4">
      <div className="flex items-baseline gap-0.5">
        <span className="text-3xl font-black">{value}</span>
        <span className="text-xs text-zinc-500 font-bold">{unit}</span>
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
        {label}
      </span>
    </div>
  );
}

function isActiveLevel(
  current: string | null | undefined,
  level: string,
): boolean {
  const order = [
    "sedentary",
    "lightly_active",
    "moderately_active",
    "very_active",
  ];
  return (
    order.indexOf(current ?? "") >= order.indexOf(level) &&
    order.indexOf(current ?? "") !== -1
  );
}
