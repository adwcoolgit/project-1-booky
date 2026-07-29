export type PartialResponsePagination = {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasMore?: boolean;
};

const nestedEnvelopeKeys = ["data", "items"] as const;

export function isTransportRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function collectRecordCandidates(payload: Record<string, unknown>) {
  const candidates = [payload];

  for (const key of nestedEnvelopeKeys) {
    const value = payload[key];

    if (isTransportRecord(value)) {
      candidates.push(value);
    }
  }

  return candidates;
}

export function extractCollectionItems<TItem>(payload: unknown, keys: readonly string[]): TItem[] {
  if (Array.isArray(payload)) {
    return payload as TItem[];
  }

  if (!isTransportRecord(payload)) {
    return [];
  }

  for (const candidate of collectRecordCandidates(payload)) {
    for (const key of ["data", "items", ...keys]) {
      const value = candidate[key];

      if (Array.isArray(value)) {
        return value as TItem[];
      }
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

  const candidates = collectRecordCandidates(payload);
  const directKeys = keys.filter((key) => !nestedEnvelopeKeys.includes(key as (typeof nestedEnvelopeKeys)[number]));
  const envelopeKeys = keys.filter((key) => nestedEnvelopeKeys.includes(key as (typeof nestedEnvelopeKeys)[number]));

  for (const keyGroup of [directKeys, envelopeKeys]) {
    for (const candidate of candidates) {
      for (const key of keyGroup) {
        const value = candidate[key];

        if (value !== undefined && value !== null && !Array.isArray(value)) {
          return value as TItem;
        }
      }
    }
  }

  return null;
}

export function extractPaginationShape(payload: unknown): PartialResponsePagination | null {
  if (!isTransportRecord(payload)) {
    return null;
  }

  const candidates: unknown[] = [];

  for (const candidate of collectRecordCandidates(payload)) {
    candidates.push(candidate.pagination, candidate.meta, candidate);
  }

  for (const candidate of candidates) {
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