import "server-only";

import { cookies } from "next/headers";

import {
  createAuthenticatedSession,
  createClientSessionSnapshot,
  createGuestSession,
  type ClientSessionSnapshot,
  type SessionEnvelope,
  type SessionState,
} from "@/shared/auth/session-schema";
import { buildSessionCookieOptions, decodeSessionCookieValue, encodeSessionCookieValue } from "@/shared/auth/session-cookie";
import { runtimeConfig } from "@/shared/config/runtime";
import { resolveLocale, type AppLocale } from "@/shared/i18n/config";

type SessionReadOptions = {
  cleanupInvalidCookie?: boolean;
};

export async function readSessionLocale(fallbackLocale?: AppLocale): Promise<AppLocale> {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(runtimeConfig.localeCookieName)?.value;

  return resolveLocale(localeCookie ?? fallbackLocale);
}

export async function readSessionEnvelope(options: SessionReadOptions = {}): Promise<SessionEnvelope | null> {
  const cookieStore = await cookies();
  const rawCookie = cookieStore.get(runtimeConfig.authSessionCookieName)?.value;
  const envelope = decodeSessionCookieValue(rawCookie);

  if (!envelope && rawCookie && options.cleanupInvalidCookie) {
    cookieStore.delete(runtimeConfig.authSessionCookieName);
  }

  return envelope;
}

export async function readSessionState(locale: AppLocale, options: SessionReadOptions = {}): Promise<SessionState> {
  const envelope = await readSessionEnvelope(options);

  return envelope ? createAuthenticatedSession(envelope, locale) : createGuestSession(locale);
}

export async function readClientSessionSnapshot(locale: AppLocale, options: SessionReadOptions = {}): Promise<ClientSessionSnapshot> {
  const session = await readSessionState(locale, options);

  return createClientSessionSnapshot(session);
}

export async function writeSessionEnvelope(envelope: SessionEnvelope): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(runtimeConfig.authSessionCookieName, encodeSessionCookieValue(envelope), buildSessionCookieOptions());
}

export async function deleteSessionEnvelope(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(runtimeConfig.authSessionCookieName);
}
