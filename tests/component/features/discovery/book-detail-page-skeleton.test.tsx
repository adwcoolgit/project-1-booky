import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BookDetailPageSkeleton } from "@/features/discovery";

describe("BookDetailPageSkeleton", () => {
  it("renders shell and content placeholders for the book detail loading state", () => {
    const { container } = render(<BookDetailPageSkeleton />);

    expect(container.querySelector('[data-book-detail-page-skeleton="true"]')).toBeInTheDocument();
    expect(container.querySelector('[data-book-detail-skeleton-header="true"]')).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(container.querySelector('[data-book-detail-skeleton-hero="true"]')).toBeInTheDocument();
    expect(container.querySelector('[data-book-detail-skeleton-reviews="true"]')).toBeInTheDocument();
    expect(container.querySelector('[data-book-detail-skeleton-related="true"]')).toBeInTheDocument();
    expect(container.querySelector('[data-book-detail-skeleton-footer="true"]')).toBeInTheDocument();
  });
});
