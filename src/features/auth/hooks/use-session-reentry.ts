"use client";

import { useEffect, useRef, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { parseLogoutSuccessResult, resolvePostLoginRedirect } from "@/features/auth/model/login-outcome";
import { logoutWithBff, readSessionSnapshotFromBff } from "@/shared/api/bff/auth-client";
import { sanitizeReturnTo } from "@/shared/auth/return-to";
import type { AppLocale } from "@/shared/i18n/config";
import type { AuthSurface } from "@/shared/auth/route-access";

export function useSessionReentry({
  locale,
  returnTo,
  surface,
  reason,
}: {
  locale: AppLocale;
  returnTo?: string | undefined;
  surface: AuthSurface;
  reason?: string | undefined;
}) {
  const router = useRouter();
  const cleanupStartedRef = useRef(false);
  const [expiredCleanupComplete, setExpiredCleanupComplete] = useState(reason !== "expired");
  const sessionQuery = useQuery({
    queryKey: ["auth-session", locale],
    queryFn: readSessionSnapshotFromBff,
    retry: false,
    staleTime: 0,
    enabled: expiredCleanupComplete,
  });

  useEffect(() => {
    if (reason !== "expired" || cleanupStartedRef.current) {
      return;
    }

    cleanupStartedRef.current = true;

    void logoutWithBff({
      locale,
      surface,
      ...(returnTo === undefined ? {} : { returnTo }),
      reason: "expired",
    })
      .then((result) => {
        const parsed = parseLogoutSuccessResult(result);
        router.replace(parsed.redirectTo);
      })
      .finally(() => {
        setExpiredCleanupComplete(true);
      });
  }, [locale, reason, returnTo, router, surface]);

  useEffect(() => {
    if (reason === "expired") {
      return;
    }

    if (sessionQuery.data?.status !== "authenticated") {
      return;
    }

    router.replace(
      resolvePostLoginRedirect({
        locale,
        role: sessionQuery.data.user.role,
        returnTo: sanitizeReturnTo(returnTo, undefined, locale),
      }),
    );
  }, [locale, reason, returnTo, router, sessionQuery.data]);

  return sessionQuery;
}
