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
  test(`${viewport.name} author page stays readable across the author summary and book grid`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await setUserSession(page, "en");
    await page.goto("/en/authors/21");

    const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(hasOverflow).toBe(false);
    await expect(page.locator('[data-author-summary="true"]')).toBeVisible();
    await expect(page.locator('[data-author-books-grid="true"]')).toBeVisible();
  });
}

test("mobile invalid author route keeps the localized state readable", async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await setUserSession(page, "id");
  await page.goto("/id/authors/0");

  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(hasOverflow).toBe(false);
  await expect(page.locator('[data-author-route-state="invalidId"]')).toBeVisible();
});