import { z } from "zod";

const defaultAppUrl = "http://localhost:3000";
const defaultApiBaseUrl = "https://library-backend-production-b9cf.up.railway.app/api";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default(defaultAppUrl),
  NEXT_PUBLIC_API_BASE_URL: z.string().url().default(defaultApiBaseUrl),
});

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_URL: z.string().url().optional(),
  API_BASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_API_BASE_URL: z.string().url().optional(),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;
type EnvSource = Record<string, string | undefined>;

export function getPublicEnv(source: EnvSource = process.env): PublicEnv {
  return publicEnvSchema.parse(source);
}

export function getServerEnv(source: EnvSource = process.env): ServerEnv {
  return serverEnvSchema.parse(source);
}