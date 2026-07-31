import { expect, test, type Route } from "@playwright/test";

import { authSessionCookieName, createEncodedSessionCookieFixture } from "../../fixtures/auth/auth-fixtures";

const duplicateBook = {
  title: "The Left Hand of Darkness",
  availableCopies: 4,
  authorName: "Ursula K. Le Guin",
  categoryName: "Science Fiction",
};

const outOfStockBook = {
  title: "Sold Out Title",
  availableCopies: 0,
  authorName: "Some Author",
  categoryName: "History",
};

function duplicateRowsCartBody() {
  return JSON.stringify({
    items: [
      { id: 501, bookId: 101, book: duplicateBook },
      { id: 502, bookId: 101, book: duplicateBook },
      { id: 503, bookId: 201, book: outOfStockBook },
    ],
    itemCount: 3,
  });
}

async function fulfillJson(route: Route, body: string, status = 200) {
  await route.fulfill({ status, contentType: "application/json", body });
}

test("duplicate cart rows sharing one bookId are selected and removed independently, and select-all skips ineligible rows", async ({
  page,
}) => {
  await page.context().addCookies([
    {
      name: authSessionCookieName,
      value: createEncodedSessionCookieFixture("USER", "en"),
      url: "http://127.0.0.1:3000",
    },
  ]);

  await page.route("**/api/cart", async (route) => {
    if (route.request().method() === "GET") {
      await fulfillJson(route, duplicateRowsCartBody());
      return;
    }

    await route.continue();
  });

  // The server-rendered first paint is fixture-mode-driven and cannot be
  // intercepted by `page.route()` (it is a server-to-server fetch), so this
  // query param lets the test control the SSR fixture payload directly; it
  // is only ever read when `authE2eFixtureMode` is active.
  await page.goto(`/en/cart?e2eFixture=${encodeURIComponent(duplicateRowsCartBody())}`);

  const rows = page.locator('[data-cart-row="501"], [data-cart-row="502"]');

  await expect(rows).toHaveCount(2);

  const firstCheckbox = page.locator('[data-cart-row-select="501"]');
  const secondCheckbox = page.locator('[data-cart-row-select="502"]');
  const ineligibleCheckbox = page.locator('[data-cart-row-select="503"]');

  // Selecting one duplicate row must never select the other.
  await firstCheckbox.check();

  await expect(firstCheckbox).toBeChecked();
  await expect(secondCheckbox).not.toBeChecked();

  // The ineligible row cannot be selected at all.
  await expect(ineligibleCheckbox).toBeDisabled();

  // Select-all only selects the currently eligible rows.
  await page.getByRole("checkbox", { name: "Select All" }).check();

  await expect(firstCheckbox).toBeChecked();
  await expect(secondCheckbox).toBeChecked();
  await expect(ineligibleCheckbox).not.toBeChecked();

  // Removing one duplicate row must leave the other row and its selection untouched.
  await page.route("**/api/cart/items/*", async (route) => {
    if (route.request().method() === "DELETE") {
      await fulfillJson(route, JSON.stringify({ ok: true }));
      return;
    }

    await route.continue();
  });
  await page.route("**/api/cart", async (route) => {
    if (route.request().method() === "GET") {
      await fulfillJson(
        route,
        JSON.stringify({
          items: [
            { id: 502, bookId: 101, book: duplicateBook },
            { id: 503, bookId: 201, book: outOfStockBook },
          ],
          itemCount: 2,
        }),
      );
      return;
    }

    await route.continue();
  });

  await page.locator('[data-cart-row-remove="501"]').click();

  await expect(page.locator('[data-cart-row="501"]')).toHaveCount(0);
  await expect(page.locator('[data-cart-row="502"]')).toBeVisible();
  await expect(page.locator('[data-cart-row-select="502"]')).toBeChecked();
});
