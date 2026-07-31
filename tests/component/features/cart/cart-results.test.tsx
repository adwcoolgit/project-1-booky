import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactElement } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { mapCartResponseDtoToServerCart, mapServerCartToPresentation } from "@/entities/cart";
import { CartPageContent, type CartPageContentCopy } from "@/features/cart/components/cart-page-content";
import { createTestQueryClient } from "@/shared/test/create-test-query-client";
import { server } from "@/../tests/setup/msw/server";
import { createEmptyCartFixture, createSingleItemCartFixture } from "@/../tests/fixtures/cart/cart-fixtures";

function renderWithProviders(ui: ReactElement) {
  return render(<QueryClientProvider client={createTestQueryClient()}>{ui}</QueryClientProvider>);
}

const copy: CartPageContentCopy = {
  loading: "Loading your cart...",
  empty: { title: "Your cart is empty", description: "Add a book to get started." },
  error: { title: "We could not load your cart", description: "Try again.", retry: "Try again" },
  summaryTitle: "My Cart",
  selectAll: "Select All",
  row: { select: "Select", remove: "Remove", removeError: "This item could not be removed. Try again." },
  summary: {
    clear: "Clear cart",
    clearError: "Your cart could not be cleared. Try again.",
    checkout: "Checkout",
    checkoutBlocked: "Select at least one eligible book to continue to checkout.",
    totalBookLabel: "Total Book",
  },
};

describe("cart page content", () => {
  it("renders seeded cart rows and the summary without an extra fetch cycle", () => {
    const cart = mapServerCartToPresentation(mapCartResponseDtoToServerCart(createSingleItemCartFixture()), {
      locale: "en",
    });

    renderWithProviders(<CartPageContent copy={copy} initialCart={cart} locale="en" />);

    expect(screen.getByText("The Left Hand of Darkness")).toBeInTheDocument();
    expect(screen.getByText("My Cart")).toBeInTheDocument();
  });

  it("fetches and renders the cart when no seed data is provided", async () => {
    renderWithProviders(<CartPageContent copy={copy} initialCart={undefined} locale="en" />);

    expect(screen.getByText(copy.loading)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("The Left Hand of Darkness")).toBeInTheDocument());
  });

  it("shows the empty state when the cart has no rows", async () => {
    server.use(http.get("/api/cart", () => HttpResponse.json(createEmptyCartFixture())));

    renderWithProviders(<CartPageContent copy={copy} initialCart={undefined} locale="en" />);

    await waitFor(() => expect(screen.getByText(copy.empty.title)).toBeInTheDocument());
  });

  it("shows a retryable error state when the fetch fails", async () => {
    server.use(http.get("/api/cart", () => HttpResponse.text("failure", { status: 500 })));

    renderWithProviders(<CartPageContent copy={copy} initialCart={undefined} locale="en" />);

    await waitFor(() => expect(screen.getByText(copy.error.title)).toBeInTheDocument());
    expect(screen.getByRole("button", { name: copy.error.retry })).toBeInTheDocument();
  });
});
