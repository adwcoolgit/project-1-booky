import { expect, test, type Page } from "@playwright/test";

function getFoundationBadge(page: Page, badge: string) {
  return page.locator("#main-content section").first().locator("span").filter({ hasText: badge }).first();
}

test("loading boundary preserves the public shell hierarchy", async ({ page }) => {
  const navigation = page.goto("/en/foundation/public?boundary=loading", { waitUntil: "commit" });

  await expect(getFoundationBadge(page, "User-facing shell")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Preparing foundation shell" })).toBeVisible();

  await navigation;
});

test("error boundary preserves the admin shell hierarchy with recovery actions", async ({ page }) => {
  await page.goto("/id/foundation/admin?boundary=error");

  await expect(getFoundationBadge(page, "Shell admin-facing")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Tampilan fondasi ini tidak dapat dirender" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Buka placeholder publik" })).toHaveAttribute(
    "href",
    "/id/foundation/public",
  );
});

test("localized not-found boundary preserves shell hierarchy on a foundation route", async ({ page }) => {
  await page.goto("/id/foundation/user?boundary=not-found");

  await expect(getFoundationBadge(page, "Shell user-facing")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Halaman fondasi ini tidak tersedia" })).toBeVisible();
});

test("unsupported locale routes render controlled not-found without redirect", async ({ page }) => {
  await page.goto("/fr/foundation/public");

  await expect(page).toHaveURL(/\/fr\/foundation\/public$/);
  await expect(page.getByRole("heading", { name: "This foundation page is unavailable" })).toBeVisible();
});
