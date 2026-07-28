import type { BookDetail, BookSummary } from "@/entities/book/model";
import type { BookReviewPage } from "@/entities/review/model";
import { extractCollectionItems, extractSingleItem, isTransportRecord } from "@/shared/lib/transport/partial-response";

type BookMapperReference = {
  id?: unknown;
  name?: unknown;
} | null;

type BookMapperDto = {
  id?: unknown;
  title?: unknown;
  description?: unknown;
  coverImage?: unknown;
  rating?: unknown;
  reviewCount?: unknown;
  totalCopies?: unknown;
  availableCopies?: unknown;
  borrowCount?: unknown;
  authorId?: unknown;
  authorName?: unknown;
  categoryId?: unknown;
  categoryName?: unknown;
  author?: BookMapperReference;
  category?: BookMapperReference;
  pageCount?: unknown;
};

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function normalizeText(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function normalizeCoverImage(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function normalizeNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function resolveReferenceName(reference: BookMapperReference) {
  return normalizeText(reference?.name);
}

function resolveReferenceId(reference: BookMapperReference) {
  return isPositiveInteger(reference?.id) ? reference.id : null;
}

function resolveAuthorName(dto: BookMapperDto): string | null {
  return normalizeText(dto.authorName) ?? resolveReferenceName(dto.author ?? null);
}

function resolveCategoryName(dto: BookMapperDto): string | null {
  return normalizeText(dto.categoryName) ?? resolveReferenceName(dto.category ?? null);
}

function resolveAuthorId(dto: BookMapperDto): number | null {
  if (isPositiveInteger(dto.authorId)) {
    return dto.authorId;
  }

  return resolveReferenceId(dto.author ?? null);
}

function resolveCategoryId(dto: BookMapperDto): number | null {
  if (isPositiveInteger(dto.categoryId)) {
    return dto.categoryId;
  }

  return resolveReferenceId(dto.category ?? null);
}

export function omitUnsupportedBookFields<T extends object>(payload: T): Omit<T, "pageCount"> {
  const next = { ...payload } as T & { pageCount?: unknown };

  delete next.pageCount;

  return next;
}

export function mapBookDtoToSummary(dto: BookMapperDto): BookSummary | null {
  const cleanDto = omitUnsupportedBookFields(dto);
  const id = isPositiveInteger(cleanDto.id) ? cleanDto.id : null;
  const title = normalizeText(cleanDto.title);
  const authorName = resolveAuthorName(cleanDto);

  if (!id || !title || !authorName) {
    return null;
  }

  return {
    id,
    title,
    authorId: resolveAuthorId(cleanDto),
    authorName,
    categoryId: resolveCategoryId(cleanDto),
    categoryName: resolveCategoryName(cleanDto),
    coverImageUrl: normalizeCoverImage(cleanDto.coverImage),
    rating: normalizeNumber(cleanDto.rating),
    reviewCount: isNonNegativeInteger(cleanDto.reviewCount) ? cleanDto.reviewCount : null,
    availableCopies: isNonNegativeInteger(cleanDto.availableCopies) ? cleanDto.availableCopies : null,
    totalCopies: isNonNegativeInteger(cleanDto.totalCopies) ? cleanDto.totalCopies : null,
  };
}

export function mapBooksCollectionDtoToSummaries(payload: unknown): BookSummary[] {
  return extractCollectionItems<BookMapperDto>(payload, ["books"])
    .map((dto) => mapBookDtoToSummary(dto))
    .filter((book): book is BookSummary => book !== null);
}

export function mapBookDtoToDetail(
  dto: BookMapperDto,
  options: {
    reviews?: BookReviewPage | null;
    relatedBooks?: BookSummary[];
  } = {},
): BookDetail | null {
  const summary = mapBookDtoToSummary(dto);

  if (!summary) {
    return null;
  }

  return {
    summary,
    description: normalizeText(dto.description),
    borrowCount: isNonNegativeInteger(dto.borrowCount) ? dto.borrowCount : null,
    reviews: options.reviews ?? null,
    relatedBooks: options.relatedBooks ?? [],
  };
}

export function mapBookDetailResponseDtoToDetail(
  payload: unknown,
  options: {
    reviews?: BookReviewPage | null;
    relatedBooks?: BookSummary[];
  } = {},
): BookDetail | null {
  const dto = extractSingleItem<BookMapperDto>(payload, ["data", "item", "book"]);

  if (dto) {
    return mapBookDtoToDetail(dto, options);
  }

  if (isTransportRecord(payload)) {
    return mapBookDtoToDetail(payload, options);
  }

  return null;
}