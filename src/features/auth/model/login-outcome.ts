import { z } from "zod";

import { resolveAuthorizedDestination } from "@/entities/session/access-decision";
import { sessionUserSchema, type SessionUser } from "@/entities/session/mapper";
import { getLocalizedAuthPaths } from "@/shared/auth/route-access";
import type { SanitizedReturnDestination } from "@/shared/auth/return-to";
import type { AppLocale } from "@/shared/i18n/config";

export const authMutationErrorCodeSchema = z.enum([
  "validation",
  "duplicate",
  "unauthorized",
  "surface-denied",
  "forbidden",
  "network",
  "server-error",
]);
export type AuthMutationErrorCode = z.infer<typeof authMutationErrorCodeSchema>;

export const authMutationFieldErrorsSchema = z.record(z.string(), z.string());
export type AuthMutationFieldErrors = z.infer<typeof authMutationFieldErrorsSchema>;

export const authMutationFailureSchema = z.object({
  status: z.literal("error"),
  code: authMutationErrorCodeSchema,
  message: z.string().min(1),
  fieldErrors: authMutationFieldErrorsSchema.optional(),
});
export type AuthMutationFailure = z.infer<typeof authMutationFailureSchema>;

export const registerSuccessResultSchema = z.object({
  status: z.literal("registered"),
  redirectTo: z.string().min(1),
});
export type RegisterSuccessResult = z.infer<typeof registerSuccessResultSchema>;

export const loginSuccessResultSchema = z.object({
  status: z.literal("authenticated"),
  redirectTo: z.string().min(1),
  user: sessionUserSchema,
});
export type LoginSuccessResult = z.infer<typeof loginSuccessResultSchema>;

export const logoutSuccessResultSchema = z.object({
  status: z.literal("logged-out"),
  redirectTo: z.string().min(1),
});
export type LogoutSuccessResult = z.infer<typeof logoutSuccessResultSchema>;

export type AuthFeedbackState =
  | { tone: "error"; message: string }
  | { tone: "success"; message: string }
  | { tone: "info"; message: string };

export function parseAuthMutationFailure(value: unknown): AuthMutationFailure | null {
  const parsed = authMutationFailureSchema.safeParse(value);

  return parsed.success ? parsed.data : null;
}

export function parseRegisterSuccessResult(value: unknown): RegisterSuccessResult {
  return registerSuccessResultSchema.parse(value);
}

export function parseLoginSuccessResult(value: unknown): LoginSuccessResult {
  return loginSuccessResultSchema.parse(value);
}

export function parseLogoutSuccessResult(value: unknown): LogoutSuccessResult {
  return logoutSuccessResultSchema.parse(value);
}

export function resolvePostLoginRedirect({
  locale,
  role,
  returnTo,
}: {
  locale: AppLocale;
  role: SessionUser["role"];
  returnTo: SanitizedReturnDestination | null;
}): string {
  const paths = getLocalizedAuthPaths(locale);

  return resolveAuthorizedDestination({
    role,
    returnTo,
    userHomePath: paths.userHome,
    adminHomePath: paths.adminHome,
  });
}
