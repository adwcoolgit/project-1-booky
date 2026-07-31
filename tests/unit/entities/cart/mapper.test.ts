import { describe, expect, it } from "vitest";

import {
  mapCartItemDtoToRow,
  mapCartItemsCollectionDtoToRows,
  mapCartResponseDtoToServerCart,
} from "@/entities/cart/mapper";
import {
  createDuplicateBookCartFixture,
  createMixedEligibilityCartFixture,
} from "@/../tests/fixtures/cart/cart-fixtures";

describe("entities/cart mapper", () => {
  it("keeps two rows that reference the same bookId as distinct CartItem rows", () => {
    const rows = mapCartItemsCollectionDtoToRows(createDuplicateBookCartFixture());

    expect(rows).toHaveLength(2);
    expect(rows[0]?.bookId).toBe(rows[1]?.bookId);
    expect(rows[0]?.cartItemId).not.toBe(rows[1]?.cartItemId);
  });

  it("never derives a row's identity from bookId when cartItemId is missing", () => {
    const row = mapCartItemDtoToRow({ bookId: 101 });

    expect(row).toBeNull();
  });

  it("marks a row ineligible/unavailable when the book has zero available copies", () => {
    const rows = mapCartItemsCollectionDtoToRows(createMixedEligibilityCartFixture());
    const unavailableRow = rows.find((row) => row.bookId === 201);

    expect(unavailableRow?.eligibility).toEqual({ status: "ineligible", reason: "unavailable" });
  });

  it("marks a row ineligible/stale when its book reference cannot be resolved", () => {
    const rows = mapCartItemsCollectionDtoToRows(createMixedEligibilityCartFixture());
    const staleRow = rows.find((row) => row.bookId === 301);

    expect(staleRow?.eligibility).toEqual({ status: "ineligible", reason: "stale" });
  });

  it("marks a normally-stocked row eligible", () => {
    const rows = mapCartItemsCollectionDtoToRows(createMixedEligibilityCartFixture());
    const eligibleRow = rows.find((row) => row.bookId === 101);

    expect(eligibleRow?.eligibility).toEqual({ status: "eligible" });
  });

  it("falls back to rows.length when the response omits itemCount", () => {
    const cart = mapCartResponseDtoToServerCart({
      items: [{ id: 1, bookId: 10, book: { title: "Book", availableCopies: 1 } }],
    });

    expect(cart.itemCount).toBe(1);
  });

  it("uses the documented itemCount field when present", () => {
    const cart = mapCartResponseDtoToServerCart({ items: [], itemCount: 4 });

    expect(cart.itemCount).toBe(4);
  });
});
