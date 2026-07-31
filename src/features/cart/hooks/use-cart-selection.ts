"use client";

import { useEffect, useMemo } from "react";

import type { CartRowPresentation } from "@/entities/cart";
import { useCartSelectionStore } from "@/features/cart/model/cart-selection.store";

export function useCartSelection(rows: readonly CartRowPresentation[] | undefined) {
  const selectedCartItemIds = useCartSelectionStore((state) => state.selectedCartItemIds);
  const toggle = useCartSelectionStore((state) => state.toggle);
  const selectAllEligible = useCartSelectionStore((state) => state.selectAllEligible);
  const reconcile = useCartSelectionStore((state) => state.reconcile);
  const clear = useCartSelectionStore((state) => state.clear);

  const eligibleCartItemIds = useMemo(
    () => (rows ?? []).filter((row) => row.isEligible).map((row) => row.cartItemId),
    [rows],
  );

  // Whenever fresh cart data arrives (initial load, refetch, or post-mutation
  // invalidation), drop any selected id that no longer exists or is no
  // longer eligible — never invent or preserve a stale selection.
  useEffect(() => {
    if (rows === undefined) {
      return;
    }

    reconcile(eligibleCartItemIds);
  }, [rows, eligibleCartItemIds, reconcile]);

  return {
    selectedCartItemIds,
    isSelected: (cartItemId: number) => selectedCartItemIds.has(cartItemId),
    toggle,
    // Re-evaluates eligibility against the current `rows` prop at the moment
    // of activation, never a stale snapshot (2026-07-31 clarification).
    selectAllEligible: () => selectAllEligible(eligibleCartItemIds),
    clear,
    eligibleCartItemIds,
  };
}
