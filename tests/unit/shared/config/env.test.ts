import { describe, expect, it } from "vitest";

import { getPublicEnv, getServerEnv } from "@/shared/config/env";

describe("environment parsing", () => {
  it("uses documented defaults for the public runtime", () => {
    expect(getPublicEnv({})).toEqual({
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
      NEXT_PUBLIC_API_BASE_URL: "https://library-backend-production-b9cf.up.railway.app/api",
    });
  });

  it("rejects invalid public URLs", () => {
    expect(() =>
      getPublicEnv({
        NEXT_PUBLIC_APP_URL: "not-a-url",
        NEXT_PUBLIC_API_BASE_URL: "https://library-backend-production-b9cf.up.railway.app/api",
      }),
    ).toThrow();
  });

  it("allows server overrides without inventing new variables", () => {
    expect(
      getServerEnv({
        NODE_ENV: "production",
        APP_URL: "https://booky.example.com",
        API_BASE_URL: "https://booky.example.com/api",
      }),
    ).toEqual({
      NODE_ENV: "production",
      APP_URL: "https://booky.example.com",
      API_BASE_URL: "https://booky.example.com/api",
      AUTH_SESSION_COOKIE_NAME: "BOOKY_SESSION",
    });
  });

  it("normalizes boolean env values with surrounding whitespace", () => {
    expect(
      getServerEnv({
        AUTH_SESSION_COOKIE_SECURE: " true ",
        AUTH_E2E_FIXTURE_MODE: " false ",
      }),
    ).toMatchObject({
      AUTH_SESSION_COOKIE_SECURE: true,
      AUTH_E2E_FIXTURE_MODE: false,
    });
  });
});