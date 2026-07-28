import { http, HttpResponse } from "msw";
import type { RequestHandler } from "msw";

import { runtimeConfig } from "@/shared/config/runtime";
import {
  createBooksCollectionFixture,
  homeRecommendedBooksCollectionFixture,
} from "@/../tests/fixtures/discovery/books-fixtures";
import {
  createAuthorBooksResponseFixture,
  createAuthorsCollectionFixture,
  homePopularAuthorsCollectionFixture,
} from "@/../tests/fixtures/discovery/authors-fixtures";
import { homeCategoriesCollectionFixture } from "@/../tests/fixtures/discovery/categories-fixtures";

const discoveryBaseUrl = runtimeConfig.apiBaseUrl;

function parseOptionalInteger(value: string | null | undefined) {
  if (!value || !/^\d+$/.test(value)) {
    return undefined;
  }

  return Number(value);
}

export const discoveryHandlers: RequestHandler[] = [
  http.get(`${discoveryBaseUrl}/categories`, () => HttpResponse.json(homeCategoriesCollectionFixture)),
  http.get(`${discoveryBaseUrl}/books/recommend`, () => HttpResponse.json(homeRecommendedBooksCollectionFixture)),
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