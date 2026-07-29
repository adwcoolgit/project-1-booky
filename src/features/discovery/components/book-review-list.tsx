"use client";

import Link from "next/link";

import { type ReviewPresentation } from "@/entities/review";
import {
  LoadMoreButton,
  type LoadMoreButtonLabels,
} from "@/features/discovery/components/load-more-button";
import { useBookReviewsLoadMore } from "@/features/discovery/hooks/use-book-reviews-load-more";
import type { AppLocale } from "@/shared/i18n/config";

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
    }
  | {
      state: "error";
      copy: BookReviewListCopy;
      retryHref: string;
    };

function ReviewStars({
  star,
  starLabel,
}: {
  star: number;
  starLabel: string;
}) {
  return (
    <div aria-label={`${starLabel}/5`} className="flex items-center gap-1 text-warning">
      {Array.from({ length: 5 }, (_, index) => (
        <span aria-hidden="true" className="text-lg leading-none" key={index}>
          {index < star ? "★" : "☆"}
        </span>
      ))}
      <span className="ml-1 text-sm font-semibold text-foreground">{starLabel}/5</span>
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
      className="rounded-5xl border border-border bg-white p-6 shadow-card md:p-8"
      data-book-review-list="true"
    >
      <p className="text-eyebrow font-semibold text-brand">{copy.eyebrow}</p>
      <h2 className="mt-3 text-2xl font-semibold text-foreground md:text-3xl" id="book-reviews-title">
        {copy.title}
      </h2>
      <p className="mt-3 max-w-3xl text-body-default text-text-muted">{copy.description}</p>

      <div className="mt-6">
        {reviews.length === 0 ? (
          <div
            className="rounded-4xl border border-dashed border-border bg-white/90 p-5 shadow-sm"
            data-book-review-empty="true"
            role="status"
          >
            <h3 className="text-lg font-semibold text-foreground">{copy.empty.title}</h3>
            <p className="mt-2 max-w-prose text-sm text-text-muted">{copy.empty.description}</p>
          </div>
        ) : (
          <div className="grid gap-4" data-book-review-items="true">
            {reviews.map((review) => (
              <article
                className="rounded-4xl border border-border bg-muted/20 p-5"
                data-book-review-item="true"
                key={review.id}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      {review.reviewerName ?? copy.anonymousReviewer}
                    </h3>
                    {review.createdAtLabel ? (
                      <p className="mt-1 text-sm text-text-muted">{review.createdAtLabel}</p>
                    ) : null}
                  </div>
                  <ReviewStars star={review.star} starLabel={review.starLabel} />
                </div>
                {review.comment ? (
                  <p className="mt-4 text-sm leading-7 text-text-muted">{review.comment}</p>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </div>

      {isLoadMoreError ? (
        <div
          className="mt-6 rounded-4xl border border-dashed border-border bg-white/90 p-5 shadow-sm"
          data-book-review-load-more-error="true"
          role="alert"
        >
          <h3 className="text-lg font-semibold text-foreground">{copy.loadMore.errorTitle}</h3>
          <p className="mt-2 max-w-prose text-sm text-text-muted">{copy.loadMore.errorDescription}</p>
          <button
            className="mt-4 inline-flex rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95"
            onClick={() => loadMore()}
            type="button"
          >
            {copy.loadMore.retry}
          </button>
        </div>
      ) : null}

      <div className="mt-6 flex justify-start">
        <LoadMoreButton
          className="min-w-[12rem]"
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
        className="rounded-5xl border border-border bg-white p-6 shadow-card md:p-8"
        data-book-review-list="true"
      >
        <p className="text-eyebrow font-semibold text-brand">{props.copy.eyebrow}</p>
        <h2 className="mt-3 text-2xl font-semibold text-foreground md:text-3xl" id="book-reviews-title">
          {props.copy.title}
        </h2>
        <p className="mt-3 max-w-3xl text-body-default text-text-muted">{props.copy.description}</p>

        <div
          className="mt-6 rounded-4xl border border-dashed border-border bg-white/90 p-5 shadow-sm"
          data-book-review-error="true"
          role="alert"
        >
          <h3 className="text-lg font-semibold text-foreground">{props.copy.error.title}</h3>
          <p className="mt-2 max-w-prose text-sm text-text-muted">{props.copy.error.description}</p>
          <Link
            className="mt-4 inline-flex rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
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
