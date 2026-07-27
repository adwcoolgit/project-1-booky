import {
  createClientSessionSnapshot,
  parseClientSessionSnapshot,
  type ClientSessionSnapshot,
  type SessionState,
} from "@/shared/auth/session-schema";

export function mapSessionStateToPresentation(session: SessionState): ClientSessionSnapshot {
  return createClientSessionSnapshot(session);
}

export function parseSessionPresentation(value: unknown): ClientSessionSnapshot | null {
  return parseClientSessionSnapshot(value);
}
