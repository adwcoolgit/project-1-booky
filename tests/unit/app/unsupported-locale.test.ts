import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PublicFoundationPage from "@/app/[locale]/(foundation)/foundation/public/page";

vi.mock("@/features/foundation-shell/components/locale-switcher", () => ({
  LocaleSwitcher: () => React.createElement("div", { "data-testid": "locale-switcher" }, "locale-switcher"),
}));

describe("unsupported locale route handling", () => {
  it("renders a controlled not-found boundary for unsupported locale placeholder routes", async () => {
    const view = await PublicFoundationPage({
      params: Promise.resolve({ locale: "fr" }),
      searchParams: Promise.resolve({}),
    });

    render(view);

    expect(screen.getByRole("heading", { name: "This foundation page is unavailable" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Go to public placeholder" })).toHaveAttribute(
      "href",
      "/en/foundation/public",
    );
  });
});
