import { test } from "@playwright/test";
import { checkA11y, injectAxe } from "axe-playwright";

import {
  authSessionCookieName,
  createEncodedSessionCookieFixture,
} from "../../fixtures/auth/auth-fixtures";

test("localized forbidden route passes focused axe checks", async ({ page }) => {
  await page.context().addCookies([
    {
      name: authSessionCookieName,
      value: createEncodedSessionCookieFixture("USER", "id"),
      url: "http://127.0.0.1:3000",
    },
  ]);

  await page.goto("/id/forbidden");
  await injectAxe(page);

  await checkA11y(page, undefined, {
    detailedReport: true,
    detailedReportOptions: {
      html: true,
    },
  });
});
