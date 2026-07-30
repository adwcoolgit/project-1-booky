import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import type { CategorySummary } from "@/entities/category";
import { readRouteGuardResult } from "@/features/auth/config/auth-routes";
import {
  DiscoverySearchForm,
  UserFacingPageShell,
  createCategoryRouteSearchParams,
  createDiscoverySearchFormCopy,
  discoveryLimitDefaults,
  normalizeCategoryRouteState,
  readDiscoveryAuthenticatedDisplayName,
  readDiscoveryBookResults,
  readDiscoveryCategories,
  resolveCategoryBySlug,
  serializeSearchParamsRecord,
} from "@/features/discovery";
import type { AppLocale } from "@/shared/i18n/config";
import { resolveLocale } from "@/shared/i18n/config";
import {
  getDiscoveryFeatureMessages,
  getSourceMetadataMessages,
  getSourceNavigationMessages,
} from "@/shared/i18n/get-messages";

function renderCategoryContent({
  locale,
  categories,
  results,
  lockedCategory,
  lockedCategoryId,
  selectedCategoryId,
}: {
  locale: AppLocale;
  categories: readonly CategorySummary[];
  results: Awaited<ReturnType<typeof readDiscoveryBookResults>> | { status: "error" };
  lockedCategory?: string | undefined;
  lockedCategoryId?: number | undefined;
  selectedCategoryId?: number | undefined;
}) {
  const navigation = getSourceNavigationMessages(locale);

  return (
    <section className="flex flex-col gap-4 sm:gap-5 md:gap-6 lg:gap-8">
      <h1 className="text-[24px] font-bold leading-9 text-neutral-950 sm:text-[26px] sm:leading-9 md:text-[28px] md:leading-10 lg:text-[32px] lg:leading-[42px] xl:text-[36px] xl:leading-[44px]">
        {navigation.bookList}
      </h1>

      <DiscoverySearchForm
        categories={categories}
        copy={createDiscoverySearchFormCopy(locale)}
        defaultLimit={discoveryLimitDefaults.books}
        locale={locale}
        lockedCategory={lockedCategory}
        lockedCategoryId={lockedCategoryId}
        results={results}
        selectedCategoryId={selectedCategoryId}
        surface="category"
      />
    </section>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const metadata = getSourceMetadataMessages(locale);
  const discovery = getDiscoveryFeatureMessages(locale).results.category;

  return {
    title: `${discovery.headerLabel} | ${metadata.appTitle}`,
    description: discovery.description,
  };
}

export default async function CategoryBooksPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale: rawLocale, slug } = await params;
  const resolvedSearchParams = await searchParams;
  const locale = resolveLocale(rawLocale);
  const pathname = `/${locale}/categories/${slug}`;
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
    throw new Error("Expected authenticated session after category discovery route guard.");
  }

  const displayName = await readDiscoveryAuthenticatedDisplayName({
    locale,
    currentPath,
    session: guard.session,
  });
  const categories = await readDiscoveryCategories(locale).catch(() => null);

  if (!categories) {
    return (
      <UserFacingPageShell
        contentClassName="gap-4 sm:gap-5 md:gap-6 lg:gap-8"
        displayName={displayName}
        locale={locale}
        mainClassName="px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-8 lg:px-10 lg:py-10 xl:px-[120px] xl:py-12"
        searchActionHref={pathname}
        variant="authenticated"
      >
        {renderCategoryContent({
          locale,
          categories: [],
          results: { status: "error" },
        })}
      </UserFacingPageShell>
    );
  }

  const resolvedCategory = resolveCategoryBySlug(slug, categories);

  if (!resolvedCategory) {
    notFound();
  }

  const normalizedState = normalizeCategoryRouteState(
    resolvedSearchParams,
    resolvedCategory,
    discoveryLimitDefaults.books,
  );
  const canonicalSearch = createCategoryRouteSearchParams(
    normalizedState,
    discoveryLimitDefaults.books,
  ).toString();

  if (canonicalSearch !== serializedSearch) {
    redirect(canonicalSearch.length > 0 ? `${pathname}?${canonicalSearch}` : pathname);
  }

  const results = await readDiscoveryBookResults(locale, normalizedState);
  const searchHiddenFields = {
    categoryId: normalizedState.selectedCategoryId,
    minRating: normalizedState.minRating,
    ...(normalizedState.limit !== discoveryLimitDefaults.books ? { limit: normalizedState.limit } : {}),
  };

  return (
    <UserFacingPageShell
      contentClassName="gap-4 sm:gap-5 md:gap-6 lg:gap-8"
      displayName={displayName}
      locale={locale}
      mainClassName="px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-8 lg:px-10 lg:py-10 xl:px-[120px] xl:py-12"
      searchActionHref={pathname}
      searchDefaultValue={normalizedState.q}
      searchHiddenFields={searchHiddenFields}
      variant="authenticated"
    >
      {renderCategoryContent({
        locale,
        categories,
        lockedCategory: resolvedCategory.name,
        lockedCategoryId: resolvedCategory.id,
        results,
        selectedCategoryId: normalizedState.selectedCategoryId ?? undefined,
      })}
    </UserFacingPageShell>
  );
}
