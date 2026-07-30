import Image from "next/image";
import Link from "next/link";

import type { BookPresentation } from "@/entities/book/model";
import { cn } from "@/shared/lib/utils";

const HOME_BOOK_CARD_SIZES =
  "(max-width: 639px) calc((100vw - 3rem) / 2), (max-width: 767px) calc((100vw - 4rem) / 2), (max-width: 1023px) calc((100vw - 5rem) / 2), (max-width: 1279px) calc((100vw - 7rem) / 3), 224px";
const SEARCH_BOOK_CARD_SIZES =
  "(max-width: 639px) calc((100vw - 3rem) / 2), (max-width: 1023px) calc((100vw - 4rem) / 2), (max-width: 1279px) calc((100vw - 5rem) / 4), 204px";
const AUTHOR_BOOK_CARD_SIZES =
  "(max-width: 639px) calc((100vw - 3rem) / 2), (max-width: 767px) calc((100vw - 4rem) / 2), (max-width: 1023px) calc((100vw - 5rem) / 3), (max-width: 1279px) calc((100vw - 6rem) / 4), 224px";
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
  variant?: "grid" | "related" | "home" | "search" | "author";
  className?: string | undefined;
  coverImageLoading?: "eager" | "lazy" | undefined;
};

export function BookCard({ book, variant = "grid", className, coverImageLoading }: BookCardProps) {
  if (variant === "home" || variant === "search" || variant === "author") {
    const isHomeVariant = variant === "home";
    const isSearchVariant = variant === "search";
    const cardHeightClass = isHomeVariant
      ? "h-[370px] sm:h-[390px] md:h-[420px] lg:h-[440px] xl:h-[468px]"
      : isSearchVariant
        ? "h-[390px] sm:h-[398px] md:h-[410px] lg:h-[424px] xl:h-[439px]"
        : "h-[390px] sm:h-[398px] md:h-[420px] lg:h-[440px] xl:h-[468px]";
    const imageHeightClass = isHomeVariant
      ? "h-[258px] sm:h-[272px] md:h-[300px] lg:h-[316px] xl:h-[336px]"
      : isSearchVariant
        ? "h-[258px] sm:h-[266px] md:h-[278px] lg:h-[292px] xl:h-[307px]"
        : "h-[258px] sm:h-[266px] md:h-[300px] lg:h-[316px] xl:h-[336px]";

    return (
      <Link
        aria-label={book.title}
        className={cn(
          "home-card-shadow group flex w-full flex-col overflow-hidden rounded-[12px] bg-white transition hover:-translate-y-0.5",
          cardHeightClass,
          className,
        )}
        data-book-card="true"
        href={book.href}
      >
        <div
          className={cn(
            "relative w-full overflow-hidden",
            imageHeightClass,
            book.coverImage.isFallback ? "bg-brand-subtle" : "bg-muted/50",
          )}
        >
          <Image
            alt={book.coverImage.alt}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            fill
            loading={coverImageLoading}
            sizes={isHomeVariant ? HOME_BOOK_CARD_SIZES : isSearchVariant ? SEARCH_BOOK_CARD_SIZES : AUTHOR_BOOK_CARD_SIZES}
            src={book.coverImage.src}
            unoptimized
          />
        </div>
        <div
          className={cn(
            isHomeVariant
              ? "flex flex-1 flex-col gap-0.5 p-3 sm:gap-1 sm:p-[14px] md:p-4"
              : isSearchVariant
                ? "flex h-[132px] flex-col gap-1 overflow-hidden p-4"
                : "flex h-[132px] flex-col gap-1 overflow-hidden p-4",
          )}
        >
          <p
            className={cn(
              isHomeVariant
                ? "line-clamp-1 text-sm font-bold leading-7 tracking-[-0.02em] text-neutral-900 sm:text-[15px] sm:leading-7 md:text-base md:leading-[30px] lg:text-[17px] lg:leading-8 xl:text-lg xl:leading-8 xl:tracking-[-0.03em]"
                : "line-clamp-1 text-[18px] font-bold leading-8 tracking-[-0.03em] text-neutral-900",
            )}
          >
            {book.title}
          </p>
          <p
            className={cn(
              isHomeVariant
                ? "line-clamp-1 text-sm font-medium leading-7 tracking-[-0.03em] text-neutral-700 sm:text-[15px] sm:leading-7 md:text-[15px] md:leading-[30px] lg:text-base lg:leading-[30px]"
                : "line-clamp-1 text-base font-medium leading-[30px] tracking-[-0.03em] text-neutral-700",
            )}
          >
            {book.authorName}
          </p>
          <div
            className={cn(
              "mt-auto flex items-center gap-[2px]",
              isHomeVariant
                ? "pt-0.5 text-sm font-semibold leading-7 tracking-[-0.02em] text-neutral-900 sm:text-[15px] sm:leading-7 md:pt-1 md:text-[15px] md:leading-[30px] lg:text-base lg:leading-[30px]"
                : "pt-0.5 text-base font-semibold leading-[30px] tracking-[-0.02em] text-neutral-900",
            )}
          >
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
          loading={coverImageLoading}
          sizes={variant === "related" ? RELATED_BOOK_CARD_SIZES : GRID_BOOK_CARD_SIZES}
          src={book.coverImage.src}
          unoptimized
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {book.categoryLabel ? <p className="text-eyebrow text-brand">{book.categoryLabel}</p> : null}
        <p className="line-clamp-2 text-lg font-semibold text-foreground">{book.title}</p>
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