export type PartialResponsePagination = {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasMore?: boolean;
};

export function isTransportRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

export function extractCollectionItems<TItem>(payload: unknown, keys: readonly string[]): TItem[] {
  if (Array.isArray(payload)) {
    return payload as TItem[];
  }

  if (!isTransportRecord(payload)) {
    return [];
  }

  for (const key of ["data", "items", ...keys]) {
    const value = payload[key];

    if (Array.isArray(value)) {
      return value as TItem[];
    }
  }

  return [];
}

export function extractSingleItem<TItem>(payload: unknown, keys: readonly string[]): TItem | null {
  if (Array.isArray(payload)) {
    return (payload[0] as TItem | undefined) ?? null;
  }

  if (!isTransportRecord(payload)) {
    return null;
  }

  for (const key of keys) {
    const value = payload[key];

    if (value !== undefined && value !== null && !Array.isArray(value)) {
      return value as TItem;
    }
  }

  return null;
}

export function extractPaginationShape(payload: unknown): PartialResponsePagination | null {
  if (!isTransportRecord(payload)) {
    return null;
  }

  for (const candidate of [payload.pagination, payload.meta, payload]) {
    if (!isTransportRecord(candidate)) {
      continue;
    }

    const page = isPositiveInteger(candidate.page) ? candidate.page : undefined;
    const limit = isPositiveInteger(candidate.limit) ? candidate.limit : undefined;
    const total = isNonNegativeInteger(candidate.total) ? candidate.total : undefined;
    const totalPages = isNonNegativeInteger(candidate.totalPages) ? candidate.totalPages : undefined;
    const hasMore = typeof candidate.hasMore === "boolean" ? candidate.hasMore : undefined;

    if (page !== undefined || limit !== undefined || total !== undefined || totalPages !== undefined || hasMore !== undefined) {
      return {
        ...(page !== undefined ? { page } : {}),
        ...(limit !== undefined ? { limit } : {}),
        ...(total !== undefined ? { total } : {}),
        ...(totalPages !== undefined ? { totalPages } : {}),
        ...(hasMore !== undefined ? { hasMore } : {}),
      };
    }
  }

  return null;
}