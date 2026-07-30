import { expect, test } from "@playwright/test";
import { checkA11y, injectAxe } from "axe-playwright";

import {
  authSessionCookieName,
  createEncodedSessionCookieFixture,
} from "../../fixtures/auth/auth-fixtures";

test("popular authors on the authenticated home route remain accessible", async ({ page }) => {
  await page.context().addCookies([
    {
      name: authSessionCookieName,
      value: createEncodedSessionCookieFixture("USER", "en"),
      url: "http://127.0.0.1:3000",
    },
  ]);

  await page.goto("/en");

  await expect(page.getByRole("heading", { name: "Popular Authors" })).toBeVisible();
  await expect(page.locator('[data-author-card="true"]').first()).toBeVisible();
  await injectAxe(page);

  await checkA11y(page, undefined, {
    detailedReport: true,
    detailedReportOptions: {
      html: true,
    },
  });
});