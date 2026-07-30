import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { BoundaryStateView } from "@/features/foundation-shell";

vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt: string; src: string }) => <span data-next-image={src} data-next-image-alt={alt} />,
}));

vi.mock("@/features/foundation-shell/components/locale-switcher", () => ({
  LocaleSwitcher: () => <div data-testid="locale-switcher">locale-switcher</div>,
}));

describe("boundary state view", () => {
  it("renders the admin error boundary with localized retry and recovery actions", () => {
    const onRetry = vi.fn();

    render(
      <BoundaryStateView
        error={{ name: "Error", message: "boom", digest: "abc123" }}
        locale="id"
        notFoundReason="generic"
        onRetry={onRetry}
        pathname="/id/foundation/admin"
        state="error"
      />,
    );

    expect(screen.getAllByText("Shell admin-facing").length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: "Tampilan fondasi ini tidak dapat dirender" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Buka placeholder publik" })).toHaveAttribute(
      "href",
      "/id/foundation/public",
    );

    fireEvent.click(screen.getByRole("button", { name: "Coba lagi" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("renders a polite loading boundary inside the public shell", () => {
    render(<BoundaryStateView locale="en" pathname="/en/foundation/public" state="loading" />);

    expect(screen.getAllByText("User-facing shell").length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: "Preparing foundation shell" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByTestId("locale-switcher")).toBeInTheDocument();
  });

  it("falls back to English copy for unsupported locale not-found states", () => {
    render(
      <BoundaryStateView
        locale="fr"
        notFoundReason="unsupported-locale"
        pathname="/fr/foundation/public"
        state="not-found"
      />,
    );

    expect(screen.getByRole("heading", { name: "This foundation page is unavailable" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Go to public placeholder" })).toHaveAttribute(
      "href",
      "/en/foundation/public",
    );
  });
});



