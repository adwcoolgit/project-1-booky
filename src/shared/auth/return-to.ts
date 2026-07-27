import { runtimeConfig } from "@/shared/config/runtime";
import { getPathLocale, getRouteAccessDefinition, type RouteAccessRequirement } from "@/shared/auth/route-access";
import type { AppLocale } from "@/shared/i18n/config";

export type SanitizedReturnDestination = {
  href: string;
  pathname: string;
  search: string;
  hash: string;
  locale: AppLocale;
  requiredAccess: Extract<RouteAccessRequirement, "USER" | "ADMIN" | "AUTHENTICATED">;
};

function normalizeCandidateUrl(value: string, appUrl: string): URL | null {
  try {
    if (value.startsWith("/")) {
      return new URL(value, appUrl);
    }

    return new URL(value);
  } catch {
    return null;
  }
}

export function sanitizeReturnTo(
  value: string | null | undefined,
  appUrl: string = runtimeConfig.appUrl,
  expectedLocale?: AppLocale,
): SanitizedReturnDestination | null {
  if (!value) {
    return null;
  }

  const candidate = normalizeCandidateUrl(value, appUrl);

  if (!candidate || candidate.origin !== new URL(appUrl).origin) {
    return null;
  }

  const locale = getPathLocale(candidate.pathname);

  if (!locale) {
    return null;
  }

  if (expectedLocale && locale !== expectedLocale) {
    return null;
  }

  const access = getRouteAccessDefinition(candidate.pathname);

  if (access.isAuthPage || !access.isProtected) {
    return null;
  }

  if (
    access.requirement !== "USER" &&
    access.requirement !== "ADMIN" &&
    access.requirement !== "AUTHENTICATED"
  ) {
    return null;
  }

  return {
    href: `${candidate.pathname}${candidate.search}${candidate.hash}`,
    pathname: candidate.pathname,
    search: candidate.search,
    hash: candidate.hash,
    locale,
    requiredAccess: access.requirement,
  };
}

export function isAuthorizedReturnDestination(
  role: "USER" | "ADMIN",
  destination: SanitizedReturnDestination | null | undefined,
): boolean {
  if (!destination) {
    return false;
  }

  if (destination.requiredAccess === "AUTHENTICATED") {
    return true;
  }

  return destination.requiredAccess === role;
}
