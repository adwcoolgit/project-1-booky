"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import {
  mapBooksCollectionDtoToPage,
  mapBookSummaryToPresentation,
  type BookPresentation,
} from "@/entities/book";
import { createDiscoveryApiClient, extractPaginationDto, getBooks } from "@/features/discovery/api";
import type { DiscoveryQueryState } from "@/features/discovery/model/discovery-query";
import { discoveryQueryKeys } from "@/features/discovery/model/discovery-query-keys";
import type { DiscoveryResultsViewState } from "@/features/discovery/model/discovery-results";
import {
  browserFixtureMode,
  loadBooksCollectionFixture,
} from "@/features/discovery/testing/discovery-fixtures.client";
import type { AppLocale } from "@/shared/i18n/config";

type ProgressiveDiscoveryResultsState = Extract<DiscoveryResultsViewState, { status: "ready" | "empty" }>;

type DiscoveryBooksLoadMorePage = {
  books: BookPresentation[];
  page: number;
  hasMore: boolean;
  total: number | null;
};

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

function createInitialPage(initialResults: ProgressiveDiscoveryResultsState): DiscoveryBooksLoadMorePage {
  return {
    books: initialResults.status === "ready" ? initialResults.items : [],
    page: initialResults.pagination.page,
    hasMore: initialResults.pagination.hasNext,
    total: initialResults.pagination.total,
  };
}

export function useDiscoveryBooksLoadMore({
  locale,
  queryState,
  initialResults,
}: {
  locale: AppLocale;
  queryState: DiscoveryQueryState;
  initialResults: ProgressiveDiscoveryResultsState;
}) {
  const query = useInfiniteQuery({
    queryKey: [
      locale,
      ...discoveryQueryKeys.books.list({
        q: queryState.q,
        categoryId: queryState.categoryId ?? undefined,
        authorId: queryState.authorId ?? undefined,
        minRating: queryState.minRating ?? undefined,
        page: queryState.page,
        limit: queryState.limit,
      }),
    ],
    initialPageParam: queryState.page,
    queryFn: async ({ pageParam }) => {
      const pageParamNumber = Number(pageParam);
      const payload = browserFixtureMode
        ? await loadBooksCollectionFixture({
            q: queryState.q,
            categoryId: queryState.categoryId ?? undefined,
            authorId: queryState.authorId ?? undefined,
            minRating: queryState.minRating ?? undefined,
            page: pageParamNumber,
            limit: queryState.limit,
          })
        : await getBooks(createDiscoveryApiClient(locale), {
            ...(queryState.q ? { q: queryState.q } : {}),
            ...(queryState.categoryId !== null ? { categoryId: queryState.categoryId } : {}),
            ...(queryState.authorId !== null ? { authorId: queryState.authorId } : {}),
            ...(queryState.minRating !== null ? { minRating: queryState.minRating } : {}),
            page: pageParamNumber,
            limit: queryState.limit,
          });
      const page = mapBooksCollectionDtoToPage(payload, queryState.limit);
      const pagination = extractPaginationDto(payload);

      return {
        books: page.items.map((book) => mapBookSummaryToPresentation(book, { locale })),
        page: page.page,
        hasMore: page.hasMore,
        total: pagination?.total ?? null,
      } satisfies DiscoveryBooksLoadMorePage;
    },
    initialData: {
      pages: [createInitialPage(initialResults)],
      pageParams: [queryState.page],
    },
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    retry: false,
  });

  const pages = query.data?.pages ?? [];
  const lastPage = pages.at(-1);
  const currentPage = lastPage?.page ?? queryState.page;

  return {
    books: dedupeBooksById(pages.flatMap((page) => page.books)),
    pagination: {
      page: currentPage,
      hasPrevious: currentPage > 1,
      hasNext: lastPage?.hasMore ?? initialResults.pagination.hasNext,
      total: lastPage?.total ?? initialResults.pagination.total,
    },
    isPending: query.isFetchingNextPage,
    isLoadMoreError: query.isFetchNextPageError,
    loadMore: () => {
      if (query.isFetchingNextPage || !(lastPage?.hasMore ?? initialResults.pagination.hasNext)) {
        return;
      }

      void query.fetchNextPage();
    },
  };
}
