import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactElement } from "react";
import { NextIntlClientProvider } from "next-intl";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  CheckoutBorrowDateField,
  type CheckoutBorrowDateFieldCopy,
} from "@/features/checkout/components/checkout-borrow-date-field";
import { CheckoutDurationSelect } from "@/features/checkout/components/checkout-duration-select";
import { CheckoutPageContent, type CheckoutPageContentCopy } from "@/features/checkout/components/checkout-page-content";
import {
  CheckoutPolicyAgreement,
  type CheckoutPolicyAgreementCopy,
} from "@/features/checkout/components/checkout-policy-agreement";
import {
  CheckoutPreviewSummary,
  type CheckoutPreviewSummaryCopy,
} from "@/features/checkout/components/checkout-preview-summary";
import { useCartSelectionStore } from "@/features/cart/model/cart-selection.store";
import { getMessages } from "@/shared/i18n/get-messages";
import { createTestQueryClient } from "@/shared/test/create-test-query-client";
import { server } from "@/../tests/setup/msw/server";

const replaceSpy = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceSpy, push: vi.fn(), refresh: vi.fn(), prefetch: vi.fn() }),
}));

function renderWithIntl(ui: ReactElement) {
  return render(<NextIntlClientProvider locale="en" messages={getMessages("en")}>{ui}</NextIntlClientProvider>);
}

function renderPageContent(ui: ReactElement, queryClient: QueryClient) {
  return render(
    <NextIntlClientProvider locale="en" messages={getMessages("en")}>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </NextIntlClientProvider>,
  );
}

describe("CheckoutDurationSelect", () => {
  it("renders the documented duration options with pluralized labels", () => {
    renderWithIntl(
      <CheckoutDurationSelect copy={{ label: "Duration" }} onChange={vi.fn()} value={3} />,
    );

    expect(screen.getByRole("button", { name: "3 days" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "5 days" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "10 days" })).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onChange with the selected duration", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    renderWithIntl(<CheckoutDurationSelect copy={{ label: "Duration" }} onChange={onChange} value={3} />);

    await user.click(screen.getByRole("button", { name: "5 days" }));

    expect(onChange).toHaveBeenCalledWith(5);
  });
});

describe("CheckoutBorrowDateField", () => {
  const copy: CheckoutBorrowDateFieldCopy = {
    label: "Borrow Date",
    estimateNotice: "This is an estimate.",
  };

  it("renders the label, estimate notice, and current value", () => {
    render(<CheckoutBorrowDateField copy={copy} minDate="2026-07-31" onChange={vi.fn()} value="2026-08-01" />);

    expect(screen.getByLabelText("Borrow Date")).toHaveValue("2026-08-01");
    expect(screen.getByText("This is an estimate.")).toBeInTheDocument();
  });

  it("calls onChange when the date input changes", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<CheckoutBorrowDateField copy={copy} minDate="2026-07-31" onChange={onChange} value="" />);

    await user.type(screen.getByLabelText("Borrow Date"), "2026-08-05");

    expect(onChange).toHaveBeenCalled();
  });
});

describe("CheckoutPolicyAgreement", () => {
  const copy: CheckoutPolicyAgreementCopy = {
    agreement: "I agree to the borrowing policy.",
    policyRequired: "You must accept the borrowing policy before you can confirm borrowing.",
  };

  it("shows the policy-required notice while unchecked", () => {
    render(<CheckoutPolicyAgreement checked={false} copy={copy} onChange={vi.fn()} />);

    expect(screen.getByText(copy.policyRequired)).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: copy.agreement })).not.toBeChecked();
  });

  it("hides the policy-required notice once accepted", () => {
    render(<CheckoutPolicyAgreement checked={true} copy={copy} onChange={vi.fn()} />);

    expect(screen.queryByText(copy.policyRequired)).not.toBeInTheDocument();
  });

  it("calls onChange when toggled", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<CheckoutPolicyAgreement checked={false} copy={copy} onChange={onChange} />);

    await user.click(screen.getByRole("checkbox", { name: copy.agreement }));

    expect(onChange).toHaveBeenCalledWith(true);
  });
});

