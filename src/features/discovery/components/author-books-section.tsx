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

const AUTHOR_SUMMARY_IMAGE_SIZES =
  "(max-width: 639px) 60px, (max-width: 767px) 64px, (max-width: 1023px) 68px, (max-width: 1279px) 72px, 81px";
const authorBooksHeadingClassName = "font-display text-[24px] font-bold leading-9 text-neutral-950 md:text-[28px] md:leading-10 lg:text-[32px] lg:leading-[42px] xl:text-[36px] xl:leading-[44px]";

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
        "home-card-shadow rounded-[16px] border border-dashed border-border bg-white p-5 sm:p-6",
        className,
      )}
      data-author-route-state={state}
      role={state === "error" ? "alert" : "status"}
    >
      <h2 className="text-base font-semibold leading-[30px] tracking-[-0.02em] text-neutral-900 md:text-lg md:leading-8">
        {variantCopy.title}
      </h2>
      <p className="mt-2 max-w-prose text-sm leading-7 tracking-[-0.03em] text-neutral-700">
        {variantCopy.description}
      </p>
      {state === "error" && retryHref ? (
        <Link
          className="mt-4 inline-flex h-10 items-center justify-center rounded-full border border-border bg-white px-4 text-sm font-bold leading-7 tracking-[-0.02em] text-neutral-950 transition hover:bg-neutral-50 sm:h-11 sm:px-5 md:text-base md:leading-[30px]"
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
      className="flex flex-col gap-4 sm:gap-5 md:gap-6 lg:gap-8 xl:gap-10"
      data-author-books-section="true"
    >
      <div
        className="home-card-shadow flex items-center gap-3 rounded-[16px] bg-white p-3 sm:gap-3.5 sm:p-3.5 md:gap-4 md:p-4 lg:rounded-[16px]"
        data-author-summary="true"
      >
        <div
          className={cn(
            "relative h-[60px] w-[60px] shrink-0 overflow-hidden rounded-full sm:h-16 sm:w-16 md:h-[68px] md:w-[68px] lg:h-[72px] lg:w-[72px] xl:h-[81px] xl:w-[81px]",
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
          <h1 className="truncate text-base font-bold leading-[30px] tracking-[-0.02em] text-neutral-900 md:text-[17px] md:leading-[30px] lg:text-lg lg:leading-8">
            {author.name}
          </h1>
          {bookCountLabel ? (
            <div className="mt-0.5 flex items-center gap-[6px] text-sm font-medium leading-7 tracking-[-0.03em] text-neutral-950 md:text-[15px] md:leading-7 lg:text-base lg:leading-[30px]">
              <BookIcon />
              <span>{bookCountLabel}</span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 lg:gap-8 xl:gap-10">
        <h2
          className={authorBooksHeadingClassName}
          id="author-books-title"
        >
          {copy.booksTitle}
        </h2>

        {books.length === 0 ? (
          <div
            className="home-card-shadow rounded-[16px] border border-dashed border-border bg-white p-5 sm:p-6"
            data-author-books-empty="true"
            role="status"
          >
            <h3 className="text-base font-semibold leading-[30px] tracking-[-0.02em] text-neutral-900 md:text-lg md:leading-8">
              {copy.empty.title}
            </h3>
            <p className="mt-2 max-w-prose text-sm leading-7 tracking-[-0.03em] text-neutral-700">
              {copy.empty.description}
            </p>
          </div>
        ) : (
          <div
            className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5"
            data-author-books-grid="true"
          >
            {books.map((book, index) => (
              <BookCard
                book={book}
                coverImageLoading={index < 2 ? "eager" : undefined}
                key={book.id}
                variant="author"
              />
            ))}
          </div>
        )}

        {isLoadMoreError ? (
          <div
            className="home-card-shadow rounded-[16px] border border-dashed border-border bg-white p-5 sm:p-6"
            data-author-books-load-more-error="true"
            role="alert"
          >
            <h3 className="text-base font-semibold leading-[30px] tracking-[-0.02em] text-neutral-900 md:text-lg md:leading-8">
              {copy.loadMore.errorTitle}
            </h3>
            <p className="mt-2 max-w-prose text-sm leading-7 tracking-[-0.03em] text-neutral-700">
              {copy.loadMore.errorDescription}
            </p>
            <button
              className="mt-4 inline-flex h-10 items-center justify-center rounded-full border border-border bg-white px-4 text-sm font-bold leading-7 tracking-[-0.02em] text-neutral-950 transition hover:bg-neutral-50 sm:h-11 sm:px-5 md:text-base md:leading-[30px]"
              onClick={() => loadMore()}
              type="button"
            >
              {copy.loadMore.retry}
            </button>
          </div>
        ) : null}

        <div className="flex justify-center">
          <LoadMoreButton
            className="lg:min-w-[12rem]"
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