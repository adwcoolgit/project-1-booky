import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { readRouteGuardResult } from "@/features/auth/config/auth-routes";
import {
  BookDetailHero,
  BookReviewList,
  BookRouteStatePanel,
  DiscoveryPageStateSection,
  RelatedBooksSection,
  UserFacingPageShell,
  parseBookRouteParams,
  readBookDetailPageView,
  readDiscoveryAuthenticatedDisplayName,
} from "@/features/discovery";
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

  const displayName = await readDiscoveryAuthenticatedDisplayName({
    locale,
    currentPath: pathname,
    session: guard.session,
  });
  const detailCopy = getDiscoveryFeatureMessages(locale).results.detail;
  const sourceBook = getSourceBookMessages(locale);
  const navigation = getSourceNavigationMessages(locale);
  const stateCopy = createRouteStateCopy(locale);
  const parsedRoute = parseBookRouteParams({ bookId: rawBookId });

  let content;

  if (parsedRoute.status === "invalid") {
    content = (
      <>
        <DiscoveryPageStateSection
          className="sm:p-7 lg:p-10"
          description={detailCopy.states.invalidId.description}
          title={detailCopy.states.invalidId.title}
        />
        <BookRouteStatePanel copy={stateCopy} state="invalidId" />
      </>
    );
  } else {
    const data = await readBookDetailPageView(locale, parsedRoute.params.bookId, {
      reviewLimit: detailReviewInitialLimit,
      relatedLimit: detailRelatedLimit,
    });

    if (data.status === "not-found") {
      content = (
        <>
          <DiscoveryPageStateSection
            className="sm:p-7 lg:p-10"
            description={detailCopy.states.notFound.description}
            title={detailCopy.states.notFound.title}
          />
          <BookRouteStatePanel copy={stateCopy} state="notFound" />
        </>
      );
    } else if (data.status === "error") {
      content = (
        <>
          <DiscoveryPageStateSection
            className="sm:p-7 lg:p-10"
            description={detailCopy.states.error.description}
            title={detailCopy.states.error.title}
          />
          <BookRouteStatePanel copy={stateCopy} retryHref={pathname} state="error" />
        </>
      );
    } else {
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

      content = (
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
      );
    }
  }

  return (
    <UserFacingPageShell
      contentClassName="gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16"
      displayName={displayName}
      locale={locale}
      mainClassName="px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-10 lg:px-10 lg:py-8 xl:px-[120px] xl:py-12"
      variant="authenticated"
    >
      {content}
    </UserFacingPageShell>
  );
}
