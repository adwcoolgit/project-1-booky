import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { readRouteGuardResult } from "@/features/auth/config/auth-routes";
import { CheckoutSuccessPageContent } from "@/features/checkout";
import { readDiscoveryAuthenticatedDisplayName, UserFacingPageShell } from "@/features/discovery";
import { resolveLocale } from "@/shared/i18n/config";
import {
  getCheckoutFeatureMessages,
  getSourceCheckoutMessages,
  getSourceMetadataMessages,
  getSourceNavigationMessages,
} from "@/shared/i18n/get-messages";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const metadata = getSourceMetadataMessages(locale);
  const sourceCheckout = getSourceCheckoutMessages(locale);

  return {
    title: `${sourceCheckout.successTitle} | ${metadata.appTitle}`,
  };
}

export default async function CheckoutSuccessPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const pathname = `/${locale}/checkout/success`;
  const guard = await readRouteGuardResult({ pathname, locale, returnTo: pathname });

  if (guard.redirectPath) {
    redirect(guard.redirectPath);
  }

  if (guard.session.status !== "authenticated") {
    throw new Error("Expected authenticated session after checkout success route guard.");
  }

  const displayName = await readDiscoveryAuthenticatedDisplayName({ locale, currentPath: pathname, session: guard.session });
  const checkout = getCheckoutFeatureMessages(locale);
  const sourceCheckout = getSourceCheckoutMessages(locale);
  const sourceNavigation = getSourceNavigationMessages(locale);

  return (
    <UserFacingPageShell displayName={displayName} locale={locale} variant="authenticated">
      <CheckoutSuccessPageContent
        copy={{
          successTitle: sourceCheckout.successTitle,
          successDescriptionTemplate: sourceCheckout.successDescription,
          borrowedListLink: sourceNavigation.borrowedList,
          partialTitle: checkout.partialOutcomeTitle,
          partialSucceededTitle: checkout.partialOutcomeSucceededTitle,
          partialFailedTitle: checkout.partialOutcomeFailedTitle,
          removedCountOne: checkout.outcomeRemovedCountOne,
          removedCountOther: checkout.outcomeRemovedCountOther,
          failedTitle: checkout.failedOutcomeTitle,
          failedDescription: checkout.failedOutcomeDescription,
        }}
        locale={locale}
      />
    </UserFacingPageShell>
  );
}
