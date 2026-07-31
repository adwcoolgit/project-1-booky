import { expect, test, type Route } from "@playwright/test";

import { authSessionCookieName, createEncodedSessionCookieFixture } from "../../fixtures/auth/auth-fixtures";

const eligibleBook = {
  title: "The Left Hand of Darkness",
  availableCopies: 4,
  authorName: "Ursula K. Le Guin",
  categoryName: "Science Fiction",
};

const soldOutBook = {
  title: "Sold Out Title",
  availableCopies: 4,
  authorName: "Some Author",
  categoryName: "History",
};

const twoRowCartItems = [
  { id: 501, bookId: 101, book: eligibleBook },
  { id: 503, bookId: 201, book: soldOutBook },
];

const afterConfirmationCartItems = [{ id: 503, bookId: 201, book: soldOutBook }];

function twoRowCartBody() {
  return JSON.stringify({ items: twoRowCartItems, itemCount: 2 });
}

function afterConfirmationCartBody() {
  return JSON.stringify({ items: afterConfirmationCartItems, itemCount: 1 });
}

const partialSuccessLoanBody = JSON.stringify({
  loans: [
    {
      cartItemId: 501,
      bookTitle: "The Left Hand of Darkness",
      borrowedAt: "2026-07-31T10:00:00.000Z",
      dueAt: "2026-08-05T10:00:00.000Z",
      returnByMessage: "Return by 5 August 2026.",
    },
  ],
  failed: [{ cartItemId: 503, reasonCode: "out-of-stock" }],
  removedFromCart: [501],
});

async function fulfillJson(route: Route, body: string, status = 200) {
  await route.fulfill({ status, contentType: "application/json", body });
}

test("a partial-success confirmation shows succeeded, failed, and removed groups distinctly, and keeps the failed item retryable", async ({
  page,
}) => {
  await page.context().addCookies([
    {
      name: authSessionCookieName,
      value: createEncodedSessionCookieFixture("USER", "en"),
      url: "http://127.0.0.1:3000",
    },
  ]);

  let confirmed = false;

  await page.route("**/api/cart", async (route) => {
    if (route.request().method() === "GET") {
      await fulfillJson(route, confirmed ? afterConfirmationCartBody() : twoRowCartBody());
      return;
    }

    await route.continue();
  });
  await page.route("**/api/cart/checkout", async (route) => {
    if (route.request().method() === "GET") {
      const body = confirmed
        ? { user: { name: "Jordan Reader" }, items: afterConfirmationCartItems, itemCount: 1 }
        : { user: { name: "Jordan Reader" }, items: twoRowCartItems, itemCount: 2 };

      await fulfillJson(route, JSON.stringify(body));
      return;
    }

    await route.continue();
  });
  await page.route("**/api/loans/from-cart", async (route) => {
    if (route.request().method() === "POST") {
      confirmed = true;
      await fulfillJson(route, partialSuccessLoanBody);
      return;
    }

    await route.continue();
  });

  // The server-rendered first paint is fixture-mode-driven and cannot be
  // intercepted by `page.route()` (it is a server-to-server fetch), so this
  // query param lets the test control the SSR fixture payload directly; it
  // is only ever read when `authE2eFixtureMode` is active.
  await page.goto(`/en/cart?e2eFixture=${encodeURIComponent(twoRowCartBody())}`);
  await page.locator('[data-cart-row-select="501"]').check();
  await page.locator('[data-cart-row-select="503"]').check();
  await page.getByRole("link", { name: "Checkout" }).click();

  await expect(page).toHaveURL(/\/en\/checkout$/);

  await page.getByRole("checkbox", { name: "I agree to the borrowing policy." }).check();
  await page.getByRole("button", { name: "Confirm Borrowing" }).click();

  // Confirmation resolves without navigating away: the outcome stays on
  // /checkout so the failed item remains visible/actionable.
  await expect(page).toHaveURL(/\/en\/checkout$/);
  await expect(page.getByRole("heading", { name: "Some books could not be borrowed" })).toBeVisible();
  await expect(page.getByText("The Left Hand of Darkness")).toBeVisible();
  await expect(page.getByText("out-of-stock")).toBeVisible();

  const previewRows = page.locator('[data-checkout-preview-rows="true"]');

  await expect(previewRows.getByText("Sold Out Title")).toBeVisible();
  await expect(previewRows.getByText("The Left Hand of Darkness")).toHaveCount(0);

  // The removed row (501) is dropped from selection, the failed row (503)
  // remains selected, so a retry is available without re-selecting anything.
  await expect(page.getByRole("button", { name: "Confirm Borrowing" })).toBeEnabled();

  // Returning to the cart shows the removed item gone and the failed item
  // still present for the user to retry or reconsider.
  await page.getByRole("link", { name: "Cart" }).click();
  await expect(page.getByText("Sold Out Title")).toBeVisible();
  await expect(page.getByText("The Left Hand of Darkness")).toHaveCount(0);
});
