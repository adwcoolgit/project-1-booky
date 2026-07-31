"use client";

import TrashIcon from "@iconify-react/tabler/trash";
import Image from "next/image";

import type { CartRowPresentation } from "@/entities/cart";
import { useRemoveCartItemMutation } from "@/features/cart/hooks/use-remove-cart-item-mutation";
import type { AppLocale } from "@/shared/i18n/config";
import { cn } from "@/shared/lib/utils";

export type CartRowCopy = {
  select: string;
  remove: string;
  removeError: string;
};

export type CartRowProps = {
  row: CartRowPresentation;
  locale: AppLocale;
  copy: CartRowCopy;
  isSelected: boolean;
  onToggleSelect: (cartItemId: number) => void;
  className?: string | undefined;
};

export function CartRow({ row, locale, copy, isSelected, onToggleSelect, className }: CartRowProps) {
  const removeMutation = useRemoveCartItemMutation({ locale });

  return (
    <li
      className={cn(
        "flex items-start gap-4 py-4 first:pt-0 last:pb-0",
        // Ineligible rows are visually distinguished with a tinted
        // background rather than reduced opacity: opacity would also fade
        // the ineligible-reason text and other row content toward the page
        // background, dropping it below the WCAG AA contrast threshold.
        !row.isEligible && "-mx-3 rounded-xs bg-muted/40 px-3",
        className,
      )}
      data-cart-row={row.cartItemId}
      data-cart-row-eligible={row.isEligible}
      data-cart-row-selected={isSelected}
    >
      <input
        aria-label={`${copy.select} ${row.title}`}
        checked={isSelected}
        className="mt-1 h-5 w-5 shrink-0 rounded-xs border-neutral-400 accent-brand focus:outline-brand disabled:cursor-not-allowed disabled:opacity-50"
        data-cart-row-select={row.cartItemId}
        disabled={!row.isEligible}
        onChange={() => onToggleSelect(row.cartItemId)}
        type="checkbox"
      />

      <div
        className={cn(
          "relative h-cart-cover-h w-cart-cover-w shrink-0 overflow-hidden lg:h-cart-cover-h-lg lg:w-cart-cover-w-lg",
          row.coverImage.isFallback ? "bg-brand-subtle" : "bg-muted/50",
        )}
      >
        <Image
          alt={row.coverImage.alt}
          className="h-full w-full object-cover"
          fill
          sizes="(min-width: 1024px) 92px, 70px"
          src={row.coverImage.src}
          unoptimized
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {row.categoryLabel ? (
          <span className="inline-flex w-fit items-center rounded-xs border border-neutral-300 px-2 text-sm font-bold leading-7 tracking-tight2 text-neutral-950">
            {row.categoryLabel}
          </span>
        ) : null}
        <p className="line-clamp-1 text-base font-bold leading-7 tracking-tight2 text-neutral-950 lg:text-lg lg:leading-8 lg:tracking-tight3">
          {row.title}
        </p>
        {row.authorName ? (
          <p className="text-sm font-medium leading-7 tracking-tight3 text-neutral-700 lg:text-base lg:leading-7.5">
            {row.authorName}
          </p>
        ) : null}
        {!row.isEligible && row.ineligibleReasonLabel ? (
          <p className="text-sm font-medium text-danger-accent" role="status">
            {row.ineligibleReasonLabel}
          </p>
        ) : null}
        {removeMutation.isError ? (
          <p className="text-sm font-medium text-danger-accent" role="alert">
            {copy.removeError}
          </p>
        ) : null}
      </div>

      <button
        aria-label={copy.remove}
        className="shrink-0 rounded-full p-2 text-neutral-500 transition hover:bg-muted hover:text-danger-accent disabled:pointer-events-none disabled:opacity-60"
        data-cart-row-remove={row.cartItemId}
        disabled={removeMutation.isPending}
        onClick={() => removeMutation.mutate(row.cartItemId)}
        type="button"
      >
        <TrashIcon aria-hidden="true" className="h-5 w-5" />
      </button>
    </li>
  );
}
