import { describe, expect, it } from "vitest";

import {
  mapBookDetailResponseDtoToDetail,
  mapBookDtoToSummary,
  mapBooksCollectionDtoToSummaries,
  omitUnsupportedBookFields,
} from "@/entities/book";
import {
  discoveryBookDetailEnvelopeFixture,
  discoveryBookDtoFixture,
  discoveryBooksPartialCollectionFixture,
  discoveryDirectBookDetailFixture,
} from "@/../tests/fixtures/discovery/books-fixtures";

function hasOwnPageCount(value: unknown) {
  return typeof value === "object" && value !== null && Object.prototype.hasOwnProperty.call(value, "pageCount");
}

describe("book mapper", () => {
  it("drops unsupported pageCount while preserving supported summary fields", () => {
    const stripped = omitUnsupportedBookFields(discoveryBookDtoFixture);
    const summary = mapBookDtoToSummary(discoveryBookDtoFixture);

    expect(hasOwnPageCount(stripped)).toBe(false);
    expect(summary).toEqual({
      id: 101,
      title: "The Left Hand of Darkness",
      authorId: 21,
      authorName: "Ursula K. Le Guin",
      categoryId: 7,
      categoryName: "Science Fiction",
      coverImageUrl: "https://images.example.test/books/the-left-hand-of-darkness.jpg",
      rating: 4.7,
      reviewCount: 128,
      availableCopies: 4,
      totalCopies: 12,
    });
  });

  it("filters incomplete collection items conservatively", () => {
    const books = mapBooksCollectionDtoToSummaries(discoveryBooksPartialCollectionFixture);

    expect(books).toHaveLength(1);
    expect(books[0]?.id).toBe(101);
  });

  it("maps direct and enveloped detail payloads without leaking pageCount", () => {
    const direct = mapBookDetailResponseDtoToDetail(discoveryDirectBookDetailFixture);
    const enveloped = mapBookDetailResponseDtoToDetail(discoveryBookDetailEnvelopeFixture);

    expect(direct?.summary.id).toBe(101);
    expect(direct?.description).toBe("A classic about politics, culture, and winter.");
    expect(enveloped?.summary.id).toBe(101);
    expect(hasOwnPageCount(direct?.summary ?? null)).toBe(false);
    expect(hasOwnPageCount(enveloped?.summary ?? null)).toBe(false);
  });
});