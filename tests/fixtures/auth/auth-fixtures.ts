import type { AppLocale } from "@/shared/i18n/config";
import type { SessionEnvelope, SessionRole } from "@/shared/auth/session-schema";
import type { LoginFormInput } from "@/features/auth/model/login-form";
import type { RegisterFormInput } from "@/features/auth/model/register-form";

export const authSessionCookieName = "BOOKY_SESSION";

export const authTestCredentials = {
  user: {
    email: "reader@booky.test",
    password: "Password123!",
  },
  admin: {
    email: "admin@booky.test",
    password: "Password123!",
  },
  duplicateRegisterEmail: "existing@booky.test",
} as const;

let lastRegisterPayload: Record<string, unknown> | null = null;
let lastLoginPayload: Record<string, unknown> | null = null;

export function resetAuthFixtureState() {
  lastRegisterPayload = null;
  lastLoginPayload = null;
}

export function recordRegisterPayload(payload: Record<string, unknown>) {
  lastRegisterPayload = payload;
}

export function recordLoginPayload(payload: Record<string, unknown>) {
  lastLoginPayload = payload;
}

export function readLastRegisterPayload() {
  return lastRegisterPayload;
}

export function readLastLoginPayload() {
  return lastLoginPayload;
}

export function createRegisterFormInputFixture(locale: AppLocale = "en"): RegisterFormInput {
  return {
    name: "Booky Reader",
    email: "new-reader@booky.test",
    phone: "+6281234567890",
    password: authTestCredentials.user.password,
    confirmPassword: authTestCredentials.user.password,
    policyAccepted: true,
    surfaceLocale: locale,
  };
}

export function createLoginFormInputFixture(
  role: SessionRole = "USER",
  locale: AppLocale = "en",
  surface: LoginFormInput["surface"] = role === "ADMIN" ? "admin" : "user",
): LoginFormInput {
  const credentials = role === "ADMIN" ? authTestCredentials.admin : authTestCredentials.user;

  return {
    email: credentials.email,
    password: credentials.password,
    surface,
    returnTo: undefined,
    surfaceLocale: locale,
  };
}

export function createOpaqueSessionToken(role: SessionRole): string {
  return role === "ADMIN" ? "opaque-session-token-admin" : "opaque-session-token-user";
}

export function createLoginResponseFixture(role: SessionRole) {
  return {
    token: createOpaqueSessionToken(role),
    user: {
      id: role === "ADMIN" ? 1 : 2,
      name: role === "ADMIN" ? "Booky Admin" : "Booky Reader",
      email: role === "ADMIN" ? authTestCredentials.admin.email : authTestCredentials.user.email,
      role,
    },
  };
}

export function createSessionEnvelopeFixture(role: SessionRole, locale: AppLocale = "en"): SessionEnvelope {
  const loginResponse = createLoginResponseFixture(role);

  return {
    jwt: loginResponse.token,
    userId: loginResponse.user.id,
    userName: loginResponse.user.name,
    userEmail: loginResponse.user.email,
    role,
    issuedAt: "2026-07-27T00:00:00.000Z",
    localeAtLogin: locale,
  };
}

export function encodeSessionEnvelopeFixture(envelope: SessionEnvelope): string {
  return Buffer.from(JSON.stringify(envelope), "utf8").toString("base64url");
}

export function createEncodedSessionCookieFixture(role: SessionRole, locale: AppLocale = "en"): string {
  return encodeSessionEnvelopeFixture(createSessionEnvelopeFixture(role, locale));
}
