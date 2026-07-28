import {
  discoveryLimitDefaults,
  discoveryPageDefault,
  type DiscoveryQueryState,
} from "@/features/discovery/model/discovery-query";
import { positiveIntegerSchema } from "@/shared/lib/zod/positive-int";

export type DiscoverySearchInput =
  | URLSearchParams
  | {
      get: (name: string) => string | null | undefined;
    }
  | Record<string, unknown>;

export type NormalizeDiscoverySearchParamsOptions = {
  defaultPage?: number;
  defaultLimit?: number;
};

function readSearchParamValue(input: DiscoverySearchInput, key: string): unknown {
  if (typeof (input as { get?: unknown }).get === "function") {
    return (input as { get: (name: string) => string | null | undefined }).get(key) ?? undefined;
  }

  const record = input as Record<string, unknown>;
  const value = record[key];

  return Array.isArray(value) ? value[0] : value;
}

export function collapseSearchText(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim().replace(/\s+/g, " ");

  return normalized.length > 0 ? normalized : undefined;
}

function parseOptionalPositiveInteger(value: unknown): number | null {
  const result = positiveIntegerSchema.safeParse(value);

  return result.success ? result.data : null;
}

function parseOptionalMinRating(value: unknown): number | null {
  const candidate = typeof value === "string" ? Number(value) : value;

  if (typeof candidate !== "number" || !Number.isInteger(candidate) || candidate < 1 || candidate > 5) {
    return null;
  }

  return candidate;
}

export function normalizeDiscoverySearchParams(
  input: DiscoverySearchInput,
  options: NormalizeDiscoverySearchParamsOptions = {},
): DiscoveryQueryState {
  const defaultPage = options.defaultPage ?? discoveryPageDefault;
  const defaultLimit = options.defaultLimit ?? discoveryLimitDefaults.books;
  const q = collapseSearchText(readSearchParamValue(input, "q"));
  const categoryId = parseOptionalPositiveInteger(readSearchParamValue(input, "categoryId"));
  const authorId = parseOptionalPositiveInteger(readSearchParamValue(input, "authorId"));
  const minRating = parseOptionalMinRating(readSearchParamValue(input, "minRating"));
  const page = parseOptionalPositiveInteger(readSearchParamValue(input, "page")) ?? defaultPage;
  const limit = parseOptionalPositiveInteger(readSearchParamValue(input, "limit")) ?? defaultLimit;

  return {
    ...(q ? { q } : {}),
    categoryId,
    authorId,
    minRating,
    page,
    limit,
  };
}

export function applyDiscoverySearchPatch(
  current: DiscoveryQueryState,
  patch: Partial<DiscoveryQueryState>,
  options: NormalizeDiscoverySearchParamsOptions = {},
): DiscoveryQueryState {
  const next: DiscoveryQueryState = {
    ...current,
    ...patch,
  };
  const shouldResetPage =
    (patch.q !== undefined && patch.q !== current.q) ||
    (patch.categoryId !== undefined && patch.categoryId !== current.categoryId) ||
    (patch.authorId !== undefined && patch.authorId !== current.authorId) ||
    (patch.minRating !== undefined && patch.minRating !== current.minRating);

  if (shouldResetPage) {
    next.page = options.defaultPage ?? discoveryPageDefault;
  }

  return normalizeDiscoverySearchParams(next, options);
}

export function createDiscoverySearchParams(
  state: DiscoveryQueryState,
  options: NormalizeDiscoverySearchParamsOptions = {},
): URLSearchParams {
  const defaultPage = options.defaultPage ?? discoveryPageDefault;
  const defaultLimit = options.defaultLimit ?? discoveryLimitDefaults.books;
  const params = new URLSearchParams();

  if (state.q) {
    params.set("q", state.q);
  }

  if (state.categoryId !== null) {
    params.set("categoryId", String(state.categoryId));
  }

  if (state.authorId !== null) {
    params.set("authorId", String(state.authorId));
  }

  if (state.minRating !== null) {
    params.set("minRating", String(state.minRating));
  }

  if (state.page !== defaultPage) {
    params.set("page", String(state.page));
  }

  if (state.limit !== defaultLimit) {
    params.set("limit", String(state.limit));
  }

  return params;
}