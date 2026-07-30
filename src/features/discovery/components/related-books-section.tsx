import Link from "next/link";

import { BookCard, type BookPresentation } from "@/entities/book";

export type RelatedBooksSectionCopy = {
  eyebrow: string;
  title: string;
  description: string;
  empty: {
    title: string;
    description: string;
  };
  error: {
    title: string;
    description: string;
    retry: string;
  };
};

type RelatedBooksSectionProps =
  | {
      state: "ready";
      books: BookPresentation[];
      copy: RelatedBooksSectionCopy;
    }
  | {
      state: "empty";
      copy: RelatedBooksSectionCopy;
    }
  | {
      state: "error";
      copy: RelatedBooksSectionCopy;
      retryHref: string;
    };

export function RelatedBooksSection(props: RelatedBooksSectionProps) {
  return (
    <section
      aria-labelledby="related-books-title"
      className="flex flex-col gap-5 sm:gap-6 md:gap-8 lg:gap-10"
      data-related-books-section="true"
    >
      <div className="flex flex-col gap-1 sm:gap-2 md:gap-3">
        <h2
          className="text-2xl font-bold leading-9 tracking-[-0.02em] text-neutral-950 sm:text-[1.625rem] sm:leading-10 md:text-section-title"
          id="related-books-title"
        >
          {props.copy.title}
        </h2>
      </div>

      {props.state === "error" ? (
        <div
          className="home-card-shadow rounded-[16px] border border-dashed border-border bg-white p-6"
          data-related-books-error="true"
          role="alert"
        >
          <h3 className="text-lg font-semibold leading-8 tracking-[-0.03em] text-neutral-900">
            {props.copy.error.title}
          </h3>
          <p className="mt-2 max-w-prose text-sm leading-7 tracking-[-0.03em] text-neutral-700">
            {props.copy.error.description}
          </p>
          <Link
            className="mt-4 inline-flex h-12 items-center justify-center rounded-full border border-border bg-white px-5 text-base font-bold leading-[30px] tracking-[-0.02em] text-neutral-950 transition hover:bg-neutral-50"
            href={props.retryHref}
          >
            {props.copy.error.retry}
          </Link>
        </div>
      ) : null}

      {props.state === "empty" ? (
        <div
          className="home-card-shadow rounded-[16px] border border-dashed border-border bg-white p-6"
          data-related-books-empty="true"
          role="status"
        >
          <h3 className="text-lg font-semibold leading-8 tracking-[-0.03em] text-neutral-900">
            {props.copy.empty.title}
          </h3>
          <p className="mt-2 max-w-prose text-sm leading-7 tracking-[-0.03em] text-neutral-700">
            {props.copy.empty.description}
          </p>
        </div>
      ) : null}

      {props.state === "ready" ? (
        <div
          className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-5"
          data-related-books-grid="true"
        >
          {props.books.map((book) => (
            <BookCard book={book} className="max-w-none" key={book.id} variant="home" />
          ))}
        </div>
      ) : null}
    </section>
  );
}
