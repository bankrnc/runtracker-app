import z from "zod";

export const SESSION_TYPES = [
  "easy",
  "tempo",
  "interval",
  "long_run",
  "recovery",
  "rest",
] as const;

export type SessionType = (typeof SESSION_TYPES)[number];

export const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  easy: "Easy Run",
  tempo: "Tempo",
  interval: "Interval",
  long_run: "Long Run",
  recovery: "Recovery",
  rest: "Rest",
};

export const SESSION_TYPE_COLORS: Record<SessionType, string> = {
  easy: "text-lime-400 bg-lime-400/10 border-lime-400/30",
  tempo: "text-orange-400 bg-orange-400/10 border-orange-400/30",
  interval: "text-red-400 bg-red-400/10 border-red-400/30",
  long_run: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  recovery: "text-zinc-400 bg-zinc-400/10 border-zinc-400/30",
  rest: "text-zinc-600 bg-zinc-800/50 border-zinc-700",
};

export const SESSION_TYPE_BAR: Record<SessionType, string> = {
  easy: "bg-lime-400",
  tempo: "bg-orange-400",
  interval: "bg-red-400",
  long_run: "bg-blue-400",
  recovery: "bg-zinc-400",
  rest: "bg-zinc-700",
};

export interface Segment {
  id: number;
  sessionId: number;
  kmStart: number;
  kmEnd: number;
  paceMin: string | null;
  paceMax: string | null;
  hrMax: number | null;
}

export interface KmLog {
  id: number;
  sessionId: number;
  kmNumber: number;
  actualPace: string | null;
  actualHr: number | null;
}

export interface Session {
  id: number;
  weekId: number;
  dayNumber: number;
  type: SessionType;
  description: string | null;
  plannedDistance: number | null;
  score: number | null;
  segments: Segment[];
  kmLogs: KmLog[];
}

export interface Week {
  id: number;
  programId: number;
  weekNumber: number;
  sessions: Session[];
}

export interface Program {
  id: number;
  userId: number;
  title: string;
  goal: string;
  level: string;
  startDate: string;
  createdAt: string;
  weeks: Week[];
}

// Form schemas
export const generateProgramSchema = z.object({
  goal: z.string().min(3, "Please describe your goal"),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  daysPerWeek: z.number().int().min(3).max(6),
  startDate: z.string().min(1, "Please select a start date"),
});

export type GenerateProgramInput = z.infer<typeof generateProgramSchema>;

export const kmLogEntrySchema = z.object({
  kmNumber: z.number().int().positive(),
  actualPace: z.string().optional().or(z.literal("")),
  actualHr: z.coerce.number().int().positive().optional().or(z.literal("")),
});

export const logKmSchema = z.object({
  kmLogs: z.array(kmLogEntrySchema),
});

export type KmLogEntry = z.infer<typeof kmLogEntrySchema>;
export type LogKmInput = z.infer<typeof logKmSchema>;
