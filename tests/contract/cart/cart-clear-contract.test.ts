import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { clearCart, createCartBffClient } from "@/features/cart/api";
import { server } from "@/../tests/setup/msw/server";

describe("DELETE /api/cart transport contract", () => {
  it("clears the cart", async () => {
    let called = false;

    server.use(
      http.delete("/api/cart", () => {
        called = true;
        return HttpResponse.json({ ok: true });
      }),
    );

    const client = createCartBffClient();

    await clearCart(client);

    expect(called).toBe(true);
  });

  it("surfaces a retryable error when the clear request fails", async () => {
    server.use(http.delete("/api/cart", () => HttpResponse.text("failure", { status: 500 })));

    const client = createCartBffClient();

    await expect(clearCart(client)).rejects.toMatchObject({ status: 500 });
  });
});
