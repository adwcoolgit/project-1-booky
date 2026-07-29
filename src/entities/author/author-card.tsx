import Image from "next/image";
import Link from "next/link";

import type { AuthorPresentation } from "@/entities/author/model";
import { cn } from "@/shared/lib/utils";

const GRID_AUTHOR_CARD_SIZES =
  "(max-width: 767px) calc(100vw - 3rem), (max-width: 1279px) calc((100vw - 5rem) / 3), 285px";

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
          "home-card-shadow group flex h-full items-center gap-4 rounded-[12px] bg-white p-4 transition hover:-translate-y-0.5",
          className,
        )}
        data-author-card="true"
        data-author-card-variant={variant}
        href={author.href}
      >
        <div
          className="relative h-[81px] w-[81px] shrink-0 overflow-hidden rounded-full bg-brand-subtle"
          data-author-portrait-fallback={author.portraitImage.isFallback ? "true" : "false"}
        >
          <Image
            alt={author.portraitImage.alt}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            fill
            sizes="81px"
            src={author.portraitImage.src}
            unoptimized
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-bold leading-8 tracking-[-0.03em] text-neutral-900">{author.name}</h3>
          {author.bookCountLabel ? (
            <div className="mt-0.5 flex items-center gap-[6px] text-base font-medium leading-[30px] tracking-[-0.03em] text-neutral-950">
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
