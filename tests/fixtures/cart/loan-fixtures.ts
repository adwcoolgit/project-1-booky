export function createFullSuccessLoanFixture() {
  return Object.freeze({
    loans: [
      {
        cartItemId: 501,
        bookTitle: "The Left Hand of Darkness",
        borrowedAt: "2026-07-31T10:00:00.000Z",
        dueAt: "2026-08-05T10:00:00.000Z",
        returnByMessage: "Return by 5 August 2026.",
      },
    ],
    failed: [],
    removedFromCart: [501],
  });
}

export function createPartialSuccessLoanFixture() {
  return Object.freeze({
    loans: [
      {
        cartItemId: 501,
        bookTitle: "The Left Hand of Darkness",
        borrowedAt: "2026-07-31T10:00:00.000Z",
        dueAt: "2026-08-05T10:00:00.000Z",
        returnByMessage: "Return by 5 August 2026.",
      },
    ],
    failed: [
      {
        cartItemId: 503,
        reasonCode: "out-of-stock",
      },
    ],
    removedFromCart: [501],
  });
}

export function createFullFailureLoanFixture() {
  return Object.freeze({
    loans: [],
    failed: [
      { cartItemId: 503, reasonCode: "out-of-stock" },
      { cartItemId: 504, reasonCode: "not-found" },
    ],
    removedFromCart: [],
  });
}
