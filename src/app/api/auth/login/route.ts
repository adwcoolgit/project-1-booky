import type { AxiosInstance } from "axios";
import { NextResponse } from "next/server";
import type { ZodError } from "zod";

import { createHttpClient, toHttpError, type HttpError } from "@/shared/api/http-client";
import { assertAllowedOrigin } from "@/shared/auth/origin";
import { sanitizeReturnTo } from "@/shared/auth/return-to";
import { writeSessionEnvelope } from "@/shared/auth/session.server";
import { getAuthFeatureMessages } from "@/shared/i18n/get-messages";
import { resolveLocale } from "@/shared/i18n/config";
import { mapLoginResponseToSessionEnvelope, mapLoginResponseToSessionUser } from "@/entities/session/mapper";
import { createLoginRequestDto } from "@/features/auth/model/login-request";
import { createLoginFormSchema, type LoginFormInput } from "@/features/auth/model/login-form";
import {
  authMutationFailureSchema,
  loginSuccessResultSchema,
  resolvePostLoginRedirect,
  type AuthMutationFailure,
  type AuthMutationFieldErrors,
  type LoginSuccessResult,
} from "@/features/auth/model/login-outcome";
import { parseLoginResponseDto } from "@/features/auth/model/login-response";
import type { SessionEnvelope } from "@/shared/auth/session-schema";

export type LoginRouteResult = {
  status: number;
  body: LoginSuccessResult | AuthMutationFailure;
  sessionEnvelope?: SessionEnvelope | undefined;
};

type LoginRouteDependencies = {
  createClient: (locale: LoginFormInput["surfaceLocale"]) => AxiosInstance;
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

function toFailure(status: number, input: AuthMutationFailure): LoginRouteResult {
  return {
    status,
    body: authMutationFailureSchema.parse(input),
  };
}

function toTransportFailure(httpError: HttpError, locale: LoginFormInput["surfaceLocale"]): LoginRouteResult {
  const messages = getAuthFeatureMessages(locale);

  if (httpError.code === "unauthenticated") {
    return toFailure(401, {
      status: "error",
      code: "unauthorized",
      message: messages.feedback.unauthorized,
    });
  }

  return toFailure(httpError.status ?? 500, {
    status: "error",
    code: httpError.code === "network" ? "network" : "server-error",
    message: messages.feedback.genericError,
  });
}

export async function processLoginRequest(
  payload: unknown,
  origin: string | null | undefined,
  dependencies: Partial<LoginRouteDependencies> = {},
): Promise<LoginRouteResult> {
  const locale = resolveLocale(
    typeof payload === "object" && payload && "surfaceLocale" in payload && typeof payload.surfaceLocale === "string"
      ? payload.surfaceLocale
      : undefined,
  );
  const messages = getAuthFeatureMessages(locale);
  const deps: LoginRouteDependencies = {
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

  const parsed = createLoginFormSchema(messages.validation).safeParse(payload);

  if (!parsed.success) {
    return toFailure(400, {
      status: "error",
      code: "validation",
      message: messages.feedback.invalidSubmission,
      fieldErrors: firstFieldErrors(parsed.error),
    });
  }

  try {
    const response = await deps.createClient(parsed.data.surfaceLocale).post(
      "/auth/login",
      createLoginRequestDto(parsed.data),
    );
    const loginResponse = parseLoginResponseDto(response.data);
    const user = mapLoginResponseToSessionUser(loginResponse);

    if (parsed.data.surface === "admin" && user.role !== "ADMIN") {
      return toFailure(403, {
        status: "error",
        code: "surface-denied",
        message: messages.feedback.adminDenied,
      });
    }

    const sessionEnvelope = mapLoginResponseToSessionEnvelope(loginResponse, parsed.data.surfaceLocale);
    const redirectTo = resolvePostLoginRedirect({
      locale: parsed.data.surfaceLocale,
      role: user.role,
      returnTo: sanitizeReturnTo(parsed.data.returnTo, undefined, parsed.data.surfaceLocale),
    });

    return {
      status: 200,
      body: loginSuccessResultSchema.parse({
        status: "authenticated",
        redirectTo,
        user,
      }),
      sessionEnvelope,
    };
  } catch (error) {
    return toTransportFailure(toHttpError(error), parsed.data.surfaceLocale);
  }
}

export async function POST(request: Request) {
  const payload: unknown = await request.json().catch(() => null);
  const result = await processLoginRequest(payload, request.headers.get("origin"));

  if (result.sessionEnvelope) {
    await writeSessionEnvelope(result.sessionEnvelope);
  }

  return NextResponse.json(result.body, { status: result.status });
}

