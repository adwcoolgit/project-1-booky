export type BookReviewSummary = {
  id: string;
  bookId: number;
  reviewerName: string | null;
  star: number;
  comment: string | null;
  createdAt: string | null;
};

export type BookReviewPage = {
  items: BookReviewSummary[];
  page: number;
  limit: number;
  hasMore: boolean;
};

export type ReviewPresentation = {
  id: string;
  reviewerName: string | null;
  star: number;
  starLabel: string;
  comment: string | null;
  createdAtLabel: string | null;
};