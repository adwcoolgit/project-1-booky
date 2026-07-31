"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { mapLoanFromCartResponseDtoToResult } from "@/entities/loan";
import type { BorrowConfirmationResult } from "@/entities/loan";
import { cartQueryKeys } from "@/features/cart/model/cart-query-keys";
import { useCartSelectionStore } from "@/features/cart/model/cart-selection.store";
import { confirmLoanFromCart, createCheckoutBffClient } from "@/features/checkout/api";
import type { LoanFromCartRequestDto } from "@/features/checkout/api/schemas";
import type { AppLocale } from "@/shared/i18n/config";

const checkoutBffClient = createCheckoutBffClient();

// Not read via `queryClient.getQueryData`/a query key: per data-model.md, the
// confirmation result is mutation data, retrieved on the success screen via
// `useMutationState({ filters: { mutationKey: loanFromCartMutationKey } })`,
// which persists in the same QueryClient's mutation cache across the
// `/checkout` -> `/checkout/success` navigation.
export const loanFromCartMutationKey = ["loans", "fromCart"] as const;

export function useLoanFromCartMutation({ locale }: { locale: AppLocale }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...loanFromCartMutationKey],
    mutationFn: async (request: LoanFromCartRequestDto): Promise<BorrowConfirmationResult> => {
      const payload = await confirmLoanFromCart(checkoutBffClient, request);

      return mapLoanFromCartResponseDtoToResult(payload);
    },
    onSuccess: (result) => {
      // Applies regardless of business outcome: `removedFromCart` rows must
      // disappear from the cart/selection immediately (they no longer exist
      // server-side), while `failed` ids are deliberately left untouched so
      // they stay selected/actionable as long as a cart refetch still shows
      // them as present and eligible.
      if (result.removedCartItemIds.length > 0) {
        useCartSelectionStore.getState().deselectMany(result.removedCartItemIds);
      }

      void queryClient.invalidateQueries({ queryKey: [locale, ...cartQueryKeys.current()] });
      void queryClient.invalidateQueries({ queryKey: [locale, ...cartQueryKeys.checkout()] });
    },
  });
}
