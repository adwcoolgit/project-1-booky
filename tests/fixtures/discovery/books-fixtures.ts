export const discoveryBookDtoFixture = Object.freeze({
  id: 101,
  title: "The Left Hand of Darkness",
  description: "A classic about politics, culture, and winter.",
  coverImage: "https://images.example.test/books/the-left-hand-of-darkness.jpg",
  rating: 4.7,
  reviewCount: 128,
  totalCopies: 12,
  availableCopies: 4,
  borrowCount: 64,
  authorId: 21,
  authorName: "Ursula K. Le Guin",
  categoryId: 7,
  categoryName: "Science Fiction",
  pageCount: 304,
});

export const discoveryRelatedBookDtoFixture = Object.freeze({
  id: 102,
  title: "A Wizard of Earthsea",
  description: "A coming-of-age fantasy novel.",
  coverImage: "https://images.example.test/books/a-wizard-of-earthsea.jpg",
  rating: 4.5,
  reviewCount: 94,
  totalCopies: 9,
  availableCopies: 2,
  borrowCount: 58,
  authorId: 21,
  authorName: "Ursula K. Le Guin",
  categoryId: 7,
  categoryName: "Science Fiction",
});

export const homeRecommendedHistoryBookDtoFixture = Object.freeze({
  id: 201,
  title: "Sapiens",
  description: "A brief history of humankind.",
  coverImage: null,
  rating: 4.8,
  reviewCount: 245,
  totalCopies: 14,
  availableCopies: 6,
  authorId: 31,
  authorName: "Yuval Noah Harari",
  categoryId: 8,
  categoryName: "History",
});

export const homeRecommendedGrowthBookDtoFixture = Object.freeze({
  id: 301,
  title: "Atomic Habits",
  description: "Practical guidance for building better routines.",
  coverImage: null,
  rating: 4.9,
  reviewCount: 302,
  totalCopies: 16,
  availableCopies: 5,
  authorId: 41,
  authorName: "James Clear",
  categoryId: 9,
  categoryName: "Personal Growth",
});

export const homeRecommendedPhilosophyBookDtoFixture = Object.freeze({
  id: 401,
  title: "Meditations",
  description: "Stoic reflections from Marcus Aurelius.",
  coverImage: null,
  rating: 4.6,
  reviewCount: 188,
  totalCopies: 10,
  availableCopies: 3,
  authorId: 51,
  authorName: "Marcus Aurelius",
  categoryId: 10,
  categoryName: "Philosophy",
});

export const discoveryInvalidBookDtoFixture = Object.freeze({
  id: 999,
  title: "Incomplete Transport Record",
  categoryId: 99,
  categoryName: "Unknown",
});

export const discoveryBooksCollectionFixture = Object.freeze({
  data: [discoveryBookDtoFixture, discoveryRelatedBookDtoFixture],
  pagination: {
    page: 1,
    limit: 12,
    total: 2,
    totalPages: 1,
    hasMore: false,
  },
});

export const homeRecommendedBooksCollectionFixture = Object.freeze({
  data: [
    {
      id: 101,
      title: "The Left Hand of Darkness",
      description: "A classic about politics, culture, and winter.",
      coverImage: null,
      rating: 4.7,
      reviewCount: 128,
      totalCopies: 12,
      availableCopies: 4,
      authorId: 21,
      authorName: "Ursula K. Le Guin",
      categoryId: 7,
      categoryName: "Science Fiction",
    },
    homeRecommendedHistoryBookDtoFixture,
    homeRecommendedGrowthBookDtoFixture,
    homeRecommendedPhilosophyBookDtoFixture,
  ],
  pagination: {
    page: 1,
    limit: 8,
    total: 4,
    totalPages: 1,
    hasMore: false,
  },
});

export const emptyHomeRecommendedBooksCollectionFixture = Object.freeze({
  data: [],
  pagination: {
    page: 1,
    limit: 8,
    total: 0,
    totalPages: 0,
    hasMore: false,
  },
});

export const discoveryBooksPartialCollectionFixture = Object.freeze({
  books: [discoveryBookDtoFixture, discoveryInvalidBookDtoFixture],
  meta: {
    page: 2,
    limit: 12,
    total: 3,
    totalPages: 2,
    hasMore: false,
  },
});

export const discoveryBookDetailEnvelopeFixture = Object.freeze({
  data: discoveryBookDtoFixture,
});

export const discoveryDirectBookDetailFixture = Object.freeze({
  ...discoveryBookDtoFixture,
});

export const searchableDiscoveryBookDtosFixture = Object.freeze([
  discoveryBookDtoFixture,
  discoveryRelatedBookDtoFixture,
  Object.freeze({
    id: 103,
    title: "The Dispossessed",
    description: "An ambivalent utopia across twin worlds.",
    coverImage: null,
    rating: 4.8,
    reviewCount: 156,
    totalCopies: 11,
    availableCopies: 5,
    borrowCount: 51,
    authorId: 21,
    authorName: "Ursula K. Le Guin",
    categoryId: 7,
    categoryName: "Science Fiction",
  }),
  homeRecommendedHistoryBookDtoFixture,
  Object.freeze({
    id: 202,
    title: "The Silk Roads",
    description: "A new history of the world through trade and empire.",
    coverImage: null,
    rating: 4.2,
    reviewCount: 119,
    totalCopies: 8,
    availableCopies: 2,
    borrowCount: 37,
    authorId: 32,
    authorName: "Peter Frankopan",
    categoryId: 8,
    categoryName: "History",
  }),
  homeRecommendedGrowthBookDtoFixture,
  Object.freeze({
    id: 302,
    title: "Deep Work",
    description: "Rules for focused success in a distracted world.",
    coverImage: null,
    rating: 4.3,
    reviewCount: 176,
    totalCopies: 7,
    availableCopies: 3,
    borrowCount: 49,
    authorId: 42,
    authorName: "Cal Newport",
    categoryId: 9,
    categoryName: "Personal Growth",
  }),
  homeRecommendedPhilosophyBookDtoFixture,
]);

function normalizeQueryText(value: string | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

function matchesQuery(book: (typeof searchableDiscoveryBookDtosFixture)[number], query: string | undefined) {
  const normalizedQuery = normalizeQueryText(query);

  if (normalizedQuery.length === 0) {
    return true;
  }

  return [book.title, book.authorName, book.categoryName].join(" ").toLowerCase().includes(normalizedQuery);
}

export function createBooksCollectionFixture(
  params: {
    q?: string | undefined;
    categoryId?: number | undefined;
    authorId?: number | undefined;
    minRating?: number | undefined;
    page?: number | undefined;
    limit?: number | undefined;
  } = {},
) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 12;
  const filteredItems = searchableDiscoveryBookDtosFixture.filter((book) => {
    if (!matchesQuery(book, params.q)) {
      return false;
    }

    if (params.categoryId !== undefined && book.categoryId !== params.categoryId) {
      return false;
    }

    if (params.authorId !== undefined && book.authorId !== params.authorId) {
      return false;
    }

    if (params.minRating !== undefined && (book.rating ?? 0) < params.minRating) {
      return false;
    }

    return true;
  });
  const total = filteredItems.length;
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
  const start = Math.max(page - 1, 0) * limit;
  const data = filteredItems.slice(start, start + limit);

  return Object.freeze({
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasMore: totalPages > 0 && page < totalPages,
    },
  });
}

export const discoverySearchBooksCollectionFixture = createBooksCollectionFixture();
export const emptyDiscoveryBooksCollectionFixture = createBooksCollectionFixture({
  q: "no-such-book",
});