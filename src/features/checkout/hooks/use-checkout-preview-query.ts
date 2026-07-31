"use client";

import { useQuery } from "@tanstack/react-query";

import { mapCartCheckoutResponseDtoToPreview, mapCheckoutPreviewToPresentation, type CheckoutPreviewPresentation } from "@/entities/checkout";
import { cartQueryKeys } from "@/features/cart/model/cart-query-keys";
import { createCheckoutBffClient, getCartCheckout } from "@/features/checkout/api";
import type { AppLocale } from "@/shared/i18n/config";

const checkoutBffClient = createCheckoutBffClient();

export function useCheckoutPreviewQuery({
  locale,
  initialPreview,
}: {
  locale: AppLocale;
  initialPreview?: CheckoutPreviewPresentation | undefined;
}) {
  return useQuery({
    queryKey: [locale, ...cartQueryKeys.checkout()],
    queryFn: async (): Promise<CheckoutPreviewPresentation> => {
      const payload = await getCartCheckout(checkoutBffClient);
      const preview = mapCartCheckoutResponseDtoToPreview(payload);

      return mapCheckoutPreviewToPresentation(preview, { locale });
    },
    ...(initialPreview ? { initialData: initialPreview } : {}),
  });
}
