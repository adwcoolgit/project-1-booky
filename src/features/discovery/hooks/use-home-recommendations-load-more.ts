"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import {
  mapBooksCollectionDtoToPage,
  mapBookSummaryToPresentation,
  type BookPresentation,
} from "@/entities/book";
import { createDiscoveryApiClient, getRecommendedBooks } from "@/features/discovery/api";
import { discoveryQueryKeys } from "@/features/discovery/model/discovery-query-keys";
import { runtimeConfig } from "@/shared/config/runtime";
import type { AppLocale } from "@/shared/i18n/config";
import { createRecommendedBooksCollectionFixture } from "@/../tests/fixtures/discovery/books-fixtures";

type HomeRecommendationsLoadMorePage = {
  books: BookPresentation[];
  page: number;
  hasMore: boolean;
};

const browserFixtureMode = process.env.NEXT_PUBLIC_AUTH_E2E_FIXTURE_MODE === "true";

function dedupeBooksById(books: readonly BookPresentation[]) {
  const seen = new Set<number>();

  return books.filter((book) => {
    if (seen.has(book.id)) {
      return false;
    }

    seen.add(book.id);
    return true;
  });
}

export function useHomeRecommendationsLoadMore({
  locale,
  initialBooks,
  initialPage,
  limit,
  hasMore,
}: {
  locale: AppLocale;
  initialBooks: BookPresentation[];
  initialPage: number;
  limit: number;
  hasMore: boolean;
}) {
  const query = useInfiniteQuery({
    queryKey: discoveryQueryKeys.books.recommend({ by: "rating", limit }),
    initialPageParam: initialPage,
    queryFn: async ({ pageParam }) => {
      const payload = runtimeConfig.authE2eFixtureMode || browserFixtureMode
        ? createRecommendedBooksCollectionFixture({
            page: Number(pageParam),
            limit,
          })
        : await getRecommendedBooks(createDiscoveryApiClient(locale), {
            by: "rating",
            page: Number(pageParam),
            limit,
          });
      const page = mapBooksCollectionDtoToPage(payload, limit);

      return {
        books: page.items.map((book) => mapBookSummaryToPresentation(book, { locale })),
        page: page.page,
        hasMore: page.hasMore,
      } satisfies HomeRecommendationsLoadMorePage;
    },
    initialData: {
      pages: [
        {
          books: initialBooks,
          page: initialPage,
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
    books: dedupeBooksById(pages.flatMap((page) => page.books)),
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