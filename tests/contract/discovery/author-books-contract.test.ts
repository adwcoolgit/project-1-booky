import { describe, expect, it } from "vitest";

import { mapAuthorBooksResponseDtoToCollection } from "@/entities/author";
import {
  createDiscoveryApiClient,
  extractCollectionItems,
  extractPaginationDto,
  getAuthorBooks,
} from "@/features/discovery/api";
import {
  emptyAuthorBooksResponseFixture,
  paginatedAuthorBooksPageOneFixture,
  paginatedAuthorBooksPageTwoFixture,
} from "@/../tests/fixtures/discovery/authors-fixtures";

describe("author books transport contract", () => {
  it("maps paginated author books through GET /authors/{id}/books", async () => {
    const client = createDiscoveryApiClient("en");
    const firstPage = await getAuthorBooks(client, 21, { page: 1, limit: 2 });
    const secondPage = await getAuthorBooks(client, 21, { page: 2, limit: 2 });
    const collection = mapAuthorBooksResponseDtoToCollection(firstPage, 2);
    const firstPageItems = extractCollectionItems<Record<string, unknown>>(firstPage, ["books"]);
    const secondPageItems = extractCollectionItems<Record<string, unknown>>(secondPage, ["books"]);

    expect(extractPaginationDto(firstPage)).toEqual(paginatedAuthorBooksPageOneFixture.pagination);
    expect(extractPaginationDto(secondPage)).toEqual(paginatedAuthorBooksPageTwoFixture.pagination);
    expect(firstPageItems).toEqual([
      expect.objectContaining({
        id: 101,
        title: "The Left Hand of Darkness",
        authorName: "Ursula K. Le Guin",
      }),
      expect.objectContaining({
        id: 102,
        title: "A Wizard of Earthsea",
        authorName: "Ursula K. Le Guin",
      }),
    ]);
    expect(secondPageItems).toEqual([
      expect.objectContaining({
        id: 103,
        title: "The Dispossessed",
        authorName: "Ursula K. Le Guin",
      }),
    ]);
    expect(Object.prototype.hasOwnProperty.call(firstPageItems[0] ?? {}, "pageCount")).toBe(false);
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

  it("keeps empty author catalogs safe for localized empty states", async () => {
    const client = createDiscoveryApiClient("id");
    const payload = await getAuthorBooks(client, 22, { page: 1, limit: 2 });

    expect(payload).toEqual(emptyAuthorBooksResponseFixture);
    expect(mapAuthorBooksResponseDtoToCollection(payload, 2)).toMatchObject({
      author: {
        id: 22,
        name: "N. K. Jemisin",
      },
      books: [],
      hasMore: false,
    });
  });

  it("surfaces documented not-found and retryable server failures", async () => {
    const client = createDiscoveryApiClient("en");

    await expect(getAuthorBooks(client, 999, { page: 1, limit: 2 })).rejects.toMatchObject({
      code: "not-found",
      status: 404,
    });
    await expect(getAuthorBooks(client, 500, { page: 1, limit: 2 })).rejects.toMatchObject({
      code: "server-error",
      status: 500,
    });
  });
});