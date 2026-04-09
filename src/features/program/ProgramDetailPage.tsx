import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { toast } from "sonner";
import { programApi } from "../../api/programApi";
import {
  type Program,
  type Session,
  type Segment,
  type KmLog,
  SESSION_TYPE_LABELS,
  SESSION_TYPE_COLORS,
  SESSION_TYPE_BAR,
} from "../../schemas/program.schema";
import { parseIntervalDistanceKm } from "../../lib/programUtils";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function ProgramDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [activeWeek, setActiveWeek] = useState(0);
  const [celebrationScore, setCelebrationScore] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    programApi
      .getById(Number(id))
      .then((p) => { setProgram(p); setActiveWeek(0); })
      .catch(() => toast.error("Failed to load program"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleLogged = (sessionId: number, kmLogs: KmLog[], score: number) => {
    setProgram((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        weeks: prev.weeks.map((w) => ({
          ...w,
          sessions: w.sessions.map((s) =>
            s.id === sessionId ? { ...s, kmLogs, score } : s,
          ),
        })),
      };
    });
    setSelectedSession(null);
    setCelebrationScore(score);
  };

  if (loading)
    return (
      <div className="min-h-[calc(100vh-80px)] bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!program)
    return (
      <div className="min-h-[calc(100vh-80px)] bg-black text-white flex flex-col items-center justify-center gap-4">
        <p className="text-zinc-500">Program not found.</p>
        <Link to="/program" className="text-lime-400 text-sm font-bold hover:underline">← Back</Link>
      </div>
    );

  const allSessions = program.weeks.flatMap((w) => w.sessions);
  const trainingSessions = allSessions.filter((s) => s.type !== "rest");
  const completed = trainingSessions.filter((s) => s.kmLogs.length > 0).length;
  const pct = trainingSessions.length > 0
    ? Math.round((completed / trainingSessions.length) * 100)
    : 0;

  // Consecutive low-score detection
  const sortedCompleted = program.weeks
    .flatMap((w, wi) => w.sessions.map((s) => ({ ...s, weekIdx: wi })))
    .filter((s) => s.type !== "rest" && s.kmLogs.length > 0)
    .sort((a, b) => a.weekIdx - b.weekIdx || a.dayNumber - b.dayNumber);
  const last3 = sortedCompleted.slice(-3);
  const showRegenHint = last3.length === 3 && last3.every((s) => (s.score ?? 0) < 5);

  const currentWeek = program.weeks[activeWeek];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-black text-white font-sans pb-20">
      <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-10">
        {/* Header */}
        <section className="mb-10">
          <Link
            to="/program"
            className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-full text-sm font-black uppercase tracking-widest text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Programs
          </Link>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <h2 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter">
                {program.title}
              </h2>
            </div>
            <div className="lg:text-right shrink-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
                Overall Progress
              </p>
              <p className="text-4xl font-black text-lime-400">{pct}%</p>
              <p className="text-[10px] text-zinc-600">{completed} / {trainingSessions.length} sessions</p>
            </div>
          </div>
          <div className="mt-4 h-px bg-zinc-800" />
        </section>

        {/* AI Suggestion Banner */}
        {program.suggestion && (
          <div className="mb-6 bg-violet-500/8 border border-violet-500/20 rounded-2xl p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-violet-400 mb-1.5">
              Coach Note
            </p>
            <p className="text-sm text-zinc-300 leading-relaxed">{program.suggestion}</p>
          </div>
        )}

        {/* Consecutive Low Score Warning */}
        {showRegenHint && (
          <div className="mb-6 bg-amber-500/8 border border-amber-500/25 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <span className="text-amber-400 text-base shrink-0 mt-0.5">⚠</span>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-1.5">
                  Training Load Warning
                </p>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  Your last 3 sessions all scored below 5/10 — this may signal the program is too intense for your current base fitness.
                </p>
                <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                  Consider generating a new program with your most recent performance stats and a slightly more modest goal. Training beyond your base risks overuse injury.
                </p>
                <Link
                  to="/program"
                  className="inline-flex items-center gap-1.5 mt-3 text-[11px] font-black uppercase tracking-widest text-amber-400 hover:text-white transition-colors"
                >
                  Generate New Program
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Week Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {program.weeks.map((w, i) => {
            const wSessions = w.sessions.filter((s) => s.type !== "rest");
            const wDone = wSessions.filter((s) => s.kmLogs.length > 0).length;
            const allDone = wSessions.length > 0 && wDone === wSessions.length;
            return (
              <button
                key={w.id}
                onClick={() => setActiveWeek(i)}
                className={`shrink-0 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all hover:cursor-pointer ${
                  activeWeek === i
                    ? "bg-zinc-800 border border-violet-500/50 text-violet-300"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                }`}
              >
                Week {w.weekNumber}{allDone && " ✓"}
              </button>
            );
          })}
        </div>

        {/* Sessions Grid */}
        {currentWeek && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentWeek.sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onLog={() => setSelectedSession(session)}
              />
            ))}
          </div>
        )}
      </main>

      {selectedSession && (
        <LogModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onLogged={handleLogged}
        />
      )}

      {celebrationScore !== null && (
        <ScoreModal score={celebrationScore} onClose={() => setCelebrationScore(null)} />
      )}
    </div>
  );
}

