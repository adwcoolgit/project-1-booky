import { describe, expect, it } from "vitest";

import { mapLoanFromCartResponseDtoToResult, resolveBorrowConfirmationOutcome } from "@/entities/loan/mapper";
import {
  createFullFailureLoanFixture,
  createFullSuccessLoanFixture,
  createPartialSuccessLoanFixture,
} from "@/../tests/fixtures/cart/loan-fixtures";

describe("entities/loan mapper", () => {
  it("maps a full-success response to a success outcome with no failed or removed items", () => {
    const result = mapLoanFromCartResponseDtoToResult(createFullSuccessLoanFixture());

    expect(result.succeeded).toHaveLength(1);
    expect(result.failed).toHaveLength(0);
    expect(resolveBorrowConfirmationOutcome(result)).toBe("success");
  });

  it("maps a partial-success response distinctly from full success and full failure", () => {
    const result = mapLoanFromCartResponseDtoToResult(createPartialSuccessLoanFixture());

    expect(result.succeeded).toHaveLength(1);
    expect(result.failed).toHaveLength(1);
    expect(result.removedCartItemIds).toEqual([501]);
    expect(resolveBorrowConfirmationOutcome(result)).toBe("partial");
  });

  it("maps a full-failure response without inventing a successful loan", () => {
    const result = mapLoanFromCartResponseDtoToResult(createFullFailureLoanFixture());

    expect(result.succeeded).toHaveLength(0);
    expect(result.failed).toHaveLength(2);
    expect(resolveBorrowConfirmationOutcome(result)).toBe("failed");
  });

  it("falls back to a null reasonCode when the failed entry has no reason field", () => {
    const result = mapLoanFromCartResponseDtoToResult({
      loans: [],
      failed: [{ cartItemId: 900 }],
      removedFromCart: [],
    });

    expect(result.failed).toEqual([{ cartItemId: 900, reasonCode: null }]);
  });

  it("drops a failed entry that has no resolvable cart item id", () => {
    const result = mapLoanFromCartResponseDtoToResult({
      loans: [],
      failed: [{ reason: "unknown" }],
      removedFromCart: [],
    });

    expect(result.failed).toHaveLength(0);
  });

  it("accepts removedFromCart entries as either bare ids or id-bearing objects", () => {
    const result = mapLoanFromCartResponseDtoToResult({
      loans: [],
      failed: [],
      removedFromCart: [501, { itemId: 502 }],
    });

    expect(result.removedCartItemIds).toEqual([501, 502]);
  });

  it("treats every missing array as empty rather than as absent data", () => {
    const result = mapLoanFromCartResponseDtoToResult({});

    expect(result).toEqual({ succeeded: [], failed: [], removedCartItemIds: [] });
  });
});
