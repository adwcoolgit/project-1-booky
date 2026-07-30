"use client";

import Link from "next/link";

import { cn } from "@/shared/lib/utils";

export type DiscoveryPaginationLabels = {
  loadMore: string;
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
    "inline-flex h-12 min-w-[12.5rem] items-center justify-center rounded-full border border-border px-4 text-base font-bold leading-[30px] tracking-[-0.02em] transition",
    disabled
      ? "cursor-not-allowed text-text-muted opacity-60"
      : "text-foreground hover:bg-muted",
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
  hasNext,
  labels,
  className,
  isPending = false,
  getPageHref,
  onPageChange,
}: DiscoveryPaginationProps) {
  const nextPage = page + 1;

  if (!hasNext && !isPending) {
    return null;
  }

  return (
    <nav
      aria-label={labels.page(page)}
      className={cn("flex justify-center", className)}
    >
      <PaginationAction
        disabled={!hasNext || isPending}
        href={hasNext && getPageHref ? getPageHref(nextPage) : undefined}
        label={labels.loadMore}
        onActivate={hasNext && onPageChange ? () => onPageChange(nextPage) : undefined}
      />
    </nav>
  );
}
