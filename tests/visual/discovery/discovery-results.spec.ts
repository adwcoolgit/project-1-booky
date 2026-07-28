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
    route: "/en/books?q=the&categoryId=7&minRating=4&limit=1&page=2",
    title: "Search, filter, and bookmark the next shelf you want to revisit.",
  },
  {
    locale: "id",
    route: "/id/categories/science-fiction-7?minRating=4&limit=1&page=2",
    title: "Science Fiction",
  },
] as const;

for (const viewport of [
  { name: "mobile", width: 393, height: 852 },
  { name: "desktop", width: 1440, height: 1080 },
] as const) {
  for (const entry of routes) {
    test(`${viewport.name} ${entry.route} keeps discovery results readable without horizontal overflow`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await setUserSession(page, entry.locale);
      await page.goto(entry.route);
      await expect(page.getByRole("heading", { name: entry.title })).toBeVisible();

      const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(hasOverflow).toBe(false);
      await expect(page.locator('[data-discovery-search-form="true"]')).toBeVisible();
      await expect(page.locator('[data-discovery-criteria="true"]')).toBeVisible();
      await expect(page.locator('[data-book-card="true"]').first()).toBeVisible();
    });
  }
}