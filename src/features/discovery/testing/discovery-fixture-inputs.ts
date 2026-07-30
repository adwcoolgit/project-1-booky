export type BooksFixtureInput = {
  q?: string | undefined;
  categoryId?: number | undefined;
  authorId?: number | undefined;
  minRating?: number | undefined;
  page?: number | undefined;
  limit?: number | undefined;
};

export type RecommendedBooksFixtureInput = {
  categoryId?: number | undefined;
  page?: number | undefined;
  limit?: number | undefined;
};

export type AuthorBooksFixtureInput = {
  authorId: number;
  page?: number | undefined;
  limit?: number | undefined;
};

export type BookDetailFixtureInput = {
  bookId: number;
};

export type ReviewsFixtureInput = {
  bookId: number;
  page?: number | undefined;
  limit?: number | undefined;
};