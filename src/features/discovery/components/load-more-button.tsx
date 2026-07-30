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
        "inline-flex h-10 min-w-[9.375rem] items-center justify-center rounded-full border border-border bg-white px-4 text-sm font-bold leading-7 tracking-[-0.02em] text-foreground shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-[10rem] md:min-w-[10.5rem] lg:h-12 lg:min-w-[12rem] lg:px-5 lg:text-base lg:leading-[30px]",
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