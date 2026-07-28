import { describe, expect, it } from "vitest";

import {
  applyDiscoverySearchPatch,
  createDiscoverySearchParams,
  discoveryListQuerySchema,
  discoveryQueryKeys,
  normalizeDiscoverySearchParams,
  recommendationQuerySchema,
} from "@/features/discovery/model";

describe("discovery query foundations", () => {
  it("coerces string query inputs at the route boundary", () => {
    const parsed = discoveryListQuerySchema.parse({
      q: "  Left Hand of Darkness  ",
      categoryId: "7",
      authorId: "21",
      minRating: "4",
      page: "2",
      limit: "24",
    });

    expect(parsed).toEqual({
      q: "Left Hand of Darkness",
      categoryId: 7,
      authorId: 21,
      minRating: 4,
      page: 2,
      limit: 24,
    });
  });

  it("applies recommendation defaults while preserving a valid mode", () => {
    expect(recommendationQuerySchema.parse({ categoryId: "7" })).toEqual({
      by: "rating",
      categoryId: 7,
      page: 1,
      limit: 8,
    });

    expect(recommendationQuerySchema.parse({ by: "popular", page: "3" })).toEqual({
      by: "popular",
      page: 3,
      limit: 8,
    });
  });

  it("normalizes bookmarkable search params and strips invalid values", () => {
    const params = new URLSearchParams([
      ["q", "  The  Left   Hand  "],
      ["categoryId", "abc"],
      ["authorId", "0"],
      ["minRating", "9"],
      ["page", "-2"],
      ["limit", ""],
    ]);

    expect(normalizeDiscoverySearchParams(params)).toEqual({
      q: "The Left Hand",
      categoryId: null,
      authorId: null,
      minRating: null,
      page: 1,
      limit: 12,
    });
  });

  it("resets page when a result-set filter changes", () => {
    const current = {
      q: "Left Hand",
      categoryId: 7,
      authorId: null,
      minRating: null,
      page: 4,
      limit: 12,
    };

    expect(applyDiscoverySearchPatch(current, { minRating: 5 })).toEqual({
      q: "Left Hand",
      categoryId: 7,
      authorId: null,
      minRating: 5,
      page: 1,
      limit: 12,
    });

    expect(applyDiscoverySearchPatch(current, { page: 2 })).toEqual({
      q: "Left Hand",
      categoryId: 7,
      authorId: null,
      minRating: null,
      page: 2,
      limit: 12,
    });
  });

  it("serializes only normalized non-default search params", () => {
    const params = createDiscoverySearchParams({
      q: "Left Hand",
      categoryId: 7,
      authorId: null,
      minRating: 4,
      page: 1,
      limit: 12,
    });

    expect(params.toString()).toBe("q=Left+Hand&categoryId=7&minRating=4");
  });

  it("creates stable query keys from normalized discovery input", () => {
    expect(discoveryQueryKeys.books.list({ q: "  Ursula   K.   Le Guin  ", categoryId: 7, minRating: 4 })).toEqual([
      "books",
      "list",
      {
        q: "Ursula K. Le Guin",
        categoryId: 7,
        minRating: 4,
        page: 1,
        limit: 12,
      },
    ]);

    expect(discoveryQueryKeys.authors.books(21, { page: 2 })).toEqual([
      "authors",
      "books",
      {
        authorId: 21,
        page: 2,
        limit: 2,
      },
    ]);
  });
});