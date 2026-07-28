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
  await setUserSession(page, "en");
  await page.goto("/en/books?limit=1");

  await page.getByLabel("Search books").fill("  the  ");
  await page.getByLabel("Category").selectOption("7");
  await page.getByLabel("Minimum rating").selectOption("4");
  await page.getByRole("button", { name: "Apply" }).click();

  await expect(page).toHaveURL("/en/books?q=the&categoryId=7&minRating=4&limit=1");
  await page.getByRole("link", { name: "Next" }).click();
  await expect(page).toHaveURL("/en/books?q=the&categoryId=7&minRating=4&page=2&limit=1");

  await page.reload();

  await expect(page.getByLabel("Search books")).toHaveValue("the");
  await expect(page.getByLabel("Category")).toHaveValue("7");
  await expect(page.getByLabel("Minimum rating")).toHaveValue("4");
  await expect(page.locator('[data-discovery-criteria="true"]')).toContainText("Page");
  await expect(page.locator('[data-discovery-criteria="true"]')).toContainText("2");

  await page.goto("/en");
  await page.goBack();
  await expect(page).toHaveURL("/en/books?q=the&categoryId=7&minRating=4&page=2&limit=1");
});

test("category routes preserve normalized min-rating and page state", async ({ page }) => {
  await setUserSession(page, "id");
  await page.goto("/id/categories/science-fiction-7?limit=1");

  await page.getByLabel("Rating minimum").selectOption("4");
  await page.getByRole("button", { name: "Terapkan" }).click();

  await expect(page).toHaveURL("/id/categories/science-fiction-7?minRating=4&limit=1");
  await page.getByRole("link", { name: "Berikutnya" }).click();
  await expect(page).toHaveURL("/id/categories/science-fiction-7?minRating=4&page=2&limit=1");

  await page.reload();

  await expect(page.getByLabel("Rating minimum")).toHaveValue("4");
  await expect(page.locator('[data-discovery-criteria="true"]')).toContainText("Kategori");
  await expect(page.locator('[data-discovery-criteria="true"]')).toContainText("Science Fiction");
  await expect(page.locator('[data-discovery-criteria="true"]')).toContainText("Halaman");

  await page.goto("/id");
  await page.goBack();
  await expect(page).toHaveURL("/id/categories/science-fiction-7?minRating=4&page=2&limit=1");
});