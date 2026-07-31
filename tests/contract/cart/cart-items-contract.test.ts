import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { addToCart, createCartBffClient, removeCartItem } from "@/features/cart/api";
import { server } from "@/../tests/setup/msw/server";

describe("POST /api/cart/items and DELETE /api/cart/items/{itemId} transport contract", () => {
  it("adds a book to the cart with only the documented bookId field", async () => {
    let forwardedBody: unknown;

    server.use(
      http.post("/api/cart/items", async ({ request }) => {
        forwardedBody = await request.json();
        return HttpResponse.json({ ok: true });
      }),
    );

    const client = createCartBffClient();

    await addToCart(client, 101);

    expect(forwardedBody).toEqual({ bookId: 101 });
  });

  it("surfaces the documented 400 rejection for out-of-stock/duplicate/not-found", async () => {
    server.use(http.post("/api/cart/items", () => HttpResponse.text("Book not found / out of stock / already in cart", { status: 400 })));

    const client = createCartBffClient();

    await expect(addToCart(client, 999)).rejects.toMatchObject({ status: 400 });
  });

  it("removes a cart item by its positive-integer id", async () => {
    let requestedPath: string | undefined;

    server.use(
      http.delete("/api/cart/items/:itemId", ({ params }) => {
        requestedPath = String(params.itemId);
        return HttpResponse.json({ ok: true });
      }),
    );

    const client = createCartBffClient();

    await removeCartItem(client, 501);

    expect(requestedPath).toBe("501");
  });

  it("surfaces the documented 404 rejection when the cart item is not found", async () => {
    server.use(http.delete("/api/cart/items/:itemId", () => HttpResponse.text("Item not found", { status: 404 })));

    const client = createCartBffClient();

    await expect(removeCartItem(client, 999)).rejects.toMatchObject({ status: 404 });
  });
});
