"use client";

import { DiscoveryPagination, type DiscoveryPaginationLabels } from "@/features/discovery/components/discovery-pagination";
import { cn } from "@/shared/lib/utils";

export type DiscoveryResultsStateCopy = {
  loading: {
    title: string;
    description: string;
  };
  empty: {
    title: string;
    description: string;
  };
  error: {
    title: string;
    description: string;
    retry: string;
  };
  stale: {
    badge: string;
    description: string;
  };
};

export type DiscoveryResultsStateVariant = "loading" | "empty" | "error";

export type DiscoveryResultsStateProps = {
  state: DiscoveryResultsStateVariant;
  copy: DiscoveryResultsStateCopy;
  className?: string | undefined;
  isStale?: boolean | undefined;
  onRetry?: (() => void) | undefined;
  pagination?: {
    page: number;
    hasPrevious?: boolean | undefined;
    hasNext: boolean;
    labels: DiscoveryPaginationLabels;
    getPageHref: (page: number) => string;
  } | undefined;
};

export function DiscoveryResultsStaleNotice({
  copy,
  className,
}: {
  copy: DiscoveryResultsStateCopy;
  className?: string | undefined;
}) {
  return (
    <div className={cn("rounded-3xl border border-border bg-brand-subtle px-4 py-3", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-brand">
          {copy.stale.badge}
        </span>
        <p className="text-sm text-foreground">{copy.stale.description}</p>
      </div>
    </div>
  );
}

export function DiscoveryResultsState({
  state,
  copy,
  className,
  isStale = false,
  onRetry,
  pagination,
}: DiscoveryResultsStateProps) {
  const variantCopy = copy[state];

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {isStale ? <DiscoveryResultsStaleNotice copy={copy} /> : null}
      <div
        aria-busy={state === "loading" ? true : undefined}
        className="rounded-4xl border border-dashed border-border bg-white/90 p-5 shadow-sm"
        data-discovery-results-state={state}
        role={state === "error" ? "alert" : undefined}
      >
        {state === "loading" ? (
          <div aria-hidden="true" className="mb-4 space-y-3">
            <div className="h-4 w-28 rounded-full bg-muted" />
            <div className="h-10 rounded-3xl bg-muted/70" />
            <div className="h-20 rounded-3xl bg-muted/50" />
          </div>
        ) : null}
        <h2 className="text-lg font-semibold text-foreground">{variantCopy.title}</h2>
        <p className="mt-2 max-w-prose text-sm text-text-muted">{variantCopy.description}</p>
        {state === "error" && onRetry ? (
          <button
            className="mt-4 inline-flex rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95"
            onClick={() => onRetry()}
            type="button"
          >
            {copy.error.retry}
          </button>
        ) : null}
      </div>
      {pagination && state === "empty" ? (
        <DiscoveryPagination
          getPageHref={pagination.getPageHref}
          hasNext={pagination.hasNext}
          hasPrevious={pagination.hasPrevious}
          labels={pagination.labels}
          page={pagination.page}
        />
      ) : null}
    </div>
  );
}