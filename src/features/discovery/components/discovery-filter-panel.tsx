"use client";

import type { FormEvent } from "react";

import { cn } from "@/shared/lib/utils";

export type DiscoveryFilterOption = {
  value: string;
  label: string;
};

export const defaultMinRatingOptions: readonly DiscoveryFilterOption[] = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
] as const;

export type DiscoveryFilterPanelLabels = {
  searchLabel: string;
  searchPlaceholder: string;
  categoryLabel: string;
  categoryAllLabel: string;
  minRatingLabel: string;
  minRatingAllLabel: string;
  resetLabel: string;
  applyLabel?: string | undefined;
};

export type DiscoveryFilterPanelProps = {
  searchValue: string;
  categoryValue: string;
  minRatingValue: string;
  categories: readonly DiscoveryFilterOption[];
  minRatingOptions?: readonly DiscoveryFilterOption[];
  labels: DiscoveryFilterPanelLabels;
  isPending?: boolean | undefined;
  className?: string | undefined;
  showSearchField?: boolean | undefined;
  showCategoryField?: boolean | undefined;
  onSearchChange?: ((value: string) => void) | undefined;
  onCategoryChange?: ((value: string) => void) | undefined;
  onMinRatingChange?: ((value: string) => void) | undefined;
  onReset?: (() => void) | undefined;
  onSubmit?: ((form: HTMLFormElement) => void) | undefined;
};

function resolveLayoutClassName(showSearchField: boolean, showCategoryField: boolean) {
  if (showSearchField && showCategoryField) {
    return "lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto_auto] lg:items-end";
  }

  if (showSearchField) {
    return "lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_auto_auto] lg:items-end";
  }

  if (showCategoryField) {
    return "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_auto] lg:items-end";
  }

  return "sm:grid-cols-[minmax(0,1fr)_auto_auto] lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-end";
}

export function DiscoveryFilterPanel({
  searchValue,
  categoryValue,
  minRatingValue,
  categories,
  minRatingOptions = defaultMinRatingOptions,
  labels,
  isPending = false,
  className,
  showSearchField = true,
  showCategoryField = true,
  onSearchChange,
  onCategoryChange,
  onMinRatingChange,
  onReset,
  onSubmit,
}: DiscoveryFilterPanelProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit?.(event.currentTarget);
  }

  return (
    <form
      aria-busy={isPending}
      className={cn(
        "grid gap-4 rounded-[28px] border border-border/70 bg-white p-4 shadow-sm sm:p-5",
        resolveLayoutClassName(showSearchField, showCategoryField),
        className,
      )}
      onSubmit={handleSubmit}
    >
      {showSearchField ? (
        <label className="flex min-w-0 flex-col gap-2 text-sm font-medium text-foreground" htmlFor="discovery-search-input">
          <span>{labels.searchLabel}</span>
          <input
            className="h-11 rounded-full border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            defaultValue={searchValue}
            disabled={isPending}
            id="discovery-search-input"
            key={`search-${searchValue}`}
            name="q"
            onChange={(event) => onSearchChange?.(event.currentTarget.value)}
            placeholder={labels.searchPlaceholder}
            type="search"
          />
        </label>
      ) : null}

      {showCategoryField ? (
        <label className="flex min-w-0 flex-col gap-2 text-sm font-medium text-foreground" htmlFor="discovery-category-select">
          <span>{labels.categoryLabel}</span>
          <select
            className="h-11 rounded-full border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            defaultValue={categoryValue}
            disabled={isPending}
            id="discovery-category-select"
            key={`category-${categoryValue}`}
            name="categoryId"
            onChange={(event) => onCategoryChange?.(event.currentTarget.value)}
          >
            <option value="">{labels.categoryAllLabel}</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <label className="flex min-w-0 flex-col gap-2 text-sm font-medium text-foreground" htmlFor="discovery-rating-select">
        <span>{labels.minRatingLabel}</span>
        <select
          className="h-11 rounded-full border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          defaultValue={minRatingValue}
          disabled={isPending}
          id="discovery-rating-select"
          key={`rating-${minRatingValue}`}
          name="minRating"
          onChange={(event) => onMinRatingChange?.(event.currentTarget.value)}
        >
          <option value="">{labels.minRatingAllLabel}</option>
          {minRatingOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      {onReset ? (
        <button
          className="h-11 rounded-full border border-border px-4 text-sm font-semibold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isPending}
          onClick={() => onReset()}
          type="button"
        >
          {labels.resetLabel}
        </button>
      ) : null}

      {labels.applyLabel ? (
        <button
          className="h-11 rounded-full bg-brand px-5 text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isPending}
          type="submit"
        >
          {labels.applyLabel}
        </button>
      ) : null}
    </form>
  );
}