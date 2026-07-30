import { describe, expect, it } from "vitest";

import { mapCategoriesCollectionDtoToSummaries } from "@/entities/category";
import { discoveryCategoriesPartialCollectionFixture } from "@/../tests/fixtures/discovery/categories-fixtures";

describe("category mapper", () => {
  it("maps categories and derives id-backed slugs while ignoring incomplete rows", () => {
    const categories = mapCategoriesCollectionDtoToSummaries(discoveryCategoriesPartialCollectionFixture);

    expect(categories).toEqual([
      {
        id: 7,
        name: "Science Fiction",
        slug: "science-fiction-7",
        artwork: null,
      },
    ]);
  });
});