import { describe, expect, it } from "vitest";

import { parseLoginResponseDto } from "@/features/auth/model/login-response";

describe("login response parser", () => {
  it("accepts the documented direct login response shape", () => {
    expect(
      parseLoginResponseDto({
        token: "plain-token",
        user: {
          id: 2,
          name: "Admin Lib",
          email: "admin@library.local",
          role: "ADMIN",
        },
      }),
    ).toEqual({
      token: "plain-token",
      user: {
        id: 2,
        name: "Admin Lib",
        email: "admin@library.local",
        role: "ADMIN",
      },
    });
  });

  it("accepts the live backend login envelope and normalizes it", () => {
    expect(
      parseLoginResponseDto({
        success: true,
        message: "Logged in",
        data: {
          token: "live-token",
          user: {
            id: 2,
            name: "Admin Lib",
            email: "admin@library.local",
            phone: "1234343434",
            profilePhoto: "https://images.example.test/admin.png",
            role: "ADMIN",
          },
        },
      }),
    ).toEqual({
      token: "live-token",
      user: {
        id: 2,
        name: "Admin Lib",
        email: "admin@library.local",
        role: "ADMIN",
      },
    });
  });
});