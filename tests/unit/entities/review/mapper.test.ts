import { describe, expect, it } from "vitest";

import { mapReviewDtoToSummary, mapReviewsCollectionDtoToPage } from "@/entities/review";
import { discoveryReviewsPartialCollectionFixture } from "@/../tests/fixtures/discovery/reviews-fixtures";

describe("review mapper", () => {
  it("maps review pages conservatively and keeps pagination metadata", () => {
    const page = mapReviewsCollectionDtoToPage(discoveryReviewsPartialCollectionFixture, {
      bookId: 101,
      fallbackLimit: 10,
    });

    expect(page).toMatchObject({
      page: 2,
      limit: 10,
      hasMore: false,
    });
    expect(page.items).toHaveLength(1);
    expect(page.items[0]).toMatchObject({
      id: "501",
      bookId: 101,
      star: 5,
    });
  });

  it("synthesizes deterministic ids when review ids are absent", () => {
    const review = mapReviewDtoToSummary(
      {
        bookId: 101,
        reviewerName: "Ayu",
        star: 5,
      },
      {
        fallbackBookId: 101,
        page: 3,
        index: 1,
      },
    );

    expect(review).toMatchObject({
      id: "review-101-3-2",
      bookId: 101,
      reviewerName: "Ayu",
      star: 5,
    });
  });
});