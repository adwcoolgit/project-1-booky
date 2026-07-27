import { z } from "zod";

import { authSurfaces } from "@/shared/auth/route-access";
import { localeSchema, type AppLocale } from "@/shared/i18n/config";
import type { AuthSurface } from "@/features/auth/config/auth-routes";

export type LoginFormValidationMessages = {
  required: string;
  emailInvalid: string;
  passwordMin: string;
};

const defaultValidationMessages: LoginFormValidationMessages = {
  required: "This field is required.",
  emailInvalid: "Enter a valid email address.",
  passwordMin: "Password must contain at least 8 characters.",
};

function buildLoginFormSchema(messages: LoginFormValidationMessages) {
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, { message: messages.required })
      .email({ message: messages.emailInvalid }),
    password: z
      .string()
      .min(1, { message: messages.required })
      .min(8, { message: messages.passwordMin }),
    surface: z.enum(authSurfaces),
    returnTo: z.string().trim().optional(),
    surfaceLocale: localeSchema,
  });
}

export const loginFormInputSchema = buildLoginFormSchema(defaultValidationMessages);
export type LoginFormInput = {
  email: string;
  password: string;
  surface: AuthSurface;
  returnTo?: string | undefined;
  surfaceLocale: AppLocale;
};

export function createLoginFormSchema(messages: Partial<LoginFormValidationMessages> = {}) {
  return buildLoginFormSchema({
    ...defaultValidationMessages,
    ...messages,
  });
}
