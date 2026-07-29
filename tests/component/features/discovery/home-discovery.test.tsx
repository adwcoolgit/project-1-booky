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
  mapAuthorSummaryToPresentation,
  type PopularAuthorSummary,
} from "@/entities/author";
import {
  mapBooksCollectionDtoToPage,
  mapBookSummaryToPresentation,
} from "@/entities/book";
import { mapCategorySummaryToPresentation, type CategorySummary } from "@/entities/category";
import { HomeDiscoverySections, type HomeDiscoverySectionsCopy } from "@/features/discovery";
import type { HomeDiscoveryViewModel } from "@/features/discovery/model/home-discovery";
import { getDiscoveryFeatureMessages, getSourceHomeMessages } from "@/shared/i18n/get-messages";
import type { AppLocale } from "@/shared/i18n/config";
import { createTestQueryClient } from "@/shared/test/create-test-query-client";
import { homeRecommendedBooksCollectionFixture } from "@/../tests/fixtures/discovery/books-fixtures";

function renderWithQueryClient(ui: ReactNode) {
  const queryClient = createTestQueryClient();

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

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
      loadMore: discovery.sections.recommendations.loadMore,
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
  const author: PopularAuthorSummary = {
    id: 21,
    name: "Ursula K. Le Guin",
    bio: "American novelist known for speculative fiction.",
    bookCount: 47,
    portrait: null,
  };
  const recommendationPage = mapBooksCollectionDtoToPage(homeRecommendedBooksCollectionFixture, 8);

  return {
    categories: {
      status: "ready",
      items: [mapCategorySummaryToPresentation(category, locale)],
    },
    recommendations: {
      status: "ready",
      items: recommendationPage.items.map((book) => mapBookSummaryToPresentation(book, { locale })),
      page: recommendationPage.page,
      limit: recommendationPage.limit,
      hasMore: recommendationPage.hasMore,
    },
    popularAuthors: {
      status: "ready",
      items: [mapAuthorSummaryToPresentation(author, { locale })],
    },
  };
}

describe("home discovery sections", () => {
  it("renders localized sections and appends the next recommendation batch from Load More", async () => {
    const user = userEvent.setup();

    renderWithQueryClient(
      <HomeDiscoverySections locale="en" copy={createCopy("en")} data={createReadyViewModel("en")} retryHref="/en" />,
    );

    const recommendationCardsBefore = screen.getAllByRole("link").filter((element) => element.getAttribute("data-book-card") === "true");
    const authorLink = screen.getByRole("link", { name: "Ursula K. Le Guin" });

    expect(screen.getByRole("heading", { name: "Categories" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Recommendation" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Popular Authors" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Science Fiction" })).toHaveAttribute(
      "href",
      "/en/categories/science-fiction-7",
    );
    expect(authorLink).toHaveAttribute("href", "/en/authors/21");
    expect(recommendationCardsBefore).toHaveLength(8);

    await user.click(screen.getByRole("button", { name: "Load More" }));

    expect(await screen.findByRole("link", { name: "Mindset" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "All recommendations loaded" })).toBeInTheDocument();
  });

  it("renders localized empty, stale, and untranslated domain-content states", () => {
    const readyIdViewModel = createReadyViewModel("id");

    if (readyIdViewModel.recommendations.status !== "ready") {
      throw new Error("Expected ready recommendations fixture.");
    }

    if (readyIdViewModel.popularAuthors.status !== "ready") {
      throw new Error("Expected ready popular authors fixture.");
    }

    renderWithQueryClient(
      <HomeDiscoverySections
        locale="id"
        copy={createCopy("id")}
        data={{
          categories: { status: "empty" },
          recommendations: {
            status: "ready",
            isStale: true,
            items: readyIdViewModel.recommendations.items,
            page: readyIdViewModel.recommendations.page,
            limit: readyIdViewModel.recommendations.limit,
            hasMore: readyIdViewModel.recommendations.hasMore,
          },
          popularAuthors: {
            status: "ready",
            items: readyIdViewModel.popularAuthors.items,
          },
        }}
        retryHref="/id"
      />,
    );

    const authorLink = screen.getByRole("link", { name: "Ursula K. Le Guin" });

    expect(screen.getByText("Belum ada yang ditampilkan")).toBeInTheDocument();
    expect(screen.getByText("Data lama")).toBeInTheDocument();
    expect(authorLink).toHaveAttribute("href", "/id/authors/21");
    expect(screen.getByRole("button", { name: "Muat lebih banyak" })).toBeInTheDocument();
  });

  it("renders retryable error actions per section", () => {
    renderWithQueryClient(
      <HomeDiscoverySections
        locale="id"
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
