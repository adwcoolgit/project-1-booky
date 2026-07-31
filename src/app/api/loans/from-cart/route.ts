import { NextResponse } from "next/server";

import { loanFromCartRequestDtoSchema } from "@/features/checkout/api/schemas";
import {
  executeProtectedServerRequest,
  type ProtectedServerRequestResult,
} from "@/shared/api/server/authenticated-client";
import {
  createForbiddenOriginError,
  createInvalidRequestError,
  mapProtectedRequestErrorToResponse,
} from "@/shared/api/server/protected-route-response";
import { assertAllowedOrigin } from "@/shared/auth/origin";
import { readSessionLocale } from "@/shared/auth/session.server";

type LoanFromCartRouteDependencies = {
  executeProtectedServerRequest: typeof executeProtectedServerRequest;
  assertAllowedOrigin: (origin: string | null | undefined) => void;
};

function resolveDependencies(overrides: Partial<LoanFromCartRouteDependencies>): LoanFromCartRouteDependencies {
  return {
    executeProtectedServerRequest,
    assertAllowedOrigin,
    ...overrides,
  };
}

export async function processLoanFromCartRequest(
  payload: unknown,
  origin: string | null | undefined,
  dependencies: Partial<LoanFromCartRouteDependencies> = {},
): Promise<ProtectedServerRequestResult<unknown>> {
  const deps = resolveDependencies(dependencies);

  try {
    deps.assertAllowedOrigin(origin);
  } catch {
    return { status: "failure", error: createForbiddenOriginError() };
  }

  const parsed = loanFromCartRequestDtoSchema.safeParse(payload);

  if (!parsed.success) {
    return { status: "failure", error: createInvalidRequestError("itemIds required / invalid.") };
  }

  const locale = await readSessionLocale();

  return deps.executeProtectedServerRequest(
    (client) => client.post("/loans/from-cart", parsed.data).then((response): unknown => response.data),
    locale,
  );
}

export async function POST(request: Request) {
  const payload: unknown = await request.json().catch(() => null);
  const result = await processLoanFromCartRequest(payload, request.headers.get("origin"));

  if (result.status === "failure") {
    return mapProtectedRequestErrorToResponse(result.error);
  }

  return NextResponse.json(result.data);
}
