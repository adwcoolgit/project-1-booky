"use client";

import { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import type { CheckoutPreviewPresentation } from "@/entities/checkout";
import type { BorrowConfirmationPresentation } from "@/entities/loan";
import { mapBorrowConfirmationResultToPresentation } from "@/entities/loan";
import { useCartSelectionStore } from "@/features/cart/model/cart-selection.store";
import {
  CheckoutBorrowDateField,
  type CheckoutBorrowDateFieldCopy,
} from "@/features/checkout/components/checkout-borrow-date-field";
import {
  CheckoutConfirmButton,
  type CheckoutConfirmButtonCopy,
} from "@/features/checkout/components/checkout-confirm-button";
import {
  CheckoutDurationSelect,
  type CheckoutDurationSelectCopy,
} from "@/features/checkout/components/checkout-duration-select";
import { CheckoutOutcomePanel, type CheckoutOutcomePanelCopy } from "@/features/checkout/components/checkout-outcome-panel";
import { CheckoutPageState, type CheckoutPageStateCopy } from "@/features/checkout/components/checkout-page-state";
import {
  CheckoutPolicyAgreement,
  type CheckoutPolicyAgreementCopy,
} from "@/features/checkout/components/checkout-policy-agreement";
import {
  CheckoutPreviewSummary,
  type CheckoutPreviewSummaryCopy,
} from "@/features/checkout/components/checkout-preview-summary";
import { useCheckoutPreviewQuery } from "@/features/checkout/hooks/use-checkout-preview-query";
import { useLoanFromCartMutation } from "@/features/checkout/hooks/use-loan-from-cart-mutation";
import { createDefaultCheckoutFormInput } from "@/features/checkout/model/checkout-form";
import { estimateReturnDate, toLocalDateInputValue } from "@/features/checkout/model/estimate-return-date";
import type { AppLocale } from "@/shared/i18n/config";

export type CheckoutPageContentCopy = CheckoutPageStateCopy & {
  preview: CheckoutPreviewSummaryCopy;
  duration: CheckoutDurationSelectCopy;
  borrowDate: CheckoutBorrowDateFieldCopy;
  policy: CheckoutPolicyAgreementCopy;
  returnDateLabel: string;
  confirmButton: CheckoutConfirmButtonCopy;
  outcomePanel: CheckoutOutcomePanelCopy;
};

export function CheckoutPageContent({
  locale,
  initialPreview,
  copy,
}: {
  locale: AppLocale;
  initialPreview: CheckoutPreviewPresentation | undefined;
  copy: CheckoutPageContentCopy;
}) {
  const router = useRouter();
  const selectedCartItemIds = useCartSelectionStore((state) => state.selectedCartItemIds);
  const query = useCheckoutPreviewQuery({ locale, initialPreview });
  const [formInput, setFormInput] = useState(createDefaultCheckoutFormInput);
  const [outcomePresentation, setOutcomePresentation] = useState<BorrowConfirmationPresentation | null>(null);
  // Owned here (not inside `CheckoutConfirmButton`) so the outcome-handling
  // effect below keeps running even if the confirm button's own subtree
  // conditionally stops rendering right after the response arrives (e.g. the
  // selection transiently reading as empty before this effect has run).
  const loanMutation = useLoanFromCartMutation({ locale });

  const selectedRows = useMemo(
    () => (query.data?.rows ?? []).filter((row) => row.isEligible && selectedCartItemIds.has(row.cartItemId)),
    [query.data, selectedCartItemIds],
  );

  useEffect(() => {
    if (!loanMutation.isSuccess || !loanMutation.data) {
      return;
    }

    const presentation = mapBorrowConfirmationResultToPresentation(loanMutation.data, { locale });

    if (presentation.outcome === "success") {
      router.replace(`/${locale}/checkout/success`);
      return;
    }

    setOutcomePresentation(presentation);
    // Re-arms the confirm button (isSuccess -> idle) so a partial/failed
    // outcome's remaining actionable items can be retried.
    loanMutation.reset();
  }, [loanMutation, loanMutation.isSuccess, loanMutation.data, locale, router]);

  useEffect(() => {
    // Skipped while a confirmation attempt is in flight or has just settled:
    // the reconciling refetch can legitimately (and transiently) show zero
    // selected rows before the outcome above is computed, and the user must
    // see that outcome instead of being yanked back to /cart.
    if (query.isSuccess && selectedRows.length === 0 && !outcomePresentation && loanMutation.isIdle) {
      router.replace(`/${locale}/cart`);
    }
  }, [query.isSuccess, selectedRows.length, outcomePresentation, loanMutation.isIdle, router, locale]);

  if (query.isPending) {
    return <CheckoutPageState copy={copy} state="loading" />;
  }

  if (query.isError || !query.data) {
    return <CheckoutPageState copy={copy} onRetry={() => void query.refetch()} state="error" />;
  }

  if (selectedRows.length === 0) {
    // A partial/failed outcome can legitimately empty the selection (every
    // row either succeeded-and-was-removed or failed); show that outcome
    // instead of the transient loading state used while redirecting away.
    if (outcomePresentation) {
      return <CheckoutOutcomePanel copy={copy.outcomePanel} locale={locale} outcome={outcomePresentation} />;
    }

    return <CheckoutPageState copy={copy} state="loading" />;
  }

  const estimatedReturnDate = estimateReturnDate({
    durationDays: formInput.durationDays,
    borrowDate: formInput.borrowDate,
  });
  const returnDateLabel = new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(estimatedReturnDate);
  const minBorrowDate = toLocalDateInputValue(new Date());

  return (
    <div className="flex flex-col gap-6">
      {outcomePresentation ? (
        <CheckoutOutcomePanel copy={copy.outcomePanel} locale={locale} outcome={outcomePresentation} />
      ) : null}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <CheckoutPreviewSummary
          className="lg:flex-1"
          copy={copy.preview}
          rows={selectedRows}
          userEmail={query.data.user.email}
          userName={query.data.user.name}
          userPhone={query.data.user.phone}
        />

        <div className="flex flex-col gap-5 rounded-[16px] border border-border bg-white p-5 lg:w-80">
          <CheckoutDurationSelect
            copy={copy.duration}
            onChange={(durationDays) => setFormInput((current) => ({ ...current, durationDays }))}
            value={formInput.durationDays}
          />
          <CheckoutBorrowDateField
            copy={copy.borrowDate}
            minDate={minBorrowDate}
            onChange={(borrowDate) => setFormInput((current) => ({ ...current, borrowDate }))}
            value={formInput.borrowDate ?? ""}
          />
          <div className="flex flex-col gap-1" data-checkout-return-date-preview="true">
            <p className="text-sm font-semibold text-foreground">{copy.returnDateLabel}</p>
            <p className="text-sm text-text-muted">{returnDateLabel}</p>
          </div>
          <CheckoutPolicyAgreement
            checked={formInput.policyAccepted}
            copy={copy.policy}
            onChange={(policyAccepted) => setFormInput((current) => ({ ...current, policyAccepted }))}
          />
          <CheckoutConfirmButton
            copy={copy.confirmButton}
            formInput={formInput}
            mutation={loanMutation}
            selectedCartItemIds={selectedRows.map((row) => row.cartItemId)}
          />
        </div>
      </div>
    </div>
  );
}
