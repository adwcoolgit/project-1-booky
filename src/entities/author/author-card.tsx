import Image from "next/image";
import Link from "next/link";

import type { AuthorPresentation } from "@/entities/author/model";
import { cn } from "@/shared/lib/utils";

const GRID_AUTHOR_CARD_SIZES =
  "(max-width: 767px) calc(100vw - 3rem), (max-width: 1279px) calc((100vw - 5rem) / 3), 285px";
const LIST_AUTHOR_CARD_SIZES =
  "(max-width: 639px) 60px, (max-width: 767px) 64px, (max-width: 1023px) 68px, (max-width: 1279px) 72px, 81px";

function BookIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6 shrink-0 text-brand" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.75 4.75h9.5A2.75 2.75 0 0 1 19 7.5v11.75H8.5A2.75 2.75 0 0 0 5.75 22V7.5a2.75 2.75 0 0 1 1-2.12Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M8.5 19.25H19" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M9.5 8.75h5.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

export type AuthorCardProps = {
  author: AuthorPresentation;
  variant?: "grid" | "list";
  className?: string | undefined;
};

export function AuthorCard({ author, variant = "grid", className }: AuthorCardProps) {
  if (variant === "list") {
    return (
      <Link
        aria-label={author.name}
        className={cn(
          "home-card-shadow group flex h-full items-center gap-3 rounded-[12px] bg-white p-3 transition hover:-translate-y-0.5 sm:gap-3.5 sm:p-3.5 md:gap-4 md:p-4 lg:rounded-[16px]",
          className,
        )}
        data-author-card="true"
        data-author-card-variant={variant}
        href={author.href}
      >
        <div
          className="relative h-[60px] w-[60px] shrink-0 overflow-hidden rounded-full bg-brand-subtle sm:h-16 sm:w-16 md:h-[68px] md:w-[68px] lg:h-[72px] lg:w-[72px] xl:h-[81px] xl:w-[81px]"
          data-author-portrait-fallback={author.portraitImage.isFallback ? "true" : "false"}
        >
          <Image
            alt={author.portraitImage.alt}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            fill
            sizes={LIST_AUTHOR_CARD_SIZES}
            src={author.portraitImage.src}
            unoptimized
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-bold leading-[30px] tracking-[-0.02em] text-neutral-900 md:text-[17px] md:leading-[30px] lg:text-lg lg:leading-8">
            {author.name}
          </h3>
          {author.bookCountLabel ? (
            <div className="mt-0.5 flex items-center gap-[6px] text-sm font-medium leading-7 tracking-[-0.03em] text-neutral-950 md:text-[15px] md:leading-7 lg:text-base lg:leading-[30px]">
              <BookIcon />
              <span>{author.bookCountLabel}</span>
            </div>
          ) : author.bio ? (
            <p className="line-clamp-2 text-sm text-text-muted">{author.bio}</p>
          ) : null}
        </div>
      </Link>
    );
  }

  return (
    <Link
      aria-label={author.name}
      className={cn(
        "group flex flex-col overflow-hidden rounded-[24px] border border-border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
        className,
      )}
      data-author-card="true"
      data-author-card-variant={variant}
      href={author.href}
    >
      <div
        className="relative aspect-square w-full overflow-hidden rounded-[20px] bg-muted/50"
        data-author-portrait-fallback={author.portraitImage.isFallback ? "true" : "false"}
      >
        <Image
          alt={author.portraitImage.alt}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          fill
          sizes={GRID_AUTHOR_CARD_SIZES}
          src={author.portraitImage.src}
          unoptimized
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2 pt-4">
        <h3 className="text-lg font-semibold text-foreground">{author.name}</h3>
        {author.bio ? <p className="line-clamp-3 text-sm text-text-muted">{author.bio}</p> : null}
        {author.bookCountLabel ? <p className="text-sm font-medium text-brand">{author.bookCountLabel}</p> : null}
      </div>
    </Link>
  );
}