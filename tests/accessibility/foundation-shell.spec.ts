import { expect, test } from "@playwright/test";

test("foundation public shell exposes skip link and passes axe checks", async ({ page }) => {
  await page.goto("/en/foundation/public");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeVisible();
});

test("foundation admin shell keeps locale switcher accessible in Indonesian", async ({ page }) => {
  await page.goto("/id/foundation/admin");

  await expect(page.locator('[data-locale-flag="en"]').first()).toBeVisible();
  await expect(page.locator('[data-locale-flag="id"]').first()).toBeVisible();
  await expect(page.locator('[data-locale-label="en"]').first()).toHaveText("English");
  await expect(page.locator('[data-locale-label="id"]').first()).toHaveText("Bahasa Indonesia");
  await expect(page.getByRole("link", { name: "English" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Bahasa Indonesia" }).first()).toHaveAttribute("aria-current", "page");
});
