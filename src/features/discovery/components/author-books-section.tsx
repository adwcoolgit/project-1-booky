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
      data-author-route-state={state}
      role={state === "error" ? "alert" : "status"}
    >
      <h2 className="text-lg font-semibold text-foreground">{variantCopy.title}</h2>
      <p className="mt-2 max-w-prose text-sm text-text-muted">{variantCopy.description}</p>
      {state === "error" && retryHref ? (
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
  const bookCountLabel = author.bookCountLabel ? `${author.bookCountLabel} ${copy.bookCountLabel}` : null;

  return (
    <section
      aria-labelledby="author-books-title"
      className="rounded-5xl border border-border bg-white p-6 shadow-card md:p-8"
      data-author-books-section="true"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(16rem,0.85fr)_minmax(0,1.15fr)] xl:gap-8">
        <aside className="rounded-4xl border border-border bg-muted/30 p-5 md:p-6" data-author-summary="true">
          <p className="text-eyebrow font-semibold text-brand">{copy.summaryEyebrow}</p>
          <div
            className={cn(
              "relative mt-4 aspect-[4/5] w-full overflow-hidden rounded-[24px]",
              author.portraitImage.isFallback ? "bg-brand-subtle" : "bg-muted/60",
            )}
          >
            <Image
              alt={author.portraitImage.alt}
              className="h-full w-full object-cover"
              fill
              sizes="(max-width: 1024px) 100vw, 22rem"
              src={author.portraitImage.src}
              unoptimized
            />
          </div>
          <h2 className="mt-5 text-2xl font-semibold text-foreground md:text-3xl">{author.name}</h2>
          {author.bio ? <p className="mt-3 text-sm leading-6 text-text-muted">{author.bio}</p> : null}
          {bookCountLabel ? <p className="mt-4 text-sm font-semibold text-brand">{bookCountLabel}</p> : null}
        </aside>

        <div className="min-w-0">
          <p className="text-eyebrow font-semibold text-brand">{copy.booksEyebrow}</p>
          <h2 className="mt-3 text-2xl font-semibold text-foreground md:text-3xl" id="author-books-title">
            {copy.booksTitle}
          </h2>
          <p className="mt-3 max-w-3xl text-body-default text-text-muted">{copy.booksDescription}</p>

          <div className="mt-6">
            {books.length === 0 ? (
              <div
                className="rounded-4xl border border-dashed border-border bg-white/90 p-5 shadow-sm"
                data-author-books-empty="true"
                role="status"
              >
                <h3 className="text-lg font-semibold text-foreground">{copy.empty.title}</h3>
                <p className="mt-2 max-w-prose text-sm text-text-muted">{copy.empty.description}</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" data-author-books-grid="true">
                {books.map((book) => (
                  <BookCard book={book} key={book.id} />
                ))}
              </div>
            )}
          </div>

          {isLoadMoreError ? (
            <div
              className="mt-6 rounded-4xl border border-dashed border-border bg-white/90 p-5 shadow-sm"
              data-author-books-load-more-error="true"
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
              hasMore={hasMoreBooks}
              hideWhenExhausted={books.length === 0}
              isPending={isPending}
              labels={copy.loadMore}
              onLoadMore={loadMore}
            />
          </div>
        </div>
      </div>
    </section>
  );
}