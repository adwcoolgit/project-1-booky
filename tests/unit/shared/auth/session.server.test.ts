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

import { processSessionReadRequest } from "@/app/api/auth/session/route";
import {
  readClientSessionSnapshot,
  readSessionLocale,
  readSessionState,
} from "@/shared/auth/session.server";
import { runtimeConfig } from "@/shared/config/runtime";
import { createEncodedSessionCookieFixture } from "@/../tests/fixtures/auth/auth-fixtures";
import { unreadableSessionCookieFixture } from "@/../tests/fixtures/auth/session-state-fixtures";

describe("session server utilities", () => {
  beforeEach(() => {
    cookieStore.reset();
  });

  it("returns an authenticated client snapshot from the server-only cookie", async () => {
    cookieStore.seed(runtimeConfig.authSessionCookieName, createEncodedSessionCookieFixture("ADMIN", "id"));

    await expect(readClientSessionSnapshot("id")).resolves.toEqual({
      status: "authenticated",
      user: {
        id: 1,
        name: "Booky Admin",
        email: "admin@booky.test",
        role: "ADMIN",
      },
      locale: "id",
    });
  });

  it("treats unreadable session cookies as guest state on server renders", async () => {
    cookieStore.seed(runtimeConfig.authSessionCookieName, unreadableSessionCookieFixture);

    await expect(readSessionState("en")).resolves.toEqual({
      status: "guest",
      locale: "en",
    });
    expect(cookieStore.delete).not.toHaveBeenCalled();
  });

  it("deletes unreadable session cookies on the local session read route", async () => {
    cookieStore.seed(runtimeConfig.authSessionCookieName, unreadableSessionCookieFixture);

    await expect(processSessionReadRequest()).resolves.toEqual({
      status: "guest",
    });
    expect(cookieStore.delete).toHaveBeenCalledWith(runtimeConfig.authSessionCookieName);
  });

  it("prefers the active locale cookie when reading session locale", async () => {
    cookieStore.seed(runtimeConfig.localeCookieName, "id");

    await expect(readSessionLocale("en")).resolves.toBe("id");
  });
});
