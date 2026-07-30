import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { readRouteGuardResult } from "@/features/auth/config/auth-routes";
import {
  AuthorBooksSection,
  AuthorRouteStatePanel,
  DiscoveryPageStateSection,
  UserFacingPageShell,
  discoveryLimitDefaults,
  parseAuthorRouteParams,
  readAuthorBooksPageView,
  readDiscoveryAuthenticatedDisplayName,
} from "@/features/discovery";
import type { AppLocale } from "@/shared/i18n/config";
import { resolveLocale } from "@/shared/i18n/config";
import {
  getDiscoveryFeatureMessages,
  getSourceMetadataMessages,
  getSourceNavigationMessages,
} from "@/shared/i18n/get-messages";

const authorPageMainClassName = "px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-8 lg:px-10 lg:py-10 xl:px-[120px] xl:py-12";
const authorPageContentClassName = "gap-4 sm:gap-5 md:gap-6 lg:gap-8";

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

  const displayName = await readDiscoveryAuthenticatedDisplayName({
    locale,
    currentPath: pathname,
    session: guard.session,
  });
  const discovery = getDiscoveryFeatureMessages(locale).results.author;
  const stateCopy = createAuthorRouteStateCopy(locale);
  const parsedRoute = parseAuthorRouteParams({ authorId: rawAuthorId });

  let content;

  if (parsedRoute.status === "invalid") {
    content = (
      <>
        <DiscoveryPageStateSection
          description={discovery.states.invalidId.description}
          title={discovery.states.invalidId.title}
        />
        <AuthorRouteStatePanel copy={stateCopy} state="invalidId" />
      </>
    );
  } else {
    const data = await readAuthorBooksPageView(
      locale,
      parsedRoute.params.authorId,
      discoveryLimitDefaults.authorBooks,
    );

    if (data.status === "not-found") {
      content = (
        <>
          <DiscoveryPageStateSection
            description={discovery.states.notFound.description}
            title={discovery.states.notFound.title}
          />
          <AuthorRouteStatePanel copy={stateCopy} state="notFound" />
        </>
      );
    } else if (data.status === "error") {
      content = (
        <>
          <DiscoveryPageStateSection
            description={discovery.states.error.description}
            title={discovery.states.error.title}
          />
          <AuthorRouteStatePanel copy={stateCopy} retryHref={pathname} state="error" />
        </>
      );
    } else {
      content = (
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
      );
    }
  }

  return (
    <UserFacingPageShell
      contentClassName={authorPageContentClassName}
      displayName={displayName}
      locale={locale}
      mainClassName={authorPageMainClassName}
      searchActionHref={`/${locale}/books`}
      searchHiddenFields={{ authorId: parsedRoute.status === "valid" ? parsedRoute.params.authorId : null }}
      variant="authenticated"
    >
      {content}
    </UserFacingPageShell>
  );
}