import "server-only";

import { redirect } from "next/navigation";

import { mapCartResponseDtoToServerCart, mapServerCartToPresentation } from "@/entities/cart";
import type { ServerCartPresentation } from "@/entities/cart";
import { loadSingleItemCartFixture } from "@/features/cart/testing/cart-fixtures.server";
import { executeProtectedServerRequest } from "@/shared/api/server/authenticated-client";
import { resolveProtectedRequestFailure } from "@/shared/auth/guards";
import { runtimeConfig } from "@/shared/config/runtime";
import type { AppLocale } from "@/shared/i18n/config";

export type CartViewState =
  | { status: "error" }
  | { status: "ready"; cart: ServerCartPresentation };

async function readProtectedCartPayload({
  locale,
  currentPath,
}: {
  locale: AppLocale;
  currentPath: string;
}): Promise<unknown> {
  const result = await executeProtectedServerRequest(
    (client) => client.get("/cart").then((response): unknown => response.data),
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

export async function readCartView({
  locale,
  currentPath,
  e2eFixtureOverride,
}: {
  locale: AppLocale;
  currentPath: string;
  // Lets Playwright E2E specs control the server-prefetched fixture payload
  // via a `?e2eFixture=<json>` query param, since fixture mode's SSR fetch
  // happens server-to-server and cannot be intercepted by `page.route()`.
  // Only ever read when `authE2eFixtureMode` is active; never reachable in
  // production.
  e2eFixtureOverride?: string | string[] | undefined;
}): Promise<CartViewState> {
  try {
    const payload = runtimeConfig.authE2eFixtureMode
      ? (resolveFixturePayload(e2eFixtureOverride) ?? (await loadSingleItemCartFixture()))
      : await readProtectedCartPayload({ locale, currentPath });
    const cart = mapCartResponseDtoToServerCart(payload);

    return {
      status: "ready",
      cart: mapServerCartToPresentation(cart, { locale }),
    };
  } catch {
    return { status: "error" };
  }
}
