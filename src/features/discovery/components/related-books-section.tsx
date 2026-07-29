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
      className="rounded-5xl border border-border bg-white p-6 shadow-card md:p-8"
      data-related-books-section="true"
    >
      <p className="text-eyebrow font-semibold text-brand">{props.copy.eyebrow}</p>
      <h2 className="mt-3 text-2xl font-semibold text-foreground md:text-3xl" id="related-books-title">
        {props.copy.title}
      </h2>
      <p className="mt-3 max-w-3xl text-body-default text-text-muted">{props.copy.description}</p>

      {props.state === "error" ? (
        <div
          className="mt-6 rounded-4xl border border-dashed border-border bg-white/90 p-5 shadow-sm"
          data-related-books-error="true"
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
      ) : null}

      {props.state === "empty" ? (
        <div
          className="mt-6 rounded-4xl border border-dashed border-border bg-white/90 p-5 shadow-sm"
          data-related-books-empty="true"
          role="status"
        >
          <h3 className="text-lg font-semibold text-foreground">{props.copy.empty.title}</h3>
          <p className="mt-2 max-w-prose text-sm text-text-muted">{props.copy.empty.description}</p>
        </div>
      ) : null}

      {props.state === "ready" ? (
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4" data-related-books-grid="true">
          {props.books.map((book) => (
            <BookCard book={book} className="max-w-none" key={book.id} variant="related" />
          ))}
        </div>
      ) : null}
    </section>
  );
}
