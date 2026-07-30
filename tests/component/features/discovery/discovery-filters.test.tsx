import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactElement } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { CategorySummary } from "@/entities/category";
import { DiscoverySearchForm } from "@/features/discovery";
import { getDiscoveryFeatureMessages } from "@/shared/i18n/get-messages";
import { createTestQueryClient } from "@/shared/test/create-test-query-client";

const replaceSpy = vi.fn();
const refreshSpy = vi.fn();
let pathnameValue = "/en/books";
let searchParamsValue = new URLSearchParams();

function syncRouteFromHref(href: string) {
  const url = new URL(href, "https://booky.test");

  pathnameValue = url.pathname;
  searchParamsValue = new URLSearchParams(url.search);
}

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceSpy,
    refresh: refreshSpy,
    push: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => pathnameValue,
  useSearchParams: () => searchParamsValue,
}));

const scienceFiction: CategorySummary = {
  id: 7,
  name: "Science Fiction",
  slug: "science-fiction-7",
  artwork: null,
};

const historyCategory: CategorySummary = {
  id: 8,
  name: "History",
  slug: "history-8",
  artwork: null,
};

function createCopy(locale: "en" | "id") {
  const discovery = getDiscoveryFeatureMessages(locale).results;

  return {
    filters: discovery.filters,
    criteria: discovery.criteria,
    pagination: discovery.pagination,
    states: discovery.states,
  };
}

