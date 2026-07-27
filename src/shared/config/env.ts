import { z } from "zod";

const defaultAppUrl = "http://localhost:3000";
const defaultApiBaseUrl = "https://library-backend-production-b9cf.up.railway.app/api";
const defaultAuthSessionCookieName = "BOOKY_SESSION";

function normalizeBooleanEnvValue(value: unknown) {
  if (typeof value !== "string") {
    return value;
  }

  const normalized = value.trim().toLowerCase();

  if (normalized === "true") {
    return true;
  }

  if (normalized === "false") {
    return false;
  }

  return value;
}

const authSessionCookieSecureSchema = z.preprocess((value) => {
  if (value === undefined || value === "") {
    return undefined;
  }

  return normalizeBooleanEnvValue(value);
}, z.boolean().optional());

const authE2eFixtureModeSchema = z.preprocess((value) => {
  if (value === undefined || value === "") {
    return undefined;
  }

  return normalizeBooleanEnvValue(value);
}, z.boolean().optional());

const authAllowedOriginsSchema = z
  .string()
  .optional()
  .transform((value, ctx) => {
    if (!value) {
      return undefined;
    }

    const origins = value
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean);

    for (const origin of origins) {
      if (!z.string().url().safeParse(origin).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Invalid AUTH_ALLOWED_ORIGINS entry: ${origin}`,
        });
      }
    }

    return origins.length > 0 ? origins : undefined;
  });

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
  AUTH_SESSION_COOKIE_NAME: z.string().min(1).default(defaultAuthSessionCookieName),
  AUTH_SESSION_COOKIE_SECURE: authSessionCookieSecureSchema,
  AUTH_ALLOWED_ORIGINS: authAllowedOriginsSchema,
  AUTH_E2E_FIXTURE_MODE: authE2eFixtureModeSchema,
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