function SessionCard({ session, onLog }: { session: Session; onLog: () => void }) {
  const isRest = session.type === "rest";
  const isDone = session.kmLogs.length > 0;

  const logsWithPace = session.kmLogs.filter((l) => l.actualPace);
  const avgPace = (() => {
    if (logsWithPace.length === 0) return null;
    const totalSec = logsWithPace.reduce((sum, l) => {
      const [m, s] = l.actualPace!.split(":").map(Number);
      return sum + (m || 0) * 60 + (s || 0);
    }, 0);
    const avg = Math.round(totalSec / logsWithPace.length);
    return `${Math.floor(avg / 60)}:${String(avg % 60).padStart(2, "0")}`;
  })();

  const logsWithHr = session.kmLogs.filter((l) => l.actualHr);
  const avgHr =
    logsWithHr.length > 0
      ? Math.round(logsWithHr.reduce((sum, l) => sum + l.actualHr!, 0) / logsWithHr.length)
      : null;

  if (isRest) {
    return (
      <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-3xl p-5 flex flex-col gap-3">
        <span className="text-[10px] font-bold text-zinc-700 uppercase">
          Day {session.dayNumber} · {DAY_LABELS[session.dayNumber - 1]}
        </span>
        <div className="flex flex-col items-center justify-center py-4 gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-800/60 border border-zinc-700/50 flex items-center justify-center">
            <svg className="w-5 h-5 text-zinc-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-black text-zinc-500 uppercase tracking-widest">Rest Day</p>
            <p className="text-[10px] text-zinc-700 mt-1">Recovery is training too</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-zinc-900/80 border rounded-3xl p-5 flex flex-col gap-3 transition-colors ${
      isDone ? "border-violet-500/30 bg-violet-500/5" : "border-zinc-800 hover:border-zinc-700"
    }`}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-zinc-600 uppercase">
          Day {session.dayNumber} · {DAY_LABELS[session.dayNumber - 1]}
        </span>
      </div>

      <span className={`self-start text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${SESSION_TYPE_COLORS[session.type]}`}>
        {SESSION_TYPE_LABELS[session.type]}
      </span>

      {/* Segments plan */}
      {!isRest && session.type !== "interval" && session.segments.length > 0 && (
        <div className="space-y-1.5">
          {session.segments.map((seg, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-0.5 h-4 rounded-full shrink-0 ${SESSION_TYPE_BAR[session.type]}`} />
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-500">
                  km {seg.kmStart}–{seg.kmEnd}
                </span>
                <span className="text-xs font-bold text-zinc-300">
                  {seg.paceMin && seg.paceMax ? `${seg.paceMin}–${seg.paceMax}/km` : seg.paceMax ? `≤${seg.paceMax}/km` : ""}
                  {seg.hrMax ? ` · <${seg.hrMax}bpm` : ""}
                </span>
              </div>
            </div>
          ))}
          {session.plannedDistance && (
            <p className="text-[10px] text-zinc-600 mt-1">
              Total: {session.plannedDistance} km
            </p>
          )}
        </div>
      )}

      {/* Interval: show set count + distance per set + pace target */}
      {!isRest && session.type === "interval" && (
        <div className="space-y-1.5">
          {session.plannedDistance && (() => {
            const distMatch = session.description?.match(/\d+[×x](\d+(?:\.\d+)?(?:m|km))/i);
            const distPerSet = distMatch ? distMatch[1] : null;
            return (
              <div className="flex items-center gap-2">
                <div className={`w-0.5 h-4 rounded-full shrink-0 ${SESSION_TYPE_BAR[session.type]}`} />
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-500">
                    {session.plannedDistance} sets{distPerSet ? ` × ${distPerSet}` : ""}
                  </span>
                  {session.segments[0] && (
                    <span className="text-xs font-bold text-zinc-300">
                      {session.segments[0].paceMin && session.segments[0].paceMax
                        ? `${session.segments[0].paceMin}–${session.segments[0].paceMax}/km`
                        : session.segments[0].paceMax
                          ? `≤${session.segments[0].paceMax}/km`
                          : ""}
                      {session.segments[0].hrMax ? ` · <${session.segments[0].hrMax}bpm` : ""}
                    </span>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {session.description && session.type !== "interval" && (
        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">{session.description}</p>
      )}

      {/* Interval: highlight rest time from description */}
      {session.type === "interval" && session.description && (() => {
        const restMatch = session.description.match(/(\d+[\w:]*\s*(?:s|sec|min|mins|minutes|seconds|:\d+)?\s*(?:rest|recovery)[^,.]*)/i);
        return restMatch ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 self-start">
            <svg className="w-3 h-3 text-zinc-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[10px] font-bold text-zinc-400">{restMatch[1].trim()}</span>
          </div>
        ) : (
          <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">{session.description}</p>
        );
      })()}

      {/* Log summary */}
      {isDone && (
        <div className="bg-violet-500/8 border border-violet-500/20 rounded-xl p-3">
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-3xl font-black text-violet-300">{session.score ?? "—"}</span>
            <span className="text-sm font-bold text-violet-400/60">/10</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-0.5">Dist</p>
              <p className="text-xs font-black text-zinc-300">
                {session.type === "interval"
                  ? (() => {
                      const distPerSet = parseIntervalDistanceKm(session.description);
                      if (distPerSet == null) return `${session.kmLogs.length} sets`;
                      const total = Math.round(distPerSet * session.kmLogs.length * 10) / 10;
                      return `${total} km`;
                    })()
                  : `${session.kmLogs.length} km`}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-0.5">Avg Pace</p>
              <p className="text-xs font-black text-zinc-300">{avgPace ?? "—"}</p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-0.5">Avg HR</p>
              <p className="text-xs font-black text-zinc-300">{avgHr ? `${avgHr} bpm` : "—"}</p>
            </div>
          </div>
        </div>
      )}

      {!isRest && (
        <button
          onClick={onLog}
          className={`mt-auto w-full py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 hover:cursor-pointer ${
            isDone
              ? "bg-zinc-800/60 border border-zinc-700 text-zinc-500 hover:border-violet-500/30 hover:text-violet-400"
              : "bg-zinc-800 border border-violet-500/40 text-violet-300 hover:bg-violet-900/40 hover:border-violet-400/60"
          }`}
        >
          {isDone ? "Edit Log" : "Log Run"}
        </button>
      )}
    </div>
  );
}

function LogModal({
  session,
  onClose,
  onLogged,
}: {
  session: Session;
  onClose: () => void;
  onLogged: (sessionId: number, kmLogs: KmLog[], score: number) => void;
}) {
  const isInterval = session.type === "interval";
  // Intervals: rows = plannedDistance (number of sets); others: rows = planned km
  const totalRows = isInterval
    ? Math.ceil(session.plannedDistance ?? (session.segments.length || 4))
    : session.plannedDistance ? Math.ceil(session.plannedDistance) : 5;

  // init rows: pre-fill from existing logs
  const initRows = Array.from({ length: totalRows }, (_, i) => {
    const existing = session.kmLogs.find((l) => l.kmNumber === i + 1);
    return {
      kmNumber: i + 1,
      actualPace: existing?.actualPace ?? "",
      actualHr: existing?.actualHr ? String(existing.actualHr) : "",
    };
  });

  const [rows, setRows] = useState(initRows);
  const [submitting, setSubmitting] = useState(false);

  const updateRow = (index: number, field: "actualPace" | "actualHr", value: string) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  };

  // find the segment for a given km to show expected target
  const getSegment = (km: number): Segment | null =>
    session.segments.find((s) => km >= s.kmStart && km <= s.kmEnd) ?? null;

  const paceRegex = /^\d{1,2}:[0-5]\d$/;

  const handleSubmit = async () => {
    const filled = rows.filter((r) => r.actualPace || r.actualHr);
    if (filled.length === 0) {
      toast.error("Please fill in at least 1 km");
      return;
    }
    const badPace = filled.filter((r) => r.actualPace && !paceRegex.test(r.actualPace));
    if (badPace.length > 0) {
      toast.error(`Invalid pace at km ${badPace.map((r) => r.kmNumber).join(", ")} — use M:SS e.g. 5:30`);
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        kmLogs: rows
          .filter((r) => r.actualPace || r.actualHr)
          .map((r) => ({
            kmNumber: r.kmNumber,
            actualPace: r.actualPace || undefined,
            actualHr: r.actualHr ? Number(r.actualHr) : undefined,
          })),
      };
      const result = await programApi.logKm(session.id, payload);
      toast.success(`Logged! Score: ${result.score}/10`);
      onLogged(session.id, result.kmLogs, result.score);
    } catch {
      toast.error("Failed to save. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-zinc-800/80 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${SESSION_TYPE_COLORS[session.type]}`}>
                {SESSION_TYPE_LABELS[session.type]}
              </span>
              <span className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold">Day {session.dayNumber}</span>
            </div>
            <h3 className="font-black text-lg text-white tracking-tight">
              {isInterval ? `${totalRows} Intervals` : `${totalRows} km Run`}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-all hover:cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-[40px_1fr_1fr] gap-3 px-5 py-2.5 shrink-0">
          <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">
            {isInterval ? "Set" : "Km"}
          </span>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-lime-400 shrink-0" />
            <span className="text-[9px] font-bold text-lime-500 uppercase tracking-widest">Pace /km</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
            <span className="text-[9px] font-bold text-violet-400 uppercase tracking-widest">Heart Rate</span>
          </div>
        </div>

        {/* Rows */}
        <div className="overflow-y-auto px-5 pb-4 flex flex-col gap-1.5 flex-1">
          {rows.map((row, i) => {
            const seg = getSegment(row.kmNumber);
            const isFilled = !!(row.actualPace || row.actualHr);
            return (
              <div
                key={row.kmNumber}
                className={`grid grid-cols-[40px_1fr_1fr] gap-3 items-center px-3 py-2.5 rounded-xl border transition-colors ${
                  isFilled
                    ? "bg-zinc-800/50 border-zinc-700/60"
                    : "bg-zinc-900/40 border-zinc-800/40"
                }`}
              >
                {/* Set / Km badge */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black transition-colors ${
                  isFilled ? "bg-lime-400 text-black" : "bg-zinc-800 text-zinc-500"
                }`}>
                  {row.kmNumber}
                </div>

                {/* Pace column */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-zinc-400 leading-none">
                    {seg?.paceMin && seg?.paceMax
                      ? `${seg.paceMin}–${seg.paceMax}/km`
                      : seg?.paceMax
                        ? `≤${seg.paceMax}/km`
                        : <span className="text-zinc-700">—</span>}
                  </span>
                  <input
                    value={row.actualPace}
                    onChange={(e) => updateRow(i, "actualPace", e.target.value)}
                    placeholder="5:30"
                    className="bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs font-bold text-white placeholder:text-zinc-600 focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400/20 transition-all text-center"
                  />
                </div>

                {/* HR column */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-zinc-400 leading-none">
                    {seg?.hrMax ? `< ${seg.hrMax} bpm` : <span className="text-zinc-700">—</span>}
                  </span>
                  <input
                    type="number"
                    value={row.actualHr}
                    onChange={(e) => updateRow(i, "actualHr", e.target.value)}
                    placeholder="145"
                    className="bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs font-bold text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/20 transition-all text-center"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Save button */}
        <div className="px-5 pb-5 pt-3 border-t border-zinc-800/80 shrink-0">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-lime-400 text-black py-3 rounded-xl font-black text-xs hover:bg-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer uppercase tracking-widest"
          >
            {submitting ? "Saving..." : "Save & Calculate Score"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ScoreModal({ score, onClose }: { score: number; onClose: () => void }) {
  const meta =
    score >= 8 ? { label: "Excellent!", msg: "Outstanding performance", color: "#a3e635", text: "text-lime-400" } :
    score >= 6 ? { label: "Good Run!",  msg: "Solid effort today",      color: "#a78bfa", text: "text-violet-300" } :
    score >= 4 ? { label: "Keep Going", msg: "Room to push harder",     color: "#fb923c", text: "text-orange-400" } :
                 { label: "You'll Get There", msg: "Every run counts",  color: "#f87171", text: "text-red-400"    };

  // 30 particles in 2 rings
  const particles = Array.from({ length: 30 }, (_, i) => {
    const ring = i < 18 ? 0 : 1;
    const count = ring === 0 ? 18 : 12;
    const idx = ring === 0 ? i : i - 18;
    const angle = (idx / count) * 360 + (ring * 15);
    const dist = ring === 0 ? 110 : 170;
    const rad = (angle * Math.PI) / 180;
    const palette = ["#a3e635", "#a78bfa", "#fb923c", "#f472b6", "#60a5fa", "#facc15", "#34d399"];
    return {
      id: i,
      x: Math.cos(rad) * dist,
      y: Math.sin(rad) * dist,
      size: 4 + (i % 4),
      color: palette[i % palette.length],
      delay: i * 35,
      dur: 900 + (i % 5) * 120,
    };
  });

  return (
    <>
      <style>{`
        @keyframes sp-burst {
          0%   { transform: translate(0,0) scale(0); opacity: 1; }
          65%  { opacity: 0.9; }
          100% { transform: translate(var(--sp-x), var(--sp-y)) scale(1); opacity: 0; }
        }
        @keyframes sp-in {
          0%   { transform: scale(0.3) translateY(20px); opacity: 0; }
          65%  { transform: scale(1.08) translateY(-4px); opacity: 1; }
          100% { transform: scale(1) translateY(0);       opacity: 1; }
        }
        @keyframes sp-shine {
          0%, 100% { opacity: 0.15; transform: scale(1);    }
          50%       { opacity: 0.35; transform: scale(1.08); }
        }
        .sp-particle { animation: sp-burst var(--sp-dur) ease-out forwards; }
        .sp-score    { animation: sp-in 0.65s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .sp-shine    { animation: sp-shine 2.4s ease-in-out infinite; }
      `}</style>

      <div
        className="fixed inset-0 z-60 flex items-center justify-center p-4"
        style={{ backgroundColor: "rgba(0,0,0,0.92)" }}
      >
        <div className="relative flex flex-col items-center gap-5 text-center select-none">

          {/* Burst particles */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {particles.map((p) => (
              <div
                key={p.id}
                className="sp-particle absolute rounded-full"
                style={{
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.color,
                  "--sp-x": `${p.x}px`,
                  "--sp-y": `${p.y}px`,
                  "--sp-dur": `${p.dur}ms`,
                  animationDelay: `${p.delay}ms`,
                } as React.CSSProperties}
              />
            ))}
          </div>

          {/* Glow ring */}
          <div
            className="sp-shine absolute w-48 h-48 rounded-full"
            style={{ background: `radial-gradient(circle, ${meta.color}30 0%, transparent 70%)` }}
          />

          {/* Score number */}
          <div className="sp-score flex flex-col items-center z-10">
            <span
              className={`text-[100px] leading-none font-black ${meta.text}`}
              style={{ textShadow: `0 0 60px ${meta.color}99, 0 0 120px ${meta.color}44` }}
            >
              {score}
            </span>
            <span className="text-lg text-zinc-600 font-bold -mt-2">/10</span>
          </div>

          {/* Label */}
          <div className="z-10 flex flex-col items-center gap-1">
            <p className={`text-2xl font-black uppercase tracking-tight ${meta.text}`}>
              {meta.label}
            </p>
            <p className="text-sm text-zinc-500">{meta.msg}</p>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="z-10 mt-2 px-10 py-3 rounded-2xl bg-zinc-900 border border-zinc-700 text-zinc-300 font-black text-sm uppercase tracking-widest hover:bg-zinc-800 hover:text-white transition-all active:scale-95 hover:cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
