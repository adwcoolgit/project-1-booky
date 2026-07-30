import type { AppLocale } from "@/shared/i18n/config";
import type { BookReviewSummary, ReviewPresentation } from "@/entities/review/model";

export function mapReviewSummaryToPresentation(
  review: BookReviewSummary,
  locale: AppLocale,
): ReviewPresentation {
  let createdAtLabel: string | null = null;

  if (review.createdAt) {
    const date = new Date(review.createdAt);

    if (!Number.isNaN(date.getTime())) {
      createdAtLabel = new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(date);
    }
  }

  return {
    id: review.id,
    reviewerName: review.reviewerName,
    star: review.star,
    starLabel: new Intl.NumberFormat(locale).format(review.star),
    comment: review.comment,
    createdAtLabel,
  };
}