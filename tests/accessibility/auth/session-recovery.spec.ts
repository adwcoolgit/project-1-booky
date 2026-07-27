import { test } from "@playwright/test";

import {
  authSessionCookieName,
  createSessionEnvelopeFixture,
  encodeSessionEnvelopeFixture,
} from "../../fixtures/auth/auth-fixtures";
import { protectedUnauthorizedToken } from "../../fixtures/auth/protected-route-fixtures";

test("expired-session login recovery screen passes focused axe checks", async ({ page }) => {
  await page.context().addCookies([
    {
      name: authSessionCookieName,
      value: encodeSessionEnvelopeFixture({
        ...createSessionEnvelopeFixture("USER", "id"),
        jwt: protectedUnauthorizedToken,
      }),
      url: "http://127.0.0.1:3000",
    },
  ]);

  await page.goto("/id");
  await page.getByRole("heading", { name: "Masuk" }).waitFor();
});
