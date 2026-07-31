export { mapLoanFromCartResponseDtoToResult, resolveBorrowConfirmationOutcome } from "@/entities/loan/mapper";
export type {
  BorrowConfirmationOutcome,
  BorrowConfirmationPresentation,
  BorrowConfirmationResult,
  BorrowedLoanPresentation,
  BorrowedLoanSummary,
  FailedCartItem,
  FailedCartItemPresentation,
} from "@/entities/loan/model";
export { mapBorrowConfirmationResultToPresentation } from "@/entities/loan/presentation";
