import { expect, test, type Page, type Route } from "@playwright/test";

import { authSessionCookieName, createEncodedSessionCookieFixture } from "../../fixtures/auth/auth-fixtures";

async function setUserSession(page: Page) {
  await page.context().addCookies([
    {
      name: authSessionCookieName,
      value: createEncodedSessionCookieFixture("USER", "en"),
      url: "http://127.0.0.1:3000",
    },
  ]);
}

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

test("removing a cart row updates the cart without a manual page refresh", async ({ page }) => {
  await setUserSession(page);

  let cartHasItem = true;

  await page.route("**/api/cart", async (route) => {
    if (route.request().method() === "GET") {
      await fulfillJson(route, cartHasItem ? populatedCartBody() : emptyCartBody());
      return;
    }

    await route.continue();
  });
  await page.route("**/api/cart/items/*", async (route) => {
    if (route.request().method() === "DELETE") {
      cartHasItem = false;
      await fulfillJson(route, JSON.stringify({ ok: true }));
      return;
    }

    await route.continue();
  });

  await page.goto("/en/cart");

  await expect(page.getByText("The Left Hand of Darkness")).toBeVisible();

  await page.getByRole("button", { name: "Remove" }).click();

  await expect(page.getByRole("heading", { name: "Your cart is empty" })).toBeVisible();
});

test("add-to-cart shows a pending state and then a success confirmation", async ({ page }) => {
  await setUserSession(page);

  await page.route("**/api/cart", async (route) => {
    if (route.request().method() === "GET") {
      await fulfillJson(route, emptyCartBody());
      return;
    }

    await route.continue();
  });
  await page.route("**/api/cart/items", async (route) => {
    if (route.request().method() === "POST") {
      await new Promise((resolve) => setTimeout(resolve, 200));
      await fulfillJson(route, JSON.stringify({ ok: true }));
      return;
    }

    await route.continue();
  });

  await page.goto("/en/books/101");

  const addButton = page.getByRole("button", { name: "Add to Cart" });

  await addButton.click();

  await expect(page.getByRole("button", { name: "Adding..." })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Added to cart" })).toBeVisible();
});
