import { describe, expect, it } from "vitest";

import { evaluateAccessDecision, resolveAuthorizedDestination } from "@/entities/session/access-decision";
import { createAuthenticatedSession, createGuestSession } from "@/shared/auth/session-schema";
import { getLocalizedAuthPaths, getRouteAccessDefinition } from "@/shared/auth/route-access";
import { sanitizeReturnTo } from "@/shared/auth/return-to";
import { createSessionEnvelopeFixture } from "@/../tests/fixtures/auth/auth-fixtures";

describe("session access decision", () => {
  const locale = "en" as const;
  const paths = getLocalizedAuthPaths(locale);

  it("redirects guests to localized admin login for admin-only routes", () => {
    const decision = evaluateAccessDecision({
      session: createGuestSession(locale),
      routeAccess: getRouteAccessDefinition(paths.adminHome),
      locale,
      returnTo: sanitizeReturnTo(paths.adminHome, undefined, locale),
      userHomePath: paths.userHome,
      adminHomePath: paths.adminHome,
      userLoginPath: paths.login,
      adminLoginPath: paths.adminLogin,
      forbiddenPath: paths.forbidden,
    });

    expect(decision).toEqual({
      routeKind: "admin-only",
      outcome: "redirect-login",
      resolvedPath: paths.adminLogin,
      resolvedReturnTo: paths.adminHome,
    });
  });

  it("returns localized forbidden for USER access to admin-only routes", () => {
    const session = createAuthenticatedSession(createSessionEnvelopeFixture("USER", locale));
    const decision = evaluateAccessDecision({
      session,
      routeAccess: getRouteAccessDefinition(paths.adminHome),
      locale,
      returnTo: sanitizeReturnTo(paths.adminHome, undefined, locale),
      userHomePath: paths.userHome,
      adminHomePath: paths.adminHome,
      userLoginPath: paths.login,
      adminLoginPath: paths.adminLogin,
      forbiddenPath: paths.forbidden,
    });

    expect(decision.outcome).toBe("forbidden");
    expect(decision.resolvedPath).toBe(paths.forbidden);
  });

  it("redirects authenticated ADMIN users away from guest-only login routes", () => {
    const session = createAuthenticatedSession(createSessionEnvelopeFixture("ADMIN", locale));
    const decision = evaluateAccessDecision({
      session,
      routeAccess: getRouteAccessDefinition(paths.login),
      locale,
      returnTo: sanitizeReturnTo(paths.adminHome, undefined, locale),
      userHomePath: paths.userHome,
      adminHomePath: paths.adminHome,
      userLoginPath: paths.login,
      adminLoginPath: paths.adminLogin,
      forbiddenPath: paths.forbidden,
    });

    expect(decision.outcome).toBe("redirect-authorized-home");
    expect(decision.resolvedPath).toBe(paths.adminHome);
  });

  it("replays a sanitized guest-route returnTo when the authenticated role is allowed", () => {
    const session = createAuthenticatedSession(createSessionEnvelopeFixture("USER", locale));
    const returnTo = sanitizeReturnTo("/en/reviews?tab=recent#latest", undefined, locale);
    const decision = evaluateAccessDecision({
      session,
      routeAccess: getRouteAccessDefinition(paths.login),
      locale,
      returnTo,
      userHomePath: paths.userHome,
      adminHomePath: paths.adminHome,
      userLoginPath: paths.login,
      adminLoginPath: paths.adminLogin,
      forbiddenPath: paths.forbidden,
    });

    expect(decision.outcome).toBe("redirect-authorized-home");
    expect(decision.resolvedPath).toBe("/en/reviews?tab=recent#latest");
  });

  it("falls back to the authorized landing path when returnTo is not allowed for the role", () => {
    const resolvedPath = resolveAuthorizedDestination({
      role: "USER",
      returnTo: sanitizeReturnTo(paths.adminHome, undefined, locale),
      userHomePath: paths.userHome,
      adminHomePath: paths.adminHome,
    });

    expect(resolvedPath).toBe(paths.userHome);
  });
});
