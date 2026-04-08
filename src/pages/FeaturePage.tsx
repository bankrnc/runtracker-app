import { Link } from "react-router";

// ── Mock UI: AI Coach card ──────────────────────────────────────────────────
function AiCoachMock() {
  const days = [
    { label: "MON", type: "Easy Run",   dist: "5 km",  active: false },
    { label: "WED", type: "Tempo Run",  dist: "8 km",  active: true  },
    { label: "FRI", type: "Long Run",   dist: "12 km", active: false },
    { label: "SUN", type: "Recovery",   dist: "4 km",  active: false },
  ];
  return (
    <div className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4 select-none">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-violet-400">AI Coach</p>
          <p className="text-white font-black text-sm mt-0.5">Week 3 — Base Building</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-violet-400/10 border border-violet-400/20 flex items-center justify-center">
          <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
      </div>
      <div className="space-y-2">
        {days.map((d) => (
          <div
            key={d.label}
            className={`flex items-center justify-between rounded-xl px-4 py-2.5 border ${
              d.active ? "bg-violet-400/10 border-violet-400/30" : "bg-zinc-900 border-zinc-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`text-[9px] font-black uppercase tracking-widest w-7 ${d.active ? "text-violet-400" : "text-zinc-600"}`}>{d.label}</span>
              <span className={`text-xs font-bold ${d.active ? "text-white" : "text-zinc-400"}`}>{d.type}</span>
            </div>
            <span className={`text-[10px] font-black ${d.active ? "text-violet-300" : "text-zinc-600"}`}>{d.dist}</span>
          </div>
        ))}
      </div>
      <div>
        <div className="flex justify-between text-[9px] text-zinc-600 mb-1.5">
          <span>WEEKLY PROGRESS</span><span>3 / 4 sessions</span>
        </div>
        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full w-3/4 bg-violet-400 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ── Mock UI: Session log card ───────────────────────────────────────────────
function SessionLogMock() {
  const kms = [
    { km: 1, pace: "5:42", hr: 142, score: 3 },
    { km: 2, pace: "5:38", hr: 148, score: 3 },
    { km: 3, pace: "5:35", hr: 155, score: 2 },
    { km: 4, pace: "5:29", hr: 160, score: 3 },
  ];
  return (
    <div className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4 select-none">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-lime-400">Session Log</p>
          <p className="text-white font-black text-sm mt-0.5">Tempo Run — 4 km</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-lime-400">9.1</p>
          <p className="text-[9px] text-zinc-600 uppercase tracking-widest">Score</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Avg Pace", value: "5:36" },
          { label: "Avg HR",   value: "151 bpm" },
          { label: "Distance", value: "4.0 km" },
        ].map((s) => (
          <div key={s.label} className="bg-zinc-900 rounded-xl p-2.5 text-center">
            <p className="text-xs font-black text-white">{s.value}</p>
            <p className="text-[8px] text-zinc-600 uppercase tracking-widest mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="space-y-1.5">
        {kms.map((k) => (
          <div key={k.km} className="flex items-center gap-3 px-3 py-2 bg-zinc-900 rounded-xl">
            <span className="text-[9px] font-black text-zinc-600 w-8">KM {k.km}</span>
            <span className="text-[10px] font-bold text-zinc-300 flex-1">{k.pace} /km</span>
            <span className="text-[10px] text-zinc-500">{k.hr} bpm</span>
            <div className="flex gap-0.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < k.score ? "bg-lime-400" : "bg-zinc-800"}`} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Mock UI: Dashboard card ─────────────────────────────────────────────────
function DashboardMock() {
  const bars = [
    { label: "MON", h: 40 },
    { label: "TUE", h: 0  },
    { label: "WED", h: 75 },
    { label: "THU", h: 30 },
    { label: "FRI", h: 90 },
    { label: "SAT", h: 0  },
    { label: "SUN", h: 55 },
  ];
  const zones = [
    { label: "Z1", pct: 15, color: "#60a5fa" },
    { label: "Z2", pct: 35, color: "#a3e635" },
    { label: "Z3", pct: 30, color: "#facc15" },
    { label: "Z4", pct: 15, color: "#fb923c" },
    { label: "Z5", pct: 5,  color: "#f87171" },
  ];
  return (
    <div className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-5 select-none">
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Distance", value: "47.3", unit: "km", color: "text-white" },
          { label: "Avg Score", value: "8.4",  unit: "/10", color: "text-lime-400" },
          { label: "Sessions", value: "5",     unit: "runs", color: "text-white" },
        ].map((s) => (
          <div key={s.label} className="bg-zinc-900 rounded-xl p-3 text-center">
            <p className={`text-base font-black ${s.color}`}>
              {s.value}<span className="text-[10px] text-zinc-600 ml-0.5">{s.unit}</span>
            </p>
            <p className="text-[9px] text-zinc-600 uppercase tracking-widest mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
      <div>
        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-3">Session Score</p>
        <div className="flex items-end gap-1.5 h-16">
          {bars.map((b) => (
            <div key={b.label} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t-md transition-all"
                style={{
                  height: `${b.h || 4}%`,
                  backgroundColor: b.h > 0 ? "#a3e635" : "transparent",
                  border: b.h === 0 ? "1px dashed #27272a" : "none",
                  opacity: b.h > 0 ? 0.85 : 1,
                }}
              />
              <span className="text-[8px] text-zinc-700">{b.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2">HR Zone Breakdown</p>
        <div className="flex h-2 rounded-full overflow-hidden">
          {zones.map((z) => (
            <div key={z.label} style={{ width: `${z.pct}%`, backgroundColor: z.color }} />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
          {zones.map((z) => (
            <div key={z.label} className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: z.color }} />
              <span className="text-[8px] text-zinc-600">{z.label} {z.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────────────────
export default function FeaturePage() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-black text-white font-sans pb-24">

      {/* ===== HERO ===== */}
      <section className="w-full border-b border-zinc-800 px-6 lg:px-16 xl:px-24 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-violet-400/10 border border-violet-400/20 rounded-full px-3 py-1.5 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest text-violet-400">AI-Powered Running Coach</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black italic uppercase tracking-tighter leading-none mb-6">
            Train smarter.<br />
            <span className="text-lime-400">Not harder.</span>
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed max-w-xl mx-auto mb-10">
            StridePilot combines AI-generated training plans with per-session scoring and detailed analytics — so every run has a purpose.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/register"
              className="bg-lime-400 text-black font-black text-sm uppercase tracking-widest px-8 py-3.5 rounded-2xl hover:bg-lime-300 transition-all active:scale-95 shadow-[0_20px_40px_-15px_rgba(163,230,53,0.3)]"
            >
              Get Started — Free
            </Link>
            <Link
              to="/login"
              className="text-zinc-400 font-bold text-sm hover:text-white transition-colors underline underline-offset-4 decoration-zinc-700"
            >
              Already have an account?
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FEATURE: AI COACH ===== */}
      <section className="w-full border-b border-zinc-800 px-6 lg:px-16 xl:px-24 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-2 lg:order-1">
            <AiCoachMock />
          </div>
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 bg-violet-400/10 border border-violet-400/20 rounded-full px-3 py-1.5 mb-5">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-violet-400">Feature 01</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-black italic uppercase tracking-tighter mb-4">
              Your personal<br />AI running coach.
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Describe your goal, fitness level, and schedule. The AI builds a structured multi-week training program around you — not a generic template copied from the internet.
            </p>
            <ul className="space-y-3">
              {[
                "Personalized week-by-week training plan",
                "Adapts to your pace, heart rate, and goals",
                "Generated in seconds — ready to follow today",
              ].map((pt) => (
                <li key={pt} className="flex items-start gap-3 text-sm text-zinc-300">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                  {pt}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ===== FEATURE: SESSION LOG ===== */}
      <section className="w-full border-b border-zinc-800 px-6 lg:px-16 xl:px-24 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-lime-400/10 border border-lime-400/20 rounded-full px-3 py-1.5 mb-5">
              <div className="w-1.5 h-1.5 rounded-full bg-lime-400" />
              <span className="text-[9px] font-black uppercase tracking-widest text-lime-400">Feature 02</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-black italic uppercase tracking-tighter mb-4">
              Track every<br />kilometer. Score it.
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              After each run, log your pace and heart rate per kilometer. StridePilot scores each one against your plan target — so you know exactly how well you executed, not just how far you went.
            </p>
            <ul className="space-y-3">
              {[
                "Per-km pace and heart rate logging",
                "Automatic score against your planned targets",
                "Instant summary with avg pace, HR, and overall score",
              ].map((pt) => (
                <li key={pt} className="flex items-start gap-3 text-sm text-zinc-300">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-lime-400 shrink-0" />
                  {pt}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SessionLogMock />
          </div>
        </div>
      </section>

      {/* ===== FEATURE: DASHBOARD ===== */}
      <section className="w-full border-b border-zinc-800 px-6 lg:px-16 xl:px-24 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-2 lg:order-1">
            <DashboardMock />
          </div>
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 bg-lime-400/10 border border-lime-400/20 rounded-full px-3 py-1.5 mb-5">
              <div className="w-1.5 h-1.5 rounded-full bg-lime-400" />
              <span className="text-[9px] font-black uppercase tracking-widest text-lime-400">Feature 03</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-black italic uppercase tracking-tighter mb-4">
              See your progress.<br />Understand it.
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              The dashboard turns your run data into clear insights — weekly score trends, heart rate zone breakdown, distance totals, and session consistency all in one view.
            </p>
            <ul className="space-y-3">
              {[
                "Score trends and consistency over time",
                "Heart rate zone breakdown across all runs",
                "Filter by program, month, or session type",
              ].map((pt) => (
                <li key={pt} className="flex items-start gap-3 text-sm text-zinc-300">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-lime-400 shrink-0" />
                  {pt}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ===== QUICK FEATURE CHIPS ===== */}
      <section className="w-full border-b border-zinc-800 px-6 lg:px-16 xl:px-24 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-8 text-center">
            Everything you need. Nothing you don't.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                title: "AI Plan Generation",
                desc: "Describe your goal, get a full training program instantly.",
                accent: "text-violet-400",
                bg: "bg-violet-400/5 border-violet-400/10",
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: "Session Scoring",
                desc: "Every km graded on pace and heart rate vs your target.",
                accent: "text-lime-400",
                bg: "bg-lime-400/5 border-lime-400/10",
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
                title: "HR Zone Breakdown",
                desc: "See exactly how hard you are working across every session.",
                accent: "text-orange-400",
                bg: "bg-orange-400/5 border-orange-400/10",
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                title: "Progress Dashboard",
                desc: "Distance, time, score trends — filtered by program or month.",
                accent: "text-lime-400",
                bg: "bg-lime-400/5 border-lime-400/10",
              },
            ].map((f) => (
              <div key={f.title} className={`rounded-2xl border p-5 flex flex-col gap-3 ${f.bg}`}>
                <div className={f.accent}>{f.icon}</div>
                <p className="text-white text-sm font-black">{f.title}</p>
                <p className="text-zinc-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="w-full px-6 lg:px-16 xl:px-24 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <h2 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter mb-3">
              Ready to run<br />with purpose?
            </h2>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-md">
              Join StridePilot and get your first AI-generated training plan in under a minute.
            </p>
          </div>
          <Link
            to="/register"
            className="shrink-0 inline-block bg-lime-400 text-black font-black text-sm uppercase tracking-widest px-10 py-4 rounded-2xl hover:bg-lime-300 transition-all active:scale-95 shadow-[0_20px_40px_-15px_rgba(163,230,53,0.3)]"
          >
            Get Started — Free
          </Link>
        </div>
      </section>

    </div>
  );
}
