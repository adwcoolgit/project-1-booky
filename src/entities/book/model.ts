import type { AppLocale } from "@/shared/i18n/config";
import type { BookReviewPage } from "@/entities/review/model";

export type BookSummary = {
  id: number;
  title: string;
  authorId: number | null;
  authorName: string;
  categoryId: number | null;
  categoryName: string | null;
  coverImageUrl: string | null;
  rating: number | null;
  reviewCount: number | null;
  availableCopies: number | null;
  totalCopies: number | null;
};

export type BookDetail = {
  summary: BookSummary;
  description: string | null;
  borrowCount: number | null;
  reviews: BookReviewPage | null;
  relatedBooks: BookSummary[];
};

export type BookPresentation = {
  id: number;
  href: string;
  title: string;
  authorName: string;
  categoryLabel: string | null;
  ratingLabel: string | null;
  reviewCountLabel: string | null;
  availabilityLabel: string | null;
  coverImage: {
    src: string;
    alt: string;
    isFallback: boolean;
  };
};

export type BookPresentationOptions = {
  locale: AppLocale;
  showAvailability?: boolean;
};