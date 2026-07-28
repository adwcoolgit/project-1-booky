"use client";

import { cn } from "@/shared/lib/utils";

export type LoadMoreButtonLabels = {
  idle: string;
  pending: string;
  exhausted: string;
};

export type LoadMoreButtonProps = {
  hasMore: boolean;
  labels: LoadMoreButtonLabels;
  onLoadMore?: (() => void) | undefined;
  isPending?: boolean | undefined;
  hideWhenExhausted?: boolean | undefined;
  className?: string | undefined;
};

export function LoadMoreButton({
  hasMore,
  labels,
  onLoadMore,
  isPending = false,
  hideWhenExhausted = false,
  className,
}: LoadMoreButtonProps) {
  if (!hasMore && hideWhenExhausted) {
    return null;
  }

  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-full border border-border bg-white px-5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      disabled={!hasMore || isPending}
      onClick={() => onLoadMore?.()}
      type="button"
    >
      {isPending ? labels.pending : hasMore ? labels.idle : labels.exhausted}
    </button>
  );
}