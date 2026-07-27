import { expect, test } from "@playwright/test";
import { checkA11y, injectAxe } from "axe-playwright";

test("foundation public shell exposes skip link and passes axe checks", async ({ page }) => {
  await page.goto("/en/foundation/public");
  await injectAxe(page);

  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeVisible();
  await checkA11y(page, undefined, {
    detailedReport: true,
    detailedReportOptions: {
      html: true,
    },
  });
});

test("foundation admin shell keeps locale switcher accessible in Indonesian", async ({ page }) => {
  await page.goto("/id/foundation/admin");
  await injectAxe(page);

  await expect(page.locator('[data-locale-flag="en"]').first()).toBeVisible();
  await expect(page.locator('[data-locale-flag="id"]').first()).toBeVisible();
  await expect(page.locator('[data-locale-label="en"]').first()).not.toBeVisible();
  await expect(page.locator('[data-locale-label="id"]').first()).not.toBeVisible();
  await expect(page.getByRole("link", { name: "English" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Bahasa Indonesia" }).first()).toHaveAttribute("aria-current", "page");
  await checkA11y(page);
});