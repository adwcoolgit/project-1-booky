"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { mapAuthorBooksResponseDtoToCollection } from "@/entities/author";
import {
  mapBookSummaryToPresentation,
  type BookPresentation,
} from "@/entities/book";
import { createDiscoveryApiClient, getAuthorBooks } from "@/features/discovery/api";
import { discoveryQueryKeys } from "@/features/discovery/model/discovery-query-keys";
import {
  browserFixtureMode,
  loadAuthorBooksFixture,
} from "@/features/discovery/testing/discovery-fixtures.client";
import type { AppLocale } from "@/shared/i18n/config";

type AuthorBooksLoadMorePage = {
  books: BookPresentation[];
  page: number;
  hasMore: boolean;
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

export function useAuthorBooksLoadMore({
  authorId,
  locale,
  initialBooks,
  initialPage,
  limit,
  hasMore,
}: {
  authorId: number;
  locale: AppLocale;
  initialBooks: BookPresentation[];
  initialPage: number;
  limit: number;
  hasMore: boolean;
}) {
  const query = useInfiniteQuery({
    queryKey: [locale, ...discoveryQueryKeys.authors.books(authorId, { limit })],
    initialPageParam: initialPage,
    queryFn: async ({ pageParam }) => {
      const payload = browserFixtureMode
        ? await loadAuthorBooksFixture({
            authorId,
            page: Number(pageParam),
            limit,
          })
        : await getAuthorBooks(createDiscoveryApiClient(locale), authorId, {
            page: Number(pageParam),
            limit,
          });
      const collection = payload ? mapAuthorBooksResponseDtoToCollection(payload, limit) : null;

      if (!collection) {
        throw new Error("Author books response could not be mapped.");
      }

      return {
        books: collection.books.map((book) => mapBookSummaryToPresentation(book, { locale })),
        page: collection.page,
        hasMore: collection.hasMore,
      } satisfies AuthorBooksLoadMorePage;
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
