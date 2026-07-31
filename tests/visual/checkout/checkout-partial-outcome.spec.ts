import { expect, test, type Route } from "@playwright/test";

import { authSessionCookieName, createEncodedSessionCookieFixture } from "../../fixtures/auth/auth-fixtures";

const eligibleBook = {
  title: "The Left Hand of Darkness",
  availableCopies: 4,
  authorName: "Ursula K. Le Guin",
  categoryName: "Science Fiction",
};

const secondBook = {
  title: "Sold Out Title",
  availableCopies: 4,
  authorName: "Some Author",
  categoryName: "History",
};

const twoRowCartItems = [
  { id: 501, bookId: 101, book: eligibleBook },
  { id: 503, bookId: 201, book: secondBook },
];

function twoRowCartBody() {
  return JSON.stringify({ items: twoRowCartItems, itemCount: 2 });
}

async function fulfillJson(route: Route, body: string, status = 200) {
  await route.fulfill({ status, contentType: "application/json", body });
}

for (const viewport of [
  { name: "mobile", width: 393, height: 852 },
  { name: "desktop", width: 1440, height: 1080 },
] as const) {
  test(`${viewport.name} partial-outcome and full-failure panels stay readable without overflow`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.context().addCookies([
      {
        name: authSessionCookieName,
        value: createEncodedSessionCookieFixture("USER", "en"),
        url: "http://127.0.0.1:3000",
      },
    ]);

    await page.route("**/api/cart", async (route) => {
      if (route.request().method() === "GET") {
        await fulfillJson(route, twoRowCartBody());
        return;
      }

      await route.continue();
    });
    await page.route("**/api/cart/checkout", async (route) => {
      if (route.request().method() === "GET") {
        await fulfillJson(
          route,
          JSON.stringify({ user: { name: "Jordan Reader" }, items: twoRowCartItems, itemCount: 2 }),
        );
        return;
      }

      await route.continue();
    });
    await page.route("**/api/loans/from-cart", async (route) => {
      if (route.request().method() === "POST") {
        await fulfillJson(
          route,
          JSON.stringify({
            loans: [{ cartItemId: 501, bookTitle: "The Left Hand of Darkness", dueAt: "2026-08-05T10:00:00.000Z" }],
            failed: [{ cartItemId: 503, reasonCode: "out-of-stock" }],
            removedFromCart: [501],
          }),
        );
        return;
      }

      await route.continue();
    });

    await page.goto(`/en/cart?e2eFixture=${encodeURIComponent(twoRowCartBody())}`);
    await page.locator('[data-cart-row-select="501"]').check();
    await page.locator('[data-cart-row-select="503"]').check();
    await page.getByRole("link", { name: "Checkout" }).click();
    await page.getByRole("checkbox", { name: "I agree to the borrowing policy." }).check();
    await page.getByRole("button", { name: "Confirm Borrowing" }).click();

    await expect(page.getByRole("heading", { name: "Some books could not be borrowed" })).toBeVisible();

    const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);

    expect(hasOverflow).toBe(false);
  });
}
