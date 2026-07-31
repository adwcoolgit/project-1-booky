"use client";

import type { UseMutationResult } from "@tanstack/react-query";

import type { BorrowConfirmationResult } from "@/entities/loan";
import type { LoanFromCartRequestDto } from "@/features/checkout/api/schemas";
import type { CheckoutFormInput } from "@/features/checkout/model/checkout-form";
import { createLoanFromCartRequestDto } from "@/features/checkout/model/create-loan-from-cart-request";
import { cn } from "@/shared/lib/utils";

export type CheckoutConfirmButtonCopy = {
  confirm: string;
  pending: string;
  error: string;
};

export type CheckoutConfirmButtonProps = {
  selectedCartItemIds: readonly number[];
  formInput: CheckoutFormInput;
  copy: CheckoutConfirmButtonCopy;
  // Owned by the parent (`CheckoutPageContent`), not this component: the
  // outcome-handling effect that reacts to `mutation.isSuccess` must not be
  // torn down by this button conditionally unmounting mid-flight (e.g. while
  // the selection transiently reads as empty right after the server response
  // arrives but before the outcome/reconciliation effects have run).
  mutation: UseMutationResult<BorrowConfirmationResult, unknown, LoanFromCartRequestDto>;
  className?: string | undefined;
};

export function CheckoutConfirmButton({
  selectedCartItemIds,
  formInput,
  copy,
  mutation,
  className,
}: CheckoutConfirmButtonProps) {
  const canConfirm = selectedCartItemIds.length > 0 && formInput.policyAccepted;
  // `isSuccess` is included so a resolved-but-not-yet-navigated-away
  // full-success response can't be double-submitted; the parent resets the
  // mutation immediately after handling a non-success outcome so failed
  // selections remain actionable/retryable per spec Edge Cases.
  const isDisabled = !canConfirm || mutation.isPending || mutation.isSuccess;

  return (
    <div className="flex flex-col gap-2">
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95 disabled:pointer-events-none disabled:opacity-60",
          className,
        )}
        data-checkout-confirm="true"
        disabled={isDisabled}
        onClick={() => {
          // The `disabled` attribute already prevents click events while
          // pending, but this guard is a second line of defense: FR-011
          // requires exactly one in-flight confirmation request no matter
          // how activation is triggered.
          if (mutation.isPending) {
            return;
          }

          mutation.mutate(createLoanFromCartRequestDto(selectedCartItemIds, formInput));
        }}
        type="button"
      >
        {mutation.isPending ? copy.pending : copy.confirm}
      </button>
      {mutation.isError ? (
        <p className="text-sm font-medium text-danger-accent" role="alert">
          {copy.error}
        </p>
      ) : null}
    </div>
  );
}
