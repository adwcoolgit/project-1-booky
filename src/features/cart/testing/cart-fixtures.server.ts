import "server-only";

export async function loadEmptyCartFixture() {
  const { createEmptyCartFixture } = await import("../../../../tests/fixtures/cart/cart-fixtures");

  return createEmptyCartFixture();
}

export async function loadSingleItemCartFixture() {
  const { createSingleItemCartFixture } = await import("../../../../tests/fixtures/cart/cart-fixtures");

  return createSingleItemCartFixture();
}

export async function loadDuplicateBookCartFixture() {
  const { createDuplicateBookCartFixture } = await import("../../../../tests/fixtures/cart/cart-fixtures");

  return createDuplicateBookCartFixture();
}

export async function loadMixedEligibilityCartFixture() {
  const { createMixedEligibilityCartFixture } = await import("../../../../tests/fixtures/cart/cart-fixtures");

  return createMixedEligibilityCartFixture();
}
