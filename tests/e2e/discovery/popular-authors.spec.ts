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

const expectations = {
  en: {
    heading: "Popular Authors",
  },
  id: {
    heading: "Penulis Populer",
  },
} as const;

for (const locale of ["en", "id"] as const) {
  test(`${locale} home renders popular-author cards with localized route targets`, async ({ page }) => {
    await setUserSession(page, locale);
    await page.goto(`/${locale}`);

    await expect(page.getByRole("heading", { name: expectations[locale].heading })).toBeVisible();
    await expect(page.locator('[data-author-card="true"]')).toHaveCount(4);
    await expect(page.getByRole("link", { name: "Ursula K. Le Guin" })).toHaveAttribute(
      "href",
      `/${locale}/authors/21`,
    );
  });
}