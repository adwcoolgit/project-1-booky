import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { readRouteGuardResult } from "@/features/auth/config/auth-routes";
import {
  BookDetailHero,
  BookReviewList,
  BookRouteStatePanel,
  RelatedBooksSection,
  parseBookRouteParams,
  readBookDetailPageView,
} from "@/features/discovery";
import { HomePageFooter } from "@/features/discovery/components/home-page-footer";
import { HomePageHeader } from "@/features/discovery/components/home-page-header";
import { executeProtectedServerRequest } from "@/shared/api/server/authenticated-client";
import { resolveProtectedRequestFailure } from "@/shared/auth/guards";
import { resolveProtectedProfileFixture } from "@/shared/auth/protected-profile-fixture";
import { readSessionEnvelope } from "@/shared/auth/session.server";
import { runtimeConfig } from "@/shared/config/runtime";
import type { AppLocale } from "@/shared/i18n/config";
import { resolveLocale } from "@/shared/i18n/config";
import {
  getDiscoveryFeatureMessages,
  getSourceBookMessages,
  getSourceMetadataMessages,
  getSourceNavigationMessages,
} from "@/shared/i18n/get-messages";

const detailReviewInitialLimit = 2;
const detailRelatedLimit = 5;
const BOOKY_BRAND_LABEL = "Booky";

type UserProfileSummary = {
  name?: string;
  email?: string;
  activeLoanCount?: number;
};

function createHeroCopy(locale: AppLocale) {
  const detail = getDiscoveryFeatureMessages(locale).results.detail;
  const sourceBook = getSourceBookMessages(locale);

  return {
    headerLabel: detail.headerLabel,
    authorLabel: detail.authorLabel,
    categoryLabel: detail.categoryLabel,
    descriptionLabel: sourceBook.description,
    availabilityLabel: detail.availabilityLabel,
    descriptionFallback: detail.descriptionFallback,
    metrics: detail.metrics,
    availability: detail.availability,
  };
}

function createReviewCopy(locale: AppLocale) {
  const detail = getDiscoveryFeatureMessages(locale).results.detail;
  const sourceBook = getSourceBookMessages(locale);

  return {
    ...detail.reviews,
    title: sourceBook.reviews,
  };
}

function createRelatedCopy(locale: AppLocale) {
  const detail = getDiscoveryFeatureMessages(locale).results.detail;
  const sourceBook = getSourceBookMessages(locale);

  return {
    ...detail.related,
    title: sourceBook.related,
  };
}

