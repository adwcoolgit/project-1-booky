import { expect, test, type Page, type Route } from "@playwright/test";
import { checkA11y, injectAxe } from "axe-playwright";

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

async function addUserSession(page: Page) {
  await page.context().addCookies([
    {
      name: authSessionCookieName,
      value: createEncodedSessionCookieFixture("USER", "en"),
      url: "http://127.0.0.1:3000",
    },
  ]);
}

test("checkout page with the confirm-borrowing button in a pending state passes axe checks", async ({ page }) => {
  await addUserSession(page);

  await page.route("**/api/loans/from-cart", async (route) => {
    if (route.request().method() === "POST") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await fulfillJson(route, fullSuccessLoanBody);
      return;
    }

    await route.continue();
  });

  await page.goto("/en/cart");
  await page.locator('[data-cart-row-select="501"]').check();
  await page.getByRole("link", { name: "Checkout" }).click();

  await expect(page).toHaveURL(/\/en\/checkout$/);

  await page.getByRole("checkbox", { name: "I agree to return the book(s) before the due date." }).check();
  await page.getByRole("checkbox", { name: "I agree to the borrowing policy." }).check();
  await page.getByRole("button", { name: "Confirm Borrowing" }).click();

  await expect(page.getByRole("button", { name: "Confirming..." })).toBeDisabled();

  await injectAxe(page);
  await checkA11y(page, undefined, { detailedReport: true, detailedReportOptions: { html: true } });
});

test("checkout success screen passes axe checks", async ({ page }) => {
  await addUserSession(page);

  await page.route("**/api/loans/from-cart", async (route) => {
    if (route.request().method() === "POST") {
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

  await expect(page).toHaveURL(/\/en\/checkout\/success$/);
  await expect(page.getByRole("heading", { name: "Borrowing Successful" })).toBeVisible();
  // The client-side navigation resolves before Next.js finishes streaming
  // the new segment's <title>, which otherwise races axe's document-title
  // check.
  await page.waitForFunction(() => document.title.length > 0);

  await injectAxe(page);
  await checkA11y(page, undefined, { detailedReport: true, detailedReportOptions: { html: true } });
});
