import { expect, test } from "@playwright/test";

const shellRoutes = [
  { route: "/en/foundation/public", title: "Public foundation shell" },
  { route: "/id/foundation/public", title: "Shell fondasi publik" },
  { route: "/en/foundation/admin", title: "Admin foundation shell" },
  { route: "/id/foundation/admin", title: "Shell fondasi admin" },
] as const;

const boundaryRoutes = [
  { route: "/id/foundation/user?boundary=not-found", title: "Halaman fondasi ini tidak tersedia" },
  { route: "/id/foundation/admin?boundary=error", title: "Tampilan fondasi ini tidak dapat dirender" },
] as const;

for (const viewport of [
  { name: "mobile", width: 393, height: 852 },
  { name: "desktop", width: 1440, height: 1080 },
] as const) {
  for (const shell of shellRoutes) {
    test(`${viewport.name} ${shell.route} has no horizontal overflow`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(shell.route);

      const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(hasOverflow).toBe(false);
      await expect(page.getByRole("heading", { name: shell.title })).toBeVisible();
    });
  }

  for (const boundary of boundaryRoutes) {
    test(`${viewport.name} ${boundary.route} keeps boundary content readable without overflow`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(boundary.route);

      const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(hasOverflow).toBe(false);
      await expect(page.getByRole("heading", { name: boundary.title })).toBeVisible();
    });
  }
}
