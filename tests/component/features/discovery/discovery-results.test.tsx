import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt: string; src: string }) => <span data-alt={alt} data-src={src} />,
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

import { mapBookSummaryToPresentation, type BookSummary } from "@/entities/book";
import {
  DiscoveryResultsGrid,
  DiscoveryResultsState,
} from "@/features/discovery";
import { getDiscoveryFeatureMessages } from "@/shared/i18n/get-messages";

function createStateCopy(locale: "en" | "id") {
  return getDiscoveryFeatureMessages(locale).results.states;
}

const books: readonly BookSummary[] = [
  {
    id: 101,
    title: "The Left Hand of Darkness",
    authorId: 21,
    authorName: "Ursula K. Le Guin",
    categoryId: 7,
    categoryName: "Science Fiction",
    coverImageUrl: null,
    rating: 4.7,
    reviewCount: 128,
    availableCopies: 4,
    totalCopies: 12,
  },
  {
    id: 103,
    title: "The Dispossessed",
    authorId: 21,
    authorName: "Ursula K. Le Guin",
    categoryId: 7,
    categoryName: "Science Fiction",
    coverImageUrl: null,
    rating: 4.8,
    reviewCount: 156,
    availableCopies: 5,
    totalCopies: 11,
  },
] as const;

describe("discovery result surfaces", () => {
  it("renders ready-state cards, load-more pagination, and stale notice", () => {
    render(
      <DiscoveryResultsGrid
        books={books.map((book) => mapBookSummaryToPresentation(book, { locale: "en" }))}
        isStale
        pagination={{
          page: 2,
          hasPrevious: true,
          hasNext: true,
          getPageHref: (page) => `/en/books?page=${page}`,
          labels: {
            loadMore: "Load More",
            page: (page) => `Page ${page}`,
          },
        }}
        stateCopy={createStateCopy("en")}
      />,
    );

    expect(screen.queryByText("Active criteria")).not.toBeInTheDocument();
    expect(screen.getByText("Stale data")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /The Left Hand of Darkness/ })).toHaveAttribute("href", "/en/books/101");
    expect(screen.getByRole("link", { name: /The Dispossessed/ })).toHaveAttribute("href", "/en/books/103");
    expect(screen.getByRole("link", { name: "Load More" })).toHaveAttribute("href", "/en/books?page=3");
  });

  it("renders localized empty and retryable error states", () => {
    const retrySpy = vi.fn();
    const { rerender } = render(
      <DiscoveryResultsState
        copy={createStateCopy("id")}
        pagination={{
          page: 2,
          hasPrevious: true,
          hasNext: false,
          getPageHref: (page) => `/id/books?page=${page}`,
          labels: {
            loadMore: "Muat lebih banyak",
            page: (page) => `Halaman ${page}`,
          },
        }}
        state="empty"
      />,
    );

    expect(screen.getByText("Belum ada buku yang cocok")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Muat lebih banyak" })).not.toBeInTheDocument();

    rerender(<DiscoveryResultsState copy={createStateCopy("id")} onRetry={retrySpy} state="error" />);
    screen.getByRole("button", { name: "Muat ulang hasil" }).click();

    expect(retrySpy).toHaveBeenCalledTimes(1);
  });
});
