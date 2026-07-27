import { expect, test, type Page } from "@playwright/test";

import {
  authSessionCookieName,
  createEncodedSessionCookieFixture,
} from "../../fixtures/auth/auth-fixtures";

async function setSessionCookie(page: Page, value: string) {
  await page.context().addCookies([
    {
      name: authSessionCookieName,
      value,
      url: "http://127.0.0.1:3000",
    },
  ]);
}

test("login prompt opens the localized register screen and preserves returnTo", async ({ page }) => {
  await page.goto("/en/login?returnTo=%2Fen%2Fadmin%2Fusers");
  await page.getByRole("link", { name: "Register" }).click();

  await expect(page).toHaveURL(/\/en\/register\?returnTo=%2Fen%2Fadmin%2Fusers$/);
});

test("register redirects back to the localized login screen with success feedback", async ({ page }) => {
  await page.route("**/api/auth/register", async (route) => {
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        status: "registered",
        redirectTo: "/id/login?registered=1",
      }),
    });
  });

  await page.goto("/id/register");
  await page.getByLabel("Nama", { exact: true }).fill("Booky Reader");
  await page.getByLabel("Email", { exact: true }).fill("reader@booky.test");
  await page.getByLabel("Kata sandi", { exact: true }).fill("Password123!");
  await page.getByLabel("Konfirmasi kata sandi", { exact: true }).fill("Password123!");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Kirim" }).click();

  await expect(page).toHaveURL(/\/id\/login\?registered=1$/);
  await expect(page.getByRole("status")).toHaveText(/Pendaftaran berhasil/);
});

test("user login keeps the active locale in the redirect target", async ({ page }) => {
  await page.route("**/api/auth/login", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        status: "authenticated",
        redirectTo: "/en",
        user: {
          id: 2,
          name: "Booky Reader",
          email: "reader@booky.test",
          role: "USER",
        },
      }),
    });
  });

  await page.goto("/en/login");
  await page.getByLabel("Email", { exact: true }).fill("reader@booky.test");
  await page.getByLabel("Password", { exact: true }).fill("Password123!");
  await setSessionCookie(page, createEncodedSessionCookieFixture("USER", "en"));
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL(/\/en$/);
});

test("admin credentials on the user login surface redirect to the admin locale target", async ({ page }) => {
  await page.route("**/api/auth/login", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        status: "authenticated",
        redirectTo: "/id/admin/users",
        user: {
          id: 1,
          name: "Booky Admin",
          email: "admin@booky.test",
          role: "ADMIN",
        },
      }),
    });
  });

  await page.goto("/id/login");
  await page.getByLabel("Email", { exact: true }).fill("admin@booky.test");
  await page.getByLabel("Kata sandi", { exact: true }).fill("Password123!");
  await setSessionCookie(page, createEncodedSessionCookieFixture("ADMIN", "id"));
  await page.getByRole("button", { name: "Masuk" }).click();

  await expect(page).toHaveURL(/\/id\/admin\/users$/);
});

test("admin login denies user credentials without leaving the localized admin surface", async ({ page }) => {
  await page.route("**/api/auth/login", async (route) => {
    await route.fulfill({
      status: 403,
      contentType: "application/json",
      body: JSON.stringify({
        status: "error",
        code: "surface-denied",
        message: "Akun ini tidak memiliki akses admin.",
      }),
    });
  });

  await page.goto("/id/admin/login");
  await page.getByLabel("Email", { exact: true }).fill("reader@booky.test");
  await page.getByLabel("Kata sandi", { exact: true }).fill("Password123!");
  await page.getByRole("button", { name: "Masuk sebagai admin" }).click();

  await expect(page).toHaveURL(/\/id\/admin\/login$/);
  await expect(page.getByText(/tidak memiliki akses admin/i)).toBeVisible();
});
