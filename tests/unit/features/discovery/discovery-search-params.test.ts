import { describe, expect, it } from "vitest";

import {
  applyDiscoverySearchPatch,
  createDiscoverySearchParams,
  normalizeDiscoverySearchParams,
} from "@/features/discovery/model";

describe("discovery search params", () => {
  it("normalizes bookmarkable result-set params conservatively", () => {
    const normalized = normalizeDiscoverySearchParams({
      q: "  The   Left   Hand  ",
      categoryId: "7",
      authorId: "21",
      minRating: "4",
      page: "2",
      limit: "1",
      ignored: "value",
    });

    expect(normalized).toEqual({
      q: "The Left Hand",
      categoryId: 7,
      authorId: 21,
      minRating: 4,
      page: 2,
      limit: 1,
    });
  });

  it("drops invalid values and resets page when search criteria change", () => {
    const next = applyDiscoverySearchPatch(
      {
        q: "The Left Hand",
        categoryId: 7,
        authorId: null,
        minRating: 4,
        page: 3,
        limit: 12,
      },
      {
        q: "Sapiens",
        categoryId: null,
        minRating: null,
      },
    );

    expect(next).toEqual({
      q: "Sapiens",
      categoryId: null,
      authorId: null,
      minRating: null,
      page: 1,
      limit: 12,
    });
  });

  it("serializes normalized params without leaking defaults", () => {
    const query = createDiscoverySearchParams({
      q: "The Left Hand",
      categoryId: 7,
      authorId: 21,
      minRating: 4,
      page: 2,
      limit: 1,
    }).toString();

    expect(query).toBe("q=The+Left+Hand&categoryId=7&authorId=21&minRating=4&page=2&limit=1");
    expect(
      createDiscoverySearchParams({
        categoryId: null,
        authorId: null,
        minRating: null,
        page: 1,
        limit: 12,
      }).toString(),
    ).toBe("");
  });
});