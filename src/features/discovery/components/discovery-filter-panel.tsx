"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

export type DiscoveryFilterOption = {
  value: string;
  label: string;
};

export const defaultMinRatingOptions: readonly DiscoveryFilterOption[] = [
  { value: "5", label: "5" },
  { value: "4", label: "4" },
  { value: "3", label: "3" },
  { value: "2", label: "2" },
  { value: "1", label: "1" },
] as const;

export type DiscoveryFilterPanelLabels = {
  panelTitle: string;
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
  categorySelectionMode?: "toggle" | "required" | undefined;
  fixedCategoryLabel?: string | undefined;
  fixedCategoryValue?: string | undefined;
  onSearchChange?: ((value: string) => void) | undefined;
  onCategoryChange?: ((value: string) => void) | undefined;
  onMinRatingChange?: ((value: string) => void) | undefined;
  onReset?: (() => void) | undefined;
  onSubmit?: ((form: HTMLFormElement) => void) | undefined;
};

function CheckIcon() {
  return (
    <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="m5 10 3 3 7-7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6 shrink-0 text-warning" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="m12 2.75 2.86 5.8 6.4.93-4.63 4.5 1.1 6.37L12 17.35l-5.73 3 1.1-6.37-4.63-4.5 6.4-.93L12 2.75Z" />
    </svg>
  );
}

type FilterCheckboxProps = {
  checked: boolean;
  label: string;
  onChange?: ((checked: boolean) => void) | undefined;
  children?: ReactNode;
  className?: string | undefined;
  inputClassName?: string | undefined;
  dataAttribute?: { name: string; value: string } | undefined;
  disabled?: boolean | undefined;
};

