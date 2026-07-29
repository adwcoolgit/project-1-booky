import "server-only";

import {
  mapAuthorSummaryToPresentation,
  mapAuthorsCollectionDtoToSummaries,
} from "@/entities/author";
import {
  mapBooksCollectionDtoToPage,
  mapBookSummaryToPresentation,
} from "@/entities/book";
import {
  mapCategoriesCollectionDtoToSummaries,
  mapCategorySummaryToPresentation,
} from "@/entities/category";
import {
  createDiscoveryApiClient,
  getCategories,
  getPopularAuthors,
  getRecommendedBooks,
} from "@/features/discovery/api";
import { discoveryLimitDefaults } from "@/features/discovery/model/discovery-query";
import type {
  HomeDiscoveryCollectionState,
  HomeDiscoveryPaginatedCollectionState,
  HomeDiscoveryViewModel,
} from "@/features/discovery/model/home-discovery";
import { runtimeConfig } from "@/shared/config/runtime";
import type { AppLocale } from "@/shared/i18n/config";
import { homeRecommendedBooksCollectionFixture } from "@/../tests/fixtures/discovery/books-fixtures";

const homeCategoriesFixture = Object.freeze({
  categories: [
    { id: 7, name: "Science Fiction" },
    { id: 8, name: "History" },
    { id: 9, name: "Personal Growth" },
    { id: 10, name: "Philosophy" },
  ],
});

const homePopularAuthorsFixture = Object.freeze({
  authors: [
    {
      id: 21,
      name: "Ursula K. Le Guin",
      bio: "American novelist known for speculative fiction.",
      bookCount: 47,
    },
    {
      id: 22,
      name: "N. K. Jemisin",
      bio: "Award-winning fantasy and science fiction author.",
      bookCount: 12,
    },
    {
      id: 31,
      name: "Yuval Noah Harari",
      bio: "Historian focused on broad human narratives.",
      bookCount: 9,
    },
    {
      id: 41,
      name: "James Clear",
      bio: "Writer on behavior change and sustainable habits.",
      bookCount: 6,
    },
  ],
});

type PaginatedHomeItems<TItem> = {
  items: TItem[];
  page: number;
  limit: number;
  hasMore: boolean;
};

function toCollectionState<TItem>(items: TItem[]): HomeDiscoveryCollectionState<TItem> {
  return items.length === 0 ? { status: "empty" } : { status: "ready", items };
}

function toPaginatedCollectionState<TItem>(page: PaginatedHomeItems<TItem>): HomeDiscoveryPaginatedCollectionState<TItem> {
  return page.items.length === 0 ? { status: "empty" } : { status: "ready", ...page };
}

async function readHomeCategories(locale: AppLocale) {
  const payload = runtimeConfig.authE2eFixtureMode
    ? homeCategoriesFixture
    : await getCategories(createDiscoveryApiClient(locale));

  return mapCategoriesCollectionDtoToSummaries(payload).map((category) =>
    mapCategorySummaryToPresentation(category, locale),
  );
}

async function readHomeRecommendations(locale: AppLocale): Promise<PaginatedHomeItems<ReturnType<typeof mapBookSummaryToPresentation>>> {
  const limit = discoveryLimitDefaults.recommendations;
  const payload = runtimeConfig.authE2eFixtureMode
    ? homeRecommendedBooksCollectionFixture
    : await getRecommendedBooks(createDiscoveryApiClient(locale), {
        by: "rating",
        page: 1,
        limit,
      });
  const page = mapBooksCollectionDtoToPage(payload, limit);

  return {
    items: page.items.map((book) => mapBookSummaryToPresentation(book, { locale })),
    page: page.page,
    limit: page.limit,
    hasMore: page.hasMore,
  };
}

async function readHomePopularAuthors(locale: AppLocale) {
  const payload = runtimeConfig.authE2eFixtureMode
    ? homePopularAuthorsFixture
    : await getPopularAuthors(createDiscoveryApiClient(locale), {
        limit: discoveryLimitDefaults.authorsPopular,
      });

  return mapAuthorsCollectionDtoToSummaries(payload).map((author) =>
    mapAuthorSummaryToPresentation(author, { locale }),
  );
}

export async function readHomeDiscoveryViewModel(locale: AppLocale): Promise<HomeDiscoveryViewModel> {
  const [categories, recommendations, popularAuthors] = await Promise.allSettled([
    readHomeCategories(locale),
    readHomeRecommendations(locale),
    readHomePopularAuthors(locale),
  ]);

  return {
    categories: categories.status === "fulfilled" ? toCollectionState(categories.value) : { status: "error" },
    recommendations:
      recommendations.status === "fulfilled"
        ? toPaginatedCollectionState(recommendations.value)
        : { status: "error" },
    popularAuthors:
      popularAuthors.status === "fulfilled"
        ? toCollectionState(popularAuthors.value)
        : { status: "error" },
  };
}