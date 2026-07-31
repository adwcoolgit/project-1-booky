import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactElement } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";

import type { CartRowPresentation } from "@/entities/cart";
import { CartRow, type CartRowCopy } from "@/features/cart/components/cart-row";
import { useCartSelectionStore } from "@/features/cart/model/cart-selection.store";
import { createTestQueryClient } from "@/shared/test/create-test-query-client";
import { server } from "@/../tests/setup/msw/server";

function renderWithProviders(ui: ReactElement) {
  return render(<QueryClientProvider client={createTestQueryClient()}>{ui}</QueryClientProvider>);
}

const copy: CartRowCopy = {
  select: "Select",
  remove: "Remove",
  removeError: "This item could not be removed. Try again.",
};

const row: CartRowPresentation = {
  cartItemId: 501,
  bookId: 101,
  title: "The Left Hand of Darkness",
  authorName: "Ursula K. Le Guin",
  categoryLabel: "Science Fiction",
  isEligible: true,
  ineligibleReasonLabel: null,
  coverImage: { src: "https://images.example.test/book.jpg", alt: "The Left Hand of Darkness", isFallback: false },
};

describe("cart row remove control", () => {
  beforeEach(() => {
    useCartSelectionStore.setState({ selectedCartItemIds: new Set([501]) });
  });

  it("disables the remove button while the mutation is pending and drops the selection on success", async () => {
    server.use(
      http.delete("/api/cart/items/:itemId", async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        return HttpResponse.json({ ok: true });
      }),
    );

    const user = userEvent.setup();

    renderWithProviders(
      <CartRow copy={copy} isSelected={false} locale="en" onToggleSelect={() => {}} row={row} />,
    );

    const button = screen.getByRole("button", { name: copy.remove });

    await user.click(button);

    await waitFor(() => expect(button).toBeDisabled());
    await waitFor(() => expect(useCartSelectionStore.getState().selectedCartItemIds.has(501)).toBe(false));
  });

  it("shows a localized error and keeps the row selected when removal fails", async () => {
    server.use(http.delete("/api/cart/items/:itemId", () => HttpResponse.text("failure", { status: 500 })));

    const user = userEvent.setup();

    renderWithProviders(
      <CartRow copy={copy} isSelected={false} locale="en" onToggleSelect={() => {}} row={row} />,
    );

    await user.click(screen.getByRole("button", { name: copy.remove }));

    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(copy.removeError));
    expect(useCartSelectionStore.getState().selectedCartItemIds.has(501)).toBe(true);
  });
});
