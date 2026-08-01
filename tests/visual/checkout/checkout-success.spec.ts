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

for (const viewport of [
  { name: "mobile", width: 393, height: 852 },
  { name: "desktop", width: 1440, height: 1080 },
] as const) {
  test(`${viewport.name} checkout confirm-pending state and success screen stay readable without overflow`, async ({
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

    await page.route("**/api/loans/from-cart", async (route) => {
      if (route.request().method() === "POST") {
        await new Promise((resolve) => setTimeout(resolve, 300));
        await fulfillJson(route, fullSuccessLoanBody);
        return;
      }

      await route.continue();
    });

    await page.goto("/en/cart");
    await page.locator('[data-cart-row-select="501"]').check();
    await page.getByRole("link", { name: "Checkout" }).click();
    await page.getByRole("checkbox", { name: "I agree to return the book(s) before the due date." }).check();
    await page.getByRole("checkbox", { name: "I agree to the borrowing policy." }).check();
    await page.getByRole("button", { name: "Confirm Borrowing" }).click();

    await expect(page.getByRole("button", { name: "Confirming..." })).toBeDisabled();

    let hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);

    expect(hasOverflow).toBe(false);

    await expect(page).toHaveURL(/\/en\/checkout\/success$/);
    await expect(page.getByRole("heading", { name: "Borrowing Successful" })).toBeVisible();

    hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);

    expect(hasOverflow).toBe(false);
  });
}
