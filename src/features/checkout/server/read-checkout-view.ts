import "server-only";

import { redirect } from "next/navigation";

import { mapCartCheckoutResponseDtoToPreview, mapCheckoutPreviewToPresentation } from "@/entities/checkout";
import type { CheckoutPreviewPresentation } from "@/entities/checkout";
import { loadCartCheckoutFixture } from "@/features/checkout/testing/checkout-fixtures.server";
import { executeProtectedServerRequest } from "@/shared/api/server/authenticated-client";
import { resolveProtectedRequestFailure } from "@/shared/auth/guards";
import { runtimeConfig } from "@/shared/config/runtime";
import type { AppLocale } from "@/shared/i18n/config";

export type CheckoutViewState = { status: "error" } | { status: "ready"; preview: CheckoutPreviewPresentation };

async function readProtectedCheckoutPayload({
  locale,
  currentPath,
}: {
  locale: AppLocale;
  currentPath: string;
}): Promise<unknown> {
  const result = await executeProtectedServerRequest(
    (client) => client.get("/cart/checkout").then((response): unknown => response.data),
    locale,
  );

  if (result.status === "success") {
    return result.data;
  }

  const failure = resolveProtectedRequestFailure({
    error: result.error,
    pathname: currentPath,
    locale,
    returnTo: currentPath,
    loginSurface: "user",
  });

  if (failure.redirectPath) {
    redirect(failure.redirectPath);
  }

  throw result.error;
}

function resolveFixturePayload(e2eFixtureOverride: string | string[] | undefined): unknown {
  const rawOverride = Array.isArray(e2eFixtureOverride) ? e2eFixtureOverride[0] : e2eFixtureOverride;

  if (!rawOverride) {
    return undefined;
  }

  try {
    return JSON.parse(rawOverride);
  } catch {
    return undefined;
  }
}

export async function readCheckoutView({
  locale,
  currentPath,
  e2eFixtureOverride,
}: {
  locale: AppLocale;
  currentPath: string;
  // Mirrors `readCartView`'s `?e2eFixture=<json>` override: fixture-mode's
  // SSR fetch is server-to-server and cannot be intercepted by
  // `page.route()`, so Playwright specs opt a non-default payload in via the
  // query param instead. Only ever read when `authE2eFixtureMode` is active.
  e2eFixtureOverride?: string | string[] | undefined;
}): Promise<CheckoutViewState> {
  try {
    const payload = runtimeConfig.authE2eFixtureMode
      ? (resolveFixturePayload(e2eFixtureOverride) ?? (await loadCartCheckoutFixture()))
      : await readProtectedCheckoutPayload({ locale, currentPath });
    const preview = mapCartCheckoutResponseDtoToPreview(payload);

    return { status: "ready", preview: mapCheckoutPreviewToPresentation(preview, { locale }) };
  } catch {
    return { status: "error" };
  }
}
