import type {
  AuthorBooksFixtureInput,
  BookDetailFixtureInput,
  BooksFixtureInput,
  RecommendedBooksFixtureInput,
  ReviewsFixtureInput,
} from "@/features/discovery/testing/discovery-fixture-inputs";

export const browserFixtureMode = process.env.NEXT_PUBLIC_AUTH_E2E_FIXTURE_MODE === "true";

export async function loadBooksCollectionFixture(input: BooksFixtureInput) {
  const { createBooksCollectionFixture } = await import("../../../../tests/fixtures/discovery/books-fixtures");

  return createBooksCollectionFixture(input);
}

export async function loadRecommendedBooksCollectionFixture(input: RecommendedBooksFixtureInput) {
  const { createRecommendedBooksCollectionFixture } = await import("../../../../tests/fixtures/discovery/books-fixtures");

  return createRecommendedBooksCollectionFixture(input);
}

export async function loadBookDetailFixture(input: BookDetailFixtureInput) {
  const { createBookDetailResponseFixture } = await import("../../../../tests/fixtures/discovery/books-fixtures");

  return createBookDetailResponseFixture(input);
}

export async function loadAuthorBooksFixture(input: AuthorBooksFixtureInput) {
  const { createAuthorBooksResponseFixture } = await import("../../../../tests/fixtures/discovery/authors-fixtures");

  return createAuthorBooksResponseFixture(input);
}

export async function loadReviewsFixture(input: ReviewsFixtureInput) {
  const { createReviewsCollectionFixture } = await import("../../../../tests/fixtures/discovery/reviews-fixtures");

  return createReviewsCollectionFixture(input);
}