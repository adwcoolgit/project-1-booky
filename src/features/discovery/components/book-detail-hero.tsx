import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import type {
  BookAvailabilityState,
  BookDetailPresentation,
} from "@/entities/book";
import { BookDetailMobileActions } from "@/features/discovery/components/book-detail-mobile-actions";
import { cn } from "@/shared/lib/utils";

const BOOK_DETAIL_HERO_IMAGE_SIZES = "(max-width: 639px) 212px, (max-width: 767px) 236px, (max-width: 1023px) 288px, 337px";

function ChevronRightIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 shrink-0 text-neutral-950"
      fill="none"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m6 3 4 5-4 5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function StarIcon({ className = "h-6 w-6" }: { className?: string | undefined }) {
  return (
    <svg
      aria-hidden="true"
      className={cn("shrink-0 text-warning", className)}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m12 2.75 2.86 5.8 6.4.93-4.63 4.5 1.1 6.37L12 17.35l-5.73 3 1.1-6.37-4.63-4.5 6.4-.93L12 2.75Z" />
    </svg>
  );
}

export type BookRouteStateCopy = {
  invalidId: {
    title: string;
    description: string;
  };
  notFound: {
    title: string;
    description: string;
  };
  error: {
    title: string;
    description: string;
    retry: string;
  };
};

export type BookDetailHeroCopy = {
  headerLabel: string;
  authorLabel: string;
  categoryLabel: string;
  descriptionLabel: string;
  availabilityLabel: string;
  descriptionFallback: string;
  metrics: {
    rating: string;
    reviews: string;
    copies: string;
    borrowed: string;
  };
  availability: Record<BookAvailabilityState, string>;
};

export type BookDetailBreadcrumbItem = {
  label: string;
  href?: string | undefined;
};

export type BookDetailHeroAction = {
  label: string;
  href?: string | undefined;
  variant: "outline" | "solid";
  disabled?: boolean | undefined;
};

function resolveAvailabilityBadgeClass(state: BookAvailabilityState) {
  switch (state) {
    case "available":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "borrowed":
      return "border-brand/20 bg-brand-subtle text-brand";
    case "unavailable":
      return "border-danger/20 bg-danger/10 text-danger";
    default:
      return "border-border bg-muted text-text-muted";
  }
}

function renderBookDetailAction(
  action: BookDetailHeroAction,
  className: string,
) {
  const buttonClassName = cn(
    className,
    action.variant === "solid"
      ? "bg-brand text-white hover:brightness-95"
      : "border border-border bg-white text-neutral-950 hover:bg-neutral-50",
    action.disabled ? "pointer-events-none cursor-default" : null,
  );

  if (action.href && !action.disabled) {
    return (
      <Link className={buttonClassName} href={action.href} key={action.label}>
        {action.label}
      </Link>
    );
  }

  return (
    <button
      className={buttonClassName}
      disabled={action.disabled}
      key={action.label}
      type="button"
    >
      {action.label}
    </button>
  );
}

export function BookRouteStatePanel({
  state,
  copy,
  retryHref,
  onRetry,
  className,
}: {
  state: "invalidId" | "notFound" | "error";
  copy: BookRouteStateCopy;
  retryHref?: string | undefined;
  onRetry?: (() => void) | undefined;
  className?: string | undefined;
}) {
  const variantCopy = state === "invalidId"
    ? copy.invalidId
    : state === "notFound"
      ? copy.notFound
      : copy.error;

  return (
    <div
      className={cn(
        "rounded-4xl border border-dashed border-border bg-white/90 p-5 shadow-sm",
        className,
      )}
      data-book-route-state={state}
      role={state === "error" ? "alert" : "status"}
    >
      <h2 className="text-lg font-semibold text-foreground">{variantCopy.title}</h2>
      <p className="mt-2 max-w-prose text-sm text-text-muted">{variantCopy.description}</p>
      {state === "error" && onRetry ? (
        <button
          className="mt-4 inline-flex rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          onClick={() => onRetry()}
          type="button"
        >
          {copy.error.retry}
        </button>
      ) : null}
      {state === "error" && !onRetry && retryHref ? (
        <Link
          className="mt-4 inline-flex rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          href={retryHref}
        >
          {copy.error.retry}
        </Link>
      ) : null}
    </div>
  );
}

