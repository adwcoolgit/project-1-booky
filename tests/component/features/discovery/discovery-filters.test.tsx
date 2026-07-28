import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { CategorySummary } from "@/entities/category";
import { DiscoverySearchForm } from "@/features/discovery";
import { getDiscoveryFeatureMessages } from "@/shared/i18n/get-messages";

const replaceSpy = vi.fn();
const refreshSpy = vi.fn();
let pathnameValue = "/en/books";
let searchParamsValue = new URLSearchParams();

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

function createCopy(locale: "en" | "id") {
  const discovery = getDiscoveryFeatureMessages(locale).results;

  return {
    filters: discovery.filters,
    criteria: discovery.criteria,
    pagination: discovery.pagination,
    states: discovery.states,
  };
}

describe("discovery search form", () => {
  beforeEach(() => {
    replaceSpy.mockReset();
    refreshSpy.mockReset();
    pathnameValue = "/en/books";
    searchParamsValue = new URLSearchParams();
  });

  it("normalizes and persists search, category, and rating changes into the books URL", async () => {
    const user = userEvent.setup();

    render(
      <DiscoverySearchForm
        categories={[scienceFiction]}
        copy={createCopy("en")}
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

    await user.type(screen.getByLabelText("Search books"), "  The   Left Hand  ");
    await user.selectOptions(screen.getByLabelText("Category"), "7");
    await user.selectOptions(screen.getByLabelText("Minimum rating"), "4");
    await user.click(screen.getByRole("button", { name: "Apply" }));

    await waitFor(() => {
      expect(replaceSpy).toHaveBeenCalledWith(
        "/en/books?q=The+Left+Hand&categoryId=7&minRating=4",
        { scroll: false },
      );
    });
  });

  it("persists category-route rating changes without leaking generic discovery params", async () => {
    const user = userEvent.setup();
    pathnameValue = "/id/categories/science-fiction-7";
    searchParamsValue = new URLSearchParams("limit=1");

    render(
      <DiscoverySearchForm
        categories={[scienceFiction]}
        copy={createCopy("id")}
        defaultLimit={12}
        lockedCategory="Science Fiction"
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
        surface="category"
      />,
    );

    await user.selectOptions(screen.getByLabelText("Rating minimum"), "4");
    await user.click(screen.getByRole("button", { name: "Terapkan" }));

    await waitFor(() => {
      expect(replaceSpy).toHaveBeenCalledWith(
        "/id/categories/science-fiction-7?minRating=4&limit=1",
        { scroll: false },
      );
    });
  });

  it("keeps category routes free from generic search params when filters reset", async () => {
    const user = userEvent.setup();
    pathnameValue = "/en/categories/science-fiction-7";
    searchParamsValue = new URLSearchParams("minRating=4&page=2&limit=1");

    render(
      <DiscoverySearchForm
        categories={[scienceFiction]}
        copy={createCopy("en")}
        defaultLimit={12}
        lockedCategory="Science Fiction"
        results={{
          status: "error",
        }}
        surface="category"
      />,
    );

    expect(screen.queryByLabelText("Search books")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Category")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Reset" }));

    await waitFor(() => {
      expect(replaceSpy).toHaveBeenCalledWith(
        "/en/categories/science-fiction-7?limit=1",
        { scroll: false },
      );
    });
  });
});