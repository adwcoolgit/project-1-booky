import type { BorrowConfirmationOutcome, BorrowConfirmationResult, BorrowedLoanSummary, FailedCartItem } from "@/entities/loan/model";
import { extractCollectionItems, isTransportRecord } from "@/shared/lib/transport/partial-response";

type CartItemIdCarrier = {
  cartItemId?: unknown;
  itemId?: unknown;
  id?: unknown;
};

type LoanMapperDto = CartItemIdCarrier & {
  bookTitle?: unknown;
  book?: { title?: unknown } | null;
  borrowedAt?: unknown;
  dueAt?: unknown;
  returnByMessage?: unknown;
};

type FailedMapperDto = CartItemIdCarrier & {
  reason?: unknown;
  reasonCode?: unknown;
  message?: unknown;
};

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function normalizeText(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function resolveCartItemId(dto: CartItemIdCarrier): number | null {
  if (isPositiveInteger(dto.cartItemId)) {
    return dto.cartItemId;
  }

  if (isPositiveInteger(dto.itemId)) {
    return dto.itemId;
  }

  if (isPositiveInteger(dto.id)) {
    return dto.id;
  }

  return null;
}

function mapLoanDtoToSummary(dto: LoanMapperDto): BorrowedLoanSummary {
  return {
    cartItemId: resolveCartItemId(dto),
    bookTitle: normalizeText(dto.bookTitle) ?? normalizeText(dto.book?.title),
    borrowedAt: normalizeText(dto.borrowedAt),
    dueAt: normalizeText(dto.dueAt),
    returnByMessage: normalizeText(dto.returnByMessage),
  };
}

function mapFailedDtoToItem(dto: FailedMapperDto): FailedCartItem | null {
  const cartItemId = resolveCartItemId(dto);

  if (!cartItemId) {
    return null;
  }

  return {
    cartItemId,
    reasonCode: normalizeText(dto.reasonCode) ?? normalizeText(dto.reason) ?? normalizeText(dto.message),
  };
}

function mapRemovedEntryToCartItemId(entry: unknown): number | null {
  if (isPositiveInteger(entry)) {
    return entry;
  }

  if (isTransportRecord(entry)) {
    return resolveCartItemId(entry);
  }

  return null;
}

export function mapLoanFromCartResponseDtoToResult(payload: unknown): BorrowConfirmationResult {
  const succeeded = extractCollectionItems<LoanMapperDto>(payload, ["loans"]).map(mapLoanDtoToSummary);
  const failed = extractCollectionItems<FailedMapperDto>(payload, ["failed"])
    .map(mapFailedDtoToItem)
    .filter((item): item is FailedCartItem => item !== null);
  const removedCartItemIds = extractCollectionItems<unknown>(payload, ["removedFromCart"])
    .map(mapRemovedEntryToCartItemId)
    .filter((id): id is number => id !== null);

  return { succeeded, failed, removedCartItemIds };
}

export function resolveBorrowConfirmationOutcome(result: BorrowConfirmationResult): BorrowConfirmationOutcome {
  // `removedFromCart` also reports cart rows the server converted into
  // successful loans, so it is not itself a failure signal — only `failed`
  // distinguishes success from partial/failed outcomes.
  if (result.failed.length === 0) {
    return "success";
  }

  if (result.succeeded.length > 0) {
    return "partial";
  }

  return "failed";
}
