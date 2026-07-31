import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { mapLoanFromCartResponseDtoToResult, resolveBorrowConfirmationOutcome } from "@/entities/loan";
import { confirmLoanFromCart, createCheckoutBffClient } from "@/features/checkout/api";
import { server } from "@/../tests/setup/msw/server";
import {
  createFullFailureLoanFixture,
  createFullSuccessLoanFixture,
  createPartialSuccessLoanFixture,
} from "@/../tests/fixtures/cart/loan-fixtures";

describe("POST /api/loans/from-cart transport contract", () => {
  it("maps a full-success response into a success outcome", async () => {
    const client = createCheckoutBffClient();
    const payload = await confirmLoanFromCart(client, { itemIds: [501], days: 5 });

    expect(payload).toEqual(createFullSuccessLoanFixture());

    const result = mapLoanFromCartResponseDtoToResult(payload);

    expect(resolveBorrowConfirmationOutcome(result)).toBe("success");
    expect(result.succeeded).toHaveLength(1);
    expect(result.succeeded[0]?.cartItemId).toBe(501);
    expect(result.succeeded[0]?.bookTitle).toBe("The Left Hand of Darkness");
    expect(result.failed).toHaveLength(0);
  });

  it("sends only the documented fields, never policyAccepted", async () => {
    let capturedBody: unknown;

    server.use(
      http.post("/api/loans/from-cart", async ({ request }) => {
        capturedBody = await request.json();

        return HttpResponse.json(createFullSuccessLoanFixture());
      }),
    );

    const client = createCheckoutBffClient();

    await confirmLoanFromCart(client, { itemIds: [501], days: 5, borrowDate: "2026-08-01" });

    expect(capturedBody).toEqual({ itemIds: [501], days: 5, borrowDate: "2026-08-01" });
    expect(capturedBody).not.toHaveProperty("policyAccepted");
  });

  it("surfaces a retryable error when the BFF route fails", async () => {
    server.use(http.post("/api/loans/from-cart", () => HttpResponse.text("Loan request failed.", { status: 500 })));

    const client = createCheckoutBffClient();

    await expect(confirmLoanFromCart(client, { itemIds: [501] })).rejects.toMatchObject({ status: 500 });
  });

  it("maps a partial-success response into a partial outcome with succeeded, failed, and removed groups", async () => {
    server.use(http.post("/api/loans/from-cart", () => HttpResponse.json(createPartialSuccessLoanFixture())));

    const client = createCheckoutBffClient();
    const payload = await confirmLoanFromCart(client, { itemIds: [501, 503] });
    const result = mapLoanFromCartResponseDtoToResult(payload);

    expect(resolveBorrowConfirmationOutcome(result)).toBe("partial");
    expect(result.succeeded).toHaveLength(1);
    expect(result.succeeded[0]?.cartItemId).toBe(501);
    expect(result.failed).toHaveLength(1);
    expect(result.failed[0]).toEqual({ cartItemId: 503, reasonCode: "out-of-stock" });
    expect(result.removedCartItemIds).toEqual([501]);
  });

  it("maps a full-failure response into a failed outcome distinct from success and partial", async () => {
    server.use(http.post("/api/loans/from-cart", () => HttpResponse.json(createFullFailureLoanFixture())));

    const client = createCheckoutBffClient();
    const payload = await confirmLoanFromCart(client, { itemIds: [503, 504] });
    const result = mapLoanFromCartResponseDtoToResult(payload);

    expect(resolveBorrowConfirmationOutcome(result)).toBe("failed");
    expect(result.succeeded).toHaveLength(0);
    expect(result.failed).toHaveLength(2);
    expect(result.removedCartItemIds).toHaveLength(0);
  });
});
