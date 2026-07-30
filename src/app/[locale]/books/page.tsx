import type { Metadata } from "next";
import { redirect } from "next/navigation";

import type { CategorySummary } from "@/entities/category";
import { readRouteGuardResult } from "@/features/auth/config/auth-routes";
import {
  DiscoverySearchForm,
  UserFacingPageShell,
  createDiscoverySearchFormCopy,
  createDiscoverySearchParams,
  discoveryLimitDefaults,
  normalizeDiscoverySearchParams,
  readDiscoveryAuthenticatedDisplayName,
  readDiscoveryBookResults,
  readDiscoverySearchCategories,
  serializeSearchParamsRecord,
} from "@/features/discovery";
import { resolveLocale } from "@/shared/i18n/config";
import {
  getDiscoveryFeatureMessages,
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
  const discovery = getDiscoveryFeatureMessages(locale).results.books;

  return {
    title: `${discovery.headerLabel} | ${metadata.appTitle}`,
    description: discovery.description,
  };
}

export default async function BooksPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale: rawLocale } = await params;
  const resolvedSearchParams = await searchParams;
  const locale = resolveLocale(rawLocale);
  const pathname = `/${locale}/books`;
  const serializedSearch = serializeSearchParamsRecord(resolvedSearchParams);
  const currentPath = serializedSearch ? `${pathname}?${serializedSearch}` : pathname;
  const guard = await readRouteGuardResult({
    pathname,
    locale,
    returnTo: currentPath,
  });

  if (guard.redirectPath) {
    redirect(guard.redirectPath);
  }

  if (guard.session.status !== "authenticated") {
    throw new Error("Expected authenticated session after book discovery route guard.");
  }

  const normalizedState = normalizeDiscoverySearchParams(resolvedSearchParams, {
    defaultLimit: discoveryLimitDefaults.books,
  });
  const canonicalSearch = createDiscoverySearchParams(normalizedState, {
    defaultLimit: discoveryLimitDefaults.books,
  }).toString();

  if (canonicalSearch !== serializedSearch) {
    redirect(canonicalSearch.length > 0 ? `${pathname}?${canonicalSearch}` : pathname);
  }

  const displayName = await readDiscoveryAuthenticatedDisplayName({
    locale,
    currentPath,
    session: guard.session,
  });
  const [categories, results] = await Promise.all([
    readDiscoverySearchCategories(locale, {
      ...(normalizedState.q ? { query: normalizedState.q } : {}),
      minRating: normalizedState.minRating,
      selectedCategoryId: normalizedState.categoryId,
    }).catch(() => [] as CategorySummary[]),
    readDiscoveryBookResults(locale, normalizedState),
  ]);
  const navigation = getSourceNavigationMessages(locale);
  const searchHiddenFields = {
    categoryId: normalizedState.categoryId,
    authorId: normalizedState.authorId,
    minRating: normalizedState.minRating,
    ...(normalizedState.limit !== discoveryLimitDefaults.books ? { limit: normalizedState.limit } : {}),
  };

  return (
    <UserFacingPageShell
      contentClassName="gap-8 sm:gap-10 xl:gap-8"
      displayName={displayName}
      locale={locale}
      mainClassName="px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 xl:px-[120px] xl:py-12"
      searchActionHref={pathname}
      searchDefaultValue={normalizedState.q}
      searchHiddenFields={searchHiddenFields}
      variant="authenticated"
    >
      <section className="flex flex-col gap-6 sm:gap-8">
        <h1 className="text-[24px] font-bold leading-9 text-neutral-950 sm:text-[28px] sm:leading-10 md:text-[32px] md:leading-[42px] xl:text-[36px] xl:leading-[44px]">
          {navigation.bookList}
        </h1>

        <DiscoverySearchForm
          categories={categories}
          copy={createDiscoverySearchFormCopy(locale)}
          defaultLimit={discoveryLimitDefaults.books}
          locale={locale}
          results={results}
          surface="books"
        />
      </section>
    </UserFacingPageShell>
  );
}
