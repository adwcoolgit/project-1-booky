import { z } from "zod";

import type { CategorySummary } from "@/entities/category/model";
import { discoveryLimitDefaults, type DiscoveryQueryState } from "@/features/discovery/model/discovery-query";
import { normalizeDiscoverySearchParams, type DiscoverySearchInput } from "@/features/discovery/model/discovery-search-params";
import { createIdBackedSlug } from "@/shared/lib/slug";

export const categoryRouteParamsSchema = z.object({
  slug: z.string().trim().min(1),
});

export type CategoryRouteParams = z.infer<typeof categoryRouteParamsSchema>;

export function createCategorySlug(name: string, id: number) {
  return createIdBackedSlug(name, id, "category");
}

export function resolveCategoryBySlug(slug: string, categories: readonly CategorySummary[]): CategorySummary | null {
  return categories.find((category) => category.slug === slug) ?? null;
}

export type CategoryRouteState = Omit<DiscoveryQueryState, "authorId"> & {
  authorId: null;
  slug: string;
};

export function normalizeCategoryRouteState(
  input: DiscoverySearchInput,
  resolvedCategory: CategorySummary,
  defaultLimit = discoveryLimitDefaults.books,
): CategoryRouteState {
  const normalized = normalizeDiscoverySearchParams(input, {
    defaultLimit,
  });

  return {
    q: undefined,
    categoryId: resolvedCategory.id,
    authorId: null,
    minRating: normalized.minRating,
    page: normalized.page,
    limit: normalized.limit,
    slug: resolvedCategory.slug,
  };
}

export function createCategoryRouteSearchParams(
  state: Pick<CategoryRouteState, "minRating" | "page" | "limit">,
  defaultLimit = discoveryLimitDefaults.books,
) {
  const params = new URLSearchParams();

  if (state.minRating !== null) {
    params.set("minRating", String(state.minRating));
  }

  if (state.page !== 1) {
    params.set("page", String(state.page));
  }

  if (state.limit !== defaultLimit) {
    params.set("limit", String(state.limit));
  }

  return params;
}