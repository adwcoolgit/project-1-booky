"use client";

import Link from "next/link";

import { type ReviewPresentation } from "@/entities/review";
import {
  LoadMoreButton,
  type LoadMoreButtonLabels,
} from "@/features/discovery/components/load-more-button";
import { useBookReviewsLoadMore } from "@/features/discovery/hooks/use-book-reviews-load-more";
import type { AppLocale } from "@/shared/i18n/config";
import { cn } from "@/shared/lib/utils";

export type BookReviewListCopy = {
  eyebrow: string;
  title: string;
  description: string;
  anonymousReviewer: string;
  empty: {
    title: string;
    description: string;
  };
  error: {
    title: string;
    description: string;
    retry: string;
  };
  loadMore: LoadMoreButtonLabels & {
    errorTitle: string;
    errorDescription: string;
    retry: string;
  };
};

type BookReviewListProps =
  | {
      state: "ready";
      bookId: number;
      locale: AppLocale;
      initialReviews: ReviewPresentation[];
      initialPage: number;
      limit: number;
      hasMore: boolean;
      copy: BookReviewListCopy;
      summaryLabel?: string | undefined;
    }
  | {
      state: "error";
      copy: BookReviewListCopy;
      retryHref: string;
      summaryLabel?: string | undefined;
    };

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={cn("h-6 w-6 shrink-0", filled ? "text-warning" : "text-neutral-300")}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m12 2.75 2.86 5.8 6.4.93-4.63 4.5 1.1 6.37L12 17.35l-5.73 3 1.1-6.37-4.63-4.5 6.4-.93L12 2.75Z" />
    </svg>
  );
}

function ReviewStars({
  star,
  starLabel,
}: {
  star: number;
  starLabel: string;
}) {
  return (
    <div aria-label={`${starLabel}/5`} className="flex items-center gap-0.5" role="img">
      {Array.from({ length: 5 }, (_, index) => (
        <StarIcon filled={index < star} key={index} />
      ))}
    </div>
  );
}

function ReviewAvatar({
  reviewerName,
  fallbackLabel,
}: {
  reviewerName: string | null;
  fallbackLabel: string;
}) {
  const source = reviewerName ?? fallbackLabel;
  const initials = source
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2) || "R";

  return (
    <div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full bg-brand-subtle text-base font-bold leading-8 tracking-[-0.02em] text-brand sm:h-[60px] sm:w-[60px] md:h-16 md:w-16 md:text-lg">
      {initials}
    </div>
  );
}

