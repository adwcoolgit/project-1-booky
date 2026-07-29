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
import { resolveProtectedProfileFixture } from "@/shared/auth/protected-profile-fixture";
import { readSessionEnvelope } from "@/shared/auth/session.server";
import { runtimeConfig } from "@/shared/config/runtime";
import { resolveLocale } from "@/shared/i18n/config";
import {
  getAuthFeatureMessages,
  getDiscoveryFeatureMessages,
  getSourceHomeMessages,
  getSourceMetadataMessages,
  getSourceNavigationMessages,
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

  const authenticatedSession =
    guard.session.status === "authenticated" ? guard.session : null;
  let displayName: string | null = null;

  if (authenticatedSession) {
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

    displayName =
      protectedProfile.data.name ??
      authenticatedSession.displayName ??
      authenticatedSession.email;
  }

  const authMessages = getAuthFeatureMessages(locale);
  const discoveryMessages = getDiscoveryFeatureMessages(locale);
  const homeSource = getSourceHomeMessages(locale);
  const navigation = getSourceNavigationMessages(locale);
  const discovery = discoveryMessages.home;
  const bookFilters = discoveryMessages.results.filters;
  const data = await readHomeDiscoveryViewModel(locale);

  return (
    <div className="min-h-screen bg-white text-foreground">
      {authenticatedSession ? (
        <HomePageHeader
          borrowedListLabel={navigation.borrowedList}
          brandLabel={BOOKY_BRAND_LABEL}
          displayName={displayName ?? authenticatedSession.displayName}
          locale={locale}
          profileLabel={navigation.profile}
          profileMenuLabel={discovery.profileMenu.trigger}
          reviewsLabel={navigation.reviews}
          searchLabel={bookFilters.searchLabel}
          searchPlaceholder={bookFilters.searchPlaceholder}
          variant="authenticated"
        />
      ) : (
        <HomePageHeader
          brandLabel={BOOKY_BRAND_LABEL}
          locale={locale}
          loginLabel={authMessages.login.heading}
          registerLabel={authMessages.register.heading}
          searchLabel={bookFilters.searchLabel}
          searchPlaceholder={bookFilters.searchPlaceholder}
          variant="guest"
        />
      )}

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
            locale={locale}
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
                loadMore: discovery.sections.recommendations.loadMore,
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
