export type CheckoutFormInput = {
  durationDays: 3 | 5 | 10;
  borrowDate?: string | undefined;
  returnAcknowledged: boolean;
  policyAccepted: boolean;
};

export function createDefaultCheckoutFormInput(): CheckoutFormInput {
  return {
    durationDays: 3,
    borrowDate: undefined,
    returnAcknowledged: false,
    policyAccepted: false,
  };
}
