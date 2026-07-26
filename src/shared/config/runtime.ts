import { defaultLocale, localeCookieName, supportedLocales } from "@/shared/i18n/config";
import { getPublicEnv, getServerEnv } from "@/shared/config/env";

const publicEnv = getPublicEnv();
const serverEnv = getServerEnv();

export const runtimeConfig = {
  appUrl: serverEnv.APP_URL ?? publicEnv.NEXT_PUBLIC_APP_URL,
  apiBaseUrl: serverEnv.API_BASE_URL ?? publicEnv.NEXT_PUBLIC_API_BASE_URL,
  defaultLocale,
  localeCookieName,
  supportedLocales,
} as const;
