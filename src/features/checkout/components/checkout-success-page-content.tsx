"use client";

import { useEffect } from "react";

import { useMutationState } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { mapBorrowConfirmationResultToPresentation } from "@/entities/loan";
import type { BorrowConfirmationResult } from "@/entities/loan";
import { CheckoutOutcomePanel, type CheckoutOutcomePanelCopy } from "@/features/checkout/components/checkout-outcome-panel";
import { loanFromCartMutationKey } from "@/features/checkout/hooks/use-loan-from-cart-mutation";
import type { AppLocale } from "@/shared/i18n/config";

export function CheckoutSuccessPageContent({ locale, copy }: { locale: AppLocale; copy: CheckoutOutcomePanelCopy }) {
  const router = useRouter();
  const results = useMutationState({
    filters: { mutationKey: [...loanFromCartMutationKey], status: "success" },
    select: (mutation) => mutation.state.data as BorrowConfirmationResult | undefined,
  });
  const latestResult = results.filter((result): result is BorrowConfirmationResult => result !== undefined).at(-1);
  const presentation = latestResult ? mapBorrowConfirmationResultToPresentation(latestResult, { locale }) : null;
  const isValidSuccess = presentation?.outcome === "success";

  useEffect(() => {
    if (!isValidSuccess) {
      router.replace(`/${locale}/checkout`);
    }
  }, [isValidSuccess, router, locale]);

  if (!presentation || presentation.outcome !== "success") {
    return null;
  }

  return <CheckoutOutcomePanel copy={copy} locale={locale} outcome={presentation} />;
}
