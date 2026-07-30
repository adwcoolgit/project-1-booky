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
  borrowCount: 73,
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
  borrowCount: 91,
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
  borrowCount: 55,
  authorId: 51,
  authorName: "Marcus Aurelius",
  categoryId: 10,
  categoryName: "Philosophy",
});

const homeRecommendedPrimaryBookDtoFixture = Object.freeze({
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
});

const recommendedDispossessedBookDtoFixture = Object.freeze({
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
});

const recommendedSilkRoadsBookDtoFixture = Object.freeze({
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
});

const recommendedDeepWorkBookDtoFixture = Object.freeze({
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
});

const recommendedForestBookDtoFixture = Object.freeze({
  id: 104,
  title: "The Word for World Is Forest",
  description: "An ecological conflict on a distant planet.",
  coverImage: null,
  rating: 4.1,
  reviewCount: 87,
  totalCopies: 6,
  availableCopies: 2,
  borrowCount: 28,
  authorId: 21,
  authorName: "Ursula K. Le Guin",
  categoryId: 7,
  categoryName: "Science Fiction",
});

const recommendedGunsGermsSteelBookDtoFixture = Object.freeze({
  id: 203,
  title: "Guns, Germs, and Steel",
  description: "A broad study of geography, power, and societies.",
  coverImage: null,
  rating: 4.0,
  reviewCount: 132,
  totalCopies: 9,
  availableCopies: 4,
  borrowCount: 34,
  authorId: 33,
  authorName: "Jared Diamond",
  categoryId: 8,
  categoryName: "History",
});

const recommendedMindsetBookDtoFixture = Object.freeze({
  id: 303,
  title: "Mindset",
  description: "A book about growth mindset and learning.",
  coverImage: null,
  rating: 3.9,
  reviewCount: 164,
  totalCopies: 10,
  availableCopies: 4,
  borrowCount: 31,
  authorId: 43,
  authorName: "Carol Dweck",
  categoryId: 9,
  categoryName: "Personal Growth",
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
    homeRecommendedPrimaryBookDtoFixture,
    homeRecommendedHistoryBookDtoFixture,
    homeRecommendedGrowthBookDtoFixture,
    homeRecommendedPhilosophyBookDtoFixture,
    discoveryRelatedBookDtoFixture,
    recommendedDispossessedBookDtoFixture,
    recommendedSilkRoadsBookDtoFixture,
    recommendedDeepWorkBookDtoFixture,
  ],
  pagination: {
    page: 1,
    limit: 8,
    total: 11,
    totalPages: 2,
    hasMore: true,
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
  recommendedDispossessedBookDtoFixture,
  homeRecommendedHistoryBookDtoFixture,
  recommendedSilkRoadsBookDtoFixture,
  homeRecommendedGrowthBookDtoFixture,
  recommendedDeepWorkBookDtoFixture,
  homeRecommendedPhilosophyBookDtoFixture,
  recommendedForestBookDtoFixture,
  recommendedGunsGermsSteelBookDtoFixture,
  recommendedMindsetBookDtoFixture,
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

function paginateBooks(
  books: readonly (typeof searchableDiscoveryBookDtosFixture)[number][],
  page: number,
  limit: number,
) {
  const total = books.length;
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
  const start = Math.max(page - 1, 0) * limit;
  const data = books.slice(start, start + limit);

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

  return paginateBooks(filteredItems, page, limit);
}

export function createRecommendedBooksCollectionFixture(
  params: {
    categoryId?: number | undefined;
    page?: number | undefined;
    limit?: number | undefined;
  } = {},
) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 8;
  const filteredItems = searchableDiscoveryBookDtosFixture
    .filter((book) => (params.categoryId === undefined ? true : book.categoryId === params.categoryId))
    .slice()
    .sort((left, right) => {
      const ratingDelta = (right.rating ?? 0) - (left.rating ?? 0);

      if (ratingDelta !== 0) {
        return ratingDelta;
      }

      return (right.reviewCount ?? 0) - (left.reviewCount ?? 0);
    });

  return paginateBooks(filteredItems, page, limit);
}

export function createBookDetailResponseFixture(
  params: {
    bookId: number;
    variant?: "envelope" | "direct";
  },
) {
  const variant = params.variant ?? "envelope";
  const match = searchableDiscoveryBookDtosFixture.find((book) => book.id === params.bookId);

  if (!match) {
    return null;
  }

  if (variant === "direct") {
    return Object.freeze({ ...match });
  }

  return Object.freeze({
    data: { ...match },
  });
}

export const discoverySearchBooksCollectionFixture = createBooksCollectionFixture();
export const emptyDiscoveryBooksCollectionFixture = createBooksCollectionFixture({
  q: "no-such-book",
});
export const relatedScienceFictionBooksCollectionFixture = createRecommendedBooksCollectionFixture({
  categoryId: 7,
  limit: 4,
});