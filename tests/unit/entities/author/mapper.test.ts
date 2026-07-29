import { describe, expect, it } from "vitest";

import { mapAuthorBooksResponseDtoToCollection, mapAuthorsCollectionDtoToSummaries } from "@/entities/author";
import {
  authorBooksResponseFixture,
  popularAuthorsPartialCollectionFixture,
} from "@/../tests/fixtures/discovery/authors-fixtures";

describe("author mapper", () => {
  it("filters incomplete author rows conservatively", () => {
    const authors = mapAuthorsCollectionDtoToSummaries(popularAuthorsPartialCollectionFixture);

    expect(authors).toHaveLength(1);
    expect(authors[0]).toMatchObject({
      id: 21,
      name: "Ursula K. Le Guin",
      bookCount: 47,
    });
  });

  it("maps author books payloads with stable pagination state", () => {
    const collection = mapAuthorBooksResponseDtoToCollection(authorBooksResponseFixture, 2);

    expect(collection).not.toBeNull();
    expect(collection).toMatchObject({
      author: {
        id: 21,
        name: "Ursula K. Le Guin",
      },
      page: 1,
      limit: 2,
      hasMore: true,
    });
    expect(collection?.books).toHaveLength(2);
  });

  it("falls back to pagination total when author bookCount is missing", () => {
    const collection = mapAuthorBooksResponseDtoToCollection({
      author: {
        id: 21,
        name: "Ursula K. Le Guin",
        bio: "American novelist known for speculative fiction.",
      },
      books: authorBooksResponseFixture.books,
      pagination: {
        page: 1,
        limit: 2,
        total: 47,
        totalPages: 24,
        hasMore: true,
      },
    }, 2);

    expect(collection).not.toBeNull();
    expect(collection?.author.bookCount).toBe(47);
  });
});
