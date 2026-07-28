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

const routes = [
  {
    locale: "en",
    route: "/en",
    title: "Welcome to Booky",
  },
  {
    locale: "id",
    route: "/id",
    title: "Selamat datang di Booky",
  },
] as const;

for (const viewport of [
  { name: "mobile", width: 393, height: 852 },
  { name: "desktop", width: 1440, height: 1080 },
] as const) {
  for (const entry of routes) {
    test(`${viewport.name} ${entry.route} keeps home discovery readable without horizontal overflow`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await setUserSession(page, entry.locale);
      await page.goto(entry.route);

      const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(hasOverflow).toBe(false);
      await expect(page.getByRole("region", { name: entry.title })).toBeVisible();
      await expect(page.locator('[data-home-hero="true"]')).toBeVisible();
      await expect(page.locator('[data-category-card="true"]').first()).toBeVisible();
      await expect(page.locator('[data-book-card="true"]').first()).toBeVisible();
    });
  }
}