import { expect, test, type Route } from "@playwright/test";
import { checkA11y, injectAxe } from "axe-playwright";

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

test("cart page remains accessible while a remove mutation is pending and after it fails", async ({ page }) => {
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
      await new Promise((resolve) => setTimeout(resolve, 150));
      await fulfillJson(route, "Item not found", 404);
      return;
    }

    await route.continue();
  });

  await page.goto("/en/cart");
  await expect(page.getByText("The Left Hand of Darkness")).toBeVisible();

  await page.getByRole("button", { name: "Remove" }).click();
  await expect(page.getByRole("button", { name: "Remove" })).toBeDisabled();

  await injectAxe(page);
  await checkA11y(page, undefined, { detailedReport: true, detailedReportOptions: { html: true } });

  await expect(page.getByText("This item could not be removed. Try again.")).toBeVisible();
  await injectAxe(page);
  await checkA11y(page, undefined, { detailedReport: true, detailedReportOptions: { html: true } });
});
