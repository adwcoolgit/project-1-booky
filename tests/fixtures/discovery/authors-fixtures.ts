import {
  discoveryBookDtoFixture,
  discoveryRelatedBookDtoFixture,
  homeRecommendedGrowthBookDtoFixture,
  homeRecommendedHistoryBookDtoFixture,
  searchableDiscoveryBookDtosFixture,
} from "@/../tests/fixtures/discovery/books-fixtures";

const defaultAuthorBooksLimit = 2;
const authorBooksSeedThirdEntry = searchableDiscoveryBookDtosFixture.find((book) => book.id === 103);

if (!authorBooksSeedThirdEntry) {
  throw new Error("Expected deterministic author-books fixture with id 103.");
}

export const popularAuthorDtoFixture = Object.freeze({
  id: 21,
  name: "Ursula K. Le Guin",
  bio: "American novelist known for speculative fiction.",
  bookCount: 47,
});

export const secondaryAuthorDtoFixture = Object.freeze({
  id: 22,
  name: "N. K. Jemisin",
  bio: "Award-winning fantasy and science fiction author.",
  bookCount: 12,
});

export const tertiaryAuthorDtoFixture = Object.freeze({
  id: 31,
  name: "Yuval Noah Harari",
  bio: "Historian focused on broad human narratives.",
  bookCount: 9,
});

export const quaternaryAuthorDtoFixture = Object.freeze({
  id: 41,
  name: "James Clear",
  bio: "Writer on behavior change and sustainable habits.",
  bookCount: 6,
});

export const invalidAuthorDtoFixture = Object.freeze({
  id: 23,
  bio: "Missing name should be ignored by conservative mappers.",
});

const searchableAuthorFixtures = Object.freeze([
  popularAuthorDtoFixture,
  secondaryAuthorDtoFixture,
  tertiaryAuthorDtoFixture,
  quaternaryAuthorDtoFixture,
]);

const authorBooksCatalog = Object.freeze({
  21: Object.freeze({
    author: popularAuthorDtoFixture,
    books: Object.freeze([
      discoveryBookDtoFixture,
      discoveryRelatedBookDtoFixture,
      authorBooksSeedThirdEntry,
    ]),
  }),
  22: Object.freeze({
    author: secondaryAuthorDtoFixture,
    books: Object.freeze([]),
  }),
  31: Object.freeze({
    author: tertiaryAuthorDtoFixture,
    books: Object.freeze([homeRecommendedHistoryBookDtoFixture]),
  }),
  41: Object.freeze({
    author: quaternaryAuthorDtoFixture,
    books: Object.freeze([homeRecommendedGrowthBookDtoFixture]),
  }),
});

function normalizeQuery(value: string | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

export function createAuthorsCollectionFixture(options: {
  q?: string | undefined;
  limit?: number | undefined;
} = {}) {
  const query = normalizeQuery(options.q);
  const filteredAuthors = query.length === 0
    ? searchableAuthorFixtures
    : searchableAuthorFixtures.filter((author) => {
        const haystack = [author.name, author.bio].filter(Boolean).join(" ").toLowerCase();
        return haystack.includes(query);
      });
  const limit = options.limit && options.limit > 0 ? options.limit : filteredAuthors.length;

  return Object.freeze({
    authors: filteredAuthors.slice(0, limit),
  });
}

export function createAuthorBooksResponseFixture(options: {
  authorId: number;
  page?: number | undefined;
  limit?: number | undefined;
}) {
  const entry = authorBooksCatalog[options.authorId as keyof typeof authorBooksCatalog];

  if (!entry) {
    return null;
  }

  const page = options.page && options.page > 0 ? options.page : 1;
  const limit = options.limit && options.limit > 0 ? options.limit : defaultAuthorBooksLimit;
  const total = entry.books.length;
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
  const startIndex = Math.max(page - 1, 0) * limit;
  const books = entry.books.slice(startIndex, startIndex + limit);

  return Object.freeze({
    author: entry.author,
    books,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasMore: totalPages > 0 && page < totalPages,
    },
  });
}

export const homePopularAuthorsCollectionFixture = Object.freeze({
  authors: searchableAuthorFixtures,
});

export const emptyPopularAuthorsCollectionFixture = Object.freeze({
  authors: [],
});

export const popularAuthorsCollectionFixture = Object.freeze({
  authors: [popularAuthorDtoFixture, secondaryAuthorDtoFixture],
});

export const authorSearchCollectionFixture = Object.freeze({
  authors: [popularAuthorDtoFixture],
});

export const popularAuthorsPartialCollectionFixture = Object.freeze({
  data: [popularAuthorDtoFixture, invalidAuthorDtoFixture],
  meta: {
    page: 1,
    limit: 10,
    total: 2,
    totalPages: 1,
    hasMore: false,
  },
});

export const authorBooksResponseFixture = createAuthorBooksResponseFixture({
  authorId: 21,
  page: 1,
  limit: defaultAuthorBooksLimit,
})!;

export const emptyAuthorBooksResponseFixture = createAuthorBooksResponseFixture({
  authorId: 22,
  page: 1,
  limit: defaultAuthorBooksLimit,
})!;

export const paginatedAuthorBooksPageOneFixture = createAuthorBooksResponseFixture({
  authorId: 21,
  page: 1,
  limit: defaultAuthorBooksLimit,
})!;

export const paginatedAuthorBooksPageTwoFixture = createAuthorBooksResponseFixture({
  authorId: 21,
  page: 2,
  limit: defaultAuthorBooksLimit,
})!;