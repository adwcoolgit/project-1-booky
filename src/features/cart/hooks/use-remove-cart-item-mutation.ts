"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createCartBffClient, removeCartItem } from "@/features/cart/api";
import { useCartSelectionStore } from "@/features/cart/model/cart-selection.store";
import { cartQueryKeys } from "@/features/cart/model/cart-query-keys";
import type { AppLocale } from "@/shared/i18n/config";

const cartBffClient = createCartBffClient();

export function useRemoveCartItemMutation({ locale }: { locale: AppLocale }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartItemId: number) => removeCartItem(cartBffClient, cartItemId),
    onSuccess: (_data, cartItemId) => {
      useCartSelectionStore.getState().deselect(cartItemId);
      void queryClient.invalidateQueries({ queryKey: [locale, ...cartQueryKeys.current()] });
    },
  });
}
