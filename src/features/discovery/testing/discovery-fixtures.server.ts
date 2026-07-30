import "server-only";

import type {
  AuthorBooksFixtureInput,
  BookDetailFixtureInput,
  BooksFixtureInput,
  RecommendedBooksFixtureInput,
  ReviewsFixtureInput,
} from "@/features/discovery/testing/discovery-fixture-inputs";

const homeCategoriesFixture = Object.freeze({
  categories: [
    { id: 7, name: "Science Fiction" },
    { id: 8, name: "History" },
    { id: 9, name: "Personal Growth" },
    { id: 10, name: "Philosophy" },
  ],
});

const homePopularAuthorsFixture = Object.freeze({
  authors: [
    {
      id: 21,
      name: "Ursula K. Le Guin",
      bio: "American novelist known for speculative fiction.",
      bookCount: 47,
    },
    {
      id: 22,
      name: "N. K. Jemisin",
      bio: "Award-winning fantasy and science fiction author.",
      bookCount: 12,
    },
    {
      id: 31,
      name: "Yuval Noah Harari",
      bio: "Historian focused on broad human narratives.",
      bookCount: 9,
    },
    {
      id: 41,
      name: "James Clear",
      bio: "Writer on behavior change and sustainable habits.",
      bookCount: 6,
    },
  ],
});

export function getHomeCategoriesFixture() {
  return homeCategoriesFixture;
}

export function getHomePopularAuthorsFixture() {
  return homePopularAuthorsFixture;
}

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