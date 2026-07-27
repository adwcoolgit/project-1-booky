import { expect, test } from "@playwright/test";

const authRoutes = [
  { route: "/en/login", title: "Login" },
  { route: "/id/login", title: "Masuk" },
  { route: "/en/register", title: "Register" },
  { route: "/id/register", title: "Daftar" },
  { route: "/en/admin/login", title: "Admin Login" },
  { route: "/id/admin/login", title: "Masuk Admin" },
] as const;

for (const viewport of [
  { name: "mobile", width: 393, height: 852 },
  { name: "desktop", width: 1440, height: 1080 },
] as const) {
  for (const authRoute of authRoutes) {
    test(`${viewport.name} ${authRoute.route} renders without horizontal overflow`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(authRoute.route);

      const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(hasOverflow).toBe(false);
      await expect(page.getByRole("heading", { name: authRoute.title })).toBeVisible();
    });
  }
}
