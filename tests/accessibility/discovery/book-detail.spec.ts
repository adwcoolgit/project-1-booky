import { expect, test } from "@playwright/test";
import { checkA11y, injectAxe } from "axe-playwright";

import {
  authSessionCookieName,
  createEncodedSessionCookieFixture,
} from "../../fixtures/auth/auth-fixtures";

test("book detail route remains accessible in the ready state", async ({ page }) => {
  await page.context().addCookies([
    {
      name: authSessionCookieName,
      value: createEncodedSessionCookieFixture("USER", "en"),
      url: "http://127.0.0.1:3000",
    },
  ]);

  await page.goto("/en/books/101");

  await expect(page.getByRole("heading", { level: 1, name: "The Left Hand of Darkness" })).toBeVisible();
  await expect(page.locator('[data-book-detail-hero="true"]')).toBeVisible();
  await injectAxe(page);
  await checkA11y(page, undefined, {
    detailedReport: true,
    detailedReportOptions: {
      html: true,
    },
  });
});

test("book detail invalid-id state remains accessible", async ({ page }) => {
  await page.context().addCookies([
    {
      name: authSessionCookieName,
      value: createEncodedSessionCookieFixture("USER", "id"),
      url: "http://127.0.0.1:3000",
    },
  ]);

  await page.goto("/id/books/0");

  await expect(page.getByRole("heading", { level: 1, name: "Tautan buku ini tidak valid" })).toBeVisible();
  await injectAxe(page);
  await checkA11y(page, undefined, {
    detailedReport: true,
    detailedReportOptions: {
      html: true,
    },
  });
});
