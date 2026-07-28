import Link from "next/link";

import { BookCard, type BookPresentation } from "@/entities/book";
import {
  HomeDiscoveryState,
  HomeDiscoveryStaleNotice,
  type HomeDiscoveryStateCopy,
} from "@/features/discovery/components/home-discovery-state";
import type { HomeDiscoveryCollectionState } from "@/features/discovery/model/home-discovery";

export type HomeRecommendationSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  recommendations: HomeDiscoveryCollectionState<BookPresentation>;
  retryHref: string;
  stateCopy: HomeDiscoveryStateCopy;
};

export function HomeRecommendationSection({
  title,
  ctaLabel,
  ctaHref,
  recommendations,
  retryHref,
  stateCopy,
}: HomeRecommendationSectionProps) {
  return (
    <section
      aria-labelledby="home-recommendations-title"
      className="flex flex-col items-center gap-10"
      data-home-recommendations="true"
    >
      <div className="w-full">
        <h2 className="home-section-heading" id="home-recommendations-title">
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
          <div className="flex flex-col gap-5">
            {recommendations.isStale ? <HomeDiscoveryStaleNotice copy={stateCopy} /> : null}
            <div
              className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-[repeat(auto-fit,minmax(13.5rem,1fr))] xl:gap-5"
              data-home-recommendations-grid="true"
            >
              {recommendations.items.map((book) => (
                <BookCard book={book} key={book.id} variant="home" />
              ))}
            </div>
            <div className="flex justify-center">
              <Link
                className="inline-flex h-12 items-center justify-center rounded-full border border-border px-6 text-base font-bold leading-[30px] tracking-[-0.02em] text-neutral-950 transition hover:bg-muted"
                href={ctaHref}
              >
                {ctaLabel}
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
