import { expect, test } from "@playwright/test";
import { checkA11y, injectAxe } from "axe-playwright";

import {
  authSessionCookieName,
  createEncodedSessionCookieFixture,
} from "../../fixtures/auth/auth-fixtures";

test("author books route remains accessible in the ready state", async ({ page }) => {
  await page.context().addCookies([
    {
      name: authSessionCookieName,
      value: createEncodedSessionCookieFixture("USER", "en"),
      url: "http://127.0.0.1:3000",
    },
  ]);

  await page.goto("/en/authors/21");

  await expect(page.getByRole("heading", { level: 1, name: "Ursula K. Le Guin" })).toBeVisible();
  await expect(page.locator('[data-author-books-section="true"]')).toBeVisible();
  await injectAxe(page);
  await checkA11y(page, undefined, {
    detailedReport: true,
    detailedReportOptions: {
      html: true,
    },
  });
});

test("author invalid-id state remains accessible", async ({ page }) => {
  await page.context().addCookies([
    {
      name: authSessionCookieName,
      value: createEncodedSessionCookieFixture("USER", "id"),
      url: "http://127.0.0.1:3000",
    },
  ]);

  await page.goto("/id/authors/0");

  await expect(page.getByRole("heading", { level: 1, name: "Tautan penulis ini tidak valid" })).toBeVisible();
  await injectAxe(page);
  await checkA11y(page, undefined, {
    detailedReport: true,
    detailedReportOptions: {
      html: true,
    },
  });
});