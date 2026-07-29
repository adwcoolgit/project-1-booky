import type { AppLocale } from "@/shared/i18n/config";
import {
  HomeCategorySection,
  type HomeCategorySectionProps,
} from "@/features/discovery/components/home-category-section";
import type { HomeDiscoveryStateCopy } from "@/features/discovery/components/home-discovery-state";
import {
  HomeRecommendationSection,
  type HomeRecommendationSectionProps,
} from "@/features/discovery/components/home-recommendation-section";
import {
  PopularAuthorsSection,
  type PopularAuthorsSectionProps,
} from "@/features/discovery/components/popular-authors-section";
import type { HomeDiscoveryViewModel } from "@/features/discovery/model/home-discovery";

export type HomeDiscoverySectionsCopy = {
  categories: Pick<HomeCategorySectionProps, "eyebrow" | "title" | "description">;
  recommendations: Pick<HomeRecommendationSectionProps, "eyebrow" | "title" | "description" | "loadMore">;
  popularAuthors: Pick<PopularAuthorsSectionProps, "eyebrow" | "title" | "description">;
  states: HomeDiscoveryStateCopy;
};

export type HomeDiscoverySectionsProps = {
  locale: AppLocale;
  data: HomeDiscoveryViewModel;
  retryHref: string;
  copy: HomeDiscoverySectionsCopy;
};

export function HomeDiscoverySections({ locale, data, retryHref, copy }: HomeDiscoverySectionsProps) {
  return (
    <div className="flex flex-col gap-12">
      <HomeCategorySection
        categories={data.categories}
        description={copy.categories.description}
        eyebrow={copy.categories.eyebrow}
        retryHref={retryHref}
        stateCopy={copy.states}
        title={copy.categories.title}
      />
      <HomeRecommendationSection
        description={copy.recommendations.description}
        eyebrow={copy.recommendations.eyebrow}
        loadMore={copy.recommendations.loadMore}
        locale={locale}
        recommendations={data.recommendations}
        retryHref={retryHref}
        stateCopy={copy.states}
        title={copy.recommendations.title}
      />
      <div className="w-full border-t border-border" data-home-section-divider="true" />
      <PopularAuthorsSection
        authors={data.popularAuthors}
        description={copy.popularAuthors.description}
        eyebrow={copy.popularAuthors.eyebrow}
        retryHref={retryHref}
        stateCopy={copy.states}
        title={copy.popularAuthors.title}
      />
    </div>
  );
}