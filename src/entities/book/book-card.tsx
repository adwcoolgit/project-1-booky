import Image from "next/image";
import Link from "next/link";

import type { BookPresentation } from "@/entities/book/model";
import { cn } from "@/shared/lib/utils";

const HOME_BOOK_CARD_SIZES =
  "(max-width: 639px) calc((100vw - 3rem) / 2), (max-width: 767px) calc((100vw - 4rem) / 2), (max-width: 1023px) calc((100vw - 5rem) / 2), (max-width: 1279px) calc((100vw - 7rem) / 3), 224px";
const GRID_BOOK_CARD_SIZES =
  "(max-width: 639px) calc((100vw - 3rem) / 2), (max-width: 1023px) calc((100vw - 4rem) / 2), (max-width: 1279px) calc((100vw - 6rem) / 4), 20rem";
const RELATED_BOOK_CARD_SIZES =
  "(max-width: 639px) calc((100vw - 3rem) / 2), (max-width: 1023px) calc((100vw - 4rem) / 2), (max-width: 1279px) calc((100vw - 5rem) / 3), 18rem";

function StarIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6 shrink-0 text-warning" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="m12 2.75 2.86 5.8 6.4.93-4.63 4.5 1.1 6.37L12 17.35l-5.73 3 1.1-6.37-4.63-4.5 6.4-.93L12 2.75Z" />
    </svg>
  );
}

export type BookCardProps = {
  book: BookPresentation;
  variant?: "grid" | "related" | "home";
  className?: string | undefined;
};

export function BookCard({ book, variant = "grid", className }: BookCardProps) {
  if (variant === "home") {
    return (
      <Link
        aria-label={book.title}
        className={cn(
          "home-card-shadow group flex h-[370px] w-full flex-col overflow-hidden rounded-[12px] bg-white transition hover:-translate-y-0.5 sm:h-[390px] md:h-[420px] lg:h-[440px] xl:h-[468px]",
          className,
        )}
        data-book-card="true"
        href={book.href}
      >
        <div
          className={cn(
            "relative h-[258px] w-full overflow-hidden sm:h-[272px] md:h-[300px] lg:h-[316px] xl:h-[336px]",
            book.coverImage.isFallback ? "bg-brand-subtle" : "bg-muted/50",
          )}
        >
          <Image
            alt={book.coverImage.alt}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            fill
            sizes={HOME_BOOK_CARD_SIZES}
            src={book.coverImage.src}
            unoptimized
          />
        </div>
        <div className="flex flex-1 flex-col gap-0.5 p-3 sm:gap-1 sm:p-[14px] md:p-4">
          <h3 className="line-clamp-1 text-sm font-bold leading-7 tracking-[-0.02em] text-neutral-900 sm:text-[15px] sm:leading-7 md:line-clamp-2 md:text-base md:leading-[30px] lg:text-[17px] lg:leading-8 xl:text-lg xl:leading-8 xl:tracking-[-0.03em]">
            {book.title}
          </h3>
          <p className="line-clamp-1 text-sm font-medium leading-7 tracking-[-0.03em] text-neutral-700 sm:text-[15px] sm:leading-7 md:text-[15px] md:leading-[30px] lg:text-base lg:leading-[30px]">
            {book.authorName}
          </p>
          <div className="mt-auto flex items-center gap-[2px] pt-0.5 text-sm font-semibold leading-7 tracking-[-0.02em] text-neutral-900 sm:text-[15px] sm:leading-7 md:pt-1 md:text-[15px] md:leading-[30px] lg:text-base lg:leading-[30px]">
            <StarIcon />
            <span>{book.ratingLabel ?? "-"}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      aria-label={book.title}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[24px] border border-border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
        variant === "related" ? "max-w-[18rem]" : "min-h-[22rem]",
        className,
      )}
      data-book-card="true"
      href={book.href}
    >
      <div
        className={cn(
          "relative aspect-[4/5] w-full overflow-hidden",
          book.coverImage.isFallback ? "bg-brand-subtle" : "bg-muted/50",
        )}
      >
        <Image
          alt={book.coverImage.alt}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          fill
          sizes={variant === "related" ? RELATED_BOOK_CARD_SIZES : GRID_BOOK_CARD_SIZES}
          src={book.coverImage.src}
          unoptimized
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {book.categoryLabel ? <p className="text-eyebrow text-brand">{book.categoryLabel}</p> : null}
        <h3 className="line-clamp-2 text-lg font-semibold text-foreground">{book.title}</h3>
        <p className="text-sm text-text-muted">{book.authorName}</p>
        <div className="mt-auto flex flex-wrap gap-2 pt-2 text-sm text-text-muted">
          {book.ratingLabel ? <span>{book.ratingLabel}</span> : null}
          {book.reviewCountLabel ? <span>{book.reviewCountLabel}</span> : null}
          {book.availabilityLabel ? <span>{book.availabilityLabel}</span> : null}
        </div>
      </div>
    </Link>
  );
}
