"use client";

import Image from "next/image";
import Link from "next/link";

import { type AuthorPresentation } from "@/entities/author";
import { BookCard, type BookPresentation } from "@/entities/book";
import {
  LoadMoreButton,
  type LoadMoreButtonLabels,
} from "@/features/discovery/components/load-more-button";
import { useAuthorBooksLoadMore } from "@/features/discovery/hooks/use-author-books-load-more";
import type { AppLocale } from "@/shared/i18n/config";
import { cn } from "@/shared/lib/utils";

function BookIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6 shrink-0 text-brand"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.75 4.75h9.5A2.75 2.75 0 0 1 19 7.5v11.75H8.5A2.75 2.75 0 0 0 5.75 22V7.5a2.75 2.75 0 0 1 1-2.12Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M8.5 19.25H19"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <path
        d="M9.5 8.75h5.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

const AUTHOR_SUMMARY_IMAGE_SIZES = "81px";

export type AuthorBooksSectionCopy = {
  summaryEyebrow: string;
  booksEyebrow: string;
  booksTitle: string;
  booksDescription: string;
  bookCountLabel: string;
  empty: {
    title: string;
    description: string;
  };
  loadMore: LoadMoreButtonLabels & {
    errorTitle: string;
    errorDescription: string;
    retry: string;
  };
};

export type AuthorRouteStateCopy = {
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

export function AuthorRouteStatePanel({
  state,
  copy,
  retryHref,
  className,
}: {
  state: "invalidId" | "notFound" | "error";
  copy: AuthorRouteStateCopy;
  retryHref?: string | undefined;
  className?: string | undefined;
}) {
  const variantCopy =
    state === "invalidId"
      ? copy.invalidId
      : state === "notFound"
        ? copy.notFound
        : copy.error;

  return (
    <div
      className={cn(
        "home-card-shadow rounded-[16px] border border-dashed border-border bg-white p-6",
        className,
      )}
      data-author-route-state={state}
      role={state === "error" ? "alert" : "status"}
    >
      <h2 className="text-lg font-semibold leading-8 tracking-[-0.03em] text-neutral-900">
        {variantCopy.title}
      </h2>
      <p className="mt-2 max-w-prose text-sm leading-7 tracking-[-0.03em] text-neutral-700">
        {variantCopy.description}
      </p>
      {state === "error" && retryHref ? (
        <Link
          className="mt-4 inline-flex h-12 items-center justify-center rounded-full border border-border bg-white px-5 text-base font-bold leading-[30px] tracking-[-0.02em] text-neutral-950 transition hover:bg-neutral-50"
          href={retryHref}
        >
          {copy.error.retry}
        </Link>
      ) : null}
    </div>
  );
}

export function AuthorBooksSection({
  author,
  authorId,
  locale,
  initialBooks,
  initialPage,
  limit,
  hasMore,
  copy,
}: {
  author: AuthorPresentation;
  authorId: number;
  locale: AppLocale;
  initialBooks: BookPresentation[];
  initialPage: number;
  limit: number;
  hasMore: boolean;
  copy: AuthorBooksSectionCopy;
}) {
  const {
    books,
    hasMore: hasMoreBooks,
    isPending,
    isLoadMoreError,
    loadMore,
  } = useAuthorBooksLoadMore({
    authorId,
    locale,
    initialBooks,
    initialPage,
    limit,
    hasMore,
  });
  const bookCountLabel = author.bookCountLabel
    ? `${author.bookCountLabel} ${copy.bookCountLabel}`
    : null;

  return (
    <section
      aria-labelledby="author-books-title"
      className="flex flex-col gap-8 md:gap-10"
      data-author-books-section="true"
    >
      <div
        className="home-card-shadow flex flex-col gap-4 rounded-[16px] bg-white p-4 sm:flex-row sm:items-center"
        data-author-summary="true"
      >
        <div
          className={cn(
            "relative h-[81px] w-[81px] shrink-0 overflow-hidden rounded-full",
            author.portraitImage.isFallback ? "bg-brand-subtle" : "bg-muted/60",
          )}
        >
          <Image
            alt={author.portraitImage.alt}
            className="h-full w-full object-cover"
            fill
            priority
            sizes={AUTHOR_SUMMARY_IMAGE_SIZES}
            src={author.portraitImage.src}
            unoptimized
          />
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-bold leading-8 tracking-[-0.03em] text-neutral-900">
            {author.name}
          </h1>
          {/* Book count */}
          {bookCountLabel ? (
            <div className="mt-0.5 flex items-center gap-[6px] text-base font-medium leading-[30px] tracking-[-0.03em] text-neutral-950">
              <BookIcon />
              <span>{bookCountLabel}</span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <h2
          className="text-section-title tracking-[-0.02em] text-neutral-950"
          id="author-books-title"
        >
          {copy.booksTitle}
        </h2>

        {books.length === 0 ? (
          <div
            className="home-card-shadow rounded-[16px] border border-dashed border-border bg-white p-6"
            data-author-books-empty="true"
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
          <div
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
            data-author-books-grid="true"
          >
            {books.map((book) => (
              <BookCard book={book} key={book.id} variant="home" />
            ))}
          </div>
        )}

        {isLoadMoreError ? (
          <div
            className="home-card-shadow rounded-[16px] border border-dashed border-border bg-white p-6"
            data-author-books-load-more-error="true"
            role="alert"
          >
            <h3 className="text-lg font-semibold leading-8 tracking-[-0.03em] text-neutral-900">
              {copy.loadMore.errorTitle}
            </h3>
            <p className="mt-2 max-w-prose text-sm leading-7 tracking-[-0.03em] text-neutral-700">
              {copy.loadMore.errorDescription}
            </p>
            <button
              className="mt-4 inline-flex h-12 items-center justify-center rounded-full border border-border bg-white px-5 text-base font-bold leading-[30px] tracking-[-0.02em] text-neutral-950 transition hover:bg-neutral-50"
              onClick={() => loadMore()}
              type="button"
            >
              {copy.loadMore.retry}
            </button>
          </div>
        ) : null}

        <div className="flex justify-center">
          <LoadMoreButton
            className="min-w-[12.5rem]"
            hasMore={hasMoreBooks}
            hideWhenExhausted={books.length === 0}
            isPending={isPending}
            labels={copy.loadMore}
            onLoadMore={loadMore}
          />
        </div>
      </div>
    </section>
  );
}
