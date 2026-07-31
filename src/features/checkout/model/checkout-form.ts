import { z } from "zod";

import { cartCheckoutDurationDaysSchema } from "@/features/checkout/api/schemas";

export type CheckoutFormValidationMessages = {
  policyRequired: string;
};

const defaultValidationMessages: CheckoutFormValidationMessages = {
  policyRequired: "You must accept the borrowing policy before continuing.",
};

const localDatePattern = /^\d{4}-\d{2}-\d{2}$/;

function buildCheckoutFormSchema(messages: CheckoutFormValidationMessages) {
  return z
    .object({
      durationDays: cartCheckoutDurationDaysSchema,
      borrowDate: z.union([z.string().regex(localDatePattern), z.literal("")]).optional(),
      policyAccepted: z.boolean(),
    })
    .superRefine((value, ctx) => {
      if (!value.policyAccepted) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: messages.policyRequired,
          path: ["policyAccepted"],
        });
      }
    });
}

export const checkoutFormInputSchema = buildCheckoutFormSchema(defaultValidationMessages);

export type CheckoutFormInput = {
  durationDays: 3 | 5 | 10;
  borrowDate?: string | undefined;
  policyAccepted: boolean;
};

export function createCheckoutFormSchema(messages: Partial<CheckoutFormValidationMessages> = {}) {
  return buildCheckoutFormSchema({ ...defaultValidationMessages, ...messages });
}

export function createDefaultCheckoutFormInput(): CheckoutFormInput {
  return {
    durationDays: 3,
    borrowDate: undefined,
    policyAccepted: false,
  };
}
