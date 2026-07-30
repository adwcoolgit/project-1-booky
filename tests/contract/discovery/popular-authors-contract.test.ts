import { describe, expect, it } from "vitest";

import {
  authorsCollectionDtoSchema,
  createDiscoveryApiClient,
  getAuthors,
  getPopularAuthors,
} from "@/features/discovery/api";
import { mapAuthorsCollectionDtoToSummaries } from "@/entities/author";
import {
  authorSearchCollectionFixture,
  emptyPopularAuthorsCollectionFixture,
  homePopularAuthorsCollectionFixture,
  popularAuthorsPartialCollectionFixture,
} from "@/../tests/fixtures/discovery/authors-fixtures";

describe("popular authors transport contract", () => {
  it("maps home popular authors and adapter-only author search through shared author contracts", async () => {
    const client = createDiscoveryApiClient("en");
    const popularPayload = await getPopularAuthors(client, { limit: 4 });
    const searchPayload = await getAuthors(client, { q: "ursula" });

    expect(popularPayload).toEqual(homePopularAuthorsCollectionFixture);
    expect(searchPayload).toEqual(authorSearchCollectionFixture);
    expect(mapAuthorsCollectionDtoToSummaries(popularPayload)).toMatchObject([
      {
        id: 21,
        name: "Ursula K. Le Guin",
        bookCount: 47,
      },
      {
        id: 22,
        name: "N. K. Jemisin",
        bookCount: 12,
      },
      {
        id: 31,
        name: "Yuval Noah Harari",
        bookCount: 9,
      },
      {
        id: 41,
        name: "James Clear",
        bookCount: 6,
      },
    ]);
    expect(mapAuthorsCollectionDtoToSummaries(searchPayload)).toEqual([
      {
        id: 21,
        name: "Ursula K. Le Guin",
        bio: "American novelist known for speculative fiction.",
        bookCount: 47,
        portrait: null,
      },
    ]);
  });

  it("keeps empty and partial author payloads safe for section-level states", () => {
    const emptyPayload = authorsCollectionDtoSchema.parse(emptyPopularAuthorsCollectionFixture);
    const partialPayload = authorsCollectionDtoSchema.parse(popularAuthorsPartialCollectionFixture);

    expect(mapAuthorsCollectionDtoToSummaries(emptyPayload)).toEqual([]);
    expect(mapAuthorsCollectionDtoToSummaries(partialPayload)).toEqual([
      {
        id: 21,
        name: "Ursula K. Le Guin",
        bio: "American novelist known for speculative fiction.",
        bookCount: 47,
        portrait: null,
      },
    ]);
  });
});