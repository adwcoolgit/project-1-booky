import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { readRouteGuardResult } from "@/features/auth/config/auth-routes";
import {
  HomeDiscoverySections,
  readHomeDiscoveryViewModel,
} from "@/features/discovery";
import { HomeHeroBanner } from "@/features/discovery/components/home-hero-banner";
import { HomePageFooter } from "@/features/discovery/components/home-page-footer";
import { HomePageHeader } from "@/features/discovery/components/home-page-header";
import { executeProtectedServerRequest } from "@/shared/api/server/authenticated-client";
import { resolveProtectedRequestFailure } from "@/shared/auth/guards";
import { readSessionEnvelope } from "@/shared/auth/session.server";
import { resolveProtectedProfileFixture } from "@/shared/auth/protected-profile-fixture";
import { runtimeConfig } from "@/shared/config/runtime";
import { resolveLocale } from "@/shared/i18n/config";
import {
  getDiscoveryFeatureMessages,
  getSourceHomeMessages,
  getSourceMetadataMessages,
} from "@/shared/i18n/get-messages";

const BOOKY_BRAND_LABEL = "Booky";

type UserProfileSummary = {
  name?: string;
  email?: string;
  activeLoanCount?: number;
};

function serializeSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): string {
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const metadata = getSourceMetadataMessages(locale);
  const discovery = getDiscoveryFeatureMessages(locale).home;

  return {
    title: `${discovery.headerLabel} | ${metadata.appTitle}`,
    description: discovery.description,
  };
}

export default async function UserHomePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale: rawLocale } = await params;
  const resolvedSearchParams = await searchParams;
  const locale = resolveLocale(rawLocale);
  const pathname = `/${locale}`;
  const serializedSearch = serializeSearchParams(resolvedSearchParams);
  const currentPath = serializedSearch
    ? `${pathname}?${serializedSearch}`
    : pathname;
  const guard = await readRouteGuardResult({
    pathname,
    locale,
    returnTo: currentPath,
  });

  if (guard.redirectPath) {
    redirect(guard.redirectPath);
  }

  if (guard.session.status !== "authenticated") {
    throw new Error("Expected authenticated session after user route guard.");
  }

  const protectedProfile = runtimeConfig.authE2eFixtureMode
    ? resolveProtectedProfileFixture(await readSessionEnvelope())
    : await executeProtectedServerRequest(
        async (client) => (await client.get<UserProfileSummary>("/me")).data,
        locale,
      );

  if (protectedProfile.status === "failure") {
    const failure = resolveProtectedRequestFailure({
      error: protectedProfile.error,
      pathname: currentPath,
      locale,
      returnTo: currentPath,
      loginSurface: "user",
    });

    if (failure.redirectPath) {
      redirect(failure.redirectPath);
    }

    throw protectedProfile.error;
  }

  const discoveryMessages = getDiscoveryFeatureMessages(locale);
  const homeSource = getSourceHomeMessages(locale);
  const discovery = discoveryMessages.home;
  const bookFilters = discoveryMessages.results.filters;
  const data = await readHomeDiscoveryViewModel(locale);
  const displayName =
    protectedProfile.data.name ??
    guard.session.displayName ??
    guard.session.email;

  return (
    <div className="min-h-screen bg-white text-foreground">
      <HomePageHeader
        brandLabel={BOOKY_BRAND_LABEL}
        displayName={displayName}
        locale={locale}
        searchLabel={bookFilters.searchLabel}
        searchPlaceholder={bookFilters.searchPlaceholder}
      />

      <main
        className="px-4 py-8 md:px-8 md:py-12 xl:px-[120px]"
        id="main-content"
        tabIndex={-1}
      >
        <div className="mx-auto flex w-full max-w-[75rem] flex-col gap-12">
          <HomeHeroBanner
            heading={`${discovery.hero.lineOne} ${BOOKY_BRAND_LABEL}`}
          />

          <HomeDiscoverySections
            catalogHref={`/${locale}/books`}
            copy={{
              categories: {
                eyebrow: discovery.sections.categories.eyebrow,
                title: homeSource.categories,
                description: discovery.sections.categories.description,
              },
              recommendations: {
                eyebrow: discovery.sections.recommendations.eyebrow,
                title: homeSource.recommendations,
                description: discovery.sections.recommendations.description,
                ctaLabel: discovery.actions.viewAllBooks,
              },
              popularAuthors: {
                eyebrow: discovery.sections.popularAuthors.eyebrow,
                title: homeSource.popularAuthors,
                description: discovery.sections.popularAuthors.description,
              },
              states: discovery.states,
            }}
            data={data}
            retryHref={currentPath}
          />
        </div>
      </main>

      <HomePageFooter
        brandLabel={BOOKY_BRAND_LABEL}
        description={discovery.footer}
        locale={locale}
        socialLabel={discovery.actions.socialLabel}
      />
    </div>
  );
}
