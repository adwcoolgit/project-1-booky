import type {
  AuthenticatedSession,
  ClientSessionSnapshot,
  GuestSession,
  SessionEnvelope,
  SessionRole,
  SessionState,
} from "@/shared/auth/session-schema";
import {
  createAuthenticatedSession,
  createClientSessionSnapshot,
  createGuestSession,
} from "@/shared/auth/session-schema";

export type {
  AuthenticatedSession,
  ClientSessionSnapshot,
  GuestSession,
  SessionEnvelope,
  SessionRole,
  SessionState,
};

export { createAuthenticatedSession, createClientSessionSnapshot, createGuestSession };

export function isAuthenticatedSession(session: SessionState): session is AuthenticatedSession {
  return session.status === "authenticated";
}

export function isGuestSession(session: SessionState): session is GuestSession {
  return session.status === "guest";
}

export function hasSessionRole(session: SessionState, role: SessionRole): boolean {
  return session.status === "authenticated" && session.role === role;
}
