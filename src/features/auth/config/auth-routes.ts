import { evaluateAccessDecision, type AccessDecision } from "@/entities/session/access-decision";
import { readServerGuardContext, type ServerGuardContext } from "@/shared/auth/guards";
import { buildRedirectPath } from "@/shared/auth/redirect-state";
import {
  getLocalizedAuthPaths,
  getRouteAccessDefinition,
  isAuthPathname,
  isProtectedPathname,
  type AuthSurface,
  type LocalizedAuthPaths,
  type RouteAccessDefinition,
} from "@/shared/auth/route-access";
import type { SessionRole } from "@/shared/auth/session-schema";
import type { AppLocale } from "@/shared/i18n/config";

export type { AuthSurface, LocalizedAuthPaths, RouteAccessDefinition };

export type AuthRouteGuardResult = ServerGuardContext & {
  decision: AccessDecision;
  redirectPath: string | null;
};

export const representativeProtectedRoutePatterns = {
  user: "/{locale}",
  admin: "/{locale}/admin/users",
} as const;

export const roleFallbackRoutePatterns: Record<SessionRole, (typeof representativeProtectedRoutePatterns)[keyof typeof representativeProtectedRoutePatterns]> = {
  USER: representativeProtectedRoutePatterns.user,
  ADMIN: representativeProtectedRoutePatterns.admin,
};

export function resolveRoleFallbackPath(locale: AppLocale, role: SessionRole): string {
  const paths = getLocalizedAuthPaths(locale);

  return role === "ADMIN" ? paths.adminHome : paths.userHome;
}

export function createAuthRouteMetadata(locale: AppLocale, pathname: string) {
  return {
    paths: getLocalizedAuthPaths(locale),
    access: getRouteAccessDefinition(pathname),
  };
}

export function resolveDecisionRedirectPath(decision: AccessDecision): string | null {
  if (!decision.resolvedPath) {
    return null;
  }

  if (decision.outcome === "redirect-login") {
    return buildRedirectPath(decision.resolvedPath, decision.resolvedReturnTo);
  }

  return decision.resolvedPath;
}

export async function readRouteGuardResult({
  pathname,
  locale,
  returnTo,
}: {
  pathname: string;
  locale: AppLocale;
  returnTo?: string | null;
}): Promise<AuthRouteGuardResult> {
  const context = await readServerGuardContext({
    pathname,
    locale,
    returnTo: returnTo ?? null,
  });
  const decision = evaluateAccessDecision({
    session: context.session,
    routeAccess: context.routeAccess,
    locale,
    returnTo: context.returnTo,
    userHomePath: context.localizedPaths.userHome,
    adminHomePath: context.localizedPaths.adminHome,
    userLoginPath: context.localizedPaths.login,
    adminLoginPath: context.localizedPaths.adminLogin,
    forbiddenPath: context.localizedPaths.forbidden,
  });

  return {
    ...context,
    decision,
    redirectPath: resolveDecisionRedirectPath(decision),
  };
}

export { getLocalizedAuthPaths, getRouteAccessDefinition, isAuthPathname, isProtectedPathname };
