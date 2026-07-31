"use client";

import { useQuery } from "@tanstack/react-query";

import { mapCartResponseDtoToServerCart, mapServerCartToPresentation, type ServerCartPresentation } from "@/entities/cart";
import { createCartBffClient, getCart } from "@/features/cart/api";
import { cartQueryKeys } from "@/features/cart/model/cart-query-keys";
import type { AppLocale } from "@/shared/i18n/config";

const cartBffClient = createCartBffClient();

// Unlike discovery's public-catalog reads, cart mutations must be observable
// end-to-end (add/remove/select/checkout all depend on a real refetch loop),
// so this hook always calls the same-origin `/api/cart` BFF route rather than
// short-circuiting to a static fixture in E2E fixture mode. E2E tests achieve
// determinism by mocking `/api/cart*` at the network layer (Playwright
// `page.route`) instead.
export function useCartQuery({
  locale,
  initialCart,
}: {
  locale: AppLocale;
  initialCart?: ServerCartPresentation | undefined;
}) {
  return useQuery({
    queryKey: [locale, ...cartQueryKeys.current()],
    queryFn: async (): Promise<ServerCartPresentation> => {
      const payload = await getCart(cartBffClient);
      const cart = mapCartResponseDtoToServerCart(payload);

      return mapServerCartToPresentation(cart, { locale });
    },
    ...(initialCart ? { initialData: initialCart } : {}),
  });
}
