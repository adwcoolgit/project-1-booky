import { act, render } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: { children: ReactNode; href: string } & Record<string, unknown>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

import { BookDetailMobileActions } from "@/features/discovery/components/book-detail-mobile-actions";

function createRect(top: number, bottom: number): DOMRect {
  return new DOMRect(0, top, 0, bottom - top);
}

describe("BookDetailMobileActions", () => {
  beforeEach(() => {
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 0,
      writable: true,
    });
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 700,
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("tampil hanya saat review section masih sepenuhnya di bawah viewport", () => {
    let currentRect = createRect(820, 1160);

    const { container } = render(
      <>
        <section id="book-review-section" />
        <BookDetailMobileActions
          actions={[
            { label: "Add To Cart", variant: "outline" },
            { label: "Borrow Book", variant: "solid" },
          ]}
        />
      </>,
    );

    const reviewSection = document.getElementById("book-review-section");
    const actionBar = container.querySelector('[data-book-detail-mobile-actions="true"]');

    vi.spyOn(reviewSection!, "getBoundingClientRect").mockImplementation(() => currentRect);

    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    expect(actionBar).toHaveClass("fixed");
    expect(actionBar).toHaveClass("bottom-0");
    expect(actionBar).toHaveClass("translate-y-0");
    expect(actionBar).toHaveClass("opacity-100");

    act(() => {
      currentRect = createRect(640, 980);
      window.dispatchEvent(new Event("scroll"));
    });

    expect(actionBar).toHaveClass("translate-y-full");
    expect(actionBar).toHaveClass("pointer-events-none");

    act(() => {
      currentRect = createRect(-320, -24);
      window.dispatchEvent(new Event("scroll"));
    });

    expect(actionBar).toHaveClass("translate-y-full");
    expect(actionBar).toHaveClass("pointer-events-none");

    act(() => {
      currentRect = createRect(760, 1120);
      window.dispatchEvent(new Event("scroll"));
    });

    expect(actionBar).toHaveClass("translate-y-0");
    expect(actionBar).toHaveClass("opacity-100");
  });
});