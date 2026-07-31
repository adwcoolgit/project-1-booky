"use client";

import { useCartQuery } from "@/features/cart/hooks/use-cart-query";
import type { AppLocale } from "@/shared/i18n/config";

export function useCartSummary({
  locale,
  initialCount,
}: {
  locale: AppLocale;
  initialCount?: number | undefined;
}) {
  const query = useCartQuery({ locale });
  const itemCount = query.data ? (query.data.itemCount ?? query.data.rows.length) : (initialCount ?? 0);

  return { itemCount };
}