function createRouteStateCopy(locale: AppLocale) {
  const detail = getDiscoveryFeatureMessages(locale).results.detail;

  return {
    invalidId: detail.states.invalidId,
    notFound: detail.states.notFound,
    error: detail.states.error,
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

function renderBookPageShell({
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
        className="px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-10 lg:px-10 lg:py-8 xl:px-[120px] xl:py-12"
        id="main-content"
        tabIndex={-1}
      >
        <div className="mx-auto flex w-full max-w-[75rem] flex-col gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16">
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

function BookStateSection({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="home-card-shadow rounded-[16px] bg-white p-6 sm:p-7 md:p-8 lg:p-10">
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
  params: Promise<{ locale: string; bookId: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const metadata = getSourceMetadataMessages(locale);
  const detail = getDiscoveryFeatureMessages(locale).results.detail;

  return {
    title: `${detail.headerLabel} | ${metadata.appTitle}`,
    description: detail.description,
  };
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ locale: string; bookId: string }>;
}) {
  const { locale: rawLocale, bookId: rawBookId } = await params;
  const locale = resolveLocale(rawLocale);
  const pathname = `/${locale}/books/${rawBookId}`;
  const guard = await readRouteGuardResult({
    pathname,
    locale,
    returnTo: pathname,
  });

  if (guard.redirectPath) {
    redirect(guard.redirectPath);
  }

  if (guard.session.status !== "authenticated") {
    throw new Error("Expected authenticated session after book detail route guard.");
  }

  const displayName = await readAuthenticatedDisplayName(locale, pathname, guard.session);
  const detailCopy = getDiscoveryFeatureMessages(locale).results.detail;
  const sourceBook = getSourceBookMessages(locale);
  const navigation = getSourceNavigationMessages(locale);
  const stateCopy = createRouteStateCopy(locale);
  const parsedRoute = parseBookRouteParams({ bookId: rawBookId });

  if (parsedRoute.status === "invalid") {
    return renderBookPageShell({
      locale,
      displayName,
      children: (
        <>
          <BookStateSection
            description={detailCopy.states.invalidId.description}
            title={detailCopy.states.invalidId.title}
          />
          <BookRouteStatePanel copy={stateCopy} state="invalidId" />
        </>
      ),
    });
  }

  const data = await readBookDetailPageView(locale, parsedRoute.params.bookId, {
    reviewLimit: detailReviewInitialLimit,
    relatedLimit: detailRelatedLimit,
  });

  if (data.status === "not-found") {
    return renderBookPageShell({
      locale,
      displayName,
      children: (
        <>
          <BookStateSection
            description={detailCopy.states.notFound.description}
            title={detailCopy.states.notFound.title}
          />
          <BookRouteStatePanel copy={stateCopy} state="notFound" />
        </>
      ),
    });
  }

  if (data.status === "error") {
    return renderBookPageShell({
      locale,
      displayName,
      children: (
        <>
          <BookStateSection
            description={detailCopy.states.error.description}
            title={detailCopy.states.error.title}
          />
          <BookRouteStatePanel copy={stateCopy} retryHref={pathname} state="error" />
        </>
      ),
    });
  }

  const reviewSummaryLabel = [data.detail.ratingLabel, data.detail.reviewCountLabel]
    .filter((value): value is string => Boolean(value))
    .map((value, index) =>
      index === 0 ? `${value} ${detailCopy.metrics.rating}` : `${value} ${sourceBook.reviews}`,
    )
    .join(" • ");
  const breadcrumbs = [
    { href: `/${locale}`, label: navigation.home },
    ...(data.detail.categoryLabel
      ? [
          {
            href: data.detail.categoryHref ?? undefined,
            label: data.detail.categoryLabel,
          },
        ]
      : []),
    { label: data.detail.title },
  ];

  return renderBookPageShell({
    locale,
    displayName,
    children: (
      <>
        <BookDetailHero
          actions={[
            { disabled: true, label: sourceBook.addToCart, variant: "outline" },
            { disabled: true, label: sourceBook.borrowBook, variant: "solid" },
          ]}
          breadcrumbs={breadcrumbs}
          copy={createHeroCopy(locale)}
          detail={data.detail}
        />

        <div className="h-px w-full bg-border" />

        {data.reviews.status === "ready" ? (
          <BookReviewList
            bookId={data.detail.id}
            copy={createReviewCopy(locale)}
            hasMore={data.reviews.hasMore}
            initialPage={data.reviews.page}
            initialReviews={data.reviews.items}
            limit={data.reviews.limit}
            locale={locale}
            state="ready"
            summaryLabel={reviewSummaryLabel || undefined}
          />
        ) : (
          <BookReviewList
            copy={createReviewCopy(locale)}
            retryHref={pathname}
            state="error"
            summaryLabel={reviewSummaryLabel || undefined}
          />
        )}

        <div className="h-px w-full bg-border" />

        {data.related.status === "ready" ? (
          <RelatedBooksSection books={data.related.books} copy={createRelatedCopy(locale)} state="ready" />
        ) : data.related.status === "empty" ? (
          <RelatedBooksSection copy={createRelatedCopy(locale)} state="empty" />
        ) : (
          <RelatedBooksSection copy={createRelatedCopy(locale)} retryHref={pathname} state="error" />
        )}
      </>
    ),
  });
}
