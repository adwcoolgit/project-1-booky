import { expect, test, type Page } from "@playwright/test";

import {
  authSessionCookieName,
  createEncodedSessionCookieFixture,
} from "../../fixtures/auth/auth-fixtures";

async function setUserSession(page: Page, locale: "en" | "id") {
  await page.context().addCookies([
    {
      name: authSessionCookieName,
      value: createEncodedSessionCookieFixture("USER", locale),
      url: "http://127.0.0.1:3000",
    },
  ]);
}

const expectations = {
  en: {
    title: "Welcome to Booky",
    categories: "Categories",
    recommendations: "Recommendation",
    popularAuthors: "Popular Authors",
    profile: "Profile",
    borrowedList: "Borrowed List",
    reviews: "Reviews",
    logoutLabel: "Logout",
    loadMore: "Load More",
    exhausted: "All recommendations loaded",
  },
  id: {
    title: "Selamat datang di Booky",
    categories: "Kategori",
    recommendations: "Rekomendasi untuk Anda",
    popularAuthors: "Penulis Populer",
    profile: "Profil",
    borrowedList: "Daftar Peminjaman",
    reviews: "Ulasan",
    logoutLabel: "Keluar",
    loadMore: "Muat lebih banyak",
    exhausted: "Semua rekomendasi sudah dimuat",
  },
} as const;

for (const locale of ["en", "id"] as const) {
  test(`${locale} authenticated home renders prefetched discovery sections`, async ({ page }) => {
    await setUserSession(page, locale);
    await page.goto(`/${locale}`);

    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.getByRole("region", { name: expectations[locale].title })).toBeVisible();
    await expect(page.getByRole("heading", { name: expectations[locale].categories })).toBeVisible();
    await expect(page.getByRole("heading", { name: expectations[locale].recommendations })).toBeVisible();
    await expect(page.getByRole("heading", { name: expectations[locale].popularAuthors })).toBeVisible();
    await expect(page.locator('[data-home-hero-slide="true"]')).toHaveCount(3);
    await expect(page.locator('[data-home-hero-dot="true"]')).toHaveCount(3);
    await expect(page.locator('[data-home-header-bag="true"]')).toBeVisible();
    await expect(page.locator('[data-home-header-profile="true"]')).toBeVisible();
    await expect(page.locator('[data-home-header-profile-chevron="true"]')).toBeVisible();
    await expect(page.locator('[data-category-card="true"]:visible')).toHaveCount(4);
    await expect(page.locator('[data-book-card="true"]')).toHaveCount(8);
    await expect(page.locator('[data-author-card="true"]')).toHaveCount(4);
    await expect(page.getByRole("button", { name: expectations[locale].loadMore })).toBeVisible();
    await expect(page.getByRole("link", { name: "Science Fiction" })).toHaveAttribute(
      "href",
      `/${locale}/categories/science-fiction-7`,
    );
    await expect(page.getByRole("link", { name: "The Left Hand of Darkness" })).toHaveAttribute(
      "href",
      `/${locale}/books/101`,
    );
  });
}

for (const locale of ["en", "id"] as const) {
  test(`${locale} authenticated home opens the profile popup menu on demand`, async ({ page }) => {
    await setUserSession(page, locale);
    await page.goto(`/${locale}`);

    await expect(page.locator('[data-home-header-profile-menu="true"]')).toHaveCount(0);

    await page.locator('[data-home-header-profile-trigger="true"]').click();

    await expect(page.locator('[data-home-header-profile-menu="true"]')).toBeVisible();
    await expect(page.getByRole("link", { name: expectations[locale].profile })).toBeVisible();
    await expect(page.getByRole("link", { name: expectations[locale].borrowedList })).toBeVisible();
    await expect(page.getByRole("link", { name: expectations[locale].reviews })).toBeVisible();
    await expect(page.getByRole("button", { name: expectations[locale].logoutLabel })).toBeVisible();
  });
}

test("locale switching preserves the authenticated home route", async ({ page }) => {
  await setUserSession(page, "en");
  await page.goto("/en");

  await page.getByRole("link", { name: "Bahasa Indonesia" }).click();

  await expect(page).toHaveURL(/\/id$/);
  await expect(page.getByRole("region", { name: "Selamat datang di Booky" })).toBeVisible();
});

test("authenticated home carousel lets readers switch hero slides manually", async ({ page }) => {
  await setUserSession(page, "en");
  await page.goto("/en");

  await expect(page.locator('[data-home-hero-slide-active="true"]')).toHaveCount(1);
  await expect(page.locator('[data-home-hero-dot-active="true"]')).toHaveCount(1);

  const thirdDot = page.locator('[data-home-hero-dot="true"]').nth(2);
  const thirdSlide = page.locator('[data-home-hero-slide="true"]').nth(2);

  await thirdDot.click();

  await expect(thirdDot).toHaveAttribute("aria-pressed", "true");
  await expect(thirdDot).toHaveAttribute("data-home-hero-dot-active", "true");
  await expect(thirdSlide).toHaveAttribute("data-home-hero-slide-active", "true");
});

test("authenticated home loads the next recommendation batch without leaving the page", async ({ page }) => {
  await setUserSession(page, "en");
  await page.goto("/en");

  await expect(page.locator('[data-book-card="true"]')).toHaveCount(8);

  await page.getByRole("button", { name: expectations.en.loadMore }).click();

  await expect(page.locator('[data-book-card="true"]')).toHaveCount(11);
  await expect(page.getByRole("link", { name: "Mindset" })).toBeVisible();
  await expect(page.getByRole("button", { name: expectations.en.exhausted })).toBeVisible();
});

test("authenticated home hides the standalone logout button on desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await setUserSession(page, "en");
  await page.goto("/en");

  await expect(page.getByRole("button", { name: "Logout" })).toBeHidden();
});

test("authenticated home uses the configured Quicksand font stack", async ({ page }) => {
  await setUserSession(page, "en");
  await page.goto("/en");

  await expect.poll(async () => {
    return page.locator("body").evaluate((element) => getComputedStyle(element).fontFamily);
  }).toMatch(/quicksand/i);

  await expect.poll(async () => {
    return page.locator("h2").first().evaluate((element) => getComputedStyle(element).fontFamily);
  }).toMatch(/quicksand/i);
});
