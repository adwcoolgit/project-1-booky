import type { BookPresentation, BookPresentationOptions, BookSummary } from "@/entities/book/model";

const bookCoverFallback =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="280" height="420" viewBox="0 0 280 420" fill="none"><rect width="280" height="420" rx="24" fill="#F0E3D0"/><rect x="32" y="44" width="216" height="332" rx="18" fill="#C98A3D" opacity="0.28"/><path d="M62 88h156" stroke="#6E4A2A" stroke-width="12" stroke-linecap="round"/><path d="M62 132h124" stroke="#6E4A2A" stroke-width="12" stroke-linecap="round" opacity="0.7"/><path d="M62 176h92" stroke="#6E4A2A" stroke-width="12" stroke-linecap="round" opacity="0.5"/></svg>',
  );

export function mapBookSummaryToPresentation(
  book: BookSummary,
  options: BookPresentationOptions,
): BookPresentation {
  const numberFormatter = new Intl.NumberFormat(options.locale);
  const ratingLabel =
    book.rating === null
      ? null
      : new Intl.NumberFormat(options.locale, { maximumFractionDigits: 1 }).format(book.rating);
  const reviewCountLabel = book.reviewCount === null ? null : numberFormatter.format(book.reviewCount);
  const availabilityLabel =
    options.showAvailability && book.availableCopies !== null && book.totalCopies !== null
      ? `${numberFormatter.format(book.availableCopies)}/${numberFormatter.format(book.totalCopies)}`
      : null;

  return {
    id: book.id,
    href: `/${options.locale}/books/${book.id}`,
    title: book.title,
    authorName: book.authorName,
    categoryLabel: book.categoryName,
    ratingLabel,
    reviewCountLabel,
    availabilityLabel,
    coverImage: {
      src: book.coverImageUrl ?? bookCoverFallback,
      alt: book.coverImageUrl ? book.title : "",
      isFallback: book.coverImageUrl === null,
    },
  };
}