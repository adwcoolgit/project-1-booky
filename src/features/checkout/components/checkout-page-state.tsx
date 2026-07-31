"use client";

import { cn } from "@/shared/lib/utils";

export type CheckoutPageStateCopy = {
  loading: string;
  error: { title: string; description: string; retry: string };
};

export type CheckoutPageStateVariant = "loading" | "error";

export function CheckoutPageState({
  state,
  copy,
  onRetry,
  className,
}: {
  state: CheckoutPageStateVariant;
  copy: CheckoutPageStateCopy;
  onRetry?: (() => void) | undefined;
  className?: string | undefined;
}) {
  if (state === "loading") {
    return (
      <div
        aria-busy="true"
        className={cn("rounded-[16px] border border-dashed border-border bg-white/90 p-5", className)}
        role="status"
      >
        <p className="text-sm text-text-muted">{copy.loading}</p>
      </div>
    );
  }

  return (
    <div
      className={cn("rounded-[16px] border border-dashed border-border bg-white/90 p-5 shadow-sm", className)}
      data-checkout-page-state={state}
      role="alert"
    >
      <h2 className="text-lg font-semibold text-foreground">{copy.error.title}</h2>
      <p className="mt-2 max-w-prose text-sm text-text-muted">{copy.error.description}</p>
      {onRetry ? (
        <button
          className="mt-4 inline-flex rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95"
          onClick={() => onRetry()}
          type="button"
        >
          {copy.error.retry}
        </button>
      ) : null}
    </div>
  );
}
