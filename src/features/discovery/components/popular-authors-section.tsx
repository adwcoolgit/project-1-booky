import { AuthorCard, type AuthorPresentation } from "@/entities/author";
import {
  PopularAuthorsState,
  PopularAuthorsStaleNotice,
  type PopularAuthorsStateCopy,
} from "@/features/discovery/components/popular-authors-state";
import type { HomeDiscoveryCollectionState } from "@/features/discovery/model/home-discovery";

export type PopularAuthorsSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  authors: HomeDiscoveryCollectionState<AuthorPresentation>;
  retryHref: string;
  stateCopy: PopularAuthorsStateCopy;
};

const homeSectionHeadingClassName = "font-display text-[24px] font-bold leading-9 text-neutral-950 md:text-[28px] md:leading-10 lg:text-[32px] lg:leading-[42px] xl:text-[36px] xl:leading-[44px]";

export function PopularAuthorsSection({ title, authors, retryHref, stateCopy }: PopularAuthorsSectionProps) {
  return (
    <section
      aria-labelledby="home-popular-authors-title"
      className="flex flex-col gap-6 sm:gap-8 lg:gap-10"
      data-home-popular-authors="true"
    >
      <h2 className={homeSectionHeadingClassName} id="home-popular-authors-title">
        {title}
      </h2>

      <div>
        {authors.status === "loading" ? <PopularAuthorsState copy={stateCopy} state="loading" /> : null}
        {authors.status === "empty" ? <PopularAuthorsState copy={stateCopy} state="empty" /> : null}
        {authors.status === "error" ? (
          <PopularAuthorsState copy={stateCopy} retryHref={retryHref} state="error" />
        ) : null}
        {authors.status === "ready" ? (
          <div className="flex flex-col gap-4 sm:gap-5">
            {authors.isStale ? <PopularAuthorsStaleNotice copy={stateCopy} /> : null}
            <div className="grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 xl:grid-cols-4" data-home-popular-authors-grid="true">
              {authors.items.map((author) => (
                <AuthorCard author={author} key={author.id} variant="list" />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}