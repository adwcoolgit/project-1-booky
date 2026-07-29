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

export const discoveryTertiaryReviewDtoFixture = Object.freeze({
  id: 503,
  bookId: 101,
  reviewerName: "Lina",
  star: 5,
  comment: "Karakter dan ide politiknya terasa tajam sampai akhir.",
  createdAt: "2026-06-14T07:45:00.000Z",
});

export const invalidReviewDtoFixture = Object.freeze({
  bookId: 101,
  reviewerName: "Anonymous",
  comment: "Missing star should be ignored by the mapper.",
});

const reviewsByBookId = Object.freeze({
  101: [discoveryReviewDtoFixture, discoverySecondaryReviewDtoFixture, discoveryTertiaryReviewDtoFixture],
  102: [],
  103: [
    Object.freeze({
      id: 601,
      bookId: 103,
      reviewerName: "Nadia",
      star: 4,
      comment: "Masih terasa sangat segar untuk novel dengan ide sebesar ini.",
      createdAt: "2026-06-11T09:20:00.000Z",
    }),
  ],
});

function paginateReviews(reviews: readonly unknown[], page: number, limit: number) {
  const total = reviews.length;
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
  const start = Math.max(page - 1, 0) * limit;
  const data = reviews.slice(start, start + limit);

  return Object.freeze({
    reviews: data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasMore: totalPages > 0 && page < totalPages,
    },
  });
}

export function createReviewsCollectionFixture(
  params: {
    bookId: number;
    page?: number | undefined;
    limit?: number | undefined;
  },
) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const reviews = reviewsByBookId[params.bookId as keyof typeof reviewsByBookId] ?? [];

  return paginateReviews(reviews, page, limit);
}

export const discoveryReviewsCollectionFixture = createReviewsCollectionFixture({
  bookId: 101,
  page: 1,
  limit: 2,
});

export const discoveryReviewsSecondPageFixture = createReviewsCollectionFixture({
  bookId: 101,
  page: 2,
  limit: 2,
});

export const emptyDiscoveryReviewsCollectionFixture = createReviewsCollectionFixture({
  bookId: 102,
  page: 1,
  limit: 10,
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