function ReadyBookReviewList({
  bookId,
  locale,
  initialReviews,
  initialPage,
  limit,
  hasMore,
  copy,
  summaryLabel,
}: Extract<BookReviewListProps, { state: "ready" }>) {
  const {
    reviews,
    hasMore: hasMoreReviews,
    isPending,
    isLoadMoreError,
    loadMore,
  } = useBookReviewsLoadMore({
    bookId,
    locale,
    initialReviews,
    initialPage,
    limit,
    hasMore,
  });

  return (
    <section
      aria-labelledby="book-reviews-title"
      className="flex flex-col gap-[18px] sm:gap-6 md:gap-8 lg:gap-10"
      data-book-review-list="true"
      id="book-review-section"
    >
      <div className="flex flex-col gap-1 sm:gap-2 md:gap-3">
        <h2
          className="text-2xl font-bold leading-9 tracking-[-0.02em] text-neutral-950 sm:text-[1.625rem] sm:leading-10 md:text-section-title"
          id="book-reviews-title"
        >
          {copy.title}
        </h2>
        {summaryLabel ? (
          <div className="flex items-center gap-1 text-base font-bold leading-[30px] tracking-[-0.02em] text-neutral-950 sm:text-lg sm:leading-8 md:text-xl md:leading-[34px]">
            <StarIcon filled />
            <p>{summaryLabel}</p>
          </div>
        ) : null}
      </div>

      <div>
        {reviews.length === 0 ? (
          <div
            className="home-card-shadow rounded-[16px] border border-dashed border-border bg-white p-6"
            data-book-review-empty="true"
            role="status"
          >
            <h3 className="text-lg font-semibold leading-8 tracking-[-0.03em] text-neutral-900">
              {copy.empty.title}
            </h3>
            <p className="mt-2 max-w-prose text-sm leading-7 tracking-[-0.03em] text-neutral-700">
              {copy.empty.description}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:gap-6" data-book-review-items="true">
            {reviews.map((review) => (
              <article
                className="home-card-shadow flex min-h-[222px] flex-col gap-4 rounded-[16px] bg-white p-4 sm:min-h-[214px] md:min-h-[204px] lg:min-h-[216px]"
                data-book-review-item="true"
                key={review.id}
              >
                <div className="flex items-center gap-3">
                  <ReviewAvatar
                    fallbackLabel={copy.anonymousReviewer}
                    reviewerName={review.reviewerName}
                  />
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold leading-7 tracking-[-0.02em] text-neutral-950 sm:text-[15px] sm:leading-[30px] md:text-lg md:leading-8">
                      {review.reviewerName ?? copy.anonymousReviewer}
                    </h3>
                    {review.createdAtLabel ? (
                      <p className="text-sm font-medium leading-7 tracking-[-0.03em] text-neutral-950 sm:text-[15px] sm:leading-[30px] md:text-base md:leading-[30px]">
                        {review.createdAtLabel}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <ReviewStars star={review.star} starLabel={review.starLabel} />
                  {review.comment ? (
                    <p className="text-sm font-semibold leading-7 tracking-[-0.02em] text-neutral-950 sm:text-[15px] sm:leading-[30px] md:text-base md:leading-[30px]">
                      {review.comment}
                    </p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {isLoadMoreError ? (
        <div
          className="home-card-shadow rounded-[16px] border border-dashed border-border bg-white p-6"
          data-book-review-load-more-error="true"
          role="alert"
        >
          <h3 className="text-lg font-semibold leading-8 tracking-[-0.03em] text-neutral-900">
            {copy.loadMore.errorTitle}
          </h3>
          <p className="mt-2 max-w-prose text-sm leading-7 tracking-[-0.03em] text-neutral-700">
            {copy.loadMore.errorDescription}
          </p>
          <button
            className="mt-4 inline-flex h-10 items-center justify-center rounded-full border border-border bg-white px-4 text-sm font-bold leading-7 tracking-[-0.02em] text-neutral-950 transition hover:bg-neutral-50 sm:h-11 sm:px-5 md:h-12 md:text-base md:leading-[30px]"
            onClick={() => loadMore()}
            type="button"
          >
            {copy.loadMore.retry}
          </button>
        </div>
      ) : null}

      <div className="flex justify-center">
        <LoadMoreButton
          className="h-10 min-w-[9.375rem] px-4 text-sm font-bold leading-7 tracking-[-0.02em] sm:min-w-[10rem] sm:px-5 md:h-11 md:min-w-[12rem] lg:min-w-[12.5rem]"
          hasMore={hasMoreReviews}
          hideWhenExhausted={reviews.length === 0}
          isPending={isPending}
          labels={copy.loadMore}
          onLoadMore={loadMore}
        />
      </div>
    </section>
  );
}

export function BookReviewList(props: BookReviewListProps) {
  if (props.state === "error") {
    return (
      <section
        aria-labelledby="book-reviews-title"
        className="flex flex-col gap-[18px] sm:gap-6 md:gap-8 lg:gap-10"
        data-book-review-list="true"
        id="book-review-section"
      >
        <div className="flex flex-col gap-1 sm:gap-2 md:gap-3">
          <h2
            className="text-2xl font-bold leading-9 tracking-[-0.02em] text-neutral-950 sm:text-[1.625rem] sm:leading-10 md:text-section-title"
            id="book-reviews-title"
          >
            {props.copy.title}
          </h2>
          {props.summaryLabel ? (
            <div className="flex items-center gap-1 text-base font-bold leading-[30px] tracking-[-0.02em] text-neutral-950 sm:text-lg sm:leading-8 md:text-xl md:leading-[34px]">
              <StarIcon filled />
              <p>{props.summaryLabel}</p>
            </div>
          ) : null}
        </div>

        <div
          className="home-card-shadow rounded-[16px] border border-dashed border-border bg-white p-6"
          data-book-review-error="true"
          role="alert"
        >
          <h3 className="text-lg font-semibold leading-8 tracking-[-0.03em] text-neutral-900">
            {props.copy.error.title}
          </h3>
          <p className="mt-2 max-w-prose text-sm leading-7 tracking-[-0.03em] text-neutral-700">
            {props.copy.error.description}
          </p>
          <Link
            className="mt-4 inline-flex h-10 items-center justify-center rounded-full border border-border bg-white px-4 text-sm font-bold leading-7 tracking-[-0.02em] text-neutral-950 transition hover:bg-neutral-50 sm:h-11 sm:px-5 md:h-12 md:text-base md:leading-[30px]"
            href={props.retryHref}
          >
            {props.copy.error.retry}
          </Link>
        </div>
      </section>
    );
  }

  return <ReadyBookReviewList {...props} />;
}

