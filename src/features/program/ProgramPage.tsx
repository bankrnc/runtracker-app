import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { programApi } from "../../api/programApi";
import {
  generateProgramSchema,
  type GenerateProgramInput,
  type Program,
  SESSION_TYPE_LABELS,
  SESSION_TYPE_BAR,
} from "../../schemas/program.schema";

export default function ProgramPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GenerateProgramInput>({
    resolver: zodResolver(generateProgramSchema),
    defaultValues: { daysPerWeek: 4, level: "beginner" },
  });

  useEffect(() => {
    programApi
      .getAll()
      .then(setPrograms)
      .catch(() => toast.error("Failed to load programs"))
      .finally(() => setLoading(false));
  }, []);

  const onSubmit = async (data: GenerateProgramInput) => {
    setGenerating(true);
    try {
      const program = await programApi.generate(data);
      setPrograms((prev) => [program, ...prev]);
      setShowForm(false);
      reset();
      toast.success("Program generated!");
    } catch {
      toast.error("Failed to generate program. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this program?")) return;
    await programApi.delete(id);
    setPrograms((prev) => prev.filter((p) => p.id !== id));
    toast.success("Program deleted");
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-black text-white font-sans pb-20">
      <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-10">

        {/* AI Coach Hero Banner */}
        <section className="relative mb-8 rounded-3xl overflow-hidden border border-zinc-800">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-lime-400/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative px-8 py-8 lg:px-12">
            {/* Top: headline left, button right */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-6">
              {/* Left */}
              <div>
                <h2 className="text-3xl lg:text-5xl font-black italic uppercase tracking-tighter leading-none">
                  Your Personal<br />
                  <span className="text-lime-400">Running Coach</span>
                </h2>
                <p className="text-zinc-500 text-sm mt-3 max-w-xs leading-relaxed">
                  Tell us your goal — we'll build a 4-week program tailored to your pace, HR zones, and schedule.
                </p>
              </div>

              {/* Right: button + badge */}
              <div className="flex flex-col items-start sm:items-end gap-2.5 shrink-0">
                {showForm ? (
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-5 py-2 rounded-full font-black text-xs uppercase tracking-widest bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all active:scale-95 hover:cursor-pointer"
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    onClick={() => setShowForm(true)}
                    className="px-7 py-3 rounded-full font-black text-sm uppercase tracking-widest bg-lime-400 text-black hover:bg-white transition-all active:scale-95 hover:cursor-pointer shadow-[0_0_20px_rgba(163,230,53,0.2)]"
                  >
                    Generate Program
                  </button>
                )}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20">
                  <span className="w-1 h-1 rounded-full bg-violet-400 animate-pulse block" />
                  <span className="text-[9px] font-black tracking-widest uppercase text-violet-400">AI Coach</span>
                </div>
              </div>
            </div>

            {/* Chips — full width */}
            <div className="flex flex-wrap gap-2">
              {["4-Week Plan", "Daily Sessions", "Pace & HR Targets", "Weekly Progression", "Auto Score /10"].map((label) => (
                <span key={label} className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-zinc-800 text-zinc-600 bg-zinc-900">
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Generate Form */}
        {showForm && (
          <div className="relative border border-violet-500/20 bg-zinc-900 rounded-3xl p-6 mb-8 overflow-hidden">
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-violet-600/6 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse block" />
                <p className="text-[10px] font-black uppercase tracking-widest text-violet-400">Configure your program</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5 block">
                    Goal
                  </label>
                  <input
                    {...register("goal")}
                    placeholder="e.g. Run 10K under 55 minutes in 8 weeks"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                  {errors.goal && (
                    <p className="text-red-400 text-xs mt-1">{errors.goal.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5 block">
                      Level
                    </label>
                    <select
                      {...register("level")}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5 block">
                      Days / Week
                    </label>
                    <select
                      {...register("daysPerWeek", { valueAsNumber: true })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                    >
                      {[3, 4, 5, 6].map((d) => (
                        <option key={d} value={d}>{d} days</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5 block">
                      Start Date
                    </label>
                    <input
                      type="date"
                      {...register("startDate")}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                    />
                    {errors.startDate && (
                      <p className="text-red-400 text-xs mt-1">{errors.startDate.message}</p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={generating}
                  className="w-full bg-lime-400 text-black py-3 rounded-xl font-black text-sm hover:bg-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer shadow-[0_0_20px_rgba(163,230,53,0.15)]"
                >
                  {generating ? "Generating... (takes ~10s)" : "Generate Program →"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* My Programs header */}
        <div className="flex items-center gap-4 mb-6">
          <h3 className="text-xl font-black italic uppercase tracking-tighter text-zinc-300 whitespace-nowrap">
            My Programs
          </h3>
          <div className="flex-1 h-px bg-zinc-800" />
          {programs.length > 0 && (
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest whitespace-nowrap">
              {programs.length} program{programs.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Program List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : programs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <p className="text-zinc-600 text-sm">No programs yet — generate your first one above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {programs.map((p) => (
              <ProgramCard key={p.id} program={p} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function ProgramCard({
  program,
  onDelete,
}: {
  program: Program;
  onDelete: (id: number) => void;
}) {
  const allSessions = program.weeks.flatMap((w) => w.sessions);
  const trainingSessions = allSessions.filter((s) => s.type !== "rest");
  const completed = trainingSessions.filter((s) => s.kmLogs.length > 0).length;
  const pct =
    trainingSessions.length > 0
      ? Math.round((completed / trainingSessions.length) * 100)
      : 0;

  const typeCounts = trainingSessions.reduce<Record<string, number>>(
    (acc, s) => {
      acc[s.type] = (acc[s.type] ?? 0) + 1;
      return acc;
    },
    {},
  );

  return (
    <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl p-5 flex flex-col gap-4 hover:border-zinc-700 transition-colors overflow-hidden">
      {/* Subtle top-right glow */}
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-violet-600/8 rounded-full blur-2xl pointer-events-none" />

      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-black text-base leading-snug pr-2">{program.title}</h3>
        <button
          onClick={() => onDelete(program.id)}
          className="shrink-0 p-1.5 text-zinc-700 hover:text-red-400 transition-colors hover:cursor-pointer"
          title="Delete program"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
          <span className="text-zinc-500">Completion</span>
          <span className={pct === 100 ? "text-lime-400" : "text-white"}>{pct}%</span>
        </div>
        <div className="w-full bg-zinc-800 rounded-full h-1">
          <div
            className="bg-lime-400 h-1 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-[10px] text-zinc-600">{completed} / {trainingSessions.length} sessions done</p>
      </div>

      {/* Session type breakdown */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(typeCounts).map(([type, count]) => (
          <span key={type} className="text-[10px] font-bold text-zinc-500 flex items-center gap-1">
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${SESSION_TYPE_BAR[type as keyof typeof SESSION_TYPE_BAR] ?? "bg-zinc-500"}`} />
            {SESSION_TYPE_LABELS[type as keyof typeof SESSION_TYPE_LABELS] ?? type} ×{count}
          </span>
        ))}
      </div>

      {/* CTA */}
      <Link
        to={`/program/${program.id}`}
        className="block w-full text-center bg-zinc-800 border border-zinc-700 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-zinc-700 hover:border-lime-400/20 transition-all active:scale-95"
      >
        View Program
      </Link>
    </div>
  );
}
