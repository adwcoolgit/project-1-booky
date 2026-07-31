import { describe, expect, it } from "vitest";

import { createLoanFromCartRequestDto } from "@/features/checkout/model/create-loan-from-cart-request";

describe("createLoanFromCartRequestDto", () => {
  it("builds a request DTO containing only itemIds and days", () => {
    const dto = createLoanFromCartRequestDto([501, 502], { durationDays: 5 });

    expect(dto).toEqual({ itemIds: [501, 502], days: 5 });
    expect(dto).not.toHaveProperty("policyAccepted");
  });

  it("includes borrowDate only when provided", () => {
    const dto = createLoanFromCartRequestDto([501], { durationDays: 3, borrowDate: "2026-08-01" });

    expect(dto).toEqual({ itemIds: [501], days: 3, borrowDate: "2026-08-01" });
  });

  it("never includes policyAccepted even if a caller's form-state object happens to carry the field", () => {
    const formInputWithPolicyField = {
      durationDays: 10,
      policyAccepted: true,
    };

    const dto = createLoanFromCartRequestDto(
      [501],
      formInputWithPolicyField as unknown as { durationDays: 3 | 5 | 10; borrowDate?: string | undefined },
    );

    expect(dto).not.toHaveProperty("policyAccepted");
    expect(Object.keys(dto).sort()).toEqual(["days", "itemIds"]);
  });

  it("never includes policyAccepted when the caller declines the policy", () => {
    const formInputWithPolicyField = {
      durationDays: 3,
      policyAccepted: false,
    };

    const dto = createLoanFromCartRequestDto(
      [501],
      formInputWithPolicyField as unknown as { durationDays: 3 | 5 | 10; borrowDate?: string | undefined },
    );

    expect(dto).not.toHaveProperty("policyAccepted");
  });
});