describe("CheckoutPreviewSummary", () => {
  const copy: CheckoutPreviewSummaryCopy = { title: "Your Information", booksTitle: "Selected Books" };

  it("renders the user's information and selected book rows", () => {
    render(
      <CheckoutPreviewSummary
        copy={copy}
        rows={[
          {
            cartItemId: 501,
            bookId: 101,
            title: "The Left Hand of Darkness",
            authorName: "Ursula K. Le Guin",
            categoryLabel: "Science Fiction",
            isEligible: true,
            ineligibleReasonLabel: null,
            coverImage: { src: "https://images.example.test/book.jpg", alt: "The Left Hand of Darkness", isFallback: false },
          },
        ]}
        userEmail="jordan.reader@example.test"
        userName="Jordan Reader"
        userPhone="+62-812-0000-0000"
      />,
    );

    expect(screen.getByText("Your Information")).toBeInTheDocument();
    expect(screen.getByText("Jordan Reader")).toBeInTheDocument();
    expect(screen.getByText("jordan.reader@example.test")).toBeInTheDocument();
    expect(screen.getByText("The Left Hand of Darkness")).toBeInTheDocument();
    expect(screen.getByText("Ursula K. Le Guin")).toBeInTheDocument();
  });
});

describe("CheckoutPageContent policy gating", () => {
  const copy: CheckoutPageContentCopy = {
    loading: "Loading checkout...",
    error: { title: "We could not load checkout", description: "Try again.", retry: "Try again" },
    preview: { title: "Your Information", booksTitle: "Selected Books" },
    duration: { label: "Duration" },
    borrowDate: { label: "Borrow Date", estimateNotice: "This is an estimate." },
    policy: {
      agreement: "I agree to the borrowing policy.",
      policyRequired: "You must accept the borrowing policy before you can confirm borrowing.",
    },
    returnDateLabel: "Return Date",
    confirmButton: {
      confirm: "Confirm Borrowing",
      pending: "Confirming...",
      error: "Your borrowing request could not be completed. Try again.",
    },
    outcomePanel: {
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
    },
  };

  beforeEach(() => {
    useCartSelectionStore.setState({ selectedCartItemIds: new Set([501]) });
    replaceSpy.mockClear();
  });

  it("shows the policy-required notice until the eligible selection accepts the policy", async () => {
    server.use(
      http.get("/api/cart/checkout", () =>
        HttpResponse.json({
          user: { name: "Jordan Reader", email: "jordan.reader@example.test", phone: null },
          items: [{ id: 501, bookId: 101, book: { title: "The Left Hand of Darkness", availableCopies: 4 } }],
          itemCount: 1,
        }),
      ),
    );

    const queryClient = createTestQueryClient();

    renderPageContent(<CheckoutPageContent copy={copy} initialPreview={undefined} locale="en" />, queryClient);

    await waitFor(() => expect(screen.getByText("The Left Hand of Darkness")).toBeInTheDocument());

    expect(screen.getByText(copy.policy.policyRequired)).toBeInTheDocument();

    const user = userEvent.setup();

    await user.click(screen.getByRole("checkbox", { name: copy.policy.agreement }));

    expect(screen.queryByText(copy.policy.policyRequired)).not.toBeInTheDocument();
    expect(replaceSpy).not.toHaveBeenCalled();
  });

  it("redirects to the cart when no eligible row is selected", async () => {
    useCartSelectionStore.setState({ selectedCartItemIds: new Set() });
    server.use(
      http.get("/api/cart/checkout", () =>
        HttpResponse.json({
          user: { name: "Jordan Reader", email: null, phone: null },
          items: [{ id: 501, bookId: 101, book: { title: "The Left Hand of Darkness", availableCopies: 4 } }],
          itemCount: 1,
        }),
      ),
    );

    const queryClient = createTestQueryClient();

    renderPageContent(<CheckoutPageContent copy={copy} initialPreview={undefined} locale="en" />, queryClient);

    await waitFor(() => expect(replaceSpy).toHaveBeenCalledWith("/en/cart"));
  });
});
