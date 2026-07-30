import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { readRouteGuardResult } from "@/features/auth/config/auth-routes";
import {
  HomeDiscoverySections,
  HomeHeroBanner,
  UserFacingPageShell,
  readDiscoveryAuthenticatedDisplayName,
  readHomeDiscoveryViewModel,
  serializeSearchParamsRecord,
} from "@/features/discovery";
import { resolveLocale } from "@/shared/i18n/config";
import {
  getDiscoveryFeatureMessages,
  getSourceHomeMessages,
  getSourceMetadataMessages,
} from "@/shared/i18n/get-messages";

const brandLabel = "Booky";
const homeMainClassName = "px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-8 lg:px-10 lg:py-10 xl:px-[120px] xl:py-12";
const homeContentClassName = "gap-6 sm:gap-8 md:gap-10 lg:gap-12";

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

  const authenticatedSession = guard.session.status === "authenticated" ? guard.session : null;
  const displayName = authenticatedSession
    ? await readDiscoveryAuthenticatedDisplayName({
        locale,
        currentPath,
        session: authenticatedSession,
      })
    : null;
  const discoveryMessages = getDiscoveryFeatureMessages(locale);
  const homeSource = getSourceHomeMessages(locale);
  const discovery = discoveryMessages.home;
  const data = await readHomeDiscoveryViewModel(locale);
  const content = (
    <>
      <HomeHeroBanner heading={`${discovery.hero.lineOne} ${brandLabel}`} />

      <HomeDiscoverySections
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
        locale={locale}
        retryHref={currentPath}
      />
    </>
  );

  return authenticatedSession ? (
    <UserFacingPageShell
      contentClassName={homeContentClassName}
      displayName={displayName ?? authenticatedSession.displayName}
      locale={locale}
      mainClassName={homeMainClassName}
      searchActionHref={`/${locale}/books`}
      variant="authenticated"
    >
      {content}
    </UserFacingPageShell>
  ) : (
    <UserFacingPageShell
      contentClassName={homeContentClassName}
      locale={locale}
      mainClassName={homeMainClassName}
      variant="guest"
    >
      {content}
    </UserFacingPageShell>
  );
}