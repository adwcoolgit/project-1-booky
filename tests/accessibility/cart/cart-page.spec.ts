import { expect, test } from "@playwright/test";
import { checkA11y, injectAxe } from "axe-playwright";

import { authSessionCookieName, createEncodedSessionCookieFixture } from "../../fixtures/auth/auth-fixtures";

test("authenticated cart page keeps skip navigation accessible and passes axe checks", async ({ page }) => {
  await page.context().addCookies([
    {
      name: authSessionCookieName,
      value: createEncodedSessionCookieFixture("USER", "id"),
      url: "http://127.0.0.1:3000",
    },
  ]);

  await page.goto("/id/cart");
  await page.keyboard.press("Tab");

  await expect(page.locator("html")).toHaveAttribute("lang", "id");
  await expect(page.locator('nav[aria-label="Skip links"] a').first()).toBeVisible();
  await injectAxe(page);

  await checkA11y(page, undefined, {
    detailedReport: true,
    detailedReportOptions: {
      html: true,
    },
  });
});
