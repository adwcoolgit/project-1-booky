export const discoveryReviewDtoFixture = Object.freeze({
  id: 501,
  bookId: 101,
  reviewerName: "Ayu",
  star: 5,
  comment: "Tetap relevan dan kuat dibaca ulang.",
  createdAt: "2026-06-12T10:00:00.000Z",
});

export const discoverySecondaryReviewDtoFixture = Object.freeze({
  id: "review-quoted-2",
  bookId: 101,
  reviewerName: "Rizal",
  star: 4,
  comment: "Worldbuilding sangat presisi.",
  createdAt: "2026-06-13T08:30:00.000Z",
});

export const invalidReviewDtoFixture = Object.freeze({
  bookId: 101,
  reviewerName: "Anonymous",
  comment: "Missing star should be ignored by the mapper.",
});

export const discoveryReviewsCollectionFixture = Object.freeze({
  reviews: [discoveryReviewDtoFixture, discoverySecondaryReviewDtoFixture],
  pagination: {
    page: 1,
    limit: 10,
    total: 2,
    totalPages: 1,
    hasMore: false,
  },
});

export const discoveryReviewsPartialCollectionFixture = Object.freeze({
  data: [discoveryReviewDtoFixture, invalidReviewDtoFixture],
  meta: {
    page: 2,
    limit: 10,
    total: 3,
    totalPages: 2,
    hasMore: false,
  },
});