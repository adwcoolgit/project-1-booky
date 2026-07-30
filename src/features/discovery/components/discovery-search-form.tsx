"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import type { CategorySummary } from "@/entities/category";
import {
  DiscoveryFilterPanel,
  type DiscoveryFilterPanelLabels,
} from "@/features/discovery/components/discovery-filter-panel";
import { DiscoveryResultsGrid } from "@/features/discovery/components/discovery-results-grid";
import {
  DiscoveryResultsState,
  type DiscoveryResultsStateCopy,
} from "@/features/discovery/components/discovery-results-state";
import { useDiscoveryBooksLoadMore } from "@/features/discovery/hooks/use-discovery-books-load-more";
import { useDiscoverySearchParams } from "@/features/discovery/hooks/use-discovery-search-params";
import type { DiscoveryQueryState } from "@/features/discovery/model/discovery-query";
import {
  collapseSearchText,
  createCategoryRouteSearchParams,
} from "@/features/discovery/model";
import type { DiscoveryResultsViewState } from "@/features/discovery/model/discovery-results";
import type { AppLocale } from "@/shared/i18n/config";
import { cn } from "@/shared/lib/utils";

export type DiscoverySearchFormCopy = {
  filters: DiscoveryFilterPanelLabels & {
    fixedCategoryLabel: string;
  };
  criteria: {
    title: string;
    fallback: string;
    search: string;
    category: string;
    fixedCategory: string;
    minRating: string;
    page: string;
  };
  pagination: {
    loadMore: string;
    page: string;
  };
  states: DiscoveryResultsStateCopy;
};

export type DiscoverySearchFormProps = {
  locale: AppLocale;
  surface: "books" | "category";
  categories: readonly CategorySummary[];
  results: DiscoveryResultsViewState;
  copy: DiscoverySearchFormCopy;
  lockedCategory?: string | undefined;
  lockedCategoryId?: number | undefined;
  selectedCategoryId?: number | undefined;
  defaultLimit?: number | undefined;
  className?: string | undefined;
};

const searchDebounceMs = 300;

function FilterLinesIcon({ className }: { className?: string | undefined }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.333 5h13.334M5.833 10h8.334m-5.834 5h3.334"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6667"
      />
    </svg>
  );
}

type ProgressiveDiscoveryResultsProps = {
  locale: AppLocale;
  queryState: DiscoveryQueryState;
  results: Extract<DiscoveryResultsViewState, { status: "ready" | "empty" }>;
  paginationLabels: {
    loadMore: string;
    page: (page: number) => string;
  };
  stateCopy: DiscoveryResultsStateCopy;
  isStale: boolean;
};

function ProgressiveDiscoveryResults({
  locale,
  queryState,
  results,
  paginationLabels,
  stateCopy,
  isStale,
}: ProgressiveDiscoveryResultsProps) {
  const {
    books,
    pagination,
    isPending,
    isLoadMoreError,
    loadMore,
  } = useDiscoveryBooksLoadMore({
    locale,
    queryState,
    initialResults: results,
  });
  const paginationProps = {
    ...pagination,
    labels: paginationLabels,
    isPending,
    onPageChange: () => loadMore(),
  };

  return (
    <div className="min-w-0 space-y-4 md:space-y-5">
      {books.length > 0 ? (
        <DiscoveryResultsGrid
          books={books}
          isStale={isStale}
          pagination={paginationProps}
          stateCopy={stateCopy}
        />
      ) : (
        <DiscoveryResultsState
          copy={stateCopy}
          isStale={isStale}
          pagination={paginationProps}
          state="empty"
        />
      )}

      {isLoadMoreError ? (
        <p className="text-sm font-medium text-danger" role="alert">
          {stateCopy.error.description}
        </p>
      ) : null}
    </div>
  );
}

function parseOptionalInteger(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !/^\d+$/.test(value)) {
    return null;
  }

  return Number(value);
}

function parseOptionalText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : undefined;
}

