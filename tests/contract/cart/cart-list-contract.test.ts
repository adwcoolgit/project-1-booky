import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { mapCartResponseDtoToServerCart } from "@/entities/cart";
import { createCartBffClient, getCart } from "@/features/cart/api";
import { server } from "@/../tests/setup/msw/server";
import { createEmptyCartFixture, createSingleItemCartFixture } from "@/../tests/fixtures/cart/cart-fixtures";

describe("GET /api/cart transport contract", () => {
  it("maps a populated cart response into rows", async () => {
    const client = createCartBffClient();
    const payload = await getCart(client);

    expect(payload).toEqual(createSingleItemCartFixture());

    const cart = mapCartResponseDtoToServerCart(payload);

    expect(cart.rows).toHaveLength(1);
    expect(cart.itemCount).toBe(1);
  });

  it("maps an empty cart response to zero rows", async () => {
    server.use(http.get("/api/cart", () => HttpResponse.json(createEmptyCartFixture())));

    const client = createCartBffClient();
    const cart = mapCartResponseDtoToServerCart(await getCart(client));

    expect(cart.rows).toHaveLength(0);
    expect(cart.itemCount).toBe(0);
  });

  it("surfaces a retryable error when the BFF route fails", async () => {
    server.use(http.get("/api/cart", () => HttpResponse.text("Cart request failed.", { status: 500 })));

    const client = createCartBffClient();

    await expect(getCart(client)).rejects.toMatchObject({ status: 500 });
  });
});
