import type { Metadata } from "next";
import { redirect } from "next/navigation";

import type { CategorySummary } from "@/entities/category";
import { readRouteGuardResult } from "@/features/auth/config/auth-routes";
import {
  DiscoverySearchForm,
  readDiscoveryBookResults,
  readDiscoveryCategories,
} from "@/features/discovery";
import {
  createDiscoverySearchParams,
  discoveryLimitDefaults,
  normalizeDiscoverySearchParams,
} from "@/features/discovery/model";
import type { AppLocale } from "@/shared/i18n/config";
import { resolveLocale } from "@/shared/i18n/config";
import {
  getDiscoveryFeatureMessages,
  getSourceMetadataMessages,
} from "@/shared/i18n/get-messages";

function serializeSearchParams(searchParams: Record<string, string | string[] | undefined>): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (!value) {
      continue;
    }

    if (Array.isArray(value)) {
      for (const entry of value) {
        params.append(key, entry);
      }
      continue;
    }

    params.set(key, value);
  }

  return params.toString();
}

function mapSearchCopy(locale: AppLocale) {
  const discovery = getDiscoveryFeatureMessages(locale).results;

  return {
    filters: discovery.filters,
    criteria: discovery.criteria,
    pagination: discovery.pagination,
    states: discovery.states,
  };
}

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
  const serializedSearch = serializeSearchParams(resolvedSearchParams);
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

  const [categories, results] = await Promise.all([
    readDiscoveryCategories(locale).catch(() => [] as CategorySummary[]),
    readDiscoveryBookResults(locale, normalizedState),
  ]);
  const discovery = getDiscoveryFeatureMessages(locale).results.books;

  return (
    <main className="min-h-screen bg-page-user-accent px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10" id="main-content" tabIndex={-1}>
      <div className="mx-auto flex max-w-content flex-col gap-6 lg:gap-8">
        <section className="rounded-5xl border border-border bg-white p-6 shadow-card md:p-8">
          <p className="text-eyebrow font-semibold text-brand">{discovery.headerLabel}</p>
          <h1 className="mt-3 text-page-title text-foreground">{discovery.title}</h1>
          <p className="mt-3 max-w-3xl text-body-default text-text-muted">{discovery.description}</p>
        </section>

        <section className="rounded-5xl border border-border bg-white p-6 shadow-card md:p-8">
          <DiscoverySearchForm
            categories={categories}
            copy={mapSearchCopy(locale)}
            defaultLimit={discoveryLimitDefaults.books}
            results={results}
            surface="books"
          />
        </section>
      </div>
    </main>
  );
}