import { describe, expect, it } from "vitest";

import { cartQueryKeys } from "@/features/cart/model/cart-query-keys";

describe("cartQueryKeys", () => {
  it("produces stable, distinct keys for cart and checkout", () => {
    expect(cartQueryKeys.current()).toEqual(["cart", "current"]);
    expect(cartQueryKeys.checkout()).toEqual(["cart", "checkout"]);
    expect(cartQueryKeys.current()).not.toEqual(cartQueryKeys.checkout());
  });

  it("returns a fresh, equal-by-value key on every call", () => {
    expect(cartQueryKeys.current()).toEqual(cartQueryKeys.current());
    expect(cartQueryKeys.current()).not.toBe(cartQueryKeys.current());
  });
});
