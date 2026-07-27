import { expect, test, type Page } from "@playwright/test";

import {
  authSessionCookieName,
  createEncodedSessionCookieFixture,
} from "../../fixtures/auth/auth-fixtures";

async function setSessionCookie(page: Page, role: "USER" | "ADMIN", locale: "en" | "id") {
  await page.context().addCookies([
    {
      name: authSessionCookieName,
      value: createEncodedSessionCookieFixture(role, locale),
      url: "http://127.0.0.1:3000",
    },
  ]);
}

test("guest access to protected admin routes preserves locale and sanitized returnTo", async ({ page }) => {
  await page.goto("/id/admin/users?page=2");

  await expect(page).toHaveURL(/\/id\/admin\/login\?returnTo=%2Fid%2Fadmin%2Fusers%3Fpage%3D2$/);
});

test("USER sessions reach the localized forbidden route instead of admin content", async ({ page }) => {
  await setSessionCookie(page, "USER", "en");
  await page.goto("/en/admin/users");

  await expect(page).toHaveURL(/\/en\/forbidden$/);
  await expect(page.getByRole("heading", { name: "This page is not available for your role" })).toBeVisible();
});

test("ADMIN sessions redirect away from guest auth screens without losing query or hash", async ({ page }) => {
  await setSessionCookie(page, "ADMIN", "id");
  await page.goto("/id/login?returnTo=%2Fid%2Fadmin%2Fusers%3Fpage%3D2%23summary");

  await expect(page).toHaveURL(/\/id\/admin\/users\?page=2#summary$/);
});
