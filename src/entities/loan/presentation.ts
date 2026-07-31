import { resolveBorrowConfirmationOutcome } from "@/entities/loan/mapper";
import type { BorrowConfirmationPresentation, BorrowConfirmationResult } from "@/entities/loan/model";
import type { AppLocale } from "@/shared/i18n/config";
import { getCheckoutFeatureMessages } from "@/shared/i18n/get-messages";

function formatLocalizedDate(value: string | null, locale: AppLocale): string | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(date);
}

export function mapBorrowConfirmationResultToPresentation(
  result: BorrowConfirmationResult,
  options: { locale: AppLocale },
): BorrowConfirmationPresentation {
  const messages = getCheckoutFeatureMessages(options.locale);

  return {
    outcome: resolveBorrowConfirmationOutcome(result),
    succeeded: result.succeeded.map((loan) => ({
      cartItemId: loan.cartItemId,
      bookTitle: loan.bookTitle ?? messages.unknownBookTitle,
      dueDateLabel: formatLocalizedDate(loan.dueAt, options.locale),
      returnByMessage: loan.returnByMessage,
    })),
    failed: result.failed.map((item) => ({
      cartItemId: item.cartItemId,
      reasonLabel: item.reasonCode ?? messages.genericFailureReason,
    })),
    removedCartItemIds: result.removedCartItemIds,
  };
}
