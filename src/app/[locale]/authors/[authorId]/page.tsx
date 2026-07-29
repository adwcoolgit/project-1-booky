import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { readRouteGuardResult } from "@/features/auth/config/auth-routes";
import { HomePageFooter } from "@/features/discovery/components/home-page-footer";
import { HomePageHeader } from "@/features/discovery/components/home-page-header";
import {
  AuthorBooksSection,
  AuthorRouteStatePanel,
  discoveryLimitDefaults,
  parseAuthorRouteParams,
  readAuthorBooksPageView,
} from "@/features/discovery";
import { executeProtectedServerRequest } from "@/shared/api/server/authenticated-client";
import { resolveProtectedRequestFailure } from "@/shared/auth/guards";
import { resolveProtectedProfileFixture } from "@/shared/auth/protected-profile-fixture";
import { readSessionEnvelope } from "@/shared/auth/session.server";
import { runtimeConfig } from "@/shared/config/runtime";
import type { AppLocale } from "@/shared/i18n/config";
import { resolveLocale } from "@/shared/i18n/config";
import {
  getDiscoveryFeatureMessages,
  getSourceMetadataMessages,
  getSourceNavigationMessages,
} from "@/shared/i18n/get-messages";

const BOOKY_BRAND_LABEL = "Booky";

type UserProfileSummary = {
  name?: string;
  email?: string;
  activeLoanCount?: number;
};

function createAuthorSectionCopy(locale: AppLocale) {
  const discovery = getDiscoveryFeatureMessages(locale).results.author;
  const navigation = getSourceNavigationMessages(locale);

  return {
    summaryEyebrow: discovery.summaryEyebrow,
    booksEyebrow: discovery.booksEyebrow,
    booksTitle: navigation.bookList,
    booksDescription: discovery.booksDescription,
    bookCountLabel: discovery.bookCountLabel,
    empty: discovery.empty,
    loadMore: discovery.loadMore,
  };
}

function createAuthorRouteStateCopy(locale: AppLocale) {
  const discovery = getDiscoveryFeatureMessages(locale).results.author;

  return {
    invalidId: discovery.states.invalidId,
    notFound: discovery.states.notFound,
    error: discovery.states.error,
  };
}

async function readAuthenticatedDisplayName(
  locale: AppLocale,
  currentPath: string,
  authenticatedSession: Awaited<
    ReturnType<typeof readRouteGuardResult>
  >["session"] & { status: "authenticated" },
) {
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

  return (
    protectedProfile.data.name ??
    authenticatedSession.displayName ??
    authenticatedSession.email
  );
}

function renderAuthorPageShell({
  locale,
  displayName,
  children,
}: {
  locale: AppLocale;
  displayName: string;
  children: ReactNode;
}) {
  const discovery = getDiscoveryFeatureMessages(locale);
  const navigation = getSourceNavigationMessages(locale);

  return (
    <div className="min-h-screen bg-white text-foreground">
      <HomePageHeader
        borrowedListLabel={navigation.borrowedList}
        brandLabel={BOOKY_BRAND_LABEL}
        displayName={displayName}
        locale={locale}
        profileLabel={navigation.profile}
        profileMenuLabel={discovery.home.profileMenu.trigger}
        reviewsLabel={navigation.reviews}
        searchLabel={discovery.results.filters.searchLabel}
        searchPlaceholder={discovery.results.filters.searchPlaceholder}
        variant="authenticated"
      />

      <main
        className="px-4 py-8 md:px-8 md:py-12 xl:px-[120px]"
        id="main-content"
        tabIndex={-1}
      >
        <div className="mx-auto flex w-full max-w-[75rem] flex-col gap-10">
          {children}
        </div>
      </main>

      <HomePageFooter
        brandLabel={BOOKY_BRAND_LABEL}
        description={discovery.home.footer}
        locale={locale}
        socialLabel={discovery.home.actions.socialLabel}
      />
    </div>
  );
}

function AuthorStateSection({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="home-card-shadow rounded-[16px] bg-white p-6 md:p-8">
      <h1 className="text-page-title text-neutral-950">{title}</h1>
      <p className="text-body-default mt-4 max-w-3xl text-neutral-700">
        {description}
      </p>
    </section>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; authorId: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const metadata = getSourceMetadataMessages(locale);
  const discovery = getDiscoveryFeatureMessages(locale).results.author;

  return {
    title: `${discovery.headerLabel} | ${metadata.appTitle}`,
    description: discovery.description,
  };
}

export default async function AuthorBooksPage({
  params,
}: {
  params: Promise<{ locale: string; authorId: string }>;
}) {
  const { locale: rawLocale, authorId: rawAuthorId } = await params;
  const locale = resolveLocale(rawLocale);
  const pathname = `/${locale}/authors/${rawAuthorId}`;
  const guard = await readRouteGuardResult({
    pathname,
    locale,
    returnTo: pathname,
  });

  if (guard.redirectPath) {
    redirect(guard.redirectPath);
  }

  if (guard.session.status !== "authenticated") {
    throw new Error(
      "Expected authenticated session after author discovery route guard.",
    );
  }

  const displayName = await readAuthenticatedDisplayName(
    locale,
    pathname,
    guard.session,
  );
  const discovery = getDiscoveryFeatureMessages(locale).results.author;
  const stateCopy = createAuthorRouteStateCopy(locale);
  const parsedRoute = parseAuthorRouteParams({ authorId: rawAuthorId });

  if (parsedRoute.status === "invalid") {
    return renderAuthorPageShell({
      locale,
      displayName,
      children: (
        <>
          <AuthorStateSection
            description={discovery.states.invalidId.description}
            title={discovery.states.invalidId.title}
          />
          <AuthorRouteStatePanel copy={stateCopy} state="invalidId" />
        </>
      ),
    });
  }

  const data = await readAuthorBooksPageView(
    locale,
    parsedRoute.params.authorId,
    discoveryLimitDefaults.authorBooks,
  );

  if (data.status === "not-found") {
    return renderAuthorPageShell({
      locale,
      displayName,
      children: (
        <>
          <AuthorStateSection
            description={discovery.states.notFound.description}
            title={discovery.states.notFound.title}
          />
          <AuthorRouteStatePanel copy={stateCopy} state="notFound" />
        </>
      ),
    });
  }

  if (data.status === "error") {
    return renderAuthorPageShell({
      locale,
      displayName,
      children: (
        <>
          <AuthorStateSection
            description={discovery.states.error.description}
            title={discovery.states.error.title}
          />
          <AuthorRouteStatePanel
            copy={stateCopy}
            retryHref={pathname}
            state="error"
          />
        </>
      ),
    });
  }

  return renderAuthorPageShell({
    locale,
    displayName,
    children: (
      <AuthorBooksSection
        author={data.author}
        authorId={parsedRoute.params.authorId}
        copy={createAuthorSectionCopy(locale)}
        hasMore={data.hasMore}
        initialBooks={data.books}
        initialPage={data.page}
        limit={data.limit}
        locale={locale}
      />
    ),
  });
}
