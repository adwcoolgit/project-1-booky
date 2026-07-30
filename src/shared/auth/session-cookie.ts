import { createHmac, timingSafeEqual } from "node:crypto";

import { runtimeConfig } from "@/shared/config/runtime";
import { parseSessionEnvelope, type SessionEnvelope } from "@/shared/auth/session-schema";

const sessionCookieVersion = "v1";

function getSessionSigningSecret() {
  const secret = runtimeConfig.authSessionSigningSecret;

  if (!secret) {
    throw new Error("AUTH_SESSION_SIGNING_SECRET must be configured for signed session cookies.");
  }

  return secret;
}

function signEncodedPayload(encodedPayload: string) {
  return createHmac("sha256", getSessionSigningSecret())
    .update(encodedPayload)
    .digest("base64url");
}

function hasValidSignature(encodedPayload: string, signature: string) {
  const expectedSignature = signEncodedPayload(encodedPayload);
  const expectedBuffer = Buffer.from(expectedSignature, "utf8");
  const actualBuffer = Buffer.from(signature, "utf8");

  return expectedBuffer.length === actualBuffer.length && timingSafeEqual(expectedBuffer, actualBuffer);
}

export function buildSessionCookieOptions() {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
    secure: runtimeConfig.authSessionCookieSecure,
  };
}

export function encodeSessionCookieValue(envelope: SessionEnvelope): string {
  const encodedPayload = Buffer.from(JSON.stringify(envelope), "utf8").toString("base64url");
  const signature = signEncodedPayload(encodedPayload);

  return `${sessionCookieVersion}.${encodedPayload}.${signature}`;
}

export function decodeSessionCookieValue(value: string | null | undefined): SessionEnvelope | null {
  if (!value) {
    return null;
  }

  const [version, encodedPayload, signature, ...rest] = value.split(".");

  if (rest.length > 0 || version !== sessionCookieVersion || !encodedPayload || !signature) {
    return null;
  }

  if (!hasValidSignature(encodedPayload, signature)) {
    return null;
  }

  try {
    const decodedValue = Buffer.from(encodedPayload, "base64url").toString("utf8");
    const parsedValue = JSON.parse(decodedValue) as unknown;

    return parseSessionEnvelope(parsedValue);
  } catch {
    return null;
  }
}