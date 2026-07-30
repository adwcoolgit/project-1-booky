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

test("author page keeps the summary stable while load-more appends books", async ({ page }) => {
  await setUserSession(page, "en");
  await page.goto("/en/authors/21");

  await expect(page.getByRole("heading", { level: 1, name: "Ursula K. Le Guin" })).toBeVisible();
  await expect(page.locator('[data-author-summary="true"]')).toBeVisible();
  await expect(page.locator('[data-book-card="true"]')).toHaveCount(2);

  await page.getByRole("button", { name: "Load more books" }).click();

  await expect(page.getByRole("link", { name: "The Dispossessed" })).toBeVisible();
  await expect(page.locator('[data-book-card="true"]')).toHaveCount(3);
  await expect(page.locator('[data-author-summary="true"]')).toBeVisible();
});

test("author route keeps invalid IDs distinct from localized not-found states", async ({ page }) => {
  await setUserSession(page, "id");
  await page.goto("/id/authors/0");

  await expect(page.getByRole("heading", { level: 1, name: "Tautan penulis ini tidak valid" })).toBeVisible();
  await expect(page.locator('[data-author-route-state="invalidId"]')).toBeVisible();

  await page.goto("/id/authors/999");

  await expect(page.getByRole("heading", { level: 1, name: "Penulis ini tidak ditemukan" })).toBeVisible();
  await expect(page.locator('[data-author-route-state="notFound"]')).toBeVisible();
});