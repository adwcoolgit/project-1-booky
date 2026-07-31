"use client";

import BagFillIcon from "@iconify-react/lets-icons/bag-fill";
import Link from "next/link";

import { useCartSummary } from "@/features/cart/hooks/use-cart-summary";
import type { AppLocale } from "@/shared/i18n/config";
import { cn } from "@/shared/lib/utils";

export type CartBadgeProps = {
  locale: AppLocale;
  label: string;
  initialCount?: number | undefined;
  className?: string | undefined;
};

export function CartBadge({ locale, label, initialCount, className }: CartBadgeProps) {
  const { itemCount } = useCartSummary({ locale, initialCount });
  const badgeLabel = itemCount > 0 ? String(Math.min(itemCount, 99)) : null;

  return (
    <Link aria-label={label} className={cn("relative shrink-0", className)} href={`/${locale}/cart`}>
      <BagFillIcon aria-hidden="true" className="h-7 w-7 text-neutral-950 sm:h-[1.875rem] sm:w-[1.875rem] lg:h-8 lg:w-8" />
      {badgeLabel ? (
        <span className="absolute left-3 top-0 inline-flex h-5 min-w-5 -translate-y-1/2 items-center justify-center rounded-full bg-danger px-[5px] text-[12px] font-bold leading-[23px] tracking-[-0.02em] text-white lg:left-[18px] lg:top-[7px] lg:translate-y-0">
          {badgeLabel}
        </span>
      ) : null}
    </Link>
  );
}
