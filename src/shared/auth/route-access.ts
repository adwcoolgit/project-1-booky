import { isSupportedLocale, type AppLocale } from "@/shared/i18n/config";

export const routeKinds = ["guest-only", "user-only", "admin-only", "shared"] as const;
export type RouteKind = (typeof routeKinds)[number];

export const routeAccessRequirements = ["public", "guest", "USER", "ADMIN", "AUTHENTICATED"] as const;
export type RouteAccessRequirement = (typeof routeAccessRequirements)[number];

export const authSurfaces = ["user", "admin"] as const;
export type AuthSurface = (typeof authSurfaces)[number];

export type LocalizedAuthPaths = {
  login: string;
  register: string;
  adminLogin: string;
  forbidden: string;
  userHome: string;
  adminHome: string;
};

export type RouteAccessDefinition = {
  kind: RouteKind;
  requirement: RouteAccessRequirement;
  isProtected: boolean;
  isAuthPage: boolean;
  loginSurface: AuthSurface | null;
  allowAdmin: boolean;
};

function splitPathname(pathname: string) {
  const normalizedPathname = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const segments = normalizedPathname.split("/").filter(Boolean);
  const localeCandidate = segments[0];

  if (!localeCandidate || !isSupportedLocale(localeCandidate)) {
    return {
      locale: null,
      normalizedPathname,
      segments,
      remainder: "/",
    };
  }

  const remainderSegments = segments.slice(1);
  const remainder = remainderSegments.length > 0 ? `/${remainderSegments.join("/")}` : "/";

  return {
    locale: localeCandidate,
    normalizedPathname,
    segments,
    remainder,
  };
}

export function getLocalizedAuthPaths(locale: AppLocale): LocalizedAuthPaths {
  return {
    login: `/${locale}/login`,
    register: `/${locale}/register`,
    adminLogin: `/${locale}/admin/login`,
    forbidden: `/${locale}/forbidden`,
    userHome: `/${locale}`,
    adminHome: `/${locale}/admin/users`,
  };
}

export function getPathLocale(pathname: string): AppLocale | null {
  return splitPathname(pathname).locale;
}

export function isLocalePrefixedPathname(pathname: string): boolean {
  return getPathLocale(pathname) !== null;
}

export function getRouteAccessDefinition(pathname: string): RouteAccessDefinition {
  const { remainder } = splitPathname(pathname);

  if (remainder === "/") {
    return {
      kind: "shared",
      requirement: "public",
      isProtected: false,
      isAuthPage: false,
      loginSurface: null,
      allowAdmin: true,
    };
  }

  if (remainder === "/login" || remainder === "/register") {
    return {
      kind: "guest-only",
      requirement: "guest",
      isProtected: false,
      isAuthPage: true,
      loginSurface: "user",
      allowAdmin: false,
    };
  }

  if (remainder === "/admin/login") {
    return {
      kind: "guest-only",
      requirement: "guest",
      isProtected: false,
      isAuthPage: true,
      loginSurface: "admin",
      allowAdmin: false,
    };
  }

  if (remainder === "/forbidden") {
    return {
      kind: "shared",
      requirement: "AUTHENTICATED",
      isProtected: true,
      isAuthPage: false,
      loginSurface: "user",
      allowAdmin: true,
    };
  }

  if (remainder.startsWith("/foundation/")) {
    const area = remainder.replace("/foundation/", "").split("/")[0];

    if (area === "public") {
      return {
        kind: "shared",
        requirement: "public",
        isProtected: false,
        isAuthPage: false,
        loginSurface: null,
        allowAdmin: true,
      };
    }

    if (area === "user") {
      return {
        kind: "user-only",
        requirement: "USER",
        isProtected: true,
        isAuthPage: false,
        loginSurface: "user",
        allowAdmin: false,
      };
    }

    if (area === "admin") {
      return {
        kind: "admin-only",
        requirement: "ADMIN",
        isProtected: true,
        isAuthPage: false,
        loginSurface: "admin",
        allowAdmin: false,
      };
    }
  }

  if (remainder.startsWith("/admin")) {
    return {
      kind: "admin-only",
      requirement: "ADMIN",
      isProtected: true,
      isAuthPage: false,
      loginSurface: "admin",
      allowAdmin: false,
    };
  }

  if (isLocalePrefixedPathname(pathname)) {
    return {
      kind: "user-only",
      requirement: "USER",
      isProtected: true,
      isAuthPage: false,
      loginSurface: "user",
      allowAdmin: false,
    };
  }

  return {
    kind: "shared",
    requirement: "public",
    isProtected: false,
    isAuthPage: false,
    loginSurface: null,
    allowAdmin: true,
  };
}

export function isAuthPathname(pathname: string): boolean {
  return getRouteAccessDefinition(pathname).isAuthPage;
}

export function isProtectedPathname(pathname: string): boolean {
  return getRouteAccessDefinition(pathname).isProtected;
}

export function canRoleAccessRequirement(
  role: "USER" | "ADMIN",
  requirement: RouteAccessRequirement,
  allowAdmin = false,
): boolean {
  if (requirement === "public" || requirement === "AUTHENTICATED") {
    return true;
  }

  if (requirement === "USER") {
    return role === "USER" || (role === "ADMIN" && allowAdmin);
  }

  if (requirement === "ADMIN") {
    return role === "ADMIN";
  }

  return false;
}
