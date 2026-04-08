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

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function ProgramDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [activeWeek, setActiveWeek] = useState(0);

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
                    ? "bg-lime-400 text-black"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-600"
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

  return (
    <div className={`bg-zinc-900 border rounded-3xl p-5 flex flex-col gap-3 transition-colors ${
      isDone ? "border-lime-400/30" : "border-zinc-800 hover:border-zinc-700"
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
      {!isRest && session.segments.length > 0 && (
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
              {session.type === "interval"
                ? `${session.plannedDistance} sets`
                : `Total: ${session.plannedDistance} km`}
            </p>
          )}
        </div>
      )}

      {session.description && (
        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">{session.description}</p>
      )}

      {/* Log summary */}
      {isDone && (
        <div className="bg-lime-400/5 border border-lime-400/20 rounded-xl p-3">
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-3xl font-black text-lime-400">{session.score ?? "—"}</span>
            <span className="text-sm font-bold text-lime-400/60">/10</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-0.5">Dist</p>
              <p className="text-xs font-black text-zinc-300">{session.kmLogs.length} km</p>
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
              ? "bg-zinc-800 border border-zinc-700 text-zinc-400 hover:border-zinc-600"
              : "bg-lime-400 text-black hover:bg-white"
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
  // Intervals: rows = number of sets (segments.length); others: rows = planned km
  const totalRows = isInterval
    ? session.segments.length || Math.ceil(session.plannedDistance ?? 4)
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
      style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-zinc-900 border border-zinc-800 rounded-4xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-zinc-800 shrink-0">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-0.5">
              Day {session.dayNumber} · {SESSION_TYPE_LABELS[session.type]}
            </p>
            <h3 className="font-black text-lg">
              {isInterval ? `Log Intervals · ${totalRows} sets` : `Log Run · ${totalRows} km`}
            </h3>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors hover:cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-[40px_1fr_100px_90px] gap-2 px-6 py-2 shrink-0">
          <span className="text-[10px] font-bold text-zinc-600 uppercase">{isInterval ? "Set" : "Km"}</span>
          <span className="text-[10px] font-bold text-zinc-600 uppercase">Target</span>
          <span className="text-[10px] font-bold text-zinc-600 uppercase">Pace /km</span>
          <span className="text-[10px] font-bold text-zinc-600 uppercase">HR bpm</span>
        </div>

        {/* Km rows */}
        <div className="overflow-y-auto px-6 pb-4 flex flex-col gap-2 flex-1">
          {rows.map((row, i) => {
            const seg = getSegment(row.kmNumber);
            return (
              <div key={row.kmNumber} className="grid grid-cols-[40px_1fr_100px_90px] gap-2 items-center">
                {/* Km / Set number */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                  row.actualPace || row.actualHr ? "bg-lime-400 text-black" : "bg-zinc-800 text-zinc-500"
                }`} title={isInterval ? `Set ${row.kmNumber}` : `km ${row.kmNumber}`}>
                  {row.kmNumber}
                </div>

                {/* Target */}
                <div className="text-[10px] text-zinc-500 leading-tight">
                  {seg ? (
                    <>
                      {seg.paceMax && <span>{seg.paceMin ?? "—"}–{seg.paceMax}/km</span>}
                      {seg.hrMax && <span className="block">&lt;{seg.hrMax}bpm</span>}
                    </>
                  ) : (
                    <span className="text-zinc-700">—</span>
                  )}
                </div>

                {/* Pace input */}
                <input
                  value={row.actualPace}
                  onChange={(e) => updateRow(i, "actualPace", e.target.value)}
                  placeholder="5:30"
                  className="bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-lime-400 transition-colors text-center"
                />

                {/* HR input */}
                <input
                  type="number"
                  value={row.actualHr}
                  onChange={(e) => updateRow(i, "actualHr", e.target.value)}
                  placeholder="145"
                  className="bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-lime-400 transition-colors text-center"
                />
              </div>
            );
          })}
        </div>

        {/* Save button */}
        <div className="px-6 pb-6 pt-4 border-t border-zinc-800 shrink-0">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-lime-400 text-black py-3 rounded-xl font-black text-sm hover:bg-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
          >
            {submitting ? "Saving..." : "Save & Calculate Score"}
          </button>
        </div>
      </div>
    </div>
  );
}
