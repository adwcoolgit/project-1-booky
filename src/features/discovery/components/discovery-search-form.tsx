"use client";

import { useRouter } from "next/navigation";

import type { CategorySummary } from "@/entities/category";
import {
  DiscoveryFilterPanel,
  type DiscoveryFilterPanelLabels,
} from "@/features/discovery/components/discovery-filter-panel";
import {
  DiscoveryResultsGrid,
  type DiscoveryCriteriaItem,
} from "@/features/discovery/components/discovery-results-grid";
import {
  DiscoveryResultsState,
  type DiscoveryResultsStateCopy,
} from "@/features/discovery/components/discovery-results-state";
import { useDiscoverySearchParams } from "@/features/discovery/hooks/use-discovery-search-params";
import type { DiscoveryResultsViewState } from "@/features/discovery/model/discovery-results";
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
    previous: string;
    next: string;
    page: string;
  };
  states: DiscoveryResultsStateCopy;
};

export type DiscoverySearchFormProps = {
  surface: "books" | "category";
  categories: readonly CategorySummary[];
  results: DiscoveryResultsViewState;
  copy: DiscoverySearchFormCopy;
  lockedCategory?: string | undefined;
  defaultLimit?: number | undefined;
  className?: string | undefined;
};

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
  surface,
  categories,
  results,
  copy,
  lockedCategory,
  defaultLimit,
  className,
}: DiscoverySearchFormProps) {
  const router = useRouter();
  const { state, isPending, replaceState, createHref, resetFilters } = useDiscoverySearchParams({
    ...(defaultLimit ? { defaultLimit } : {}),
  });
  const categoryOptions = categories.map((category) => ({ value: String(category.id), label: category.name }));
  const activeCategory =
    state.categoryId === null ? null : categories.find((category) => category.id === state.categoryId) ?? null;
  const activeCriteria: DiscoveryCriteriaItem[] = [];

  if (surface === "books" && state.q) {
    activeCriteria.push({ label: copy.criteria.search, value: state.q });
  }

  if (surface === "books" && activeCategory) {
    activeCriteria.push({ label: copy.criteria.category, value: activeCategory.name });
  }

  if (surface === "category" && lockedCategory) {
    activeCriteria.push({ label: copy.criteria.fixedCategory, value: lockedCategory });
  }

  if (state.minRating !== null) {
    activeCriteria.push({ label: copy.criteria.minRating, value: `${state.minRating}+` });
  }

  if (state.page > 1) {
    activeCriteria.push({ label: copy.criteria.page, value: String(state.page) });
  }

  function handleSubmit(form: HTMLFormElement) {
    const formData = new FormData(form);

    replaceState({
      ...(surface === "books" ? { q: parseOptionalText(formData.get("q")) } : { q: undefined }),
      ...(surface === "books"
        ? { categoryId: parseOptionalInteger(formData.get("categoryId")) }
        : { categoryId: null }),
      minRating: parseOptionalInteger(formData.get("minRating")),
    });
  }

  function handleReset() {
    resetFilters();
  }

  const paginationLabels = {
    previous: copy.pagination.previous,
    next: copy.pagination.next,
    page: (page: number) => copy.pagination.page.replace("{page}", String(page)),
  };

  return (
    <div className={cn("flex flex-col gap-5", className)} data-discovery-search-form="true">
      {surface === "category" && lockedCategory ? (
        <div className="rounded-4xl border border-border bg-brand-subtle px-4 py-3">
          <p className="text-sm text-foreground">
            <span className="font-semibold">{copy.filters.fixedCategoryLabel}:</span>
            <span className="ml-2">{lockedCategory}</span>
          </p>
        </div>
      ) : null}

      <DiscoveryFilterPanel
        categories={categoryOptions}
        categoryValue={state.categoryId ? String(state.categoryId) : ""}
        isPending={isPending}
        labels={copy.filters}
        minRatingValue={state.minRating ? String(state.minRating) : ""}
        onReset={handleReset}
        onSubmit={handleSubmit}
        searchValue={state.q ?? ""}
        showCategoryField={surface === "books"}
        showSearchField={surface === "books"}
      />

      {results.status === "ready" ? (
        <DiscoveryResultsGrid
          books={results.items}
          criteria={activeCriteria}
          criteriaFallback={copy.criteria.fallback}
          criteriaTitle={copy.criteria.title}
          isStale={isPending}
          pagination={{
            ...results.pagination,
            getPageHref: (page) => createHref({ page }),
            labels: paginationLabels,
          }}
          stateCopy={copy.states}
        />
      ) : results.status === "empty" ? (
        <DiscoveryResultsState
          copy={copy.states}
          isStale={isPending}
          pagination={{
            ...results.pagination,
            getPageHref: (page) => createHref({ page }),
            labels: paginationLabels,
          }}
          state="empty"
        />
      ) : (
        <DiscoveryResultsState copy={copy.states} onRetry={() => router.refresh()} state="error" />
      )}
    </div>
  );
}