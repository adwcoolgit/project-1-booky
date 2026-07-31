import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactElement } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";

import { CartSummary, type CartSummaryCopy } from "@/features/cart/components/cart-summary";
import { useCartSelectionStore } from "@/features/cart/model/cart-selection.store";
import { createTestQueryClient } from "@/shared/test/create-test-query-client";
import { server } from "@/../tests/setup/msw/server";

function renderWithProviders(ui: ReactElement) {
  return render(<QueryClientProvider client={createTestQueryClient()}>{ui}</QueryClientProvider>);
}

const copy: CartSummaryCopy = {
  clear: "Clear cart",
  clearError: "Your cart could not be cleared. Try again.",
  checkout: "Checkout",
  checkoutBlocked: "Select at least one eligible book to continue to checkout.",
  totalBookLabel: "Total Book",
};

describe("cart summary clear control", () => {
  beforeEach(() => {
    useCartSelectionStore.setState({ selectedCartItemIds: new Set([501, 502]) });
  });

  it("disables the clear button while pending and clears the selection store on success", async () => {
    server.use(
      http.delete("/api/cart", async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        return HttpResponse.json({ ok: true });
      }),
    );

    const user = userEvent.setup();

    renderWithProviders(
      <CartSummary
        copy={copy}
        itemCountLabel="2 items in your cart"
        locale="en"
        selectedEligibleCount={1}
        title="Loan Summary"
      />,
    );

    const button = screen.getByRole("button", { name: copy.clear });

    await user.click(button);

    await waitFor(() => expect(button).toBeDisabled());
    await waitFor(() => expect(useCartSelectionStore.getState().selectedCartItemIds.size).toBe(0));
  });

  it("shows a localized error and keeps the selection when clearing fails", async () => {
    server.use(http.delete("/api/cart", () => HttpResponse.text("failure", { status: 500 })));

    const user = userEvent.setup();

    renderWithProviders(
      <CartSummary
        copy={copy}
        itemCountLabel="2 items in your cart"
        locale="en"
        selectedEligibleCount={1}
        title="Loan Summary"
      />,
    );

    await user.click(screen.getByRole("button", { name: copy.clear }));

    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(copy.clearError));
    expect(useCartSelectionStore.getState().selectedCartItemIds.size).toBe(2);
  });
});
