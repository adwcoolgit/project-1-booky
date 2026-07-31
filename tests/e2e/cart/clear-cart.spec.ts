import { expect, test, type Route } from "@playwright/test";

import { authSessionCookieName, createEncodedSessionCookieFixture } from "../../fixtures/auth/auth-fixtures";

const cartRow = {
  id: 501,
  bookId: 101,
  book: {
    title: "The Left Hand of Darkness",
    availableCopies: 4,
    authorName: "Ursula K. Le Guin",
    categoryName: "Science Fiction",
  },
};

function emptyCartBody() {
  return JSON.stringify({ items: [], itemCount: 0 });
}

function populatedCartBody() {
  return JSON.stringify({ items: [cartRow], itemCount: 1 });
}

async function fulfillJson(route: Route, body: string, status = 200) {
  await route.fulfill({ status, contentType: "application/json", body });
}

test("clearing the cart shows the empty state without a manual page refresh", async ({ page }) => {
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
      await fulfillJson(route, cartHasItem ? populatedCartBody() : emptyCartBody());
      return;
    }

    if (route.request().method() === "DELETE") {
      cartHasItem = false;
      await fulfillJson(route, JSON.stringify({ ok: true }));
      return;
    }

    await route.continue();
  });

  await page.goto("/en/cart");

  await expect(page.getByText("The Left Hand of Darkness")).toBeVisible();

  await page.getByRole("button", { name: "Clear cart" }).click();

  await expect(page.getByRole("heading", { name: "Your cart is empty" })).toBeVisible();
  await expect(page.getByText("The Left Hand of Darkness")).toHaveCount(0);
});
