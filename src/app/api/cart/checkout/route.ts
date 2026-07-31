import { NextResponse } from "next/server";

import {
  executeProtectedServerRequest,
  type ProtectedServerRequestResult,
} from "@/shared/api/server/authenticated-client";
import { mapProtectedRequestErrorToResponse } from "@/shared/api/server/protected-route-response";
import { readSessionLocale } from "@/shared/auth/session.server";

type CartCheckoutRouteDependencies = {
  executeProtectedServerRequest: typeof executeProtectedServerRequest;
};

export async function processCartCheckoutRequest(
  dependencies: Partial<CartCheckoutRouteDependencies> = {},
): Promise<ProtectedServerRequestResult<unknown>> {
  const deps: CartCheckoutRouteDependencies = {
    executeProtectedServerRequest,
    ...dependencies,
  };
  const locale = await readSessionLocale();

  return deps.executeProtectedServerRequest(
    (client) => client.get("/cart/checkout").then((response): unknown => response.data),
    locale,
  );
}

export async function GET() {
  const result = await processCartCheckoutRequest();

  if (result.status === "failure") {
    return mapProtectedRequestErrorToResponse(result.error);
  }

  return NextResponse.json(result.data);
}
