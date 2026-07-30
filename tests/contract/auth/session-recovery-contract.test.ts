import { beforeEach, describe, expect, it, vi } from "vitest";

const { cookieStore } = vi.hoisted(() => {
  const values = new Map<string, string>();

  return {
    cookieStore: {
      get: vi.fn((name: string) => {
        const value = values.get(name);

        return value ? { value } : undefined;
      }),
      set: vi.fn((name: string, value: string) => {
        values.set(name, value);
      }),
      delete: vi.fn((name: string) => {
        values.delete(name);
      }),
      reset() {
        values.clear();
        this.get.mockClear();
        this.set.mockClear();
        this.delete.mockClear();
      },
      seed(name: string, value: string) {
        values.set(name, value);
      },
    },
  };
});

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => Promise.resolve(cookieStore)),
}));

import { processLogoutRequest } from "@/app/api/auth/logout/route";
import { processSessionReadRequest } from "@/app/api/auth/session/route";
import { createAuthenticatedServerClientFromEnvelope } from "@/shared/api/server/authenticated-client";
import { executeProtectedRequest } from "@/shared/api/server/protected-request";
import { runtimeConfig } from "@/shared/config/runtime";
import {
  createEncodedSessionCookieFixture,
  createSessionEnvelopeFixture,
} from "@/../tests/fixtures/auth/auth-fixtures";
import {
  authenticatedAdminSessionSnapshotFixture,
  guestSessionSnapshotFixture,
  unreadableSessionCookieFixture,
} from "@/../tests/fixtures/auth/session-state-fixtures";
import { protectedForbiddenToken, protectedUnauthorizedToken } from "@/../tests/fixtures/auth/protected-route-fixtures";

describe("session recovery contract", () => {
  beforeEach(() => {
    cookieStore.reset();
  });

  it("reads authenticated and guest session snapshots without exposing the JWT", async () => {
    cookieStore.seed(runtimeConfig.authSessionCookieName, createEncodedSessionCookieFixture("ADMIN", "id"));
    cookieStore.seed(runtimeConfig.localeCookieName, "id");

    await expect(processSessionReadRequest()).resolves.toEqual(authenticatedAdminSessionSnapshotFixture);

    cookieStore.reset();
    cookieStore.seed(runtimeConfig.authSessionCookieName, unreadableSessionCookieFixture);

    await expect(processSessionReadRequest()).resolves.toEqual(guestSessionSnapshotFixture);
    expect(cookieStore.delete).toHaveBeenCalledWith(runtimeConfig.authSessionCookieName);
  });

  it("clears the local session and returns a localized logout redirect", async () => {
    const deleteSessionEnvelope = vi.fn(() => Promise.resolve(undefined));
    const assertAllowedOrigin = vi.fn();
    const request = new Request("http://localhost:3000/api/auth/logout?locale=id&surface=admin&returnTo=%2Fid%2Fadmin%2Fusers", {
      method: "POST",
      headers: {
        origin: "http://localhost:3000",
      },
    });

    const result = await processLogoutRequest(request, {
      assertAllowedOrigin,
      deleteSessionEnvelope,
    });

    expect(assertAllowedOrigin).toHaveBeenCalledWith("http://localhost:3000");
    expect(deleteSessionEnvelope).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      status: 200,
      body: {
        status: "logged-out",
        redirectTo: "/id/admin/login?returnTo=%2Fid%2Fadmin%2Fusers&reason=logged-out",
      },
    });
  });

  it("normalizes protected 401 responses into session-ended failures", async () => {
    const client = createAuthenticatedServerClientFromEnvelope({
      ...createSessionEnvelopeFixture("USER", "en"),
      jwt: protectedUnauthorizedToken,
    });

    await expect(executeProtectedRequest(() => client.get("/me"))).rejects.toMatchObject({
      failureType: "session-ended",
      httpError: {
        code: "unauthenticated",
        status: 401,
      },
    });
  });

  it("normalizes protected 403 responses into forbidden failures", async () => {
    const client = createAuthenticatedServerClientFromEnvelope({
      ...createSessionEnvelopeFixture("ADMIN", "id"),
      jwt: protectedForbiddenToken,
    });

    await expect(executeProtectedRequest(() => client.get("/me"))).rejects.toMatchObject({
      failureType: "forbidden",
      httpError: {
        code: "forbidden",
        status: 403,
      },
    });
  });
});
