import { defineRouting } from "next-intl/routing";

import { defaultLocale, localeCookieName, localeDirection, supportedLocales } from "@/shared/i18n/config";

export const routing = defineRouting({
  locales: [...supportedLocales],
  defaultLocale,
  localePrefix: "always",
  localeCookie: {
    name: localeCookieName,
  },
});

export function getLocaleDirection() {
  return localeDirection;
}
