import axios from "axios";
import z from "zod";

const envSchema = z.object({
  VITE_BACKEND_URL: z.string().url(),
});

const { success, data, error } = envSchema.safeParse(import.meta.env);

if (!success) {
  console.error("Invalid env:", error);
  throw new Error("Invalid environment variable");
}

export const env = data;

export const apiClient = axios.create({
  baseURL: env.VITE_BACKEND_URL,
  withCredentials: true,
});
