import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { readCartView } from "@/features/cart";
import { readRouteGuardResult } from "@/features/auth/config/auth-routes";
import { CartPageContent } from "@/features/cart/components/cart-page-content";
import { readDiscoveryAuthenticatedDisplayName, UserFacingPageShell } from "@/features/discovery";
import { resolveLocale } from "@/shared/i18n/config";
import { getCartFeatureMessages, getSourceCartMessages, getSourceMetadataMessages } from "@/shared/i18n/get-messages";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const metadata = getSourceMetadataMessages(locale);
  const cart = getCartFeatureMessages(locale);

  return {
    title: `${cart.pageTitle} | ${metadata.appTitle}`,
  };
}

export default async function CartPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale: rawLocale } = await params;
  const resolvedSearchParams = await searchParams;
  const locale = resolveLocale(rawLocale);
  const pathname = `/${locale}/cart`;
  const guard = await readRouteGuardResult({ pathname, locale, returnTo: pathname });

  if (guard.redirectPath) {
    redirect(guard.redirectPath);
  }

  if (guard.session.status !== "authenticated") {
    throw new Error("Expected authenticated session after cart route guard.");
  }

  const [displayName, view] = await Promise.all([
    readDiscoveryAuthenticatedDisplayName({ locale, currentPath: pathname, session: guard.session }),
    readCartView({ locale, currentPath: pathname, e2eFixtureOverride: resolvedSearchParams.e2eFixture }),
  ]);
  const cart = getCartFeatureMessages(locale);
  const sourceCart = getSourceCartMessages(locale);

  return (
    <UserFacingPageShell contentClassName="max-w-cart gap-8" displayName={displayName} locale={locale} variant="authenticated">
      <section className="flex flex-col gap-6 lg:gap-8">
        <h1 className="text-2xl font-bold leading-9 text-neutral-950 sm:text-3xl sm:leading-10 md:text-4xl md:leading-10.5 lg:leading-11">
          {cart.pageTitle}
        </h1>

        <CartPageContent
          copy={{
            loading: cart.loading,
            empty: cart.empty,
            error: cart.error,
            summaryTitle: sourceCart.summary,
            selectAll: sourceCart.selectAll,
            row: { select: cart.select, remove: cart.remove, removeError: cart.removeError },
            summary: {
              clear: cart.clear,
              clearError: cart.clearError,
              checkout: sourceCart.checkout,
              checkoutBlocked: cart.checkoutBlocked,
              totalBookLabel: cart.totalBookLabel,
            },
          }}
          initialCart={view.status === "ready" ? view.cart : undefined}
          locale={locale}
        />
      </section>
    </UserFacingPageShell>
  );
}
