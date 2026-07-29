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
  mapBookDetailResponseDtoToDetail,
  mapBookDetailToPresentation,
  mapBooksCollectionDtoToSummaries,
  mapBookSummaryToPresentation,
} from "@/entities/book";
import { mapReviewSummaryToPresentation, mapReviewsCollectionDtoToPage } from "@/entities/review";
import {
  BookDetailHero,
  BookReviewList,
  BookRouteStatePanel,
  RelatedBooksSection,
} from "@/features/discovery";
import { getDiscoveryFeatureMessages } from "@/shared/i18n/get-messages";
import type { AppLocale } from "@/shared/i18n/config";
import { createTestQueryClient } from "@/shared/test/create-test-query-client";
import {
  discoveryBookDetailEnvelopeFixture,
  relatedScienceFictionBooksCollectionFixture,
} from "@/../tests/fixtures/discovery/books-fixtures";
import { discoveryReviewsCollectionFixture } from "@/../tests/fixtures/discovery/reviews-fixtures";

function renderWithQueryClient(ui: ReactNode) {
  const queryClient = createTestQueryClient();

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

function createDetailCopy(locale: AppLocale) {
  return getDiscoveryFeatureMessages(locale).results.detail;
}

function createReadyProps(locale: AppLocale = "en") {
  const detail = mapBookDetailResponseDtoToDetail(discoveryBookDetailEnvelopeFixture);

  if (!detail) {
    throw new Error("Expected ready detail fixture.");
  }

  const copy = createDetailCopy(locale);
  const reviewPage = mapReviewsCollectionDtoToPage(discoveryReviewsCollectionFixture, {
    bookId: 101,
    fallbackLimit: 2,
  });
  const relatedBooks = mapBooksCollectionDtoToSummaries(relatedScienceFictionBooksCollectionFixture)
    .filter((book) => book.id !== detail.summary.id)
    .map((book) => mapBookSummaryToPresentation(book, { locale }));

  return {
    copy,
    detail: mapBookDetailToPresentation(detail, { locale }),
    reviews: reviewPage.items.map((review) => mapReviewSummaryToPresentation(review, locale)),
    reviewPage,
    relatedBooks,
  };
}

describe("book detail components", () => {
  it("renders supported detail hierarchy, review load-more, related books, and hides pageCount", async () => {
    const user = userEvent.setup();
    const { copy, detail, reviews, reviewPage, relatedBooks } = createReadyProps("en");

    renderWithQueryClient(
      <div>
        <BookDetailHero
          copy={{
            headerLabel: copy.headerLabel,
            authorLabel: copy.authorLabel,
            categoryLabel: copy.categoryLabel,
            descriptionLabel: copy.descriptionLabel,
            availabilityLabel: copy.availabilityLabel,
            descriptionFallback: copy.descriptionFallback,
            metrics: copy.metrics,
            availability: copy.availability,
          }}
          detail={detail}
        />
        <BookReviewList
          bookId={detail.id}
          copy={copy.reviews}
          hasMore={reviewPage.hasMore}
          initialPage={reviewPage.page}
          initialReviews={reviews}
          limit={reviewPage.limit}
          locale="en"
          state="ready"
        />
        <RelatedBooksSection books={relatedBooks} copy={copy.related} state="ready" />
      </div>,
    );

    expect(screen.getByRole("heading", { level: 1, name: "The Left Hand of Darkness" })).toBeInTheDocument();
    expect(screen.getAllByText("Science Fiction").length).toBeGreaterThan(0);
    expect(screen.queryByText("304")).not.toBeInTheDocument();
    expect(screen.getByText("Ayu")).toBeInTheDocument();
    expect(screen.getByText("Rizal")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "A Wizard of Earthsea" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: copy.reviews.loadMore.idle }));

    expect(await screen.findByText("Lina")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: copy.reviews.loadMore.exhausted })).toBeInTheDocument();
  });

  it("renders distinct invalid, not-found, and retryable error route panels", () => {
    const copy = createDetailCopy("id");
    const routeCopy = {
      invalidId: copy.states.invalidId,
      notFound: copy.states.notFound,
      error: copy.states.error,
    };
    const { rerender } = render(
      <BookRouteStatePanel copy={routeCopy} state="invalidId" />,
    );

    expect(screen.getByText(copy.states.invalidId.title)).toBeInTheDocument();

    rerender(<BookRouteStatePanel copy={routeCopy} state="notFound" />);
    expect(screen.getByText(copy.states.notFound.title)).toBeInTheDocument();

    rerender(<BookRouteStatePanel copy={routeCopy} retryHref="/id/books/101" state="error" />);
    expect(screen.getByRole("link", { name: copy.states.error.retry })).toHaveAttribute("href", "/id/books/101");
  });
});

