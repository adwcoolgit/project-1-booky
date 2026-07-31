"use client";

import Link from "next/link";

import type { BorrowConfirmationPresentation, BorrowedLoanPresentation } from "@/entities/loan";
import type { AppLocale } from "@/shared/i18n/config";
import { cn } from "@/shared/lib/utils";

export type CheckoutOutcomePanelCopy = {
  successTitle: string;
  successDescriptionTemplate: string;
  borrowedListLink: string;
  partialTitle: string;
  partialSucceededTitle: string;
  partialFailedTitle: string;
  removedCountOne: string;
  removedCountOther: string;
  failedTitle: string;
  failedDescription: string;
};

const panelClassName = "flex flex-col gap-4 rounded-[16px] border border-border bg-white p-6";
const failedItemClassName = "text-sm font-medium text-danger-accent";

function resolveDueDateGuidance(succeeded: readonly BorrowedLoanPresentation[], template: string): string | null {
  const returnByMessage = succeeded.find((loan) => loan.returnByMessage)?.returnByMessage;

  if (returnByMessage) {
    return returnByMessage;
  }

  const dueDateLabel = succeeded.find((loan) => loan.dueDateLabel)?.dueDateLabel;

  return dueDateLabel ? template.replace("{date}", dueDateLabel) : null;
}

function resolveRemovedOnlyCount(outcome: BorrowConfirmationPresentation): number {
  // A row already shown in the succeeded or failed group must not also be
  // counted here, so each cart row appears in exactly one of the panel's
  // three groups.
  const accountedForIds = new Set([
    ...outcome.succeeded.map((loan) => loan.cartItemId).filter((cartItemId): cartItemId is number => cartItemId !== null),
    ...outcome.failed.map((item) => item.cartItemId),
  ]);

  return outcome.removedCartItemIds.filter((cartItemId) => !accountedForIds.has(cartItemId)).length;
}

function resolveRemovedLabel(count: number, copy: CheckoutOutcomePanelCopy, locale: AppLocale): string | null {
  if (count === 0) {
    return null;
  }

  const template = count === 1 ? copy.removedCountOne : copy.removedCountOther;

  return template.replace("{count}", new Intl.NumberFormat(locale).format(count));
}

export type CheckoutOutcomePanelProps = {
  outcome: BorrowConfirmationPresentation;
  copy: CheckoutOutcomePanelCopy;
  locale: AppLocale;
  className?: string | undefined;
};

export function CheckoutOutcomePanel({ outcome, copy, locale, className }: CheckoutOutcomePanelProps) {
  const removedOnlyLabel = resolveRemovedLabel(resolveRemovedOnlyCount(outcome), copy, locale);

  if (outcome.outcome === "success") {
    const dueDateGuidance = resolveDueDateGuidance(outcome.succeeded, copy.successDescriptionTemplate);

    return (
      <section className={cn(panelClassName, className)} data-checkout-outcome="success">
        <h1 className="text-2xl font-bold text-foreground">{copy.successTitle}</h1>
        {dueDateGuidance ? <p className="text-sm text-text-muted">{dueDateGuidance}</p> : null}
        <ul className="flex flex-col gap-1">
          {outcome.succeeded.map((loan, index) => (
            <li className="text-sm font-semibold text-foreground" key={loan.cartItemId ?? index}>
              {loan.bookTitle}
            </li>
          ))}
        </ul>
        <Link
          className="inline-flex w-fit items-center justify-center rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95"
          data-checkout-borrowed-list-link="true"
          href={`/${locale}/borrowed`}
        >
          {copy.borrowedListLink}
        </Link>
      </section>
    );
  }

  if (outcome.outcome === "partial") {
    return (
      <section className={cn(panelClassName, className)} data-checkout-outcome="partial" role="status">
        <h2 className="text-xl font-bold text-foreground">{copy.partialTitle}</h2>

        {outcome.succeeded.length > 0 ? (
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold text-foreground">{copy.partialSucceededTitle}</h3>
            <ul className="flex flex-col gap-1" data-checkout-outcome-succeeded="true">
              {outcome.succeeded.map((loan, index) => (
                <li className="text-sm text-foreground" key={loan.cartItemId ?? index}>
                  {loan.bookTitle}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {outcome.failed.length > 0 ? (
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold text-foreground">{copy.partialFailedTitle}</h3>
            <ul className="flex flex-col gap-1" data-checkout-outcome-failed="true">
              {outcome.failed.map((item) => (
                <li className={failedItemClassName} data-checkout-outcome-failed-item={item.cartItemId} key={item.cartItemId}>
                  {item.reasonLabel}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {removedOnlyLabel ? (
          <p className="text-sm text-text-muted" data-checkout-outcome-removed="true">
            {removedOnlyLabel}
          </p>
        ) : null}
      </section>
    );
  }

  return (
    <section className={cn(panelClassName, className)} data-checkout-outcome="failed" role="alert">
      <h2 className="text-xl font-bold text-foreground">{copy.failedTitle}</h2>
      <p className="text-sm text-text-muted">{copy.failedDescription}</p>
      <ul className="flex flex-col gap-1" data-checkout-outcome-failed="true">
        {outcome.failed.map((item) => (
          <li className={failedItemClassName} data-checkout-outcome-failed-item={item.cartItemId} key={item.cartItemId}>
            {item.reasonLabel}
          </li>
        ))}
      </ul>
      {removedOnlyLabel ? (
        <p className="text-sm text-text-muted" data-checkout-outcome-removed="true">
          {removedOnlyLabel}
        </p>
      ) : null}
    </section>
  );
}
