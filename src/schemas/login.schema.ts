import z from "zod";

export const loginSchema = z.object({
  email: z.email("email is required !"),
  password: z.string().min(6, "Enter your password"),
});

export type LoginInput = z.infer<typeof loginSchema>;
