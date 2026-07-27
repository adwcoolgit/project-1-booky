import type { NormalizedErrorCode } from "@/shared/lib/errors/normalized-error";
import { buildRedirectPath, isRedirectLoop } from "@/shared/auth/redirect-state";
import type { AppLocale } from "@/shared/i18n/config";
import type { AuthSurface, LocalizedAuthPaths } from "@/shared/auth/route-access";
import type { SanitizedReturnDestination } from "@/shared/auth/return-to";

export type SessionFailureResult = {
  outcome: "clear-session-and-redirect-login" | "forbidden" | "ignore";
  clearSession: boolean;
  clearPrivateCache: boolean;
  redirectPath: string | null;
};

function resolveLoginBasePath(paths: LocalizedAuthPaths, surface: AuthSurface | null | undefined): string {
  return surface === "admin" ? paths.adminLogin : paths.login;
}

export function resolveSessionFailureResult({
  code,
  currentPath,
  paths,
  loginSurface,
  returnTo,
}: {
  code: NormalizedErrorCode;
  currentPath: string;
  locale: AppLocale;
  paths: LocalizedAuthPaths;
  loginSurface?: AuthSurface | null;
  returnTo?: SanitizedReturnDestination | null;
}): SessionFailureResult {
  if (code === "forbidden") {
    return {
      outcome: "forbidden",
      clearSession: false,
      clearPrivateCache: false,
      redirectPath: paths.forbidden,
    };
  }

  if (code !== "unauthenticated") {
    return {
      outcome: "ignore",
      clearSession: false,
      clearPrivateCache: false,
      redirectPath: null,
    };
  }

  const loginBasePath = resolveLoginBasePath(paths, loginSurface);
  const redirectPath = buildRedirectPath(loginBasePath, returnTo?.href ?? null, "expired");

  return {
    outcome: "clear-session-and-redirect-login",
    clearSession: true,
    clearPrivateCache: true,
    redirectPath: isRedirectLoop(currentPath, redirectPath) ? null : redirectPath,
  };
}
