import { http, HttpResponse } from "msw";
import type { RequestHandler } from "msw";

import { createCartCheckoutFixture } from "@/../tests/fixtures/cart/checkout-fixtures";
import { createSingleItemCartFixture } from "@/../tests/fixtures/cart/cart-fixtures";
import { createFullSuccessLoanFixture } from "@/../tests/fixtures/cart/loan-fixtures";

// Cart, checkout, and loan-from-cart handlers mock the same-origin BFF proxy
// routes (`/api/cart*`, `/api/loans/from-cart`), never the real backend base
// URL, because that is what client code actually calls (see
// specs/004-persistent-cart-checkout/research.md #1). Individual tests
// override these defaults with `server.use(...)` for empty/error/mutation
// scenarios.
export const cartHandlers: RequestHandler[] = [
  http.get("/api/cart", () => HttpResponse.json(createSingleItemCartFixture())),
  http.post("/api/cart/items", () => HttpResponse.json({ ok: true })),
  http.delete("/api/cart/items/:itemId", () => HttpResponse.json({ ok: true })),
  http.delete("/api/cart", () => HttpResponse.json({ ok: true })),
  http.get("/api/cart/checkout", () => HttpResponse.json(createCartCheckoutFixture())),
  http.post("/api/loans/from-cart", () => HttpResponse.json(createFullSuccessLoanFixture())),
];
