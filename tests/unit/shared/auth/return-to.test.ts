import { describe, expect, it } from "vitest";

import { isAuthorizedReturnDestination, sanitizeReturnTo } from "@/shared/auth/return-to";

describe("returnTo sanitization", () => {
  it("preserves same-origin localized paths with query and hash", () => {
    const destination = sanitizeReturnTo("/id/admin/users?page=2#summary", undefined, "id");

    expect(destination).toEqual({
      href: "/id/admin/users?page=2#summary",
      pathname: "/id/admin/users",
      search: "?page=2",
      hash: "#summary",
      locale: "id",
      requiredAccess: "ADMIN",
    });
  });

  it("rejects external and guest-only destinations", () => {
    expect(sanitizeReturnTo("https://example.com/en/admin/users", undefined, "en")).toBeNull();
    expect(sanitizeReturnTo("/en/login?returnTo=%2Fen%2Fadmin%2Fusers", undefined, "en")).toBeNull();
    expect(sanitizeReturnTo("/en/foundation/public", undefined, "en")).toBeNull();
  });

  it("rejects destinations that do not preserve the active locale", () => {
    expect(sanitizeReturnTo("/en/admin/users", undefined, "id")).toBeNull();
  });

  it("checks role authorization before replaying the destination", () => {
    const adminDestination = sanitizeReturnTo("/en/admin/users", undefined, "en");

    expect(isAuthorizedReturnDestination("ADMIN", adminDestination)).toBe(true);
    expect(isAuthorizedReturnDestination("USER", adminDestination)).toBe(false);
  });
});
