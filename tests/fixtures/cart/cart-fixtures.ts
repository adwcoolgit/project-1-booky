export const cartBookAvailableFixture = Object.freeze({
  title: "The Left Hand of Darkness",
  coverImage: "https://images.example.test/books/the-left-hand-of-darkness.jpg",
  availableCopies: 4,
  authorName: "Ursula K. Le Guin",
  categoryName: "Science Fiction",
});

export const cartBookOutOfStockFixture = Object.freeze({
  title: "Out of Stock Title",
  coverImage: null,
  availableCopies: 0,
  authorName: "Some Author",
  categoryName: "History",
});

export const cartItemEligibleFixture = Object.freeze({
  id: 501,
  bookId: 101,
  book: cartBookAvailableFixture,
});

export const cartItemDuplicateFixture = Object.freeze({
  id: 502,
  bookId: 101,
  book: cartBookAvailableFixture,
});

export const cartItemUnavailableFixture = Object.freeze({
  id: 503,
  bookId: 201,
  book: cartBookOutOfStockFixture,
});

export const cartItemStaleFixture = Object.freeze({
  id: 504,
  bookId: 301,
  book: null,
});

export function createEmptyCartFixture() {
  return Object.freeze({ items: [], itemCount: 0 });
}

export function createSingleItemCartFixture() {
  return Object.freeze({ items: [cartItemEligibleFixture], itemCount: 1 });
}

export function createDuplicateBookCartFixture() {
  return Object.freeze({
    items: [cartItemEligibleFixture, cartItemDuplicateFixture],
    itemCount: 2,
  });
}

export function createMixedEligibilityCartFixture() {
  return Object.freeze({
    items: [cartItemEligibleFixture, cartItemUnavailableFixture, cartItemStaleFixture],
    itemCount: 3,
  });
}