export function BookDetailHero({
  detail,
  copy,
  breadcrumbs,
  actions,
  desktopAddToCartAction,
  mobileAddToCartAction,
}: {
  detail: BookDetailPresentation;
  copy: BookDetailHeroCopy;
  breadcrumbs?: readonly BookDetailBreadcrumbItem[] | undefined;
  actions?: readonly BookDetailHeroAction[] | undefined;
  desktopAddToCartAction?: ReactNode;
  mobileAddToCartAction?: ReactNode;
}) {
  const availabilityLabel = copy.availability[detail.availabilityState];
  const metricItems = [
    { label: copy.metrics.copies, value: detail.availabilityRatioLabel },
    { label: copy.metrics.rating, value: detail.ratingLabel },
    { label: copy.metrics.reviews, value: detail.reviewCountLabel },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value));

  return (
    <section
      aria-labelledby="book-detail-title"
      className="flex flex-col gap-4 sm:gap-5 md:gap-6 lg:gap-8"
      data-book-detail-hero="true"
    >
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <nav aria-label={copy.headerLabel}>
          <ol className="flex flex-wrap items-center gap-1 text-sm font-semibold leading-7 tracking-[-0.02em]">
            {breadcrumbs.map((item, index) => {
              const isCurrent = index === breadcrumbs.length - 1;

              return (
                <li className="flex items-center gap-1" key={`${item.label}-${index}`}>
                  {item.href && !isCurrent ? (
                    <Link className="text-brand transition hover:underline" href={item.href}>
                      {item.label}
                    </Link>
                  ) : (
                    <span className={isCurrent ? "text-neutral-950" : "text-brand"}>{item.label}</span>
                  )}
                  {!isCurrent ? <ChevronRightIcon /> : null}
                </li>
              );
            })}
          </ol>
        </nav>
      ) : null}

      <div className="flex flex-col gap-8 sm:gap-9 lg:flex-row lg:items-start lg:gap-8 xl:gap-9">
        <div
          className={cn(
            "mx-auto w-[222.75px] shrink-0 p-[5.285px] sm:w-[15.5rem] sm:p-[6px] md:mx-0 md:w-[18rem] md:p-2 lg:max-w-[19rem] xl:max-w-[21.0625rem]",
            detail.coverImage.isFallback ? "bg-brand-subtle" : "bg-neutral-200",
          )}
        >
          <div className="relative h-[318.26px] w-[212.18px] overflow-hidden sm:h-[348px] sm:w-[236px] md:h-[400px] md:w-full lg:h-[430px] xl:h-[482px]">
            <Image
              alt={detail.coverImage.alt}
              className="h-full w-full object-cover"
              fill
              priority
              sizes={BOOK_DETAIL_HERO_IMAGE_SIZES}
              src={detail.coverImage.src}
              unoptimized
            />
          </div>
        </div>

        <div className="w-full min-w-0 flex-1">
          <div className="flex flex-col gap-4 sm:gap-[18px] md:gap-5 lg:gap-6">
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 md:gap-3">
              {detail.categoryLabel ? (
                <span className="inline-flex h-7 items-center rounded-md border border-border px-2 text-sm font-bold leading-7 tracking-[-0.02em] text-neutral-950">
                  {detail.categoryLabel}
                </span>
              ) : null}
              <span
                className={cn(
                  "inline-flex h-7 items-center rounded-md border px-2 text-sm font-bold leading-7 tracking-[-0.02em]",
                  resolveAvailabilityBadgeClass(detail.availabilityState),
                )}
              >
                {availabilityLabel}
              </span>
            </div>

            <div className="flex flex-col gap-0.5 sm:gap-1">
              <h1
                className="text-2xl font-bold leading-9 tracking-[-0.02em] text-neutral-950 sm:text-[1.625rem] sm:leading-10 md:text-[1.75rem] md:leading-[38px] lg:max-w-[32rem]"
                id="book-detail-title"
              >
                {detail.title}
              </h1>
              <p className="text-sm font-semibold leading-7 tracking-[-0.02em] text-neutral-700 sm:text-[15px] sm:leading-[30px] md:text-base md:leading-[30px]">
                {detail.authorName}
              </p>
              {detail.ratingLabel ? (
                <div className="flex items-center gap-1 text-base font-bold leading-[30px] tracking-[-0.02em] text-neutral-900">
                  <StarIcon />
                  <span>{detail.ratingLabel}</span>
                </div>
              ) : null}
            </div>

            {metricItems.length > 0 ? (
              <div
                className="grid grid-cols-3 border-y border-border py-4 sm:py-[18px] md:py-5 lg:max-w-[31rem]"
                data-book-detail-metrics="true"
              >
                {metricItems.map((item, index) => (
                  <div
                    className={cn(
                      "min-w-0 px-3 first:pl-0 last:pr-0 sm:px-4 md:min-w-[6.375rem] lg:px-5",
                      index < metricItems.length - 1 ? "border-r border-border md:pr-5" : "",
                      index > 0 ? "md:pl-5" : "",
                    )}
                    key={item.label}
                  >
                    <p className="truncate text-lg font-bold leading-8 text-neutral-950 sm:text-xl sm:leading-9 md:text-2xl md:leading-9">
                      {item.value}
                    </p>
                    <p className="truncate text-sm font-medium leading-7 tracking-[-0.03em] text-neutral-950 sm:text-[15px] sm:leading-[30px] md:text-base md:leading-[30px]">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold leading-[34px] tracking-[-0.02em] text-neutral-950">
                {copy.descriptionLabel}
              </h2>
              <p className="text-sm font-medium leading-7 tracking-[-0.03em] text-neutral-950 sm:text-[15px] sm:leading-[30px] md:text-base md:leading-[30px] lg:max-w-[46rem]">
                {detail.description ?? copy.descriptionFallback}
              </p>
            </div>

            {mobileAddToCartAction || (actions && actions.length > 0) ? (
              <BookDetailMobileActions actions={actions ?? []} addToCartAction={mobileAddToCartAction} />
            ) : null}

            {desktopAddToCartAction || (actions && actions.length > 0) ? (
              <div className="hidden flex-wrap items-center gap-3 lg:flex">
                {desktopAddToCartAction}
                {(actions ?? []).map((action) =>
                  renderBookDetailAction(
                    action,
                    "inline-flex h-12 min-w-[12.5rem] items-center justify-center rounded-full px-4 text-base font-bold leading-[30px] tracking-[-0.02em] transition",
                  ),
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

