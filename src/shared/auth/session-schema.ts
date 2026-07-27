import { z } from "zod";

import { localeSchema, type AppLocale } from "@/shared/i18n/config";

export const sessionRoleSchema = z.enum(["USER", "ADMIN"]);
export type SessionRole = z.infer<typeof sessionRoleSchema>;

export const sessionEnvelopeSchema = z.object({
  jwt: z.string().min(1),
  userId: z.number().int().positive(),
  userName: z.string().min(1),
  userEmail: z.string().email(),
  role: sessionRoleSchema,
  issuedAt: z.string().datetime(),
  localeAtLogin: localeSchema,
});
export type SessionEnvelope = z.infer<typeof sessionEnvelopeSchema>;

export const guestSessionSchema = z.object({
  status: z.literal("guest"),
  locale: localeSchema,
});
export type GuestSession = z.infer<typeof guestSessionSchema>;

export const authenticatedSessionSchema = z.object({
  status: z.literal("authenticated"),
  role: sessionRoleSchema,
  userId: z.number().int().positive(),
  displayName: z.string().min(1),
  email: z.string().email(),
  locale: localeSchema,
});
export type AuthenticatedSession = z.infer<typeof authenticatedSessionSchema>;

export const sessionStateSchema = z.union([guestSessionSchema, authenticatedSessionSchema]);
export type SessionState = z.infer<typeof sessionStateSchema>;

export const clientSessionSnapshotSchema = z.union([
  z.object({
    status: z.literal("guest"),
  }),
  z.object({
    status: z.literal("authenticated"),
    user: z.object({
      id: z.number().int().positive(),
      name: z.string().min(1),
      email: z.string().email(),
      role: sessionRoleSchema,
    }),
    locale: localeSchema,
  }),
]);
export type ClientSessionSnapshot = z.infer<typeof clientSessionSnapshotSchema>;

export function createGuestSession(locale: AppLocale): GuestSession {
  return {
    status: "guest",
    locale,
  };
}

export function createAuthenticatedSession(
  envelope: SessionEnvelope,
  locale: AppLocale = envelope.localeAtLogin,
): AuthenticatedSession {
  return {
    status: "authenticated",
    role: envelope.role,
    userId: envelope.userId,
    displayName: envelope.userName,
    email: envelope.userEmail,
    locale,
  };
}

export function createClientSessionSnapshot(session: SessionState): ClientSessionSnapshot {
  if (session.status === "guest") {
    return {
      status: "guest",
    };
  }

  return {
    status: "authenticated",
    user: {
      id: session.userId,
      name: session.displayName,
      email: session.email,
      role: session.role,
    },
    locale: session.locale,
  };
}

export function parseSessionEnvelope(value: unknown): SessionEnvelope | null {
  const parsed = sessionEnvelopeSchema.safeParse(value);

  return parsed.success ? parsed.data : null;
}

export function parseClientSessionSnapshot(value: unknown): ClientSessionSnapshot | null {
  const parsed = clientSessionSnapshotSchema.safeParse(value);

  return parsed.success ? parsed.data : null;
}
