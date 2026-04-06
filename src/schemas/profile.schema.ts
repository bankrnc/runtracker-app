import z from "zod";

export const profileSchema = z.object({
  gender: z.enum(["male", "female"], { message: "Please select a gender" }),
  birthDate: z.string().min(1, "Please enter your birth date"),
  height: z
    .number({ message: "Please enter your height" })
    .min(1, "Height must be greater than 0"),
  weight: z
    .number({ message: "Please enter your weight" })
    .min(1, "Weight must be greater than 0"),
  activityLevel: z.enum(
    ["sedentary", "lightly_active", "moderately_active", "very_active"],
    { message: "Please select an activity level" },
  ),
});

export type ProfileForm = z.infer<typeof profileSchema>;
