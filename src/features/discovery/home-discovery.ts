import "server-only";

import {
  mapAuthorSummaryToPresentation,
  mapAuthorsCollectionDtoToSummaries,
} from "@/entities/author";
import {
  mapBookSummaryToPresentation,
  mapBooksCollectionDtoToSummaries,
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
  HomeDiscoveryViewModel,
} from "@/features/discovery/model/home-discovery";
import { runtimeConfig } from "@/shared/config/runtime";
import type { AppLocale } from "@/shared/i18n/config";

const homeCategoriesFixture = Object.freeze({
  categories: [
    { id: 7, name: "Science Fiction" },
    { id: 8, name: "History" },
    { id: 9, name: "Personal Growth" },
    { id: 10, name: "Philosophy" },
  ],
});

const homeRecommendationsFixture = Object.freeze({
  data: [
    {
      id: 101,
      title: "The Left Hand of Darkness",
      description: "A classic about politics, culture, and winter.",
      coverImage: null,
      rating: 4.7,
      reviewCount: 128,
      totalCopies: 12,
      availableCopies: 4,
      authorId: 21,
      authorName: "Ursula K. Le Guin",
      categoryId: 7,
      categoryName: "Science Fiction",
    },
    {
      id: 201,
      title: "Sapiens",
      description: "A brief history of humankind.",
      coverImage: null,
      rating: 4.8,
      reviewCount: 245,
      totalCopies: 14,
      availableCopies: 6,
      authorId: 31,
      authorName: "Yuval Noah Harari",
      categoryId: 8,
      categoryName: "History",
    },
    {
      id: 301,
      title: "Atomic Habits",
      description: "Practical guidance for building better routines.",
      coverImage: null,
      rating: 4.9,
      reviewCount: 302,
      totalCopies: 16,
      availableCopies: 5,
      authorId: 41,
      authorName: "James Clear",
      categoryId: 9,
      categoryName: "Personal Growth",
    },
    {
      id: 401,
      title: "Meditations",
      description: "Stoic reflections from Marcus Aurelius.",
      coverImage: null,
      rating: 4.6,
      reviewCount: 188,
      totalCopies: 10,
      availableCopies: 3,
      authorId: 51,
      authorName: "Marcus Aurelius",
      categoryId: 10,
      categoryName: "Philosophy",
    },
  ],
  pagination: {
    page: 1,
    limit: discoveryLimitDefaults.recommendations,
    total: 4,
    totalPages: 1,
    hasMore: false,
  },
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

function toCollectionState<TItem>(items: TItem[]): HomeDiscoveryCollectionState<TItem> {
  return items.length === 0 ? { status: "empty" } : { status: "ready", items };
}

async function readHomeCategories(locale: AppLocale) {
  const payload = runtimeConfig.authE2eFixtureMode
    ? homeCategoriesFixture
    : await getCategories(createDiscoveryApiClient(locale));

  return mapCategoriesCollectionDtoToSummaries(payload).map((category) =>
    mapCategorySummaryToPresentation(category, locale),
  );
}

async function readHomeRecommendations(locale: AppLocale) {
  const payload = runtimeConfig.authE2eFixtureMode
    ? homeRecommendationsFixture
    : await getRecommendedBooks(createDiscoveryApiClient(locale), {
        by: "rating",
        page: 1,
        limit: discoveryLimitDefaults.recommendations,
      });

  return mapBooksCollectionDtoToSummaries(payload).map((book) =>
    mapBookSummaryToPresentation(book, { locale }),
  );
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
        ? toCollectionState(recommendations.value)
        : { status: "error" },
    popularAuthors:
      popularAuthors.status === "fulfilled"
        ? toCollectionState(popularAuthors.value)
        : { status: "error" },
  };
}