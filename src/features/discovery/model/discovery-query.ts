import { z } from "zod";

import { createPositiveIntegerSchema, positiveIntegerSchema } from "@/shared/lib/zod/positive-int";

export const discoveryPageDefault = 1 as const;
export const discoveryPageMax = 9999 as const;
export const discoveryLimitMax = 50 as const;

export const discoveryLimitDefaults = {
  books: 12,
  recommendations: 8,
  authorsPopular: 10,
  authorBooks: 2,
  reviews: 10,
} as const;

export const recommendationModeSchema = z.enum(["rating", "popular"]);
export type RecommendationMode = z.infer<typeof recommendationModeSchema>;

export const discoverySearchTextSchema = z.string().trim().min(1);
export const discoveryMinRatingSchema = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!/^\d+$/.test(trimmed)) {
      return Number.NaN;
    }

    return Number(trimmed);
  }

  return value;
}, z.number().int().min(1).max(5));

export const discoveryPageSchema = createPositiveIntegerSchema({
  min: 1,
  max: discoveryPageMax,
});

export const discoveryLimitSchema = createPositiveIntegerSchema({
  min: 1,
  max: discoveryLimitMax,
});

export const discoveryListQuerySchema = z.object({
  q: discoverySearchTextSchema.optional(),
  categoryId: positiveIntegerSchema.optional(),
  authorId: positiveIntegerSchema.optional(),
  minRating: discoveryMinRatingSchema.optional(),
  page: discoveryPageSchema.default(discoveryPageDefault),
  limit: discoveryLimitSchema.default(discoveryLimitDefaults.books),
});

export const recommendationQuerySchema = z.object({
  by: recommendationModeSchema.default("rating"),
  categoryId: positiveIntegerSchema.optional(),
  page: discoveryPageSchema.default(discoveryPageDefault),
  limit: discoveryLimitSchema.default(discoveryLimitDefaults.recommendations),
});

export const authorsListQuerySchema = z.object({
  q: discoverySearchTextSchema.optional(),
});

export const authorsPopularQuerySchema = z.object({
  limit: discoveryLimitSchema.default(discoveryLimitDefaults.authorsPopular),
});

export const authorBooksQuerySchema = z.object({
  page: discoveryPageSchema.default(discoveryPageDefault),
  limit: discoveryLimitSchema.default(discoveryLimitDefaults.authorBooks),
});

export const reviewsQuerySchema = z.object({
  page: discoveryPageSchema.default(discoveryPageDefault),
  limit: discoveryLimitSchema.default(discoveryLimitDefaults.reviews),
});

export type DiscoveryListQuery = z.infer<typeof discoveryListQuerySchema>;
export type RecommendationQuery = z.infer<typeof recommendationQuerySchema>;
export type AuthorsListQuery = z.infer<typeof authorsListQuerySchema>;
export type AuthorsPopularQuery = z.infer<typeof authorsPopularQuerySchema>;
export type AuthorBooksQuery = z.infer<typeof authorBooksQuerySchema>;
export type ReviewsQuery = z.infer<typeof reviewsQuerySchema>;

export type DiscoveryQueryState = {
  q?: string | undefined;
  categoryId: number | null;
  authorId: number | null;
  minRating: number | null;
  page: number;
  limit: number;
};