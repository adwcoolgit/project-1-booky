import { type CategoryPresentation } from "@/entities/category";
import { HomeCategoryCarousel } from "@/features/discovery/components/home-category-carousel";
import {
  HomeDiscoveryState,
  HomeDiscoveryStaleNotice,
  type HomeDiscoveryStateCopy,
} from "@/features/discovery/components/home-discovery-state";
import type { HomeDiscoveryCollectionState } from "@/features/discovery/model/home-discovery";

export type HomeCategorySectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  categories: HomeDiscoveryCollectionState<CategoryPresentation>;
  retryHref: string;
  stateCopy: HomeDiscoveryStateCopy;
};

const HOME_CATEGORIES_TITLE_ID = "home-categories-title";

export function HomeCategorySection({ eyebrow, title, categories, retryHref, stateCopy }: HomeCategorySectionProps) {
  return (
    <section aria-labelledby={HOME_CATEGORIES_TITLE_ID} className="flex flex-col gap-4" data-home-categories="true">
      <h2 className="sr-only" id={HOME_CATEGORIES_TITLE_ID}>
        {title}
      </h2>

      {categories.status === "loading" ? <HomeDiscoveryState copy={stateCopy} state="loading" /> : null}
      {categories.status === "empty" ? <HomeDiscoveryState copy={stateCopy} state="empty" /> : null}
      {categories.status === "error" ? (
        <HomeDiscoveryState copy={stateCopy} retryHref={retryHref} state="error" />
      ) : null}
      {categories.status === "ready" ? (
        <>
          {categories.isStale ? <HomeDiscoveryStaleNotice copy={stateCopy} /> : null}
          <HomeCategoryCarousel categories={categories.items} controlsLabel={eyebrow} labelledById={HOME_CATEGORIES_TITLE_ID} />
        </>
      ) : null}
    </section>
  );
}