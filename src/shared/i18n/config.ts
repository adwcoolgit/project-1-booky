import { z } from "zod";

export const supportedLocales = ["en", "id"] as const;
export type AppLocale = (typeof supportedLocales)[number];

export const defaultLocale: AppLocale = "en";
export const localeCookieName = "BOOKY_LOCALE";
export const localeDirection = "ltr" as const;

export const localeSchema = z.enum(supportedLocales);

export function isSupportedLocale(value: string): value is AppLocale {
  return supportedLocales.includes(value as AppLocale);
}
