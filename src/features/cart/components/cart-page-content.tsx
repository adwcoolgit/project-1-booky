"use client";

import type { ServerCartPresentation } from "@/entities/cart";
import { CartFloatingSummary } from "@/features/cart/components/cart-floating-summary";
import { CartPageState, type CartPageStateCopy } from "@/features/cart/components/cart-page-state";
import { CartRowList } from "@/features/cart/components/cart-row-list";
import type { CartRowCopy } from "@/features/cart/components/cart-row";
import { CartSelectAll } from "@/features/cart/components/cart-select-all";
import { CartSummary, type CartSummaryCopy } from "@/features/cart/components/cart-summary";
import { useCartQuery } from "@/features/cart/hooks/use-cart-query";
import { useCartSelection } from "@/features/cart/hooks/use-cart-selection";
import type { AppLocale } from "@/shared/i18n/config";

export type CartPageContentCopy = CartPageStateCopy & {
  summaryTitle: string;
  selectAll: string;
  row: CartRowCopy;
  summary: CartSummaryCopy;
};

export function CartPageContent({
  locale,
  initialCart,
  copy,
}: {
  locale: AppLocale;
  initialCart: ServerCartPresentation | undefined;
  copy: CartPageContentCopy;
}) {
  const query = useCartQuery({ locale, initialCart });
  const selection = useCartSelection(query.data?.rows);

  if (query.isPending) {
    return <CartPageState copy={copy} state="loading" />;
  }

  if (query.isError || !query.data) {
    return <CartPageState copy={copy} onRetry={() => void query.refetch()} state="error" />;
  }

  if (query.data.rows.length === 0) {
    return <CartPageState copy={copy} state="empty" />;
  }

  const selectedEligibleCount = selection.eligibleCartItemIds.filter((id) =>
    selection.selectedCartItemIds.has(id),
  ).length;

  return (
    <div className="flex flex-col gap-6 pb-24 lg:flex-row lg:items-start lg:justify-center lg:gap-10 lg:pb-0">
      <div className="flex flex-1 flex-col gap-4 lg:gap-6">
        <CartSelectAll
          eligibleCount={selection.eligibleCartItemIds.length}
          label={copy.selectAll}
          onClear={selection.clear}
          onSelectAll={selection.selectAllEligible}
          selectedEligibleCount={selectedEligibleCount}
        />
        <CartRowList
          copy={copy.row}
          isSelected={selection.isSelected}
          locale={locale}
          onToggleSelect={selection.toggle}
          rows={query.data.rows}
        />
      </div>
      <CartSummary
        copy={copy.summary}
        itemCountLabel={query.data.itemCountLabel}
        locale={locale}
        selectedEligibleCount={selectedEligibleCount}
        title={copy.summaryTitle}
      />
      <CartFloatingSummary
        canCheckout={selectedEligibleCount > 0}
        copy={copy.summary}
        itemCountLabel={query.data.itemCountLabel}
        locale={locale}
      />
    </div>
  );
}
