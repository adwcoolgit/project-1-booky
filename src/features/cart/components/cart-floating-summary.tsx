"use client";

import Link from "next/link";

import type { AppLocale } from "@/shared/i18n/config";
import { cn } from "@/shared/lib/utils";

export type CartFloatingSummaryCopy = {
  totalBookLabel: string;
  checkout: string;
};

export type CartFloatingSummaryProps = {
  itemCountLabel: string;
  locale: AppLocale;
  copy: CartFloatingSummaryCopy;
  canCheckout: boolean;
  className?: string | undefined;
};

// Mirrors the mobile-only fixed action bar pattern used by the book detail
// page's add-to-cart action, replacing the sidebar `CartSummary` card (which
// only renders at `lg:` and up) below the desktop breakpoint.
export function CartFloatingSummary({
  itemCountLabel,
  locale,
  copy,
  canCheckout,
  className,
}: CartFloatingSummaryProps) {
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white p-4 shadow-card-lg lg:hidden",
        className,
      )}
      data-cart-floating-summary="true"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-sm font-medium leading-7 tracking-tight3 text-neutral-950">
            {copy.totalBookLabel}
          </span>
          <span className="text-sm font-bold leading-7 tracking-tight2 text-neutral-950">{itemCountLabel}</span>
        </div>

        {canCheckout ? (
          <Link
            className="inline-flex h-10 w-cart-cta items-center justify-center rounded-full bg-brand text-sm font-bold leading-7 tracking-tight2 text-white transition hover:brightness-95"
            data-cart-checkout-link-mobile="true"
            href={`/${locale}/checkout`}
          >
            {copy.checkout}
          </Link>
        ) : (
          <button
            aria-disabled="true"
            className="inline-flex h-10 w-cart-cta cursor-not-allowed items-center justify-center rounded-full bg-brand text-sm font-bold leading-7 tracking-tight2 text-white opacity-60"
            data-cart-checkout-blocked-mobile="true"
            disabled
            type="button"
          >
            {copy.checkout}
          </button>
        )}
      </div>
    </div>
  );
}
