import { describe, expect, it } from "vitest";

import type { CategorySummary } from "@/entities/category";
import {
  createCategoryRouteSearchParams,
  createCategorySlug,
  normalizeCategoryRouteState,
  resolveCategoryBySlug,
} from "@/features/discovery/model";

const scienceFiction: CategorySummary = {
  id: 7,
  name: "Science Fiction",
  slug: "science-fiction-7",
  artwork: null,
};

describe("category route helpers", () => {
  it("derives and resolves presentation-only slugs", () => {
    expect(createCategorySlug("Science Fiction", 7)).toBe("science-fiction-7");
    expect(resolveCategoryBySlug("science-fiction-7", [scienceFiction])).toEqual(scienceFiction);
    expect(resolveCategoryBySlug("unknown-99", [scienceFiction])).toBeNull();
  });

  it("pins the authoritative category id while preserving supported search params", () => {
    const normalized = normalizeCategoryRouteState(
      {
        q: "stay in category",
        categoryId: "9",
        authorId: "21",
        minRating: "4",
        page: "2",
        limit: "1",
      },
      scienceFiction,
    );

    expect(normalized).toEqual({
      q: "stay in category",
      categoryId: 7,
      authorId: null,
      selectedCategoryId: null,
      minRating: 4,
      page: 2,
      limit: 1,
      slug: "science-fiction-7",
    });
  });

  it("preserves the selected category marker when it matches the route category", () => {
    const normalized = normalizeCategoryRouteState(
      {
        q: "dune",
        categoryId: "7",
        minRating: "5",
      },
      scienceFiction,
    );

    expect(normalized.selectedCategoryId).toBe(7);
    expect(normalized.categoryId).toBe(7);
  });

  it("serializes only the supported category-route URL state", () => {
    const query = createCategoryRouteSearchParams({
      q: "left hand",
      selectedCategoryId: 7,
      minRating: 4,
      page: 2,
      limit: 1,
    }).toString();

    expect(query).toBe("q=left+hand&categoryId=7&minRating=4&page=2&limit=1");
    expect(
      createCategoryRouteSearchParams({
        q: undefined,
        selectedCategoryId: null,
        minRating: null,
        page: 1,
        limit: 12,
      }).toString(),
    ).toBe("");
  });
});
