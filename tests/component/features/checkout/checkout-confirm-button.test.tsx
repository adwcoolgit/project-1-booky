import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactElement } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import {
  CheckoutConfirmButton,
  type CheckoutConfirmButtonCopy,
} from "@/features/checkout/components/checkout-confirm-button";
import { useLoanFromCartMutation } from "@/features/checkout/hooks/use-loan-from-cart-mutation";
import type { CheckoutFormInput } from "@/features/checkout/model/checkout-form";
import type { AppLocale } from "@/shared/i18n/config";
import { createTestQueryClient } from "@/shared/test/create-test-query-client";
import { server } from "@/../tests/setup/msw/server";
import { createFullSuccessLoanFixture } from "@/../tests/fixtures/cart/loan-fixtures";

// `CheckoutConfirmButton` takes its mutation as a prop (owned by
// `CheckoutPageContent` in production, so the outcome-handling effect there
// survives this button conditionally unmounting mid-flight). This harness
// reproduces that ownership for isolated component tests.
function ConfirmButtonHarness({
  locale,
  selectedCartItemIds,
  formInput,
  copy,
}: {
  locale: AppLocale;
  selectedCartItemIds: readonly number[];
  formInput: CheckoutFormInput;
  copy: CheckoutConfirmButtonCopy;
}) {
  const mutation = useLoanFromCartMutation({ locale });

  return (
    <CheckoutConfirmButton
      copy={copy}
      formInput={formInput}
      mutation={mutation}
      selectedCartItemIds={selectedCartItemIds}
    />
  );
}

function renderWithProviders(ui: ReactElement) {
  return render(<QueryClientProvider client={createTestQueryClient()}>{ui}</QueryClientProvider>);
}

function useDelayedLoanHandler(delayMs: number) {
  let requestCount = 0;

  server.use(
    http.post("/api/loans/from-cart", async () => {
      requestCount += 1;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return HttpResponse.json(createFullSuccessLoanFixture());
    }),
  );

  return () => requestCount;
}

const copy: CheckoutConfirmButtonCopy = {
  confirm: "Confirm Borrowing",
  pending: "Confirming...",
  error: "Your borrowing request could not be completed. Try again.",
};

const acceptedFormInput: CheckoutFormInput = {
  durationDays: 3,
  borrowDate: undefined,
  returnAcknowledged: true,
  policyAccepted: true,
};

describe("checkout confirm button", () => {
  it("is disabled until both agreements are accepted and at least one row is selected", () => {
    renderWithProviders(
      <ConfirmButtonHarness
        copy={copy}
        formInput={{ durationDays: 3, borrowDate: undefined, returnAcknowledged: true, policyAccepted: false }}
        locale="en"
        selectedCartItemIds={[501]}
      />,
    );

    expect(screen.getByRole("button", { name: copy.confirm })).toBeDisabled();
  });

  it("shows a pending label while the request is in flight, then resolves", async () => {
    useDelayedLoanHandler(50);
    const user = userEvent.setup();

    renderWithProviders(
      <ConfirmButtonHarness copy={copy} formInput={acceptedFormInput} locale="en" selectedCartItemIds={[501]} />,
    );

    await user.click(screen.getByRole("button", { name: copy.confirm }));

    expect(await screen.findByRole("button", { name: copy.pending })).toBeDisabled();
    // A full-success response keeps the button disabled (isSuccess) rather
    // than reverting to its idle label, since the real page navigates away
    // in this case; only a non-success outcome resets it for a retry.
    await waitFor(() => expect(screen.getByRole("button", { name: copy.confirm })).toBeDisabled());
  });

  it("sends exactly one request even under rapid repeated activation while pending", async () => {
    const getRequestCount = useDelayedLoanHandler(50);
    const user = userEvent.setup();

    renderWithProviders(
      <ConfirmButtonHarness copy={copy} formInput={acceptedFormInput} locale="en" selectedCartItemIds={[501]} />,
    );

    const button = screen.getByRole("button", { name: copy.confirm });

    await user.click(button);
    await waitFor(() => expect(button).toBeDisabled());

    // The button is disabled while pending, so these activations must be no-ops.
    await user.click(button);
    await user.click(button);

    await waitFor(() => expect(getRequestCount()).toBe(1));
  });

  it("shows a localized error message when the confirmation request fails outright", async () => {
    server.use(http.post("/api/loans/from-cart", () => HttpResponse.text("failed", { status: 500 })));

    const user = userEvent.setup();

    renderWithProviders(
      <ConfirmButtonHarness copy={copy} formInput={acceptedFormInput} locale="en" selectedCartItemIds={[501]} />,
    );

    await user.click(screen.getByRole("button", { name: copy.confirm }));

    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(copy.error));
  });
});
