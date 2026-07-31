import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactElement } from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";

import { CartPageContent, type CartPageContentCopy } from "@/features/cart/components/cart-page-content";
import { useCartSelectionStore } from "@/features/cart/model/cart-selection.store";
import { createTestQueryClient } from "@/shared/test/create-test-query-client";
import { server } from "@/../tests/setup/msw/server";

function renderWithProviders(ui: ReactElement, queryClient: QueryClient) {
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

const copy: CartPageContentCopy = {
  loading: "Loading your cart...",
  empty: { title: "Your cart is empty", description: "Add a book to get started." },
  error: { title: "We could not load your cart", description: "Try again.", retry: "Try again" },
  summaryTitle: "Loan Summary",
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

const twoEligibleRowsBody = {
  items: [
    { id: 501, bookId: 101, book: { title: "The Left Hand of Darkness", availableCopies: 4 } },
    { id: 502, bookId: 201, book: { title: "Sapiens", availableCopies: 2 } },
  ],
  itemCount: 2,
};

const oneRowBecameIneligibleBody = {
  items: [
    { id: 501, bookId: 101, book: { title: "The Left Hand of Darkness", availableCopies: 4 } },
    { id: 502, bookId: 201, book: { title: "Sapiens", availableCopies: 0 } },
  ],
  itemCount: 2,
};

describe("cart selection reconciliation", () => {
  beforeEach(() => {
    useCartSelectionStore.setState({ selectedCartItemIds: new Set() });
  });

  it("keeps a still-eligible selection and drops a selection that became ineligible after a refetch", async () => {
    server.use(http.get("/api/cart", () => HttpResponse.json(twoEligibleRowsBody)));

    const queryClient = createTestQueryClient();
    const user = userEvent.setup();

    renderWithProviders(<CartPageContent copy={copy} initialCart={undefined} locale="en" />, queryClient);

    await waitFor(() => expect(screen.getByText("The Left Hand of Darkness")).toBeInTheDocument());

    await user.click(screen.getByRole("checkbox", { name: "Select The Left Hand of Darkness" }));
    await user.click(screen.getByRole("checkbox", { name: "Select Sapiens" }));

    expect(useCartSelectionStore.getState().selectedCartItemIds.has(501)).toBe(true);
    expect(useCartSelectionStore.getState().selectedCartItemIds.has(502)).toBe(true);

    server.use(http.get("/api/cart", () => HttpResponse.json(oneRowBecameIneligibleBody)));

    await act(async () => {
      await queryClient.invalidateQueries({ queryKey: ["en", "cart", "current"] });
    });

    await waitFor(() => expect(screen.getByRole("checkbox", { name: "Select Sapiens" })).toBeDisabled());

    expect(useCartSelectionStore.getState().selectedCartItemIds.has(501)).toBe(true);
    expect(useCartSelectionStore.getState().selectedCartItemIds.has(502)).toBe(false);
  });
});
