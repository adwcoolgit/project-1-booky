import { expect, test, type Route } from "@playwright/test";

import { authSessionCookieName, createEncodedSessionCookieFixture } from "../../fixtures/auth/auth-fixtures";

const fullSuccessLoanBody = JSON.stringify({
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

async function fulfillJson(route: Route, body: string, status = 200) {
  await route.fulfill({ status, contentType: "application/json", body });
}

test("confirming borrowing with a full-success response reaches the success screen with due-date guidance and cart refresh", async ({
  page,
}) => {
  await page.context().addCookies([
    {
      name: authSessionCookieName,
      value: createEncodedSessionCookieFixture("USER", "en"),
      url: "http://127.0.0.1:3000",
    },
  ]);

  let cartHasItem = true;

  await page.route("**/api/cart", async (route) => {
    if (route.request().method() === "GET") {
      await fulfillJson(
        route,
        cartHasItem
          ? JSON.stringify({
              items: [
                {
                  id: 501,
                  bookId: 101,
                  book: {
                    title: "The Left Hand of Darkness",
                    availableCopies: 4,
                    authorName: "Ursula K. Le Guin",
                    categoryName: "Science Fiction",
                  },
                },
              ],
              itemCount: 1,
            })
          : JSON.stringify({ items: [], itemCount: 0 }),
      );
      return;
    }

    await route.continue();
  });
  await page.route("**/api/loans/from-cart", async (route) => {
    if (route.request().method() === "POST") {
      cartHasItem = false;
      await fulfillJson(route, fullSuccessLoanBody);
      return;
    }

    await route.continue();
  });

  await page.goto("/en/cart");
  await page.locator('[data-cart-row-select="501"]').check();
  await page.getByRole("link", { name: "Checkout" }).click();

  await expect(page).toHaveURL(/\/en\/checkout$/);

  await page.getByRole("checkbox", { name: "I agree to the borrowing policy." }).check();
  await page.getByRole("button", { name: "Confirm Borrowing" }).click();

  await expect(page).toHaveURL(/\/en\/checkout\/success$/);
  await expect(page.getByRole("heading", { name: "Borrowing Successful" })).toBeVisible();
  await expect(page.getByText("Return by 5 August 2026.")).toBeVisible();
  await expect(page.getByText("The Left Hand of Darkness")).toBeVisible();

  const borrowedListLink = page.getByRole("link", { name: "Borrowed List" });

  await expect(borrowedListLink).toBeVisible();
  await expect(borrowedListLink).toHaveAttribute("href", "/en/borrowed");

  // Cart state must reflect the borrowed-and-removed item on return, per
  // research.md #11 (no stale, already-borrowed rows). Client-side
  // navigation (not `page.goto`) is required here: a full navigation would
  // discard the in-memory QueryClient cache that the mutation just
  // invalidated and fall back to the server's fixture-mode SSR default.
  await page.getByRole("link", { name: "Cart" }).click();
  await expect(page.getByRole("heading", { name: "Your cart is empty" })).toBeVisible();
});

test("visiting the success screen directly without a just-completed confirmation redirects back to checkout", async ({
  page,
}) => {
  await page.context().addCookies([
    {
      name: authSessionCookieName,
      value: createEncodedSessionCookieFixture("USER", "en"),
      url: "http://127.0.0.1:3000",
    },
  ]);

  await page.goto("/en/checkout/success");

  await expect(page).toHaveURL(/\/en\/(checkout|cart)$/);
});
