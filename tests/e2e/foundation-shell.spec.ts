import { expect, test } from "@playwright/test";

const expectations = {
  en: {
    public: { title: "Public foundation shell", badge: "User-facing shell" },
    user: { title: "Reader foundation shell", badge: "User-facing shell" },
    admin: { title: "Admin foundation shell", badge: "Admin-facing shell" },
  },
  id: {
    public: { title: "Shell fondasi publik", badge: "Shell user-facing" },
    user: { title: "Shell fondasi pembaca", badge: "Shell user-facing" },
    admin: { title: "Shell fondasi admin", badge: "Shell admin-facing" },
  },
} as const;

for (const locale of ["en", "id"] as const) {
  for (const area of ["public", "user", "admin"] as const) {
    test(`${locale} ${area} foundation route renders the expected shell`, async ({ page }) => {
      await page.goto(`/${locale}/foundation/${area}`);

      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.getByRole("heading", { name: expectations[locale][area].title })).toBeVisible();
      await expect(page.getByText(expectations[locale][area].badge, { exact: true })).toBeVisible();
      await expect(page).toHaveURL(new RegExp(`/${locale}/foundation/${area}$`));
    });
  }
}

test("locale switching preserves the current placeholder route", async ({ page }) => {
  await page.goto("/en/foundation/user");
  await page.getByRole("button", { name: "Bahasa Indonesia" }).click();

  await expect(page).toHaveURL(/\/id\/foundation\/user$/);
  await expect(page.getByRole("heading", { name: "Shell fondasi pembaca" })).toBeVisible();
});
