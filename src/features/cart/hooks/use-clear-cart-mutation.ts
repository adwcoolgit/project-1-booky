"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { clearCart, createCartBffClient } from "@/features/cart/api";
import { useCartSelectionStore } from "@/features/cart/model/cart-selection.store";
import { cartQueryKeys } from "@/features/cart/model/cart-query-keys";
import type { AppLocale } from "@/shared/i18n/config";

const cartBffClient = createCartBffClient();

export function useClearCartMutation({ locale }: { locale: AppLocale }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => clearCart(cartBffClient),
    onSuccess: () => {
      useCartSelectionStore.getState().clear();
      void queryClient.invalidateQueries({ queryKey: [locale, ...cartQueryKeys.current()] });
    },
  });
}
