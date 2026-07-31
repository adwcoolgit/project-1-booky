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

test("rapid repeated activation of confirm-borrowing sends exactly one loan request", async ({ page }) => {
  await page.context().addCookies([
    {
      name: authSessionCookieName,
      value: createEncodedSessionCookieFixture("USER", "en"),
      url: "http://127.0.0.1:3000",
    },
  ]);

  let requestCount = 0;

  await page.route("**/api/loans/from-cart", async (route) => {
    if (route.request().method() === "POST") {
      requestCount += 1;
      await new Promise((resolve) => setTimeout(resolve, 600));
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

  // A stable attribute selector is used instead of role+name because the
  // button's accessible name changes to the pending label after the first
  // click, which would make a role/name locator stop matching mid-test.
  const confirmButton = page.locator('[data-checkout-confirm="true"]');

  await confirmButton.click();

  // The button flips to its pending label and becomes disabled. Playwright's
  // normal (non-forced) `click()` waits for the target to become actionable
  // (which requires it to be enabled) before dispatching anything, so these
  // activations correctly time out rather than reach the handler — proving
  // the browser itself never delivers a click to a disabled control.
  // `force: true` would defeat this assertion by bypassing that check.
  await expect(confirmButton).toBeDisabled();
  await confirmButton.click({ timeout: 200 }).catch(() => {});
  await confirmButton.click({ timeout: 200 }).catch(() => {});

  await expect(page).toHaveURL(/\/en\/checkout\/success$/);
  expect(requestCount).toBe(1);
});
