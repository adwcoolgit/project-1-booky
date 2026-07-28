import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt: string; src: string }) => <span data-alt={alt} data-src={src} />,
}));

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: { children: ReactNode; href: string } & Record<string, unknown>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

import {
  mapAuthorBooksResponseDtoToCollection,
  mapAuthorSummaryToPresentation,
} from "@/entities/author";
import { mapBookSummaryToPresentation } from "@/entities/book";
import { AuthorBooksSection, AuthorRouteStatePanel } from "@/features/discovery";
import { getDiscoveryFeatureMessages } from "@/shared/i18n/get-messages";
import type { AppLocale } from "@/shared/i18n/config";
import { createTestQueryClient } from "@/shared/test/create-test-query-client";
import {
  emptyAuthorBooksResponseFixture,
  paginatedAuthorBooksPageOneFixture,
} from "@/../tests/fixtures/discovery/authors-fixtures";

function renderWithQueryClient(ui: ReactNode) {
  const queryClient = createTestQueryClient();

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

function createCopy(locale: AppLocale) {
  return getDiscoveryFeatureMessages(locale).results.author;
}

function createReadyProps(locale: AppLocale = "en") {
  const collection = mapAuthorBooksResponseDtoToCollection(paginatedAuthorBooksPageOneFixture, 2);

  if (!collection) {
    throw new Error("Expected ready author books fixture.");
  }

  const copy = createCopy(locale);

  return {
    author: mapAuthorSummaryToPresentation(collection.author, { locale }),
    authorId: collection.author.id,
    locale,
    initialBooks: collection.books.map((book) => mapBookSummaryToPresentation(book, { locale })),
    initialPage: collection.page,
    limit: collection.limit,
    hasMore: collection.hasMore,
    copy: {
      summaryEyebrow: copy.summaryEyebrow,
      booksEyebrow: copy.booksEyebrow,
      booksTitle: copy.booksTitle,
      booksDescription: copy.booksDescription,
      bookCountLabel: copy.bookCountLabel,
      empty: copy.empty,
      loadMore: copy.loadMore,
    },
  };
}

describe("author books section", () => {
  it("keeps the author summary stable while load-more appends books", async () => {
    const user = userEvent.setup();

    renderWithQueryClient(<AuthorBooksSection {...createReadyProps("en")} />);

    expect(screen.getByText("47 books in catalog")).toBeInTheDocument();
    expect(screen.getAllByRole("link").filter((element) => element.getAttribute("data-book-card") === "true")).toHaveLength(2);

    await user.click(screen.getByRole("button", { name: "Load more books" }));

    expect(await screen.findByRole("link", { name: "The Dispossessed" })).toBeInTheDocument();
    expect(screen.getByText("47 books in catalog")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "All books loaded" })).toBeInTheDocument();
  });

  it("renders localized empty state without fabricating a load-more control", () => {
    const copy = createCopy("id");
    const collection = mapAuthorBooksResponseDtoToCollection(emptyAuthorBooksResponseFixture, 2);

    if (!collection) {
      throw new Error("Expected empty author books fixture.");
    }

    renderWithQueryClient(
      <AuthorBooksSection
        author={mapAuthorSummaryToPresentation(collection.author, { locale: "id" })}
        authorId={collection.author.id}
        copy={{
          summaryEyebrow: copy.summaryEyebrow,
          booksEyebrow: copy.booksEyebrow,
          booksTitle: copy.booksTitle,
          booksDescription: copy.booksDescription,
          bookCountLabel: copy.bookCountLabel,
          empty: copy.empty,
          loadMore: copy.loadMore,
        }}
        hasMore={collection.hasMore}
        initialBooks={[]}
        initialPage={collection.page}
        limit={collection.limit}
        locale="id"
      />,
    );

    expect(screen.getByText(copy.empty.title)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: copy.loadMore.idle })).not.toBeInTheDocument();
  });

  it("renders distinct invalid, not-found, and retryable error route panels", () => {
    const copy = createCopy("en");
    const routeCopy = {
      invalidId: copy.states.invalidId,
      notFound: copy.states.notFound,
      error: copy.states.error,
    };
    const { rerender } = render(
      <AuthorRouteStatePanel copy={routeCopy} state="invalidId" />,
    );

    expect(screen.getByText(copy.states.invalidId.title)).toBeInTheDocument();

    rerender(<AuthorRouteStatePanel copy={routeCopy} state="notFound" />);
    expect(screen.getByText(copy.states.notFound.title)).toBeInTheDocument();

    rerender(<AuthorRouteStatePanel copy={routeCopy} retryHref="/en/authors/21" state="error" />);
    expect(screen.getByRole("link", { name: copy.states.error.retry })).toHaveAttribute("href", "/en/authors/21");
  });
});