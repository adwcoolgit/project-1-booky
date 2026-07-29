import { expect, test, type Page } from "@playwright/test";

import {
  authSessionCookieName,
  createEncodedSessionCookieFixture,
  createSessionEnvelopeFixture,
  encodeSessionEnvelopeFixture,
} from "../../fixtures/auth/auth-fixtures";
import { protectedUnauthorizedToken } from "../../fixtures/auth/protected-route-fixtures";

async function setSessionCookie(page: Page, value: string) {
  await page.context().addCookies([
    {
      name: authSessionCookieName,
      value,
      url: "http://127.0.0.1:3000",
    },
  ]);
}

test("expired sessions redirect to the localized login screen with returnTo preserved", async ({ page }) => {
  await setSessionCookie(
    page,
    encodeSessionEnvelopeFixture({
      ...createSessionEnvelopeFixture("USER", "id"),
      jwt: protectedUnauthorizedToken,
    }),
  );

  await page.goto("/id");

  await expect(page).toHaveURL(/\/id\/login\?returnTo=%2Fid&reason=expired$/);
  await expect(page.getByRole("heading", { name: "Masuk" })).toBeVisible();
  await expect(page.getByText(/Sesi Anda telah berakhir/)).toBeVisible();
});

test("local logout returns to the localized home screen without keeping protected content visible", async ({ page }) => {
  await setSessionCookie(page, createEncodedSessionCookieFixture("ADMIN", "en"));

  await page.goto("/en/admin/users");
  await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();
  await page.getByRole("button", { name: "Logout" }).click();

  await expect(page).toHaveURL(/\/en$/);
  await expect(page.getByRole("heading", { name: "Recommendation" })).toBeVisible();

});

