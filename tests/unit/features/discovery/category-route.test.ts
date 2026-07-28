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

  it("pins the authoritative category id and drops unsupported route search params", () => {
    const normalized = normalizeCategoryRouteState(
      {
        q: "should be removed",
        categoryId: "9",
        authorId: "21",
        minRating: "4",
        page: "2",
        limit: "1",
      },
      scienceFiction,
    );

    expect(normalized).toEqual({
      q: undefined,
      categoryId: 7,
      authorId: null,
      minRating: 4,
      page: 2,
      limit: 1,
      slug: "science-fiction-7",
    });
  });

  it("serializes only the category-route URL state", () => {
    const query = createCategoryRouteSearchParams({
      minRating: 4,
      page: 2,
      limit: 1,
    }).toString();

    expect(query).toBe("minRating=4&page=2&limit=1");
    expect(
      createCategoryRouteSearchParams({
        minRating: null,
        page: 1,
        limit: 12,
      }).toString(),
    ).toBe("");
  });
});