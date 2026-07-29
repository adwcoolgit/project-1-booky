import { http, HttpResponse } from "msw";
import type { RequestHandler } from "msw";

import { runtimeConfig } from "@/shared/config/runtime";
import {
  createBookDetailResponseFixture,
  createBooksCollectionFixture,
  createRecommendedBooksCollectionFixture,
  homeRecommendedBooksCollectionFixture,
} from "@/../tests/fixtures/discovery/books-fixtures";
import {
  createAuthorBooksResponseFixture,
  createAuthorsCollectionFixture,
  homePopularAuthorsCollectionFixture,
} from "@/../tests/fixtures/discovery/authors-fixtures";
import { homeCategoriesCollectionFixture } from "@/../tests/fixtures/discovery/categories-fixtures";
import { createReviewsCollectionFixture } from "@/../tests/fixtures/discovery/reviews-fixtures";

const discoveryBaseUrl = runtimeConfig.apiBaseUrl;

function parseOptionalInteger(value: string | null | undefined) {
  if (!value || !/^\d+$/.test(value)) {
    return undefined;
  }

  return Number(value);
}

export const discoveryHandlers: RequestHandler[] = [
  http.get(`${discoveryBaseUrl}/categories`, () => HttpResponse.json(homeCategoriesCollectionFixture)),
  http.get(`${discoveryBaseUrl}/books/recommend`, ({ request }) => {
    const url = new URL(request.url);
    const categoryId = parseOptionalInteger(url.searchParams.get("categoryId"));
    const page = parseOptionalInteger(url.searchParams.get("page"));
    const limit = parseOptionalInteger(url.searchParams.get("limit"));

    if (categoryId === 500) {
      return HttpResponse.text("Related books request failed.", { status: 500 });
    }

    if (categoryId === undefined) {
      if (!page || page <= 1) {
        return HttpResponse.json(homeRecommendedBooksCollectionFixture);
      }

      return HttpResponse.json(
        createRecommendedBooksCollectionFixture({
          page,
          limit,
        }),
      );
    }

    return HttpResponse.json(
      createRecommendedBooksCollectionFixture({
        categoryId,
        page,
        limit,
      }),
    );
  }),
  http.get(`${discoveryBaseUrl}/books/:bookId`, ({ params }) => {
    const bookId = parseOptionalInteger(typeof params.bookId === "string" ? params.bookId : undefined);

    if (!bookId) {
      return HttpResponse.text("Invalid book id.", { status: 400 });
    }

    if (bookId === 500) {
      return HttpResponse.text("Book detail request failed.", { status: 500 });
    }

    const fixture = createBookDetailResponseFixture({ bookId });

    if (!fixture) {
      return HttpResponse.text("Book not found.", { status: 404 });
    }

    return HttpResponse.json(fixture);
  }),
  http.get(`${discoveryBaseUrl}/reviews/book/:bookId`, ({ params, request }) => {
    const url = new URL(request.url);
    const bookId = parseOptionalInteger(typeof params.bookId === "string" ? params.bookId : undefined);

    if (!bookId) {
      return HttpResponse.text("Invalid book id.", { status: 400 });
    }

    if (bookId === 500) {
      return HttpResponse.text("Book reviews request failed.", { status: 500 });
    }

    return HttpResponse.json(
      createReviewsCollectionFixture({
        bookId,
        page: parseOptionalInteger(url.searchParams.get("page")),
        limit: parseOptionalInteger(url.searchParams.get("limit")),
      }),
    );
  }),
  http.get(`${discoveryBaseUrl}/authors/popular`, ({ request }) => {
    const url = new URL(request.url);

    return HttpResponse.json(
      createAuthorsCollectionFixture({
        limit: parseOptionalInteger(url.searchParams.get("limit")) ?? homePopularAuthorsCollectionFixture.authors.length,
      }),
    );
  }),
  http.get(`${discoveryBaseUrl}/authors/:authorId/books`, ({ params, request }) => {
    const url = new URL(request.url);
    const authorId = parseOptionalInteger(typeof params.authorId === "string" ? params.authorId : undefined);

    if (!authorId) {
      return HttpResponse.text("Invalid author id.", { status: 400 });
    }

    if (authorId === 500) {
      return HttpResponse.text("Author books request failed.", { status: 500 });
    }

    const fixture = createAuthorBooksResponseFixture({
      authorId,
      page: parseOptionalInteger(url.searchParams.get("page")),
      limit: parseOptionalInteger(url.searchParams.get("limit")),
    });

    if (!fixture) {
      return HttpResponse.text("Author not found.", { status: 404 });
    }

    return HttpResponse.json(fixture);
  }),
  http.get(`${discoveryBaseUrl}/authors`, ({ request }) => {
    const url = new URL(request.url);

    return HttpResponse.json(
      createAuthorsCollectionFixture({
        q: url.searchParams.get("q") ?? undefined,
        limit: parseOptionalInteger(url.searchParams.get("limit")),
      }),
    );
  }),
  http.get(`${discoveryBaseUrl}/books`, ({ request }) => {
    const url = new URL(request.url);

    if (url.searchParams.get("q") === "server-error") {
      return HttpResponse.text("Discovery request failed.", { status: 500 });
    }

    return HttpResponse.json(
      createBooksCollectionFixture({
        q: url.searchParams.get("q") ?? undefined,
        categoryId: parseOptionalInteger(url.searchParams.get("categoryId")),
        authorId: parseOptionalInteger(url.searchParams.get("authorId")),
        minRating: parseOptionalInteger(url.searchParams.get("minRating")),
        page: parseOptionalInteger(url.searchParams.get("page")),
        limit: parseOptionalInteger(url.searchParams.get("limit")),
      }),
    );
  }),
];