function renderWithProviders(ui: ReactElement) {
  const queryClient = createTestQueryClient();

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

function requireOption(container: HTMLElement, selector: string) {
  const option = container.querySelector<HTMLElement>(selector);

  expect(option).not.toBeNull();

  if (!option) {
    throw new Error(`Missing option for selector: ${selector}`);
  }

  return option;
}

describe("discovery search form", () => {
  beforeEach(() => {
    replaceSpy.mockReset();
    replaceSpy.mockImplementation((href: string) => {
      syncRouteFromHref(href);
    });
    refreshSpy.mockReset();
    pathnameValue = "/en/books";
    searchParamsValue = new URLSearchParams();
  });

  it("updates search text and filters on the books route without reset/apply buttons", async () => {
    const user = userEvent.setup();
    const view = renderWithProviders(
      <DiscoverySearchForm
        categories={[scienceFiction, historyCategory]}
        copy={createCopy("en")}
        locale="en"
        results={{
          status: "empty",
          pagination: {
            page: 1,
            hasPrevious: false,
            hasNext: false,
            total: 0,
          },
        }}
        surface="books"
      />,
    );

    expect(screen.queryByRole("button", { name: "Apply" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Reset" })).not.toBeInTheDocument();

    await user.type(screen.getByLabelText("Search books"), "  The   Left Hand  ");

    await waitFor(() => {
      expect(replaceSpy).toHaveBeenLastCalledWith("/en/books?q=The+Left+Hand", { scroll: false });
    });

    const { container, rerender } = view;

    replaceSpy.mockClear();
    replaceSpy.mockImplementation((href: string) => {
      syncRouteFromHref(href);
    });

    await user.click(requireOption(container, '[data-discovery-category-option="7"]'));

    await waitFor(() => {
      expect(replaceSpy).toHaveBeenLastCalledWith("/en/books?q=The+Left+Hand&categoryId=7", {
        scroll: false,
      });
    });

    replaceSpy.mockClear();
    replaceSpy.mockImplementation((href: string) => {
      syncRouteFromHref(href);
    });

    await user.click(requireOption(container, '[data-discovery-rating-option="4"]'));

    await waitFor(() => {
      expect(replaceSpy).toHaveBeenLastCalledWith("/en/books?q=The+Left+Hand&categoryId=7&minRating=4", {
        scroll: false,
      });
    });

    replaceSpy.mockClear();
    replaceSpy.mockImplementation((href: string) => {
      syncRouteFromHref(href);
    });

    const searchBox = screen.getByLabelText("Search books");
    await user.clear(searchBox);
    await user.type(searchBox, "Dune");

    await waitFor(() => {
      expect(replaceSpy).toHaveBeenLastCalledWith("/en/books?q=Dune", { scroll: false });
    });

    rerender(
      <QueryClientProvider client={createTestQueryClient()}>
        <DiscoverySearchForm
          categories={[scienceFiction, historyCategory]}
          copy={createCopy("en")}
          locale="en"
          results={{
            status: "empty",
            pagination: {
              page: 1,
              hasPrevious: false,
              hasNext: false,
              total: 0,
            },
          }}
          surface="books"
        />
      </QueryClientProvider>,
    );

    expect(screen.getByLabelText("Science Fiction")).not.toBeChecked();
    expect(screen.getByLabelText("Minimum rating: 4")).not.toBeChecked();
  });

  it("changes category routes immediately while preserving the active search query", async () => {
    const user = userEvent.setup();
    pathnameValue = "/id/categories/science-fiction-7";
    searchParamsValue = new URLSearchParams("q=Dune&minRating=4&page=2&limit=1");

    const view = renderWithProviders(
      <DiscoverySearchForm
        categories={[scienceFiction, historyCategory]}
        copy={createCopy("id")}
        defaultLimit={12}
        locale="id"
        lockedCategory="Science Fiction"
        lockedCategoryId={7}
        results={{
          status: "ready",
          items: [],
          pagination: {
            page: 2,
            hasPrevious: true,
            hasNext: false,
            total: 0,
          },
        }}
        surface="category"
      />,
    );

    const { container, rerender } = view;

    expect(screen.queryByLabelText("Search books")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Terapkan" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Setel Ulang" })).not.toBeInTheDocument();
    expect(container.querySelectorAll("[data-discovery-category-option]")).toHaveLength(2);
    expect(screen.getByLabelText("Science Fiction")).not.toBeChecked();

    await user.click(requireOption(container, '[data-discovery-category-option="8"]'));

    await waitFor(() => {
      expect(replaceSpy).toHaveBeenLastCalledWith("/id/categories/history-8?q=Dune&categoryId=8&minRating=4&limit=1", {
        scroll: false,
      });
    });

    rerender(
      <QueryClientProvider client={createTestQueryClient()}>
        <DiscoverySearchForm
          categories={[scienceFiction, historyCategory]}
          copy={createCopy("id")}
          defaultLimit={12}
          locale="id"
          lockedCategory="History"
          lockedCategoryId={8}
          results={{
            status: "ready",
            items: [],
            pagination: {
              page: 1,
              hasPrevious: false,
              hasNext: false,
              total: 0,
            },
          }}
          selectedCategoryId={8}
          surface="category"
        />
      </QueryClientProvider>,
    );

    expect(screen.getByLabelText("History")).toBeChecked();
  });

  it("changes category-route rating immediately without dropping the active search query", async () => {
    const user = userEvent.setup();
    pathnameValue = "/en/categories/science-fiction-7";
    searchParamsValue = new URLSearchParams("q=Neuromancer&categoryId=7&minRating=4&page=2&limit=1");

    renderWithProviders(
      <DiscoverySearchForm
        categories={[scienceFiction, historyCategory]}
        copy={createCopy("en")}
        defaultLimit={12}
        locale="en"
        lockedCategory="Science Fiction"
        lockedCategoryId={7}
        results={{
          status: "error",
        }}
        selectedCategoryId={7}
        surface="category"
      />,
    );

    expect(screen.getByLabelText("Science Fiction")).toBeChecked();

    await user.click(screen.getByLabelText("Minimum rating: 5"));

    await waitFor(() => {
      expect(replaceSpy).toHaveBeenLastCalledWith("/en/categories/science-fiction-7?q=Neuromancer&categoryId=7&minRating=5&limit=1", {
        scroll: false,
      });
    });
  });
});

