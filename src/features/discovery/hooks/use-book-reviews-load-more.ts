"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import {
  mapReviewSummaryToPresentation,
  mapReviewsCollectionDtoToPage,
  type ReviewPresentation,
} from "@/entities/review";
import { createDiscoveryApiClient, getBookReviews } from "@/features/discovery/api";
import { discoveryQueryKeys } from "@/features/discovery/model/discovery-query-keys";
import {
  browserFixtureMode,
  loadReviewsFixture,
} from "@/features/discovery/testing/discovery-fixtures.client";
import type { AppLocale } from "@/shared/i18n/config";

type BookReviewsLoadMorePage = {
  reviews: ReviewPresentation[];
  page: number;
  limit: number;
  hasMore: boolean;
};

function dedupeReviewsById(reviews: readonly ReviewPresentation[]) {
  const seen = new Set<string>();

  return reviews.filter((review) => {
    if (seen.has(review.id)) {
      return false;
    }

    seen.add(review.id);
    return true;
  });
}

export function useBookReviewsLoadMore({
  bookId,
  locale,
  initialReviews,
  initialPage,
  limit,
  hasMore,
}: {
  bookId: number;
  locale: AppLocale;
  initialReviews: ReviewPresentation[];
  initialPage: number;
  limit: number;
  hasMore: boolean;
}) {
  const query = useInfiniteQuery({
    queryKey: [locale, ...discoveryQueryKeys.reviews.book(bookId, { limit })],
    initialPageParam: initialPage,
    queryFn: async ({ pageParam }) => {
      const payload = browserFixtureMode
        ? await loadReviewsFixture({
            bookId,
            page: Number(pageParam),
            limit,
          })
        : await getBookReviews(createDiscoveryApiClient(locale), bookId, {
            page: Number(pageParam),
            limit,
          });
      const page = mapReviewsCollectionDtoToPage(payload, {
        bookId,
        fallbackLimit: limit,
      });

      return {
        reviews: page.items.map((review) => mapReviewSummaryToPresentation(review, locale)),
        page: page.page,
        limit: page.limit,
        hasMore: page.hasMore,
      } satisfies BookReviewsLoadMorePage;
    },
    initialData: {
      pages: [
        {
          reviews: initialReviews,
          page: initialPage,
          limit,
          hasMore,
        },
      ],
      pageParams: [initialPage],
    },
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    retry: false,
  });

  const pages = query.data?.pages ?? [];
  const lastPage = pages.at(-1);

  return {
    reviews: dedupeReviewsById(pages.flatMap((page) => page.reviews)),
    hasMore: lastPage?.hasMore ?? hasMore,
    isPending: query.isFetchingNextPage,
    isLoadMoreError: query.isFetchNextPageError,
    loadMore: () => {
      if (query.isFetchingNextPage || !(lastPage?.hasMore ?? hasMore)) {
        return;
      }

      void query.fetchNextPage();
    },
  };
}
