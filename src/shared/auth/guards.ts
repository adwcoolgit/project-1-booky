import "server-only";

import type { ProtectedRequestError } from "@/shared/api/server/protected-request";
import { resolveSessionFailureResult, type SessionFailureResult } from "@/shared/auth/session-failure";
import {
  canRoleAccessRequirement,
  getLocalizedAuthPaths,
  getRouteAccessDefinition,
  type AuthSurface,
  type LocalizedAuthPaths,
  type RouteAccessDefinition,
} from "@/shared/auth/route-access";
import { sanitizeReturnTo, type SanitizedReturnDestination } from "@/shared/auth/return-to";
import { readSessionState } from "@/shared/auth/session.server";
import type { SessionState } from "@/shared/auth/session-schema";
import type { AppLocale } from "@/shared/i18n/config";

export type ServerGuardContext = {
  session: SessionState;
  routeAccess: RouteAccessDefinition;
  localizedPaths: LocalizedAuthPaths;
  returnTo: SanitizedReturnDestination | null;
};

export function canSessionAccessRoute(session: SessionState, routeAccess: RouteAccessDefinition): boolean {
  if (!routeAccess.isProtected) {
    return true;
  }

  if (session.status === "guest") {
    return false;
  }

  return canRoleAccessRequirement(session.role, routeAccess.requirement, routeAccess.allowAdmin);
}

export async function readServerGuardContext({
  pathname,
  locale,
  returnTo,
}: {
  pathname: string;
  locale: AppLocale;
  returnTo?: string | null;
}): Promise<ServerGuardContext> {
  return {
    session: await readSessionState(locale),
    routeAccess: getRouteAccessDefinition(pathname),
    localizedPaths: getLocalizedAuthPaths(locale),
    returnTo: sanitizeReturnTo(returnTo ?? null, undefined, locale),
  };
}

export function resolveProtectedRequestFailure({
  error,
  pathname,
  locale,
  returnTo,
  loginSurface,
}: {
  error: ProtectedRequestError;
  pathname: string;
  locale: AppLocale;
  returnTo?: string | null;
  loginSurface?: AuthSurface | null;
}): SessionFailureResult {
  return resolveSessionFailureResult({
    code: error.httpError.code,
    currentPath: pathname,
    locale,
    paths: getLocalizedAuthPaths(locale),
    ...(loginSurface === undefined ? {} : { loginSurface }),
    returnTo: sanitizeReturnTo(returnTo ?? pathname, undefined, locale),
  });
}
