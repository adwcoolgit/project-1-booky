import type { AuthorPresentation, AuthorPresentationOptions, PopularAuthorSummary } from "@/entities/author/model";

const authorPortraitFallback =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320" fill="none"><rect width="320" height="320" fill="#E9DDC7"/><circle cx="160" cy="118" r="58" fill="#A67C52"/><path d="M72 278c16-55 54-84 88-84s72 29 88 84H72Z" fill="#7B5B3E"/></svg>',
  );

export function mapAuthorSummaryToPresentation(
  author: PopularAuthorSummary,
  options: AuthorPresentationOptions,
): AuthorPresentation {
  const numberFormatter = new Intl.NumberFormat(options.locale);

  return {
    id: author.id,
    href: `/${options.locale}/authors/${author.id}`,
    name: author.name,
    bio: author.bio,
    bookCountLabel: author.bookCount === null ? null : numberFormatter.format(author.bookCount),
    portraitImage: {
      src: author.portrait ?? authorPortraitFallback,
      alt: author.name,
      isFallback: author.portrait === null,
    },
  };
}