import type { RouteAccessDefinition, RouteKind } from "@/shared/auth/route-access";
import { canRoleAccessRequirement } from "@/shared/auth/route-access";
import { isAuthorizedReturnDestination, type SanitizedReturnDestination } from "@/shared/auth/return-to";
import type { AppLocale } from "@/shared/i18n/config";
import type { SessionRole, SessionState } from "@/entities/session/model";

export const accessOutcomes = [
  "allow",
  "redirect-login",
  "redirect-authorized-home",
  "forbidden",
  "clear-session-and-redirect-login",
] as const;
export type AccessOutcome = (typeof accessOutcomes)[number];

export type AccessDecision = {
  routeKind: RouteKind;
  outcome: AccessOutcome;
  resolvedPath: string | null;
  resolvedReturnTo: string | null;
};

function resolveAuthorizedHomePath(
  role: SessionRole,
  paths: {
    userHomePath: string;
    adminHomePath: string;
  },
): string {
  return role === "ADMIN" ? paths.adminHomePath : paths.userHomePath;
}

export function resolveAuthorizedDestination({
  role,
  returnTo,
  userHomePath,
  adminHomePath,
}: {
  role: SessionRole;
  returnTo: SanitizedReturnDestination | null | undefined;
  userHomePath: string;
  adminHomePath: string;
}): string {
  if (returnTo && isAuthorizedReturnDestination(role, returnTo)) {
    return returnTo.href;
  }

  return resolveAuthorizedHomePath(role, {
    userHomePath,
    adminHomePath,
  });
}

export function evaluateAccessDecision({
  session,
  routeAccess,
  locale,
  returnTo,
  userHomePath,
  adminHomePath,
  userLoginPath,
  adminLoginPath,
  forbiddenPath,
}: {
  session: SessionState;
  routeAccess: RouteAccessDefinition;
  locale: AppLocale;
  returnTo: SanitizedReturnDestination | null | undefined;
  userHomePath: string;
  adminHomePath: string;
  userLoginPath: string;
  adminLoginPath: string;
  forbiddenPath: string;
}): AccessDecision {
  if (routeAccess.kind === "guest-only") {
    if (session.status === "guest") {
      return {
        routeKind: routeAccess.kind,
        outcome: "allow",
        resolvedPath: null,
        resolvedReturnTo: null,
      };
    }

    return {
      routeKind: routeAccess.kind,
      outcome: "redirect-authorized-home",
      resolvedPath: resolveAuthorizedDestination({
        role: session.role,
        returnTo,
        userHomePath,
        adminHomePath,
      }),
      resolvedReturnTo: null,
    };
  }

  if (routeAccess.kind === "shared") {
    if (!routeAccess.isProtected || session.status === "authenticated") {
      return {
        routeKind: routeAccess.kind,
        outcome: "allow",
        resolvedPath: null,
        resolvedReturnTo: null,
      };
    }

    return {
      routeKind: routeAccess.kind,
      outcome: "redirect-login",
      resolvedPath: userLoginPath,
      resolvedReturnTo: returnTo?.href ?? null,
    };
  }

  if (session.status === "guest") {
    return {
      routeKind: routeAccess.kind,
      outcome: "redirect-login",
      resolvedPath: routeAccess.loginSurface === "admin" ? adminLoginPath : userLoginPath,
      resolvedReturnTo: returnTo?.href ?? `/${locale}`,
    };
  }

  if (canRoleAccessRequirement(session.role, routeAccess.requirement, routeAccess.allowAdmin)) {
    return {
      routeKind: routeAccess.kind,
      outcome: "allow",
      resolvedPath: null,
      resolvedReturnTo: null,
    };
  }

  return {
    routeKind: routeAccess.kind,
    outcome: "forbidden",
    resolvedPath: forbiddenPath,
    resolvedReturnTo: null,
  };
}
