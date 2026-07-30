import { runtimeConfig } from "@/shared/config/runtime";
import { parseSessionEnvelope, type SessionEnvelope } from "@/shared/auth/session-schema";

export function buildSessionCookieOptions() {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
    secure: runtimeConfig.authSessionCookieSecure,
  };
}

export function encodeSessionCookieValue(envelope: SessionEnvelope): string {
  return Buffer.from(JSON.stringify(envelope), "utf8").toString("base64url");
}

export function decodeSessionCookieValue(value: string | null | undefined): SessionEnvelope | null {
  if (!value) {
    return null;
  }

  try {
    const decodedValue = Buffer.from(value, "base64url").toString("utf8");
    const parsedValue = JSON.parse(decodedValue) as unknown;

    return parseSessionEnvelope(parsedValue);
  } catch {
    return null;
  }
}
