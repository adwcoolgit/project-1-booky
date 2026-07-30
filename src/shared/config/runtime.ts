import { defaultLocale, localeCookieName, supportedLocales } from "@/shared/i18n/config";
import { getPublicEnv, getServerEnv, resolveAuthSessionSigningSecret } from "@/shared/config/env";

const publicEnv = getPublicEnv();
const serverEnv = getServerEnv();
const appUrl = serverEnv.APP_URL ?? publicEnv.NEXT_PUBLIC_APP_URL;
const apiBaseUrl = serverEnv.API_BASE_URL ?? publicEnv.NEXT_PUBLIC_API_BASE_URL;

export const runtimeConfig = {
  appUrl,
  apiBaseUrl,
  defaultLocale,
  localeCookieName,
  supportedLocales,
  authSessionCookieName: serverEnv.AUTH_SESSION_COOKIE_NAME,
  authSessionCookieSecure:
    serverEnv.AUTH_SESSION_COOKIE_SECURE ?? serverEnv.NODE_ENV === "production",
  authSessionSigningSecret: resolveAuthSessionSigningSecret(serverEnv),
  authAllowedOrigins: serverEnv.AUTH_ALLOWED_ORIGINS ?? [appUrl],
  authE2eFixtureMode:
    serverEnv.AUTH_E2E_FIXTURE_MODE ?? publicEnv.NEXT_PUBLIC_AUTH_E2E_FIXTURE_MODE ?? false,
} as const;