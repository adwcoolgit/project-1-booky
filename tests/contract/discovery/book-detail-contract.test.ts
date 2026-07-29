import { describe, expect, it } from "vitest";

import {
  mapBookDetailResponseDtoToDetail,
  mapBookDetailToPresentation,
  mapBooksCollectionDtoToSummaries,
} from "@/entities/book";
import { mapReviewsCollectionDtoToPage } from "@/entities/review";
import {
  createDiscoveryApiClient,
  getBookDetail,
  getBookReviews,
  getRecommendedBooks,
} from "@/features/discovery/api";
import { readBookDetailPageView } from "@/features/discovery";

describe("book detail transport contract", () => {
  it("maps detail, reviews, and related-book transport without leaking pageCount", async () => {
    const client = createDiscoveryApiClient("en");
    const detailPayload = await getBookDetail(client, 101);
    const reviewsPayload = await getBookReviews(client, 101, { page: 1, limit: 2 });
    const relatedPayload = await getRecommendedBooks(client, {
      by: "rating",
      categoryId: 7,
      page: 1,
      limit: 4,
    });
    const detail = mapBookDetailResponseDtoToDetail(detailPayload, {
      reviews: mapReviewsCollectionDtoToPage(reviewsPayload, {
        bookId: 101,
        fallbackLimit: 2,
      }),
    });
    const relatedSummaries = mapBooksCollectionDtoToSummaries(relatedPayload);

    expect(detail).not.toBeNull();
    expect(detail?.summary).toMatchObject({
      id: 101,
      title: "The Left Hand of Darkness",
      authorName: "Ursula K. Le Guin",
      categoryName: "Science Fiction",
      availableCopies: 4,
      totalCopies: 12,
    });
    expect(detail?.borrowCount).toBe(64);
    expect(JSON.stringify(detail)).not.toContain("pageCount");
    expect(mapBookDetailToPresentation(detail!, { locale: "en" })).toMatchObject({
      id: 101,
      ratingLabel: "4.7",
      reviewCountLabel: "128",
      availabilityRatioLabel: "4/12",
      borrowCountLabel: "64",
    });
    expect(JSON.stringify(relatedSummaries)).not.toContain("pageCount");
  });

  it("surfaces not-found and retryable failures through the detail reader and review adapter", async () => {
    expect(await readBookDetailPageView("en", 999)).toEqual({
      status: "not-found",
    });
    expect(await readBookDetailPageView("en", 500)).toEqual({
      status: "error",
    });

    const client = createDiscoveryApiClient("en");

    await expect(getBookReviews(client, 500, { page: 1, limit: 2 })).rejects.toMatchObject({
      code: "server-error",
      status: 500,
    });
  });

  it("builds the localized detail view with paged reviews and filtered related books", async () => {
    const view = await readBookDetailPageView("id", 101, {
      reviewLimit: 2,
      relatedLimit: 4,
    });

    expect(view.status).toBe("ready");

    if (view.status !== "ready") {
      throw new Error("Expected ready detail view.");
    }

    expect(view.detail).toMatchObject({
      id: 101,
      title: "The Left Hand of Darkness",
      authorName: "Ursula K. Le Guin",
      availabilityRatioLabel: "4/12",
    });
    expect(view.reviews).toMatchObject({
      status: "ready",
      page: 1,
      limit: 2,
      hasMore: true,
    });

    if (view.reviews.status !== "ready") {
      throw new Error("Expected ready review slice.");
    }

    expect(view.reviews.items).toHaveLength(2);
    expect(JSON.stringify(view.detail)).not.toContain("pageCount");
    expect(view.related.status).toBe("ready");

    if (view.related.status !== "ready") {
      throw new Error("Expected ready related slice.");
    }

    expect(view.related.books.map((book) => book.id)).not.toContain(101);
    expect(view.related.books.map((book) => book.title)).toEqual([
      "The Dispossessed",
      "A Wizard of Earthsea",
    ]);
  });
});
