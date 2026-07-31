"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addToCart, createCartBffClient } from "@/features/cart/api";
import { cartQueryKeys } from "@/features/cart/model/cart-query-keys";
import type { AppLocale } from "@/shared/i18n/config";

const cartBffClient = createCartBffClient();

export function useAddToCartMutation({ locale }: { locale: AppLocale }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookId: number) => addToCart(cartBffClient, bookId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [locale, ...cartQueryKeys.current()] });
    },
  });
}
