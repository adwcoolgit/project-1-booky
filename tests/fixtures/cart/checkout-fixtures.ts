import { cartItemEligibleFixture } from "@/../tests/fixtures/cart/cart-fixtures";

export function createCartCheckoutFixture() {
  return Object.freeze({
    user: {
      name: "Jordan Reader",
      email: "jordan.reader@example.test",
      phone: "+62-812-0000-0000",
    },
    items: [cartItemEligibleFixture],
    itemCount: 1,
  });
}
