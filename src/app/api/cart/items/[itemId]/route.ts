import { NextResponse } from "next/server";

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
import { positiveIntegerSchema } from "@/shared/lib/zod/positive-int";

type RemoveCartItemRouteDependencies = {
  executeProtectedServerRequest: typeof executeProtectedServerRequest;
  assertAllowedOrigin: (origin: string | null | undefined) => void;
};

function resolveDependencies(overrides: Partial<RemoveCartItemRouteDependencies>): RemoveCartItemRouteDependencies {
  return {
    executeProtectedServerRequest,
    assertAllowedOrigin,
    ...overrides,
  };
}

export async function processRemoveCartItemRequest(
  itemId: unknown,
  origin: string | null | undefined,
  dependencies: Partial<RemoveCartItemRouteDependencies> = {},
): Promise<ProtectedServerRequestResult<unknown>> {
  const deps = resolveDependencies(dependencies);

  try {
    deps.assertAllowedOrigin(origin);
  } catch {
    return { status: "failure", error: createForbiddenOriginError() };
  }

  const parsedItemId = positiveIntegerSchema.safeParse(itemId);

  if (!parsedItemId.success) {
    return { status: "failure", error: createInvalidRequestError("A valid cart item id is required.") };
  }

  const locale = await readSessionLocale();

  return deps.executeProtectedServerRequest(
    (client) => client.delete(`/cart/items/${parsedItemId.data}`).then((response): unknown => response.data),
    locale,
  );
}

export async function DELETE(request: Request, context: { params: Promise<{ itemId: string }> }) {
  const { itemId } = await context.params;
  const result = await processRemoveCartItemRequest(itemId, request.headers.get("origin"));

  if (result.status === "failure") {
    return mapProtectedRequestErrorToResponse(result.error);
  }

  return NextResponse.json(result.data);
}
