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

const expectations = {
  en: {
    pageTitle: "My Cart",
    bookTitle: "The Left Hand of Darkness",
  },
  id: {
    pageTitle: "Keranjang Saya",
    bookTitle: "The Left Hand of Darkness",
  },
} as const;

for (const locale of ["en", "id"] as const) {
  test(`${locale} authenticated cart page renders prefetched cart contents and badge`, async ({ page }) => {
    await setUserSession(page, locale);
    await page.goto(`/${locale}/cart`);

    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.getByRole("heading", { name: expectations[locale].pageTitle })).toBeVisible();
    await expect(page.getByText(expectations[locale].bookTitle)).toBeVisible();
    await expect(page.locator('[data-home-header-bag="true"]')).toBeVisible();
    await expect(page.locator('[data-cart-row-list="true"]')).toBeVisible();
    await expect(page.locator('[data-cart-row]')).toHaveCount(1);
  });

  test(`${locale} cart badge is visible and links to the cart page from other authenticated pages`, async ({ page }) => {
    await setUserSession(page, locale);
    await page.goto(`/${locale}`);

    const cartLink = page.locator('[data-home-header-bag="true"] a');

    await expect(cartLink).toBeVisible();
    await expect(cartLink).toHaveAttribute("href", `/${locale}/cart`);
  });
}
