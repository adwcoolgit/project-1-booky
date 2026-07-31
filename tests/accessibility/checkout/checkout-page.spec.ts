import { expect, test } from "@playwright/test";
import { checkA11y, injectAxe } from "axe-playwright";

import { authSessionCookieName, createEncodedSessionCookieFixture } from "../../fixtures/auth/auth-fixtures";

test("checkout review page with duration, borrow-date, and policy controls passes axe checks", async ({ page }) => {
  await page.context().addCookies([
    {
      name: authSessionCookieName,
      value: createEncodedSessionCookieFixture("USER", "en"),
      url: "http://127.0.0.1:3000",
    },
  ]);

  await page.goto("/en/cart");
  await page.locator('[data-cart-row-select="501"]').check();
  await page.getByRole("link", { name: "Checkout" }).click();

  await expect(page).toHaveURL(/\/en\/checkout$/);
  await expect(page.getByText("The Left Hand of Darkness")).toBeVisible();

  await injectAxe(page);
  await checkA11y(page, undefined, { detailedReport: true, detailedReportOptions: { html: true } });
});
