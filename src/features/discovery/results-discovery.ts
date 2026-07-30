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
import type { DiscoveryListQuery, DiscoveryQueryState } from "@/features/discovery/model/discovery-query";
import type { DiscoveryResultsViewState } from "@/features/discovery/model/discovery-results";
import {
  getHomeCategoriesFixture,
  loadBooksCollectionFixture,
} from "@/features/discovery/testing/discovery-fixtures.server";
import { runtimeConfig } from "@/shared/config/runtime";
import type { AppLocale } from "@/shared/i18n/config";

const discoveryCategoryScanLimit = 50;
const discoveryCategoryScanMaxPages = 20;

type DiscoveryCategoryCriteria = {
  query?: string;
  minRating?: number | null;
  selectedCategoryId?: number | null;
};

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

function createBooksListQuery(input: {
  q?: string | undefined;
  categoryId?: number | undefined;
  authorId?: number | undefined;
  minRating?: number | undefined;
  page: number;
  limit: number;
}): DiscoveryListQuery {
  return {
    ...(input.q ? { q: input.q } : {}),
    ...(input.categoryId ? { categoryId: input.categoryId } : {}),
    ...(input.authorId ? { authorId: input.authorId } : {}),
    ...(input.minRating ? { minRating: input.minRating } : {}),
    page: input.page,
    limit: input.limit,
  };
}

async function readBooksCollection(
  locale: AppLocale,
  query: DiscoveryListQuery,
) {
  if (runtimeConfig.authE2eFixtureMode) {
    return loadBooksCollectionFixture(query);
  }

  return getBooks(createDiscoveryApiClient(locale), query);
}

function collectMatchingCategoryIds(
  matchingCategoryIds: Set<number>,
  payload: unknown,
) {
  for (const book of mapBooksCollectionDtoToSummaries(payload)) {
    if (book.categoryId !== null) {
      matchingCategoryIds.add(book.categoryId);
    }
  }
}

async function readMatchingCategoryIds(
  locale: AppLocale,
  criteria: DiscoveryCategoryCriteria,
): Promise<{ ids: Set<number>; isComplete: boolean }> {
  const firstPayload = await readBooksCollection(
    locale,
    createBooksListQuery({
      q: criteria.query,
      minRating: criteria.minRating ?? undefined,
      page: 1,
      limit: discoveryCategoryScanLimit,
    }),
  );
  const matchingCategoryIds = new Set<number>();

  collectMatchingCategoryIds(matchingCategoryIds, firstPayload);

  const pagination = extractPaginationDto(firstPayload);
  const totalPages = Math.max(
    pagination?.totalPages ?? 0,
    pagination?.hasMore ? 2 : 1,
  );
  const pagesToScan = Math.min(totalPages, discoveryCategoryScanMaxPages);

  if (pagesToScan <= 1) {
    return {
      ids: matchingCategoryIds,
      isComplete: totalPages <= 1,
    };
  }

  const remainingPages = Array.from({ length: pagesToScan - 1 }, (_, index) => index + 2);
  const remainingPayloads = await Promise.allSettled(
    remainingPages.map((page) =>
      readBooksCollection(
        locale,
        createBooksListQuery({
          q: criteria.query,
          minRating: criteria.minRating ?? undefined,
          page,
          limit: discoveryCategoryScanLimit,
        }),
      ),
    ),
  );

  let isComplete = totalPages <= discoveryCategoryScanMaxPages;

  for (const payload of remainingPayloads) {
    if (payload.status === "fulfilled") {
      collectMatchingCategoryIds(matchingCategoryIds, payload.value);
      continue;
    }

    isComplete = false;
  }

  return {
    ids: matchingCategoryIds,
    isComplete,
  };
}

export async function readDiscoveryCategories(locale: AppLocale): Promise<CategorySummary[]> {
  const payload = runtimeConfig.authE2eFixtureMode
    ? getHomeCategoriesFixture()
    : await getCategories(createDiscoveryApiClient(locale));

  return mapCategoriesCollectionDtoToSummaries(payload);
}

export async function readDiscoverySearchCategories(
  locale: AppLocale,
  criteria: DiscoveryCategoryCriteria = {},
): Promise<CategorySummary[]> {
  const categories = await readDiscoveryCategories(locale);
  const hasQuery = Boolean(criteria.query);
  const hasMinRating = criteria.minRating !== null && criteria.minRating !== undefined;

  if (!hasQuery && !hasMinRating) {
    return categories;
  }

  try {
    const { ids, isComplete } = await readMatchingCategoryIds(locale, criteria);

    if (!isComplete) {
      return categories;
    }

    return categories.filter(
      (category) => ids.has(category.id) || category.id === criteria.selectedCategoryId,
    );
  } catch {
    return categories;
  }
}

export async function readDiscoveryBookResults(
  locale: AppLocale,
  state: DiscoveryQueryState,
): Promise<DiscoveryResultsViewState> {
  try {
    const payload = await readBooksCollection(
      locale,
      createBooksListQuery({
        q: state.q,
        categoryId: state.categoryId ?? undefined,
        authorId: state.authorId ?? undefined,
        minRating: state.minRating ?? undefined,
        page: state.page,
        limit: state.limit,
      }),
    );
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
