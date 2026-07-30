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

test("bookmarkable book search keeps filters across refresh and navigation", async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await setUserSession(page, "en");
  await page.goto("/en/books?limit=1");

  await page.locator("#discovery-search-input").fill("  the  ");
  await expect(page).toHaveURL("/en/books?q=the&limit=1");

  await page.locator('[data-discovery-category-option="7"]').click();
  await expect(page).toHaveURL("/en/books?q=the&categoryId=7&limit=1");

  await page.locator('[data-discovery-rating-option="4"]').click();
  await expect(page).toHaveURL("/en/books?q=the&categoryId=7&minRating=4&limit=1");

  const books = page.locator('[data-book-card="true"]');
  await expect(books).toHaveCount(1);
  await page.getByRole("button", { name: /load more/i }).click();
  await expect(books).toHaveCount(2);
  await expect(page).toHaveURL("/en/books?q=the&categoryId=7&minRating=4&limit=1");

  await page.reload();

  await expect(page.locator("#discovery-search-input")).toHaveValue("the");
  await expect(page.getByLabel("Science Fiction")).toBeChecked();
  await expect(page.getByLabel("Minimum rating: 4")).toBeChecked();

  await page.goto("/en");
  await page.goBack();
  await expect(page).toHaveURL("/en/books?q=the&categoryId=7&minRating=4&limit=1");
});

test("category routes preserve active filters without URL-based pagination", async ({ page }) => {
  await setUserSession(page, "id");
  await page.goto("/id/categories/science-fiction-7?limit=1");

  await page.locator('[data-discovery-rating-option="4"]').click();
  await expect(page).toHaveURL("/id/categories/science-fiction-7?minRating=4&limit=1");

  const books = page.locator('[data-book-card="true"]');
  await expect(books).toHaveCount(1);
  await page.getByRole("button", { name: /muat|load more/i }).click();
  await expect(books).toHaveCount(2);
  await expect(page).toHaveURL("/id/categories/science-fiction-7?minRating=4&limit=1");

  await page.reload();

  await expect(page.getByLabel("Rating minimum: 4")).toBeChecked();
  await expect(page.locator('[data-discovery-search-form="true"]')).toBeVisible();

  await page.goto("/id");
  await page.goBack();
  await expect(page).toHaveURL("/id/categories/science-fiction-7?minRating=4&limit=1");
});
