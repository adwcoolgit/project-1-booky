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
  recommendations: Pick<HomeRecommendationSectionProps, "eyebrow" | "title" | "description" | "ctaLabel">;
  popularAuthors: Pick<PopularAuthorsSectionProps, "eyebrow" | "title" | "description">;
  states: HomeDiscoveryStateCopy;
};

export type HomeDiscoverySectionsProps = {
  data: HomeDiscoveryViewModel;
  retryHref: string;
  catalogHref: string;
  copy: HomeDiscoverySectionsCopy;
};

export function HomeDiscoverySections({ data, retryHref, catalogHref, copy }: HomeDiscoverySectionsProps) {
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
        ctaHref={catalogHref}
        ctaLabel={copy.recommendations.ctaLabel}
        description={copy.recommendations.description}
        eyebrow={copy.recommendations.eyebrow}
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


