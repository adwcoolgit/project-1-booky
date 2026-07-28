import "server-only";

import {
  mapAuthorBooksResponseDtoToCollection,
  mapAuthorSummaryToPresentation,
  type AuthorPresentation,
} from "@/entities/author";
import {
  mapBookSummaryToPresentation,
  type BookPresentation,
} from "@/entities/book";
import { createDiscoveryApiClient, getAuthorBooks } from "@/features/discovery/api";
import { discoveryLimitDefaults } from "@/features/discovery/model/discovery-query";
import { toHttpError } from "@/shared/api/http-client";
import { runtimeConfig } from "@/shared/config/runtime";
import type { AppLocale } from "@/shared/i18n/config";
import { createAuthorBooksResponseFixture } from "@/../tests/fixtures/discovery/authors-fixtures";

export type AuthorBooksPageViewState =
  | {
      status: "ready";
      author: AuthorPresentation;
      books: BookPresentation[];
      page: number;
      limit: number;
      hasMore: boolean;
    }
  | {
      status: "empty";
      author: AuthorPresentation;
      books: [];
      page: number;
      limit: number;
      hasMore: boolean;
    }
  | {
      status: "not-found";
    }
  | {
      status: "error";
    };

export async function readAuthorBooksPageView(
  locale: AppLocale,
  authorId: number,
  limit = discoveryLimitDefaults.authorBooks,
): Promise<AuthorBooksPageViewState> {
  try {
    const payload = runtimeConfig.authE2eFixtureMode
      ? createAuthorBooksResponseFixture({ authorId, page: 1, limit })
      : await getAuthorBooks(createDiscoveryApiClient(locale), authorId, { page: 1, limit });

    if (!payload) {
      return { status: "not-found" };
    }

    const collection = mapAuthorBooksResponseDtoToCollection(payload, limit);

    if (!collection) {
      return { status: "error" };
    }

    const author = mapAuthorSummaryToPresentation(collection.author, { locale });
    const books = collection.books.map((book) => mapBookSummaryToPresentation(book, { locale }));

    if (books.length === 0) {
      return {
        status: "empty",
        author,
        books: [],
        page: collection.page,
        limit: collection.limit,
        hasMore: collection.hasMore,
      };
    }

    return {
      status: "ready",
      author,
      books,
      page: collection.page,
      limit: collection.limit,
      hasMore: collection.hasMore,
    };
  } catch (error) {
    const httpError = toHttpError(error);

    if (httpError.code === "not-found") {
      return { status: "not-found" };
    }

    return { status: "error" };
  }
}