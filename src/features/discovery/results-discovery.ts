import "server-only";

import {
  mapBookSummaryToPresentation,
  mapBooksCollectionDtoToSummaries,
} from "@/entities/book";
import { mapCategoriesCollectionDtoToSummaries, type CategorySummary } from "@/entities/category";
import {
  createDiscoveryApiClient,
  extractPaginationDto,
  getBooks,
  getCategories,
} from "@/features/discovery/api";
import type { DiscoveryResultsViewState } from "@/features/discovery/model/discovery-results";
import type { DiscoveryQueryState } from "@/features/discovery/model/discovery-query";
import { runtimeConfig } from "@/shared/config/runtime";
import type { AppLocale } from "@/shared/i18n/config";
import { createBooksCollectionFixture } from "@/../tests/fixtures/discovery/books-fixtures";
import { homeCategoriesCollectionFixture } from "@/../tests/fixtures/discovery/categories-fixtures";

function createPaginationState(
  state: DiscoveryQueryState,
  pagination: ReturnType<typeof extractPaginationDto>,
) {
  const page = pagination?.page ?? state.page;
  const totalPages = pagination?.totalPages ?? 0;

  return {
    page,
    hasPrevious: page > 1,
    hasNext: pagination?.hasMore ?? totalPages > page,
    total: pagination?.total ?? null,
  };
}

export async function readDiscoveryCategories(locale: AppLocale): Promise<CategorySummary[]> {
  const payload = runtimeConfig.authE2eFixtureMode
    ? homeCategoriesCollectionFixture
    : await getCategories(createDiscoveryApiClient(locale));

  return mapCategoriesCollectionDtoToSummaries(payload);
}

export async function readDiscoveryBookResults(
  locale: AppLocale,
  state: DiscoveryQueryState,
): Promise<DiscoveryResultsViewState> {
  try {
    const payload = runtimeConfig.authE2eFixtureMode
      ? createBooksCollectionFixture({
          q: state.q,
          categoryId: state.categoryId ?? undefined,
          authorId: state.authorId ?? undefined,
          minRating: state.minRating ?? undefined,
          page: state.page,
          limit: state.limit,
        })
      : await getBooks(createDiscoveryApiClient(locale), {
          ...(state.q ? { q: state.q } : {}),
          ...(state.categoryId !== null ? { categoryId: state.categoryId } : {}),
          ...(state.authorId !== null ? { authorId: state.authorId } : {}),
          ...(state.minRating !== null ? { minRating: state.minRating } : {}),
          page: state.page,
          limit: state.limit,
        });
    const summaries = mapBooksCollectionDtoToSummaries(payload);
    const pagination = createPaginationState(state, extractPaginationDto(payload));

    if (summaries.length === 0) {
      return {
        status: "empty",
        pagination,
      };
    }

    return {
      status: "ready",
      items: summaries.map((book) => mapBookSummaryToPresentation(book, { locale })),
      pagination,
    };
  } catch {
    return {
      status: "error",
    };
  }
}