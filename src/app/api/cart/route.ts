import { NextResponse } from "next/server";

import {
  executeProtectedServerRequest,
  type ProtectedServerRequestResult,
} from "@/shared/api/server/authenticated-client";
import { createForbiddenOriginError, mapProtectedRequestErrorToResponse } from "@/shared/api/server/protected-route-response";
import { assertAllowedOrigin } from "@/shared/auth/origin";
import { readSessionLocale } from "@/shared/auth/session.server";

type CartRouteDependencies = {
  executeProtectedServerRequest: typeof executeProtectedServerRequest;
  assertAllowedOrigin: (origin: string | null | undefined) => void;
};

function resolveDependencies(overrides: Partial<CartRouteDependencies>): CartRouteDependencies {
  return {
    executeProtectedServerRequest,
    assertAllowedOrigin,
    ...overrides,
  };
}

export async function processCartGetRequest(
  dependencies: Partial<CartRouteDependencies> = {},
): Promise<ProtectedServerRequestResult<unknown>> {
  const deps = resolveDependencies(dependencies);
  const locale = await readSessionLocale();

  return deps.executeProtectedServerRequest(
    (client) => client.get("/cart").then((response): unknown => response.data),
    locale,
  );
}

export async function processCartClearRequest(
  origin: string | null | undefined,
  dependencies: Partial<CartRouteDependencies> = {},
): Promise<ProtectedServerRequestResult<unknown>> {
  const deps = resolveDependencies(dependencies);

  try {
    deps.assertAllowedOrigin(origin);
  } catch {
    return { status: "failure", error: createForbiddenOriginError() };
  }

  const locale = await readSessionLocale();

  return deps.executeProtectedServerRequest(
    (client) => client.delete("/cart").then((response): unknown => response.data),
    locale,
  );
}

export async function GET() {
  const result = await processCartGetRequest();

  if (result.status === "failure") {
    return mapProtectedRequestErrorToResponse(result.error);
  }

  return NextResponse.json(result.data);
}

export async function DELETE(request: Request) {
  const result = await processCartClearRequest(request.headers.get("origin"));

  if (result.status === "failure") {
    return mapProtectedRequestErrorToResponse(result.error);
  }

  return NextResponse.json(result.data);
}
