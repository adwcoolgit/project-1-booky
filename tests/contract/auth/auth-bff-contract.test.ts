import { beforeEach, describe, expect, it } from "vitest";

import { processLoginRequest } from "@/app/api/auth/login/route";
import { processRegisterRequest } from "@/app/api/auth/register/route";
import {
  authTestCredentials,
  createLoginFormInputFixture,
  createRegisterFormInputFixture,
  readLastLoginPayload,
  readLastRegisterPayload,
  resetAuthFixtureState,
} from "@/../tests/fixtures/auth/auth-fixtures";

describe("auth BFF contract", () => {
  beforeEach(() => {
    resetAuthFixtureState();
  });

  it("forwards only documented register fields upstream and returns localized login redirect", async () => {
    const payload = createRegisterFormInputFixture("id");
    const result = await processRegisterRequest(payload, "http://localhost:3000");

    expect(result.status).toBe(201);
    expect(result.body).toEqual({
      status: "registered",
      redirectTo: "/id/login?registered=1",
    });
    expect(readLastRegisterPayload()).toEqual({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
    });
  });

  it("normalizes duplicate-like register failures without forwarding form-only fields", async () => {
    const payload = {
      ...createRegisterFormInputFixture("en"),
      email: authTestCredentials.duplicateRegisterEmail,
    };
    const result = await processRegisterRequest(payload, "http://localhost:3000");

    expect(result.status).toBe(400);
    expect(result.body).toMatchObject({
      status: "error",
      code: "duplicate",
    });

    if (result.body.status === "error") {
      expect(result.body.fieldErrors?.email).toEqual(expect.any(String));
    }

    expect(readLastRegisterPayload()).toEqual({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
    });
  });

  it("redirects USER login to the localized user experience", async () => {
    const result = await processLoginRequest(createLoginFormInputFixture("USER", "en", "user"), "http://localhost:3000");

    expect(result.status).toBe(200);
    expect(result.body).toMatchObject({
      status: "authenticated",
      redirectTo: "/en",
      user: {
        role: "USER",
      },
    });
    expect(result.sessionEnvelope?.role).toBe("USER");
    expect(readLastLoginPayload()).toEqual({
      email: authTestCredentials.user.email,
      password: authTestCredentials.user.password,
    });
  });

  it("redirects ADMIN login to the localized admin experience", async () => {
    const result = await processLoginRequest(createLoginFormInputFixture("ADMIN", "id", "user"), "http://localhost:3000");

    expect(result.status).toBe(200);
    expect(result.body).toMatchObject({
      status: "authenticated",
      redirectTo: "/id/admin/users",
      user: {
        role: "ADMIN",
      },
    });
    expect(result.sessionEnvelope?.role).toBe("ADMIN");
  });

  it("denies USER credentials on the admin surface without creating a session", async () => {
    const result = await processLoginRequest(createLoginFormInputFixture("USER", "en", "admin"), "http://localhost:3000");

    expect(result.status).toBe(403);
    expect(result.body).toMatchObject({
      status: "error",
      code: "surface-denied",
    });
    expect(result.sessionEnvelope).toBeUndefined();
  });

  it("keeps 401 login failures localized and deterministic", async () => {
    const result = await processLoginRequest(
      {
        email: "unknown@booky.test",
        password: "Password123!",
        surface: "user",
        surfaceLocale: "id",
      },
      "http://localhost:3000",
    );

    expect(result.status).toBe(401);
    expect(result.body).toMatchObject({
      status: "error",
      code: "unauthorized",
      message: "Email atau kata sandi salah.",
    });
  });
});
