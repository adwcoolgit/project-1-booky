import type { BookReviewPage, BookReviewSummary } from "@/entities/review/model";
import { extractCollectionItems, extractPaginationShape, type PartialResponsePagination } from "@/shared/lib/transport/partial-response";

type ReviewMapperDto = {
  id?: unknown;
  bookId?: unknown;
  reviewerName?: unknown;
  star?: unknown;
  comment?: unknown;
  createdAt?: unknown;
};

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function normalizeText(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function deriveReviewId(dto: ReviewMapperDto, bookId: number, page: number, index: number) {
  if (typeof dto.id === "string" && dto.id.trim().length > 0) {
    return dto.id;
  }

  if (typeof dto.id === "number" && Number.isInteger(dto.id) && dto.id > 0) {
    return String(dto.id);
  }

  return `review-${bookId}-${page}-${index + 1}`;
}

function derivePaginationState(pagination: PartialResponsePagination | null, fallbackLimit: number) {
  return {
    page: pagination?.page ?? 1,
    limit: pagination?.limit ?? fallbackLimit,
    hasMore:
      pagination?.hasMore ??
      (typeof pagination?.totalPages === "number" && typeof pagination.page === "number"
        ? pagination.page < pagination.totalPages
        : false),
  };
}

export function mapReviewDtoToSummary(
  dto: ReviewMapperDto,
  options: {
    fallbackBookId: number;
    page: number;
    index: number;
  },
): BookReviewSummary | null {
  const bookId = isPositiveInteger(dto.bookId) ? dto.bookId : options.fallbackBookId;
  const star = typeof dto.star === "number" && Number.isInteger(dto.star) && dto.star >= 1 && dto.star <= 5 ? dto.star : null;

  if (!bookId || !star) {
    return null;
  }

  return {
    id: deriveReviewId(dto, bookId, options.page, options.index),
    bookId,
    reviewerName: normalizeText(dto.reviewerName),
    star,
    comment: normalizeText(dto.comment),
    createdAt: normalizeText(dto.createdAt),
  };
}

export function mapReviewsCollectionDtoToPage(
  payload: unknown,
  options: {
    bookId: number;
    fallbackLimit?: number;
  },
): BookReviewPage {
  const pagination = derivePaginationState(extractPaginationShape(payload), options.fallbackLimit ?? 10);
  const items = extractCollectionItems<ReviewMapperDto>(payload, ["reviews"]).map((dto, index) =>
    mapReviewDtoToSummary(dto, {
      fallbackBookId: options.bookId,
      page: pagination.page,
      index,
    }),
  );

  return {
    items: items.filter((item): item is BookReviewSummary => item !== null),
    page: pagination.page,
    limit: pagination.limit,
    hasMore: pagination.hasMore,
  };
}