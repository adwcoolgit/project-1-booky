"use client";

import { createContext, type PropsWithChildren, useContext, useState } from "react";

import { QueryClientProvider } from "@tanstack/react-query";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { clearPrivateQueryCache } from "@/shared/auth/private-query-cache";
import { getLocalizedAuthPaths, type AuthSurface } from "@/shared/auth/route-access";
import { sanitizeReturnTo } from "@/shared/auth/return-to";
import { resolveSessionFailureResult } from "@/shared/auth/session-failure";
import type { AppLocale } from "@/shared/i18n/config";
import { createQueryClient } from "@/shared/providers/query-client";

type AppProvidersProps = PropsWithChildren<{
  locale: AppLocale;
  messages?: AbstractIntlMessages | null;
}>;

export type SessionFailureNotifier = {
  clearPrivateState: () => number;
  handleFailure: (input: {
    code: "unauthenticated" | "forbidden";
    currentPath?: string | null;
    loginSurface?: AuthSurface | null;
    returnTo?: string | null;
  }) => string | null;
};

const SessionFailureContext = createContext<SessionFailureNotifier | null>(null);

export function useSessionFailureNotifier() {
  const value = useContext(SessionFailureContext);

  if (!value) {
    throw new Error("useSessionFailureNotifier must be used within AppProviders.");
  }

  return value;
}

export function AppProviders({ children, locale, messages }: AppProvidersProps) {
  const [queryClient] = useState(() => createQueryClient());
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const sessionFailureNotifier: SessionFailureNotifier = {
    clearPrivateState: () => clearPrivateQueryCache(queryClient),
    handleFailure: ({ code, currentPath, loginSurface, returnTo }) => {
      const resolvedPath = currentPath ?? `${pathname ?? `/${locale}`}${searchParams?.size ? `?${searchParams.toString()}` : ""}`;
      const result = resolveSessionFailureResult({
        code,
        currentPath: resolvedPath,
        locale,
        paths: getLocalizedAuthPaths(locale),
        ...(loginSurface === undefined ? {} : { loginSurface }),
        returnTo: sanitizeReturnTo(returnTo ?? resolvedPath, undefined, locale),
      });

      if (result.clearPrivateCache) {
        clearPrivateQueryCache(queryClient);
      }

      if (result.redirectPath) {
        router.replace(result.redirectPath);
      }

      return result.redirectPath;
    },
  };

  return (
    <NextIntlClientProvider locale={locale} messages={messages ?? null} timeZone="UTC">
      <QueryClientProvider client={queryClient}>
        <SessionFailureContext.Provider value={sessionFailureNotifier}>{children}</SessionFailureContext.Provider>
      </QueryClientProvider>
    </NextIntlClientProvider>
  );
}
