import { describe, expect, it } from "vitest";

import { resolveSessionFailureResult } from "@/shared/auth/session-failure";
import { getLocalizedAuthPaths } from "@/shared/auth/route-access";
import { sanitizeReturnTo } from "@/shared/auth/return-to";

describe("session failure handling", () => {
  it("clears the session and redirects to localized login on 401 without loops", () => {
    const paths = getLocalizedAuthPaths("en");
    const result = resolveSessionFailureResult({
      code: "unauthenticated",
      currentPath: "/en/cart",
      locale: "en",
      paths,
      loginSurface: "user",
      returnTo: sanitizeReturnTo("/en/cart"),
    });

    expect(result).toEqual({
      outcome: "clear-session-and-redirect-login",
      clearSession: true,
      clearPrivateCache: true,
      redirectPath: "/en/login?returnTo=%2Fen%2Fcart&reason=expired",
    });
  });

  it("suppresses redirects that would loop back to the current localized login path", () => {
    const paths = getLocalizedAuthPaths("en");
    const result = resolveSessionFailureResult({
      code: "unauthenticated",
      currentPath: "/en/login?returnTo=%2Fen%2Fcart&reason=expired",
      locale: "en",
      paths,
      loginSurface: "user",
      returnTo: sanitizeReturnTo("/en/cart"),
    });

    expect(result.redirectPath).toBeNull();
    expect(result.clearSession).toBe(true);
  });

  it("preserves the session and routes to forbidden on 403", () => {
    const paths = getLocalizedAuthPaths("id");
    const result = resolveSessionFailureResult({
      code: "forbidden",
      currentPath: "/id/admin/users",
      locale: "id",
      paths,
      loginSurface: "admin",
      returnTo: sanitizeReturnTo("/id/admin/users"),
    });

    expect(result).toEqual({
      outcome: "forbidden",
      clearSession: false,
      clearPrivateCache: false,
      redirectPath: "/id/forbidden",
    });
  });
});
