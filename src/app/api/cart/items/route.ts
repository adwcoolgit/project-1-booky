import { NextResponse } from "next/server";

import { addToCartRequestDtoSchema } from "@/features/cart/api/schemas";
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

type AddToCartRouteDependencies = {
  executeProtectedServerRequest: typeof executeProtectedServerRequest;
  assertAllowedOrigin: (origin: string | null | undefined) => void;
};

function resolveDependencies(overrides: Partial<AddToCartRouteDependencies>): AddToCartRouteDependencies {
  return {
    executeProtectedServerRequest,
    assertAllowedOrigin,
    ...overrides,
  };
}

export async function processAddToCartRequest(
  payload: unknown,
  origin: string | null | undefined,
  dependencies: Partial<AddToCartRouteDependencies> = {},
): Promise<ProtectedServerRequestResult<unknown>> {
  const deps = resolveDependencies(dependencies);

  try {
    deps.assertAllowedOrigin(origin);
  } catch {
    return { status: "failure", error: createForbiddenOriginError() };
  }

  const parsed = addToCartRequestDtoSchema.safeParse(payload);

  if (!parsed.success) {
    return { status: "failure", error: createInvalidRequestError("A valid bookId is required.") };
  }

  const locale = await readSessionLocale();

  return deps.executeProtectedServerRequest(
    (client) => client.post("/cart/items", parsed.data).then((response): unknown => response.data),
    locale,
  );
}

export async function POST(request: Request) {
  const payload: unknown = await request.json().catch(() => null);
  const result = await processAddToCartRequest(payload, request.headers.get("origin"));

  if (result.status === "failure") {
    return mapProtectedRequestErrorToResponse(result.error);
  }

  return NextResponse.json(result.data);
}
