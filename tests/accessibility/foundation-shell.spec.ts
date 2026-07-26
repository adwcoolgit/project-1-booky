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

  await expect(page.getByRole("button", { name: "English" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Bahasa Indonesia" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await checkA11y(page);
});
