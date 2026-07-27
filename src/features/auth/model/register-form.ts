import { z } from "zod";

import { localeSchema, type AppLocale } from "@/shared/i18n/config";

export type RegisterFormValidationMessages = {
  required: string;
  emailInvalid: string;
  passwordMin: string;
  passwordMismatch: string;
  policyRequired: string;
};

const defaultValidationMessages: RegisterFormValidationMessages = {
  required: "This field is required.",
  emailInvalid: "Enter a valid email address.",
  passwordMin: "Password must contain at least 8 characters.",
  passwordMismatch: "Passwords do not match.",
  policyRequired: "You must accept the policy before continuing.",
};

function buildRegisterFormSchema(messages: RegisterFormValidationMessages) {
  return z
    .object({
      name: z.string().trim().min(1, { message: messages.required }),
      email: z
        .string()
        .trim()
        .min(1, { message: messages.required })
        .email({ message: messages.emailInvalid }),
      phone: z.string().trim().optional(),
      password: z
        .string()
        .min(1, { message: messages.required })
        .min(8, { message: messages.passwordMin }),
      confirmPassword: z.string().min(1, { message: messages.required }),
      policyAccepted: z.boolean(),
      surfaceLocale: localeSchema,
    })
    .superRefine((value, ctx) => {
      if (!value.policyAccepted) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: messages.policyRequired,
          path: ["policyAccepted"],
        });
      }

      if (value.password !== value.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: messages.passwordMismatch,
          path: ["confirmPassword"],
        });
      }
    });
}

export const registerFormInputSchema = buildRegisterFormSchema(defaultValidationMessages);
export type RegisterFormInput = {
  name: string;
  email: string;
  phone?: string | undefined;
  password: string;
  confirmPassword: string;
  policyAccepted: boolean;
  surfaceLocale: AppLocale;
};

export function createRegisterFormSchema(
  messages: Partial<RegisterFormValidationMessages> = {},
) {
  return buildRegisterFormSchema({
    ...defaultValidationMessages,
    ...messages,
  });
}
