import { describe, expect, it } from "vitest";

import { createQueryClient, queryClientDefaults } from "@/shared/providers/query-client";
import { createTestQueryClient } from "@/shared/test/create-test-query-client";

describe("query client foundation", () => {
  it("applies shared runtime defaults", () => {
    const client = createQueryClient();

    expect(client.getDefaultOptions().queries).toMatchObject(queryClientDefaults.queries);
    expect(client.getDefaultOptions().mutations).toMatchObject(queryClientDefaults.mutations);
  });

  it("creates isolated test clients with retries disabled", () => {
    const firstClient = createTestQueryClient();
    const secondClient = createTestQueryClient();

    expect(firstClient).not.toBe(secondClient);
    expect(firstClient.getDefaultOptions().queries).toMatchObject({
      ...queryClientDefaults.queries,
      retry: false,
      gcTime: Infinity,
    });
    expect(firstClient.getDefaultOptions().mutations).toMatchObject(queryClientDefaults.mutations);
  });
});
