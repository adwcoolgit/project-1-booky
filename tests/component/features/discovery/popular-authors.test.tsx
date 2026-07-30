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
import { PopularAuthorsSection } from "@/features/discovery";
import { getDiscoveryFeatureMessages, getSourceHomeMessages } from "@/shared/i18n/get-messages";
import type { AppLocale } from "@/shared/i18n/config";

function createCopy(locale: AppLocale) {
  const discovery = getDiscoveryFeatureMessages(locale).home;
  const home = getSourceHomeMessages(locale);

  return {
    eyebrow: discovery.sections.popularAuthors.eyebrow,
    title: home.popularAuthors,
    description: discovery.sections.popularAuthors.description,
    stateCopy: discovery.states,
  };
}

function createAuthors(locale: AppLocale) {
  const authors: PopularAuthorSummary[] = [
    {
      id: 21,
      name: "Ursula K. Le Guin",
      bio: "American novelist known for speculative fiction.",
      bookCount: 47,
      portrait: null,
    },
    {
      id: 22,
      name: "N. K. Jemisin",
      bio: "Award-winning fantasy and science fiction author.",
      bookCount: 12,
      portrait: null,
    },
  ];

  return authors.map((author) => mapAuthorSummaryToPresentation(author, { locale }));
}

describe("popular authors section", () => {
  it("renders localized headings and untranslated author navigation targets", () => {
    const copy = createCopy("en");

    render(
      <PopularAuthorsSection
        authors={{ status: "ready", items: createAuthors("en") }}
        description={copy.description}
        eyebrow={copy.eyebrow}
        retryHref="/en"
        stateCopy={copy.stateCopy}
        title={copy.title}
      />,
    );

    const ursulaLink = screen.getByText("Ursula K. Le Guin").closest("a");

    expect(screen.getByRole("heading", { name: "Popular Authors" })).toBeInTheDocument();
    expect(ursulaLink).toHaveAttribute("href", "/en/authors/21");
    expect(ursulaLink).toHaveAttribute("data-author-card", "true");
  });

  it("uses portrait fallback data and localized stale copy", () => {
    const copy = createCopy("id");

    render(
      <PopularAuthorsSection
        authors={{ status: "ready", isStale: true, items: createAuthors("id") }}
        description={copy.description}
        eyebrow={copy.eyebrow}
        retryHref="/id"
        stateCopy={copy.stateCopy}
        title={copy.title}
      />,
    );

    const fallbackPortrait = screen.getAllByText((_, element) => {
      return element?.tagName.toLowerCase() === "span" && element.getAttribute("data-src")?.startsWith("data:image/svg+xml") === true;
    });

    expect(screen.getByText("Data lama")).toBeInTheDocument();
    expect(fallbackPortrait.length).toBeGreaterThan(0);
  });

  it("renders retryable error and empty states without fabricating author content", () => {
    const copy = createCopy("id");
    const { rerender } = render(
      <PopularAuthorsSection
        authors={{ status: "error" }}
        description={copy.description}
        eyebrow={copy.eyebrow}
        retryHref="/id"
        stateCopy={copy.stateCopy}
        title={copy.title}
      />,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Coba lagi" })).toHaveAttribute("href", "/id");

    rerender(
      <PopularAuthorsSection
        authors={{ status: "empty" }}
        description={copy.description}
        eyebrow={copy.eyebrow}
        retryHref="/id"
        stateCopy={copy.stateCopy}
        title={copy.title}
      />,
    );

    expect(screen.getByText("Belum ada yang ditampilkan")).toBeInTheDocument();
  });
});