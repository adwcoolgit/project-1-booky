import { NextResponse } from "next/server";

import type { AuthSurface } from "@/features/auth/config/auth-routes";
import { logoutSuccessResultSchema, type LogoutSuccessResult } from "@/features/auth/model/login-outcome";
import { assertAllowedOrigin } from "@/shared/auth/origin";
import { buildRedirectPath } from "@/shared/auth/redirect-state";
import { getLocalizedAuthPaths } from "@/shared/auth/route-access";
import { sanitizeReturnTo } from "@/shared/auth/return-to";
import { deleteSessionEnvelope, readSessionLocale } from "@/shared/auth/session.server";
import { resolveLocale } from "@/shared/i18n/config";

export type LogoutRouteResult = {
  status: number;
  body: LogoutSuccessResult;
};

type LogoutReason = "logged-out" | "expired";

function resolveSurface(value: string | null): AuthSurface {
  return value === "admin" ? "admin" : "user";
}

function resolveReason(value: string | null): LogoutReason {
  return value === "expired" ? "expired" : "logged-out";
}

function createLogoutSuccess({
  locale,
  surface,
  returnTo,
  reason,
}: {
  locale: string;
  surface: AuthSurface;
  returnTo: string | null;
  reason: LogoutReason;
}): LogoutSuccessResult {
  const paths = getLocalizedAuthPaths(resolveLocale(locale));
  const loginPath = surface === "admin" ? paths.adminLogin : paths.login;

  return logoutSuccessResultSchema.parse({
    status: "logged-out",
    redirectTo: buildRedirectPath(loginPath, returnTo, reason),
  });
}

export async function processLogoutRequest(
  request: Request,
  dependencies: {
    assertAllowedOrigin?: (origin: string | null | undefined) => void;
    deleteSessionEnvelope?: () => Promise<void>;
  } = {},
): Promise<LogoutRouteResult> {
  const deps = {
    assertAllowedOrigin,
    deleteSessionEnvelope,
    ...dependencies,
  };
  const requestUrl = new URL(request.url);
  const requestedLocale = requestUrl.searchParams.get("locale");
  const locale = await readSessionLocale(resolveLocale(requestedLocale ?? undefined));
  const surface = resolveSurface(requestUrl.searchParams.get("surface"));
  const reason = resolveReason(requestUrl.searchParams.get("reason"));
  const requestedReturnTo = requestUrl.searchParams.get("returnTo");
  const returnTo = sanitizeReturnTo(requestedReturnTo, undefined, locale)?.href ?? null;

  deps.assertAllowedOrigin(request.headers.get("origin"));
  await deps.deleteSessionEnvelope();

  return {
    status: 200,
    body: createLogoutSuccess({
      locale,
      surface,
      returnTo,
      reason,
    }),
  };
}

export async function POST(request: Request) {
  const result = await processLogoutRequest(request);

  return NextResponse.json(result.body, { status: result.status });
}
