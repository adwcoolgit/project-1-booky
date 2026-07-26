import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { defaultLocale, supportedLocales } from "@/shared/i18n/config";
import { getMessages } from "@/shared/i18n/get-messages";

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;
  const locale = hasLocale(supportedLocales, requestedLocale) ? requestedLocale : defaultLocale;

  return {
    locale,
    messages: getMessages(locale),
  };
});

