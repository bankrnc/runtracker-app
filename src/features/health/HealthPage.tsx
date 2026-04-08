import { Link } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";
import { useHealthMetrics } from "../../hooks/useHealthMetrics";

const ACTIVITY_ORDER = [
  "sedentary",
  "lightly_active",
  "moderately_active",
  "very_active",
];

export default function HealthPage() {
  const profile = useAuthStore((state) => state.user?.profile);
  const { age, bmi, bmiInfo, bmr, tdee, macros, hrZones, maxHR, isComplete } =
    useHealthMetrics();

  if (!isComplete) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-black text-white flex flex-col items-center justify-center px-6 gap-6 text-center">
        <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-4xl">
          🏃
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black italic uppercase tracking-tight">
            Profile Incomplete
          </h2>
          <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">
            We need your height, weight, birth date, gender, and activity level
            to calculate your health metrics.
          </p>
        </div>
        <Link
          to="/profile"
          className="bg-lime-400 text-black px-8 py-3 rounded-full font-black text-sm hover:bg-white transition-all shadow-[0_0_20px_rgba(163,230,53,0.3)] active:scale-95"
        >
          Complete Your Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-black text-white font-sans pb-20">
      <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-10">
        {/* --- PAGE HEADER --- */}
        <section className="mb-10 lg:mb-12">
          <p className="text-[10px] font-bold tracking-widest uppercase text-lime-400 mb-2">
            Health Analysis
          </p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-2">
            <h2 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter">
              Your Health Metrics
            </h2>
            <p className="text-zinc-500 text-sm lg:text-right">
              Based on your physical profile data.
            </p>
          </div>
          <div className="mt-4 h-px bg-zinc-800" />
        </section>

        {/* --- DESKTOP: 2-COLUMN / MOBILE: SINGLE COLUMN --- */}
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_1.1fr] lg:gap-10">
          {/* === LEFT COLUMN === */}
          <div className="flex flex-col gap-6">
            {/* Physical Snapshot */}
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-4xl">
              <div className="grid grid-cols-3 divide-x divide-zinc-800">
                <MiniStat value={profile!.height!} unit="cm" label="Height" />
                <MiniStat value={profile!.weight!} unit="kg" label="Weight" />
                <MiniStat value={age!} unit="yrs" label="Age" />
              </div>
            </div>

            {/* BMI / BMR / TDEE */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-4xl space-y-2">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  BMI
                </span>
                <p
                  className={`text-2xl font-black ${bmiInfo?.color ?? "text-white"}`}
                >
                  {bmi!.toFixed(1)}
                </p>
                <p
                  className={`text-[10px] font-bold uppercase ${bmiInfo?.color ?? "text-zinc-500"}`}
                >
                  {bmiInfo?.label}
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-4xl space-y-2">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  BMR
                </span>
                <p className="text-2xl font-black text-white">
                  {bmr!.toLocaleString()}
                </p>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter italic">
                  kcal at rest
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-4xl space-y-2">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  TDEE
                </span>
                <p className="text-2xl font-black text-white">
                  {tdee!.toLocaleString()}
                </p>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter italic">
                  kcal / day
                </p>
              </div>
            </div>

            {/* Macros */}
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-4xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Daily Macros
                </span>
                <span className="text-[10px] text-zinc-600 uppercase">
                  Based on TDEE
                </span>
              </div>
              <div className="grid grid-cols-3 divide-x divide-zinc-800">
                <MacroStat
                  value={macros!.protein}
                  label="Protein"
                  color="text-blue-400"
                  pct={25}
                  barColor="bg-blue-400"
                />
                <MacroStat
                  value={macros!.carb}
                  label="Carbs"
                  color="text-yellow-400"
                  pct={50}
                  barColor="bg-yellow-400"
                />
                <MacroStat
                  value={macros!.fat}
                  label="Fat"
                  color="text-orange-400"
                  pct={25}
                  barColor="bg-orange-400"
                />
              </div>
            </div>

            {/* Activity Level */}
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-4xl flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
                  Activity Level
                </p>
                <p className="text-sm font-black text-white capitalize">
                  {profile!.activityLevel!.replace(/_/g, " ")}
                </p>
              </div>
              <div className="flex items-end gap-1">
                {ACTIVITY_ORDER.map((level, i) => {
                  const isActive =
                    ACTIVITY_ORDER.indexOf(profile?.activityLevel ?? "") >=
                      ACTIVITY_ORDER.indexOf(level) &&
                    ACTIVITY_ORDER.indexOf(profile?.activityLevel ?? "") !== -1;
                  return (
                    <div
                      key={level}
                      className={`w-1.5 rounded-full ${isActive ? "bg-lime-400" : "bg-zinc-700"}`}
                      style={{ height: `${i * 6 + 12}px` }}
                    />
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <Link
              to="/dashboard"
              className="block w-full bg-zinc-900 border border-zinc-800 py-5 rounded-2xl font-black uppercase tracking-widest text-center hover:bg-zinc-800 transition-all active:scale-95 shadow-xl"
            >
              Go to Dashboard
            </Link>
          </div>

          {/* === RIGHT COLUMN === */}
          <div className="flex flex-col gap-6 mt-6 lg:mt-0">
            {/* Heart Rate Zones */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-bold uppercase tracking-widest text-xs text-zinc-400">
                  Heart Rate Zones
                </h3>
                <span className="text-[10px] text-zinc-600 uppercase">
                  Max HR: {maxHR} bpm
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {hrZones!.map((z, i) => (
                  <div
                    key={i}
                    className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-1 h-8 ${z.color} rounded-full`} />
                      <div>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase">
                          {z.zone}
                        </p>
                        <p className="font-bold text-sm">{z.label}</p>
                      </div>
                    </div>
                    <p className="text-sm font-mono font-bold text-white">
                      {z.range}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Coach Insight */}
            <div className="bg-lime-400 p-6 rounded-4xl text-black">
              <h4 className="font-black italic uppercase text-lg mb-1">
                Coach Insight
              </h4>
              <p className="text-sm font-medium leading-tight opacity-80">
                To improve your endurance, focus 80% of your runs in{" "}
                <span className="font-bold underline text-black">Zone 2</span>.
                This builds a strong aerobic base without overtraining.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function MacroStat({
  value,
  label,
  color,
  pct,
  barColor,
}: {
  value: number;
  label: string;
  color: string;
  pct: number;
  barColor: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 px-4">
      <div className="flex items-baseline gap-0.5">
        <span className={`text-2xl font-black ${color}`}>{value}</span>
        <span className="text-xs text-zinc-500 font-bold">g</span>
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
        {label}
      </span>
      <div className="w-full bg-zinc-800 rounded-full h-1">
        <div
          className={`${barColor} h-1 rounded-full`}
          style={{ width: `${pct * 2}%` }}
        />
      </div>
      <span className="text-[9px] text-zinc-600">{pct}%</span>
    </div>
  );
}

function MiniStat({
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
        <span className="text-2xl font-black">{value}</span>
        <span className="text-xs text-zinc-500 font-bold">{unit}</span>
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
        {label}
      </span>
    </div>
  );
}
