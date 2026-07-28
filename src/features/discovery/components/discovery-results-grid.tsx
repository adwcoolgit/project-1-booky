import { BookCard, type BookPresentation } from "@/entities/book";
import { DiscoveryPagination, type DiscoveryPaginationLabels } from "@/features/discovery/components/discovery-pagination";
import {
  DiscoveryResultsStaleNotice,
  type DiscoveryResultsStateCopy,
} from "@/features/discovery/components/discovery-results-state";
import { cn } from "@/shared/lib/utils";

export type DiscoveryCriteriaItem = {
  label: string;
  value: string;
};

export type DiscoveryResultsGridProps = {
  books: readonly BookPresentation[];
  criteriaTitle: string;
  criteriaFallback: string;
  criteria: readonly DiscoveryCriteriaItem[];
  pagination: {
    page: number;
    hasPrevious?: boolean | undefined;
    hasNext: boolean;
    labels: DiscoveryPaginationLabels;
    getPageHref: (page: number) => string;
  };
  stateCopy: DiscoveryResultsStateCopy;
  isStale?: boolean | undefined;
  className?: string | undefined;
};

export function DiscoveryResultsGrid({
  books,
  criteriaTitle,
  criteriaFallback,
  criteria,
  pagination,
  stateCopy,
  isStale = false,
  className,
}: DiscoveryResultsGridProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {isStale ? <DiscoveryResultsStaleNotice copy={stateCopy} /> : null}
      <section className="rounded-4xl border border-border bg-white p-5 shadow-sm" data-discovery-criteria="true">
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-brand">{criteriaTitle}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {criteria.length > 0 ? (
            criteria.map((item) => (
              <span
                key={`${item.label}-${item.value}`}
                className="inline-flex rounded-full border border-border bg-muted px-3 py-1.5 text-sm text-foreground"
              >
                <span className="font-semibold">{item.label}:</span>
                <span className="ml-2">{item.value}</span>
              </span>
            ))
          ) : (
            <p className="text-sm text-text-muted">{criteriaFallback}</p>
          )}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4" data-discovery-results-grid="true">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </section>

      <DiscoveryPagination
        getPageHref={pagination.getPageHref}
        hasNext={pagination.hasNext}
        hasPrevious={pagination.hasPrevious}
        labels={pagination.labels}
        page={pagination.page}
      />
    </div>
  );
}