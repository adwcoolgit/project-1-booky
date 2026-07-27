import { expect, test } from "@playwright/test";
import { checkA11y, injectAxe } from "axe-playwright";

test("localized admin error boundary passes axe checks", async ({ page }) => {
  await page.goto("/id/foundation/admin?boundary=error");
  await expect(page.getByRole("heading", { name: "Tampilan fondasi ini tidak dapat dirender" })).toBeVisible();
  await injectAxe(page);

  await expect(page.getByRole("link", { name: "Buka placeholder publik" })).toBeVisible();
  await checkA11y(page);
});

test("localized user not-found boundary passes axe checks", async ({ page }) => {
  await page.goto("/id/foundation/user?boundary=not-found");
  await expect(page.getByRole("heading", { name: "Halaman fondasi ini tidak tersedia" })).toBeVisible();
  await injectAxe(page);

  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Lewati ke konten utama" })).toBeVisible();
  await checkA11y(page);
});
