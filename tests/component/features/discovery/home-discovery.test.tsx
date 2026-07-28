import { render, screen } from "@testing-library/react";
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
  mapAuthorSummaryToPresentation,
  type PopularAuthorSummary,
} from "@/entities/author";
import { mapBookSummaryToPresentation, type BookSummary } from "@/entities/book";
import { mapCategorySummaryToPresentation, type CategorySummary } from "@/entities/category";
import { HomeDiscoverySections, type HomeDiscoverySectionsCopy } from "@/features/discovery";
import type { HomeDiscoveryViewModel } from "@/features/discovery/model/home-discovery";
import { getDiscoveryFeatureMessages, getSourceHomeMessages } from "@/shared/i18n/get-messages";
import type { AppLocale } from "@/shared/i18n/config";

function createCopy(locale: AppLocale): HomeDiscoverySectionsCopy {
  const discovery = getDiscoveryFeatureMessages(locale).home;
  const home = getSourceHomeMessages(locale);

  return {
    categories: {
      eyebrow: discovery.sections.categories.eyebrow,
      title: home.categories,
      description: discovery.sections.categories.description,
    },
    recommendations: {
      eyebrow: discovery.sections.recommendations.eyebrow,
      title: home.recommendations,
      description: discovery.sections.recommendations.description,
      ctaLabel: discovery.actions.viewAllBooks,
    },
    popularAuthors: {
      eyebrow: discovery.sections.popularAuthors.eyebrow,
      title: home.popularAuthors,
      description: discovery.sections.popularAuthors.description,
    },
    states: discovery.states,
  };
}

function createReadyViewModel(locale: AppLocale): HomeDiscoveryViewModel {
  const category: CategorySummary = {
    id: 7,
    name: "Science Fiction",
    slug: "science-fiction-7",
    artwork: null,
  };
  const book: BookSummary = {
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
  };
  const author: PopularAuthorSummary = {
    id: 21,
    name: "Ursula K. Le Guin",
    bio: "American novelist known for speculative fiction.",
    bookCount: 47,
    portrait: null,
  };

  return {
    categories: {
      status: "ready",
      items: [mapCategorySummaryToPresentation(category, locale)],
    },
    recommendations: {
      status: "ready",
      items: [mapBookSummaryToPresentation(book, { locale })],
    },
    popularAuthors: {
      status: "ready",
      items: [mapAuthorSummaryToPresentation(author, { locale })],
    },
  };
}

describe("home discovery sections", () => {
  it("renders localized category, recommendation, and popular-author cards for the authenticated home route", () => {
    render(
      <HomeDiscoverySections catalogHref="/en/books" copy={createCopy("en")} data={createReadyViewModel("en")} retryHref="/en" />,
    );

    const bookLink = screen.getByText("The Left Hand of Darkness").closest("a");
    const authorLink = screen.getByRole("link", { name: "Ursula K. Le Guin" });

    expect(screen.getByRole("heading", { name: "Categories" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Recommendation" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Popular Authors" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Science Fiction" })).toHaveAttribute(
      "href",
      "/en/categories/science-fiction-7",
    );
    expect(bookLink).toHaveAttribute("href", "/en/books/101");
    expect(authorLink).toHaveAttribute("href", "/en/authors/21");
    expect(screen.getByRole("link", { name: "View all books" })).toHaveAttribute("href", "/en/books");
  });

  it("renders localized empty, stale, and untranslated domain-content states", () => {
    const readyIdViewModel = createReadyViewModel("id");

    if (readyIdViewModel.recommendations.status !== "ready") {
      throw new Error("Expected ready recommendations fixture.");
    }

    if (readyIdViewModel.popularAuthors.status !== "ready") {
      throw new Error("Expected ready popular authors fixture.");
    }

    render(
      <HomeDiscoverySections
        catalogHref="/id/books"
        copy={createCopy("id")}
        data={{
          categories: { status: "empty" },
          recommendations: {
            status: "ready",
            isStale: true,
            items: readyIdViewModel.recommendations.items,
          },
          popularAuthors: {
            status: "ready",
            items: readyIdViewModel.popularAuthors.items,
          },
        }}
        retryHref="/id"
      />,
    );

    const bookLink = screen.getByText("The Left Hand of Darkness").closest("a");
    const authorLink = screen.getByRole("link", { name: "Ursula K. Le Guin" });

    expect(screen.getByText("Belum ada yang ditampilkan")).toBeInTheDocument();
    expect(screen.getByText("Data lama")).toBeInTheDocument();
    expect(bookLink).toHaveAttribute("href", "/id/books/101");
    expect(authorLink).toHaveAttribute("href", "/id/authors/21");
    expect(screen.getByRole("link", { name: "Lihat semua buku" })).toHaveAttribute("href", "/id/books");
  });

  it("renders retryable error actions per section", () => {
    render(
      <HomeDiscoverySections
        catalogHref="/id/books"
        copy={createCopy("id")}
        data={{
          categories: { status: "error" },
          recommendations: { status: "error" },
          popularAuthors: { status: "error" },
        }}
        retryHref="/id"
      />,
    );

    expect(screen.getAllByRole("alert")).toHaveLength(3);
    expect(screen.getAllByRole("link", { name: "Coba lagi" })).toHaveLength(3);
  });
});
