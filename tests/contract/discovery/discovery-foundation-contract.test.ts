import { describe, expect, it } from "vitest";

import {
  authorBooksResponseDtoSchema,
  authorsCollectionDtoSchema,
  bookDetailResponseDtoSchema,
  booksCollectionDtoSchema,
  categoriesCollectionDtoSchema,
  extractPaginationDto,
  recommendationsCollectionDtoSchema,
  reviewsCollectionDtoSchema,
} from "@/features/discovery/api";
import { mapAuthorBooksResponseDtoToCollection, mapAuthorsCollectionDtoToSummaries } from "@/entities/author";
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

  it("accepts live nested data envelopes used by backend discovery endpoints", () => {
    const categories = categoriesCollectionDtoSchema.parse({
      success: true,
      message: "Success",
      data: {
        categories: [{ id: 1, name: "Computer" }],
      },
    });
    const recommendations = recommendationsCollectionDtoSchema.parse({
      success: true,
      message: "Success",
      data: {
        mode: "rating",
        books: [
          {
            id: 16,
            title: "40 Jam Pintar Membaca",
            rating: 5,
            reviewCount: 6,
            totalCopies: 1,
            availableCopies: 0,
            author: { id: 9, name: "Fitri Nurul Aulia" },
            category: { id: 1, name: "Computer" },
          },
        ],
        pagination: {
          page: 1,
          limit: 8,
          total: 41,
          totalPages: 6,
          hasMore: true,
        },
      },
    });
    const authors = authorsCollectionDtoSchema.parse({
      success: true,
      message: "Success",
      data: {
        authors: [
          {
            id: 19,
            name: "Zayn Mifta",
            bio: "Design engineer and author.",
            bookCount: 10,
          },
        ],
      },
    });
    const authorBooks = authorBooksResponseDtoSchema.parse({
      success: true,
      message: "Success",
      data: {
        author: {
          id: 19,
          name: "Zayn Mifta",
          bio: "Design engineer and author.",
          bookCount: 10,
        },
        books: [
          {
            id: 48,
            title: "Clean Code",
            author: { id: 19, name: "Zayn Mifta" },
            category: { id: 8, name: "Education" },
          },
        ],
        pagination: {
          page: 1,
          limit: 12,
          total: 1,
          totalPages: 1,
          hasMore: false,
        },
      },
    });
    const reviews = reviewsCollectionDtoSchema.parse({
      success: true,
      message: "Success",
      data: {
        reviews: [
          {
            id: 501,
            bookId: 16,
            reviewerName: "Jane",
            star: 5,
            comment: "Bagus",
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasMore: false,
        },
      },
    });
    const detail = bookDetailResponseDtoSchema.parse({
      success: true,
      message: "Success",
      data: {
        book: {
          id: 16,
          title: "40 Jam Pintar Membaca",
          description: "Belajar membaca untuk anak.",
          author: { id: 9, name: "Fitri Nurul Aulia" },
          category: { id: 1, name: "Computer" },
        },
      },
    });

    expect(mapCategoriesCollectionDtoToSummaries(categories)).toEqual([
      {
        id: 1,
        name: "Computer",
        slug: "computer-1",
        artwork: null,
      },
    ]);
    expect(mapBooksCollectionDtoToSummaries(recommendations)).toEqual([
      expect.objectContaining({
        id: 16,
        title: "40 Jam Pintar Membaca",
        authorName: "Fitri Nurul Aulia",
        categoryName: "Computer",
      }),
    ]);
    expect(extractPaginationDto(recommendations)).toMatchObject({
      page: 1,
      limit: 8,
      total: 41,
      totalPages: 6,
      hasMore: true,
    });
    expect(mapAuthorsCollectionDtoToSummaries(authors)).toEqual([
      expect.objectContaining({
        id: 19,
        name: "Zayn Mifta",
        bookCount: 10,
      }),
    ]);
    expect(mapAuthorBooksResponseDtoToCollection(authorBooks, 12)).toMatchObject({
      author: {
        id: 19,
        name: "Zayn Mifta",
      },
      books: [
        expect.objectContaining({
          id: 48,
          title: "Clean Code",
        }),
      ],
      page: 1,
      limit: 12,
      hasMore: false,
    });
    expect(mapReviewsCollectionDtoToPage(reviews, { bookId: 16, fallbackLimit: 10 })).toMatchObject({
      page: 1,
      limit: 10,
      hasMore: false,
      items: [
        expect.objectContaining({
          id: "501",
          bookId: 16,
          star: 5,
        }),
      ],
    });
    expect(mapBookDetailResponseDtoToDetail(detail)?.summary).toMatchObject({
      id: 16,
      title: "40 Jam Pintar Membaca",
      authorName: "Fitri Nurul Aulia",
      categoryName: "Computer",
    });
  });
});