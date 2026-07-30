import { test } from "@playwright/test";
import { checkA11y, injectAxe } from "axe-playwright";

for (const route of ["/en/login", "/id/register", "/en/admin/login"] as const) {
  test(`${route} passes focused axe checks`, async ({ page }) => {
    await page.goto(route);
    await injectAxe(page);

    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    });
  });
}

