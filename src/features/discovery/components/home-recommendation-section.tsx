"use client";

import { BookCard, type BookPresentation } from "@/entities/book";
import {
  HomeDiscoveryState,
  HomeDiscoveryStaleNotice,
  type HomeDiscoveryStateCopy,
} from "@/features/discovery/components/home-discovery-state";
import {
  LoadMoreButton,
  type LoadMoreButtonLabels,
} from "@/features/discovery/components/load-more-button";
import { useHomeRecommendationsLoadMore } from "@/features/discovery/hooks/use-home-recommendations-load-more";
import type { HomeDiscoveryPaginatedCollectionState } from "@/features/discovery/model/home-discovery";
import type { AppLocale } from "@/shared/i18n/config";

export type HomeRecommendationSectionLoadMoreCopy = LoadMoreButtonLabels & {
  errorTitle: string;
  errorDescription: string;
  retry: string;
};

export type HomeRecommendationSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  locale: AppLocale;
  loadMore: HomeRecommendationSectionLoadMoreCopy;
  recommendations: HomeDiscoveryPaginatedCollectionState<BookPresentation>;
  retryHref: string;
  stateCopy: HomeDiscoveryStateCopy;
};

const homeSectionHeadingClassName = "font-display text-[24px] font-bold leading-9 text-neutral-950 md:text-[28px] md:leading-10 lg:text-[32px] lg:leading-[42px] xl:text-[36px] xl:leading-[44px]";

function ReadyHomeRecommendationSection({
  locale,
  recommendations,
  loadMore,
  stateCopy,
}: {
  locale: AppLocale;
  recommendations: Extract<HomeDiscoveryPaginatedCollectionState<BookPresentation>, { status: "ready" }>;
  loadMore: HomeRecommendationSectionLoadMoreCopy;
  stateCopy: HomeDiscoveryStateCopy;
}) {
  const {
    books,
    hasMore,
    isPending,
    isLoadMoreError,
    loadMore: loadMoreRecommendations,
  } = useHomeRecommendationsLoadMore({
    locale,
    initialBooks: recommendations.items,
    initialPage: recommendations.page,
    limit: recommendations.limit,
    hasMore: recommendations.hasMore,
  });

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {recommendations.isStale ? <HomeDiscoveryStaleNotice copy={stateCopy} /> : null}
      <div
        className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-3 xl:grid-cols-[repeat(auto-fit,minmax(13.5rem,1fr))]"
        data-home-recommendations-grid="true"
      >
        {books.map((book, index) => (
          <BookCard
            book={book}
            coverImageLoading={index < 2 ? "eager" : undefined}
            key={book.id}
            variant="home"
          />
        ))}
      </div>

      {isLoadMoreError ? (
        <div
          className="rounded-[16px] border border-dashed border-border bg-white/90 p-5 shadow-sm"
          data-home-recommendations-load-more-error="true"
          role="alert"
        >
          <h3 className="text-lg font-semibold text-foreground">{loadMore.errorTitle}</h3>
          <p className="mt-2 max-w-prose text-sm text-text-muted">{loadMore.errorDescription}</p>
          <button
            className="mt-4 inline-flex rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95"
            onClick={() => loadMoreRecommendations()}
            type="button"
          >
            {loadMore.retry}
          </button>
        </div>
      ) : null}

      <div className="flex justify-center">
        <LoadMoreButton
          className="lg:min-w-[12rem]"
          hasMore={hasMore}
          hideWhenExhausted={books.length === 0}
          isPending={isPending}
          labels={loadMore}
          onLoadMore={loadMoreRecommendations}
        />
      </div>
    </div>
  );
}

export function HomeRecommendationSection({
  title,
  locale,
  loadMore,
  recommendations,
  retryHref,
  stateCopy,
}: HomeRecommendationSectionProps) {
  return (
    <section
      aria-labelledby="home-recommendations-title"
      className="flex flex-col items-center gap-5 sm:gap-6 md:gap-8 lg:gap-10"
      data-home-recommendations="true"
    >
      <div className="w-full">
        <h2 className={homeSectionHeadingClassName} id="home-recommendations-title">
          {title}
        </h2>
      </div>

      <div className="w-full">
        {recommendations.status === "loading" ? <HomeDiscoveryState copy={stateCopy} state="loading" /> : null}
        {recommendations.status === "empty" ? <HomeDiscoveryState copy={stateCopy} state="empty" /> : null}
        {recommendations.status === "error" ? (
          <HomeDiscoveryState copy={stateCopy} retryHref={retryHref} state="error" />
        ) : null}
        {recommendations.status === "ready" ? (
          <ReadyHomeRecommendationSection
            locale={locale}
            loadMore={loadMore}
            recommendations={recommendations}
            stateCopy={stateCopy}
          />
        ) : null}
      </div>
    </section>
  );
}