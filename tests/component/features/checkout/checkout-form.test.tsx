import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactElement } from "react";
import { NextIntlClientProvider } from "next-intl";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CheckoutAgreements, type CheckoutAgreementsCopy } from "@/features/checkout/components/checkout-agreements";
import {
  CheckoutBorrowDateField,
  type CheckoutBorrowDateFieldCopy,
} from "@/features/checkout/components/checkout-borrow-date-field";
import { CheckoutDurationSelect } from "@/features/checkout/components/checkout-duration-select";
import { CheckoutPageContent, type CheckoutPageContentCopy } from "@/features/checkout/components/checkout-page-content";
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

describe("CheckoutAgreements", () => {
  const copy: CheckoutAgreementsCopy = {
    returnAcknowledgement: "I agree to return the book(s) before the due date.",
    policyAgreement: "I accept the library borrowing policy.",
  };

  it("renders both agreement checkboxes unchecked by default", () => {
    render(
      <CheckoutAgreements
        copy={copy}
        onChangePolicyAccepted={vi.fn()}
        onChangeReturnAcknowledged={vi.fn()}
        policyAccepted={false}
        returnAcknowledged={false}
      />,
    );

    expect(screen.getByRole("checkbox", { name: copy.returnAcknowledgement })).not.toBeChecked();
    expect(screen.getByRole("checkbox", { name: copy.policyAgreement })).not.toBeChecked();
  });

  it("calls the matching handler when each checkbox is toggled", async () => {
    const onChangeReturnAcknowledged = vi.fn();
    const onChangePolicyAccepted = vi.fn();
    const user = userEvent.setup();

    render(
      <CheckoutAgreements
        copy={copy}
        onChangePolicyAccepted={onChangePolicyAccepted}
        onChangeReturnAcknowledged={onChangeReturnAcknowledged}
        policyAccepted={false}
        returnAcknowledged={false}
      />,
    );

    await user.click(screen.getByRole("checkbox", { name: copy.returnAcknowledgement }));
    await user.click(screen.getByRole("checkbox", { name: copy.policyAgreement }));

    expect(onChangeReturnAcknowledged).toHaveBeenCalledWith(true);
    expect(onChangePolicyAccepted).toHaveBeenCalledWith(true);
  });
});

describe("CheckoutPreviewSummary", () => {
  const copy: CheckoutPreviewSummaryCopy = {
    title: "User Information",
    booksTitle: "Book List",
    nameLabel: "Name",
    emailLabel: "Email",
    phoneLabel: "Phone Number",
  };

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

    expect(screen.getByText("User Information")).toBeInTheDocument();
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

  it("keeps confirm disabled until both agreements are accepted", async () => {
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

    const confirmButton = screen.getByRole("button", { name: copy.confirmButton.confirm });

    expect(confirmButton).toBeDisabled();

    const user = userEvent.setup();

    await user.click(screen.getByRole("checkbox", { name: copy.agreements.returnAcknowledgement }));
    expect(confirmButton).toBeDisabled();

    await user.click(screen.getByRole("checkbox", { name: copy.agreements.policyAgreement }));
    expect(confirmButton).toBeEnabled();
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
