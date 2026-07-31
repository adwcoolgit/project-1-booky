import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactElement } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { AddToCartButton, type AddToCartButtonCopy } from "@/features/cart/components/add-to-cart-button";
import { createTestQueryClient } from "@/shared/test/create-test-query-client";
import { server } from "@/../tests/setup/msw/server";

function renderWithProviders(ui: ReactElement) {
  return render(<QueryClientProvider client={createTestQueryClient()}>{ui}</QueryClientProvider>);
}

function useDelayedAddToCartHandler(delayMs: number) {
  let requestCount = 0;

  server.use(
    http.post("/api/cart/items", async () => {
      requestCount += 1;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return HttpResponse.json({ ok: true });
    }),
  );

  return () => requestCount;
}

const copy: AddToCartButtonCopy = {
  idle: "Add to Cart",
  pending: "Adding...",
  added: "Added to cart",
  error: "This book could not be added to your cart. It may be out of stock, already in your cart, or unavailable.",
};

describe("add to cart button", () => {
  it("shows a pending label while the mutation is in flight, then a success label", async () => {
    useDelayedAddToCartHandler(50);

    const user = userEvent.setup();

    renderWithProviders(<AddToCartButton bookId={101} copy={copy} locale="en" />);

    await user.click(screen.getByRole("button", { name: copy.idle }));

    expect(await screen.findByRole("button", { name: copy.pending })).toBeDisabled();
    await waitFor(() => expect(screen.getByRole("button", { name: copy.added })).toBeInTheDocument());
  });

  it("prevents a second submission while the first request is pending", async () => {
    const getRequestCount = useDelayedAddToCartHandler(50);
    const user = userEvent.setup();

    renderWithProviders(<AddToCartButton bookId={101} copy={copy} locale="en" />);

    const button = screen.getByRole("button", { name: copy.idle });

    await user.click(button);
    await waitFor(() => expect(button).toBeDisabled());

    // The button is disabled while pending, so these activations must be no-ops.
    await user.click(button);
    await user.click(button);

    await waitFor(() => expect(screen.getByRole("button", { name: copy.added })).toBeInTheDocument());
    expect(getRequestCount()).toBe(1);
  });

  it("shows a localized rejection message when the book cannot be added", async () => {
    server.use(http.post("/api/cart/items", () => HttpResponse.text("rejected", { status: 400 })));

    const user = userEvent.setup();

    renderWithProviders(<AddToCartButton bookId={101} copy={copy} locale="en" />);

    await user.click(screen.getByRole("button", { name: copy.idle }));

    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(copy.error));
  });
});
