import z from "zod";

const roleSchema = z.enum(["admin", "user"]);

export const userSchema = z.object({
  id: z.number(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  status: z.boolean(),
  role: roleSchema,
  imageUrl: z.string().nullable(),
});

export type User = z.infer<typeof userSchema>;
