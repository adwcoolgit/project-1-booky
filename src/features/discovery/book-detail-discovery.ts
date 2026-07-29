import "server-only";

import {
  mapBookDetailResponseDtoToDetail,
  mapBookDetailToPresentation,
  mapBooksCollectionDtoToSummaries,
  mapBookSummaryToPresentation,
  type BookDetailPresentation,
  type BookPresentation,
} from "@/entities/book";
import {
  mapReviewSummaryToPresentation,
  mapReviewsCollectionDtoToPage,
  type ReviewPresentation,
} from "@/entities/review";
import {
  createDiscoveryApiClient,
  getBookDetail,
  getBookReviews,
  getRecommendedBooks,
} from "@/features/discovery/api";
import { discoveryLimitDefaults } from "@/features/discovery/model/discovery-query";
import { toHttpError } from "@/shared/api/http-client";
import { runtimeConfig } from "@/shared/config/runtime";
import type { AppLocale } from "@/shared/i18n/config";
import {
  createBookDetailResponseFixture,
  createRecommendedBooksCollectionFixture,
} from "@/../tests/fixtures/discovery/books-fixtures";
import { createReviewsCollectionFixture } from "@/../tests/fixtures/discovery/reviews-fixtures";

export type BookDetailReviewsView =
  | {
      status: "ready";
      items: ReviewPresentation[];
      page: number;
      limit: number;
      hasMore: boolean;
    }
  | {
      status: "error";
      items: [];
      page: number;
      limit: number;
      hasMore: false;
    };

export type BookDetailRelatedView =
  | {
      status: "ready";
      books: BookPresentation[];
    }
  | {
      status: "empty";
      books: [];
    }
  | {
      status: "error";
      books: [];
    };

export type BookDetailPageViewState =
  | {
      status: "ready";
      detail: BookDetailPresentation;
      reviews: BookDetailReviewsView;
      related: BookDetailRelatedView;
    }
  | {
      status: "not-found";
    }
  | {
      status: "error";
    };

async function readBookReviewsView(
  locale: AppLocale,
  bookId: number,
  limit: number,
): Promise<BookDetailReviewsView> {
  try {
    const payload = runtimeConfig.authE2eFixtureMode
      ? createReviewsCollectionFixture({
          bookId,
          page: 1,
          limit,
        })
      : await getBookReviews(createDiscoveryApiClient(locale), bookId, {
          page: 1,
          limit,
        });
    const page = mapReviewsCollectionDtoToPage(payload, {
      bookId,
      fallbackLimit: limit,
    });

    return {
      status: "ready",
      items: page.items.map((review) => mapReviewSummaryToPresentation(review, locale)),
      page: page.page,
      limit: page.limit,
      hasMore: page.hasMore,
    };
  } catch {
    return {
      status: "error",
      items: [],
      page: 1,
      limit,
      hasMore: false,
    };
  }
}

async function readRelatedBooksView(
  locale: AppLocale,
  currentBookId: number,
  categoryId: number | null,
  limit: number,
): Promise<BookDetailRelatedView> {
  if (!categoryId) {
    return {
      status: "empty",
      books: [],
    };
  }

  try {
    const payload = runtimeConfig.authE2eFixtureMode
      ? createRecommendedBooksCollectionFixture({
          categoryId,
          page: 1,
          limit: limit + 1,
        })
      : await getRecommendedBooks(createDiscoveryApiClient(locale), {
          by: "rating",
          categoryId,
          page: 1,
          limit: limit + 1,
        });
    const books = mapBooksCollectionDtoToSummaries(payload)
      .filter((book) => book.id !== currentBookId)
      .slice(0, limit)
      .map((book) => mapBookSummaryToPresentation(book, { locale }));

    if (books.length === 0) {
      return {
        status: "empty",
        books: [],
      };
    }

    return {
      status: "ready",
      books,
    };
  } catch {
    return {
      status: "error",
      books: [],
    };
  }
}

export async function readBookDetailPageView(
  locale: AppLocale,
  bookId: number,
  options: {
    reviewLimit?: number | undefined;
    relatedLimit?: number | undefined;
  } = {},
): Promise<BookDetailPageViewState> {
  const reviewLimit = options.reviewLimit ?? discoveryLimitDefaults.reviews;
  const relatedLimit = options.relatedLimit ?? 4;

  try {
    const detailPayload = runtimeConfig.authE2eFixtureMode
      ? createBookDetailResponseFixture({ bookId })
      : await getBookDetail(createDiscoveryApiClient(locale), bookId);

    if (!detailPayload) {
      return { status: "not-found" };
    }

    const detail = mapBookDetailResponseDtoToDetail(detailPayload);

    if (!detail) {
      return { status: "error" };
    }

    const [reviews, related] = await Promise.all([
      readBookReviewsView(locale, bookId, reviewLimit),
      readRelatedBooksView(locale, bookId, detail.summary.categoryId, relatedLimit),
    ]);

    return {
      status: "ready",
      detail: mapBookDetailToPresentation(detail, { locale }),
      reviews,
      related,
    };
  } catch (error) {
    const httpError = toHttpError(error);

    if (httpError.code === "not-found") {
      return { status: "not-found" };
    }

    return { status: "error" };
  }
}
