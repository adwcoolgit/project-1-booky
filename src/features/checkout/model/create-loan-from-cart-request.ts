import { loanFromCartRequestDtoSchema, type LoanFromCartRequestDto } from "@/features/checkout/api/schemas";

// Deliberately accepts only `durationDays`/`borrowDate` — never
// `policyAccepted` — so the request DTO structurally cannot carry
// presentation-only form state into the API request, mirroring
// `createRegisterRequestDto`'s handling of `confirmPassword`.
export function createLoanFromCartRequestDto(
  selectedCartItemIds: readonly number[],
  formInput: { durationDays: 3 | 5 | 10; borrowDate?: string | undefined },
): LoanFromCartRequestDto {
  return loanFromCartRequestDtoSchema.parse({
    itemIds: [...selectedCartItemIds],
    days: formInput.durationDays,
    ...(formInput.borrowDate ? { borrowDate: formInput.borrowDate } : {}),
  });
}
