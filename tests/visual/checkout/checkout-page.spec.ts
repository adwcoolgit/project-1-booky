import { expect, test } from "@playwright/test";

import { authSessionCookieName, createEncodedSessionCookieFixture } from "../../fixtures/auth/auth-fixtures";

for (const viewport of [
  { name: "mobile", width: 393, height: 852 },
  { name: "desktop", width: 1440, height: 1080 },
] as const) {
  test(`${viewport.name} checkout preview, duration/date controls, and policy agreement stay readable without overflow`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
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
    await expect(page.getByRole("button", { name: "3 days" })).toBeVisible();
    await expect(page.getByRole("checkbox", { name: "I agree to the borrowing policy." })).toBeVisible();

    const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);

    expect(hasOverflow).toBe(false);
  });
}
