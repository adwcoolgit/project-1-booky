import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { readRouteGuardResult } from "@/features/auth/config/auth-routes";
import {
  BookDetailHero,
  BookReviewList,
  BookRouteStatePanel,
  RelatedBooksSection,
  parseBookRouteParams,
  readBookDetailPageView,
} from "@/features/discovery";
import type { AppLocale } from "@/shared/i18n/config";
import { resolveLocale } from "@/shared/i18n/config";
import {
  getDiscoveryFeatureMessages,
  getSourceMetadataMessages,
} from "@/shared/i18n/get-messages";

const detailReviewInitialLimit = 2;
const detailRelatedLimit = 4;

function createHeroCopy(locale: AppLocale) {
  const detail = getDiscoveryFeatureMessages(locale).results.detail;

  return {
    headerLabel: detail.headerLabel,
    authorLabel: detail.authorLabel,
    categoryLabel: detail.categoryLabel,
    descriptionLabel: detail.descriptionLabel,
    availabilityLabel: detail.availabilityLabel,
    descriptionFallback: detail.descriptionFallback,
    metrics: detail.metrics,
    availability: detail.availability,
  };
}

function createReviewCopy(locale: AppLocale) {
  return getDiscoveryFeatureMessages(locale).results.detail.reviews;
}

function createRelatedCopy(locale: AppLocale) {
  return getDiscoveryFeatureMessages(locale).results.detail.related;
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

  const detailCopy = getDiscoveryFeatureMessages(locale).results.detail;
  const stateCopy = createRouteStateCopy(locale);
  const parsedRoute = parseBookRouteParams({ bookId: rawBookId });

  if (parsedRoute.status === "invalid") {
    return (
      <main className="min-h-screen bg-page-user-accent px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10" id="main-content" tabIndex={-1}>
        <div className="mx-auto flex max-w-content flex-col gap-6 lg:gap-8">
          <section className="rounded-5xl border border-border bg-white p-6 shadow-card md:p-8">
            <p className="text-eyebrow font-semibold text-brand">{detailCopy.headerLabel}</p>
            <h1 className="mt-3 text-page-title text-foreground">{detailCopy.states.invalidId.title}</h1>
            <p className="mt-3 max-w-3xl text-body-default text-text-muted">
              {detailCopy.states.invalidId.description}
            </p>
          </section>

          <BookRouteStatePanel copy={stateCopy} state="invalidId" />
        </div>
      </main>
    );
  }

  const data = await readBookDetailPageView(locale, parsedRoute.params.bookId, {
    reviewLimit: detailReviewInitialLimit,
    relatedLimit: detailRelatedLimit,
  });

  if (data.status === "not-found") {
    notFound();
  }

  if (data.status === "error") {
    return (
      <main className="min-h-screen bg-page-user-accent px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10" id="main-content" tabIndex={-1}>
        <div className="mx-auto flex max-w-content flex-col gap-6 lg:gap-8">
          <section className="rounded-5xl border border-border bg-white p-6 shadow-card md:p-8">
            <p className="text-eyebrow font-semibold text-brand">{detailCopy.headerLabel}</p>
            <h1 className="mt-3 text-page-title text-foreground">{detailCopy.states.error.title}</h1>
            <p className="mt-3 max-w-3xl text-body-default text-text-muted">
              {detailCopy.states.error.description}
            </p>
          </section>

          <BookRouteStatePanel copy={stateCopy} retryHref={pathname} state="error" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-page-user-accent px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10" id="main-content" tabIndex={-1}>
      <div className="mx-auto flex max-w-content flex-col gap-6 lg:gap-8">
        <BookDetailHero copy={createHeroCopy(locale)} detail={data.detail} />

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
          />
        ) : (
          <BookReviewList copy={createReviewCopy(locale)} retryHref={pathname} state="error" />
        )}

        {data.related.status === "ready" ? (
          <RelatedBooksSection books={data.related.books} copy={createRelatedCopy(locale)} state="ready" />
        ) : data.related.status === "empty" ? (
          <RelatedBooksSection copy={createRelatedCopy(locale)} state="empty" />
        ) : (
          <RelatedBooksSection copy={createRelatedCopy(locale)} retryHref={pathname} state="error" />
        )}
      </div>
    </main>
  );
}
