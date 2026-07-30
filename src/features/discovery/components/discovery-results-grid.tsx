import { BookCard, type BookPresentation } from "@/entities/book";
import { DiscoveryPagination, type DiscoveryPaginationLabels } from "@/features/discovery/components/discovery-pagination";
import {
  DiscoveryResultsStaleNotice,
  type DiscoveryResultsStateCopy,
} from "@/features/discovery/components/discovery-results-state";
import { cn } from "@/shared/lib/utils";

export type DiscoveryResultsGridProps = {
  books: readonly BookPresentation[];
  pagination: {
    page: number;
    hasPrevious?: boolean | undefined;
    hasNext: boolean;
    labels: DiscoveryPaginationLabels;
    isPending?: boolean | undefined;
    getPageHref?: ((page: number) => string) | undefined;
    onPageChange?: ((page: number) => void) | undefined;
  };
  stateCopy: DiscoveryResultsStateCopy;
  isStale?: boolean | undefined;
  className?: string | undefined;
};

export function DiscoveryResultsGrid({
  books,
  pagination,
  stateCopy,
  isStale = false,
  className,
}: DiscoveryResultsGridProps) {
  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {isStale ? <DiscoveryResultsStaleNotice copy={stateCopy} /> : null}

      <section className="grid grid-cols-2 gap-4 sm:gap-5 xl:grid-cols-4" data-discovery-results-grid="true">
        {books.map((book, index) => (
          <BookCard
            key={book.id}
            book={book}
            coverImageLoading={index === 0 ? "eager" : undefined}
            variant="search"
          />
        ))}
      </section>

      <DiscoveryPagination
        className="pt-3"
        getPageHref={pagination.getPageHref}
        hasNext={pagination.hasNext}
        hasPrevious={pagination.hasPrevious}
        isPending={pagination.isPending}
        labels={pagination.labels}
        onPageChange={pagination.onPageChange}
        page={pagination.page}
      />
    </div>
  );
}