function FilterCheckbox({
  checked,
  label,
  onChange,
  children,
  className,
  inputClassName,
  dataAttribute,
  disabled = false,
}: FilterCheckboxProps) {
  const dataProps = dataAttribute ? { [dataAttribute.name]: dataAttribute.value } : {};

  return (
    <label
      {...dataProps}
      className={cn(
        "flex items-center gap-2 text-base font-medium leading-[30px] tracking-[-0.03em] text-neutral-950",
        disabled ? "cursor-default" : "cursor-pointer",
        className,
      )}
    >
      <input
        aria-label={label}
        checked={checked}
        className="sr-only"
        disabled={disabled}
        onChange={(event) => onChange?.(event.currentTarget.checked)}
        type="checkbox"
      />
      <span
        aria-hidden="true"
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border transition",
          checked ? "border-brand bg-brand text-white" : "border-neutral-400 bg-white text-transparent",
          inputClassName,
        )}
      >
        <CheckIcon />
      </span>
      <span className="min-w-0">{children ?? label}</span>
    </label>
  );
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
  categorySelectionMode = "toggle",
  fixedCategoryLabel,
  fixedCategoryValue,
  onSearchChange,
  onCategoryChange,
  onMinRatingChange,
  onReset,
  onSubmit,
}: DiscoveryFilterPanelProps) {
  const [draftSearch, setDraftSearch] = useState(searchValue);
  const [draftCategory, setDraftCategory] = useState(categoryValue);
  const [draftMinRating, setDraftMinRating] = useState(minRatingValue);
  const shouldRenderCategorySection =
    (showCategoryField && categories.length > 0) || Boolean(fixedCategoryValue);

  useEffect(() => {
    setDraftSearch(searchValue);
  }, [searchValue]);

  useEffect(() => {
    setDraftCategory(categoryValue);
  }, [categoryValue]);

  useEffect(() => {
    setDraftMinRating(minRatingValue);
  }, [minRatingValue]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit?.(event.currentTarget);
  }

  function handleCategoryToggle(optionValue: string, checked: boolean) {
    if (categorySelectionMode === "required" && !checked && draftCategory === optionValue) {
      return;
    }

    const nextValue = checked ? optionValue : "";

    setDraftCategory(nextValue);
    onCategoryChange?.(nextValue);
  }

  function handleMinRatingToggle(optionValue: string, checked: boolean) {
    const nextValue = checked ? optionValue : "";

    setDraftMinRating(nextValue);
    onMinRatingChange?.(nextValue);
  }

  return (
    <form
      aria-busy={isPending}
      className={cn("home-card-shadow flex flex-col overflow-hidden rounded-[12px] bg-white", className)}
      onSubmit={handleSubmit}
    >
      <input name="categoryId" type="hidden" value={draftCategory} />
      <input name="minRating" type="hidden" value={draftMinRating} />

      {showSearchField ? (
        <div className="border-b border-border px-4 py-4 lg:hidden">
          <label className="flex min-w-0 flex-col gap-2" htmlFor="discovery-search-input">
            <span className="text-base font-bold leading-[30px] text-neutral-950">{labels.searchLabel}</span>
            <input
              className="h-11 rounded-full border border-border bg-white px-4 text-sm font-medium leading-7 tracking-[-0.03em] text-foreground outline-none transition placeholder:text-neutral-600 focus:border-brand focus:ring-2 focus:ring-brand/20"
              disabled={isPending}
              id="discovery-search-input"
              name="q"
              onChange={(event) => {
                setDraftSearch(event.currentTarget.value);
                onSearchChange?.(event.currentTarget.value);
              }}
              placeholder={labels.searchPlaceholder}
              type="search"
              value={draftSearch}
            />
          </label>
        </div>
      ) : null}

      <div className="flex flex-col gap-6 px-4 py-4">
        <p className="text-base font-bold leading-[30px] text-neutral-950">{labels.panelTitle}</p>

        {shouldRenderCategorySection ? (
          <fieldset className="flex flex-col gap-[10px]">
            <legend className="text-lg font-bold leading-8 tracking-[-0.02em] text-neutral-950">
              {fixedCategoryLabel ?? labels.categoryLabel}
            </legend>
            <div className="flex flex-col gap-[10px]">
              {showCategoryField
                ? categories.map((category) => (
                    <FilterCheckbox
                      key={category.value}
                      checked={draftCategory === category.value}
                      dataAttribute={{ name: "data-discovery-category-option", value: category.value }}
                      label={category.label}
                      onChange={(checked) => handleCategoryToggle(category.value, checked)}
                    />
                  ))
                : fixedCategoryValue
                  ? (
                    <FilterCheckbox
                      checked
                      dataAttribute={{ name: "data-discovery-fixed-category", value: fixedCategoryValue }}
                      disabled
                      label={`${fixedCategoryLabel ?? labels.categoryLabel}: ${fixedCategoryValue}`}
                    >
                      {fixedCategoryValue}
                    </FilterCheckbox>
                  )
                  : null}
            </div>
          </fieldset>
        ) : null}

        {shouldRenderCategorySection ? <div className="h-px w-full bg-border" /> : null}

        <fieldset className="flex flex-col gap-[10px]">
          <legend className="text-lg font-bold leading-8 tracking-[-0.02em] text-neutral-950">
            {labels.minRatingLabel}
          </legend>
          <div className="flex flex-col gap-2">
            {minRatingOptions.map((option) => (
              <FilterCheckbox
                key={option.value}
                checked={draftMinRating === option.value}
                className="py-2"
                dataAttribute={{ name: "data-discovery-rating-option", value: option.value }}
                label={`${labels.minRatingLabel}: ${option.label}`}
                onChange={(checked) => handleMinRatingToggle(option.value, checked)}
              >
                <span className="flex items-center gap-[2px] text-base leading-[30px] tracking-[-0.02em] text-neutral-950">
                  <StarIcon />
                  <span>{option.label}</span>
                </span>
              </FilterCheckbox>
            ))}
          </div>
        </fieldset>
      </div>

      {(onReset || labels.applyLabel) ? (
        <div className="mt-auto flex flex-col gap-3 border-t border-border px-4 py-4 sm:flex-row">
          {onReset ? (
            <button
              className="inline-flex h-12 w-full items-center justify-center rounded-full border border-border px-4 text-base font-bold leading-[30px] tracking-[-0.02em] text-neutral-950 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isPending}
              onClick={() => onReset()}
              type="button"
            >
              {labels.resetLabel}
            </button>
          ) : null}

          {labels.applyLabel ? (
            <button
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-brand px-4 text-base font-bold leading-[30px] tracking-[-0.02em] text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isPending}
              type="submit"
            >
              {labels.applyLabel}
            </button>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
