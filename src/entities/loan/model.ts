export type BorrowedLoanSummary = {
  cartItemId: number | null;
  bookTitle: string | null;
  borrowedAt: string | null;
  dueAt: string | null;
  returnByMessage: string | null;
};

export type FailedCartItem = {
  cartItemId: number;
  reasonCode: string | null;
};

export type BorrowConfirmationResult = {
  succeeded: BorrowedLoanSummary[];
  failed: FailedCartItem[];
  removedCartItemIds: number[];
};

export type BorrowConfirmationOutcome = "success" | "partial" | "failed";

export type BorrowedLoanPresentation = {
  cartItemId: number | null;
  bookTitle: string;
  dueDateLabel: string | null;
  returnByMessage: string | null;
};

export type FailedCartItemPresentation = {
  cartItemId: number;
  reasonLabel: string;
};

export type BorrowConfirmationPresentation = {
  outcome: BorrowConfirmationOutcome;
  succeeded: BorrowedLoanPresentation[];
  failed: FailedCartItemPresentation[];
  removedCartItemIds: number[];
};
