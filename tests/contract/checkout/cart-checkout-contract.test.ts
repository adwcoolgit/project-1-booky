import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { mapCartCheckoutResponseDtoToPreview } from "@/entities/checkout";
import { createCheckoutBffClient, getCartCheckout } from "@/features/checkout/api";
import { server } from "@/../tests/setup/msw/server";
import { createCartCheckoutFixture } from "@/../tests/fixtures/cart/checkout-fixtures";

describe("GET /api/cart/checkout transport contract", () => {
  it("maps the checkout preview response into a user and selected rows", async () => {
    const client = createCheckoutBffClient();
    const payload = await getCartCheckout(client);

    expect(payload).toEqual(createCartCheckoutFixture());

    const preview = mapCartCheckoutResponseDtoToPreview(payload);

    expect(preview.user).toEqual({
      name: "Jordan Reader",
      email: "jordan.reader@example.test",
      phone: "+62-812-0000-0000",
    });
    expect(preview.rows).toHaveLength(1);
    expect(preview.rows[0]?.cartItemId).toBe(501);
    expect(preview.rows[0]?.bookId).toBe(101);
  });

  it("defaults to a null user when the checkout response omits user fields", async () => {
    server.use(http.get("/api/cart/checkout", () => HttpResponse.json({ items: [], itemCount: 0 })));

    const client = createCheckoutBffClient();
    const preview = mapCartCheckoutResponseDtoToPreview(await getCartCheckout(client));

    expect(preview.user).toEqual({ name: null, email: null, phone: null });
    expect(preview.rows).toHaveLength(0);
  });

  it("surfaces a retryable error when the BFF route fails", async () => {
    server.use(http.get("/api/cart/checkout", () => HttpResponse.text("Checkout request failed.", { status: 500 })));

    const client = createCheckoutBffClient();

    await expect(getCartCheckout(client)).rejects.toMatchObject({ status: 500 });
  });
});
