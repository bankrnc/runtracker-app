import { useState, useEffect } from "react";
import { toast } from "sonner";
import { programApi } from "../../api/programApi";
import { useHealthMetrics } from "../../hooks/useHealthMetrics";
import type { Program } from "../../schemas/program.schema";
import { SESSION_TYPE_LABELS, SESSION_TYPE_BAR } from "../../schemas/program.schema";
import { parseIntervalDistanceKm } from "../../lib/programUtils";

// ─── helpers ─────────────────────────────────────────────────────────────────

function paceToSeconds(pace: string): number {
  const [m, s] = pace.split(":").map(Number);
  return (m || 0) * 60 + (s || 0);
}


function getSessionDate(startDate: string, weekNumber: number, dayNumber: number): Date {
  const [y, m, d] = startDate.split("T")[0].split("-").map(Number);
  const base = new Date(y, m - 1, d);
  base.setDate(base.getDate() + (weekNumber - 1) * 7 + (dayNumber - 1));
  return base;
}

function getHrZone(hr: number, maxHR: number): number {
  const pct = hr / maxHR;
  if (pct >= 0.9) return 5;
  if (pct >= 0.8) return 4;
  if (pct >= 0.7) return 3;
  if (pct >= 0.6) return 2;
  return 1;
}

function toYM(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function formatYM(ym: string): string {
  const [y, m] = ym.split("-");
  return new Date(Number(y), Number(m) - 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
}

// ─── constants ───────────────────────────────────────────────────────────────

const ZONE_META = [
  { zone: 1, label: "Zone 1", hex: "#60a5fa", tw: "bg-blue-400",   text: "text-blue-400"   },
  { zone: 2, label: "Zone 2", hex: "#a3e635", tw: "bg-lime-400",   text: "text-lime-400"   },
  { zone: 3, label: "Zone 3", hex: "#facc15", tw: "bg-yellow-400", text: "text-yellow-400" },
  { zone: 4, label: "Zone 4", hex: "#fb923c", tw: "bg-orange-400", text: "text-orange-400" },
  { zone: 5, label: "Zone 5", hex: "#f87171", tw: "bg-red-400",    text: "text-red-400"    },
];

const SCORE_RANGES = [
  { label: "Excellent", min: 8,   max: 10,  hex: "#a3e635", tw: "bg-lime-400",   text: "text-lime-400"   },
  { label: "Good",      min: 6,   max: 7.9, hex: "#818cf8", tw: "bg-indigo-400", text: "text-indigo-400" },
  { label: "Fair",      min: 4,   max: 5.9, hex: "#fb923c", tw: "bg-orange-400", text: "text-orange-400" },
  { label: "Low",       min: 0,   max: 3.9, hex: "#f87171", tw: "bg-red-400",    text: "text-red-400"    },
];

const SESSION_TYPE_ORDER = ["easy", "long_run", "tempo", "interval", "recovery"] as const;

// ─── DonutChart ──────────────────────────────────────────────────────────────

function DonutChart({
  data,
  centerValue,
  centerSub,
}: {
  data: { label: string; value: number; hex: string; tw: string; text: string }[];
  centerValue: string;
  centerSub: string;
}) {
  const r = 50;
  const cx = 70;
  const cy = 70;
  const circ = 2 * Math.PI * r;
  const total = data.reduce((s, d) => s + d.value, 0);

  // pre-compute arcs
  let cum = 0;
  const arcs = data.map((d) => {
    const len = total > 0 ? (d.value / total) * circ : 0;
    const arc = { ...d, len, dashoffset: -cum };
    cum += len;
    return arc;
  });

  return (
    <div className="flex flex-col sm:flex-row items-center gap-5">
      {/* SVG donut */}
      <svg viewBox="0 0 140 140" className="w-36 h-36 shrink-0">
        <g transform={`rotate(-90 ${cx} ${cy})`}>
          {total === 0 ? (
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#27272a" strokeWidth={20} />
          ) : (
            arcs.filter((a) => a.len > 0).map((arc, i) => (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={arc.hex}
                strokeWidth={20}
                strokeDasharray={`${arc.len} ${circ}`}
                strokeDashoffset={arc.dashoffset}
                strokeLinecap="butt"
              />
            ))
          )}
        </g>
        <text x={cx} y={cy - 4} textAnchor="middle" fill="white" fontSize="20" fontWeight="900" fontFamily="system-ui">
          {centerValue}
        </text>
        <text x={cx} y={cy + 13} textAnchor="middle" fill="#52525b" fontSize="9" fontWeight="700" fontFamily="system-ui">
          {centerSub}
        </text>
      </svg>

      {/* Legend */}
      <div className="flex flex-col gap-2.5 flex-1 w-full">
        {data.map((d) => (
          <div key={d.label} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full shrink-0 ${d.tw}`} />
              <span className="text-xs text-zinc-400">{d.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-black ${d.text}`}>
                {total > 0 ? `${Math.round((d.value / total) * 100)}%` : "—"}
              </span>
              <span className="text-[10px] text-zinc-600">({d.value})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SubTabs ─────────────────────────────────────────────────────────────────

function SubTabs({
  value,
  onChange,
}: {
  value: "km" | "min" | "pct";
  onChange: (v: "km" | "min" | "pct") => void;
}) {
  return (
    <div className="flex gap-1">
      {(["km", "min", "pct"] as const).map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all hover:cursor-pointer ${
            value === tab ? "bg-zinc-700 text-white" : "text-zinc-600 hover:text-zinc-400"
          }`}
        >
          {tab === "km" ? "Dist" : tab === "min" ? "Time" : "%"}
        </button>
      ))}
    </div>
  );
}

// ─── main component ──────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"monthly" | "all">("monthly");
  const [selectedMonth, setSelectedMonth] = useState(toYM(new Date()));
  const [selectedProgramId, setSelectedProgramId] = useState<number | "all">("all");
  const [hrSubTab, setHrSubTab] = useState<"km" | "min" | "pct">("km");
  const [typeSubTab, setTypeSubTab] = useState<"km" | "min" | "pct">("km");

  const { maxHR } = useHealthMetrics();

  useEffect(() => {
    programApi
      .getAll()
      .then(setPrograms)
      .catch(() => toast.error("Failed to load programs"))
      .finally(() => setLoading(false));
  }, []);

  // ─── flatten sessions with metadata ────────────────────────────────────────

  const allWithMeta = programs.flatMap((prog) =>
    prog.weeks.flatMap((week) =>
      week.sessions
        .filter((s) => s.type !== "rest")
        .map((session) => ({
          session,
          programId: prog.id,
          ym: toYM(getSessionDate(prog.startDate, week.weekNumber, session.dayNumber)),
        }))
    )
  );

  const completedWithMeta = allWithMeta.filter((x) => x.session.kmLogs.length > 0);

  // available months
  const availableMonths = [
    ...new Set(completedWithMeta.map((x) => x.ym)),
  ].sort().reverse();

  const effectiveMonth =
    availableMonths.includes(selectedMonth)
      ? selectedMonth
      : availableMonths[0] ?? toYM(new Date());

  // apply filters
  const filtered = completedWithMeta.filter((x) => {
    const monthOk = viewMode === "all" || x.ym === effectiveMonth;
    const programOk = selectedProgramId === "all" || x.programId === selectedProgramId;
    return monthOk && programOk;
  });

  const sessions = filtered.map((x) => x.session);

  // ─── summary stats ──────────────────────────────────────────────────────────

  // Each log gets its real km weight:
  // - non-interval: 1 km per log
  // - interval: parsed from description (e.g. 400m → 0.4 km), null if unrecognised → excluded
  const enrichedLogs = sessions.flatMap((s) => {
    const distPerLog: number | null = s.type === "interval"
      ? parseIntervalDistanceKm(s.description)
      : 1;
    return s.kmLogs.map((log) => ({ log, distanceKm: distPerLog, sessionType: s.type }));
  });

  const totalKm = Math.round(
    enrichedLogs.reduce((sum, x) => x.distanceKm != null ? sum + x.distanceKm : sum, 0) * 10
  ) / 10;

  const totalSec = enrichedLogs
    .filter((x) => x.log.actualPace && x.distanceKm != null)
    .reduce((sum, x) => sum + paceToSeconds(x.log.actualPace!) * x.distanceKm!, 0);
  const totalHours = Math.floor(totalSec / 3600);
  const totalMins = Math.floor((totalSec % 3600) / 60);
  const avgMinPerSession =
    sessions.length > 0 && totalSec > 0
      ? Math.round(totalSec / 60 / sessions.length)
      : 0;

  const scoredSessions = sessions.filter((s) => s.score != null);
  const avgScore =
    scoredSessions.length > 0
      ? (scoredSessions.reduce((sum, s) => sum + s.score!, 0) / scoredSessions.length).toFixed(1)
      : null;

  // ─── HR zones ──────────────────────────────────────────────────────────────

  const hrZoneStats = ZONE_META.map(({ zone }) => {
    const zLogs = enrichedLogs.filter(
      (x) => x.log.actualHr && maxHR && getHrZone(x.log.actualHr, maxHR) === zone
    );
    const km = zLogs.reduce((sum, x) => x.distanceKm != null ? sum + x.distanceKm : sum, 0);
    const sec = zLogs
      .filter((x) => x.log.actualPace && x.distanceKm != null)
      .reduce((sum, x) => sum + paceToSeconds(x.log.actualPace!) * x.distanceKm!, 0);
    return { zone, km: Math.round(km * 10) / 10, min: Math.round(sec / 60) };
  });

  const totalHrKm = hrZoneStats.reduce((s, z) => s + z.km, 0);
  const totalHrMin = hrZoneStats.reduce((s, z) => s + z.min, 0);

  const hrZoneRanges = maxHR
    ? [
        `< ${Math.round(maxHR * 0.6)} bpm`,
        `${Math.round(maxHR * 0.6)}–${Math.round(maxHR * 0.7) - 1}`,
        `${Math.round(maxHR * 0.7)}–${Math.round(maxHR * 0.8) - 1}`,
        `${Math.round(maxHR * 0.8)}–${Math.round(maxHR * 0.9) - 1}`,
        `> ${Math.round(maxHR * 0.9)} bpm`,
      ]
    : ZONE_META.map(() => "—");

  // ─── score distribution ────────────────────────────────────────────────────

  const scoreDist = SCORE_RANGES.map((r) => ({
    ...r,
    value: scoredSessions.filter((s) => s.score! >= r.min && s.score! <= r.max).length,
  }));

  // ─── session type ──────────────────────────────────────────────────────────

  const typeStats = SESSION_TYPE_ORDER.reduce<Record<string, { km: number; min: number }>>((acc, type) => {
    const tLogs = enrichedLogs.filter((x) => x.sessionType === type);
    const km = tLogs.reduce((sum, x) => x.distanceKm != null ? sum + x.distanceKm : sum, 0);
    const sec = tLogs
      .filter((x) => x.log.actualPace && x.distanceKm != null)
      .reduce((sum, x) => sum + paceToSeconds(x.log.actualPace!) * x.distanceKm!, 0);
    acc[type] = { km: Math.round(km * 10) / 10, min: Math.round(sec / 60) };
    return acc;
  }, {});

  const totalTypeKm = SESSION_TYPE_ORDER.reduce((s, t) => s + typeStats[t].km, 0);
  const totalTypeMin = SESSION_TYPE_ORDER.reduce((s, t) => s + typeStats[t].min, 0);

  // ─── render ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const hasData = sessions.length > 0;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-black text-white font-sans pb-20">
      <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-10">

        {/* Header */}
        <section className="mb-8">
          <p className="text-[10px] font-bold tracking-widest uppercase text-lime-400 mb-2">Overview</p>
          <h2 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter">Dashboard</h2>
          <div className="mt-4 h-px bg-zinc-800" />
        </section>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Monthly / All */}
          {(["monthly", "all"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all hover:cursor-pointer ${
                viewMode === mode
                  ? "bg-lime-400 text-black"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-600"
              }`}
            >
              {mode === "monthly" ? "Monthly" : "All Time"}
            </button>
          ))}

          {/* Month picker */}
          {viewMode === "monthly" && (
            <select
              value={effectiveMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm font-bold text-white focus:outline-none focus:border-lime-400 transition-colors hover:cursor-pointer"
            >
              {availableMonths.length > 0 ? (
                availableMonths.map((ym) => (
                  <option key={ym} value={ym}>{formatYM(ym)}</option>
                ))
              ) : (
                <option value={toYM(new Date())}>{formatYM(toYM(new Date()))}</option>
              )}
            </select>
          )}

          {/* Program filter */}
          <select
            value={selectedProgramId}
            onChange={(e) =>
              setSelectedProgramId(e.target.value === "all" ? "all" : Number(e.target.value))
            }
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm font-bold text-white focus:outline-none focus:border-lime-400 transition-colors hover:cursor-pointer"
          >
            <option value="all">All Programs</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>

        {/* Empty state */}
        {!hasData ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <p className="text-zinc-600 text-sm">
              {viewMode === "monthly"
                ? "No logged sessions for this filter."
                : "No sessions logged yet."}
            </p>
          </div>
        ) : (
          <>
            {/* ── Stats row ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Distance</p>
                <p className="text-2xl font-black">
                  {totalKm}<span className="text-sm font-bold text-zinc-400 ml-1">km</span>
                </p>
                <p className="text-[10px] text-zinc-600 mt-1">{sessions.length} sessions</p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Total Time</p>
                <p className="text-2xl font-black">
                  {totalHours > 0 ? (
                    <>{totalHours}<span className="text-sm font-bold text-zinc-400">h </span>{totalMins}<span className="text-sm font-bold text-zinc-400">m</span></>
                  ) : (
                    <>{totalMins}<span className="text-sm font-bold text-zinc-400">m</span></>
                  )}
                </p>
                <p className="text-[10px] text-zinc-600 mt-1">avg {avgMinPerSession} min/session</p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Avg Score</p>
                <p className="text-2xl font-black text-lime-400">
                  {avgScore ?? "—"}
                  {avgScore && <span className="text-sm font-bold text-zinc-400">/10</span>}
                </p>
                <p className="text-[10px] text-zinc-600 mt-1">{scoredSessions.length} scored sessions</p>
              </div>
            </div>

            {/* ── 2-column grid ─────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

              {/* Left: HR Zone */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-black uppercase tracking-widest text-zinc-300">HR Zone Breakdown</p>
                  <SubTabs value={hrSubTab} onChange={setHrSubTab} />
                </div>

                {!maxHR ? (
                  <p className="text-xs text-zinc-600 py-8 text-center flex-1 flex items-center justify-center">
                    Add date of birth to your profile to see HR zones.
                  </p>
                ) : totalHrKm === 0 ? (
                  <p className="text-xs text-zinc-600 py-8 text-center flex-1 flex items-center justify-center">
                    No HR data logged for this period.
                  </p>
                ) : (
                  <div className="space-y-3 flex-1">
                    {ZONE_META.map(({ zone, label, tw, text }, i) => {
                      const stat = hrZoneStats[i];
                      const val = hrSubTab === "km" ? stat.km : hrSubTab === "min" ? stat.min : Math.round((stat.km / (totalHrKm || 1)) * 100);
                      const maxVal = hrSubTab === "km" ? totalHrKm : hrSubTab === "min" ? totalHrMin : 100;
                      const pct = maxVal > 0 ? (val / maxVal) * 100 : 0;
                      const unit = hrSubTab === "km" ? "km" : hrSubTab === "min" ? "m" : "%";
                      return (
                        <div key={zone} className="flex items-center gap-3">
                          <div className="w-20 shrink-0">
                            <p className={`text-xs font-black ${text}`}>{label}</p>
                            <p className="text-[9px] text-zinc-600">{hrZoneRanges[i]}</p>
                          </div>
                          <div className="flex-1 bg-zinc-800 rounded-full h-1.5">
                            <div className={`${tw} h-1.5 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs font-black text-zinc-300 w-12 text-right shrink-0">
                            {val > 0 ? `${val}${unit}` : "—"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {maxHR && (
                  <p className="text-[10px] text-zinc-700 mt-4">
                    Based on Max HR {maxHR} bpm
                  </p>
                )}
              </div>

              {/* Right: Score Distribution */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <p className="text-xs font-black uppercase tracking-widest text-zinc-300 mb-5">Score Distribution</p>
                <DonutChart
                  data={scoreDist}
                  centerValue={avgScore ?? "—"}
                  centerSub="avg /10"
                />
                <div className="mt-5 h-px bg-zinc-800" />
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {scoreDist.map((r) => (
                    <div key={r.label} className="flex flex-col">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${r.tw}`} />
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{r.label}</span>
                      </div>
                      <span className={`text-xl font-black ${r.text}`}>{r.value}</span>
                      <span className="text-[9px] text-zinc-600">sessions · {r.min}–{r.max}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Session Type ───────────────────────────────────────────── */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-black uppercase tracking-widest text-zinc-300">Session Type</p>
                <SubTabs value={typeSubTab} onChange={setTypeSubTab} />
              </div>
              <div className="space-y-3">
                {SESSION_TYPE_ORDER.filter((type) => typeStats[type].km > 0).map((type) => {
                  const stat = typeStats[type];
                  const val = typeSubTab === "km" ? stat.km : typeSubTab === "min" ? stat.min : Math.round((stat.km / (totalTypeKm || 1)) * 100);
                  const maxVal = typeSubTab === "km" ? totalTypeKm : typeSubTab === "min" ? totalTypeMin : 100;
                  const pct = maxVal > 0 ? (val / maxVal) * 100 : 0;
                  const unit = typeSubTab === "km" ? "km" : typeSubTab === "min" ? "m" : "%";
                  return (
                    <div key={type} className="flex items-center gap-3">
                      <div className="flex items-center gap-2 w-24 shrink-0">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${SESSION_TYPE_BAR[type]}`} />
                        <span className="text-[11px] font-bold text-zinc-400">{SESSION_TYPE_LABELS[type]}</span>
                      </div>
                      <div className="flex-1 bg-zinc-800 rounded-full h-1.5">
                        <div className={`${SESSION_TYPE_BAR[type]} h-1.5 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-black text-zinc-300 w-14 text-right shrink-0">
                        {val}{unit}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
