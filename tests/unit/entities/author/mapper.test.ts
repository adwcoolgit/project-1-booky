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
});