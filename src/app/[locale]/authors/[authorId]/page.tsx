import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { readRouteGuardResult } from "@/features/auth/config/auth-routes";
import {
  AuthorBooksSection,
  AuthorRouteStatePanel,
  discoveryLimitDefaults,
  parseAuthorRouteParams,
  readAuthorBooksPageView,
} from "@/features/discovery";
import type { AppLocale } from "@/shared/i18n/config";
import { resolveLocale } from "@/shared/i18n/config";
import {
  getDiscoveryFeatureMessages,
  getSourceMetadataMessages,
} from "@/shared/i18n/get-messages";

function createAuthorSectionCopy(locale: AppLocale) {
  const discovery = getDiscoveryFeatureMessages(locale).results.author;

  return {
    summaryEyebrow: discovery.summaryEyebrow,
    booksEyebrow: discovery.booksEyebrow,
    booksTitle: discovery.booksTitle,
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
    throw new Error("Expected authenticated session after author discovery route guard.");
  }

  const discovery = getDiscoveryFeatureMessages(locale).results.author;
  const stateCopy = createAuthorRouteStateCopy(locale);
  const parsedRoute = parseAuthorRouteParams({ authorId: rawAuthorId });

  if (parsedRoute.status === "invalid") {
    return (
      <main className="min-h-screen bg-page-user-accent px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10" id="main-content" tabIndex={-1}>
        <div className="mx-auto flex max-w-content flex-col gap-6 lg:gap-8">
          <section className="rounded-5xl border border-border bg-white p-6 shadow-card md:p-8">
            <p className="text-eyebrow font-semibold text-brand">{discovery.headerLabel}</p>
            <h1 className="mt-3 text-page-title text-foreground">{discovery.states.invalidId.title}</h1>
            <p className="mt-3 max-w-3xl text-body-default text-text-muted">
              {discovery.states.invalidId.description}
            </p>
          </section>

          <AuthorRouteStatePanel copy={stateCopy} state="invalidId" />
        </div>
      </main>
    );
  }

  const data = await readAuthorBooksPageView(
    locale,
    parsedRoute.params.authorId,
    discoveryLimitDefaults.authorBooks,
  );

  if (data.status === "not-found") {
    notFound();
  }

  if (data.status === "error") {
    return (
      <main className="min-h-screen bg-page-user-accent px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10" id="main-content" tabIndex={-1}>
        <div className="mx-auto flex max-w-content flex-col gap-6 lg:gap-8">
          <section className="rounded-5xl border border-border bg-white p-6 shadow-card md:p-8">
            <p className="text-eyebrow font-semibold text-brand">{discovery.headerLabel}</p>
            <h1 className="mt-3 text-page-title text-foreground">{discovery.states.error.title}</h1>
            <p className="mt-3 max-w-3xl text-body-default text-text-muted">
              {discovery.states.error.description}
            </p>
          </section>

          <AuthorRouteStatePanel copy={stateCopy} retryHref={pathname} state="error" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-page-user-accent px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10" id="main-content" tabIndex={-1}>
      <div className="mx-auto flex max-w-content flex-col gap-6 lg:gap-8">
        <section className="rounded-5xl border border-border bg-white p-6 shadow-card md:p-8">
          <p className="text-eyebrow font-semibold text-brand">{discovery.headerLabel}</p>
          <h1 className="mt-3 text-page-title text-foreground">{data.author.name}</h1>
          <p className="mt-3 max-w-3xl text-body-default text-text-muted">
            {data.author.bio ?? discovery.description}
          </p>
        </section>

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
      </div>
    </main>
  );
}