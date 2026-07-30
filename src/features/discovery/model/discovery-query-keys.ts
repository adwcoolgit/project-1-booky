import {
  discoveryLimitDefaults,
  discoveryLimitSchema,
  discoveryMinRatingSchema,
  discoveryPageDefault,
  discoveryPageSchema,
  recommendationModeSchema,
  type AuthorsListQuery,
  type AuthorsPopularQuery,
  type AuthorBooksQuery,
  type DiscoveryListQuery,
  type RecommendationQuery,
  type ReviewsQuery,
} from "@/features/discovery/model/discovery-query";
import { collapseSearchText } from "@/features/discovery/model/discovery-search-params";
import { positiveIntegerSchema } from "@/shared/lib/zod/positive-int";

function compactRecord<TValue>(record: Record<string, TValue | null | undefined>) {
  return Object.fromEntries(
    Object.entries(record).filter(([, value]) => value !== undefined && value !== null && value !== ""),
  );
}

function parseIdOrUndefined(value: unknown) {
  const result = positiveIntegerSchema.safeParse(value);

  return result.success ? result.data : undefined;
}

function parsePageOrDefault(value: unknown) {
  const result = discoveryPageSchema.safeParse(value);

  return result.success ? result.data : discoveryPageDefault;
}

function parseLimitOrDefault(value: unknown, fallback: number) {
  const result = discoveryLimitSchema.safeParse(value);

  return result.success ? result.data : fallback;
}

function parseMinRatingOrUndefined(value: unknown) {
  const result = discoveryMinRatingSchema.safeParse(value);

  return result.success ? result.data : undefined;
}

function normalizeBooksListKey(input: Partial<DiscoveryListQuery> = {}) {
  return compactRecord({
    q: collapseSearchText(input.q),
    categoryId: parseIdOrUndefined(input.categoryId),
    authorId: parseIdOrUndefined(input.authorId),
    minRating: parseMinRatingOrUndefined(input.minRating),
    page: parsePageOrDefault(input.page),
    limit: parseLimitOrDefault(input.limit, discoveryLimitDefaults.books),
  });
}

function normalizeRecommendationKey(input: Partial<RecommendationQuery> = {}) {
  const by = recommendationModeSchema.safeParse(input.by);

  return compactRecord({
    by: by.success ? by.data : "rating",
    categoryId: parseIdOrUndefined(input.categoryId),
    page: parsePageOrDefault(input.page),
    limit: parseLimitOrDefault(input.limit, discoveryLimitDefaults.recommendations),
  });
}

function normalizeAuthorsListKey(input: Partial<AuthorsListQuery> = {}) {
  return compactRecord({
    q: collapseSearchText(input.q),
  });
}

function normalizeAuthorsPopularKey(input: Partial<AuthorsPopularQuery> = {}) {
  return compactRecord({
    limit: parseLimitOrDefault(input.limit, discoveryLimitDefaults.authorsPopular),
  });
}

function normalizeAuthorBooksKey(authorId: number, input: Partial<AuthorBooksQuery> = {}) {
  return compactRecord({
    authorId: positiveIntegerSchema.parse(authorId),
    page: parsePageOrDefault(input.page),
    limit: parseLimitOrDefault(input.limit, discoveryLimitDefaults.authorBooks),
  });
}

function normalizeBookReviewsKey(bookId: number, input: Partial<ReviewsQuery> = {}) {
  return compactRecord({
    bookId: positiveIntegerSchema.parse(bookId),
    page: parsePageOrDefault(input.page),
    limit: parseLimitOrDefault(input.limit, discoveryLimitDefaults.reviews),
  });
}

export const discoveryQueryKeys = {
  books: {
    all: () => ["books"] as const,
    list: (input: Partial<DiscoveryListQuery> = {}) => ["books", "list", normalizeBooksListKey(input)] as const,
    recommend: (input: Partial<RecommendationQuery> = {}) =>
      ["books", "recommend", normalizeRecommendationKey(input)] as const,
    detail: (bookId: number) => ["books", "detail", { bookId: positiveIntegerSchema.parse(bookId) }] as const,
  },
  authors: {
    all: () => ["authors"] as const,
    list: (input: Partial<AuthorsListQuery> = {}) => ["authors", "list", normalizeAuthorsListKey(input)] as const,
    popular: (input: Partial<AuthorsPopularQuery> = {}) =>
      ["authors", "popular", normalizeAuthorsPopularKey(input)] as const,
    books: (authorId: number, input: Partial<AuthorBooksQuery> = {}) =>
      ["authors", "books", normalizeAuthorBooksKey(authorId, input)] as const,
  },
  categories: {
    all: () => ["categories"] as const,
    list: () => ["categories", "list"] as const,
  },
  reviews: {
    all: () => ["reviews"] as const,
    book: (bookId: number, input: Partial<ReviewsQuery> = {}) =>
      ["reviews", "book", normalizeBookReviewsKey(bookId, input)] as const,
  },
} as const;