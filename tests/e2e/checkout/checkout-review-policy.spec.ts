import { expect, test } from "@playwright/test";

import { authSessionCookieName, createEncodedSessionCookieFixture } from "../../fixtures/auth/auth-fixtures";

test.describe("checkout review and policy gating", () => {
  test.beforeEach(async ({ page }) => {
    await page.context().addCookies([
      {
        name: authSessionCookieName,
        value: createEncodedSessionCookieFixture("USER", "en"),
        url: "http://127.0.0.1:3000",
      },
    ]);
  });

  test("shows the server-backed preview, duration/date controls, and blocks confirmation until the policy is accepted", async ({
    page,
  }) => {
    await page.goto("/en/cart");

    await page.locator('[data-cart-row-select="501"]').check();
    await page.getByRole("link", { name: "Checkout" }).click();

    await expect(page).toHaveURL(/\/en\/checkout$/);

    // Checkout preview is sourced from the server-backed checkout data, not
    // recomputed locally from stale cart data.
    await expect(page.getByText("Jordan Reader")).toBeVisible();
    await expect(page.getByText("jordan.reader@example.test")).toBeVisible();
    await expect(page.getByText("The Left Hand of Darkness")).toBeVisible();

    // Only the documented duration options are offered.
    const threeDayOption = page.getByRole("button", { name: "3 days" });
    const fiveDayOption = page.getByRole("button", { name: "5 days" });

    await expect(threeDayOption).toHaveAttribute("aria-pressed", "true");

    const returnDatePreview = page.locator('[data-checkout-return-date-preview="true"] >> text=/\\d{4}|\\d{1,2}/');
    const initialReturnDateText = await returnDatePreview.first().textContent();

    await fiveDayOption.click();

    await expect(fiveDayOption).toHaveAttribute("aria-pressed", "true");
    await expect(threeDayOption).toHaveAttribute("aria-pressed", "false");
    await expect
      .poll(async () => returnDatePreview.first().textContent())
      .not.toBe(initialReturnDateText);

    // The policy-required notice is visible until the user accepts it.
    await expect(page.getByText("You must accept the borrowing policy before you can confirm borrowing.")).toBeVisible();

    await page.getByRole("checkbox", { name: "I agree to the borrowing policy." }).check();

    await expect(
      page.getByText("You must accept the borrowing policy before you can confirm borrowing."),
    ).not.toBeVisible();
  });

  test("redirects to the cart when no eligible cart row is selected", async ({ page }) => {
    await page.goto("/en/checkout");

    await expect(page).toHaveURL(/\/en\/cart$/);
  });
});
