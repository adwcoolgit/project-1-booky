import { describe, expect, it } from "vitest";

import { mapBooksCollectionDtoToSummaries } from "@/entities/book";
import {
  createDiscoveryApiClient,
  extractCollectionItems,
  extractPaginationDto,
  getBooks,
} from "@/features/discovery/api";
import { createBooksCollectionFixture } from "@/../tests/fixtures/discovery/books-fixtures";

describe("books list transport contract", () => {
  it("maps normalized discovery query params through GET /books", async () => {
    const client = createDiscoveryApiClient("en");
    const payload = await getBooks(client, {
      q: "the",
      categoryId: 7,
      minRating: 4,
      page: 1,
      limit: 1,
    });
    const expected = createBooksCollectionFixture({
      q: "the",
      categoryId: 7,
      minRating: 4,
      page: 1,
      limit: 1,
    });
    const pagination = extractPaginationDto(payload);
    const items = extractCollectionItems<Record<string, unknown>>(payload, ["books"]);

    expect(pagination).toEqual(expected.pagination);
    expect(items).toEqual([
      expect.objectContaining({
        id: 101,
        title: "The Left Hand of Darkness",
        authorName: "Ursula K. Le Guin",
        categoryId: 7,
      }),
    ]);
    expect(Object.prototype.hasOwnProperty.call(items[0] ?? {}, "pageCount")).toBe(false);
    expect(mapBooksCollectionDtoToSummaries(payload)).toEqual([
      expect.objectContaining({
        id: 101,
        title: "The Left Hand of Darkness",
        authorName: "Ursula K. Le Guin",
      }),
    ]);
  });

  it("keeps empty result sets safe for localized empty states", async () => {
    const client = createDiscoveryApiClient("id");
    const payload = await getBooks(client, {
      q: "no-such-book",
      page: 1,
      limit: 12,
    });

    expect(payload).toEqual(
      createBooksCollectionFixture({
        q: "no-such-book",
        page: 1,
        limit: 12,
      }),
    );
    expect(mapBooksCollectionDtoToSummaries(payload)).toEqual([]);
  });
});