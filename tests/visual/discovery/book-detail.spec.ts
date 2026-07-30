import { expect, test, type Page } from "@playwright/test";

import {
  authSessionCookieName,
  createEncodedSessionCookieFixture,
} from "../../fixtures/auth/auth-fixtures";

async function setUserSession(page: Page, locale: "en" | "id") {
  await page.context().addCookies([
    {
      name: authSessionCookieName,
      value: createEncodedSessionCookieFixture("USER", locale),
      url: "http://127.0.0.1:3000",
    },
  ]);
}

for (const viewport of [
  { name: "mobile", width: 393, height: 852 },
  { name: "desktop", width: 1440, height: 1080 },
] as const) {
  test(`${viewport.name} book detail stays readable across hero, reviews, and related books`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await setUserSession(page, "en");
    await page.goto("/en/books/101");

    const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(hasOverflow).toBe(false);
    await expect(page.locator('[data-book-detail-hero="true"]')).toBeVisible();
    await expect(page.locator('[data-book-review-list="true"]')).toBeVisible();
    await expect(page.locator('[data-related-books-section="true"]')).toBeVisible();
  });
}

test("mobile invalid book route keeps the localized state readable", async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await setUserSession(page, "id");
  await page.goto("/id/books/0");

  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(hasOverflow).toBe(false);
  await expect(page.locator('[data-book-route-state="invalidId"]')).toBeVisible();
});
