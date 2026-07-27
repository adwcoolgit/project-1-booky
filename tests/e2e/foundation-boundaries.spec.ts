import { expect, test } from "@playwright/test";

test("loading boundary preserves the public shell hierarchy", async ({ page }) => {
  const navigation = page.goto("/en/foundation/public?boundary=loading", { waitUntil: "commit" });

  await expect(page.getByText("User-facing shell", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Preparing foundation shell" })).toBeVisible();

  await navigation;
});

test("error boundary preserves the admin shell hierarchy with recovery actions", async ({ page }) => {
  await page.goto("/id/foundation/admin?boundary=error");

  await expect(page.getByText("Shell admin-facing", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Tampilan fondasi ini tidak dapat dirender" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Buka placeholder publik" })).toHaveAttribute(
    "href",
    "/id/foundation/public",
  );
});

test("localized not-found boundary preserves shell hierarchy on a foundation route", async ({ page }) => {
  await page.goto("/id/foundation/user?boundary=not-found");

  await expect(page.getByText("Shell user-facing", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Halaman fondasi ini tidak tersedia" })).toBeVisible();
});

test("unsupported locale routes render controlled not-found without redirect", async ({ page }) => {
  await page.goto("/fr/foundation/public");

  await expect(page).toHaveURL(/\/fr\/foundation\/public$/);
  await expect(page.getByRole("heading", { name: "This foundation page is unavailable" })).toBeVisible();
});
