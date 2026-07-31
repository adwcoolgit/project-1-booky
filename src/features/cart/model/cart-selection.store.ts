import { create } from "zustand";

type CartSelectionState = {
  selectedCartItemIds: ReadonlySet<number>;
  toggle: (cartItemId: number) => void;
  selectAllEligible: (eligibleCartItemIds: readonly number[]) => void;
  deselect: (cartItemId: number) => void;
  deselectMany: (cartItemIds: readonly number[]) => void;
  clear: () => void;
  reconcile: (currentEligibleCartItemIds: readonly number[]) => void;
};

export const useCartSelectionStore = create<CartSelectionState>((set) => ({
  selectedCartItemIds: new Set<number>(),
  toggle: (cartItemId) =>
    set((state) => {
      const next = new Set(state.selectedCartItemIds);

      if (next.has(cartItemId)) {
        next.delete(cartItemId);
      } else {
        next.add(cartItemId);
      }

      return { selectedCartItemIds: next };
    }),
  selectAllEligible: (eligibleCartItemIds) => set({ selectedCartItemIds: new Set(eligibleCartItemIds) }),
  deselect: (cartItemId) =>
    set((state) => {
      if (!state.selectedCartItemIds.has(cartItemId)) {
        return state;
      }

      const next = new Set(state.selectedCartItemIds);

      next.delete(cartItemId);

      return { selectedCartItemIds: next };
    }),
  deselectMany: (cartItemIds) =>
    set((state) => {
      if (cartItemIds.length === 0) {
        return state;
      }

      const removeSet = new Set(cartItemIds);
      const next = new Set([...state.selectedCartItemIds].filter((cartItemId) => !removeSet.has(cartItemId)));

      return { selectedCartItemIds: next };
    }),
  clear: () => set({ selectedCartItemIds: new Set() }),
  reconcile: (currentEligibleCartItemIds) =>
    set((state) => {
      const eligibleIds = new Set(currentEligibleCartItemIds);
      const next = new Set([...state.selectedCartItemIds].filter((cartItemId) => eligibleIds.has(cartItemId)));

      return { selectedCartItemIds: next };
    }),
}));
