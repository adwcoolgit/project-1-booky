import { expect, test, type Route } from "@playwright/test";

import { authSessionCookieName, createEncodedSessionCookieFixture } from "../../fixtures/auth/auth-fixtures";

function mixedEligibilityCartBody() {
  return JSON.stringify({
    items: [
      {
        id: 501,
        bookId: 101,
        book: {
          title: "The Left Hand of Darkness",
          availableCopies: 4,
          authorName: "Ursula K. Le Guin",
          categoryName: "Science Fiction",
        },
      },
      {
        id: 503,
        bookId: 201,
        book: {
          title: "Sold Out Title",
          availableCopies: 0,
          authorName: "Some Author",
          categoryName: "History",
        },
      },
    ],
    itemCount: 2,
  });
}

async function fulfillJson(route: Route, body: string, status = 200) {
  await route.fulfill({ status, contentType: "application/json", body });
}

for (const viewport of [
  { name: "mobile", width: 393, height: 852 },
  { name: "desktop", width: 1440, height: 1080 },
] as const) {
  test(`${viewport.name} cart selection controls and ineligible-row messaging stay readable without overflow`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.context().addCookies([
      {
        name: authSessionCookieName,
        value: createEncodedSessionCookieFixture("USER", "en"),
        url: "http://127.0.0.1:3000",
      },
    ]);

    await page.route("**/api/cart", async (route) => {
      if (route.request().method() === "GET") {
        await fulfillJson(route, mixedEligibilityCartBody());
        return;
      }

      await route.continue();
    });

    // The server-rendered first paint is fixture-mode-driven and cannot be
    // intercepted by `page.route()` (it is a server-to-server fetch), so this
    // query param lets the test control the SSR fixture payload directly; it
    // is only ever read when `authE2eFixtureMode` is active.
    await page.goto(`/en/cart?e2eFixture=${encodeURIComponent(mixedEligibilityCartBody())}`);

    await expect(page.getByRole("checkbox", { name: "Select All" })).toBeVisible();
    await expect(page.getByText("This book is no longer available to borrow.")).toBeVisible();

    const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);

    expect(hasOverflow).toBe(false);
  });
}
