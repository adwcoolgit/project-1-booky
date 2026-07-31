"use client";

import { useAddToCartMutation } from "@/features/cart/hooks/use-add-to-cart-mutation";
import type { AppLocale } from "@/shared/i18n/config";
import { cn } from "@/shared/lib/utils";

export type AddToCartButtonCopy = {
  idle: string;
  pending: string;
  added: string;
  error: string;
};

export type AddToCartButtonProps = {
  bookId: number;
  locale: AppLocale;
  copy: AddToCartButtonCopy;
  className?: string | undefined;
  disabled?: boolean | undefined;
};

export function AddToCartButton({ bookId, locale, copy, className, disabled = false }: AddToCartButtonProps) {
  const mutation = useAddToCartMutation({ locale });
  const isDisabled = disabled || mutation.isPending || mutation.isSuccess;
  const label = mutation.isSuccess ? copy.added : mutation.isPending ? copy.pending : copy.idle;

  const button = (
    <button
      className={cn(
        className,
        "border border-border bg-white text-neutral-950 hover:bg-neutral-50",
        isDisabled ? "pointer-events-none opacity-70" : null,
      )}
      data-add-to-cart-button={bookId}
      disabled={isDisabled}
      onClick={() => mutation.mutate(bookId)}
      type="button"
    >
      {label}
    </button>
  );

  if (!mutation.isError) {
    return button;
  }

  return (
    <div className="flex flex-col items-start gap-1">
      {button}
      <p className="text-sm font-medium text-danger-accent" role="alert">
        {copy.error}
      </p>
    </div>
  );
}
