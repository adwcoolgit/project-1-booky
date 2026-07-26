"use client";

import type { PropsWithChildren } from "react";
import { useState } from "react";

import { QueryClientProvider } from "@tanstack/react-query";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";

import type { AppLocale } from "@/shared/i18n/config";
import { createQueryClient } from "@/shared/providers/query-client";

type AppProvidersProps = PropsWithChildren<{
  locale: AppLocale;
  messages?: AbstractIntlMessages | null;
}>;

export function AppProviders({ children, locale, messages }: AppProvidersProps) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <NextIntlClientProvider locale={locale} messages={messages ?? null} timeZone="UTC">
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </NextIntlClientProvider>
  );
}

