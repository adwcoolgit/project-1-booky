import Image from "next/image";
import Link from "next/link";

import type {
  BookAvailabilityState,
  BookDetailPresentation,
} from "@/entities/book";
import { cn } from "@/shared/lib/utils";

const BOOK_DETAIL_HERO_IMAGE_SIZES =
  "(max-width: 1023px) calc(100vw - 3rem), 20rem";

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
}: {
  detail: BookDetailPresentation;
  copy: BookDetailHeroCopy;
}) {
  const availabilityLabel = copy.availability[detail.availabilityState];
  const metadataItems = [
    { label: copy.authorLabel, value: detail.authorName },
    { label: copy.categoryLabel, value: detail.categoryLabel },
    { label: copy.availabilityLabel, value: availabilityLabel },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value));
  const metricItems = [
    { label: copy.metrics.rating, value: detail.ratingLabel },
    { label: copy.metrics.reviews, value: detail.reviewCountLabel },
    { label: copy.metrics.copies, value: detail.availabilityRatioLabel },
    { label: copy.metrics.borrowed, value: detail.borrowCountLabel },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value));

  return (
    <section
      aria-labelledby="book-detail-title"
      className="rounded-5xl border border-border bg-white p-6 shadow-card md:p-8"
      data-book-detail-hero="true"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(15rem,20rem)_minmax(0,1fr)] lg:gap-8">
        <div
          className={cn(
            "relative aspect-[4/5] overflow-hidden rounded-[28px]",
            detail.coverImage.isFallback ? "bg-brand-subtle" : "bg-muted/60",
          )}
        >
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

        <div className="min-w-0">
          <p className="text-eyebrow font-semibold text-brand">{copy.headerLabel}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {detail.categoryLabel ? (
              <span className="rounded-full bg-brand-subtle px-3 py-1 text-sm font-semibold text-brand">
                {detail.categoryLabel}
              </span>
            ) : null}
            <span
              className={cn(
                "rounded-full border px-3 py-1 text-sm font-semibold",
                resolveAvailabilityBadgeClass(detail.availabilityState),
              )}
            >
              {availabilityLabel}
            </span>
          </div>

          <h1 className="mt-4 text-page-title text-foreground" id="book-detail-title">
            {detail.title}
          </h1>

          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
            {metadataItems.map((item) => (
              <div className="rounded-3xl border border-border bg-muted/25 p-4" key={item.label}>
                <dt className="text-sm font-semibold text-text-muted">{item.label}</dt>
                <dd className="mt-1 text-base font-semibold text-foreground">{item.value}</dd>
              </div>
            ))}
          </dl>

          {metricItems.length > 0 ? (
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" data-book-detail-metrics="true">
              {metricItems.map((item) => (
                <div className="rounded-3xl border border-border bg-white p-4 shadow-sm" key={item.label}>
                  <p className="text-sm font-semibold text-text-muted">{item.label}</p>
                  <p className="mt-2 text-xl font-semibold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          ) : null}

          <div className="mt-6 rounded-4xl border border-border bg-muted/20 p-5">
            <h2 className="text-base font-semibold text-foreground">{copy.descriptionLabel}</h2>
            <p className="mt-3 text-sm leading-7 text-text-muted">
              {detail.description ?? copy.descriptionFallback}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}