export function DiscoverySearchForm({
  locale,
  surface,
  categories,
  results,
  copy,
  lockedCategory,
  lockedCategoryId,
  selectedCategoryId,
  defaultLimit,
  className,
}: DiscoverySearchFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const mobileFilterPanelId = useId();
  const { state, isPending, replaceState } = useDiscoverySearchParams({
    ...(defaultLimit ? { defaultLimit } : {}),
  });
  const [pendingSearch, setPendingSearch] = useState(state.q ?? "");
  const [isMobileCategoryFilterOpen, setIsMobileCategoryFilterOpen] = useState(false);
  const searchSyncTimeoutRef = useRef<number | null>(null);
  const categoryOptions = categories.map((category) => ({ value: String(category.id), label: category.name }));
  const isCategorySurface = surface === "category";
  const filterLabels = {
    ...copy.filters,
    applyLabel: undefined,
  };

  function clearPendingSearchSync() {
    if (searchSyncTimeoutRef.current !== null) {
      window.clearTimeout(searchSyncTimeoutRef.current);
      searchSyncTimeoutRef.current = null;
    }
  }

  useEffect(() => {
    if (surface !== "books") {
      return;
    }

    setPendingSearch(state.q ?? "");
  }, [surface, state.q]);

  useEffect(() => {
    if (surface !== "books") {
      return;
    }

    const normalizedPendingSearch = collapseSearchText(pendingSearch);

    if (normalizedPendingSearch === state.q) {
      clearPendingSearchSync();
      return;
    }

    clearPendingSearchSync();
    searchSyncTimeoutRef.current = window.setTimeout(() => {
      replaceState({
        q: normalizedPendingSearch,
        categoryId: null,
        authorId: null,
        minRating: null,
      });
      searchSyncTimeoutRef.current = null;
    }, searchDebounceMs);

    return () => {
      clearPendingSearchSync();
    };
  }, [surface, pendingSearch, state.q, replaceState]);

  function replaceCategoryRouteState({
    nextRouteCategoryId,
    nextSelectedCategoryId,
    nextMinRating,
  }: {
    nextRouteCategoryId: number | null;
    nextSelectedCategoryId: number | null;
    nextMinRating: number | null;
  }) {
    const resolvedRouteCategoryId = nextRouteCategoryId ?? lockedCategoryId ?? null;
    const nextCategory = categories.find((category) => category.id === resolvedRouteCategoryId);

    if (!nextCategory) {
      return;
    }

    const didCriteriaChange =
      resolvedRouteCategoryId !== lockedCategoryId ||
      nextSelectedCategoryId !== (selectedCategoryId ?? null) ||
      nextMinRating !== state.minRating;
    const routeMarker = "/categories/";
    const routeMarkerIndex = pathname.lastIndexOf(routeMarker);
    const nextPathname =
      routeMarkerIndex >= 0
        ? `${pathname.slice(0, routeMarkerIndex + routeMarker.length)}${nextCategory.slug}`
        : pathname;
    const nextSearchParams = createCategoryRouteSearchParams(
      {
        q: state.q,
        selectedCategoryId: nextSelectedCategoryId,
        minRating: nextMinRating,
        page: didCriteriaChange ? 1 : state.page,
        limit: state.limit,
      },
      defaultLimit,
    ).toString();
    const nextHref = nextSearchParams.length > 0 ? `${nextPathname}?${nextSearchParams}` : nextPathname;

    router.replace(nextHref, { scroll: false });
  }

  function handleSubmit(form: HTMLFormElement) {
    const formData = new FormData(form);

    if (surface === "category") {
      const nextCategoryId = parseOptionalInteger(formData.get("categoryId"));

      replaceCategoryRouteState({
        nextRouteCategoryId: nextCategoryId,
        nextSelectedCategoryId: nextCategoryId,
        nextMinRating: parseOptionalInteger(formData.get("minRating")),
      });
      return;
    }

    clearPendingSearchSync();
    replaceState({
      q: parseOptionalText(formData.get("q")),
      categoryId: null,
      authorId: null,
      minRating: null,
    });
  }

  function handleCategoryChange(nextCategoryId: string) {
    if (surface === "category") {
      const normalizedNextCategoryId = /^\d+$/.test(nextCategoryId) ? Number(nextCategoryId) : null;

      replaceCategoryRouteState({
        nextRouteCategoryId: normalizedNextCategoryId,
        nextSelectedCategoryId: normalizedNextCategoryId,
        nextMinRating: state.minRating,
      });
      return;
    }

    clearPendingSearchSync();
    replaceState({
      q: collapseSearchText(pendingSearch),
      categoryId: /^\d+$/.test(nextCategoryId) ? Number(nextCategoryId) : null,
    });
  }

  function handleMinRatingChange(nextMinRating: string) {
    const normalizedMinRating = /^\d+$/.test(nextMinRating) ? Number(nextMinRating) : null;

    if (surface === "category") {
      replaceCategoryRouteState({
        nextRouteCategoryId: lockedCategoryId ?? null,
        nextSelectedCategoryId: selectedCategoryId ?? null,
        nextMinRating: normalizedMinRating,
      });
      return;
    }

    clearPendingSearchSync();
    replaceState({
      q: collapseSearchText(pendingSearch),
      minRating: normalizedMinRating,
    });
  }

  const paginationLabels = {
    loadMore: copy.pagination.loadMore,
    page: (page: number) => copy.pagination.page.replace("{page}", String(page)),
  };
  const categoryValue =
    surface === "category"
      ? selectedCategoryId
        ? String(selectedCategoryId)
        : ""
      : state.categoryId
        ? String(state.categoryId)
        : "";
  const filterPanelClassName = isCategorySurface
    ? cn(
        isMobileCategoryFilterOpen ? "flex" : "hidden",
        "w-full lg:flex lg:w-[266px] lg:self-start",
      )
    : "w-full lg:w-[266px] lg:self-start";

  return (
    <div className={cn("flex flex-col gap-4 sm:gap-5 md:gap-6 lg:gap-8", className)} data-discovery-search-form="true">
      <div className="flex flex-col gap-4 md:gap-5 lg:grid lg:grid-cols-[266px_minmax(0,1fr)] lg:items-start lg:gap-10">
        {isCategorySurface ? (
          <button
            aria-controls={mobileFilterPanelId}
            aria-expanded={isMobileCategoryFilterOpen}
            className={cn(
              "home-card-shadow inline-flex h-[52px] w-full items-center justify-between rounded-[12px] bg-white px-3 text-left lg:hidden",
              isMobileCategoryFilterOpen ? "ring-1 ring-brand/20" : "",
            )}
            data-discovery-mobile-filter-trigger="true"
            onClick={() => {
              setIsMobileCategoryFilterOpen((current) => !current);
            }}
            type="button"
          >
            <span className="text-sm font-bold leading-7 text-neutral-950">{copy.filters.panelTitle}</span>
            <FilterLinesIcon className="h-5 w-5 shrink-0 text-neutral-950" />
          </button>
        ) : null}

        <DiscoveryFilterPanel
          categories={categoryOptions}
          categorySelectionMode={isCategorySurface ? "required" : "toggle"}
          categoryValue={categoryValue}
          className={filterPanelClassName}
          fixedCategoryLabel={copy.filters.fixedCategoryLabel}
          fixedCategoryValue={isCategorySurface ? lockedCategory : undefined}
          id={isCategorySurface ? mobileFilterPanelId : undefined}
          isPending={isPending}
          labels={filterLabels}
          minRatingValue={state.minRating ? String(state.minRating) : ""}
          onCategoryChange={handleCategoryChange}
          onMinRatingChange={handleMinRatingChange}
          onSearchChange={surface === "books" ? setPendingSearch : undefined}
          onSubmit={handleSubmit}
          searchValue={pendingSearch}
          showCategoryField={categoryOptions.length > 0}
          showPanelTitle={!isCategorySurface || !isMobileCategoryFilterOpen}
          showSearchField={surface === "books"}
        />

        <div className={cn("min-w-0", isCategorySurface ? "lg:col-start-2" : undefined)}>
          {results.status === "error" ? (
            <div className="min-w-0 space-y-4 md:space-y-5">
              <DiscoveryResultsState copy={copy.states} onRetry={() => router.refresh()} state="error" />
            </div>
          ) : (
            <ProgressiveDiscoveryResults
              isStale={isPending}
              locale={locale}
              paginationLabels={paginationLabels}
              queryState={state}
              results={results}
              stateCopy={copy.states}
            />
          )}
        </div>
      </div>
    </div>
  );
}
