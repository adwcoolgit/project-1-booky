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
    "inline-flex h-10 min-w-[9.375rem] items-center justify-center rounded-full border border-border px-4 text-sm font-bold leading-7 tracking-[-0.02em] transition sm:h-11 sm:min-w-[10.5rem] md:h-12 md:min-w-[11.25rem] md:text-[15px] md:leading-7 lg:min-w-[12rem] lg:text-base lg:leading-[30px] xl:min-w-[12.5rem]",
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
