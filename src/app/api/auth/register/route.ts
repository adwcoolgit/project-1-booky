import type { AxiosInstance } from "axios";
import { NextResponse } from "next/server";
import type { ZodError } from "zod";

import { createHttpClient, toHttpError, type HttpError } from "@/shared/api/http-client";
import { assertAllowedOrigin } from "@/shared/auth/origin";
import { getLocalizedAuthPaths } from "@/shared/auth/route-access";
import { getAuthFeatureMessages } from "@/shared/i18n/get-messages";
import { resolveLocale } from "@/shared/i18n/config";
import {
  authMutationFailureSchema,
  registerSuccessResultSchema,
  type AuthMutationFailure,
  type AuthMutationFieldErrors,
  type RegisterSuccessResult,
} from "@/features/auth/model/login-outcome";
import { createRegisterFormSchema, type RegisterFormInput } from "@/features/auth/model/register-form";
import { createRegisterRequestDto } from "@/features/auth/model/register-request";

export type RegisterRouteResult = {
  status: number;
  body: RegisterSuccessResult | AuthMutationFailure;
};

type RegisterRouteDependencies = {
  createClient: (locale: RegisterFormInput["surfaceLocale"]) => AxiosInstance;
  assertAllowedOrigin: (origin: string | null | undefined) => void;
};

function firstFieldErrors(error: ZodError): AuthMutationFieldErrors | undefined {
  const flattened = error.flatten().fieldErrors as Record<string, string[] | undefined>;
  const entries = Object.entries(flattened).flatMap(([field, messages]) => {
    const firstMessage = Array.isArray(messages) ? messages[0] : undefined;

    return firstMessage ? [[field, firstMessage] as const] : [];
  });

  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}

function toFailure(status: number, input: AuthMutationFailure): RegisterRouteResult {
  return {
    status,
    body: authMutationFailureSchema.parse(input),
  };
}

function toTransportFailure(httpError: HttpError, locale: RegisterFormInput["surfaceLocale"]): RegisterRouteResult {
  const messages = getAuthFeatureMessages(locale);

  if (httpError.code === "bad-request") {
    return toFailure(400, {
      status: "error",
      code: "duplicate",
      message: messages.feedback.duplicateEmail,
      fieldErrors: {
        email: messages.feedback.duplicateEmail,
      },
    });
  }

  return toFailure(httpError.status ?? 500, {
    status: "error",
    code: httpError.code === "network" ? "network" : "server-error",
    message: messages.feedback.genericError,
  });
}

function createRegisterSuccess(locale: RegisterFormInput["surfaceLocale"]): RegisterSuccessResult {
  const redirectTo = `${getLocalizedAuthPaths(locale).login}?registered=1`;

  return registerSuccessResultSchema.parse({
    status: "registered",
    redirectTo,
  });
}

export async function processRegisterRequest(
  payload: unknown,
  origin: string | null | undefined,
  dependencies: Partial<RegisterRouteDependencies> = {},
): Promise<RegisterRouteResult> {
  const locale = resolveLocale(
    typeof payload === "object" && payload && "surfaceLocale" in payload && typeof payload.surfaceLocale === "string"
      ? payload.surfaceLocale
      : undefined,
  );
  const messages = getAuthFeatureMessages(locale);
  const deps: RegisterRouteDependencies = {
    createClient: (nextLocale) => createHttpClient(nextLocale),
    assertAllowedOrigin,
    ...dependencies,
  };

  try {
    deps.assertAllowedOrigin(origin);
  } catch {
    return toFailure(403, {
      status: "error",
      code: "forbidden",
      message: messages.feedback.forbidden,
    });
  }

  const parsed = createRegisterFormSchema(messages.validation).safeParse(payload);

  if (!parsed.success) {
    return toFailure(400, {
      status: "error",
      code: "validation",
      message: messages.feedback.invalidSubmission,
      fieldErrors: firstFieldErrors(parsed.error),
    });
  }

  try {
    await deps.createClient(parsed.data.surfaceLocale).post("/auth/register", createRegisterRequestDto(parsed.data));

    return {
      status: 201,
      body: createRegisterSuccess(parsed.data.surfaceLocale),
    };
  } catch (error) {
    return toTransportFailure(toHttpError(error), parsed.data.surfaceLocale);
  }
}

export async function POST(request: Request) {
  const payload: unknown = await request.json().catch(() => null);
  const result = await processRegisterRequest(payload, request.headers.get("origin"));

  return NextResponse.json(result.body, { status: result.status });
}
