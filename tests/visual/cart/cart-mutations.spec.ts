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

async function fulfillJson(route: Route, body: unknown, status = 200) {
  await route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
}

for (const viewport of [
  { name: "mobile", width: 393, height: 852 },
  { name: "desktop", width: 1440, height: 1080 },
] as const) {
  test(`${viewport.name} cart row stays readable without overflow while a mutation is pending or has failed`, async ({
    page,
  }) => {
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
        await fulfillJson(route, { items: [cartRow], itemCount: 1 });
        return;
      }

      await route.continue();
    });
    await page.route("**/api/cart/items/*", async (route) => {
      if (route.request().method() === "DELETE") {
        await fulfillJson(route, "Item not found", 404);
        return;
      }

      await route.continue();
    });

    await page.goto("/en/cart");
    await expect(page.getByText("The Left Hand of Darkness")).toBeVisible();

    await page.getByRole("button", { name: "Remove" }).click();
    await expect(page.getByText("This item could not be removed. Try again.")).toBeVisible();

    const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);

    expect(hasOverflow).toBe(false);
  });
}
