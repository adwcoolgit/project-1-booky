import type { NormalizedError } from "@/shared/lib/errors/normalized-error";
import { runtimeConfig } from "@/shared/config/runtime";

function normalizeOrigin(origin: string): string | null {
  try {
    return new URL(origin).origin;
  } catch {
    return null;
  }
}

export function isAllowedOrigin(
  origin: string | null | undefined,
  allowedOrigins: readonly string[] = runtimeConfig.authAllowedOrigins,
): boolean {
  if (!origin) {
    return false;
  }

  const normalizedOrigin = normalizeOrigin(origin);

  if (!normalizedOrigin) {
    return false;
  }

  return allowedOrigins.some((allowedOrigin) => normalizeOrigin(allowedOrigin) === normalizedOrigin);
}

export function createDisallowedOriginError(): Error & NormalizedError {
  const error = new Error("Disallowed origin for auth mutation.") as Error & NormalizedError;

  error.code = "forbidden";
  error.status = 403;
  error.details = undefined;

  return error;
}

export function assertAllowedOrigin(origin: string | null | undefined): void {
  if (!isAllowedOrigin(origin)) {
    throw createDisallowedOriginError();
  }
}
