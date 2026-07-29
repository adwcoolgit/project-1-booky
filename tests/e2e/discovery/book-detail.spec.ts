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

test("book detail shows supported metadata, review load-more, and related books", async ({ page }) => {
  await setUserSession(page, "en");
  await page.goto("/en/books/101");

  await expect(page.getByRole("heading", { level: 1, name: "The Left Hand of Darkness" })).toBeVisible();
  await expect(page.locator('[data-book-detail-hero="true"]')).toBeVisible();
  await expect(page.locator('[data-book-review-item="true"]')).toHaveCount(2);
  await expect(page.locator('[data-related-books-grid="true"] [data-book-card="true"]')).toHaveCount(2);
  await expect(page.locator("text=304")).toHaveCount(0);

  await page.getByRole("button", { name: "Load more reviews" }).click();

  await expect(page.getByText("Lina")).toBeVisible();
  await expect(page.getByRole("button", { name: "All reviews loaded" })).toBeVisible();
});

test("book detail route keeps invalid IDs distinct from localized not-found states", async ({ page }) => {
  await setUserSession(page, "id");
  await page.goto("/id/books/0");

  await expect(page.getByRole("heading", { level: 1, name: "Tautan buku ini tidak valid" })).toBeVisible();
  await expect(page.locator('[data-book-route-state="invalidId"]')).toBeVisible();

  await page.goto("/id/books/999");

  await expect(page.getByRole("heading", { level: 1, name: "Buku ini tidak ditemukan" })).toBeVisible();
  await expect(page.locator('[data-book-route-state="notFound"]')).toBeVisible();
});
