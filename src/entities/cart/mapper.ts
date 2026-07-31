import type { CartRow, ServerCart } from "@/entities/cart/model";
import { extractCollectionItems, isTransportRecord } from "@/shared/lib/transport/partial-response";

type CartItemBookReference = {
  name?: unknown;
} | null;

type CartItemMapperBook = {
  title?: unknown;
  coverImage?: unknown;
  availableCopies?: unknown;
  authorName?: unknown;
  categoryName?: unknown;
  author?: CartItemBookReference;
  category?: CartItemBookReference;
} | null;

type CartItemMapperDto = {
  id?: unknown;
  bookId?: unknown;
  book?: CartItemMapperBook;
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

function resolveReferenceName(reference: CartItemBookReference): string | null {
  return normalizeText(reference?.name);
}

function resolveAuthorName(book: CartItemMapperBook): string | null {
  if (!book) {
    return null;
  }

  return normalizeText(book.authorName) ?? resolveReferenceName(book.author ?? null);
}

function resolveCategoryLabel(book: CartItemMapperBook): string | null {
  if (!book) {
    return null;
  }

  return normalizeText(book.categoryName) ?? resolveReferenceName(book.category ?? null);
}

function deriveEligibility(dto: CartItemMapperDto): CartRow["eligibility"] {
  const bookId = isPositiveInteger(dto.bookId) ? dto.bookId : null;
  const title = normalizeText(dto.book?.title);

  if (!bookId || !title) {
    return { status: "ineligible", reason: "stale" };
  }

  const availableCopies = dto.book?.availableCopies;

  if (isNonNegativeInteger(availableCopies) && availableCopies <= 0) {
    return { status: "ineligible", reason: "unavailable" };
  }

  return { status: "eligible" };
}

export function mapCartItemDtoToRow(dto: CartItemMapperDto): CartRow | null {
  const cartItemId = isPositiveInteger(dto.id) ? dto.id : null;
  const bookId = isPositiveInteger(dto.bookId) ? dto.bookId : null;

  if (!cartItemId || !bookId) {
    return null;
  }

  return {
    cartItemId,
    bookId,
    title: normalizeText(dto.book?.title) ?? "",
    authorName: resolveAuthorName(dto.book ?? null),
    categoryLabel: resolveCategoryLabel(dto.book ?? null),
    coverImageUrl: normalizeText(dto.book?.coverImage),
    eligibility: deriveEligibility(dto),
  };
}

export function mapCartItemsCollectionDtoToRows(payload: unknown): CartRow[] {
  return extractCollectionItems<CartItemMapperDto>(payload, ["items", "cart"])
    .map((dto) => mapCartItemDtoToRow(dto))
    .filter((row): row is CartRow => row !== null);
}

function resolveItemCount(payload: unknown, rows: CartRow[]): number {
  if (isTransportRecord(payload) && isNonNegativeInteger(payload.itemCount)) {
    return payload.itemCount;
  }

  return rows.length;
}

export function mapCartResponseDtoToServerCart(payload: unknown): ServerCart {
  const rows = mapCartItemsCollectionDtoToRows(payload);

  return {
    rows,
    itemCount: resolveItemCount(payload, rows),
  };
}

export function mapCartCheckoutResponseDtoToServerCart(payload: unknown): ServerCart {
  return mapCartResponseDtoToServerCart(payload);
}
