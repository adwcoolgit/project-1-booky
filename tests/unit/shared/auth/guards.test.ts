import { beforeEach, describe, expect, it, vi } from "vitest";

const { readSessionStateMock } = vi.hoisted(() => ({
  readSessionStateMock: vi.fn(),
}));

vi.mock("@/shared/auth/session.server", () => ({
  readSessionState: readSessionStateMock,
}));

import { readRouteGuardResult, resolveDecisionRedirectPath } from "@/features/auth/config/auth-routes";
import { createAuthenticatedSession, createGuestSession } from "@/shared/auth/session-schema";
import { createSessionEnvelopeFixture } from "@/../tests/fixtures/auth/auth-fixtures";

describe("server route guards", () => {
  beforeEach(() => {
    readSessionStateMock.mockReset();
  });

  it("builds a localized login redirect with a sanitized returnTo for guests", async () => {
    readSessionStateMock.mockResolvedValue(createGuestSession("id"));

    const result = await readRouteGuardResult({
      pathname: "/id/admin/users",
      locale: "id",
      returnTo: "/id/admin/users?page=2",
    });

    expect(result.redirectPath).toBe("/id/admin/login?returnTo=%2Fid%2Fadmin%2Fusers%3Fpage%3D2");
    expect(result.returnTo?.href).toBe("/id/admin/users?page=2");
  });

  it("drops cross-locale returnTo values instead of replaying them", async () => {
    readSessionStateMock.mockResolvedValue(createGuestSession("id"));

    const result = await readRouteGuardResult({
      pathname: "/id/admin/users",
      locale: "id",
      returnTo: "/en/admin/users",
    });

    expect(result.returnTo).toBeNull();
    expect(result.redirectPath).toBe("/id/admin/login?returnTo=%2Fid");
  });

  it("resolves localized forbidden redirects for unauthorized authenticated sessions", async () => {
    readSessionStateMock.mockResolvedValue(createAuthenticatedSession(createSessionEnvelopeFixture("USER", "en")));

    const result = await readRouteGuardResult({
      pathname: "/en/admin/users",
      locale: "en",
      returnTo: "/en/admin/users",
    });

    expect(result.decision.outcome).toBe("forbidden");
    expect(resolveDecisionRedirectPath(result.decision)).toBe("/en/forbidden");
  });
});


