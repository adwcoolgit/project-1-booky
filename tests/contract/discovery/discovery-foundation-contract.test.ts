import { describe, expect, it } from "vitest";

import {
  authorsCollectionDtoSchema,
  bookDetailResponseDtoSchema,
  booksCollectionDtoSchema,
  categoriesCollectionDtoSchema,
  reviewsCollectionDtoSchema,
} from "@/features/discovery/api";
import { mapAuthorsCollectionDtoToSummaries } from "@/entities/author";
import { mapBookDetailResponseDtoToDetail, mapBooksCollectionDtoToSummaries } from "@/entities/book";
import { mapCategoriesCollectionDtoToSummaries } from "@/entities/category";
import { mapReviewsCollectionDtoToPage } from "@/entities/review";
import {
  popularAuthorsPartialCollectionFixture,
} from "@/../tests/fixtures/discovery/authors-fixtures";
import {
  discoveryBookDetailEnvelopeFixture,
  discoveryBooksPartialCollectionFixture,
  discoveryDirectBookDetailFixture,
} from "@/../tests/fixtures/discovery/books-fixtures";
import { discoveryCategoriesPartialCollectionFixture } from "@/../tests/fixtures/discovery/categories-fixtures";
import { discoveryReviewsPartialCollectionFixture } from "@/../tests/fixtures/discovery/reviews-fixtures";

function hasOwnPageCount(value: unknown) {
  return typeof value === "object" && value !== null && Object.prototype.hasOwnProperty.call(value, "pageCount");
}

describe("discovery foundational transport contract", () => {
  it("accepts partial book envelopes and omits unsupported pageCount before domain mapping", () => {
    const parsedCollection = booksCollectionDtoSchema.parse(discoveryBooksPartialCollectionFixture);
    const parsedEnvelope = bookDetailResponseDtoSchema.parse(discoveryBookDetailEnvelopeFixture);
    const parsedDirect = bookDetailResponseDtoSchema.parse(discoveryDirectBookDetailFixture);
    const envelopeDetail = mapBookDetailResponseDtoToDetail(parsedEnvelope);
    const directDetail = mapBookDetailResponseDtoToDetail(parsedDirect);

    expect(mapBooksCollectionDtoToSummaries(parsedCollection)).toHaveLength(1);
    expect(hasOwnPageCount((parsedEnvelope as { data?: unknown }).data ?? null)).toBe(false);
    expect(hasOwnPageCount(parsedDirect)).toBe(false);
    expect(envelopeDetail?.summary.id).toBe(101);
    expect(directDetail?.summary.id).toBe(101);
  });

  it("accepts partial author, category, and review envelopes for conservative mapping", () => {
    const authors = authorsCollectionDtoSchema.parse(popularAuthorsPartialCollectionFixture);
    const categories = categoriesCollectionDtoSchema.parse(discoveryCategoriesPartialCollectionFixture);
    const reviews = reviewsCollectionDtoSchema.parse(discoveryReviewsPartialCollectionFixture);

    expect(mapAuthorsCollectionDtoToSummaries(authors)).toHaveLength(1);
    expect(mapCategoriesCollectionDtoToSummaries(categories)).toEqual([
      {
        id: 7,
        name: "Science Fiction",
        slug: "science-fiction-7",
        artwork: null,
      },
    ]);
    expect(mapReviewsCollectionDtoToPage(reviews, { bookId: 101, fallbackLimit: 10 })).toMatchObject({
      page: 2,
      limit: 10,
      hasMore: false,
      items: [
        expect.objectContaining({
          id: "501",
          bookId: 101,
          star: 5,
        }),
      ],
    });
  });
});