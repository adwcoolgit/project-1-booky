import { CategoryCard, type CategoryPresentation } from "@/entities/category";
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

export function HomeCategorySection({ title, categories, retryHref, stateCopy }: HomeCategorySectionProps) {
  return (
    <section aria-labelledby="home-categories-title" className="flex flex-col gap-4" data-home-categories="true">
      <h2 className="sr-only" id="home-categories-title">
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6" data-home-categories-grid="true">
            {categories.items.map((category) => (
              <CategoryCard category={category} key={category.id} />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
