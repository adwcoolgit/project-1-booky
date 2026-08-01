import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactElement } from "react";
import { NextIntlClientProvider } from "next-intl";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { mapBorrowConfirmationResultToPresentation, mapLoanFromCartResponseDtoToResult } from "@/entities/loan";
import { useCartSelectionStore } from "@/features/cart/model/cart-selection.store";
import {
  CheckoutOutcomePanel,
  type CheckoutOutcomePanelCopy,
} from "@/features/checkout/components/checkout-outcome-panel";
import { CheckoutPageContent, type CheckoutPageContentCopy } from "@/features/checkout/components/checkout-page-content";
import { getMessages } from "@/shared/i18n/get-messages";
import { createTestQueryClient } from "@/shared/test/create-test-query-client";
import { server } from "@/../tests/setup/msw/server";
import { createFullFailureLoanFixture, createPartialSuccessLoanFixture } from "@/../tests/fixtures/cart/loan-fixtures";

const replaceSpy = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceSpy, push: vi.fn(), refresh: vi.fn(), prefetch: vi.fn() }),
}));

const outcomeCopy: CheckoutOutcomePanelCopy = {
  successTitle: "Borrowing Successful",
  successDescriptionTemplate: "Please return the books by {date}.",
  borrowedListLink: "Borrowed List",
  partialTitle: "Some books could not be borrowed",
  partialSucceededTitle: "Borrowed successfully",
  partialFailedTitle: "Could not be borrowed",
  removedCountOne: "{count} item was removed from your cart.",
  removedCountOther: "{count} items were removed from your cart.",
  failedTitle: "Borrowing failed",
  failedDescription: "None of the selected books could be borrowed. Review the reasons below and try again.",
};

describe("CheckoutOutcomePanel", () => {
  it("lists succeeded, failed, and removed groups distinctly for a partial outcome", () => {
    const result = { succeeded: [{ cartItemId: 501, bookTitle: "The Left Hand of Darkness", borrowedAt: null, dueAt: null, returnByMessage: "Return by 5 August 2026." }], failed: [{ cartItemId: 503, reasonCode: "out-of-stock" }], removedCartItemIds: [501] };
    const presentation = mapBorrowConfirmationResultToPresentation(result, { locale: "en" });

    render(<CheckoutOutcomePanel copy={outcomeCopy} locale="en" outcome={presentation} />);

    expect(screen.getByRole("heading", { name: "Some books could not be borrowed" })).toBeInTheDocument();
    expect(screen.getByText("The Left Hand of Darkness")).toBeInTheDocument();
    expect(screen.getByText("out-of-stock")).toBeInTheDocument();
    // cartItemId 501 both succeeded and was removed (the server's normal
    // "converted to a loan" signal), so it must not double-count as a
    // separately-removed item distinct from the succeeded group.
    expect(screen.queryByText(/removed from your cart/)).not.toBeInTheDocument();
  });

  it("shows a removed-count notice only for ids that are neither succeeded nor failed", () => {
    const presentation = mapBorrowConfirmationResultToPresentation(
      { succeeded: [], failed: [{ cartItemId: 503, reasonCode: "out-of-stock" }], removedCartItemIds: [503, 999] },
      { locale: "en" },
    );

    render(<CheckoutOutcomePanel copy={outcomeCopy} locale="en" outcome={presentation} />);

    expect(screen.getByText("1 item was removed from your cart.")).toBeInTheDocument();
  });

  it("presents a full-failure outcome distinctly from partial success", () => {
    const result = mapLoanFromCartResponseDtoToResult(createFullFailureLoanFixture());
    const presentation = mapBorrowConfirmationResultToPresentation(result, { locale: "en" });

    render(<CheckoutOutcomePanel copy={outcomeCopy} locale="en" outcome={presentation} />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Borrowing failed" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Some books could not be borrowed" })).not.toBeInTheDocument();
  });
});

function renderPageContent(ui: ReactElement, queryClient: QueryClient) {
  return render(
    <NextIntlClientProvider locale="en" messages={getMessages("en")}>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </NextIntlClientProvider>,
  );
}

