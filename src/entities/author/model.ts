import type { AppLocale } from "@/shared/i18n/config";
import type { BookSummary } from "@/entities/book/model";

export type PopularAuthorSummary = {
  id: number;
  name: string;
  bio: string | null;
  bookCount: number | null;
  portrait: string | null;
};

export type AuthorBookCollection = {
  author: PopularAuthorSummary;
  books: BookSummary[];
  page: number;
  limit: number;
  hasMore: boolean;
};

export type AuthorPresentation = {
  id: number;
  href: string;
  name: string;
  bio: string | null;
  bookCountLabel: string | null;
  portraitImage: {
    src: string;
    alt: string;
    isFallback: boolean;
  };
};

export type AuthorPresentationOptions = {
  locale: AppLocale;
};