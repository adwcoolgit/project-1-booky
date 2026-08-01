import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { readRouteGuardResult } from "@/features/auth/config/auth-routes";
import { CheckoutPageContent, readCheckoutView } from "@/features/checkout";
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
  const checkout = getCheckoutFeatureMessages(locale);

  return {
    title: `${checkout.pageTitle} | ${metadata.appTitle}`,
  };
}

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale: rawLocale } = await params;
  const resolvedSearchParams = await searchParams;
  const locale = resolveLocale(rawLocale);
  const pathname = `/${locale}/checkout`;
  const guard = await readRouteGuardResult({ pathname, locale, returnTo: pathname });

  if (guard.redirectPath) {
    redirect(guard.redirectPath);
  }

  if (guard.session.status !== "authenticated") {
    throw new Error("Expected authenticated session after checkout route guard.");
  }

  const [displayName, view] = await Promise.all([
    readDiscoveryAuthenticatedDisplayName({ locale, currentPath: pathname, session: guard.session }),
    readCheckoutView({ locale, currentPath: pathname, e2eFixtureOverride: resolvedSearchParams.e2eFixture }),
  ]);
  const checkout = getCheckoutFeatureMessages(locale);
  const sourceCheckout = getSourceCheckoutMessages(locale);

  return (
    <UserFacingPageShell contentClassName="max-w-cart gap-8" displayName={displayName} locale={locale} variant="authenticated">
      <section className="flex flex-col gap-6 lg:gap-8">
        <h1 className="text-2xl font-bold leading-9 text-neutral-950 sm:text-3xl sm:leading-10 md:text-4xl md:leading-10.5 lg:leading-11">
          {checkout.pageTitle}
        </h1>

        <CheckoutPageContent
          copy={{
            loading: checkout.loading,
            error: checkout.error,
            cardTitle: checkout.cardTitle,
            preview: {
              title: checkout.previewTitle,
              booksTitle: checkout.booksTitle,
              nameLabel: checkout.nameLabel,
              emailLabel: checkout.emailLabel,
              phoneLabel: checkout.phoneLabel,
            },
            duration: { label: sourceCheckout.duration },
            borrowDate: { label: sourceCheckout.borrowDate, estimateNotice: checkout.borrowDateEstimateNotice },
            agreements: {
              returnAcknowledgement: checkout.returnAcknowledgement,
              policyAgreement: sourceCheckout.agreement,
            },
            returnDateLabel: sourceCheckout.returnDate,
            returnDateDescriptionTemplate: checkout.returnDateDescriptionTemplate,
            confirmButton: {
              confirm: sourceCheckout.confirm,
              pending: checkout.confirmPending,
              error: checkout.confirmError,
            },
            outcomePanel: {
              successTitle: sourceCheckout.successTitle,
              successDescriptionTemplate: sourceCheckout.successDescription,
              borrowedListLink: getSourceNavigationMessages(locale).borrowedList,
              partialTitle: checkout.partialOutcomeTitle,
              partialSucceededTitle: checkout.partialOutcomeSucceededTitle,
              partialFailedTitle: checkout.partialOutcomeFailedTitle,
              removedCountOne: checkout.outcomeRemovedCountOne,
              removedCountOther: checkout.outcomeRemovedCountOther,
              failedTitle: checkout.failedOutcomeTitle,
              failedDescription: checkout.failedOutcomeDescription,
            },
          }}
          initialPreview={view.status === "ready" ? view.preview : undefined}
          locale={locale}
        />
      </section>
    </UserFacingPageShell>
  );
}