describe("CheckoutPageContent partial-success recovery", () => {
  const pageCopy: CheckoutPageContentCopy = {
    loading: "Loading checkout...",
    error: { title: "We could not load checkout", description: "Try again.", retry: "Try again" },
    cardTitle: "Complete Your Borrow Request",
    preview: {
      title: "User Information",
      booksTitle: "Book List",
      nameLabel: "Name",
      emailLabel: "Email",
      phoneLabel: "Phone Number",
    },
    duration: { label: "Duration" },
    borrowDate: { label: "Borrow Date", estimateNotice: "This is an estimate." },
    agreements: {
      returnAcknowledgement: "I agree to return the book(s) before the due date.",
      policyAgreement: "I accept the library borrowing policy.",
    },
    returnDateLabel: "Return Date",
    returnDateDescriptionTemplate: "Please return the book no later than {date}.",
    confirmButton: {
      confirm: "Confirm Borrowing",
      pending: "Confirming...",
      error: "Your borrowing request could not be completed. Try again.",
    },
    outcomePanel: outcomeCopy,
  };

  beforeEach(() => {
    useCartSelectionStore.setState({ selectedCartItemIds: new Set([501, 503]) });
    replaceSpy.mockClear();
  });

  it("keeps the failed row selectable/actionable and drops the removed row, without redirecting away", async () => {
    server.use(
      http.get("/api/cart/checkout", () =>
        HttpResponse.json({
          user: { name: "Jordan Reader", email: null, phone: null },
          items: [
            { id: 501, bookId: 101, book: { title: "The Left Hand of Darkness", availableCopies: 4 } },
            { id: 503, bookId: 201, book: { title: "Sold Out Title", availableCopies: 4 } },
          ],
          itemCount: 2,
        }),
      ),
      http.post("/api/loans/from-cart", () => HttpResponse.json(createPartialSuccessLoanFixture())),
    );

    const queryClient = createTestQueryClient();
    const user = userEvent.setup();

    renderPageContent(<CheckoutPageContent copy={pageCopy} initialPreview={undefined} locale="en" />, queryClient);

    await waitFor(() => expect(screen.getByText("Sold Out Title")).toBeInTheDocument());

    await user.click(screen.getByRole("checkbox", { name: "I agree to return the book(s) before the due date." }));
    await user.click(screen.getByRole("checkbox", { name: "I accept the library borrowing policy." }));

    // Re-mock the cart/checkout GET after confirmation so the reconciling
    // refetch reflects the server having removed cartItemId 501 (converted
    // to a loan) while leaving the failed row (503) in place.
    server.use(
      http.get("/api/cart/checkout", () =>
        HttpResponse.json({
          user: { name: "Jordan Reader", email: null, phone: null },
          items: [{ id: 503, bookId: 201, book: { title: "Sold Out Title", availableCopies: 4 } }],
          itemCount: 1,
        }),
      ),
    );

    await user.click(screen.getByRole("button", { name: "Confirm Borrowing" }));

    await waitFor(() => expect(screen.getByRole("heading", { name: "Some books could not be borrowed" })).toBeInTheDocument());

    expect(screen.getByText("out-of-stock")).toBeInTheDocument();

    // The removed row must disappear from the checkout preview list (it may
    // still legitimately appear once, inside the outcome panel's "borrowed
    // successfully" group), while the failed row remains visible/actionable
    // in the preview below for a retry.
    await waitFor(() => {
      const previewRows = document.querySelector('[data-checkout-preview-rows="true"]');

      expect(previewRows).not.toBeNull();
      expect(previewRows).toHaveTextContent("Sold Out Title");
      expect(previewRows).not.toHaveTextContent("The Left Hand of Darkness");
    });
    expect(useCartSelectionStore.getState().selectedCartItemIds.has(501)).toBe(false);
    expect(useCartSelectionStore.getState().selectedCartItemIds.has(503)).toBe(true);
    expect(replaceSpy).not.toHaveBeenCalledWith("/en/cart");

    // A retry is still possible: the confirm button is present and re-enabled.
    expect(screen.getByRole("button", { name: "Confirm Borrowing" })).not.toBeDisabled();
  });
});
