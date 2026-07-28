import type { BookSummary } from "@/entities/book/model";
import { mapBookDtoToSummary } from "@/entities/book/mapper";
import type { AuthorBookCollection, PopularAuthorSummary } from "@/entities/author/model";
import { extractCollectionItems, extractPaginationShape, isTransportRecord, type PartialResponsePagination } from "@/shared/lib/transport/partial-response";

type AuthorMapperDto = {
  id?: unknown;
  name?: unknown;
  bio?: unknown;
  bookCount?: unknown;
};

type BookMapperDto = Parameters<typeof mapBookDtoToSummary>[0];

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function normalizeText(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
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

export function mapAuthorDtoToSummary(dto: AuthorMapperDto): PopularAuthorSummary | null {
  const id = isPositiveInteger(dto.id) ? dto.id : null;
  const name = normalizeText(dto.name);

  if (!id || !name) {
    return null;
  }

  return {
    id,
    name,
    bio: normalizeText(dto.bio),
    bookCount: isNonNegativeInteger(dto.bookCount) ? dto.bookCount : null,
    portrait: null,
  };
}

export function mapAuthorsCollectionDtoToSummaries(payload: unknown): PopularAuthorSummary[] {
  return extractCollectionItems<AuthorMapperDto>(payload, ["authors"])
    .map((dto) => mapAuthorDtoToSummary(dto))
    .filter((author): author is PopularAuthorSummary => author !== null);
}

export function mapAuthorBooksResponseDtoToCollection(payload: unknown, fallbackLimit = 12): AuthorBookCollection | null {
  const authorDto = isTransportRecord(payload) ? ((payload.author as AuthorMapperDto | undefined) ?? null) : null;
  const author = authorDto ? mapAuthorDtoToSummary(authorDto) : null;

  if (!author) {
    return null;
  }

  const books = extractCollectionItems<BookMapperDto>(payload, ["books"])
    .map((dto) => mapBookDtoToSummary(dto))
    .filter((book): book is BookSummary => book !== null);
  const pagination = derivePaginationState(extractPaginationShape(payload), fallbackLimit);

  return {
    author,
    books,
    page: pagination.page,
    limit: pagination.limit,
    hasMore: pagination.hasMore,
  };
}