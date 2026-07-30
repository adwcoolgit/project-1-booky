import { describe, expect, it } from "vitest";

import {
  createDiscoveryApiClient,
  categoriesCollectionDtoSchema,
  getCategories,
  getRecommendedBooks,
  recommendationsCollectionDtoSchema,
} from "@/features/discovery/api";
import { mapBooksCollectionDtoToPage, mapBooksCollectionDtoToSummaries } from "@/entities/book";
import { mapCategoriesCollectionDtoToSummaries } from "@/entities/category";
import {
  emptyHomeRecommendedBooksCollectionFixture,
  homeRecommendedBooksCollectionFixture,
} from "@/../tests/fixtures/discovery/books-fixtures";
import {
  emptyHomeCategoriesCollectionFixture,
  homeCategoriesCollectionFixture,
} from "@/../tests/fixtures/discovery/categories-fixtures";

describe("home discovery transport contract", () => {
  it("maps localized home categories and first-page recommendations from the shared adapters", async () => {
    const client = createDiscoveryApiClient("en");
    const categoriesPayload = await getCategories(client);
    const recommendationsPayload = await getRecommendedBooks(client, {
      by: "rating",
      page: 1,
      limit: 8,
    });
    const recommendationsPage = mapBooksCollectionDtoToPage(recommendationsPayload, 8);

    expect(categoriesPayload).toEqual(homeCategoriesCollectionFixture);
    expect(recommendationsPayload).toEqual(homeRecommendedBooksCollectionFixture);
    expect(mapCategoriesCollectionDtoToSummaries(categoriesPayload)).toEqual([
      {
        id: 7,
        name: "Science Fiction",
        slug: "science-fiction-7",
        artwork: null,
      },
      {
        id: 8,
        name: "History",
        slug: "history-8",
        artwork: null,
      },
      {
        id: 9,
        name: "Personal Growth",
        slug: "personal-growth-9",
        artwork: null,
      },
      {
        id: 10,
        name: "Philosophy",
        slug: "philosophy-10",
        artwork: null,
      },
    ]);
    expect(recommendationsPage.page).toBe(1);
    expect(recommendationsPage.limit).toBe(8);
    expect(recommendationsPage.hasMore).toBe(true);
    expect(recommendationsPage.items).toHaveLength(8);
    expect(mapBooksCollectionDtoToSummaries(recommendationsPayload)).toMatchObject([
      {
        id: 101,
        title: "The Left Hand of Darkness",
        authorName: "Ursula K. Le Guin",
        categoryName: "Science Fiction",
      },
      {
        id: 201,
        title: "Sapiens",
        authorName: "Yuval Noah Harari",
        categoryName: "History",
      },
      {
        id: 301,
        title: "Atomic Habits",
        authorName: "James Clear",
        categoryName: "Personal Growth",
      },
      {
        id: 401,
        title: "Meditations",
        authorName: "Marcus Aurelius",
        categoryName: "Philosophy",
      },
      {
        id: 102,
        title: "A Wizard of Earthsea",
        authorName: "Ursula K. Le Guin",
        categoryName: "Science Fiction",
      },
      {
        id: 103,
        title: "The Dispossessed",
        authorName: "Ursula K. Le Guin",
        categoryName: "Science Fiction",
      },
      {
        id: 202,
        title: "The Silk Roads",
        authorName: "Peter Frankopan",
        categoryName: "History",
      },
      {
        id: 302,
        title: "Deep Work",
        authorName: "Cal Newport",
        categoryName: "Personal Growth",
      },
    ]);
  });

  it("keeps empty home payloads safe for section-level empty states", () => {
    const categoriesPayload = categoriesCollectionDtoSchema.parse(emptyHomeCategoriesCollectionFixture);
    const recommendationsPayload = recommendationsCollectionDtoSchema.parse(emptyHomeRecommendedBooksCollectionFixture);

    expect(categoriesCollectionDtoSchema.parse(homeCategoriesCollectionFixture)).toEqual(homeCategoriesCollectionFixture);
    expect(recommendationsCollectionDtoSchema.parse(homeRecommendedBooksCollectionFixture)).toEqual(
      homeRecommendedBooksCollectionFixture,
    );
    expect(mapCategoriesCollectionDtoToSummaries(categoriesPayload)).toEqual([]);
    expect(mapBooksCollectionDtoToSummaries(recommendationsPayload)).toEqual([]);
  });
});