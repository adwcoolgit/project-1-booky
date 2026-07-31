"use client";

import Link from "next/link";

import { useClearCartMutation } from "@/features/cart/hooks/use-clear-cart-mutation";
import type { AppLocale } from "@/shared/i18n/config";
import { cn } from "@/shared/lib/utils";

export type CartSummaryCopy = {
  clear: string;
  clearError: string;
  checkout: string;
  checkoutBlocked: string;
  totalBookLabel: string;
};

export type CartSummaryProps = {
  title: string;
  itemCountLabel: string;
  locale: AppLocale;
  copy: CartSummaryCopy;
  selectedEligibleCount: number;
  className?: string | undefined;
};

export function CartSummary({
  title,
  itemCountLabel,
  locale,
  copy,
  selectedEligibleCount,
  className,
}: CartSummaryProps) {
  const clearMutation = useClearCartMutation({ locale });
  const canCheckout = selectedEligibleCount > 0;

  return (
    <section
      className={cn(
        "hidden flex-col gap-6 rounded-2xl bg-white p-5 shadow-card-lg lg:flex lg:w-cart-summary",
        className,
      )}
      data-cart-summary="true"
    >
      <h2 className="text-xl font-bold leading-8.5 tracking-tight2 text-neutral-950">{title}</h2>

      <div className="flex items-center justify-between text-base leading-7.5 tracking-tight3 text-neutral-950">
        <span className="font-medium">{copy.totalBookLabel}</span>
        <span className="font-bold tracking-tight2">{itemCountLabel}</span>
      </div>

      <div className="flex flex-col gap-3">
        {canCheckout ? (
          <Link
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-brand text-base font-bold leading-7.5 tracking-tight2 text-white transition hover:brightness-95"
            data-cart-checkout-link="true"
            href={`/${locale}/checkout`}
          >
            {copy.checkout}
          </Link>
        ) : (
          <button
            aria-disabled="true"
            className="inline-flex h-12 w-full cursor-not-allowed items-center justify-center rounded-full bg-brand text-base font-bold leading-7.5 tracking-tight2 text-white opacity-60"
            data-cart-checkout-blocked="true"
            disabled
            type="button"
          >
            {copy.checkout}
          </button>
        )}
        {!canCheckout ? (
          <p className="text-sm text-text-muted" role="status">
            {copy.checkoutBlocked}
          </p>
        ) : null}

        <button
          className="inline-flex items-center justify-center text-sm font-semibold text-text-muted underline-offset-2 transition hover:text-neutral-950 hover:underline disabled:pointer-events-none disabled:opacity-60"
          data-cart-clear="true"
          disabled={clearMutation.isPending}
          onClick={() => clearMutation.mutate()}
          type="button"
        >
          {copy.clear}
        </button>
        {clearMutation.isError ? (
          <p className="text-sm font-medium text-danger-accent" role="alert">
            {copy.clearError}
          </p>
        ) : null}
      </div>
    </section>
  );
}
