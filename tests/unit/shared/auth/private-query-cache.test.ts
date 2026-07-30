import { describe, expect, it } from "vitest";

import { clearPrivateQueryCache, isPrivateQueryKey } from "@/shared/auth/private-query-cache";
import { createTestQueryClient } from "@/shared/test/create-test-query-client";

describe("private query cache", () => {
  it("recognizes configured private query roots", () => {
    expect(isPrivateQueryKey(["cart", "detail"])).toBe(true);
    expect(isPrivateQueryKey(["auth-session", "en"])).toBe(true);
    expect(isPrivateQueryKey(["admin-users", { page: 1 }])).toBe(true);
    expect(isPrivateQueryKey(["books", { page: 1 }])).toBe(false);
  });

  it("removes only private queries from the query client cache", () => {
    const client = createTestQueryClient();

    client.setQueryData(["books", { page: 1 }], ["public"]);
    client.setQueryData(["auth-session", "en"], { status: "authenticated" });
    client.setQueryData(["cart", "detail"], ["private-user"]);
    client.setQueryData(["admin-users", { page: 1 }], ["private-admin"]);

    const clearedCount = clearPrivateQueryCache(client);

    expect(clearedCount).toBe(3);
    expect(client.getQueryData(["books", { page: 1 }])).toEqual(["public"]);
    expect(client.getQueryData(["auth-session", "en"])).toBeUndefined();
    expect(client.getQueryData(["cart", "detail"])).toBeUndefined();
    expect(client.getQueryData(["admin-users", { page: 1 }])).toBeUndefined();
  });
});
