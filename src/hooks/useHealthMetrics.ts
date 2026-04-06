import { useAuthStore } from "../store/useAuthStore";

export interface BmiInfo {
  label: string;
  color: string;
  bg: string;
  description: string;
}

export interface HrZone {
  zone: string;
  label: string;
  range: string;
  color: string;
}

export interface Macros {
  protein: number;
  carb: number;
  fat: number;
}

export interface HealthMetrics {
  age: number | null;
  bmi: number | null;
  bmiInfo: BmiInfo | null;
  bmr: number | null;
  tdee: number | null;
  macros: Macros | null;
  hrZones: HrZone[] | null;
  maxHR: number | null;
  isComplete: boolean;
}

const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
};

function getBmiInfo(bmi: number): BmiInfo {
  if (bmi < 18.5)
    return {
      label: "Underweight",
      color: "text-blue-400",
      bg: "bg-blue-400",
      description: "Consider increasing caloric intake and strength training.",
    };
  if (bmi < 25)
    return {
      label: "Normal Weight",
      color: "text-lime-400",
      bg: "bg-lime-400",
      description: "Ideal range for endurance runners.",
    };
  if (bmi < 30)
    return {
      label: "Overweight",
      color: "text-yellow-400",
      bg: "bg-yellow-400",
      description: "Focus on cardio and reducing caloric surplus.",
    };
  return {
    label: "Obese",
    color: "text-red-400",
    bg: "bg-red-400",
    description: "Consult a healthcare professional for guidance.",
  };
}

function buildHrZones(maxHR: number): HrZone[] {
  return [
    {
      zone: "Zone 5",
      label: "Maximum",
      range: `${Math.round(maxHR * 0.9)} - ${maxHR} bpm`,
      color: "bg-red-500",
    },
    {
      zone: "Zone 4",
      label: "Threshold",
      range: `${Math.round(maxHR * 0.8)} - ${Math.round(maxHR * 0.9) - 1} bpm`,
      color: "bg-orange-500",
    },
    {
      zone: "Zone 3",
      label: "Aerobic",
      range: `${Math.round(maxHR * 0.7)} - ${Math.round(maxHR * 0.8) - 1} bpm`,
      color: "bg-yellow-400",
    },
    {
      zone: "Zone 2",
      label: "Easy Run",
      range: `${Math.round(maxHR * 0.6)} - ${Math.round(maxHR * 0.7) - 1} bpm`,
      color: "bg-lime-400",
    },
    {
      zone: "Zone 1",
      label: "Recovery",
      range: `${Math.round(maxHR * 0.5)} - ${Math.round(maxHR * 0.6) - 1} bpm`,
      color: "bg-zinc-600",
    },
  ];
}

export function useHealthMetrics(): HealthMetrics {
  const profile = useAuthStore((state) => state.user?.profile);

  let age: number | null = null;
  if (profile?.birthDate) {
    const now = new Date();
    age = Math.floor(
      (now.getTime() - new Date(profile.birthDate).getTime()) /
        (1000 * 60 * 60 * 24 * 365.25),
    );
  }

  const bmi =
    profile?.height && profile?.weight
      ? profile.weight / Math.pow(profile.height / 100, 2)
      : null;

  const bmiInfo = bmi ? getBmiInfo(bmi) : null;

  let bmr: number | null = null;
  let tdee: number | null = null;
  let macros: Macros | null = null;
  if (
    profile?.height &&
    profile?.weight &&
    age &&
    profile?.gender &&
    profile?.activityLevel
  ) {
    bmr = Math.round(
      profile.gender === "male"
        ? 10 * profile.weight + 6.25 * profile.height - 5 * age + 5
        : 10 * profile.weight + 6.25 * profile.height - 5 * age - 161,
    );
    tdee = Math.round(
      bmr * (ACTIVITY_MULTIPLIERS[profile.activityLevel] ?? 1.2),
    );
    macros = {
      protein: Math.round((tdee * 0.25) / 4),
      carb: Math.round((tdee * 0.5) / 4),
      fat: Math.round((tdee * 0.25) / 9),
    };
  }

  const maxHR = age ? 220 - age : null;
  const hrZones = maxHR ? buildHrZones(maxHR) : null;

  const isComplete =
    !!profile?.height &&
    !!profile?.weight &&
    !!profile?.birthDate &&
    !!profile?.gender &&
    !!profile?.activityLevel;

  return { age, bmi, bmiInfo, bmr, tdee, macros, hrZones, maxHR, isComplete };
}
