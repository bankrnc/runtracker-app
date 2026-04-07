import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { programApi } from "../api/programApi";
import {
  generateProgramSchema,
  type GenerateProgramInput,
  type Program,
  SESSION_TYPE_LABELS,
  SESSION_TYPE_BAR,
} from "../schemas/program.schema";

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
        {/* Header */}
        <section className="mb-10">
          <p className="text-[10px] font-bold tracking-widest uppercase text-lime-400 mb-2">
            Training Programs
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter">
              My Programs
            </h2>
            <button
              onClick={() => setShowForm((v) => !v)}
              className="shrink-0 bg-lime-400 text-black px-6 py-2.5 rounded-full font-black text-sm hover:bg-white transition-all shadow-[0_0_15px_rgba(163,230,53,0.2)] active:scale-95 hover:cursor-pointer"
            >
              {showForm ? "Cancel" : "+ Generate New"}
            </button>
          </div>
          <div className="mt-4 h-px bg-zinc-800" />
        </section>

        {/* Generate Form */}
        {showForm && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-4xl p-6 mb-10">
            <h3 className="font-black italic uppercase text-lg mb-6">
              Generate with AI
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5 block">
                  Goal
                </label>
                <input
                  {...register("goal")}
                  placeholder="e.g. Run 10K under 55 minutes in 8 weeks"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-lime-400 transition-colors"
                />
                {errors.goal && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.goal.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5 block">
                    Level
                  </label>
                  <select
                    {...register("level")}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-lime-400 transition-colors"
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
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-lime-400 transition-colors"
                  >
                    {[3, 4, 5, 6].map((d) => (
                      <option key={d} value={d}>
                        {d} days
                      </option>
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
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-lime-400 transition-colors"
                  />
                  {errors.startDate && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.startDate.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={generating}
                className="w-full bg-lime-400 text-black py-3 rounded-xl font-black text-sm hover:bg-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
              >
                {generating ? "Generating... (takes ~10s)" : "Generate Program"}
              </button>
            </form>
          </div>
        )}

        {/* Program List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : programs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-3xl">
              🏃
            </div>
            <p className="text-zinc-500 text-sm">
              No programs yet. Generate one above!
            </p>
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
    <div className="bg-zinc-900 border border-zinc-800 rounded-4xl p-6 flex flex-col gap-5 hover:border-zinc-700 transition-colors">
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
            {program.level} · {program.weeks.length} weeks
          </p>
          <h3 className="font-black text-lg leading-tight">{program.title}</h3>
          <p className="text-zinc-500 text-xs mt-1 line-clamp-2">
            {program.goal}
          </p>
        </div>
        <button
          onClick={() => onDelete(program.id)}
          className="shrink-0 p-1.5 text-zinc-600 hover:text-red-400 transition-colors hover:cursor-pointer"
          title="Delete program"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
          <span className="text-zinc-500">Completion</span>
          <span className={pct === 100 ? "text-lime-400" : "text-white"}>
            {pct}%
          </span>
        </div>
        <div className="w-full bg-zinc-800 rounded-full h-1.5">
          <div
            className="bg-lime-400 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-[10px] text-zinc-600">
          {completed} / {trainingSessions.length} sessions done
        </p>
      </div>

      {/* Session type breakdown */}
      <div className="flex flex-wrap gap-1.5">
        {Object.entries(typeCounts).map(([type, count]) => (
          <span
            key={type}
            className="text-[10px] font-bold text-zinc-400 flex items-center gap-1"
          >
            <span
              className={`inline-block w-1.5 h-1.5 rounded-full ${SESSION_TYPE_BAR[type as keyof typeof SESSION_TYPE_BAR] ?? "bg-zinc-500"}`}
            />
            {SESSION_TYPE_LABELS[type as keyof typeof SESSION_TYPE_LABELS] ??
              type}{" "}
            ×{count}
          </span>
        ))}
      </div>

      {/* CTA */}
      <Link
        to={`/program/${program.id}`}
        className="block w-full text-center bg-zinc-800 border border-zinc-700 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-zinc-700 hover:border-lime-400/30 transition-all active:scale-95"
      >
        View Program
      </Link>
    </div>
  );
}
