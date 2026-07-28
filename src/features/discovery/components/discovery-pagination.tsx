"use client";

import Link from "next/link";

import { cn } from "@/shared/lib/utils";

export type DiscoveryPaginationLabels = {
  previous: string;
  next: string;
  page: (page: number) => string;
};

export type DiscoveryPaginationProps = {
  page: number;
  hasPrevious?: boolean | undefined;
  hasNext: boolean;
  labels: DiscoveryPaginationLabels;
  className?: string | undefined;
  isPending?: boolean | undefined;
  getPageHref?: ((page: number) => string) | undefined;
  onPageChange?: ((page: number) => void) | undefined;
};

type PaginationActionProps = {
  label: string;
  disabled: boolean;
  href?: string | undefined;
  onActivate?: (() => void) | undefined;
};

function PaginationAction({ label, disabled, href, onActivate }: PaginationActionProps) {
  const className = cn(
    "inline-flex h-11 min-w-[7rem] items-center justify-center rounded-full border px-4 text-sm font-semibold transition",
    disabled
      ? "cursor-not-allowed border-border/60 text-text-muted opacity-60"
      : "border-border text-foreground hover:bg-muted",
  );

  if (!disabled && href) {
    return (
      <Link className={className} href={href} scroll={false}>
        {label}
      </Link>
    );
  }

  return (
    <button className={className} disabled={disabled} onClick={() => onActivate?.()} type="button">
      {label}
    </button>
  );
}

export function DiscoveryPagination({
  page,
  hasPrevious = page > 1,
  hasNext,
  labels,
  className,
  isPending = false,
  getPageHref,
  onPageChange,
}: DiscoveryPaginationProps) {
  const previousPage = Math.max(page - 1, 1);
  const nextPage = page + 1;

  return (
    <nav
      aria-label={labels.page(page)}
      className={cn(
        "flex flex-col items-stretch justify-between gap-3 rounded-[24px] border border-border/70 bg-white p-4 shadow-sm sm:flex-row sm:items-center",
        className,
      )}
    >
      <PaginationAction
        disabled={!hasPrevious || isPending}
        href={hasPrevious && getPageHref ? getPageHref(previousPage) : undefined}
        label={labels.previous}
        onActivate={hasPrevious && onPageChange ? () => onPageChange(previousPage) : undefined}
      />
      <p className="text-center text-sm font-medium text-text-muted">{labels.page(page)}</p>
      <PaginationAction
        disabled={!hasNext || isPending}
        href={hasNext && getPageHref ? getPageHref(nextPage) : undefined}
        label={labels.next}
        onActivate={hasNext && onPageChange ? () => onPageChange(nextPage) : undefined}
      />
    </nav>
  );
}