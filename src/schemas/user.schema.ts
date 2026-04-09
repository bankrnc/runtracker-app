import z from "zod";

const roleSchema = z.enum(["admin", "user"]);
const tierSchema = z.enum(["free", "pro"]);

const profileSchema = z.object({
  firstName: z.string(), // บังคับมีค่าเสมอ (register บังคับใส่)
  lastName: z.string(), // บังคับมีค่าเสมอ (register บังคับใส่)
  imageUrl: z.string().nullable(),
  gender: z.string().nullable(),
  birthDate: z.string().nullable(),
  height: z.number().nullable(),
  weight: z.number().nullable(),
  activityLevel: z.string().nullable(),
});

export const userSchema = z.object({
  id: z.number(),
  email: z.string(),
  status: z.boolean(),
  role: roleSchema,
  tier: tierSchema,
  generateCount: z.number(),
  generateResetAt: z.string(),
  profile: profileSchema.nullable(),
});

export type User = z.infer<typeof userSchema>;
