import { expect, test, type Page } from "@playwright/test";

import { authSessionCookieName, createEncodedSessionCookieFixture } from "../../fixtures/auth/auth-fixtures";

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
  { locale: "en", route: "/en/cart", title: "My Cart" },
  { locale: "id", route: "/id/cart", title: "Keranjang Saya" },
] as const;

for (const viewport of [
  { name: "mobile", width: 393, height: 852 },
  { name: "desktop", width: 1440, height: 1080 },
] as const) {
  for (const entry of routes) {
    test(`${viewport.name} ${entry.route} keeps the cart page readable without horizontal overflow`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await setUserSession(page, entry.locale);
      await page.goto(entry.route);

      const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);

      expect(hasOverflow).toBe(false);
      await expect(page.getByRole("heading", { name: entry.title })).toBeVisible();
      await expect(page.locator('[data-cart-row-list="true"]')).toBeVisible();

      // The sidebar summary card only renders at `lg:` and up; below that,
      // a fixed floating bar takes its place (mirroring the book detail
      // page's mobile add-to-cart bar).
      if (viewport.name === "desktop") {
        await expect(page.locator('[data-cart-summary="true"]')).toBeVisible();
      } else {
        await expect(page.locator('[data-cart-floating-summary="true"]')).toBeVisible();
      }
    });
  }
}
