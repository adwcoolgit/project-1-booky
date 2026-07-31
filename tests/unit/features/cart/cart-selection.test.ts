import { beforeEach, describe, expect, it } from "vitest";

import { mapCartItemsCollectionDtoToRows } from "@/entities/cart/mapper";
import { useCartSelectionStore } from "@/features/cart/model/cart-selection.store";
import { createDuplicateBookCartFixture } from "@/../tests/fixtures/cart/cart-fixtures";

function resetStore() {
  useCartSelectionStore.setState({ selectedCartItemIds: new Set() });
}

describe("cart selection store", () => {
  beforeEach(() => {
    resetStore();
  });

  it("keys selection by cartItemId, never by bookId, for duplicate-book rows", () => {
    const rows = mapCartItemsCollectionDtoToRows(createDuplicateBookCartFixture());

    expect(rows).toHaveLength(2);
    expect(rows[0]?.bookId).toBe(rows[1]?.bookId);

    const [first, second] = rows;

    if (!first || !second) {
      throw new Error("Expected two duplicate-book rows in the fixture.");
    }

    useCartSelectionStore.getState().toggle(first.cartItemId);

    expect(useCartSelectionStore.getState().selectedCartItemIds.has(first.cartItemId)).toBe(true);
    expect(useCartSelectionStore.getState().selectedCartItemIds.has(second.cartItemId)).toBe(false);

    useCartSelectionStore.getState().toggle(second.cartItemId);

    expect(useCartSelectionStore.getState().selectedCartItemIds.has(first.cartItemId)).toBe(true);
    expect(useCartSelectionStore.getState().selectedCartItemIds.has(second.cartItemId)).toBe(true);

    // Deselecting one duplicate row must never affect the other, since they
    // are distinct CartItem identities that merely share a bookId.
    useCartSelectionStore.getState().toggle(first.cartItemId);

    expect(useCartSelectionStore.getState().selectedCartItemIds.has(first.cartItemId)).toBe(false);
    expect(useCartSelectionStore.getState().selectedCartItemIds.has(second.cartItemId)).toBe(true);
  });

  it("toggle adds and removes a single cartItemId without touching others", () => {
    useCartSelectionStore.getState().toggle(501);
    useCartSelectionStore.getState().toggle(502);

    expect([...useCartSelectionStore.getState().selectedCartItemIds].sort()).toEqual([501, 502]);

    useCartSelectionStore.getState().toggle(501);

    expect([...useCartSelectionStore.getState().selectedCartItemIds]).toEqual([502]);
  });

  it("selectAllEligible replaces the selection with exactly the given eligible ids", () => {
    useCartSelectionStore.getState().toggle(999); // pre-existing, unrelated selection

    useCartSelectionStore.getState().selectAllEligible([501, 502]);

    expect([...useCartSelectionStore.getState().selectedCartItemIds].sort()).toEqual([501, 502]);
  });

  it("deselect removes exactly one known id and leaves the rest untouched", () => {
    useCartSelectionStore.setState({ selectedCartItemIds: new Set([501, 502, 503]) });

    useCartSelectionStore.getState().deselect(502);

    expect([...useCartSelectionStore.getState().selectedCartItemIds].sort()).toEqual([501, 503]);
  });

  it("reconcile drops ids no longer present or eligible, keeping the rest", () => {
    useCartSelectionStore.setState({ selectedCartItemIds: new Set([501, 502, 503]) });

    useCartSelectionStore.getState().reconcile([501, 503]);

    expect([...useCartSelectionStore.getState().selectedCartItemIds].sort()).toEqual([501, 503]);
  });

  it("clear empties the selection entirely", () => {
    useCartSelectionStore.setState({ selectedCartItemIds: new Set([501, 502]) });

    useCartSelectionStore.getState().clear();

    expect(useCartSelectionStore.getState().selectedCartItemIds.size).toBe(0);
  });
});
