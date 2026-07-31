import "server-only";

export async function loadCartCheckoutFixture() {
  const { createCartCheckoutFixture } = await import("../../../../tests/fixtures/cart/checkout-fixtures");

  return createCartCheckoutFixture();
}
